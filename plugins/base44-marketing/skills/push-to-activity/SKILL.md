---
name: push-to-activity
description: |
  Push waterfall assets or individual content into a MarketingActivity record in the Product App.
  Maps channel content to per-channel fields (linkedin_base44_content, x_maor_content, etc.) and sets approval_status to draft.
  Includes provenance tracking, collision detection, version history, and activity numbering.
  Works standalone or as the final step of launch-waterfall (Phase 7).

  Triggers on: push to activity, save to activity, publish activity, push assets, push waterfall, sync to product app, update marketing activity.
---

# Push to Marketing Activity

> Push launch assets into the Product App's MarketingActivity entity so the team can review, approve, and track content readiness from one place. Every push includes provenance data (who, how, when) and collision detection to prevent silent overwrites.

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

**Upload URL:**
```
https://product-sync.base44.app/api/integrations/Core/UploadFile
```
> Upload lives on `product-sync.base44.app` (NOT `app.base44.com`).
> Requires `X-App-Id` header in addition to `api_key`.

---

## MarketingActivity Entity Schema

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Activity title (e.g., "Profiles Launch") |
| `activity_number` | number | Auto-incrementing human-readable ID (MA-1, MA-2...) |
| `description` | string | Summary of the launch/campaign |
| `goals` | string | Marketing goals |
| `concepts` | string | Creative concepts or angles |
| `target_audience` | string | Target segments |
| `date` | datetime | Launch date |
| `owner` | string | Marketing owner |
| `status` | string | `new` / `in_progress` / `ready` / `released` / `on_going` / `pending` |
| `activity_type` | string | `social_media` / `email` / `event` / `content` / `pr` / `other` |
| `media_urls` | array | Attached media |
| `feature_id` | string | Linked Feature record ID |
| `feature_brief_id` | string | Linked FeatureBrief record ID |

### Provenance Fields (REQUIRED on every push)

| Field | Type | Description |
|-------|------|-------------|
| `created_by_user` | string | Name or email of user who pushed this content |
| `created_by_tool` | string | Tool that generated it (e.g., "Marketing Plugin v1.17") |
| `generation_method` | string | `ai_generated` / `ai_assisted` / `human_written` |
| `pushed_at` | datetime | When content was first pushed |
| `content_maturity` | string | `raw_draft` / `reviewed_draft` / `pmm_approved` / `final` |
| `pmm_reviewer` | string | PMM assigned to review (set by PMM in app, not by plugin) |
| `last_edited_by` | string | Who last edited any content |
| `last_edited_at` | datetime | When last edited |
| `edit_history` | array | Git-style changelog — every action logged here |

### Approval Fields

| Field | Type | Description |
|-------|------|-------------|
| `approval_status` | string | `draft` / `submitted` / `approved` / `changes_requested` |
| `approval_notes` | string | Reviewer notes |
| `approval_reviewers` | array | Who needs to approve |
| `submitted_at` | datetime | When submitted for review |
| `approved_at` | datetime | When approved |

### Brief Fields (from waterfall phases)

| Field | Type | Source |
|-------|------|--------|
| `brief_product_summary` | string | Phase 1 product brief |
| `brief_problem_it_solves` | string | Phase 2 pain points |
| `brief_target_segments` | string | Phase 1 target segments |
| `brief_pain_points` | string | Phase 2 pain points ranked |
| `brief_proof_points` | string | Phase 2 proof points |
| `brief_objections` | string | Phase 2 objections |
| `brief_competitive_positioning` | string | Phase 2 competitive positioning |
| `brief_primary_message` | string | Phase 3 primary message |
| `brief_h1_options` | string | Phase 3 H1 options |
| `brief_key_messages_by_audience` | string | Phase 3 key messages |
| `brief_story_beats` | string | Phase 3 story beats |
| `brief_channel_adaptations` | string | Phase 3 channel adaptations |
| `brief_maturity` | string | `raw_draft` / `reviewed_draft` / `pmm_approved` / `final` |

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

### Version Tracking Fields

| Field | Type | Description |
|-------|------|-------------|
| `channel_versions` | object | Version counter per channel key |
| `channel_version_history` | object | Full content snapshots per channel |
| `channel_snapshots` | object | Content/media count at last share |

### Channels NOT in Entity (logged but not pushed)

| Content Type | Notes |
|-------------|-------|
| Email | Has `has_email` + `email_sections` now. Push if content exists. |
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
output/launch/{slug}/phase-1-product-understanding.md  > brief_product_summary, brief_target_segments
output/launch/{slug}/phase-2-pain-positioning.md       > brief_pain_points, brief_proof_points, brief_objections, brief_competitive_positioning
output/launch/{slug}/phase-3-messaging-framework.md    > title, description, goals, target_audience, brief_primary_message, brief_h1_options, brief_story_beats, brief_channel_adaptations, brief_key_messages_by_audience
output/launch/{slug}/phase-4-asset-plan.md             > date, owner
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

## Step 2.5: Upload Media Files

If media files exist for this launch, upload them before building the payload.

### File Discovery

Scan for media files in:
```
output/launch/{slug}/assets/*.{png,jpg,mp4}
```
Also check the current working directory for any image/video files referenced in the conversation.

### Upload Endpoint

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://product-sync.base44.app/api/integrations/Core/UploadFile" \
  -H "api_key: $API_KEY" \
  -H "X-App-Id: 692b72212d45f3a5bc07e7ae" \
  -F "file=@path/to/image.png"
```

**Response:**
```json
{"file_url": "https://base44.app/api/apps/.../hash_filename.jpg"}
```

### File-to-Channel Mapping

Route uploaded files to the correct `*_media_urls` field by naming convention:

| Filename Pattern | Target Field |
|-----------------|-------------|
| `*linkedin*` | `linkedin_base44_media_urls` or `linkedin_maor_media_urls` |
| `*x-*` or `*twitter*` | `x_base44_media_urls` or `x_maor_media_urls` |
| `*discord*` or `*community*` | `community_media_urls` |
| `*whats-new*` or `*carousel*` | `whats_new_media_urls` |
| `*video*` or `*.mp4` | `motion_video_media_urls` |

If the filename contains `maor`, route to the Maor variant (e.g., `linkedin_maor_media_urls`). Otherwise, route to the brand variant.

### Upload Loop

```
FOR EACH media file found:
  1. Upload via POST to UploadFile endpoint
  2. Parse file_url from response
  3. Match filename to channel using the mapping table above
  4. Group URLs by channel field
```

Store the grouped URLs for inclusion in the payload (Step 3).

---

## Step 3: Build Payload

### Determine Current User

Get the current user for provenance tracking:
```bash
CURRENT_USER=$(python3 -c "
import json, os
try:
    config = json.load(open('.claude/marketing/api-config.json'))
    print(config.get('user_email', config.get('user_name', 'Marketing Agent')))
except:
    print('Marketing Agent')
")
```

### Determine Channels Being Pushed

Build the list of channels that have content:
```bash
CHANNELS_AFFECTED=[]
# For each channel with content, add to the list:
# "whats_new", "linkedin_base44", "linkedin_maor", "x_base44", "x_maor", "community", "demo_video", "motion_video", "filmed_video"
```

### Current Timestamp

```bash
CURRENT_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

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
  "status": "new",
  "activity_type": "social_media",
  "feature_id": "feature-record-id-if-known",

  "approval_status": "draft",

  "created_by_user": "{CURRENT_USER}",
  "created_by_tool": "Marketing Plugin v1.17",
  "generation_method": "ai_generated",
  "pushed_at": "{CURRENT_TIMESTAMP}",
  "content_maturity": "raw_draft",
  "last_edited_by": "{CURRENT_USER}",
  "last_edited_at": "{CURRENT_TIMESTAMP}",
  "edit_history": [{
    "timestamp": "{CURRENT_TIMESTAMP}",
    "user": "{CURRENT_USER}",
    "action": "pushed_content",
    "tool": "Marketing Plugin v1.17",
    "channels_affected": ["{CHANNELS_AFFECTED}"],
    "note": "AI-generated content from {SOURCE: waterfall/feature-brief/standalone}"
  }],

  "brief_product_summary": "{from Phase 1 — what the feature does in plain English}",
  "brief_problem_it_solves": "{from Phase 2 — the user problem, in their words}",
  "brief_target_segments": "{from Phase 1 — target audience segments with why they care}",
  "brief_pain_points": "{from Phase 2 — ranked pain points with severity}",
  "brief_proof_points": "{from Phase 2 — claims + evidence + source}",
  "brief_objections": "{from Phase 2 — anticipated objections with responses}",
  "brief_competitive_positioning": "{from Phase 2 — us vs competitors}",
  "brief_primary_message": "{from Phase 3 — the ONE sentence value proposition}",
  "brief_h1_options": "{from Phase 3 — 2-3 headline options}",
  "brief_key_messages_by_audience": "{from Phase 3 — messages adapted per segment}",
  "brief_story_beats": "{from Phase 3 — Problem > Insight > Solution > Proof > CTA}",
  "brief_channel_adaptations": "{from Phase 3 — tone, length, hook per channel}",
  "brief_maturity": "raw_draft",

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
  "demo_video_content": "...",
  "whats_new_media_urls": ["https://base44.app/api/apps/.../carousel_01.png"],
  "linkedin_base44_media_urls": ["https://base44.app/api/apps/.../linkedin_brand_hero.png"],
  "linkedin_maor_media_urls": ["https://base44.app/api/apps/.../linkedin_maor_screenshot.png"],
  "x_base44_media_urls": ["https://base44.app/api/apps/.../x_brand_card.png"],
  "community_media_urls": ["https://base44.app/api/apps/.../discord_preview.png"],
  "motion_video_media_urls": ["https://base44.app/api/apps/.../launch_video.mp4"]
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

### Brief Fields from Waterfall Phases

| Payload Field | Source File | What to Extract |
|--------------|------------|-----------------|
| `brief_product_summary` | phase-1-product-understanding.md | The product summary section |
| `brief_problem_it_solves` | phase-2-pain-positioning.md | The "Problem" or "Pain Points" section header |
| `brief_target_segments` | phase-1-product-understanding.md | The target segments section |
| `brief_pain_points` | phase-2-pain-positioning.md | Ranked pain points list |
| `brief_proof_points` | phase-2-pain-positioning.md | Evidence/proof section |
| `brief_objections` | phase-2-pain-positioning.md | Objections section |
| `brief_competitive_positioning` | phase-2-pain-positioning.md | Competitive positioning matrix |
| `brief_primary_message` | phase-3-messaging-framework.md | The primary message/value prop |
| `brief_h1_options` | phase-3-messaging-framework.md | H1 headline options |
| `brief_key_messages_by_audience` | phase-3-messaging-framework.md | Per-audience messages |
| `brief_story_beats` | phase-3-messaging-framework.md | Story arc section |
| `brief_channel_adaptations` | phase-3-messaging-framework.md | Channel adaptation table |

If any phase file doesn't exist (e.g., standalone push without waterfall), skip the brief fields — they'll remain empty and can be filled later.

---

## Step 4: Check for Existing Record + Collision Detection

Before creating, check if a MarketingActivity already exists for this feature:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json"
```

Search the response for a record matching this feature (by title or feature_id).

### If NOT found — Assign Activity Number + Create

Before creating a new record, get the next activity_number:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
HIGHEST=$(curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity?sort=-activity_number&limit=1" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" | python3 -c "
import json, sys
data = json.load(sys.stdin)
records = data if isinstance(data, list) else data.get('entities', data.get('results', []))
if records and records[0].get('activity_number'):
    print(records[0]['activity_number'] + 1)
else:
    print(1)
")
```

Add `"activity_number": {HIGHEST}` to the payload. Then proceed to Step 4.5.

### If found — COLLISION CHECK

Before overwriting, check if the existing record has content in any channel fields that the new payload also wants to write to.

For each channel in the new payload where `has_{channel}` is true:
- Check if the existing record's `{channel}_content` is non-empty
- If yes → COLLISION on that channel

**If NO collision:** Use PUT to update the existing record. Preserve fields you're not updating. When updating, also:
- Append a new entry to the existing `edit_history` (don't replace it)
- Update `last_edited_by` and `last_edited_at`
- DO NOT change `activity_number` (keep the existing one)
- DO NOT change `created_by_user` or `pushed_at` (keep original provenance)

**If COLLISION detected:**

Show the user what already exists:

```
Content collision detected!

MarketingActivity MA-{activity_number} "{existing_title}" already has content in:
  - LinkedIn (Base44): pushed by {existing.created_by_user} on {existing.pushed_at}
  - X (Base44): pushed by {existing.created_by_user} on {existing.pushed_at}
  - What's New: pushed by {existing.created_by_user} on {existing.pushed_at}

Your new content wants to write to the same channels.
```

Then ask the user:

```
AskUserQuestion(questions=[{
  "question": "Content already exists in this activity. How should I proceed?",
  "header": "Collision",
  "options": [
    {"label": "Replace existing", "description": "Overwrite the existing content. Old content will be saved in version history and logged in the Activity Log."},
    {"label": "Create new activity (v2)", "description": "Create a separate MarketingActivity linked to the same feature. Original stays untouched."},
    {"label": "Cancel", "description": "Don't push anything. Keep everything local."}
  ],
  "multiSelect": false
}])
```

**Handle "Replace existing":**
- Read the existing content for colliding channels
- Save each existing channel's content to `channel_version_history` as a new version
- PUT the new content to the existing record
- Append TWO entries to `edit_history`:
  ```json
  {
    "timestamp": "{CURRENT_TIMESTAMP}",
    "user": "{CURRENT_USER}",
    "action": "content_overridden",
    "tool": "Marketing Plugin v1.17",
    "channels_affected": ["{colliding channels}"],
    "note": "Replaced content originally pushed by {existing.created_by_user} on {existing.pushed_at}"
  },
  {
    "timestamp": "{CURRENT_TIMESTAMP}",
    "user": "{CURRENT_USER}",
    "action": "pushed_content",
    "tool": "Marketing Plugin v1.17",
    "channels_affected": ["{all channels}"],
    "note": "AI-generated content from {SOURCE}"
  }
  ```
- Update `last_edited_by` and `last_edited_at` (but NOT `created_by_user` or `pushed_at`)

**Handle "Create new activity (v2)":**
- POST a new record with all the new content
- Set title to `"{original_title} (v2)"` or `"{original_title} ({CURRENT_USER}'s version)"`
- Set `feature_id` to the same feature as the original
- Assign next `activity_number`
- Original record is NOT modified

**Handle "Cancel":**
- Abort. Save payload to `output/launch/{slug}/activity-payload.json` for later.
- Report "Push cancelled. Payload saved locally."

---

## Step 4.5: PMM Confirmation Gate

Before pushing, show the PMM a summary and ask for confirmation.

### Display Summary

```
Ready to push to MarketingActivity:

  Activity: MA-{activity_number} (new) or MA-{existing_number} (update)
  Title: {title}
  Created by: {CURRENT_USER}
  Method: ai_generated
  Channels: {list of filled channels}
  Media files: {count} files uploaded

  Text preview:
    LinkedIn (Brand): "{first 80 chars}..."
    LinkedIn (Maor): "{first 80 chars}..."
    X (Brand): "{first 80 chars}..."
    X (Maor): "{first 80 chars}..."
    Community: "{first 80 chars}..."
    What's New: "{first 80 chars}..."
    Demo Video: "{first 80 chars}..."

  Brief: {filled/empty} — {count of brief fields populated} of 12 fields
```

### Ask for Confirmation

```
AskUserQuestion(questions=[{
  "question": "Ready to push to Product App?",
  "header": "Push Review",
  "options": [
    {"label": "Push it", "description": "Send all content + media + provenance to MarketingActivity"},
    {"label": "Let me review first", "description": "Show me the full payload before pushing"},
    {"label": "Skip push", "description": "Keep everything local, don't push to Product App"}
  ],
  "multiSelect": false
}])
```

### Handle Response

- **"Push it":** Proceed to Step 5.
- **"Let me review first":** Display the full payload JSON, then ask again with the same options.
- **"Skip push":** Save the payload to `output/launch/{slug}/activity-payload.json` for later manual push. Report that the payload was saved locally.

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

**IMPORTANT for updates:** When building the update payload:
1. First GET the existing record
2. Merge the existing `edit_history` array with new entries (don't replace)
3. Merge the existing `channel_version_history` with new snapshots (don't replace)
4. Preserve `activity_number`, `created_by_user`, `pushed_at` from the original
5. Only include fields you're actually changing + the merged arrays

---

## Step 6: Report Results

### On success:

```
Pushed to MarketingActivity:

  Activity: MA-{activity_number}
  Title: {title}
  Record ID: {id}

  Provenance:
    Created by: {created_by_user}
    Tool: Marketing Plugin v1.17
    Method: ai_generated
    Pushed at: {pushed_at}
    Content maturity: raw_draft

  Channels filled:
  ✅ What's New (2 media files)
  ✅ LinkedIn (Brand) (1 media file)
  ✅ LinkedIn (Maor) (1 media file)
  ✅ X (Brand) (1 media file)
  ✅ X (Maor)
  ✅ Community (Discord) (1 media file)
  ✅ Demo Video

  Brief: {count}/12 fields populated
  Media: {total count} files uploaded to Product App
  Activity Log: First entry recorded — "pushed_content"

  Not in entity (saved locally only):
  - Reddit (asset 10)
  - Blog (asset 11)
  - Maor teasers (assets 12, 13)

  Next: Open the Product App → PMM clicks "Mark as Reviewed" → CMO clicks "CMO Approve" → "Publish Final"
```

### On error:

- Auth error: Check `.claude/marketing/api-config.json`
- Entity not found: Verify app ID `692b72212d45f3a5bc07e7ae`
- Validation error: Check field names against schema
- Collision: Run Step 4 collision flow

---

## Standalone Usage (Outside Waterfall)

When used outside a waterfall, the skill works with whatever content exists:

1. **Single channel push:** User just wrote a LinkedIn post. Push it to `linkedin_base44_content` on an existing or new MarketingActivity.
2. **Partial update:** User wrote X posts for an existing activity. Update only the X fields.
3. **From conversation:** Extract content from the current conversation context.

For standalone:
- Ask the user: "Which MarketingActivity should I update?" (show list with MA-numbers if multiple exist)
- OR create a new one if no match exists
- Still include provenance fields on every push
- Still run collision detection if updating

For standalone pushes, set:
- `generation_method`: "ai_generated" (if plugin generated) or "ai_assisted" (if user wrote with plugin help) or "human_written" (if user provided exact text)
- `created_by_tool`: "Marketing Plugin v1.17" (even for standalone)
- Brief fields: skip if no waterfall data exists

---

## Waterfall Integration (Phase 7)

When invoked as the final waterfall phase:

```
Phase 6: LAUNCH EXECUTION (checklist)
    |
    v  GATE: Checklist complete
Phase 7: PUSH TO PRODUCT APP (auto)
    |
    v  DONE: MarketingActivity record created/updated with all channel content + provenance + brief
```

The waterfall auto-invokes this skill after Phase 6 approval. PMM confirmation required before push (Step 4.5). Content was approved in Phase 5, but the push itself needs explicit go-ahead.

When pushing from waterfall, ALWAYS populate brief fields from Phase 1-3 outputs.

---

## Feature Entity Cross-Update

If a `feature_id` is known, also update the Feature entity to link back:

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X PUT "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/Feature/{FEATURE_ID}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"marketing_description": "Content ready. MarketingActivity: MA-{ACTIVITY_NUMBER} ({RECORD_ID})"}'
```

This closes the loop: Feature knows marketing content exists.

---

## Notes

- All content pushed as `status: "new"` and `content_maturity: "raw_draft"`. Team advances the pipeline from the Product App.
- `approval_status: "draft"` signals the team to review.
- Channel content preserves markdown formatting.
- For variations, only the recommended one is pushed (not all variations).
- The skill is idempotent for updates: running it twice on the same feature updates the same record (collision detection prevents accidental overwrites).
- Channels not in the entity schema (reddit, blog) remain in local asset files only.
- Every push creates an `edit_history` entry — this is what powers the Activity Log in the Product App UI.
- `activity_number` is assigned only on new records, never changed on updates.
- When updating, always MERGE `edit_history` and `channel_version_history` arrays — never replace them.
