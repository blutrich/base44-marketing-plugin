---
name: feature-intel
description: |
  Scans Slack for #feat-* channels to detect new features in development BEFORE they ship.
  Posts marketing-ready digests to #new-features-intel so Tiffany and the marketing team
  can prepare ahead of time instead of chasing 20+ channels manually.

  Triggers on: feature intel, scan feat channels, new features, what's being built,
  feature discovery, feature radar, morning intel, daily scan, what features are coming.
---

# Feature Intelligence

> Early warning system. Catch features while they're being built, not after they ship.

## Why This Exists

Developers open `#feat-*` channels when they start building something. Marketing finds out weeks later when it hits `#base-product-updates`. This skill closes that gap by scanning for new feat channels daily and posting digests so marketing can prepare content, assets, and launch plans early.

**Key rule:** Already-shipped features are NOT useful here. This is about what's coming, not what's done.

## How It Works

```
1. DISCOVER  Search Slack for all #feat-* channels
2. DETECT    Compare against known channels → find NEW ones
3. FILTER    Skip shipped/archived/stale channels
4. READ      Read new channels for context (what, who, when, why)
5. ENRICH    Cross-reference with #product-marketing-sync for structured data
6. DIGEST    Post intel summaries to #new-features-intel
7. TRACK     Update known channels state file
```

---

## Step 1: Discover All Feat Channels

```
Tool: slack_search_channels
Query: feat-
```

Paginate through ALL results. Feat channels follow patterns:
- `#feat-[feature-name]` (most common)
- `#feat-[feature-name]-[phase]`

Collect: channel ID, name, creation date, member count, purpose/topic.

---

## Step 2: Detect New Channels

Read the known channels state file:

```
Read(file_path="plugins/base44-marketing/skills/feature-intel/known-channels.md")
```

Compare discovered channels against the known list.

| Status | Action |
|--------|--------|
| **New channel** (not in known list) | → READ + DIGEST |
| **Known, active** (in list, not shipped) | → Check for significant new activity (optional) |
| **Known, shipped** (in list, marked shipped) | → SKIP |
| **Archived channel** | → SKIP |

---

## Step 3: Filter Out Shipped Features

A feature is likely **shipped** if:
- Channel has messages containing "shipped", "live", "released", "deployed", "merged to main"
- Channel has had no activity in 14+ days
- Channel topic/purpose contains "shipped" or "done" or "completed"
- The feature appears in `#base-product-updates` release notes

A feature is **in development** if:
- Channel was created recently (last 30 days)
- Channel has recent activity (messages in last 14 days)
- No "shipped" signals found

**When uncertain, include it.** Better to surface a shipped feature than miss one in development.

---

## Step 4: Read New Channels

For each new/active channel:

```
Tool: slack_read_channel
Channel ID: [channel_id]
Limit: 50
```

Extract:
| Field | Look for |
|-------|----------|
| `what` | First messages usually describe what's being built |
| `who` | Channel creator + active participants = dev team |
| `when` | Any ETA/timeline mentioned? Target dates? |
| `why` | Business reason, user request, competitive pressure |
| `status` | How far along? Design phase? In development? Testing? |
| `blockers` | Any issues or dependencies mentioned? |

Also read any pinned messages or canvas — these often have specs.

---

## Step 5: Enrich with Product-Marketing-Sync

Check if this feature has a structured announcement in `#product-marketing-sync`:

```
Tool: slack_search_public
Query: [feature name] in:#product-marketing-sync
```

If found, pull the structured fields (ETA, owner, marketing channels requested, etc.) from the bot announcement format. This gives marketing-specific context the feat channel won't have.

---

## Step 6: Post Digest to #new-features-intel

**Channel:** `#new-features-intel` (`C0AKHFFRS1Y`)

### Per-Feature Intel Card

```
Tool: slack_send_message
Channel ID: C0AKHFFRS1Y
```

**Format:**

```
:mag: *Feature Intel: [Feature Name]*

*What:* [1-2 sentences — what is being built]
*Who:* [Dev team members working on it]
*When:* [ETA if known, or "no timeline yet"]
*Status:* [Early / In Development / Testing / Near Ship]

*Why it matters for marketing:*
[1-2 sentences — why marketing should care, what to prepare]

*Source:* <#[channel_id]|#feat-[name]> ([N] messages, created [date])
```

### Batch Summary (if 3+ new features)

Post a summary first, then individual cards as thread replies:

```
:satellite: *Feature Intel Scan — [Date]*

[N] new features detected across feat channels:

1. *[Feature 1]* — [one-liner] | [status]
2. *[Feature 2]* — [one-liner] | [status]
3. *[Feature 3]* — [one-liner] | [status]

Details in thread :point_down:
```

### Anti-Spam Rules

1. **Never auto-post.** Always show draft messages and ask for confirmation.
2. **Check for existing posts.** Search `#new-features-intel` for the feature name before posting. Skip if already posted within 7 days.
3. **Max 10 cards per run.** Batch the rest into a summary with channel links.
4. **No shipped features.** Double-check each feature isn't already released before posting.

---

## Step 7: Update Known Channels

After processing, update the state file:

```
Edit(file_path="plugins/base44-marketing/skills/feature-intel/known-channels.md")
```

Add new channels with: name, ID, first seen date, status (active/shipped), last digest date.

---

## Using with /loop

```
/loop 24h /feature-intel
```

Runs daily. The known-channels state file prevents duplicate processing.

For more frequent checks during heavy development periods:
```
/loop 4h /feature-intel
```

---

## State File Format

`known-channels.md` tracks all discovered feat channels:

```markdown
# Known Feat Channels

| Channel | ID | First Seen | Status | Last Digest | Notes |
|---------|-----|-----------|--------|-------------|-------|
| feat-gift-card | C0XX... | 2026-03-01 | active | 2026-03-09 | ETA Mar 15 |
| feat-data-api | C0YY... | 2026-02-20 | shipped | 2026-02-25 | Shipped Feb 28 |
```

Status values: `new`, `active`, `shipped`, `archived`, `stale`

---

## Dependencies

- **Slack MCP** — `slack_search_channels`, `slack_read_channel`, `slack_search_public`, `slack_send_message`
- **State file** — `skills/feature-intel/known-channels.md`
- **Brand rules** — `agents/shared-instructions.md` + `brands/base44/RULES.md` (for digest copy)
- **Destination** — `#new-features-intel` (`C0AKHFFRS1Y`)

## Related Skills

- `feature-scan` — Scans `#product-marketing-sync` for structured announcements, generates briefs + content, pushes to Ripple. Use **after** feature-intel identifies what's coming.
- `feature-brief` — Deep-dive brief for a single feature. Use when marketing needs full content package.
