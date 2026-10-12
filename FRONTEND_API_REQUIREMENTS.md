# Frontend API requirements and contract status

This list is based on the repository's current `docs/API_SPEC.md` and `docs/CONTRACTS.md`.

## Defined today

### `POST /v1/reason`

Request:
```json
{
  "conversation_id": "uuid",
  "task_id": "uuid",
  "target_tab_id": "tab-2",
  "task": "Summarize this page",
  "context": {
    "page_title": "Example page",
    "url_sanitized": "https://example.com/article",
    "elements": [
      { "id": 7, "type": "input", "label": "Email", "value": "[EMAIL_1]" }
    ],
    "image_included": false
  }
}
```

Response:
```json
{
  "action_id": "uuid",
  "action": "ask_user",
  "element_id": null,
  "value_ref": null,
  "reason": "Please confirm the next step",
  "confidence": 0.94
}
```

The action kinds listed by the spec are `click`, `type`, `scroll`, `select`, `wait`, `done`, `fail`, and `ask_user`. The local runtime must validate action schema, target-tab ownership, element IDs against current perception, `value_ref` against a local profile store, sensitive literals, and action safety before execution.

## Required clarification / missing API surface

| Frontend capability | Current API status | Recommendation |
|---|---|---|
| Persistent conversation list/detail | Not defined | Specify local-only storage contract or approved authenticated endpoints before shipping cloud sync. |
| Search, rename, delete, clear history | PRD asks for these, but API spec has no endpoints | Define ownership, retention, delete semantics, and privacy requirements first. |
| Agent status and task progress | `TabState`/`AgentTask` contracts exist, no endpoint/event transport | Define polling or event stream contract; include sequence IDs and terminal states. |
| Pause / resume / stop | Mentioned in PRD, not in API spec | Specify local runtime messages and idempotent transitions; browser action safety stays local. |
| Target-tab list/current tab state | Chrome APIs can supply local tab metadata; no backend endpoint needed for basic selection | Keep tab inventory in the extension; define only the frontend-to-background message contract. |
| Agent lock/unlock lifecycle | `TabState.locked` field exists, no formal operations contract | Define background/executor handshake; never treat UI-only lock state as enforcement. |
| Voice transcription/synthesis | Not defined | Prefer browser-local speech APIs where feasible; document permissions, fallback, and audio privacy before external service integration. |
| Settings persistence | Not defined | Specify local `chrome.storage` keys/defaults first; avoid cloud settings until auth/privacy are approved. |
| Authentication/session expiry | Not defined | Define before connecting any protected backend endpoints. |
| API health/version/capabilities | Not defined | Consider `GET /health` and version/capability metadata to drive honest connection status. |

## Privacy invariants for every adapter
- Only sanitized context may cross the local/server boundary.
- Raw screenshots, raw DOM, and sensitive values must remain local.
- Run independent leak scanning immediately before network transmission.
- Never put model/provider/API secrets in extension source or `.env` files that are committed.
- The mock adapter must remain opt-in and visually distinguishable from real API responses.
