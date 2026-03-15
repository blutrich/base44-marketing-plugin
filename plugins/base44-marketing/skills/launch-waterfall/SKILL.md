---
name: launch-waterfall
description: |
  Structured 8-phase waterfall for product launches. Enforces sequential phases with gates:
  Phase 0 (Auto-Discovery) -> Phase 1 (Product Understanding) -> Phase 2 (Pain Points + Positioning) ->
  Phase 3 (Messaging Framework) -> Phase 4 (Asset Planning) -> Phase 5 (Asset Creation) -> Phase 6 (Launch Execution) ->
  Phase 7 (Push to Product App).

  Prevents "grocery list" marketing by requiring each phase to complete before the next begins.
  Phase 0 runs proactively when feature-intel detects new features in development.

  Triggers on: launch, ship feature, go-to-market, launch plan, feature launch, product launch, launch campaign.
---

# Launch Waterfall

**Sequential execution engine for product launches.** Each phase produces a specific deliverable that gates the next phase. No phase can be skipped. No assets are created until the Messaging Framework (Phase 3) is locked. After launch execution, Phase 7 auto-pushes all channel content into the Product App's MarketingActivity entity.

## Why This Exists

Without a waterfall, launches degrade into parallel chaos: H1/H2 iterations, copy without messaging, assets without strategy. The SuperAgent launch (Feb 16 concept, Mar 5 marketing start, Mar 11 launch) proved that 17 days of zero marketing involvement followed by 6 days of everything-at-once produces grocery lists, not campaigns.

## The 7 Phases

```
Phase 0: AUTO-DISCOVERY (proactive, triggered by feature-intel)
    |
    v  GATE: Discovery Brief exists
Phase 1: PRODUCT UNDERSTANDING (from Slack data + product channels)
    |
    v  GATE: Product Brief approved
Phase 2: PAIN POINTS + COMPETITIVE POSITIONING
    |
    v  GATE: Positioning Document approved
Phase 3: MESSAGING FRAMEWORK
    |
    v  GATE: Messaging Framework locked (ALL downstream assets derive from this)
Phase 4: ASSET PLANNING
    |
    v  GATE: Asset Plan approved (what to create, for whom, which channels)
Phase 5: ASSET CREATION (parallel, specialists work from Messaging Framework)
    |
    v  GATE: All assets pass brand-guardian (score >= 7/10)
Phase 6: LAUNCH EXECUTION
    |
    v  GATE: Launch checklist complete
Phase 7: PUSH TO PRODUCT APP (auto)
    |
    v  DONE: MarketingActivity record created with all channel content
```

---

## Phase 0: Auto-Discovery (PROACTIVE)

**Trigger:** feature-intel or feature-scan detects a new feature entering development.
**Who runs it:** Router auto-invokes when FEATURE_INTEL finds a significant new feature.
**Time:** Runs during development phase, weeks before launch assignment.

### What to gather:

1. **Competitive Landscape**
   - Who else does something similar? (direct competitors)
   - How do they position it? (their H1s, landing pages, messaging)
   - What's their pricing model?
   - What are users saying about them? (reviews, Reddit, X)

2. **Channel Intel**
   - What channels are competitors using?
   - Where is the target audience most active?
   - What content formats work in this category?
   - What hooks/angles are getting engagement?

3. **Market Context**
   - Is there a trend wave to ride? (e.g., "AI agents" hype cycle)
   - Any cultural moments or events to align with?
   - What's the general sentiment about this category?

4. **Audience Signals**
   - What terms is the target audience searching for?
   - What communities are discussing this category?
   - What objections or skepticism exists in the market?

### Output: Discovery Brief

Save to `output/launch/{feature-slug}/phase-0-discovery-brief.md`:

```markdown
# Discovery Brief: {Feature Name}

## Feature Detected
- Source: {Slack channel / feature-intel scan}
- Detection Date: {date}
- Expected Launch: {estimated or unknown}

## Competitive Landscape
| Competitor | Product | Positioning | Pricing | Strength | Weakness |
|-----------|---------|-------------|---------|----------|----------|

## Channel Intel
| Channel | Competitor Activity | Audience Presence | Content Format | Engagement Level |
|---------|-------------------|-------------------|----------------|-----------------|

## Market Context
- Category trend: {description}
- Sentiment: {positive/mixed/negative}
- Timing opportunity: {cultural moments, events, news cycles}
- Audience signals: {search terms, community discussions, objections}

## The Gap We Can Own
{1-2 sentences: what positioning is available that competitors aren't using}

## Raw Sources
- {links to competitor pages, posts, discussions}
```

**GATE:** Discovery Brief file exists and has content in all sections.

---

## Phase 1: Product Understanding

**Trigger:** Team gets the launch assignment OR Discovery Brief already exists from Phase 0.
**Who runs it:** gtm-strategist agent.
**Input:** Slack channels, product docs, feature-intel data, Discovery Brief (if exists), PMM interview notes (if provided).

### What to understand:

1. **What does it actually do?** (not marketing speak, the real thing)
2. **What problem does it solve?** (the user's words, not ours)
3. **Who is it for?** (specific builder segments, not "everyone")
4. **What makes it different from competitors?** (informed by Phase 0)
5. **What are the constraints?** (pricing, availability, known limitations)
6. **What data/numbers do we have?** (beta users, performance metrics, comparisons)

### Sources to read:

```
Skill(skill="feature-intel")          # Scan dev channels for product context
Skill(skill="data-insight")           # Pull usage data if available
slack_read_channel(channel_id=...)    # Product channels, beta feedback
Read(file_path="output/launch/{slug}/phase-0-discovery-brief.md")  # If exists
```

### PMM Interview Notes (Optional but Valuable)

Slack channels capture dev discussions but often miss the product vision, design rationale, and nuanced use cases that only come from talking to the PM/dev directly. If the PMM has interview notes, meeting recordings, or personal context from conversations with the product team, they should be provided here.

**How to include:** Drop a file into the working folder (any format: .md, .txt, pasted text) or paste notes directly into the conversation. The agent will incorporate them into the Product Brief alongside Slack data.

**What PMM notes typically add that Slack doesn't:**
- Why the feature exists (business motivation, user request patterns)
- How it actually works under the hood (capabilities and limitations)
- What was considered but cut (scope decisions, Phase 2 plans)
- Who the ideal first users are (beyond "builders")
- Known edge cases or gotchas

### Output: Product Brief

Save to `output/launch/{feature-slug}/phase-1-product-brief.md`:

```markdown
# Product Brief: {Feature Name}

## What It Does (Plain English)
{2-3 sentences, no marketing language}

## The Problem It Solves
{From the user's perspective, in their words}

## Target Segments
| Segment | Why They Care | Current Alternative | Pain Level |
|---------|--------------|-------------------|------------|

## Differentiation (vs Phase 0 Competitors)
| Us | Them | Why It Matters |
|----|------|---------------|

## Numbers We Can Use
- {stat 1 with source}
- {stat 2 with source}

## Constraints
- {limitation 1}
- {limitation 2}

## Open Questions
- {anything we still need answered before messaging}
```

**GATE:** Product Brief approved. All "Open Questions" resolved or explicitly accepted as unknowns.

---

## Phase 2: Pain Points + Competitive Positioning

**Who runs it:** gtm-strategist agent.
**Input:** Product Brief + Discovery Brief.

### What to define:

1. **Pain points** (ranked by severity, mapped to segments)
2. **Our position** (the ONE thing we own that nobody else does)
3. **Proof points** (numbers, testimonials, comparisons that back it up)
4. **Objections** (what skeptics will say, and our response)

### Output: Positioning Document

Save to `output/launch/{feature-slug}/phase-2-positioning.md`:

```markdown
# Positioning: {Feature Name}

## Core Position
{ONE sentence: what we are and why it matters}

## Pain Points (Ranked)
| # | Pain Point | Segment | Severity | How We Solve It |
|---|-----------|---------|----------|----------------|

## Proof Points
| Claim | Evidence | Source |
|-------|----------|--------|

## Competitive Positioning Matrix
| Dimension | Us | Competitor A | Competitor B |
|-----------|-----|-------------|-------------|

## Anticipated Objections
| Objection | Response | Proof |
|-----------|----------|-------|

## The Story Arc
{3-5 sentences: the narrative that connects problem -> solution -> result}
```

**GATE:** Positioning Document approved. Core Position is a single clear sentence.

---

## Phase 3: Messaging Framework (THE CRITICAL GATE)

**Who runs it:** gtm-strategist agent.
**Input:** Positioning Document.
**This is the single most important output.** Every asset in Phase 5 derives from this framework. If this is wrong, everything downstream is wrong.

### Output: Messaging Framework

Save to `output/launch/{feature-slug}/phase-3-messaging-framework.md` AND use template from `brands/base44/templates/messaging-framework.md`.

```markdown
# Messaging Framework: {Feature Name}

## Primary Message (The One Thing)
{1 sentence that captures the entire value proposition}

## H1 Options (for landing pages, ads, announcements)
1. {option 1, derived from Primary Message}
2. {option 2, different angle, same core message}

## H2 / Supporting Line
{Explains HOW the H1 promise is delivered}

## Key Messages (by audience)
| Audience | Message | Proof Point | Emotional Hook |
|----------|---------|-------------|----------------|
| Prototypers | {message} | {proof} | {hook} |
| Pro Builders | {message} | {proof} | {hook} |
| Enterprise | {message} | {proof} | {hook} |

## Approved Terminology
| USE | INSTEAD OF | WHY |
|-----|-----------|-----|
| {our term} | {competitor/generic term} | {reason} |

## Story Beats (for long-form content)
1. **The Problem:** {what builders struggle with today}
2. **The Insight:** {why existing solutions fall short}
3. **The Solution:** {what we built and why it's different}
4. **The Proof:** {numbers, examples, testimonials}
5. **The CTA:** {what to do next}

## Channel Adaptations
| Channel | Tone Adjustment | Length | Key Hook |
|---------|----------------|--------|----------|
| LinkedIn | Professional-casual | 80-120 words | {hook} |
| X | Punchy, direct | 280 chars or thread | {hook} |
| Email | Personal, direct | 150-200 words | {hook} |
| Landing Page | Benefit-driven | Full page | H1 + H2 |
| What's New | Feature-focused | Short paragraph | {hook} |
| Discord | Casual, excited | Short | {hook} |
| Reddit | Community-native | Medium | {hook} |
| Blog | Educational, deep | 800-1200 words | {hook} |
```

**GATE:** Messaging Framework locked. Primary Message is a single clear sentence. H1 options exist. Channel adaptations cover all planned channels. This document becomes READ-ONLY after approval. Changes require explicit re-approval.

---

## Phase 4: Asset Planning

**Who runs it:** planner agent.
**Input:** Messaging Framework (MANDATORY. Planner MUST NOT start without it).

### What to define:

1. **Which assets are needed** (derived from channel adaptations in Messaging Framework)
2. **Who creates each** (which specialist agent)
3. **Dependencies** (what needs to exist before what)
4. **Timeline** (working backward from launch date)
5. **Community activation** (Discord, Reddit, influencers)

### Output: Asset Plan

Save to `output/launch/{feature-slug}/phase-4-asset-plan.md` AND use template from `brands/base44/templates/asset-plan.md`.

```markdown
# Asset Plan: {Feature Name}

## Launch Date: {date}

## Assets Required
| # | Asset | Channel | Owner Agent | Depends On | Deadline | Status |
|---|-------|---------|-------------|-----------|----------|--------|
| 1 | Landing page | Web | copywriter + base44-landing-page | Messaging Framework | D-3 | pending |
| 2 | LinkedIn announcement | LinkedIn | linkedin-specialist | Landing page URL | D-0 | pending |
| 3 | Maor's personal post | LinkedIn | linkedin-specialist (Maor voice) | Messaging Framework | D-0 | pending |
| 4 | X announcement | X | x-specialist | Landing page URL | D-0 | pending |
| 5 | Email to existing builders | Email | copywriter | Landing page URL | D-0 | pending |
| 6 | What's New entry | Product | copywriter | Messaging Framework | D-0 | pending |
| 7 | Discord announcement | Discord | copywriter | Landing page URL | D-0 | pending |
| 8 | Reddit post | Reddit | copywriter | Landing page URL | D+1 | pending |
| 9 | Demo video | Video | video-specialist | Product ready | D-1 | pending |
| 10 | Blog post | Blog | seo-specialist | Messaging Framework | D+3 | pending |

## Community Activation Plan
| Channel | Action | Timing | Owner |
|---------|--------|--------|-------|
| Discord | Teaser post | D-3 | community team |
| Discord | Early access invites | D-1 | community team |
| Discord | Repost incentive (credits) | D+1 | community team |
| Reddit | r/base44 announcement | D+1 | community team |
| Influencers | Pre-briefing | D-2 | marketing |

## Teaser Cadence (Before Launch)
| Day | Channel | Content | Purpose |
|-----|---------|---------|---------|
| D-7 | X (Maor) | Cryptic teaser | Build anticipation |
| D-3 | Discord | Early access signup | Create waitlist |
| D-1 | LinkedIn (Maor) | "Been working on something" | Warm up audience |
| D-0 | All channels | Full launch | Maximum reach |

## Dependencies Graph
{Which assets block which (e.g., landing page must exist before any post can link to it)}

## Sign-Off Required From
- [ ] Product (feature accuracy)
- [ ] Design (visual assets)
- [ ] CEO/Maor (personal posts)
```

**GATE:** Asset Plan approved. All assets have owner agents, deadlines, and dependencies mapped. Community activation plan exists.

---

## Phase 5: Asset Creation (PARALLEL)

**Who runs it:** Specialist agents in parallel, ALL reading from the locked Messaging Framework.
**Input:** Messaging Framework + Asset Plan.

### MANDATORY: Channel-to-Agent Routing

**Each channel MUST be written by its designated specialist agent.** The copywriter is NOT a fallback for channels that have a dedicated specialist. This is non-negotiable.

| Channel | Agent | Skill | Why This Agent |
|---------|-------|-------|----------------|
| LinkedIn (brand + Maor) | `linkedin-specialist` | `linkedin-viral` | Knows LinkedIn algorithm, hook patterns, word limits, engagement triggers |
| X/Twitter (brand + Maor) | `x-specialist` | `x-viral` | Knows thread structure, character limits, X algorithm, hashtag strategy |
| Email | `copywriter` | `direct-response-copy` | THE SLIDE framework, subject line optimization |
| Landing Page | `copywriter` | `landing-page-architecture` + `base44-landing-page` | 8-Section Framework, HTML generation |
| Blog / SEO | `seo-specialist` | `seo-content` + `geo-content` | Search optimization, keyword targeting, AI citation |
| Paid Ads | `ad-specialist` | (none) | Platform-specific creative, A/B variations |
| Video | `video-specialist` | `remotion` | Remotion pipeline, brand animations |
| Discord | `copywriter` | (none) | Casual tone, community format |
| What's New | `copywriter` | (none) | Product changelog format |
| Reddit | `copywriter` | (none) | Community-native, non-promotional |
| Visual / Creative | `nano-banana` skill | (none) | Branded composite with logo, colors, STK Miso |

**WRONG:** Having the copywriter write a LinkedIn post. The linkedin-specialist exists for a reason.
**WRONG:** Having the linkedin-specialist write an email. The copywriter owns email.
**RIGHT:** Each asset routed to its specialist, who loads their channel skill for platform-specific rules.

### Execution:

```
FOR EACH asset in Asset Plan:
  1. Check dependencies (is the asset it depends on done?)
  2. Look up the CORRECT agent from the routing table above
  3. Invoke that SPECIFIC agent with:
     - Messaging Framework (MANDATORY context)
     - Asset Plan row (specific brief)
     - Brand context (RULES.md, tone-of-voice.md, shared-instructions.md)
     - Channel skill (agent's designated skill from the routing table)
  4. Agent MUST produce 2-3 variations (RULES.md #43)
  5. Agent MUST lead with user value, not the feature (RULES.md #42)
  6. Run through brand-guardian (score >= 9/10)
  7. Update Asset Plan status column
```

### Key Rule: DERIVE, DON'T INVENT

Every headline, hook, CTA, and key message in every asset MUST trace back to the Messaging Framework. Specialists adapt tone and format for their channel, but they do NOT invent new messaging. If a specialist needs a message that isn't in the framework, the framework needs updating first (back to Phase 3).

### Specialist Invocation Template:

```
## Context
You are the {agent_name} creating {asset_name} for the {feature_name} launch.

## Your Channel Skill (LOAD FIRST)
Read(file_path="skills/{skill_name}/SKILL.md")

## Messaging Framework (YOUR SOURCE OF TRUTH)
{Full contents of phase-3-messaging-framework.md}

## Your Specific Brief
- Channel: {channel}
- Format: {format}
- Length: {from channel adaptations}
- Key Hook: {from channel adaptations}
- Dependencies: {what exists already (e.g., landing page URL)}

## Channel Adaptation Notes
{Relevant row from Messaging Framework channel adaptations table}

## RULES (Non-Negotiable)
1. Derive, Don't Invent - content MUST trace to the Messaging Framework
2. Lead with user value, not the feature name (RULES.md #42)
3. Produce 2-3 distinct variations with different angles (RULES.md #43)
4. Load shared-instructions.md for voice rules
5. If creating visuals, use nano-banana with brand composite (RULES.md #44)
```

**GATE:** All assets in the Asset Plan have status "approved" with brand-guardian score >= 9/10. Every LinkedIn asset was written by linkedin-specialist. Every X asset was written by x-specialist. Every email by copywriter. No channel was written by the wrong agent.

---

## Phase 6: Launch Execution

**Who runs it:** planner agent (coordination) + router (delivery).
**Input:** All approved assets + Asset Plan.

### Launch Day Checklist:

Use template from `brands/base44/templates/launch-checklist.md`.

```markdown
# Launch Checklist: {Feature Name}

## Pre-Launch (D-1)
- [ ] All assets approved by brand-guardian
- [ ] Landing page live and tested
- [ ] Demo video uploaded
- [ ] Email scheduled
- [ ] Community teaser posted
- [ ] Influencers briefed
- [ ] CTA links verified (all point to correct URLs)
- [ ] Product flow tested (marketing page -> signup -> feature)

## Launch (D-0)
- [ ] LinkedIn announcement posted (brand account)
- [ ] Maor personal post published
- [ ] X announcement posted
- [ ] Email sent to existing builders
- [ ] What's New updated
- [ ] Discord announcement posted
- [ ] Community repost incentive activated

## Post-Launch (D+1 to D+7)
- [ ] Reddit post published
- [ ] Blog post published
- [ ] Monitor engagement, respond to comments
- [ ] Collect early feedback for iteration
- [ ] Report: what worked, what to improve
```

**GATE:** All checklist items checked. Post-launch report filed.

---

## Phase 7: Push to Product App (AUTO)

**Who runs it:** push-to-activity skill (auto-invoked after Phase 6).
**Input:** All approved assets from `output/launch/{slug}/assets/` + Messaging Framework metadata.

### What happens:

1. Reads all asset files from the waterfall output directory
2. Picks the recommended variation from each asset
3. Maps each asset to the corresponding MarketingActivity channel field
4. Creates or updates a MarketingActivity record in the Product App
5. Sets `approval_status: pending` and `submitted_at: now`
6. Reports which channels were filled and which are local-only

### Channel mapping:

| Asset | MarketingActivity Field |
|-------|------------------------|
| What's New (full launch version) | `whats_new_content` |
| LinkedIn Brand | `linkedin_base44_content` |
| LinkedIn Maor | `linkedin_maor_content` |
| X Brand (single + thread) | `x_base44_content` |
| X Maor (announcement + teaser) | `x_maor_content` |
| Discord (community + full launch) | `community_content` |
| Demo Video script | `demo_video_content` |

Assets without entity fields (email, reddit, blog, teasers) remain in the local output directory only.

### Invocation:

```
Skill(skill="push-to-activity")
```

No user confirmation needed. Content was already approved in Phase 5 (brand-guardian gate).

**GATE:** MarketingActivity record exists with all available channel content populated.

---

## How the Router Invokes This

When LAUNCH intent is detected:

```
1. Check: Does output/launch/{slug}/ exist?
   - If Phase 0 brief exists: "Discovery already started. Resuming from Phase {N}."
   - If nothing exists: "Starting fresh. Phase 0: Auto-Discovery."

2. Execute phases sequentially:
   Phase 0-3: gtm-strategist (with WebSearch for competitive intel)
   Phase 4: planner
   Phase 5: specialists in parallel (EACH channel routed to its designated agent) -> brand-guardian
   Phase 6: planner (coordination)
   Phase 7: push-to-activity (auto)

3. Between each phase:
   - Save output to output/launch/{slug}/phase-{N}-{name}.md
   - Present to user for approval
   - Only proceed when user says "approved" or "next"
```

## Connecting to feature-intel (Phase 0 Auto-Trigger)

When feature-intel detects a significant new feature:

1. Check if it's launch-worthy (new product, major feature, not a bug fix)
2. Auto-create `output/launch/{slug}/` directory
3. Run Phase 0 competitive research
4. Save Discovery Brief
5. Notify in Slack: "Discovery Brief ready for {feature}. Competitive landscape mapped."

This means when the team gets the launch assignment, Phase 0 is already done.

---

## Phase Resume Protocol

The waterfall can be paused and resumed. Each phase saves its output to disk. On resume:

```
1. Scan output/launch/{slug}/ for existing phase files
2. Find the latest completed phase
3. Present summary: "Phases 0-{N} complete. Resuming at Phase {N+1}."
4. Load all previous phase outputs as context
5. Continue from the next phase
```

---

## Anti-Patterns (What This Waterfall Prevents)

| Anti-Pattern | How It Happened Before | How Waterfall Prevents It |
|-------------|----------------------|--------------------------|
| Grocery list tactics | GTM strategist dumped 10 ideas | Phase 2 forces ONE position before any tactics |
| H1/H2 iteration hell | Copy written without messaging framework | Phase 3 locks messaging BEFORE any copy |
| Assets in isolation | LinkedIn, email, LP written independently | Phase 5 requires all assets derive from same framework |
| Last-minute scramble | Marketing started 6 days before launch | Phase 0 auto-triggers weeks before launch |
| Missing community | Discord/Reddit forgotten | Phase 4 requires community activation plan |
| No competitive context | Copy written without knowing competitors | Phase 0 maps competitive landscape first |
| Product questions mid-copy | Copywriter asks "what does it actually do?" | Phase 1 answers all product questions upfront |
