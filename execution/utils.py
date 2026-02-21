"""
Shared utilities for execution scripts.

Provides environment loading, logging setup, Google Sheets helpers,
email sending, and Slack notifications.
"""

import json
import logging
import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from urllib.request import Request, urlopen

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TMP_DIR = PROJECT_ROOT / ".tmp"


def load_env(path: Path | None = None) -> dict[str, str]:
    """Load .env file into os.environ and return the loaded pairs."""
    env_path = path or PROJECT_ROOT / ".env"
    loaded: dict[str, str] = {}
    if not env_path.exists():
        return loaded
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            os.environ.setdefault(key, value)
            loaded[key] = value
    return loaded


def env(key: str, default: str | None = None) -> str:
    """Get an environment variable or raise if missing and no default."""
    val = os.environ.get(key, default)
    if val is None:
        raise EnvironmentError(f"Missing required environment variable: {key}")
    return val


def ensure_tmp() -> Path:
    """Ensure .tmp/ directory exists and return its path."""
    TMP_DIR.mkdir(exist_ok=True)
    return TMP_DIR


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------


def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """Create a consistently-formatted logger."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            logging.Formatter("[%(asctime)s] %(name)s %(levelname)s: %(message)s")
        )
        logger.addHandler(handler)
    logger.setLevel(level)
    return logger


# ---------------------------------------------------------------------------
# Google Sheets (via service account or OAuth)
# ---------------------------------------------------------------------------


def get_google_creds():
    """Return google.oauth2 credentials, refreshing if needed.

    Requires google-auth, google-auth-oauthlib, google-auth-httplib2.
    """
    from google.auth.transport.requests import Request as GRequest
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow

    SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/presentations",
    ]
    creds = None
    token_path = PROJECT_ROOT / env("GOOGLE_TOKEN_PATH", "token.json")
    creds_path = PROJECT_ROOT / env("GOOGLE_CREDENTIALS_PATH", "credentials.json")

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(GRequest())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), SCOPES)
            creds = flow.run_local_server(port=0)
        token_path.write_text(creds.to_json())

    return creds


def read_sheet(spreadsheet_id: str, range_name: str) -> list[list[str]]:
    """Read values from a Google Sheet."""
    from googleapiclient.discovery import build

    creds = get_google_creds()
    service = build("sheets", "v4", credentials=creds)
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    return result.get("values", [])


def update_sheet(
    spreadsheet_id: str, range_name: str, values: list[list[str]]
) -> dict:
    """Write values to a Google Sheet."""
    from googleapiclient.discovery import build

    creds = get_google_creds()
    service = build("sheets", "v4", credentials=creds)
    body = {"values": values}
    result = (
        service.spreadsheets()
        .values()
        .update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption="USER_ENTERED",
            body=body,
        )
        .execute()
    )
    return result


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------


def send_email(to: str, subject: str, body_html: str) -> None:
    """Send an email via SMTP."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = env("EMAIL_FROM", env("SMTP_USER"))
    msg["To"] = to
    msg.attach(MIMEText(body_html, "html"))

    with smtplib.SMTP(env("SMTP_HOST", "smtp.gmail.com"), int(env("SMTP_PORT", "587"))) as server:
        server.starttls()
        server.login(env("SMTP_USER"), env("SMTP_PASSWORD"))
        server.sendmail(msg["From"], [to], msg.as_string())


# ---------------------------------------------------------------------------
# Slack
# ---------------------------------------------------------------------------


def notify_slack(message: str) -> None:
    """Post a message to Slack via incoming webhook."""
    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return  # Slack not configured, skip silently
    data = json.dumps({"text": message}).encode()
    req = Request(webhook_url, data=data, headers={"Content-Type": "application/json"})
    urlopen(req)
