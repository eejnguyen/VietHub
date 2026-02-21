# Directive: Add a Webhook

## Goal
Register a new event-driven webhook that maps an HTTP endpoint to a directive with scoped tool access.

## When to Use
User says something like "add a webhook that..." or "create an endpoint for..."

## Steps

### 1. Create the directive file
Create a new markdown file in `directives/` describing what the webhook should do:
- What triggers it (the HTTP POST body expected)
- What tools it needs (from: `send_email`, `read_sheet`, `update_sheet`)
- What the expected output/side effects are
- Edge cases and error handling

Example: `directives/weekly_report_email.md`

### 2. (Optional) Create an entry script
If the webhook needs custom Python logic, create a script in `execution/`:
- The script will receive `TOOLS` dict and `DIRECTIVE` string as module-level variables
- Must define a `run()` function that returns a result dict
- Use only the tools provided via `TOOLS` — do not import additional APIs

Example: `execution/weekly_report_email.py`

### 3. Register in webhooks.json
Add an entry to `execution/webhooks.json`:

```json
{
  "webhooks": {
    "weekly-report": {
      "directive": "weekly_report_email.md",
      "entry_script": "weekly_report_email.py",
      "tools": ["read_sheet", "send_email"],
      "description": "Sends weekly report email from sheet data"
    }
  }
}
```

Fields:
- `directive` (required): Filename in `directives/`
- `entry_script` (optional): Filename in `execution/` — if omitted, the webhook just loads the directive but runs no code
- `tools` (required): Array of tool names this webhook can use
- `description` (required): Human-readable description

### 4. Deploy
```bash
modal deploy execution/modal_webhook.py
```

### 5. Test
```bash
curl -X POST "https://<your-modal-url>/directive?slug=weekly-report"
```

Check Slack for the activity stream.

## Available Tools
| Tool | Signature | Description |
|------|-----------|-------------|
| `send_email` | `send_email(to, subject, body_html)` | Send an HTML email via SMTP |
| `read_sheet` | `read_sheet(spreadsheet_id, range_name) → list[list[str]]` | Read values from Google Sheet |
| `update_sheet` | `update_sheet(spreadsheet_id, range_name, values) → dict` | Write values to Google Sheet |

## Edge Cases
- If `SLACK_WEBHOOK_URL` is not set, Slack notifications are silently skipped
- If SMTP is not configured, `send_email` will raise — handle gracefully in your entry script
- Webhook timeout is 300 seconds (5 min) — long-running tasks should be async

## Learnings
_(Updated as issues are discovered)_
