---
name: push-to-ripple
description: Push generated marketing content into Ripple's Content entity via the Base44 REST API. Use when user says "push to ripple", "save to ripple", "send to ripple", or wants to persist generated content into the Ripple CMS.
---

# Push to Ripple

> Push CLI-generated marketing content directly to Ripple's Content entity via REST API.

## When This Skill Activates

User says any of:
- "push to ripple"
- "save to ripple"
- "send to ripple"
- "push this to ripple"
- Wants to persist generated content into Ripple

## API Configuration

```
Ripple App ID: 69809e95545ed2e086d167f9
Entity: Content
Credentials: .claude/marketing/api-config.json
```

**Read credentials:**
```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])")
```

**Base URL:**
```
https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/Content
```

## Content Entity Schema

All filterable fields on the Content entity:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Content title or first line |
| `body` | string | Full content text |
| `channel` | string | Platform channel (see Valid Channels) |
| `content_type` | string | Type of content (post, tweet, thread, etc.) |
| `status` | string | `draft` / `published` / `scheduled` |
| `brand_id` | string | Brand identifier |
| `campaign_id` | string | Campaign grouping |
| `image_url` | string | Attached image URL |
| `published_url` | string | URL where content was published |
| `published_at` | datetime | When content was published |
| `scheduled_date` | datetime | When content is scheduled to publish |
| `engagement` | object | Engagement metrics after publishing |
| `source_feature_id` | string | Linked FeatureBrief record ID |
| `source_feature_data` | object | Inline feature context snapshot |
| `source_app_id` | string | Source app reference |
| `generation_batch_id` | string | Groups content from the same push |
| `metadata` | object | Arbitrary metadata |
| `visibility` | string | `team` / `private` |
| `assets` | array | Attached files/media |
| `created_by` | string | Auto-set by API |

## Step 1: Extract Content from Conversation

Scan the conversation for generated content. Look for:

1. `<!-- CONTENT_START:channel -->` markers (if present)
2. The most recently generated content piece in the conversation
3. Channel detection from context (e.g., LinkedIn post was just written → channel = `linkedin`)

Also extract the guardian score if present:
- `Guardian Score: X/10`
- `Score: X/10`

## Step 2: Build JSON Payload

Build the payload matching the Content entity schema:

```json
{
  "channel": "linkedin",
  "content_type": "post",
  "title": "First line or subject of the content",
  "body": "Full content text here",
  "status": "draft",
  "source_feature_id": "feature-brief-record-id-if-available",
  "metadata": {
    "source": "cli_marketing_skill",
    "guardian_score": 8
  }
}
```

**Channel-to-content_type mapping:**
- linkedin → `post`
- x → `tweet` (or `thread` if multi-part)
- email → `nurture`
- blog → `blog_post`
- landing → `landing`
- discord → `announcement`
- video → `clip`
- meta_ads → `feed_ad`
- linkedin_ads → `feed_ad`
- reddit_ads → `feed_ad`

If a feature brief was used as context, link it via `source_feature_id`.

## Step 3: Push via REST API

Write the payload to a temp file, then POST:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/Content" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/ripple-push.json
```

**To update an existing record:**

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X PUT "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/Content/{RECORD_ID}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/ripple-push.json
```

## Step 4: Report Results

Parse the JSON response from the API.

**On success:**
```
Pushed to Ripple:
- LinkedIn post → record_id: abc123 (draft)

Open Ripple to review and publish.
```

**On error:**
- If `Entity schema Content not found`: Wrong app ID — use `69809e95545ed2e086d167f9`
- If auth error: Check `.claude/marketing/api-config.json` credentials
- If validation error: Check required fields against schema

## List All Content

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/Content" \
  -H "api_key: $API_KEY" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data:
    print(f'{r.get(\"channel\",\"?\"):12} | {r.get(\"status\",\"?\"):10} | {r.get(\"title\",\"?\")[:50]}')
"
```

## Valid Channels

`linkedin`, `x`, `email`, `blog`, `landing`, `discord`, `video`, `meta_ads`, `linkedin_ads`, `reddit_ads`

## Notes

- All content is created as **draft** status — user publishes from Ripple UI
- Guardian review is NOT needed here — it's already built into the marketing skills
- The `metadata.source: cli_marketing_skill` tag identifies CLI-pushed content in Ripple
- Multiple content pieces from the same campaign can share a `campaign_id`
- Use `source_feature_id` to link content back to the FeatureBrief it was generated from
- Use `generation_batch_id` to group content from the same push session
