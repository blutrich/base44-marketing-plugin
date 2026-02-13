iis i# Ripple: GTM Automation Platform -- Staged PRD

> **Codename:** Ripple -- one seed dropped, five platforms hit, measured end-to-end, system learns.
> **Vision:** Each person's own marketing department.
> **Platform:** Base44-native (entities, agents, functions, deploy)
> **Status:** DRAFT

---

## What Exists Today (Baseline)

The Base44 Marketing Plugin (v1.8.0) is a Claude Code plugin (.md files only) that orchestrates content creation through 9 agents, 16 skills, and a brand governance layer. Phase 1 of Shay's feedback is complete:

**Completed:**
- Open-ended marketing router (no forced menus)
- GTM Strategist agent (deep strategic exploration)
- Anti-TV-ad cadence rules across all content agents
- 20 NEVER + 9 ALWAYS brand rules with Maor Test
- Tone-of-voice with anti-advertising patterns
- Brand-guardian quality gate

**Not Started:**
- Data intelligence layer (Shay Phase 2)
- Agent architecture redesign (Shay Phase 3)
- Agent Teams integration
- The Ripple Base44 app itself

This PRD covers the full journey from current state to Shay's vision: an autonomous, data-driven marketing system running on Base44.

---

## Milestone Overview

```
M0 [DONE]  Plugin Foundation     Claude Code plugin with 9 agents
    |
M1         Intelligence Layer    Data framework + analytics pipeline
    |
M2         Agent Architecture    Head of Marketing + Data Analyst + Agent Teams
    |
--- TRANSITION: Claude Code Plugin --> Base44 App ---
    |
M3         Ripple Core           Entity schemas + Orchestrator + Brand Guardian app
    |
M4         Content Factory       Content creation + Seed Expander + Batch Producer
    |
M5         Distribution          Channels + Scheduling + Cross-posting
    |
M6         Users & Metrics       AARRR funnel + Tiers + Attribution
    |
M7         Full Autonomy         Learning loop + WhatsApp + 24/7 agents
```

---

## M1: Intelligence Layer

**Goal:** Build the data-to-content pipeline. Start with manual data input, prepare for MCP automation.

**What this unlocks:** Content decisions driven by what builders actually build, not guesswork.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 1.1 | `data-intelligence` skill | Skill (.md) | SKILL.md + 3 reference files (data-sources, category-analysis, content-pipeline) |
| 1.2 | Data sources reference | Reference (.md) | Documents Olga, Tori, Noa Gordon contacts + system sources (pinback, docs, Reddit) |
| 1.3 | Category analysis framework | Reference (.md) | Scoring methodology: Volume (30%) + Trend (25%) + Revenue (25%) + Competitor Gap (20%) |
| 1.4 | Content pipeline reference | Reference (.md) | Data -> Analysis -> Strategy -> Content Plan -> Execution -> Measurement |
| 1.5 | Data directory + snapshot template | Directory + .md | `docs/data/` with README, latest-snapshot.md placeholder, snapshot template |

### Gate: M1 -> M2

All must pass before proceeding:

- [ ] `data-intelligence` skill exists with SKILL.md and 3 reference files
- [ ] Data snapshot template populated with at least one real data point from Olga or Tori
- [ ] Category analysis framework produces ranked content opportunities from sample data
- [ ] Content pipeline maps at least 3 data insights to specific agent workflows
- [ ] GTM Strategist agent can reference data-intelligence skill and use its output
- [ ] Plugin settings updated with data path permissions

**Gate owner:** Ofer
**Estimated scope:** 1-2 sessions

---

## M2: Agent Architecture

**Goal:** Evolve the plugin toward Shay's autonomous marketing intelligence vision. Router becomes Head of Marketing. Add Data Analyst agent. Integrate Agent Teams for parallel execution.

**What this unlocks:** Proactive content recommendations, parallel campaign generation, autonomous data processing.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 2.1 | Head of Marketing persona on router | Skill update | Proactive mode: loads data, recommends content when no specific task given |
| 2.2 | Data Analyst agent | Agent (.md) | Processes raw builder data, scores categories, surfaces insights |
| 2.3 | DATA_INSIGHT workflow | Workflow | Data -> data-analyst -> category rankings -> content recommendations -> execution |
| 2.4 | Agent Teams templates | Templates (.md) | campaign-launch, content-sprint, brand-audit, ab-testing team templates |
| 2.5 | Agent Teams hooks | Hooks (.sh + .json) | TaskCompleted (enforce guardian review), TeammateIdle (redirect to tasks) |
| 2.6 | Team-aware routing | Skill update | Router detects multi-channel/sprint/audit triggers, escalates to Agent Teams |
| 2.7 | Memory protocol for teams | Protocol (.md) | File-based context sharing, directory ownership rules, post-team memory update |
| 2.8 | Architecture update | Docs update | 4-layer hierarchy (Strategic, Ideation, Execution, Quality) in CLAUDE.md |

### Gate: M2 -> M3

All must pass before proceeding:

- [ ] Router proactively recommends content based on loaded data (test: "What should we be creating?")
- [ ] Data Analyst agent processes sample data and produces Builder Intelligence Report
- [ ] Full flow works: data -> analysis -> strategy -> execution -> brand review
- [ ] Agent Teams campaign-launch template spawns 4+ teammates in parallel and produces content
- [ ] Brand guardian reviews every piece before campaign completion
- [ ] No existing single-channel workflows broken (LinkedIn post, tweet still fast-path)
- [ ] Plugin version bumped to 2.0.0
- [ ] Agent count: 10 (original 8 + gtm-strategist + data-analyst)

**Gate owner:** Ofer + Shay (sign-off on Head of Marketing behavior)
**Estimated scope:** 3-5 sessions
**Key risk:** Agent Teams is experimental. Fallback: continue with sequential agent chains.

---

## M3: Ripple Core (Base44 App)

**Goal:** Create the Ripple Base44 application with entity schemas, orchestrator agent, and brand guardian. This is the transition from Claude Code plugin to Base44 platform.

**What this unlocks:** Persistent data storage, WhatsApp interface, deployable web app, real-time entity operations.

**Prerequisite decision:** Confirm Base44 capabilities support all required entity types and agent JSONC patterns. If >1 week delay, start with partial entity set and migrate.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 3.1 | BrandVoice entity | Entity schema | name, platform, tone_rules, examples, anti_patterns, score_rubric |
| 3.2 | ContentPiece entity | Entity schema | title, body, platform, status, seed_id, campaign_id, metrics, guardian_score |
| 3.3 | Campaign entity | Entity schema | name, goal, audience_tier, channels, start_date, end_date, budget, status |
| 3.4 | ContentSeed entity | Entity schema | idea, source, tags, status, priority, expanded_count |
| 3.5 | Channel entity | Entity schema | name, type, config, posting_rules, best_times, audience_overlap |
| 3.6 | Orchestrator agent (JSONC) | Agent config | Routes all requests, manages context, ping-pong depth engine |
| 3.7 | Brand Guardian agent (JSONC) | Agent config | Voice enforcement, quality gate, pass/fail + specific fixes |
| 3.8 | `routeToAgent()` function | Function | Intent classification + agent routing |
| 3.9 | `enforceBrandVoice()` function | Function | Scores content against BrandVoice entity, suggests fixes |
| 3.10 | `generateContent()` function | Function | LLM call with voice enforcement baked in |
| 3.11 | Dashboard page | Frontend | AARRR funnel placeholder, active campaigns, recent content |
| 3.12 | Content Studio page | Frontend | Create, edit, review, schedule content |

### Gate: M3 -> M4

All must pass before proceeding:

- [ ] All 5 entity schemas created and CRUD operations verified
- [ ] Orchestrator agent routes "Write a LinkedIn post about X" to correct downstream agent
- [ ] Orchestrator implements ping-pong depth: asks 2-3 probing questions before generating
- [ ] Brand Guardian scores a sample content piece and returns pass/fail + fixes
- [ ] `enforceBrandVoice()` rejects content with TV-ad cadence patterns
- [ ] Dashboard renders with placeholder data
- [ ] Content Studio can create a ContentPiece entity and display it
- [ ] WhatsApp SDK connection verified (can receive message, route to orchestrator, return response)
- [ ] `base44 site deploy` succeeds

**Gate owner:** Ofer + Shay (UX review of Dashboard + Content Studio)
**Estimated scope:** Weeks 1-2 of app development
**Key risk:** Base44 agent JSONC limitations may not support full orchestrator complexity. Fallback: split orchestrator into smaller agents.

---

## M4: Content Factory

**Goal:** Build the content creation and scaling engines. One seed in, five platforms hit.

**What this unlocks:** The Ripple Effect -- single ideas expanded across all channels automatically.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 4.1 | Content Agent (JSONC) | Agent config | Content creation + repurposing across formats |
| 4.2 | `expandSeed()` function | Function | Takes one ContentSeed, generates multi-platform ContentPiece variations |
| 4.3 | Video Script Agent (JSONC) | Agent config | Scripts for product demos, explainers, social clips |
| 4.4 | Image Prompt Agent (JSONC) | Agent config | Generates image prompts with platform-specific specs |
| 4.5 | Copywriter Agent (JSONC) | Agent config | Ad copy, email subjects, CTAs, landing page copy |
| 4.6 | Batch Producer function | Function | Friday agent: generates next week's content queue from seeds + gaps + trends |
| 4.7 | Seed Bank UI | Frontend update | Content Studio section for managing ContentSeed entities |
| 4.8 | Repurpose flow | Function | ContentPiece on one platform -> adapted versions for others |

### Gate: M4 -> M5

All must pass before proceeding:

- [ ] Seed Expander: 1 ContentSeed in -> 5+ ContentPiece drafts out (LinkedIn, X, Email, Blog, Video script)
- [ ] Each generated piece passes Brand Guardian with score >= 7/10
- [ ] Batch Producer generates 3-5 ready-to-publish posts from seed bank + data insights
- [ ] Repurpose flow converts LinkedIn post -> X thread -> Email section
- [ ] Content Studio displays seed bank and expansion results
- [ ] All generated ContentPieces stored as entities with correct relationships (seed_id, campaign_id)

**Gate owner:** Ofer
**Estimated scope:** Week 3 of app development
**Key risk:** LLM quality variance across platforms. Mitigation: Brand Guardian scores every piece; below 7/10 goes back.

---

## M5: Distribution

**Goal:** Get content to the right place, at the right time, in the right format. Automate publishing.

**What this unlocks:** Scheduled publishing, community monitoring, engagement at scale.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 5.1 | Audience entity | Entity schema | tier, jtbd, pain_points, value_props, size_estimate, engagement_score |
| 5.2 | Schedule entity | Entity schema | content_id, channel_id, publish_time, status, result |
| 5.3 | Feedback entity | Entity schema | source, content, sentiment, category, routed_to, resolved |
| 5.4 | `publishToChannel()` function | Function | Posts content to LinkedIn/X/email via APIs |
| 5.5 | `schedulePost()` function | Function | Queues content for optimal publishing time based on Channel entity data |
| 5.6 | Smart Scheduler agent (JSONC) | Agent config | Optimizes timing per platform based on audience data |
| 5.7 | Cross-Post Adapter agent (JSONC) | Agent config | Reformats content per platform rules (char limits, hashtags, etc.) |
| 5.8 | Community Listener agent (JSONC) | Agent config | Monitors Discord, Reddit, WhatsApp groups for signals |
| 5.9 | Comment Engine agent (JSONC) | Agent config | Generates authentic engagement responses to target posts |
| 5.10 | Email Sequencer agent (JSONC) | Agent config | Manages drip campaigns, newsletters, nurture flows |

### Gate: M5 -> M6

All must pass before proceeding:

- [ ] Content published to LinkedIn via API (real post, not mock)
- [ ] Content published to X via API (real post, not mock)
- [ ] Email sent via sequencer (test list)
- [ ] Smart Scheduler queues 5 posts across 3 channels with timing rationale
- [ ] Community Listener returns at least 3 signals from Reddit monitoring
- [ ] Schedule entity tracks publish time, status, and result for each post
- [ ] Cross-Post Adapter correctly reformats: LinkedIn (3000 chars, no hashtag spam) -> X (280 chars) -> Email (full format)

**Gate owner:** Ofer + Shay (review of first real published content)
**Estimated scope:** Week 4 of app development
**Key risk:** API rate limits and authentication for LinkedIn/X. Mitigation: start with manual approval before auto-publish.

---

## M6: Users & Metrics

**Goal:** Measure everything. Close the loop. Understand who builders are and what works.

**What this unlocks:** AARRR funnel visibility, content attribution, data-driven iteration.

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 6.1 | Metric entity | Entity schema | name, value, date, source, campaign_id, channel, funnel_stage |
| 6.2 | Competitor entity | Entity schema | name, url, positioning, recent_changes, threat_level |
| 6.3 | JTBD Analyst agent (JSONC) | Agent config | Maps builders to Jobs-To-Be-Done frameworks |
| 6.4 | Tier Classifier agent (JSONC) | Agent config | Segments builders: A (power 5%), B (growing 25%), C (casual 70%) |
| 6.5 | Competitive Radar agent (JSONC) | Agent config | Tracks competitor messaging, positioning shifts |
| 6.6 | `analyzeMetrics()` function | Function | Aggregates metrics, calculates trends, feeds AARRR dashboard |
| 6.7 | `classifyUser()` function | Function | Assigns builders to tiers based on behavior data |
| 6.8 | Attribution Mapper agent (JSONC) | Agent config | Traces conversions back to content/channel source |
| 6.9 | Weekly Synthesizer agent (JSONC) | Agent config | Generates weekly marketing performance summary for Shay |
| 6.10 | `weeklySynthesis()` function | Function | Aggregates all metrics into executive summary |
| 6.11 | Audience Explorer page | Frontend | Browse user tiers, JTBD profiles, feedback |
| 6.12 | Competitor Intel page | Frontend | Competitor tracking, positioning map |
| 6.13 | AARRR Dashboard update | Frontend update | Real funnel data replacing placeholders |

### Gate: M6 -> M7

All must pass before proceeding:

- [ ] AARRR Dashboard shows real data across all 5 funnel stages (Acquisition -> Activation -> Retention -> Referral -> Revenue)
- [ ] At least one content piece has full attribution: content -> channel -> conversion
- [ ] Tier Classifier assigns 10+ builders to correct tiers based on behavior data
- [ ] Weekly Synthesizer produces readable executive summary with 3+ actionable insights
- [ ] Competitor Radar identifies at least 2 competitor positioning changes
- [ ] Audience Explorer page displays JTBD profiles for top 3 builder segments
- [ ] Metrics entity stores data from at least 2 channels (e.g., LinkedIn + Email)

**Gate owner:** Shay (reviews weekly synthesis quality)
**Estimated scope:** Month 2, weeks 1-2
**Key risk:** Data availability from analytics systems (Olga's dashboard). Mitigation: manual data entry until integrations are live.

---

## M7: Full Autonomy

**Goal:** The system gets smarter over time. Learning loop closes. Agents operate proactively. WhatsApp-first interface.

**What this unlocks:** Shay's vision -- "army of agents running 24/7, making content decisions, generating content."

### Deliverables

| # | Deliverable | Type | Description |
|---|-------------|------|-------------|
| 7.1 | Learning Loop integration | System | Metrics -> Feedback -> Voice DNA -> Brand Memory -> Better Content cycle |
| 7.2 | WhatsApp full interface | Integration | User talks to orchestrator via WhatsApp, gets content back |
| 7.3 | Anomaly Alerter agent (JSONC) | Agent config | Flags unexpected spikes or drops in any metric |
| 7.4 | `alertAnomaly()` function | Function | Monitors metric streams, pushes alerts with context |
| 7.5 | A/B Verdict agent (JSONC) | Agent config | Analyzes experiments, declares winners with statistical significance |
| 7.6 | ROI Calculator agent (JSONC) | Agent config | Maps marketing spend/effort to revenue impact |
| 7.7 | Internal Amplifier agent (JSONC) | Agent config | Shares wins internally (Slack, Monday emails, team updates) |
| 7.8 | Proactive Content Engine | System | System initiates content creation based on data without human prompt |
| 7.9 | Settings page | Frontend | Voice profiles, channel configs, integrations |
| 7.10 | Campaign Planner page | Frontend | Build campaigns, assign channels, set goals |
| 7.11 | OpenClaw fork for internal team | Integration | General team AI tool via WhatsApp/Telegram/Slack |

### Gate: M7 Complete (Ship)

- [ ] Learning Loop: Published content performance feeds back into next content decisions (end-to-end verified)
- [ ] WhatsApp: "I need a campaign for BaaS" sent via WhatsApp -> orchestrator routes -> content generated -> returned via WhatsApp
- [ ] Proactive: System recommends content creation unprompted based on new data or metric changes
- [ ] A/B: System runs 1 A/B test, collects results, and declares winner with reasoning
- [ ] Weekly Synthesis: Shay receives automated weekly summary that requires no manual prompting
- [ ] Brand Guardian: Has processed 50+ content pieces and voice scoring has measurably improved
- [ ] ROI: At least 1 campaign has cost-to-conversion attribution

**Gate owner:** Shay (final vision alignment review)
**Estimated scope:** Month 2+
**Key risk:** Full autonomy requires trust. Mitigation: human-in-the-loop approval for first 30 days of proactive content.

---

## Cross-Milestone Dependencies

```
M1 -----> M2 -----> M3 -----> M4 -----> M5 -----> M6 -----> M7
                     |                    |                    |
                     |                    |                    |
               Base44 app created   APIs connected      Loop closed
               (major transition)   (external deps)     (full system)
```

| Dependency | From | To | Description |
|------------|------|----|-------------|
| Data framework | M1 | M2 | Data Analyst agent needs data-intelligence skill |
| Agent Teams | M2 | M3 | Team patterns inform app agent architecture |
| Plugin -> App | M2 | M3 | Plugin intelligence migrates into Base44 entities |
| Entity schemas | M3 | M4 | Content Factory needs ContentPiece, ContentSeed entities |
| Content entities | M4 | M5 | Distribution needs content to distribute |
| Channel APIs | M5 | M6 | Metrics need published content to measure |
| Metrics | M6 | M7 | Learning loop needs measurement data to learn from |
| Olga data access | M1 | M3 | Builder analytics needed for data intelligence |
| LinkedIn API | M5 | -- | Publishing requires API access |
| X API | M5 | -- | Publishing requires API access |
| WhatsApp SDK | M3 | M7 | WhatsApp interface needs Base44 WhatsApp integration |
| MCP connector | M1 (nice-to-have) | M3 (needed) | Automated data ingestion vs manual snapshots |

---

## Risk Register

| # | Risk | P | I | Score | Milestone | Mitigation |
|---|------|---|---|-------|-----------|------------|
| R1 | No builder data from Olga/Tori | 4 | 4 | 16 | M1 | Manual snapshot process; skill works without MCP |
| R2 | Agent Teams instability | 3 | 3 | 9 | M2 | Sequential agent chains as fallback |
| R3 | Base44 JSONC agent limitations | 3 | 4 | 12 | M3 | Split complex agents into smaller ones; use Functions for logic |
| R4 | LinkedIn/X API rate limits | 3 | 3 | 9 | M5 | Manual approval queue; batch publishing off-peak |
| R5 | LLM quality variance across platforms | 3 | 3 | 9 | M4 | Brand Guardian scores every piece; below 7/10 rejected |
| R6 | Scope creep across 7 milestones | 4 | 3 | 12 | All | Gates enforce completion before progression; each milestone is shippable |
| R7 | WhatsApp integration complexity | 3 | 3 | 9 | M3, M7 | Start with web interface; WhatsApp is enhancement |
| R8 | Shay's vision vs technical feasibility | 2 | 4 | 8 | M7 | Human-in-the-loop first 30 days; autonomous mode earned |

---

## Entity Schema Summary (M3-M6)

| Entity | Milestone | Fields (key) | Relationships |
|--------|-----------|-------------|---------------|
| BrandVoice | M3 | name, platform, tone_rules, anti_patterns, score_rubric | -- |
| ContentPiece | M3 | title, body, platform, status, metrics, guardian_score | -> ContentSeed, -> Campaign |
| Campaign | M3 | name, goal, audience_tier, channels, budget, status | -> ContentPiece[] |
| ContentSeed | M3 | idea, source, tags, priority, expanded_count | -> ContentPiece[] |
| Channel | M3 | name, type, config, posting_rules, best_times | -> Schedule[] |
| Audience | M5 | tier, jtbd, pain_points, value_props, engagement_score | -> Campaign[] |
| Schedule | M5 | content_id, channel_id, publish_time, status, result | -> ContentPiece, -> Channel |
| Feedback | M5 | source, content, sentiment, category, resolved | -- |
| Metric | M6 | name, value, date, source, campaign_id, funnel_stage | -> Campaign, -> Channel |
| Competitor | M6 | name, url, positioning, recent_changes, threat_level | -- |

---

## Agent Inventory (Full System)

### Claude Code Plugin Agents (M0-M2)

| Agent | Milestone | Model | Status |
|-------|-----------|-------|--------|
| marketing-router | M0 | -- | DONE |
| gtm-strategist | M0 | Opus | DONE |
| linkedin-specialist | M0 | Opus | DONE |
| x-specialist | M0 | Opus | DONE |
| copywriter | M0 | Sonnet | DONE |
| ad-specialist | M0 | Sonnet | DONE |
| seo-specialist | M0 | Sonnet | DONE |
| video-specialist | M0 | Sonnet | DONE |
| planner | M0 | Opus | DONE |
| brand-guardian | M0 | Haiku | DONE |
| data-analyst | M2 | Sonnet | PLANNED |

### Ripple Base44 App Agents (M3-M7)

| Agent | Milestone | JSONC Config | Zone |
|-------|-----------|-------------|------|
| Orchestrator | M3 | orchestrator.jsonc | Core |
| Brand Guardian (app) | M3 | brand-guardian.jsonc | Zone 1 |
| Content Agent | M4 | content-agent.jsonc | Zone 2 |
| Strategy Agent | M3 | strategy-agent.jsonc | Core |
| Research Agent | M6 | research-agent.jsonc | Zone 4 |
| Analytics Agent | M6 | analytics-agent.jsonc | Zone 5 |
| Smart Scheduler | M5 | -- (function-based) | Zone 3 |
| Community Listener | M5 | -- (function-based) | Zone 3 |
| Comment Engine | M5 | -- (function-based) | Zone 3 |
| Email Sequencer | M5 | -- (function-based) | Zone 3 |
| JTBD Analyst | M6 | -- (function-based) | Zone 4 |
| Tier Classifier | M6 | -- (function-based) | Zone 4 |
| Competitive Radar | M6 | -- (function-based) | Zone 4 |
| Attribution Mapper | M6 | -- (function-based) | Zone 5 |
| Weekly Synthesizer | M6 | -- (function-based) | Zone 5 |
| Anomaly Alerter | M7 | -- (function-based) | Zone 5 |
| A/B Verdict | M7 | -- (function-based) | Zone 5 |
| ROI Calculator | M7 | -- (function-based) | Zone 5 |

---

## Functions Inventory (M3-M7)

| Function | Milestone | Input | Output |
|----------|-----------|-------|--------|
| `routeToAgent()` | M3 | User message | Agent ID + context payload |
| `enforceBrandVoice()` | M3 | ContentPiece draft | Score + fix suggestions |
| `generateContent()` | M3 | Brief + voice rules | ContentPiece draft |
| `expandSeed()` | M4 | ContentSeed | ContentPiece[] (multi-platform) |
| `publishToChannel()` | M5 | ContentPiece + Channel | Published URL + status |
| `schedulePost()` | M5 | ContentPiece + Channel + timing | Schedule entity |
| `digestFeedback()` | M5 | Raw feedback from any source | Categorized Feedback entity |
| `analyzeMetrics()` | M6 | Metric[] | Trends + summary |
| `classifyUser()` | M6 | User behavior data | Tier assignment |
| `scrapeCompetitors()` | M6 | Competitor URLs | Competitor entity updates |
| `weeklySynthesis()` | M6 | All metrics + content performance | Executive summary |
| `alertAnomaly()` | M7 | Metric streams | Alert + context + suggested action |

---

## Frontend Pages (M3-M7)

| Page | Milestone | Purpose | Key Components |
|------|-----------|---------|----------------|
| Dashboard | M3 | AARRR funnel, campaigns, recent content | Funnel chart, campaign cards, content feed |
| Content Studio | M3 | Create, edit, review, schedule | Editor, seed bank, guardian review panel |
| Campaign Planner | M7 | Build campaigns, assign channels | Campaign builder, channel selector, timeline |
| Audience Explorer | M6 | Browse tiers, JTBD profiles | Tier filter, profile cards, feedback feed |
| Competitor Intel | M6 | Competitor tracking | Positioning map, change timeline |
| Settings | M7 | Voice profiles, channel configs | Config forms, integration status |

---

## Shay's Requirements Traceability

| Shay Requirement | Milestone | Deliverable | Status |
|-----------------|-----------|-------------|--------|
| Open entry -- no forced categories | M0 | Open-ended router | DONE |
| Brainstorm depth -- ping-pong before ideas | M0 | GTM Strategist + marketing-ideas update | DONE |
| Think like a marketer -- strategy, not idea lists | M0 | GTM Strategist agent | DONE |
| Data connections -- Olga, Tori, pinback, docs | M1 | data-intelligence skill + data sources ref | PLANNED |
| Agent = head of marketing | M2 | Head of Marketing persona on router | PLANNED |
| Feedback loop -- sharpens conclusions | M0 (partial), M7 (full) | learning-log (done) + Learning Loop system | PARTIAL |
| Base44 native platform | M3 | Ripple Base44 app | PLANNED |
| Tone/voice -- content person refining | M0 | Anti-advertising rules + Maor Test | DONE (pending content hire input) |
| Army of agents 24/7 | M7 | Proactive Content Engine | PLANNED |
| WhatsApp-first interface | M3 (setup), M7 (full) | WhatsApp SDK integration | PLANNED |

---

## Implementation Priority Summary

| Milestone | Timeline | Effort | Dependencies | Shippable Value |
|-----------|----------|--------|-------------|-----------------|
| **M1** | Week 1 | 1-2 sessions | Phase 1 complete (done) | Data-driven content recommendations |
| **M2** | Weeks 1-2 | 3-5 sessions | M1 gate passed | Autonomous recommendations + parallel campaigns |
| **M3** | Weeks 3-4 | 1-2 weeks dev | M2 gate passed | Working Base44 app with core entities |
| **M4** | Week 5 | 1 week dev | M3 gate passed | Content at scale (Ripple Effect) |
| **M5** | Week 6 | 1 week dev | M4 gate + API access | Automated publishing across channels |
| **M6** | Weeks 7-8 | 1-2 weeks dev | M5 gate + analytics access | Full measurement + attribution |
| **M7** | Weeks 9+ | Ongoing | M6 gate | Full autonomy + learning loop |

---

## Decision Log

| # | Decision | Rationale | Alternatives Considered |
|---|----------|-----------|------------------------|
| D1 | M1-M2 stay as Claude Code plugin; M3+ is Base44 app | Plugin is fastest path for intelligence layer; app needed for entities + deploy | Building app from scratch (slower), staying plugin-only (no entities/WhatsApp) |
| D2 | Milestone gates require Shay sign-off at M2, M3, M6, M7 | Shay's vision drives the product; checkpoints prevent drift | Auto-progression (risk of building wrong thing) |
| D3 | Manual data before MCP | Unblocks M1 immediately; MCP is optimization | Waiting for MCP (blocks all data work) |
| D4 | Human-in-the-loop for first 30 days of M7 | Trust must be earned; bad autonomous content = brand damage | Full autonomy from day 1 (too risky) |
| D5 | 6 JSONC agents + 12 functions (not 30+ agents) | Base44 agents are config files; most "agents" in the architecture doc are better implemented as functions | One JSONC agent per capability (too many configs, hard to maintain) |
| D6 | WhatsApp connected at M3 but full interface at M7 | Early connection validates SDK; full interface needs content pipeline working first | WhatsApp from M3 (too much at once), WhatsApp only at M7 (late validation) |

---

*Created: 2026-02-12*
*Source: Ripple GTM Automation Architecture + Shay Feedback Implementation Plan + Agent Teams Integration Plan*
*Next action: Begin M1 deliverables*
