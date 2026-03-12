---
name: feature-brief
description: |
  SINGLE named feature deep-dive. Reads the Feature Calendar, pulls live Slack channel context for ONE specific feature, generates brand-voice marketing content, and writes it to MarketingActivity (per-channel slots) and Feature (marketing_description). Replaces generic AI filler with real content sourced from Slack discussions.

  Triggers on: feature brief, brief me on, what is [feature], feature context, summarize channel, summarize feature, slack summary, channel summary, pull feature brief, update brief, fetch feat, read feat channel, what's in feat, fill marketing for, feature calendar.

  Disambiguation: For batch processing of the #product-marketing-sync queue use feature-scan. For discovery across all feat-* channels use feature-intel. This skill is for single-feature deep dives only.
---

# Feature Brief

> Feature Calendar > Slack > Marketing Content > Write Back

## The Pipeline

```
1. FIND the feature (Feature entity or Slack channel search)
2. READ the Slack channel + threads (live via Slack MCP)
3. GENERATE content (overview + 6 channel slots, brand-voice)
4. WRITE back (MarketingActivity + Feature.marketing_description)
```

Every step falls through to the next available source. No manual mode selection needed.

---

## API Reference

| System | App ID | Purpose |
|--------|--------|------|
| Product App | `692b72212d45f3a5bc07e7ae` | Feature entity (read) + MarketingActivity entity (write) + Feature.marketing_description (write) |
| Ripple | `69809e95545ed2e086d167f9` | FeatureBrief entity (optional storage) |

**Credentials:** `.claude/marketing/api-config.json` (contains `api_key` and `product_app_api_key`)

**Read Product App key:**
```bash
PRODUCT_API_KEY=$(python3 -c "import json; c=json.load(open('.claude/marketing/api-config.json')); print(c.get('product_app_api_key', c.get('api_key')))")
```

---

## Step 1: Find the Feature

Try these sources in order until one works:

### 1a. Feature Entity (preferred)

```bash
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/Feature" \
  -H "api_key: $PRODUCT_API_KEY"
```

Search by title (fuzzy match). Extract from the record:
- `title`, `why_building`, `who_is_this_for`, `whats_new`, `tier`, `owners`
- `showcase_link`, `figma_link`, `media_urls`
- `slack_channel_id` — **critical**, used in Step 2
- `comments` — sometimes has PM opinions on marketing timing
- `eta` — for setting the MarketingActivity `date` field

**To scan upcoming features** ("what's launching this week?"):
```bash
# Filter non-archived features with ETA in next 14 days
```

### 1b. Slack Channel Search (fallback)

If no Feature record exists, search Slack directly:
```
Tool: slack_search_channels
Query: "feat-[feature-name]"
```

### 1c. Ripple (last resort)

Only if Slack MCP is unavailable:
```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY"
```

Warn: "This brief is from Ripple storage and may be stale."

---

## Step 2: Read the Slack Channel

### Parse slack_channel_id

The Feature entity stores channel IDs in **3 inconsistent formats**:

| Format | Example | Extract |
|--------|---------|---------|
| Raw ID | `C0ACWR9VCFL` | Use directly |
| Archive URL | `https://base44workspace.slack.com/archives/C0AE2A6B45C` | Extract last path segment |
| Invite URL | `https://join.slack.com/share/enQtMTA1...` | Can't extract — search Slack by feature name instead |

### Read Messages + Threads

```
Tool: slack_read_channel
Channel ID: [parsed_id]
Limit: 100
```

Then read key threads (where decisions and details live):
```
Tool: slack_read_thread
Channel ID: [channel_id]
Message TS: [parent_ts]
```

**Read threads with 3+ replies.** Skip bot notifications, emoji-only replies, join messages.

### Filter Noise

Strip before processing:
- `joined #channel` / `was added to #channel by`
- `made updates to` canvas notifications
- Mixpanel bot formatting (keep meaningful data)
- Empty messages (file-only)
- Single-word reactions ("nice!", "yayyy", "cool")
- Slack invitation links
- Channel rename notifications

### Hebrew/English

Translate Hebrew to English in all output. Keep names as-is.

---

## Step 3: Generate Content

Using Slack context + Feature entity metadata, generate content for **all MarketingActivity fields**. Read `agents/shared-instructions.md` and `brands/base44/RULES.md` before generating.

### Overview Fields

| Field | What to Write |
|-------|--------------|
| `description` | 2-3 sentences. What it does + why it matters. Plain language. |
| `goals` | Marketing goals specific to THIS feature. Never generic "increase brand awareness." |
| `concepts` | Marketing hooks with target audience and channel. Competitive angle + builder value + vision angle. |
| `target_audience` | Specific segments who benefit from THIS feature. Never generic demographics. |

### Channel Slots

| Slot | Voice |
|------|-------|
| `linkedin_base44_content` | Company page. Feature announcement, what builders get, concrete example. |
| `linkedin_maor_content` | Maor's personal. Casual, "I noticed...", behind-the-scenes. |
| `x_base44_content` | Short. Feature > benefit > proof. Under 280 chars ideal. |
| `x_maor_content` | Lowercase, direct, shipped-something tone. |
| `community_content` | Discord/Reddit. Conversational, invite feedback, explain the "how". |
| `whats_new_content` | Changelog style. Feature name header, 2-3 sentences, no fluff. |

### Voice Rules (ALL slots)

- "Builders" not "users/customers"
- "Ship" not "deploy/launch"
- No "we're excited to announce"
- Every line must reference something from the actual Slack channel
- Maor Test: Would Maor post this exactly as written?

---

## Step 4: Write Back

### 4a. MarketingActivity

Check if one exists for this feature first:
```bash
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $PRODUCT_API_KEY"
```

Search by `feature_id` or title match. **If exists > PUT (update). If not > POST (create).**

When updating, preserve fields already filled by the team (media_urls, approval_reviewers).

**Payload:**
```json
{
  "title": "Feature Title",
  "feature_id": "feature-record-id",
  "activity_type": "feature_launch",
  "status": "pending",
  "approval_status": "draft",
  "date": "2026-03-09",
  "description": "...",
  "goals": "...",
  "concepts": "...",
  "target_audience": "...",
  "owner": "Ofer",
  "approval_notes": "Generated by Marketing Plugin from #feat-[name] ([N] messages, [N] thread replies). Source: Slack MCP live fetch.",
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
  "community_content": "..."
}
```

**IMPORTANT:** Always `status: "pending"` and `approval_status: "draft"` to match the team's pattern.

**Create:**
```bash
curl -s -X POST "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $PRODUCT_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/marketing-activity.json
```

**Update:**
```bash
curl -s -X PUT "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/[RECORD_ID]" \
  -H "api_key: $PRODUCT_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/marketing-activity.json
```

### 4b. Feature.marketing_description

```bash
curl -s -X PUT "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/Feature/[FEATURE_ID]" \
  -H "api_key: $PRODUCT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"marketing_description": "..."}'
```

**Format:**
```
[2-3 sentence summary]

Competitive edge: [how Base44 does it differently]

Key hooks:
1. "[Hook]" (Target: [audience], Channel: [platform])
2. "[Hook]" (Target: [audience], Channel: [platform])
3. "[Hook]" (Target: [audience], Channel: [platform])
```

### 4c. Ripple (default)

Push to FeatureBrief entity after every brief. Add `source: "slack_mcp"` to track origin. Skip only if user explicitly says not to.

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/feature-brief.json
```

---

## Step 5: Announce in Slack (optional)

Only when the user explicitly says **"post to slack"**, **"announce"**, or **"notify the team"**.

### Channel
Default: `#product-marketing-sync` (`C0A8DTGTHBK`)

### How
```
Tool: slack_send_message
Channel ID: C0A8DTGTHBK
```

### Message Format
```
📋 *Feature Brief: [Feature Title]*

*Status:* pending (draft) — ready for team review
*Source:* #feat-[name] ([N] messages, [N] threads read)

*Slots filled:*
• LinkedIn Base44 ✓
• LinkedIn Maor ✓
• X Base44 ✓
• X Maor ✓
• Community ✓
• What's New ✓
• Overview (goals, description, concepts, target_audience) ✓

<https://app.base44.com/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/[RECORD_ID]|View MarketingActivity >>
```

### Rules
- **Never auto-post.** Always show the draft message and ask for confirmation before sending.
- If the user specifies a different channel, use that instead.
- Include only slots that were actually filled (don't list empty ones as ✓).
- After posting, add to the report: `✓ Slack: announced in #product-marketing-sync`

---

## Report

After writing, confirm:

```
Feature: [title]
Source: #feat-[name] ([N] messages, [N] threads)

✓ MarketingActivity [created/updated] (ID: [id])
  LinkedIn Base44 / LinkedIn Maor / X Base44 / X Maor / Community / What's New
  Overview: goals, description, concepts, target_audience
✓ Feature card: marketing_description updated
○ Ripple: [pushed/skipped]
○ Slack: [announced in #product-marketing-sync / skipped]

Status: pending (draft) — ready for team review
```

---

## Dependencies

- **Base44 REST API** — Feature + MarketingActivity entities (read + write)
- **Slack MCP** — `slack_search_channels`, `slack_read_channel`, `slack_read_thread`, `slack_send_message`
- **Brand rules** — `agents/shared-instructions.md` + `brands/base44/RULES.md`
- **Optional** — Ripple API for FeatureBrief storage
