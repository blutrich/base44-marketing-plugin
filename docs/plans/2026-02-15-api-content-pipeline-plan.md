# Base44 API Content Pipeline -- Implementation Plan

> **For Claude:** REQUIRED: Follow this plan task-by-task. Each task includes exact file paths and content changes.
> **Related Plan:** `docs/plans/2026-02-09-shay-feedback-implementation-plan.md` (Phase 2 tasks 2.1-2.5)
> **Context:** This plan replaces Phase 2 tasks 2.1-2.5 from the Shay feedback plan with a concrete, API-driven implementation. The base44-api skill already exists and is confirmed working against the live API (66 features, 4 released).

**Goal:** When the marketing plugin loads, it pulls feature releases with ETAs in the next 2 weeks from the Base44 App API, auto-generates content briefs, and presents them as a content calendar that feeds directly into existing marketing router workflows (LinkedIn, X, landing pages, campaigns).

**Architecture:** The base44-api skill becomes the live data source for the data-intelligence skill. Instead of manual data snapshots, the plugin uses `curl` to fetch Feature entities from `https://app.base44.com/api/apps/{APP_ID}/entities/Feature`, filters for upcoming ETAs, and generates content briefs as .md files. The briefs feed into the router's existing agent chains.

**Tech Stack:** .md files (skill definitions, reference docs, brief templates), curl via Bash (API calls), existing marketing-router workflows (LinkedIn, X, email, landing pages, campaigns).

**Prerequisites:**
- Phase 1 of Shay feedback plan COMPLETE (router redesign, gtm-strategist, tone rules)
- base44-api skill exists at `skills/base44-api/SKILL.md` with working API reference
- Environment variables `BASE44_APP_ID` and `BASE44_API_KEY` available at runtime
- Plugin version 1.9.0

---

## Relevant Codebase Files

### Files Modified in This Plan

| File | Phase | Task |
|------|-------|------|
| `skills/base44-api/SKILL.md` (lines 186-264) | 1 | Task 1.1 |
| `skills/base44-api/reference/api.md` (lines 39-80) | 1 | Task 1.1 |
| NEW: `skills/data-intelligence/SKILL.md` | 1 | Task 1.2 |
| NEW: `skills/data-intelligence/reference/content-brief-template.md` | 1 | Task 1.3 |
| NEW: `skills/data-intelligence/reference/content-pipeline.md` | 1 | Task 1.4 |
| NEW: `skills/data-intelligence/reference/data-sources.md` | 1 | Task 1.4 |
| `skills/marketing-router/SKILL.md` (lines 64-66, 78-94, 248-249) | 2 | Task 2.1 |
| `skills/marketing-router/reference/workflows.md` | 2 | Task 2.2 |
| `agents/gtm-strategist.md` (lines 10-12, 29-34) | 2 | Task 2.3 |
| `CLAUDE.md` (lines 23-24, 53-64) | 2 | Task 2.4 |
| `.claude-plugin/settings.json` (lines 3-19) | 2 | Task 2.4 |
| `.claude-plugin/plugin.json` (line 3) | 3 | Task 3.1 |
| `agents/planner.md` (lines 10-12) | 3 | Task 3.1 |

### Patterns to Follow
- Skill definitions: `skills/base44-api/SKILL.md` (lines 1-8) -- YAML frontmatter format
- API curl patterns: `skills/base44-api/SKILL.md` (lines 64-78) -- curl with env vars
- Router intent table: `skills/marketing-router/SKILL.md` (lines 49-66) -- priority/signal/keywords/workflow
- Agent frontmatter: `agents/gtm-strategist.md` (lines 1-13) -- name, model, tools, skills
- Workflow references: `skills/marketing-router/reference/workflows.md` -- numbered step format

### Configuration Files
- `.claude-plugin/settings.json` -- permissions (needs update for data-intelligence paths)
- `.claude-plugin/plugin.json` -- plugin metadata (version bump to 2.0.0)

---

## Architecture Decision Records

### ADR-005: API-First Data Pipeline vs Manual Snapshots

**Context:** The Shay feedback plan (Phase 2) designed a manual snapshot approach: someone (Olga, Tori) provides weekly data, saved to `docs/data/YYYY-MM-DD-snapshot.md`. But the base44-api skill now provides live access to 66 Feature entities via REST API. The API returns ETAs, statuses, marketing descriptions, and all the metadata needed to generate content briefs without any manual data entry.

**Decision:** Replace the manual snapshot model with a live API pipeline. The data-intelligence skill calls the base44-api skill to fetch Feature entities, filters by ETA (next 2 weeks) and status (not archived, not hidden from marketing), and auto-generates content briefs. Manual snapshots from Olga/Tori remain as supplementary data sources but are no longer the primary pipeline.

**Consequences:**
- **Positive:** Zero manual data entry for feature-based content. Always current. Works immediately with existing API. Content briefs auto-generated.
- **Negative:** Only covers Feature entities (not builder analytics, churn data, etc. -- those still need manual input or future MCP). Depends on API availability and `BASE44_API_KEY` being set.
- **Alternatives Considered:** Keeping manual-only (blocks pipeline until someone provides data); MCP-only (not yet available); hybrid with API as primary and manual as supplement (CHOSEN -- manual still works for non-Feature data like builder analytics).

### ADR-006: Content Brief as Intermediate Artifact vs Direct Content Generation

**Context:** The pipeline could either (A) generate content briefs that a marketeer reviews and then routes to agents, or (B) skip the human and auto-generate content from features. Shay's vision includes both autonomous and human-in-the-loop modes.

**Decision:** Content briefs as the intermediate artifact. The pipeline generates structured briefs from Feature data, presents them as a content calendar for the marketeer, and the marketeer approves which briefs to execute. Each approved brief routes directly to the appropriate agent chain (LinkedIn, X, email, etc.).

**Consequences:**
- **Positive:** Human stays in the loop for content decisions. Briefs are reusable across channels. Marketeer can prioritize and sequence. Fits "head of marketing" mental model -- data informs, human decides.
- **Negative:** Extra step before content creation. Marketeer must review and approve.
- **Alternatives Considered:** Full auto-generation (too risky -- quality control and strategic alignment matter); direct-to-agent without brief (loses the planning layer that Shay wants).

---

## System Flow

```
Plugin Loads / User asks "what should we create?"
        |
        v
STEP 1: Fetch Feature entities via base44-api skill
        curl GET /entities/Feature (all features)
        |
        v
STEP 2: Filter for content-worthy features
        - ETA within next 14 days (upcoming releases)
        - OR status == "released" AND no marketing_description (missed launches)
        - AND hide_from_marketing == false
        - AND archived == false
        |
        v
STEP 3: Generate content brief per feature
        - Feature title, description, who_is_this_for, why_building
        - Suggested angles (replacement, speed, builder story)
        - Suggested channels (LinkedIn, X, email, landing page)
        - Priority score (tier + ETA proximity)
        |
        v
STEP 4: Present content calendar to marketeer
        - Table: Feature | ETA | Priority | Suggested Content | Channels
        - Marketeer selects which to execute
        |
        v
STEP 5: Route approved briefs to agent chains
        - LinkedIn brief -> LINKEDIN workflow -> linkedin-specialist -> brand-guardian
        - Landing page brief -> LANDING_DEPLOY workflow -> base44-landing-page
        - Campaign brief -> CAMPAIGN workflow -> planner -> specialists -> brand-guardian
```

---

## Phase 1: Data-Intelligence Skill + Content Brief Pipeline

> **Exit Criteria:** The data-intelligence skill exists, can fetch features via base44-api, filter by ETA, and generate structured content briefs. A marketeer can see a content calendar of upcoming features.

**Goal:** Build the data-intelligence skill that connects to the base44-api and produces content briefs.
**Estimated effort:** 1 session.
**Dependencies:** base44-api skill exists and API confirmed working.

### Task 1.1: Enhance base44-api Skill with Content Pipeline Filters

**Files:**
- Modify: `plugins/base44-marketing/skills/base44-api/SKILL.md`

**Step 1: Add "Content Pipeline" filter pattern to Filters section (after line 197)**

Add this filter row to the existing filter table at line 186:

```markdown
| "features launching soon" | `eta` is within next 14 days AND `status != "released"` AND `hide_from_marketing == false` |
| "features needing marketing" | `status == "released"` AND `marketing_description` is empty AND `hide_from_marketing == false` |
| "content pipeline features" | Combines both: upcoming (ETA <= 14 days) OR released-without-marketing |
```

**Step 2: Add a "Content Pipeline View" display format after line 180**

Insert this new display format after the Status Board section:

```markdown
### Content Pipeline View (for data-intelligence skill)

Best for: Auto-generating content briefs from feature data.

```markdown
## Content Pipeline: Features Ready for Marketing ({count})

### Upcoming Releases (ETA within 14 days)

#### {feature.title}
- **Status:** {status} | **Tier:** {tier} | **ETA:** {eta}
- **Days until release:** {days_remaining}
- **Who is this for:** {who_is_this_for}
- **Why we're building this:** {why_building}
- **What's new:** {whats_new}
- **Marketing description:** {marketing_description || "NEEDS COPY -- auto-generate from feature data"}
- **Media:** {media_urls}
- **Showcase:** {showcase_link}
- **Content angles:**
  - Replacement: "How {who_is_this_for} can replace [incumbent] with Base44"
  - Speed: "Build {title} in [timeframe] with Base44"
  - Builder value: Based on {why_building}
- **Suggested channels:** LinkedIn, X, Email (if tier_1), Landing page (if tier_1)

### Released Without Marketing Copy

#### {feature.title}
- **Released:** {released_at}
- **Marketing gap:** No marketing_description -- opportunity for retroactive content
- **What's new:** {whats_new}
- **Suggested action:** Generate marketing_description, then create launch content
```
```

**Step 3: Add integration note to "Feeding Data to Other Skills" section (after line 231)**

Add this block:

```markdown
### Feature -> Content Brief (data-intelligence pipeline)

```
1. Fetch features via base44-api with "content pipeline features" filter
2. For each feature, generate a content brief using the content-brief-template
3. Present briefs as a content calendar for marketeer review
4. Approved briefs route to: LinkedIn, X, Email, Landing Page, Campaign workflows
5. This is the AUTOMATED path -- no manual data entry required
```
```

**Step 4: Verify changes are coherent**

Read the updated file to confirm the new sections integrate cleanly with existing content.

**Step 5: Commit**

```bash
git add plugins/base44-marketing/skills/base44-api/SKILL.md
git commit -m "base44-api: add content pipeline filters and display format for data-intelligence integration"
```

---

### Task 1.2: Create data-intelligence Skill (API-Driven)

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/SKILL.md`

This replaces the manual-snapshot-based data-intelligence skill from Shay's plan (Task 2.1) with a live API-driven version.

**Step 1: Create directory**

```bash
mkdir -p plugins/base44-marketing/skills/data-intelligence/reference
```

**Step 2: Create the skill file**

Write to `plugins/base44-marketing/skills/data-intelligence/SKILL.md`:

```markdown
---
name: data-intelligence
description: |
  Content pipeline that fetches live feature data from the Base44 App API,
  identifies features launching in the next 2 weeks, and generates content
  briefs for marketing planning.

  Triggers on: content pipeline, what should we create, upcoming features,
  feature briefs, content calendar, what's launching, plan content,
  data intelligence, feature releases.

  LAYER: API Data -> Content Briefs -> Marketing Router Workflows
---

# Data Intelligence -- Feature Content Pipeline

> "The agent should DECIDE what to create based on data, not just take orders." -- Shay

**LAYER POSITION:** Data Layer -> Feeds content briefs into marketing workflows

## Purpose

This skill turns live feature data into actionable content briefs:
1. **Fetch** Feature entities from the Base44 App API (via base44-api skill)
2. **Filter** for features with ETAs in the next 2 weeks (or released without marketing)
3. **Generate** structured content briefs per feature
4. **Present** a content calendar for the marketeer to prioritize
5. **Route** approved briefs to marketing router workflows

## How It Works

### Step 1: Load Dependencies

```
Read(file_path="skills/base44-api/SKILL.md")
Read(file_path="skills/base44-api/reference/api.md")
Read(file_path="skills/data-intelligence/reference/content-brief-template.md")
Read(file_path="skills/data-intelligence/reference/content-pipeline.md")
```

### Step 2: Fetch Feature Data

Use the base44-api skill to pull all features:

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

### Step 3: Filter for Content-Worthy Features

Apply these filters to the raw feature list:

**Primary filter -- Upcoming Releases:**
- `eta` is within the next 14 days from today
- `status` is NOT `released` (still in development/progress)
- `hide_from_marketing` is `false`
- `archived` is `false`

**Secondary filter -- Released Without Marketing:**
- `status` == `released`
- `marketing_description` is empty or null
- `hide_from_marketing` is `false`

**Exclusion rules:**
- Skip features where `hide_from_marketing` is `true`
- Skip features where `archived` is `true`
- Skip features where `is_sample` is `true`

### Step 4: Score and Prioritize

For each content-worthy feature, calculate a priority score:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Tier | 40% | tier_1 = 10, tier_2 = 7, tier_3 = 4 |
| ETA proximity | 30% | 0-3 days = 10, 4-7 days = 8, 8-14 days = 5 |
| Has marketing_description | 15% | Yes = 10 (ready to go), No = 5 (needs generation) |
| Has media/showcase | 15% | Yes = 10 (visual content ready), No = 3 |

**Priority Score = (Tier * 0.4) + (ETA * 0.3) + (MarketingReady * 0.15) + (MediaReady * 0.15)**

Features scoring 7+ are HIGH priority.
Features scoring 5-6.9 are MEDIUM priority.
Features scoring below 5 are LOW priority.

### Step 5: Generate Content Briefs

For each filtered feature, generate a content brief using the template:

```
Read(file_path="skills/data-intelligence/reference/content-brief-template.md")
```

Fill the template with:
- Feature data (title, whats_new, who_is_this_for, why_building)
- Suggested content angles (generated from feature data)
- Recommended channels (based on tier and content type)
- Priority and timeline

**If `marketing_description` is empty:** Auto-generate one from `whats_new`, `who_is_this_for`, and `why_building`. Flag it as "[AUTO-GENERATED -- review before publishing]".

### Step 6: Present Content Calendar

Output format:

```markdown
## Content Calendar: Features Launching Next 2 Weeks

**Generated:** [today's date]
**Features found:** [N] upcoming, [M] released-without-marketing
**API source:** Base44 App API (live data)

### HIGH Priority

| # | Feature | Tier | ETA | Days Left | Score | Suggested Content |
|---|---------|------|-----|-----------|-------|-------------------|
| 1 | [title] | tier_1 | [date] | [N] | [score] | LinkedIn + Landing Page + Email |
| 2 | [title] | tier_1 | [date] | [N] | [score] | LinkedIn + X Thread |

### MEDIUM Priority

| # | Feature | Tier | ETA | Days Left | Score | Suggested Content |
|---|---------|------|-----|-----------|-------|-------------------|
| 3 | [title] | tier_2 | [date] | [N] | [score] | LinkedIn + X |

### Released Without Marketing (Catch-Up)

| # | Feature | Released | Gap | Suggested Action |
|---|---------|----------|-----|------------------|
| 4 | [title] | [date] | No marketing copy | Generate + post retroactively |

---

### Content Briefs

[Full brief for each feature, using content-brief-template]

---

### Next Steps

Which features should we create content for? Options:
1. **All HIGH priority** -- I'll generate briefs and route to agents
2. **Select specific features** -- Tell me which ones
3. **Full campaign** for a specific feature -- I'll create a multi-channel plan
4. **Just the briefs** -- I'll write the briefs, you decide later
```

### Step 7: Route Approved Briefs to Workflows

When the marketeer selects features to create content for:

| Content Type | Workflow | Agent Chain |
|-------------|----------|-------------|
| LinkedIn announcement | LINKEDIN | linkedin-specialist -> brand-guardian |
| X thread | X | x-specialist -> brand-guardian |
| Feature landing page | LANDING_DEPLOY | base44-landing-page -> brand-guardian |
| Email to existing builders | EMAIL | copywriter -> brand-guardian |
| Full multi-channel campaign | CAMPAIGN | planner -> [specialists] -> brand-guardian |
| Blog / SEO article | SEO | seo-specialist -> brand-guardian |

Pass the content brief as context to the agent:
- Feature title, description, whats_new
- Target audience (who_is_this_for)
- Key angle from the brief
- Any media URLs or showcase links

## Supplementary Data Sources

The API pipeline covers feature data. For broader marketing intelligence, these manual sources still apply:

| Source | Data Type | How to Provide |
|--------|-----------|----------------|
| Olga (Marketing Analytics) | Builder analytics, engagement metrics | Share in conversation or save to `docs/data/` |
| Tori (Analyst) | Weekly analysis, churn cases | Share weekly deck insights |
| pinback.base44.com | Feature requests, votes | Reference when planning |
| Reddit / social | Competitor mentions, trends | Share relevant threads |

When supplementary data is available, combine it with API data for richer briefs.

## Edge Cases

### No features with upcoming ETAs
Output: "No features have ETAs in the next 2 weeks. Here's what's available:" then show the full roadmap (status board view from base44-api).

### API credentials not set
Output the setup instructions and offer to work with manually provided feature data instead.

### Features with HTML in fields
Strip HTML tags from `why_building`, `who_is_this_for`, `whats_new` before including in briefs. Note if rich content (images, links) was stripped.

### Too many features (>20 in 2-week window)
Group by tier. Show tier_1 first with full briefs. Show tier_2 and tier_3 as summary table. Ask marketeer which to expand.

## Integration

**Called by:** marketing-router (CONTENT_PIPELINE workflow), gtm-strategist (for strategic planning with live data)
**Depends on:** base44-api skill, `$BASE44_APP_ID`, `$BASE44_API_KEY`
**Feeds into:** All marketing router workflows (LINKEDIN, X, EMAIL, LANDING_DEPLOY, CAMPAIGN, SEO)
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/SKILL.md
git commit -m "skill: create data-intelligence with live API content pipeline (replaces manual snapshots)"
```

---

### Task 1.3: Create Content Brief Template

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/content-brief-template.md`

**Step 1: Create the template**

Write to `plugins/base44-marketing/skills/data-intelligence/reference/content-brief-template.md`:

```markdown
# Content Brief Template

Use this template to generate a content brief from Feature entity data.

## Template

```markdown
# Content Brief: {feature.title}

## Feature Data
- **Title:** {feature.title}
- **Status:** {feature.status}
- **Tier:** {feature.tier}
- **ETA:** {feature.eta}
- **Released:** {feature.released_at || "Not yet"}
- **Owners:** {feature.owners}

## Target Audience
{feature.who_is_this_for}

Strip HTML tags. Rewrite as a clear audience description if the original is too technical.

## Problem We're Solving
{feature.why_building}

Strip HTML. Extract the core pain point in 1-2 sentences.

## What's New
{feature.whats_new}

Strip HTML. Summarize the feature update in plain language.

## Marketing Description
{feature.marketing_description || "[AUTO-GENERATED] Based on the feature data above, write a 2-3 sentence marketing description in Base44 brand voice. Use 'builders' not 'users'. Be specific about the value. No TV-ad cadence."}

## Content Angles

Generate 3 angles based on the feature data:

### Angle 1: The Replacement Story
"How [audience] can replace [incumbent tool] with Base44's {title}"
- Works best for: LinkedIn, Blog/SEO
- Key hook: The cost/complexity of the incumbent vs. Base44's simplicity

### Angle 2: The Speed Story
"[Title] -- what used to take weeks now takes [timeframe]"
- Works best for: X, LinkedIn
- Key hook: Specific time savings or efficiency gains

### Angle 3: The Builder Story
"[Builder name/persona] just shipped [thing] using {title}"
- Works best for: LinkedIn, X, Case Study
- Key hook: Real result from a real builder (or representative scenario)

## Recommended Channels

| Channel | Content Type | Priority | Why This Channel |
|---------|-------------|----------|------------------|
| LinkedIn | Announcement post | {HIGH if tier_1, MEDIUM if tier_2} | Builder community, thought leadership |
| X | Thread or single tweet | {HIGH if tier_1, MEDIUM if tier_2} | Quick reach, technical audience |
| Email | Feature update to builders | {HIGH if tier_1} | Direct engagement, retention |
| Landing page | Feature page | {HIGH if tier_1 only} | SEO, conversion |
| Blog | Tutorial/deep dive | {MEDIUM} | SEO, education |

## Media Assets
- **Feature media:** {feature.media_urls || "None -- needs visual assets"}
- **Showcase link:** {feature.showcase_link || "None -- needs demo"}
- **Figma link:** {feature.figma_link || "None"}

## Priority Score
- **Score:** {calculated_score}/10
- **Tier factor:** {tier_score}
- **ETA proximity:** {eta_score}
- **Marketing readiness:** {marketing_ready_score}
- **Media readiness:** {media_ready_score}

## Router Handoff

When this brief is approved, route to:
- LINKEDIN workflow with: title, marketing_description, angle, who_is_this_for
- X workflow with: title, whats_new, angle (compressed for 280 chars)
- EMAIL workflow with: title, marketing_description, who_is_this_for, whats_new
- LANDING_DEPLOY workflow with: all fields (full page generation)
- CAMPAIGN workflow with: full brief (if multi-channel selected)
```

## Field Mapping Reference

How Feature entity fields map to content brief sections:

| Feature Field | Brief Section | Notes |
|---------------|---------------|-------|
| `title` | Title, all content | Feature name |
| `status` | Feature Data | Determines if upcoming or released |
| `tier` | Priority Score, Channel recommendations | tier_1 = all channels, tier_2 = social, tier_3 = brief only |
| `eta` | Feature Data, Priority Score | Used for "days until release" |
| `owners` | Feature Data | For internal coordination |
| `who_is_this_for` | Target Audience | May contain HTML -- strip |
| `why_building` | Problem We're Solving | May contain HTML -- strip |
| `whats_new` | What's New | May contain HTML -- strip |
| `marketing_description` | Marketing Description | If empty, auto-generate |
| `marketing_owner` | Internal coordination | Not in brief, for routing |
| `media_urls` | Media Assets | For visual content |
| `showcase_link` | Media Assets | For demos and landing pages |
| `figma_link` | Media Assets | For design reference |
| `hide_from_marketing` | Filter (exclude if true) | Pre-filter, not in brief |
| `released_at` | Feature Data | For "released without marketing" catch-up |
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/reference/content-brief-template.md
git commit -m "data-intelligence: add content brief template with field mapping"
```

---

### Task 1.4: Create Content Pipeline Reference + Data Sources

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/content-pipeline.md`
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/data-sources.md`

**Step 1: Create the content pipeline reference**

Write to `plugins/base44-marketing/skills/data-intelligence/reference/content-pipeline.md`:

```markdown
# Content Pipeline: API to Execution

## The Flow

```
BASE44 APP API (live feature data)
  |
  v
FETCH (curl GET /entities/Feature via base44-api skill)
  |
  v
FILTER (ETA <= 14 days, or released without marketing)
  |
  v
SCORE (tier * 0.4 + ETA proximity * 0.3 + marketing readiness * 0.15 + media * 0.15)
  |
  v
BRIEF (content-brief-template per feature)
  |
  v
CALENDAR (present to marketeer: priority table + briefs)
  |
  v
APPROVE (marketeer selects features + channels)
  |
  v
ROUTE (each approved brief -> marketing router workflow)
  |
  v
EXECUTE (specialist agents create content from brief)
  |
  v
VALIDATE (brand-guardian scores >= 7/10)
  |
  v
DELIVER (content ready for publishing)
```

## Pipeline Rules

### 1. API Data Is the Source of Truth for Features

Feature content decisions are driven by live API data:
- "Feature X has an ETA of next Tuesday" -> generate content brief
- NOT "I think we should write about Feature X" -> hope it's relevant

### 2. One Feature = Multiple Content Pieces

Each high-priority feature generates a content cluster:

```
Feature: "AI-Powered Form Builder" (tier_1, ETA: Feb 20)
  |
  +-- LinkedIn: Announcement post (linkedin-specialist)
  +-- X: Thread showing the feature (x-specialist)
  +-- Email: Update to existing builders (copywriter)
  +-- Landing page: Feature page on Base44 (base44-landing-page)
  +-- Blog: Tutorial "How to build forms with AI" (seo-specialist)
```

### 3. Tier Determines Channel Breadth

| Tier | Channels | Content Pieces |
|------|----------|----------------|
| tier_1 | LinkedIn + X + Email + Landing Page + Blog | 5 pieces |
| tier_2 | LinkedIn + X + Email | 3 pieces |
| tier_3 | LinkedIn or X (single post) | 1 piece |

### 4. The Marketeer Decides

The pipeline recommends, the marketeer approves. The system should:
- Present options clearly
- Explain WHY each feature is recommended (data-driven rationale)
- Let the marketeer adjust channels, timing, and angles
- Never auto-publish without approval

### 5. Refresh Cadence

| Frequency | Action |
|-----------|--------|
| On demand | Marketeer asks "what should we create?" -- pipeline runs |
| Weekly | Suggested: run pipeline Monday AM for the week's content |
| On feature status change | When a feature moves to "released" -- trigger content |

## Integration with Existing Workflows

### From Pipeline to Router

The pipeline outputs content briefs. Each brief maps to a router workflow:

| Brief Content | Router Workflow | Agent Chain |
|---------------|----------------|-------------|
| LinkedIn announcement | LINKEDIN | linkedin-specialist -> brand-guardian |
| X thread | X | x-specialist -> brand-guardian |
| Feature email update | EMAIL | copywriter -> brand-guardian |
| Feature landing page | LANDING_DEPLOY | base44-landing-page -> brand-guardian -> deploy |
| SEO blog post | SEO | seo-specialist -> brand-guardian |
| Multi-channel campaign | CAMPAIGN | planner -> [specialists] -> brand-guardian |

### From Pipeline to GTM Strategist

When the pipeline is used for strategic planning (not just execution):
- Pass the full feature list to gtm-strategist
- The strategist uses features as raw material for holistic planning
- Example: "We have 5 features launching next month. How should we sequence them?"

## Supplementary Data Sources

API covers features. For broader intelligence, combine with:
- Builder analytics (from Olga) -- what categories are builders building?
- Community feedback (pinback) -- what are builders requesting?
- Competitive intel -- what are competitors shipping?

When supplementary data is provided, it enriches the briefs with:
- Category context (e.g., "This feature is relevant to CRM builders, our largest segment")
- Competitive angle (e.g., "Competitor X doesn't have this -- first mover advantage")
- Community demand (e.g., "47 votes on pinback for this capability")
```

**Step 2: Create the data sources reference**

Write to `plugins/base44-marketing/skills/data-intelligence/reference/data-sources.md`:

```markdown
# Data Sources

## Primary: Base44 App API (LIVE)

| Detail | Value |
|--------|-------|
| **Endpoint** | `GET https://app.base44.com/api/apps/{APP_ID}/entities/Feature` |
| **Auth** | `api_key` header with `$BASE44_API_KEY` |
| **Status** | ACTIVE -- confirmed working, 66 features as of 2026-02-15 |
| **Entity** | Feature |
| **Key fields** | title, status, tier, eta, whats_new, who_is_this_for, why_building, marketing_description, hide_from_marketing, media_urls, showcase_link |
| **Statuses** | new, in_progress, released |
| **Feature count** | 66 total, 4 released (as of 2026-02-15) |

### How to Fetch

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

### Content Pipeline Filters

| Filter | Logic |
|--------|-------|
| Upcoming releases | `eta` within 14 days AND `status != "released"` AND `hide_from_marketing == false` AND `archived == false` |
| Released without marketing | `status == "released"` AND `marketing_description` empty AND `hide_from_marketing == false` |
| Content pipeline (combined) | Upcoming OR Released-without-marketing |

## Supplementary: Manual Data

| Source | Contact | Data Type | Status |
|--------|---------|-----------|--------|
| Olga | Marketing Analytics Manager | Builder categories, engagement metrics | Manual -- ask in conversation |
| Tori | Analyst | Weekly analysis, churn cases | Manual -- share deck insights |
| Noa Gordon | Product | Feature usage, product roadmap | Manual -- product sync |
| pinback.base44.com | Web | Feature requests, votes | Active -- reference manually |
| Reddit (r/vibecoding, r/nocode) | Social | Competitor mentions, trends | Active -- monitor manually |

## Future: Automated Sources

| Source | Integration | Status |
|--------|-------------|--------|
| Builder prompts (anonymized) | MCP connector to Base44 DB | PLANNED |
| Usage analytics | MCP connector | PLANNED |
| Social media monitoring | External service | FUTURE |

When MCP connectors become available, they supplement the API pipeline with builder behavior data (what categories builders are building, usage patterns, churn signals).
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/reference/content-pipeline.md
git add plugins/base44-marketing/skills/data-intelligence/reference/data-sources.md
git commit -m "data-intelligence: add content pipeline flow and data sources reference"
```

---

### Phase 1 Exit Criteria

- [ ] data-intelligence skill exists at `skills/data-intelligence/SKILL.md` with API-driven pipeline
- [ ] Content brief template exists at `skills/data-intelligence/reference/content-brief-template.md`
- [ ] Content pipeline reference exists at `skills/data-intelligence/reference/content-pipeline.md`
- [ ] Data sources reference exists at `skills/data-intelligence/reference/data-sources.md`
- [ ] base44-api skill has content pipeline filters and display format
- [ ] Pipeline flow: Fetch -> Filter -> Score -> Brief -> Calendar -> Route
- [ ] Scoring formula documented: tier (40%) + ETA proximity (30%) + marketing readiness (15%) + media readiness (15%)

---

## Phase 2: Router Integration + Agent Wiring

> **Exit Criteria:** The marketing router has a CONTENT_PIPELINE workflow. The gtm-strategist can use live feature data. A marketeer can say "what should we create?" and get a data-driven content calendar.

**Goal:** Wire the data-intelligence skill into the marketing router and agent chains.
**Estimated effort:** 1 session.
**Dependencies:** Phase 1 complete.

### Task 2.1: Add CONTENT_PIPELINE Workflow to Marketing Router

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/SKILL.md`

**Step 1: Add CONTENT_PIPELINE to the intent classification table**

In `skills/marketing-router/SKILL.md`, find the intent classification table (currently lines 49-66). Add a new row between DATA_INSIGHT (priority 11) and APP_DATA (priority 11.5):

Insert after the DATA_INSIGHT row:

```markdown
| 11.2 | CONTENT_PIPELINE | content pipeline, what should we create, upcoming features, feature briefs, content calendar, what's launching, plan content | **CONTENT_PIPELINE** |
```

**Step 2: Add CONTENT_PIPELINE to Agent Chains table**

In the Agent Chains table (lines 78-94), add:

```markdown
| CONTENT_PIPELINE | data-intelligence skill (fetch features, generate briefs, present calendar) |
```

**Step 3: Update Supporting Skills table**

In the Supporting Skills table (lines 238-249), update the data-intelligence entry:

Replace:
```markdown
| data-intelligence | Builder analytics, content pipeline (Phase 2 -- not yet built) |
```

With:
```markdown
| data-intelligence | Live API content pipeline: fetches features, generates briefs, content calendar |
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/skills/marketing-router/SKILL.md
git commit -m "router: add CONTENT_PIPELINE workflow for API-driven content planning"
```

---

### Task 2.2: Add CONTENT_PIPELINE Workflow Details to workflows.md

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/reference/workflows.md`

**Step 1: Add CONTENT_PIPELINE workflow**

Insert after the GTM_STRATEGY section (after line 35) and before the BRAINSTORM section:

```markdown
---

## CONTENT_PIPELINE (API-Driven Content Planning)

Pull live feature data and generate a content calendar with briefs.

1. Load data-intelligence skill:
```
Read(file_path="skills/data-intelligence/SKILL.md")
Read(file_path="skills/data-intelligence/reference/content-brief-template.md")
Read(file_path="skills/data-intelligence/reference/content-pipeline.md")
```

2. Check API credentials:
```bash
echo "APP_ID: ${BASE44_APP_ID:-(not set)}"
echo "API_KEY: ${BASE44_API_KEY:+(set)}"
```
   - If not set: ask user to provide them, then retry
   - If set: proceed to fetch

3. **FETCH** all Feature entities:
```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

4. **FILTER** for content-worthy features:
   - Upcoming: ETA within 14 days + not released + not hidden + not archived
   - Catch-up: Released + no marketing_description + not hidden
   - Exclude: archived, is_sample, hide_from_marketing

5. **SCORE** each feature:
   - Tier (40%): tier_1 = 10, tier_2 = 7, tier_3 = 4
   - ETA proximity (30%): 0-3 days = 10, 4-7 = 8, 8-14 = 5
   - Marketing readiness (15%): has description = 10, missing = 5
   - Media readiness (15%): has media/showcase = 10, missing = 3

6. **GENERATE** content brief per feature using content-brief-template

7. **PRESENT** content calendar:
   - HIGH priority table (score >= 7)
   - MEDIUM priority table (score 5-6.9)
   - Released-without-marketing catch-up table
   - Full briefs for HIGH priority features

8. **ASK** marketeer: Which features to create content for?
   - All HIGH priority
   - Specific selection
   - Full campaign for one feature
   - Just the briefs (decide later)

9. **ROUTE** approved briefs to execution workflows:
   - Each brief maps to LINKEDIN, X, EMAIL, LANDING_DEPLOY, SEO, or CAMPAIGN
   - Pass brief content as context to the specialist agent
   - Brand-guardian validates all output

**CONTENT_PIPELINE is the DATA-DRIVEN content factory. It tells you WHAT to create based on live product data.**

---
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/marketing-router/reference/workflows.md
git commit -m "workflows: add CONTENT_PIPELINE with full fetch-filter-score-brief-route flow"
```

---

### Task 2.3: Wire gtm-strategist to Live Feature Data

**Files:**
- Modify: `plugins/base44-marketing/agents/gtm-strategist.md`

**Step 1: Add data-intelligence to skills list**

In `agents/gtm-strategist.md`, update the frontmatter skills (line 11):

Replace:
```yaml
skills:
  - marketing-ideas
  - marketing-psychology
```

With:
```yaml
skills:
  - marketing-ideas
  - marketing-psychology
  - data-intelligence
  - base44-api
```

**Step 2: Add live data loading to "Before Anything" section**

After the existing `Read(file_path=".claude/marketing/activeContext.md")` line (line 28), add:

```markdown
If feature data context is needed:
```
Read(file_path="skills/data-intelligence/SKILL.md")
```

Then fetch live feature data:
```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

Use this data to ground strategic recommendations in real product timelines.
```

**Step 3: Update Discovery Phase to reference feature data**

In the Phase 1 Discovery section (line 43), update the "Assets" question:

Replace:
```markdown
3. **Assets**: "What do we have to work with? Existing content, data points, case studies, product features?"
   - Understand the raw material before designing the strategy.
```

With:
```markdown
3. **Assets**: "What do we have to work with? Existing content, data points, case studies, product features?"
   - Understand the raw material before designing the strategy.
   - If feature data was loaded: "I can see [N] features launching in the next 2 weeks. Want me to factor those into the strategy?"
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/agents/gtm-strategist.md
git commit -m "gtm-strategist: wire to data-intelligence and base44-api for live feature data"
```

---

### Task 2.4: Update CLAUDE.md, Settings, and Documentation

**Files:**
- Modify: `plugins/base44-marketing/CLAUDE.md`
- Modify: `plugins/base44-marketing/.claude-plugin/settings.json`

**Step 1: Update CLAUDE.md architecture diagram**

In `CLAUDE.md`, update the architecture block (lines 17-33). Add the CONTENT_PIPELINE workflow:

After the existing `APP_DATA -> base44-api` line, add:
```markdown
        +-- CONTENT_PIPELINE -> data-intelligence (fetch features, generate briefs, content calendar)
```

**Step 2: Update CLAUDE.md Skills table**

In the Skills table (lines 53-64), add:
```markdown
| `data-intelligence` | Live API content pipeline: feature briefs + content calendar |
```

**Step 3: Update settings.json permissions**

In `.claude-plugin/settings.json`, add these permissions to the "allow" array:

```json
"Read(docs/data/**)",
"Bash(mkdir -p docs/data)",
"Bash(curl -s -X GET *base44.com*)"
```

The `curl` permission enables the API calls. The `docs/data` permissions support the supplementary manual data path.

**Step 4: Commit**

```bash
git add plugins/base44-marketing/CLAUDE.md
git add plugins/base44-marketing/.claude-plugin/settings.json
git commit -m "docs: add CONTENT_PIPELINE to architecture, add curl + data permissions"
```

---

### Phase 2 Exit Criteria

- [ ] CONTENT_PIPELINE workflow exists in router intent table (priority 11.2)
- [ ] CONTENT_PIPELINE workflow detailed in workflows.md (fetch-filter-score-brief-route)
- [ ] gtm-strategist skills list includes data-intelligence and base44-api
- [ ] gtm-strategist can load live feature data in discovery phase
- [ ] CLAUDE.md architecture includes CONTENT_PIPELINE
- [ ] CLAUDE.md skills table includes data-intelligence
- [ ] settings.json allows curl to base44.com and read docs/data
- [ ] User can say "what should we create?" and get routed to CONTENT_PIPELINE

---

## Phase 3: Polish + Version Bump

> **Exit Criteria:** Plugin is version 2.0.0. The planner agent can use feature data for campaigns. The full flow is testable end-to-end.

**Goal:** Tie loose ends, update plugin version, and wire the planner agent into the pipeline.
**Estimated effort:** 30 minutes.
**Dependencies:** Phase 2 complete.

### Task 3.1: Update Planner Agent + Plugin Version

**Files:**
- Modify: `plugins/base44-marketing/agents/planner.md`
- Modify: `plugins/base44-marketing/.claude-plugin/plugin.json`
- Modify: `plugins/base44-marketing/.claude-plugin/settings.json`

**Step 1: Add data-intelligence to planner skills**

In `agents/planner.md`, update frontmatter skills (line 11):

Replace:
```yaml
skills:
  - marketing-ideas
  - marketing-psychology
```

With:
```yaml
skills:
  - marketing-ideas
  - marketing-psychology
  - data-intelligence
  - base44-api
```

This allows the planner to pull live feature data when planning campaigns around specific features.

**Step 2: Bump plugin version to 2.0.0**

In `.claude-plugin/plugin.json`, update:

```json
"version": "2.0.0"
```

Update the description to include the content pipeline:

```json
"description": "Marketing intelligence system with live API content pipeline. 9 agents, data-driven content briefs, 77+ tactics, 71 psychology principles, brand governance, and evolving memory. Features content pipeline from Base44 App API, open-ended routing, GTM strategist, anti-TV-ad tone enforcement, and automated landing page generation."
```

**Step 3: Update settings.json version**

In `.claude-plugin/settings.json`, update:

```json
"MARKETING_PLUGIN_VERSION": "2.0.0"
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/agents/planner.md
git add plugins/base44-marketing/.claude-plugin/plugin.json
git add plugins/base44-marketing/.claude-plugin/settings.json
git commit -m "plugin: bump to v2.0.0 with live API content pipeline"
```

---

### Phase 3 Exit Criteria

- [ ] Planner agent has data-intelligence and base44-api skills
- [ ] Plugin version is 2.0.0 in plugin.json and settings.json
- [ ] Plugin description updated to reference content pipeline

---

## Testing Each Phase

### Phase 1 Test (Content Pipeline Exists)

1. **Verify skill structure:**
```bash
ls -la plugins/base44-marketing/skills/data-intelligence/
ls -la plugins/base44-marketing/skills/data-intelligence/reference/
```
Expected: SKILL.md + 3 reference files (content-brief-template.md, content-pipeline.md, data-sources.md)

2. **Verify base44-api has pipeline filters:**
Read `skills/base44-api/SKILL.md` and confirm "Content Pipeline View" and pipeline filter rows exist.

3. **Test API fetch (requires credentials):**
```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/Feature" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json" | python3 -c "
import json, sys
features = json.load(sys.stdin)
print(f'Total features: {len(features)}')
upcoming = [f for f in features if f.get('eta') and f.get('status') != 'released' and not f.get('hide_from_marketing') and not f.get('archived')]
print(f'Content pipeline candidates: {len(upcoming)}')
released_no_marketing = [f for f in features if f.get('status') == 'released' and not f.get('marketing_description') and not f.get('hide_from_marketing')]
print(f'Released without marketing: {len(released_no_marketing)}')
"
```

### Phase 2 Test (Router Integration)

1. **Trigger CONTENT_PIPELINE:** Say "what should we create?" or "show me the content pipeline"
   - Should load data-intelligence skill
   - Should fetch features via API
   - Should present content calendar

2. **Trigger gtm-strategist with feature context:** Say "help me plan our content strategy for upcoming features"
   - Should load feature data in discovery phase
   - Should reference specific upcoming features

3. **Verify routing:** After content calendar is presented, select a feature for LinkedIn
   - Should route to LINKEDIN workflow with brief as context
   - Should pass through brand-guardian

### Phase 3 Test (End-to-End)

1. **Full flow:**
   - "What should we create?" -> content calendar
   - Select a feature -> "Create a LinkedIn post about this"
   - linkedin-specialist generates content from brief
   - brand-guardian validates (score >= 7)
   - Content delivered

2. **Campaign flow:**
   - "What should we create?" -> content calendar
   - Select a tier_1 feature -> "Run a full campaign for this"
   - Planner creates multi-channel plan from brief
   - Specialists execute in parallel
   - Brand-guardian validates each piece

---

## Risks

| Risk | Probability (1-5) | Impact (1-5) | Score | Mitigation |
|------|-------------------|--------------|-------|------------|
| API credentials not set at runtime | 3 | 4 | 12 | Graceful fallback: show setup instructions, offer manual data path |
| No features have upcoming ETAs | 3 | 3 | 9 | Show full roadmap instead; offer "released without marketing" catch-up |
| Most features lack marketing_description | 4 | 2 | 8 | Auto-generate from whats_new + who_is_this_for + why_building, flag as auto-generated |
| API rate limiting (429) | 2 | 3 | 6 | Single fetch per pipeline run (all features at once), not per-feature |
| HTML in feature fields breaks brief formatting | 3 | 2 | 6 | Strip HTML tags before including in briefs |
| Too many features overwhelm the calendar | 2 | 2 | 4 | Group by tier, show tier_1 with full briefs, tier_2/3 as summary |
| curl not available in plugin sandbox | 1 | 5 | 5 | Already confirmed working in base44-api skill; curl is in settings.json permissions |

**Highest risk:** API credentials not set (score 12). Mitigation is already designed into the pipeline -- the base44-api skill has credential checking and setup instructions.

---

## Success Criteria (Overall)

### Must Have
- [ ] data-intelligence skill fetches features via base44-api
- [ ] Pipeline filters: ETA within 14 days OR released-without-marketing
- [ ] Content briefs generated per feature with angles + channel recommendations
- [ ] Content calendar presented to marketeer with priority scoring
- [ ] Approved briefs route to existing marketing workflows

### Should Have
- [ ] CONTENT_PIPELINE workflow in router with dedicated keywords
- [ ] gtm-strategist can access live feature data
- [ ] Planner agent can use feature data for campaign planning
- [ ] Auto-generated marketing_description when field is empty

### Nice to Have
- [ ] Plugin version 2.0.0
- [ ] Supplementary manual data path documented
- [ ] End-to-end test commands for each phase

---

## Relationship to Shay Feedback Plan

This plan **replaces** Phase 2 tasks 2.1-2.5 from `docs/plans/2026-02-09-shay-feedback-implementation-plan.md`:

| Shay Plan Task | Status | This Plan's Equivalent |
|----------------|--------|------------------------|
| Task 2.1: Create data-intelligence skill | REPLACED | Task 1.2 (API-driven version) |
| Task 2.2: Create data sources reference | REPLACED | Task 1.4 (API as primary source) |
| Task 2.3: Create category analysis framework | DEFERRED | Not needed for feature pipeline; category analysis applies to builder analytics (supplementary data) |
| Task 2.4: Create content pipeline reference | REPLACED | Task 1.4 (API-to-execution pipeline) |
| Task 2.5: Create initial data directory | REPLACED | Not needed -- API provides live data; docs/data/ is supplementary only |

Phase 3 tasks 3.1-3.4 from Shay's plan remain valid and are partially addressed:
- Task 3.1 (Router as Head of Marketing): Partially covered by CONTENT_PIPELINE proactive mode
- Task 3.2 (Data analyst agent): Deferred -- the data-intelligence skill handles analysis; a dedicated agent can come later
- Task 3.3 (Autonomous content recommendation): Covered by CONTENT_PIPELINE workflow
- Task 3.4 (Agent hierarchy documentation): Covered by Task 2.4 (CLAUDE.md updates)

---

*Plan created: 2026-02-15*
*Author: Claude Code (Planner)*
*Source: base44-api skill confirmed working against live API (66 features, 4 released)*
