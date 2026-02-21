# Base44 App API Reference

## Base URL

```
https://app.base44.com/api/apps/{APP_ID}/entities/{Entity}
```

## Authentication

Credentials are stored in `.claude/marketing/api-config.json` (gitignored, per-user).

```json
{
  "app_id": "your-app-id",
  "api_key": "your-api-key"
}
```

**Reading credentials in curl (single Bash call — env vars don't persist between calls):**

```bash
APP_ID=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['app_id'])") && \
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X GET "https://app.base44.com/api/apps/$APP_ID/entities/{Entity}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json"
```

## CRUD Operations

| Operation | Method | URL |
|-----------|--------|-----|
| List all | `GET` | `/entities/{Entity}` |
| Get one | `GET` | `/entities/{Entity}/{id}` |
| Create | `POST` | `/entities/{Entity}` |
| Update | `PUT` | `/entities/{Entity}/{id}` |
| Delete | `DELETE` | `/entities/{Entity}/{id}` |

## Entity Discovery

If you're unsure which entities exist, try common names. The API returns 404 for unknown entities.

```bash
# Try fetching an entity — 200 means it exists, 404 means it doesn't
APP_ID=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['app_id'])") && \
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
for entity in Feature FeatureBoard PluginSession; do \
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://app.base44.com/api/apps/$APP_ID/entities/$entity" \
    -H "api_key: $API_KEY"); \
  echo "$entity: $STATUS"; \
done
```

## Known Entities

| Entity | Description |
|--------|-------------|
| `Feature` | Product features and roadmap items |
| `FeatureBoard` | Feature analytics dashboards (Mixpanel links, metrics) |
| `PluginSession` | Plugin usage logs (who, what, time saved) — see `skills/session-log/SKILL.md` |

---

## Feature Entity Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Feature name |
| `description` | string/null | Feature description (may contain HTML) |
| `status` | string | `new`, `in_progress`, `released`, `archived` |
| `tier` | string | `tier_1`, `tier_2`, `tier_3` |
| `owners` | string[] | Assigned owners |
| `developer` | string | Developer name |
| `eta` | string | Expected completion date (YYYY-MM-DD) |
| `released_at` | string/null | Release date |
| `why_building` | string | Rationale (may contain HTML) |
| `who_is_this_for` | string | Target audience (may contain HTML) |
| `why_it_matters` | string/null | Impact statement |
| `whats_new` | string | What's new description (may contain HTML) |
| `marketing_description` | string | Marketing copy for the feature |
| `marketing_owner` | string | Marketing point person |
| `marketing_release_date` | string | Planned marketing release date |
| `marketing_media_urls` | string[] | Marketing media assets |
| `hide_from_marketing` | boolean | Whether to exclude from marketing |
| `media_urls` | string[] | General media assets |
| `figma_link` | string | Figma design link |
| `showcase_link` | string | Demo/showcase link |
| `slack_channel_id` | string | Related Slack channel |
| `released_at` | string/null | Release date |
| `ux_ready` | boolean | UX readiness flag |
| `need_data_analytics` | boolean | Analytics needed flag |
| `comments` | string | Internal comments |
| `updates` | array | Status updates |
| `order` | number | Display order |
| `archived` | boolean | Archived flag |
| `retro_demo_video_url` | string/null | Retro demo video |
| `retro_two_weeks_review` | string/null | Two-week retro |
| `retro_two_months_review` | string/null | Two-month retro |
| `retro_mixpanel_results` | string/null | Mixpanel analytics results |
| `kb_owner` | string/null | Knowledge base owner |
| `created_date` | string | ISO timestamp |
| `updated_date` | string | ISO timestamp |
| `created_by` | string | Creator email |
| `is_sample` | boolean | Sample data flag |

## FeatureBoard Entity Schema

| Field | Type | Description |
|-------|------|-------------|
| `feature_name` | string | Feature identifier (links to Feature entity) |
| `display_name` | string | Human-readable name |
| `mixpanel_board_link` | string | Mixpanel dashboard URL |
| `metrics` | string/array | Key metrics tracked |
| `event_names` | string/array | Mixpanel event names |

## PluginSession Entity Schema

See `skills/session-log/SKILL.md` for the full schema. Create this entity in your Base44 app to enable team usage tracking.

---

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 401 | Unauthorized (check API key) |
| 404 | Entity or record not found |
| 429 | Rate limited |
| 500 | Server error |

## Credential Setup

If `.claude/marketing/api-config.json` doesn't exist, create it with the Write tool:

```json
{
  "app_id": "your-app-id",
  "api_key": "your-api-key"
}
```

Get your App ID and API Key from the Base44 app dashboard under Settings > API.
