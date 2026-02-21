"""
Modal webhook dispatcher.

Each incoming request is routed to a directive based on the slug → directive
mapping in webhooks.json. The directive defines which tools are available
and what logic to execute.

Deploy:
    modal deploy execution/modal_webhook.py

Endpoints:
    GET  /list-webhooks          — List all registered webhooks
    POST /directive?slug={slug}  — Execute a directive by slug
    POST /test-email             — Send a test email
"""

import json
import os
import traceback
from pathlib import Path

import modal

# ---------------------------------------------------------------------------
# Modal app setup
# ---------------------------------------------------------------------------

app = modal.App("claude-orchestrator")

# Mount project files into the Modal container
project_mount = modal.Mount.from_local_dir(
    local_path=Path(__file__).resolve().parent.parent,
    remote_path="/root/project",
    condition=lambda path: not any(
        ex in path for ex in [".tmp", "__pycache__", ".git", "venv", ".venv"]
    ),
)

image = modal.Image.debian_slim(python_version="3.12").pip_install(
    "google-api-python-client",
    "google-auth",
    "google-auth-oauthlib",
    "google-auth-httplib2",
)


def _load_webhooks() -> dict:
    """Load webhook registry."""
    wh_path = Path("/root/project/execution/webhooks.json")
    if not wh_path.exists():
        return {"webhooks": {}}
    with open(wh_path) as f:
        return json.load(f)


def _load_env():
    """Load .env into os.environ inside the Modal container."""
    env_path = Path("/root/project/.env")
    if not env_path.exists():
        return
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def _notify_slack(message: str):
    """Best-effort Slack notification."""
    import urllib.request

    url = os.environ.get("SLACK_WEBHOOK_URL")
    if not url:
        return
    data = json.dumps({"text": message}).encode()
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(req)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Tool registry — only these functions are available to webhook directives
# ---------------------------------------------------------------------------

AVAILABLE_TOOLS = {}


def _register_tools():
    """Import and register the tools that webhook directives can use."""
    import sys
    sys.path.insert(0, "/root/project")
    from execution.utils import read_sheet, send_email, update_sheet

    AVAILABLE_TOOLS["send_email"] = send_email
    AVAILABLE_TOOLS["read_sheet"] = read_sheet
    AVAILABLE_TOOLS["update_sheet"] = update_sheet


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.function(image=image, mounts=[project_mount])
@modal.web_endpoint(method="GET")
def list_webhooks():
    """Return all registered webhooks."""
    data = _load_webhooks()
    return {
        "webhooks": [
            {"slug": slug, **meta}
            for slug, meta in data.get("webhooks", {}).items()
        ]
    }


@app.function(image=image, mounts=[project_mount], timeout=300)
@modal.web_endpoint(method="POST")
def directive(slug: str):
    """Execute a webhook directive by slug."""
    _load_env()
    _register_tools()

    registry = _load_webhooks()
    webhooks = registry.get("webhooks", {})

    if slug not in webhooks:
        _notify_slack(f":x: Webhook `{slug}` not found")
        return {"error": f"Unknown webhook slug: {slug}", "available": list(webhooks.keys())}

    meta = webhooks[slug]
    directive_file = meta.get("directive")
    allowed_tools = set(meta.get("tools", []))

    # Read the directive markdown
    directive_path = Path(f"/root/project/directives/{directive_file}")
    if not directive_path.exists():
        _notify_slack(f":x: Directive file `{directive_file}` not found for `{slug}`")
        return {"error": f"Directive file not found: {directive_file}"}

    directive_content = directive_path.read_text()

    # Build scoped tool dict
    scoped_tools = {k: v for k, v in AVAILABLE_TOOLS.items() if k in allowed_tools}

    _notify_slack(f":gear: Executing webhook `{slug}` (directive: `{directive_file}`)")

    try:
        # Execute the directive's Python entry point if specified
        entry_script = meta.get("entry_script")
        if entry_script:
            import importlib.util

            spec = importlib.util.spec_from_file_location(
                "webhook_entry", f"/root/project/execution/{entry_script}"
            )
            mod = importlib.util.module_from_spec(spec)
            mod.TOOLS = scoped_tools
            mod.DIRECTIVE = directive_content
            spec.loader.exec_module(mod)

            if hasattr(mod, "run"):
                result = mod.run()
            else:
                result = {"status": "ok", "note": "Module loaded but no run() found"}
        else:
            result = {
                "status": "ok",
                "directive": directive_file,
                "tools_available": list(scoped_tools.keys()),
                "note": "No entry_script specified — directive loaded but no code executed",
            }

        _notify_slack(f":white_check_mark: Webhook `{slug}` completed successfully")
        return result

    except Exception as e:
        tb = traceback.format_exc()
        _notify_slack(f":x: Webhook `{slug}` failed:\n```{tb}```")
        return {"error": str(e), "traceback": tb}


@app.function(image=image, mounts=[project_mount])
@modal.web_endpoint(method="POST")
def test_email():
    """Send a test email to verify SMTP configuration."""
    _load_env()
    _register_tools()

    import sys
    sys.path.insert(0, "/root/project")
    from execution.utils import send_email

    try:
        to = os.environ.get("SMTP_USER", "")
        send_email(
            to=to,
            subject="VietAgent Test Email",
            body_html="<h2>It works!</h2><p>Your email configuration is correct.</p>",
        )
        _notify_slack(f":email: Test email sent to {to}")
        return {"status": "ok", "sent_to": to}
    except Exception as e:
        _notify_slack(f":x: Test email failed: {e}")
        return {"error": str(e)}
