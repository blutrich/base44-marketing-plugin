---
name: feature-intel
description: |
  DISCOVERY scan across all feat-* channels. Single-pass intelligence scan that gives marketing a complete picture every run:
  new features, status updates, release dates, delays, shipped features, and gaps.
  Posts a unified daily digest to #features-intel-changelog-4marketing.

  Sources: #feat-* channels + #product-marketing-sync + Feature entity API.
  Designed for /loop 12h — runs twice daily (morning + evening).

  Triggers on: feature intel, scan feat channels, what's being built,
  feature discovery, feature radar, morning intel, what features are coming.
---

# Feature Intelligence

> One scan. Complete picture. Every day.

## Why This Exists

Marketing needs to know: what's being built, what's shipping soon, what slipped, and what just went live. Today that info is scattered across 60+ feat channels, #product-marketing-sync bot announcements, and the Feature entity. This skill consolidates everything into a single daily digest.

## The Single Pass

Every run executes ALL of these in sequence, then posts ONE unified digest:

```
1. DISCOVER    Search Slack for all #feat-* channels > find NEW ones
2. READ NEW    Read new channels for context (what, who, when, why)
3. RELEASES    Read #product-marketing-sync for ETAs, delays, shipped features
4. CALENDAR    Pull Feature entity + MarketingActivity from Product App API
5. UPDATES     Re-read active channels with recent digests > detect changes
6. RE-CHECK    Re-read channels that had no content previously
7. COMPILE     Build unified digest: new + updates + release tracker + gaps
8. POST        Send to #features-intel-changelog-4marketing-4marketing (summary + thread cards)
9. TRACK       Update known-channels.md state file
```

---

## Step 1: Discover New Feat Channels

```
Tool: slack_search_channels
Query: feat-
```

Paginate through ALL results. Compare against `known-channels.md`.

| Found | Action |
|-------|--------|
| Not in known list | > NEW — read in Step 2 |
| In list, status `active` | > check in Step 4 |
| In list, status `new` (no content yet) | > re-check in Step 5 |
| In list, status `shipped`/`archived` | > SKIP |
| `deployed-feat-*` / `feature-flags-*` / `e2e-*` prefix | > SKIP (excluded) |

---

## Step 2: Read New Channels

For each new channel:

```
Tool: slack_read_channel
Channel ID: [channel_id]
Limit: 50
Response format: concise
```

Extract:
| Field | Look for |
|-------|----------|
| `what` | First messages usually describe what's being built |
| `who` | Channel creator + active participants |
| `when` | Any ETA/timeline mentioned |
| `why` | Business reason, user request, competitive pressure |
| `status` | How far along? Design? Development? Testing? |

Filter out noise: join messages, canvas notifications, emoji-only replies, channel renames.

If channel has ONLY joins and no real content > mark as `new` with no digest. Step 5 will re-check next run.

**Translate Hebrew to English. Keep names as-is.**

---

## Step 3: Read #product-marketing-sync

This is the **richest structured source** — the bot posts ETAs, owners, delays, and ship confirmations.

```
Tool: slack_read_channel
Channel ID: C0A8DTGTHBK
Limit: 50
Response format: concise
```

Parse bot messages for:

| Signal | Pattern | Extract |
|--------|---------|---------|
| **New feature announced** | `:new: New Feature:` | Title, ETA, owner, developer, what's new, who it's for, why, showcase link, Figma, Slack channel, marketing activities requested |
| **ETA changed** | `:date: Release Date Updated:` | Feature name, previous date, new date, owner |
| **Feature shipped** | `:rocket:` + `has been released` or `Feature Released:` | Feature name, release date, owner |
| **Manual announcements** | Ron/Tiffany/team messages | Launch plans, community teasers, timing decisions |

Also parse human messages for:
- Launch timing discussions ("Wednesday", "Thursday", "big announcement on 23.3")
- Feature status updates ("X is LIVE!")
- Marketing channel requests ("just what's new and community")

### Build the Release Calendar

From all parsed data, build a structured view:

```
SHIPPED (last 7 days):
  [Feature] — shipped [date] — owner: [name]

SHIPPING TODAY:
  [Feature] — ETA [today] — owner: [name] — on time? [yes/delayed from X]

THIS WEEK:
  [Feature] — ETA [date] — owner: [name] — on time? [yes/delayed X days]

NEXT WEEK+:
  [Feature] — ETA [date] — owner: [name] — on time? [yes/delayed X days]
```

### Cross-Reference with Feat Channels

Match #product-marketing-sync features to known feat channels by name. This links:
- Structured ETA data > to channel-level context
- Ship confirmations > to channels that should be marked `shipped`
- Marketing activity requests > to content the team needs to prepare

---

## Step 4: Pull Feature Calendar + Marketing Gaps

Query the Product App for the Feature entity and MarketingActivity entity. This gives the **real** release calendar and shows which features have marketing content prepared.

### 4a. Read API key

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])")
```

### 4b. Pull Feature entity (release calendar)

```bash
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/Feature" \
  -H "api_key: $API_KEY" -H "Content-Type: application/json"
```

For each non-archived feature, extract:
- `title`, `eta`, `status` (new/in_progress/ready/released/on_going/pending)
- `tier` (tier_1/tier_2/tier_3), `owners`, `developer`
- `marketing_description` (has content? ✓/✗)
- `marketing_owner`, `marketing_release_date`
- `slack_channel_id`, `showcase_link`, `figma_link`
- `hide_from_marketing` (skip if true)

### 4c. Pull MarketingActivity entity (content readiness)

```bash
curl -s "https://app.base44.com/api/apps/692b72212d45f3a5bc07e7ae/entities/MarketingActivity" \
  -H "api_key: $API_KEY" -H "Content-Type: application/json"
```

For each activity, extract:
- `title`, `status`, `approval_status`, `date`
- `feature_id` (links to Feature entity)
- Content slot flags: `has_linkedin_base44`, `has_linkedin_maor`, `has_x_base44`, `has_x_maor`, `has_community`, `has_whats_new`

### 4d. Build Gap Analysis

Cross-reference Feature (what's shipping) with MarketingActivity (what's prepared):

| Gap Type | Condition |
|----------|-----------|
| **No marketing at all** | Feature has ETA in next 14 days, status in_progress/ready, no MarketingActivity exists |
| **Activity exists but empty** | MarketingActivity exists but all content slot flags are false |
| **Missing channels** | Activity exists, some slots filled, but key channels empty (LinkedIn, X) |
| **Shipped without brief** | Feature status = released, no marketing_description |

**Priority order for gaps:**
1. Ships today/tomorrow with no content > CRITICAL
2. Ships this week with no content > HIGH
3. Ships next week with no content > MEDIUM
4. Shipped already with no announcement > LOW (retroactive)

---

## Step 5: Re-Read Active Channels for Updates

Select channels where:

- Status is `active` AND Last Digest exists (within last 14 days)
- Cap: up to 10 channels per run (prioritize by recency)

Read new messages and look for change signals:

| Change Type | Signal Keywords |
|-------------|----------------|
| **Status change** | "shipped", "live", "released", "deployed", "in QA", "ready for review", "postponed", "blocked" |
| **ETA set/changed** | Date mentions, "next week", "targeting", "pushed to", "moved to" |
| **Scope change** | "cut", "descoped", "added", "phase 2", "out of scope" |
| **New decision** | "decided", "going with", "confirmed", "approved", "the plan is" |
| **Blocker** | "blocked", "waiting on", "dependency", "can't proceed" |
| **Near ship** | "PR ready", "deploying", "velino link", "QA passed" |

**Threshold:** Only flag genuinely meaningful changes. Skip minor discussion, questions without answers, incremental progress.

---

## Step 6: Re-Check Empty Channels

Select channels where status is `new` and Last Digest is `—`.

```
Tool: slack_read_channel
Channel ID: [channel_id]
Limit: 20
Response format: concise
```

- If real content found > process as new feature (extract context, add to digest)
- If still only joins > leave as `new`
- If 7+ days old with no content > mark as `stale`

---

## Step 7: Compile Unified Digest

Merge ALL findings into one structured digest. **Lead with discovery, then changes, then gaps.** Scale detail to the news — big discovery day gets full cards, quiet day gets 3 lines.

### Main Message Format

```
:satellite_antenna: *Feature Intel — [date]*

:new: *New Features Discovered ([N]):*
1. *[Feature]* — [one-liner] | [status] | <#channel>
2. *[Feature]* — [one-liner] | [status] | <#channel>

:arrows_counterclockwise: *Updates ([N]):*
• *[Feature]* — [what changed] (was: [old state])
• *[Feature]* — [what changed]

:rocket: *Shipped:*
• *[Feature]* — went live [date]

:calendar: *Coming Up:*
• *[Feature]* — ships [date] — [on time / delayed X days]
• *[Feature]* — ships [date] — [on time / delayed X days]

:warning: *Marketing Gaps:*
:red_circle: *[Feature]* — ships [date] — NO content. Run `/feature-brief [name]`
:large_orange_diamond: *[Feature]* — ships [date] — LinkedIn/X empty
:yellow_heart: *[Feature]* — ships next week — no brief yet

:clipboard: *Readiness ([N] features shipping in 14 days):*
:white_check_mark: Ready: [N] — [names]
:warning: Partial: [N] — [names] (missing: [channels])
:red_circle: Nothing: [N] — [names]

:point_right: *Action Items:*
1. [TODAY] `/feature-brief [name]` — ships tomorrow, no content
2. [THIS WEEK] Fill [LinkedIn/X] for [Feature]
3. [PLAN] Brief [Feature] — ships [date]

_Details in thread :thread:_
```

### Scaling Rules

| Day Type | What to Show |
|----------|-------------|
| Big discovery (3+ new) | Full digest, all sections, thread cards for each new feature |
| Normal day (1-2 new + updates) | All sections, thread cards for new features only |
| Quiet day (no new, minor updates) | Short message: "No new features. [N] updates: [one-liners]. Gaps unchanged." |
| Nothing changed | Skip posting. Say "No updates since last scan." |

### Omit Empty Sections

If no new features > skip `:new:` section. If no updates > skip `:arrows_counterclockwise:`. If no gaps > skip `:warning:`. Never show empty sections with "None" — just leave them out.

---

## Step 8: Post to #features-intel-changelog-4marketing-4marketing

**Channel:** `#features-intel-changelog-4marketing` (`C0AKHFFRS1Y`)

Post the compiled digest as a summary message. If there are 3+ individual feature cards (new features or significant updates), post them as thread replies.

> **Note:** Channel was renamed from `#features-intel-changelog-4marketing-4marketing` to `#features-intel-changelog-4marketing` on 2026-03-10.

### New Feature Card (thread reply)

```
:mag: *Feature Intel: [Feature Name]*

*What:* [1-2 sentences]
*Who:* [Team members]
*ETA:* [Date from sync bot / Feature entity / chat mention / "No ETA yet"]
*Status:* [Early / In Development / Testing / Near Ship / Shipped]

*Why it matters for marketing:*
[1-2 sentences — what to prepare]

*Source:* <#[channel_id]|#feat-[name]> + #product-marketing-sync
```

### Update Card (thread reply)

```
:arrows_counterclockwise: *Feature Update: [Feature Name]*

*Change:* [What changed]
*Previous:* [Old state]
*Now:* [New state]

*Source:* <#[channel_id]|#feat-[name]> (activity since [last digest])
```

### Shipped Card (thread reply)

```
:white_check_mark: *Feature Shipped: [Feature Name]*

Shipped [date]. Owner: [name].
> Run `/feature-brief [name]` for launch content.
```

### Anti-Spam Rules

1. **Never auto-post.** Always show the full draft digest and ask for confirmation.
2. **Dedup:** Search `#features-intel-changelog-4marketing` for feature names. Skip if already posted within 3 days (updates) or 7 days (new cards).
3. **Max 10 thread cards per run.** Summarize the rest in the main message.
4. **Only post if there's news.** If nothing changed since last run, say "No updates" and skip posting.
5. **Updates must be meaningful.** "Still in development" is not an update.

---

## Step 9: Update State

Update `known-channels.md`:
- Add new channels
- Update statuses (active > shipped when confirmed)
- Update Last Digest dates
- Update Last Known state summaries
- Mark shipped features from #product-marketing-sync confirmations
- Mark stale channels (7+ days, no content)

---

## ETA Priority

When multiple sources have ETAs for the same feature:

1. Feature entity `eta` field (source of truth — PM sets this)
2. #product-marketing-sync bot announcement date
3. MarketingActivity `date` field
4. Slack channel discussion mentions
5. "No ETA yet"

---

## State File Format

`known-channels.md` tracks all discovered feat channels:

```markdown
# Known Feat Channels

> Last full scan: 2026-03-10
> Total: 60 feat channels

## Active (created in last 14 days — high priority)

| Channel | ID | Created | Creator | Status | Last Digest | Last Known |
|---------|-----|---------|---------|--------|-------------|------------|
| feat-gift-card | C0XX... | 2026-03-07 | Raphael | active | 2026-03-10 | ETA Mar 12. Testing on Velino. |
```

Status values: `new` (no content yet), `active`, `shipped`, `archived`, `stale` (7+ days no content)

---

## Using with /loop

```
/loop 12h scan feat channels for new features via marketing plugin
```

Runs twice daily — morning scan catches overnight activity, evening scan catches the workday.

---

## Related Skills

| Skill | Relationship |
|-------|-------------|
| `feature-brief` | Deep-dive into a single feature. feature-intel discovers features; run `/feature-brief [name]` to generate full marketing content for one. |
| `feature-scan` | Batch processor for #product-marketing-sync announcements. Overlaps on source channel but different scope (scan processes and pushes to Ripple; intel discovers and digests). |

For heavy launch weeks:
```
/loop 4h scan feat channels for new features via marketing plugin
```

---

## Dependencies

- **Slack MCP** — `slack_search_channels`, `slack_read_channel`, `slack_search_public`, `slack_send_message`
- **State file** — `skills/feature-intel/known-channels.md`
- **Brand rules** — `agents/shared-instructions.md` + `brands/base44/RULES.md` (for digest copy)
- **#product-marketing-sync** — `C0A8DTGTHBK` (release tracker source)
- **#features-intel-changelog-4marketing** — `C0AKHFFRS1Y` (digest destination)
- **Product App API** — Feature entity (release calendar) + MarketingActivity entity (content readiness). Key in `.claude/marketing/api-config.json`

## Related Skills

- `feature-scan` — Scans `#product-marketing-sync` for structured announcements, generates briefs + content, pushes to Ripple. Use **after** feature-intel identifies what's coming.
- `feature-brief` — Deep-dive brief for a single feature. Use when marketing needs full content package for a specific feature.
- `launch-waterfall` — 7-phase structured launch process. feature-intel auto-triggers Phase 0 (Discovery) when it detects a significant new feature.

## Launch Waterfall Auto-Trigger (Phase 0)

When feature-intel discovers a significant new feature (not a bug fix or minor tweak), check if it's launch-worthy:

**Launch-worthy signals:**
- New product category (e.g., "agents", "marketplace", "API v2")
- Major feature with its own channel and 3+ team members
- Feature mentioned in #product-marketing-sync with a launch date
- CEO/founder discussing it in product channels

**If launch-worthy:**
1. Create directory: `output/launch/{feature-slug}/`
2. Auto-run Phase 0 (competitive landscape research via WebSearch)
3. Save Discovery Brief to `output/launch/{feature-slug}/phase-0-discovery-brief.md`
4. Include in digest: ":rocket: *Launch-worthy feature detected: {name}. Discovery Brief auto-generated. Run LAUNCH workflow when ready.*"

This gives marketing a head start. By the time the team gets the formal launch assignment, competitive research is already done.
