---
name: discovery-automation
description: |
  Headless daily automation that discovers new features from #product-marketing-sync, generates briefs + draft content, pushes to Ripple, and posts a daily digest to Slack — no confirmation gates, fully autonomous.

  Triggers on: daily discovery, run discovery, discovery automation, auto-discover, run daily, scheduled scan, autonomous scan, headless scan.
---

# Discovery Automation

> Designed for unattended daily runs. No confirmation gates. Always posts to Slack.

## How It Differs from feature-scan

| Behavior | feature-scan | discovery-automation |
|----------|-------------|----------------------|
| Lookback window | 14 days | 24 hours (configurable) |
| Confirmation gates | Yes — pauses before processing and before posting | None — runs end-to-end |
| Slack posting | Optional, requires approval | Always posts a daily digest |
| Idempotency | Duplicate check via Ripple | Duplicate check + state file |
| Intended use | Interactive session | Cron / GitHub Actions |

---

## Step 0: Idempotency Check

Before doing anything, check if a discovery run already happened today:

```bash
STATE_FILE=".claude/marketing/discovery-state.json"
TODAY=$(date +%Y-%m-%d)

if [ -f "$STATE_FILE" ]; then
  LAST_RUN=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('last_run_date',''))" 2>/dev/null)
  if [ "$LAST_RUN" = "$TODAY" ]; then
    echo "Discovery already ran today ($TODAY). Exiting."
    exit 0
  fi
fi
```

If already ran today, exit immediately. This prevents double-posting when the scheduler fires more than once due to retries.

---

## Step 1: Read the Channel (24h Lookback)

```
Tool: slack_read_channel
Channel ID: C0A8DTGTHBK
Limit: 100
```

**Parse only messages from the last 24 hours.** Check `ts` timestamps against `NOW - 86400`.

Extract feature announcements exactly as described in feature-scan Step 1 (bot messages with `:new: New Feature:` prefix, date updates, etc.).

Also check for **date update messages** (`:date: Release Date Updated:`) and update ETA on matching features.

---

## Step 2: Deduplicate Against Ripple

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY"
```

For each scanned feature:

| Match | Action |
|-------|--------|
| Brief exists, updated < 24h ago | **SKIP** — already processed |
| Brief exists, updated > 24h ago | **REFRESH** — re-run brief + content |
| No brief exists | **PROCESS** — new feature |

If zero new features found → post a "nothing new today" digest to Slack and exit cleanly.

---

## Step 3: Generate Brief + Content

For each new/refresh feature, run the full brief pipeline:

### 3a. Get Deeper Context

If feature has a `slack_channel_id`:
```
Tool: slack_read_channel
Channel ID: [extracted_id]
Limit: 50
```
Read threads with 3+ replies.

If no dedicated channel, use the bot announcement fields from Step 1.

### 3b. Brief Fields

Read `agents/shared-instructions.md` and `brands/base44/RULES.md` before generating.

| Field | Content |
|-------|---------|
| `feature_name` | Clean title (strip "New Feature:" prefix) |
| `status` | "draft" |
| `source` | "discovery_automation" |
| `eta` | From announcement |
| `owner` | From announcement |
| `description` | 2-3 sentences. What it does + why it matters. |
| `target_audience` | Specific segments from "Who Is This For" |
| `competitive_angle` | How Base44 does it differently |
| `hooks` | 3 marketing hooks with target + channel |
| `key_message` | One-liner for all channels |

### 3c. Draft Content (per requested channels)

| Slot | Generate if requested in announcement |
|------|---------------------------------------|
| `whats_new` | Always |
| `linkedin_base44` | If "LinkedIn - Base44" in marketing_channels |
| `linkedin_maor` | If "LinkedIn - Maor's" in marketing_channels |
| `x_base44` | If "X - Base44" in marketing_channels |
| `x_maor` | If "X - Maor's" in marketing_channels |
| `community` | If "Community" in marketing_channels |

### 3d. Brand Guardian Check (Inline)

Apply all rules from `brands/base44/RULES.md` and `agents/shared-instructions.md`:
- No em dashes, no arrows, no AI filler
- "Builders" not "users/customers"
- "Ship" not "deploy/launch"
- Maor Test for Maor's slots
- Every line must reference something real from Slack

---

## Step 4: Push to Ripple + Product App

### 4a. FeatureBrief (Ripple)

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
  "source": "discovery_automation",
  "eta": "2026-03-09",
  "owner": "Owner Name",
  "description": "...",
  "target_audience": "...",
  "competitive_angle": "...",
  "hooks": "1. ... 2. ... 3. ...",
  "key_message": "...",
  "slack_context": "Auto-discovered: #product-marketing-sync (N messages)"
}
```

### 4b. Content Entities (Ripple)

One per channel, same as feature-scan Step 4b.

### 4c. MarketingActivity (Product App)

```bash
PRODUCT_API_KEY=$(python3 -c "import json; c=json.load(open('.claude/marketing/api-config.json')); print(c.get('product_app_api_key', c.get('api_key')))") && \
curl -s -X POST "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $PRODUCT_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/marketing-activity-[name].json
```

Set `approval_notes` to: `"Auto-generated by discovery-automation. Source: #product-marketing-sync. Run date: [TODAY]."`

---

## Step 5: Post Daily Digest to Slack

Always post. No confirmation gate.

### Check for Existing Digest Today

```
Tool: slack_search_public
Query: "Daily Feature Discovery" after:[YESTERDAY_DATE] in:#product-marketing-sync
```

If a digest for today already exists in the channel, **skip posting** (idempotency via Slack).

### Channel

`#product-marketing-sync` (`C0A8DTGTHBK`)

### Digest Format — New Features Found

```
:rocket: *Daily Feature Discovery — [DATE]*

[N] new feature[s] briefed automatically:

1. *[Feature Name]* — [key_message one-liner]
   ETA: [date] | Owner: [name]
   Channels: [list]
   <https://app.base44.com/apps/69809e95545ed2e086d167f9/entities/FeatureBrief/[ID]|Brief> · <https://app.base44.com/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/[ID]|Content>

2. *[Feature Name]* — [key_message one-liner]
   ETA: [date] | Owner: [name]
   Channels: [list]
   <https://app.base44.com/apps/69809e95545ed2e086d167f9/entities/FeatureBrief/[ID]|Brief> · <https://app.base44.com/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity/[ID]|Content>

All drafts in Ripple — ready for team review.
```

### Digest Format — Nothing New Today

```
:white_check_mark: *Daily Feature Discovery — [DATE]*

No new feature announcements in the last 24 hours. Nothing to brief.
```

### Digest Format — Refreshed Briefs

When a feature had an existing brief but ETA or details changed, append:

```
:arrows_counterclockwise: *Refreshed:*
- [Feature Name] — ETA updated to [new_date]
```

---

## Step 6: Update State File

After a successful run, write the state file to prevent duplicate runs:

```bash
python3 -c "
import json, datetime
state = {
    'last_run_date': datetime.date.today().isoformat(),
    'last_run_ts': datetime.datetime.utcnow().isoformat(),
    'features_processed': [LIST_OF_NAMES],
    'features_skipped': [LIST_OF_NAMES],
    'slack_posted': True
}
json.dump(state, open('.claude/marketing/discovery-state.json', 'w'), indent=2)
"
```

---

## Lookback Window Override

Default: **24 hours**. Can be overridden when invoked:

| Invocation | Window |
|------------|--------|
| `run discovery` | 24 hours |
| `run discovery last 48h` | 48 hours |
| `run discovery last 7 days` | 7 days |
| `run discovery since Monday` | Calculate days since Monday |

---

## Error Handling

| Error | Action |
|-------|--------|
| Slack MCP unavailable | Log to `.claude/marketing/discovery-errors.log`, exit cleanly |
| API key missing | Log error, exit with non-zero code |
| Feature brief generation fails | Log feature name, skip it, continue with remaining |
| Ripple push fails | Log error, still post Slack digest with note: "(Ripple push failed — retry manually)" |
| Zero features in channel | Post "nothing new" digest, update state, exit 0 |

Log all errors:
```bash
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ERROR: $MESSAGE" >> .claude/marketing/discovery-errors.log
```

---

## Dependencies

- **Slack MCP** — `slack_read_channel`, `slack_search_public`, `slack_send_message`
- **Ripple API** — FeatureBrief + Content entities (read + write)
- **Product App API** — MarketingActivity entity (write)
- **Brand rules** — `agents/shared-instructions.md` + `brands/base44/RULES.md`
- **feature-scan skill** — Shares content generation logic (Steps 3-4)
- **State file** — `.claude/marketing/discovery-state.json` (idempotency)
