# Base44 App API Reference

## Base URL

```
https://app.base44.com/api/apps/{APP_ID}/entities/{Entity}
```

## Authentication

| Header | Value |
|--------|-------|
| `api_key` | `$BASE44_API_KEY` (environment variable) |
| `Content-Type` | `application/json` |

**Environment variables required:**

```bash
export BASE44_APP_ID="your-app-id"
export BASE44_API_KEY="your-api-key"
```

## CRUD Operations

| Operation | Method | URL |
|-----------|--------|-----|
| List all | `GET` | `/entities/{Entity}` |
| Get one | `GET` | `/entities/{Entity}/{id}` |
| Create | `POST` | `/entities/{Entity}` |
| Update | `PUT` | `/entities/{Entity}/{id}` |
| Delete | `DELETE` | `/entities/{Entity}/{id}` |

## Known Entities

| Entity | Description |
|--------|-------------|
| `Feature` | Product features and roadmap items |

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

## Example Requests

### List all features

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

### Get one feature

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature/{id}" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 401 | Unauthorized (check API key) |
| 404 | Entity or record not found |
| 429 | Rate limited |
| 500 | Server error |
