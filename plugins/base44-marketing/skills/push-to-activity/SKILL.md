---
name: push-to-activity
description: |
  Push waterfall assets or individual content into a MarketingActivity record in the Product App.
  Maps channel content to per-channel fields (linkedin_base44_content, x_maor_content, etc.) and sets approval_status to pending.
  Works standalone or as the final step of launch-waterfall (Phase 7).

  Triggers on: push to activity, save to activity, publish activity, push assets, push waterfall, sync to product app, update marketing activity.
---

# Push to Marketing Activity

> Push launch assets into the Product App's MarketingActivity entity so the team can review, approve, and track content readiness from one place.

## When This Skill Activates

- "push to activity" / "save to activity" / "push assets"
- "push waterfall" / "sync to product app"
- "update marketing activity"
- End of launch-waterfall Phase 6 (auto-invoked)

---

## API Configuration

```
Product App ID: 692b72212d45f3a5bc07e7ae
Entity: MarketingActivity
Credentials: .claude/marketing/api-config.json
```

**Read credentials:**
```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])")
```

**Base URL:**
```
https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity
```

---

## MarketingActivity Entity Schema

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Activity title (e.g., "Profiles Launch") |
| `description` | string | Summary of the launch/campaign |
| `goals` | string | Marketing goals |
| `concepts` | string | Creative concepts or angles |
| `target_audience` | string | Target segments |
| `date` | datetime | Launch date |
| `owner` | string | Marketing owner |
| `status` | string | `draft` / `in_progress` / `ready` / `published` |
| `activity_type` | string | Type of activity |
| `media_urls` | array | Attached media |
| `feature_id` | string | Linked Feature record ID |
| `feature_brief_id` | string | Linked FeatureBrief record ID |

### Approval Fields

| Field | Type | Description |
|-------|------|-------------|
| `approval_status` | string | `pending` / `approved` / `rejected` |
| `approval_notes` | string | Reviewer notes |
| `approval_reviewers` | array | Who needs to approve |
| `submitted_at` | datetime | When submitted for review |
| `approved_at` | datetime | When approved |

### Channel Content Fields

Each channel has three fields: `has_{channel}` (boolean), `{channel}_content` (string), `{channel}_media_urls` (array).

| Channel Slot | has_ flag | Content field | Media field |
|-------------|-----------|---------------|-------------|
| What's New | `has_whats_new` | `whats_new_content` | `whats_new_media_urls` |
| LinkedIn (Brand) | `has_linkedin_base44` | `linkedin_base44_content` | `linkedin_base44_media_urls` |
| LinkedIn (Maor) | `has_linkedin_maor` | `linkedin_maor_content` | `linkedin_maor_media_urls` |
| X (Brand) | `has_x_base44` | `x_base44_content` | `x_base44_media_urls` |
| X (Maor) | `has_x_maor` | `x_maor_content` | `x_maor_media_urls` |
| Community (Discord) | `has_community` | `community_content` | `community_media_urls` |
| Demo Video | `has_demo_video` | `demo_video_content` | `demo_video_media_urls` |
| Motion Video | `has_motion_video` | `motion_video_content` | `motion_video_media_urls` |
| Filmed Video | `has_filmed_video` | `filmed_video_content` | `filmed_video_media_urls` |

### Channels NOT in Entity (logged but not pushed)

| Content Type | Notes |
|-------------|-------|
| Email | No email field in MarketingActivity. Log as skipped. |
| Reddit | No reddit field. Log as skipped. |
| Blog | No blog field. Log as skipped. |
| Teasers | Teaser posts (Maor warm-up, Maor X teaser) are tactical. Log as skipped. |

---

## Step 1: Locate Content Source

### From Waterfall (preferred)

If a waterfall output directory exists, scan it:

```
output/launch/{slug}/assets/
```

Read each asset file and extract content. The asset files contain variations. Pick the **recommended** variation. Look for:
- "Recommendation: Variation X is stronger"
- "Recommended:" label
- If no recommendation, use Variation A.

Also read the messaging framework for metadata:
```
output/launch/{slug}/phase-3-messaging-framework.md  > title, description, goals, target_audience
output/launch/{slug}/phase-4-asset-plan.md            > date, owner
```

### From Conversation (standalone)

If no waterfall directory, extract from the current conversation:
- Most recently generated content
- Channel detected from context
- Feature name from discussion

---

## Step 2: Map Assets to Fields

### Waterfall Asset Mapping

| Asset File | MarketingActivity Field | Notes |
|-----------|------------------------|-------|
| `02-whats-new-entry.md` or `07-whats-new-full.md` | `whats_new_content` | Use the full-launch version (07) if both exist |
| `04-linkedin-brand.md` | `linkedin_base44_content` | Pick recommended variation |
| `05-linkedin-maor.md` | `linkedin_maor_content` | Pick recommended variation |
| `06-x-posts.md` (brand tweets) | `x_base44_content` | Include brand single + brand thread |
| `06-x-posts.md` (Maor tweets) | `x_maor_content` | Include Maor announcement + Maor teaser |
| `01-discord-community-launch.md` + `09-discord-full-launch.md` | `community_content` | Combine: community soft launch + full launch |
| `03-demo-video-script.md` | `demo_video_content` | Video script only (not final video) |

### Content Extraction Rules

When reading asset files:
1. Skip frontmatter (everything before the first `---` after the header)
2. Skip brand-guardian notes sections
3. Skip metadata sections
4. Extract the actual content body
5. For variations, extract ONLY the recommended one
6. Preserve markdown formatting in the content field

---

## Step 3: Build Payload

### For a new MarketingActivity record:

```json
{
  "title": "Profiles Launch",
  "description": "Public builder profiles at base44.com/@username with app showcase, activity heatmap, and 5-tier reputation system.",
  "goals": "Establish Base44 as the first app builder with public builder profiles. Drive profile creation and sharing.",
  "concepts": "Reputation network for builders. GitHub for app builders.",
  "target_audience": "Active builders, new builders, community builders, professional builders",
  "date": "2026-03-23T09:00:00Z",
  "owner": "marketing",
  "status": "draft",
  "activity_type": "feature_launch",
  "feature_id": "feature-record-id-if-known",
  "approval_status": "pending",
  "submitted_at": "2026-03-12T12:00:00Z",
  "has_whats_new": true,
  "whats_new_content": "...",
  "has_linkedin_base44": true,
  "linkedin_base44_content": "...",
  "has_linkedin_maor": true,
  "linkedin_maor_content": "...",
  "has_x_base44": true,
  "x_base44_content": "...",
  "has_x_maor": true,
  "x_maor_content": "...",
  "has_community": true,
  "community_content": "...",
  "has_demo_video": true,
  "demo_video_content": "..."
}
```

### Metadata from Messaging Framework

| Payload Field | Source |
|--------------|--------|
| `title` | Feature name from messaging framework header |
| `description` | Primary Message from Phase 3 |
| `goals` | Derived from Positioning (Phase 2 core position) |
| `concepts` | H1 Options from Phase 3 |
| `target_audience` | Target segments from Phase 1 |
| `date` | Launch date from Asset Plan (Phase 4) |

---

## Step 4: Check for Existing Record

Before creating, check if a MarketingActivity already exists for this feature:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json"
```

Search the response for a record matching this feature (by title or feature_id).

- **If found:** Use PUT to update the existing record. Preserve fields you're not updating.
- **If not found:** Use POST to create a new record.

---

## Step 5: Push via REST API

Write the payload to a temp file, then push:

### Create new:
```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/activity-push.json
```

### Update existing:
```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X PUT "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/{RECORD_ID}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/activity-push.json
```

---

## Step 6: Report Results

### On success:

```
Pushed to MarketingActivity:

  Title: Profiles Launch
  Record ID: {id}
  Status: draft
  Approval: pending

  Channels filled:
  ✅ What's New
  ✅ LinkedIn (Brand)
  ✅ LinkedIn (Maor)
  ✅ X (Brand)
  ✅ X (Maor)
  ✅ Community (Discord)
  ✅ Demo Video

  Not in entity (saved locally only):
  - Email (asset 08)
  - Reddit (asset 10)
  - Blog (asset 11)
  - Maor teasers (assets 12, 13)

  Open the Product App to review and approve.
```

### On error:

- Auth error: Check `.claude/marketing/api-config.json`
- Entity not found: Verify app ID `692b72212d45f3a5bc07e7ae`
- Validation error: Check field names against schema

---

## Standalone Usage (Outside Waterfall)

When used outside a waterfall, the skill works with whatever content exists:

1. **Single channel push:** User just wrote a LinkedIn post. Push it to `linkedin_base44_content` on an existing or new MarketingActivity.
2. **Partial update:** User wrote X posts for an existing activity. Update only the X fields.
3. **From conversation:** Extract content from the current conversation context.

For standalone, ask the user:
- "Which MarketingActivity should I update?" (show list if multiple exist)
- OR create a new one if no match exists

---

## Waterfall Integration (Phase 7)

When invoked as the final waterfall phase:

```
Phase 6: LAUNCH EXECUTION (checklist)
    |
    v  GATE: Checklist complete
Phase 7: PUSH TO PRODUCT APP (auto)
    |
    v  DONE: MarketingActivity record created/updated with all channel content
```

The waterfall auto-invokes this skill after Phase 6 approval. No user confirmation needed for the push itself (content was already approved in Phase 5).

---

## Feature Entity Cross-Update

If a `feature_id` is known, also update the Feature entity to link back:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X PUT "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/Feature/{FEATURE_ID}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"marketing_description": "Content ready. MarketingActivity: {ACTIVITY_ID}"}'
```

This closes the loop: Feature knows marketing content exists.

---

## Notes

- All content pushed as **draft** status. Team publishes from the Product App.
- `approval_status: pending` signals the team to review.
- Channel content preserves markdown formatting.
- For variations, only the recommended one is pushed (not all variations).
- The skill is idempotent: running it twice updates the same record (no duplicates).
- Channels not in the entity schema (email, reddit, blog) remain in local asset files only.
