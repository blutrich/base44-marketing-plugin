---
name: feature-scan
description: |
  BATCH processing of the #product-marketing-sync queue. Scans for new feature announcements, checks Ripple for existing briefs, generates briefs + draft content for unprocessed features, pushes to Ripple, and posts condensed summaries back to Slack.

  Triggers on: feature scan, scan features, process features, what's new in product-marketing-sync, brief all features, morning scan, scan channel, process the feature queue.
---

# Feature Scan

> One command. Every new feature gets a brief + draft content in Ripple.

## How It Works

```
1. SCAN  #product-marketing-sync for feature announcements
2. CHECK Ripple for existing briefs (skip duplicates)
3. GENERATE brief + draft content for each new feature
4. PUSH   to Ripple (FeatureBrief + Content entities)
5. NOTIFY post condensed summaries back to Slack (with approval)
```

---

## Step 1: Scan the Channel

```
Tool: slack_read_channel
Channel ID: C0A8DTGTHBK
Limit: 100
```

### What to Extract

Look for **bot announcements** from "Product Marketing Sync Updates" with `:new: New Feature:` prefix. Parse each one:

| Field | Where |
|-------|-------|
| `feature_name` | Title after ":new: New Feature:" |
| `eta` | After ":date: ETA:" |
| `owner` | After ":bust_in_silhouette: Owner(s):" |
| `developer` | After ":male-technologist: Developer:" |
| `whats_new` | After ":sparkles: What's New:" |
| `who_for` | After ":dart: Who Is This For:" |
| `why_building` | After ":bulb: Why We're Building This:" |
| `slack_channel` | After ":speech_balloon: Slack:" (extract channel link/ID) |
| `marketing_channels` | After ":mega: Marketing Activities Demand:" (bullet list) |
| `showcase_link` | After ":link: Showcase:" (if present) |
| `figma_link` | After ":art: Figma:" (if present) |

Also parse **date update messages** from the bot with `:date: Release Date Updated:` prefix. These update the ETA of a previously announced feature. When found, update the matching feature's `eta` field before processing.

| Field | Where |
|-------|-------|
| `feature_name` | Title after "Release Date Updated:" |
| `previous_date` | After "Previous Date:" (strikethrough) |
| `new_date` | After "New Date:" (bold) |

Also capture **non-bot feature mentions** from team members (Ron, Rotem, Maor) that reference new features not covered by bot announcements. These are secondary. Flag them but don't auto-process.

### Lookback Window

Default: **14 days** from today. Only process announcements within this window.

Override: User can say "scan last 7 days" or "scan last 30 days".

---

## Step 2: Check Ripple for Duplicates

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY"
```

For each scanned feature, match against existing briefs:

| Match | Action |
|-------|--------|
| Brief exists, updated < 24h ago | **SKIP** (already fresh) |
| Brief exists, updated > 24h ago | **FLAG** (offer to refresh) |
| No brief exists | **PROCESS** (new feature) |

**Fuzzy matching:** Normalize names before comparing. "New Model- GPT 5.4" matches "GPT 5.4". "Figma <> Base44" matches "Figma to Base44". Strip prefixes like "New Feature:", "New Model-", etc.

### Show Summary Before Processing

```
Feature Scan: #product-marketing-sync (last 14 days)

Found: 6 feature announcements
Already briefed: 4 (skipped)
  - GPT 5.4 (briefed 2h ago)
  - Figma <> Base44 (briefed 3h ago)
  - UoU Connectors (briefed 3h ago)
  - Connectors Win (briefed 3h ago)
Needs refresh: 0
New (will process): 2
  - Themes - Phase 1 (ETA: Mar 8)
  - Uploading Files From Drive (ETA: Mar 8)
Flagged (non-bot, manual review):
  - Android SHA key for Google Play (community candidate)

Processing 2 new features...
```

**Always show this summary and wait for user confirmation before processing.**

---

## Step 3: Generate Brief + Content

For each new feature, run the full feature-brief pipeline:

### 3a. Get More Context

If the feature has a dedicated `feat-*` Slack channel:
```
Tool: slack_read_channel
Channel ID: [extracted_id]
Limit: 100
```
Read threads with 3+ replies for deeper context.

If no dedicated channel exists, use:
- The bot announcement fields
- Any related messages in #product-marketing-sync (search by feature name)
- Feature entity from Product App (if exists)

### 3b. Generate Brief

Read `agents/shared-instructions.md` and `brands/base44/RULES.md` before generating.

**Brief fields:**

| Field | Content |
|-------|---------|
| `feature_name` | Clean title |
| `status` | "draft" |
| `source` | "slack_mcp" |
| `eta` | From announcement |
| `owner` | From announcement |
| `description` | 2-3 sentences. What it does + why it matters. |
| `target_audience` | Specific segments from "Who Is This For" |
| `competitive_angle` | How Base44 does it differently |
| `hooks` | 3 marketing hooks with target audience and channel |
| `key_message` | One-liner for all channels |

### 3c. Generate Draft Content

Using the brief, generate content for all requested marketing channels:

| Slot | Generate if requested |
|------|----------------------|
| `whats_new` | Always (changelog style, 2-3 sentences) |
| `linkedin_base44` | If "LinkedIn - Base44" in marketing_channels |
| `linkedin_maor` | If "LinkedIn - Maor's" in marketing_channels |
| `x_base44` | If "X - Base44" in marketing_channels |
| `x_maor` | If "X - Maor's" in marketing_channels |
| `community` | If "Community" in marketing_channels |

**Voice rules apply to ALL content.** Read shared-instructions.md.

### 3d. Brand Guardian Check

Run each piece of content through brand-guardian rules:
- No em dashes, no arrows, no AI filler
- "Builders" not "users/customers"
- "Ship" not "deploy/launch"
- Maor Test for Maor's slots
- Every line must reference something real from Slack

---

## Step 4: Push to Ripple

### 4a. FeatureBrief Entity

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/feature-brief-[name].json
```

**Payload:**
```json
{
  "feature_name": "Feature Title",
  "status": "draft",
  "source": "slack_mcp",
  "eta": "2026-03-08",
  "owner": "Owner Name",
  "description": "...",
  "target_audience": "...",
  "competitive_angle": "...",
  "hooks": "1. ... 2. ... 3. ...",
  "key_message": "...",
  "slack_context": "Source: #product-marketing-sync + #feat-[name] (N messages, N threads)"
}
```

### 4b. Content Entity (one per channel)

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/Content" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/content-[name]-[channel].json
```

**Payload per channel:**
```json
{
  "title": "Feature Title - Channel Name",
  "content_type": "linkedin|x_twitter|whats_new|community",
  "status": "draft",
  "body": "The actual post content",
  "feature_brief_id": "[FeatureBrief record ID]"
}
```

### 4c. MarketingActivity (Product App)

Also write to MarketingActivity in Product App, same as feature-brief Step 4a.

```bash
PRODUCT_API_KEY=$(python3 -c "import json; c=json.load(open('.claude/marketing/api-config.json')); print(c.get('product_app_api_key', c.get('api_key')))") && \
curl -s -X POST "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $PRODUCT_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/marketing-activity-[name].json
```

---

## Step 5: Notify Slack

### Anti-Spam Rules

1. **Never auto-post.** Always show all draft messages and ask for confirmation.
2. **Check for existing notifications.** Search the channel for "Marketing Brief: [feature name]" before posting. If found, skip or offer to post as a thread reply (update).
3. **Max 5 messages per run.** If more features, batch remaining into a single summary message.
4. **One message per feature.** Don't flood with separate messages for each content piece.

### Check for Existing Posts

```
Tool: slack_search_public
Query: "Marketing Brief" in:#product-marketing-sync
```

Match results against features being processed. Skip any already posted.

### Message Format

```
Tool: slack_send_message
Channel ID: C0A8DTGTHBK
```

**Per-feature message:**
```
:clipboard: *Marketing Brief: [Feature Title]*
[One-liner description]

*Why it matters:* [Builder value in 1-2 sentences]

*Hooks:*
1. [Best hook]
2. [Second hook]

*Content ready:* [list of channels with drafts]
*Status:* [ETA] | draft - ready for team review

<https://app.base44.com/apps/69809e95545ed2e086d167f9/entities/FeatureBrief/[BRIEF_ID]|Full brief in Ripple> | <https://app.base44.com/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/[MA_ID]|Content in Product App>
```

**Batch summary (if > 5 features):**
```
:clipboard: *Marketing Scan: [N] new briefs generated*

1. *[Feature 1]* - [one-liner] | <link|Brief> | <link|Content>
2. *[Feature 2]* - [one-liner] | <link|Brief> | <link|Content>
3. *[Feature 3]* - [one-liner] | <link|Brief> | <link|Content>

All drafts ready for review in Ripple.
```

---

## Step 6: Report

After processing, show:

```
Feature Scan Complete
Source: #product-marketing-sync (last 14 days)

Processed: [K] new features
Skipped: [M] (already briefed)

Per feature:
[check] [Feature 1]
   Brief: Ripple [ID]
   Content: LinkedIn, X, What's New, Community
   MarketingActivity: [ID]
   Slack: posted / skipped

[check] [Feature 2]
   Brief: Ripple [ID]
   Content: What's New, LinkedIn, X
   MarketingActivity: [ID]
   Slack: posted / skipped

Flagged for manual review:
- [Minor feature] (community-only candidate, no bot announcement)
```

---

## Using with /loop

This skill works with the built-in `/loop` command for recurring scans:

```
/loop 30m /feature-scan
```

This runs a scan every 30 minutes while your session is open. The duplicate check ensures no feature is processed twice.

---

## Dependencies

- **Slack MCP** - `slack_read_channel`, `slack_search_public`, `slack_send_message`
- **Ripple API** - FeatureBrief + Content entities (read + write)
- **Product App API** - MarketingActivity entity (write)
- **Brand rules** - `agents/shared-instructions.md` + `brands/base44/RULES.md`
- **Feature-brief skill** - Reuses the content generation logic from Steps 3-4
