# Shay's Feedback Implementation Plan

> **For Claude:** REQUIRED: Follow this plan phase-by-phase. Each task includes exact file paths and content changes.
> **Source:** Recorded conversation with Shay (Head of Marketing), February 2026.
> **Context:** This is a strategic overhaul of the base44-marketing plugin (v1.7.0), not incremental improvements.

**Goal:** Transform the plugin from a content-generation tool into a data-driven marketing intelligence system that acts like a head of marketing, not an idea vending machine.

**Architecture:** Three-track approach: (1) Immediate plugin fixes for tone, router, and brainstorm depth, (2) Data pipeline connecting builder analytics to content strategy, (3) Agent hierarchy redesign where the router becomes a strategic "head of marketing" orchestrator.

**Tech Stack:** Claude Code plugin system (.md files for agent/skill definitions), MCP connectors for data integration, .claude/marketing/ memory files for persistent learning.

**Prerequisites:**
- Plugin source repo at `/Users/oferbl/Desktop/Dev/Base Marketing Plugin/base44-marketing-plugin`
- Existing 8 agents and 15 skills functional
- Brand governance files (RULES.md, tone-of-voice.md, learning-log.md) in place

---

## Relevant Codebase Files

### Files Modified in This Plan

| File | Track | Task |
|------|-------|------|
| `brands/base44/RULES.md` | 1 | Task 1.1 |
| `brands/base44/tone-of-voice.md` | 1 | Task 1.2 |
| `brands/base44/learning-log.md` | 1 | Task 1.3 |
| `skills/marketing-router/SKILL.md` | 1 | Task 1.4 |
| `skills/marketing-router/reference/workflows.md` | 1 | Task 1.4, 1.5 |
| `CLAUDE.md` (lines 161-175, Voice Quick Reference) | 1 | Task 1.6 |
| `skills/marketing-ideas/SKILL.md` | 1 | Task 1.5 |
| `agents/planner.md` | 1 | Task 1.5 |
| `agents/linkedin-specialist.md` (lines 69-79) | 1 | Task 1.7 |
| `agents/x-specialist.md` | 1 | Task 1.7 |
| `agents/copywriter.md` | 1 | Task 1.7 |
| `agents/ad-specialist.md` | 1 | Task 1.7 |
| `agents/seo-specialist.md` | 1 | Task 1.7 |
| `skills/hook-rules/SKILL.md` (lines 62-69) | 1 | Task 1.7 |
| `skills/direct-response-copy/SKILL.md` | 1 | Task 1.7 |
| NEW: `agents/gtm-strategist.md` | 1 | Task 1.5 |
| NEW: `skills/data-intelligence/SKILL.md` | 2 | Task 2.1 |
| NEW: `skills/data-intelligence/reference/data-sources.md` | 2 | Task 2.2 |
| NEW: `skills/data-intelligence/reference/category-analysis.md` | 2 | Task 2.3 |
| NEW: `skills/data-intelligence/reference/content-pipeline.md` | 2 | Task 2.4 |
| NEW: `agents/data-analyst.md` | 3 | Task 3.2 |

### Patterns to Follow
- Agent definitions: `agents/brand-guardian.md` (lines 1-13) -- frontmatter format
- Skill definitions: `skills/marketing-ideas/SKILL.md` (lines 1-9) -- frontmatter format
- Router decision tree: `skills/marketing-router/SKILL.md` (lines 27-44) -- table format
- Rule additions: `brands/base44/RULES.md` (lines 8-29) -- numbered rule format
- Learning log entries: `brands/base44/learning-log.md` (lines 137-164) -- entry format

### Configuration Files
- `.claude-plugin/settings.json` -- permissions (may need update for new data paths)
- `.claude-plugin/plugin.json` -- plugin metadata (version bump)

---

## Architecture Decision Records

### ADR-001: Router Redesign -- Open-Ended vs Menu-Driven

**Context:** Shay explicitly said the first interaction should NOT be a category menu (LinkedIn / X / Brainstorm / Campaign). Users should be able to say what they want naturally, and the router should figure out intent.

**Decision:** Replace the keyword-based decision tree with a two-phase intent detection model:
1. Phase 1: Open prompt -- "What are you working on?" with no forced categories
2. Phase 2: Natural language classification using the existing keyword table as a fallback, not a gate

**Consequences:**
- **Positive:** More natural UX, supports ambiguous requests ("help me think about our CRM content strategy"), aligns with "head of marketing" persona
- **Negative:** Slightly more complex routing logic, potential for misclassification on edge cases
- **Alternatives Considered:** Keeping menu but adding "Other" option (too incremental, doesn't address Shay's core complaint); fully removing keywords (too risky, existing single-task workflows like "write a LinkedIn post" should still fast-path)

### ADR-002: GTM Strategist -- New Agent vs Enhanced Planner

**Context:** Shay wants deep strategic back-and-forth before any content is created. The current planner agent goes straight to content calendars. The brainstorm flow (marketing-ideas skill) outputs bulleted tactic lists. Neither delivers what Shay described: "a holistic marketing plan, not a grocery list."

**Decision:** Create a new `gtm-strategist` agent that sits between ideation and planning. It handles strategic exploration: understanding context deeply, asking probing questions, developing holistic go-to-market plans with timelines, asset requirements, and channel strategies. The existing `planner` agent remains for tactical content calendar creation.

**Consequences:**
- **Positive:** Separation of concerns (strategy vs. execution planning), deeper strategic conversations, dedicated model (Opus) for complex reasoning
- **Negative:** One more agent in the chain, potential confusion about when to use strategist vs. planner
- **Alternatives Considered:** Enhancing planner agent (would overload a single agent definition, mixing strategic and tactical concerns); enhancing marketing-ideas skill (skills are for reference, not multi-turn conversation)

### ADR-003: TV-Ad Tone Prohibition -- Rule Scope

**Context:** Shay called out "One workspace. Unlimited builders. No friction." as sounding like a TV commercial script. The "melody of the text" is wrong. This is different from the existing anti-AI rules (arrows, choppy sentences) -- it's about a specific cadence pattern: short declarative fragments with periods.

**Decision:** Add a new RULES.md category specifically for "TV-ad cadence" patterns: fragmented tagline structures, stacked one-liners, and advertising-copy rhythm. This supplements existing rules 13 (short-sentence-period cadence) and 7 (choppy sentences) with a more precise prohibition.

**Consequences:**
- **Positive:** Directly addresses Shay's most visceral complaint, gives brand-guardian a clear signal to catch this pattern
- **Negative:** Subjective boundary -- some punchy writing is fine, only the TV-ad cadence is bad
- **Alternatives Considered:** Relying on existing rule 13 alone (too narrow -- rule 13 covers period cadence but not the broader TV-ad rhythm issue)

### ADR-004: Data Pipeline -- MCP vs File-Based

**Context:** Shay wants the agent to analyze what builders are building, discover categories, and generate content strategy from data. There may be an MCP connector to Base44 database tables already. Data sources include: Olga's analytics, Tori's weekly presentations, pinback.base44.com, Base44 docs.

**Decision:** Design a hybrid approach: (1) A `data-intelligence` skill that defines the data schema, analysis frameworks, and content pipeline templates; (2) MCP connectors as the data ingestion mechanism (when available); (3) Manual data input via .md files as the immediate fallback. The skill operates as a "data layer" that any agent can reference.

**Consequences:**
- **Positive:** Works immediately with manual data, scales to automated MCP when ready, separates data schema from data transport
- **Negative:** Manual data input requires someone to update .md files until MCP is connected
- **Alternatives Considered:** Waiting for MCP only (blocks all data work); building custom API (out of scope for plugin system -- plugins are .md files, no custom code execution)

---

## Phase 1: Immediate Plugin Improvements (Track 1)

**Goal:** Fix tone, router rigidity, and brainstorm depth. All changes within existing plugin .md files.
**Estimated effort:** 1-2 sessions.
**Dependencies:** None -- can start immediately.

### Task 1.1: Update RULES.md -- Add Shay's Tone Prohibitions

**Files:**
- Modify: `plugins/base44-marketing/brands/base44/RULES.md`

**Step 1: Add TV-ad cadence prohibition to NEVER DO (Instant Rejection) section**

Add these rules after line 29 (rule 15):

```markdown
16. **No TV-ad tagline cadence** - "One workspace. Unlimited builders. No friction." is TV commercial script, not builder talk. Avoid stacked short declarative fragments that read like ad copy (Shay, 2026-02-09)
17. **No bulleted idea lists as final output** - Bulleted lists of ideas is an "AI thing." Deliver holistic plans with narrative structure, not grocery lists (Shay, 2026-02-09)
18. **No advertising melody** - If the rhythm sounds like it belongs on a billboard or in a 30-second spot, rewrite it. Content should sound like how Maor actually talks, not copywriting (Shay, 2026-02-09)
```

**Step 2: Add to ALWAYS DO section**

Add after line 39 (rule 7):

```markdown
8. **Sound like Maor** - Read Maor's actual LinkedIn posts in learning-log.md. Match his casual, specific, story-driven cadence. Not copywriting. Not advertising. Conversation. (Shay, 2026-02-09)
9. **Holistic plans over idea dumps** - When brainstorming, deliver integrated marketing plans: channels, timeline, assets needed, how it all connects. Not a list of disconnected tactics. (Shay, 2026-02-09)
```

**Step 3: Update rule count at bottom of file**

```markdown
*Last updated: 2026-02-09*
*Rules: 20 NEVER + 9 ALWAYS*
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/brands/base44/RULES.md
git commit -m "rules: add TV-ad cadence prohibition, bulleted-list ban, Maor voice standard (Shay feedback)"
```

---

### Task 1.2: Update tone-of-voice.md -- Add Anti-Advertising Section

**Files:**
- Modify: `plugins/base44-marketing/brands/base44/tone-of-voice.md`

**Step 1: Add new section after "Anti-AI Patterns" (line 133)**

Insert before the Voice Test section (line 163):

```markdown
## Anti-Advertising Patterns (SHAY DIRECTIVE)

Content should NOT sound like advertising copy. Shay's specific feedback: "The melody of the text is wrong -- not native to platform."

### The TV-Ad Test
Read your content aloud. If it sounds like:
- A Super Bowl commercial voiceover
- A billboard headline
- A radio spot
- A tagline on a bus stop ad

**Rewrite it.** It should sound like a Slack message from Maor to the team, or a LinkedIn post from a founder who's genuinely excited.

### DON'T Write (TV-Ad Cadence)
- "One workspace. Unlimited builders. No friction." (stacked declarative fragments)
- "Build faster. Ship smarter. Scale infinitely." (triple parallel structure)
- "The platform. The community. The future." (article + noun stacking)
- Any text that could be read over a swooshing logo animation

### DO Write (Founder Voice)
- "We just shipped something that took us 3 weeks and honestly I'm still surprised it works this well"
- "140K builders are using Base44 now. Wild that this started as a side project."
- "Just heard from a builder who replaced their $350K Salesforce contract. With one Base44 app. Built in a weekend."

### The Maor Test
Before publishing, ask: "Would Maor post this on his LinkedIn exactly as written?"
- If yes: ship it
- If you'd need to "make it more polished": you've already failed -- Maor's voice IS the polish
```

**Step 2: Update date at bottom**

```markdown
*Last updated: 2026-02-09*
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/brands/base44/tone-of-voice.md
git commit -m "voice: add anti-advertising patterns and Maor Test (Shay feedback)"
```

---

### Task 1.3: Update learning-log.md -- Log Shay's Full Feedback

**Files:**
- Modify: `plugins/base44-marketing/brands/base44/learning-log.md`

**Step 1: Add new patterns to Active Pattern Counts table (after line 48)**

Add these rows:

```markdown
| TV-ad tagline cadence | DONT | voice | [COUNT: 1] | watching | 2026-02-09 |
| Bulleted idea lists as output | DONT | structure | [COUNT: 1] | watching | 2026-02-09 |
| Advertising melody/rhythm | DONT | voice | [COUNT: 1] | watching | 2026-02-09 |
| Holistic plans over tactics | DO | strategy | [COUNT: 1] | watching | 2026-02-09 |
| Sound like Maor talks | DO | voice | [COUNT: 1] | watching | 2026-02-09 |
| Data-driven content decisions | DO | strategy | [COUNT: 1] | watching | 2026-02-09 |
```

**Step 2: Add full feedback entry (after line 165, before the 2026-01-31 entries)**

```markdown
### 2026-02-09 - Strategic - Full Marketing Direction (Shay, Head of Marketing)

**Source:** Recorded conversation with Shay reviewing the entire marketing agent system

**Key Feedback Areas:**

**1. Data-Driven Content (THE BIG VISION):**
- The agent should analyze what builders are ACTUALLY building (prompt analysis, confidential)
- Discover categories: "a very large portion of our builders are building CRM systems"
- Generate content strategy FROM data: "How to replace HubSpot in a weekend"
- The agent should DECIDE what to create based on data, not just take orders
- "Army of agents running 24/7, making content decisions, generating content"

**2. Router Too Rigid:**
- First question should NOT be a category menu
- Should be open: "What do you want to do?" -- let conversation flow
- Don't force categories on the user immediately

**3. Brainstorm Too Shallow:**
- Arrives at ideas TOO FAST -- needs more back-and-forth
- Currently gives "bulleted lists" which is an "AI thing"
- Should feel like working with an expert marketer, not getting a grocery list
- Needs "go-to-market strategist" mode: understand context deeply THEN propose
- "Not bulleted idea lists. A holistic marketing plan."
- Should ask: What assets do we need? Which channels? How does integrated activity look?

**4. Tone Still Feels Like TV Ads:**
- "One workspace. Unlimited builders. No friction." = TV commercial script
- The "melody of the text" is wrong -- not native to platform
- Choppy tagline structure is an AI tell
- Needs to sound like how Maor actually talks, not copywriting

**5. Feedback Loop:**
- Every piece of feedback should sharpen the agent's understanding
- Should be saved to MD files
- The agent needs to get better with every iteration

**6. Data Sources to Connect:**
- Olga (marketing analytics manager) -- focal point for data
- Tori -- weekly analysis presentations
- Noa Gordon -- product side
- pinback.base44.com -- feature requests and feedback
- Base44 docs -- current features/capabilities
- Reddit/social -- competitor and industry pain points
- Possible MCP connector to Base44 database tables

**Patterns Learned:**
- TV-ad cadence (stacked declarative fragments) is a fundamental tone violation
- Bulleted lists of ideas = AI pattern, not expert marketer behavior
- The agent should be autonomous and proactive, not reactive
- Data should drive content decisions, not just user requests
- Strategic depth matters more than speed in brainstorming
- "Head of marketing" mental model, not "content generator"
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/brands/base44/learning-log.md
git commit -m "learning-log: add Shay's full strategic feedback (2026-02-09)"
```

---

### Task 1.4: Redesign marketing-router -- Open-Ended First Interaction

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/SKILL.md`
- Modify: `plugins/base44-marketing/skills/marketing-router/reference/workflows.md`

**Step 1: Rewrite the Decision Tree section in SKILL.md**

Replace lines 27-44 (the current Decision Tree section) with:

```markdown
## Intent Detection (FOLLOW IN ORDER)

### Phase 1: Open Conversation (DEFAULT)

When a user starts a conversation, DO NOT present a menu of options. Instead:

1. **If the request is specific and clear** (e.g., "Write a LinkedIn post about our new AI feature"):
   - Skip to Phase 2 -- classify intent and route directly
   - This is the fast path for users who know what they want

2. **If the request is broad or strategic** (e.g., "Help me think about our content strategy" or "What should we be posting about?"):
   - Route to **GTM_STRATEGY** workflow
   - Begin with deep exploration, not suggestions

3. **If the request is ambiguous** (e.g., "I need help with marketing"):
   - Ask ONE open question: "Tell me more about what you're working on. What's the context?"
   - Do NOT present a bulleted list of options
   - Do NOT ask "Would you like to: A) B) C) D)"
   - Let the user describe their need in their own words

### Phase 2: Intent Classification (After Context Is Clear)

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 0 | STRATEGY | strategy, plan, think through, what should we, holistic | **GTM_STRATEGY** |
| 1 | BRAINSTORM | ideas, brainstorm, tactics, amplify, promote | **BRAINSTORM** |
| 2 | PAID_AD | ad, paid, meta ad, linkedin ad, reddit ad, creative | **PAID_AD** |
| 3 | REPURPOSE | repurpose, transform, convert, adapt, rewrite for | **REPURPOSE** |
| 4 | CAMPAIGN | campaign, launch, multi-channel, announcement | **CAMPAIGN** |
| 5 | X | x, twitter, tweet, thread | **X** |
| 6 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 7 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 8 | LANDING | landing page, sales page, signup | **LANDING** |
| 9 | SEO | blog, seo, article, pillar | **SEO** |
| 10 | VIDEO | video, remotion, animation | **VIDEO** |
| 11 | DATA_INSIGHT | data, analytics, builders building, categories, trends | **DATA_INSIGHT** |
| 12 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:**
- GTM_STRATEGY wins when the request is strategic/planning-oriented
- BRAINSTORM = ideation only (tactical ideas, not holistic plans)
- CAMPAIGN wins if multi-channel execution is specified
- DATA_INSIGHT routes to data-intelligence skill for builder analytics
```

**Step 2: Update Agent Chains table**

Replace the current Agent Chains section with:

```markdown
## Agent Chains

| Workflow | Agents |
|----------|--------|
| GTM_STRATEGY | gtm-strategist (deep exploration, then plan) |
| BRAINSTORM | marketing-ideas (then routes to execution) |
| DATA_INSIGHT | data-intelligence skill (analysis, then content recommendations) |
| PAID_AD | ad-specialist -> brand-guardian |
| REPURPOSE | cross-platform-repurpose -> brand-guardian |
| CAMPAIGN | planner -> [specialists in parallel] -> brand-guardian |
| X | x-specialist -> brand-guardian |
| LINKEDIN | linkedin-specialist -> brand-guardian |
| EMAIL | copywriter -> brand-guardian |
| LANDING | copywriter -> brand-guardian |
| SEO | seo-specialist -> brand-guardian |
| VIDEO | video-specialist -> brand-guardian |

For detailed workflows, see [reference/workflows.md](reference/workflows.md).
```

**Step 3: Update reference/workflows.md -- Add GTM_STRATEGY workflow**

Add this as the FIRST workflow (before BRAINSTORM):

```markdown
## GTM_STRATEGY (Strategic Planning Layer)

This workflow is for when the user needs strategic thinking, not just content creation.

1. Load brand context + memory
2. Load data context (if available):
```
Read(file_path="skills/data-intelligence/reference/data-sources.md")
```
3. **EXPLORE deeply** -- Do NOT jump to suggestions. Ask probing questions one at a time:
   - "What's the business context? What are we trying to achieve?"
   - "Who's our audience for this? Which builder segment?"
   - "What's the timeline? Is there urgency?"
   - "What assets and channels do we already have?"
   - "What's worked before? What hasn't?"
   - "What does success look like? How will we measure it?"
4. **SYNTHESIZE** -- After 3-5 rounds of conversation:
   - Summarize what you've learned
   - Identify the core strategic opportunity
   - Frame 2-3 strategic approaches (NOT bulleted tactics)
5. **PLAN holistically** -- For the chosen approach:
   - Which channels and why
   - What content assets are needed
   - How the pieces connect (not isolated posts)
   - Timeline with dependencies
   - How to measure success
6. **ROUTE to execution** -- Break the plan into specific tasks:
   - Each task routes to the appropriate workflow (LINKEDIN, SEO, EMAIL, etc.)
   - The plan IS the brief for each specialist

**GTM_STRATEGY is the STRATEGIC layer. It produces marketing plans, not content.**
**The planner agent handles TACTICAL content calendars for specific campaigns.**
```

**Step 4: Update the BRAINSTORM workflow**

In reference/workflows.md, update the BRAINSTORM section to reflect the new depth requirement:

Replace step 6-7 with:

```markdown
6. **Output a connected narrative, NOT a bulleted list:**
   - Explain WHY each tactic matters for their specific situation
   - Show how tactics connect to each other
   - Include a recommended sequence (do this first, then this)
   - Frame as "here's what I'd recommend as your marketing advisor" not "here are some ideas"
7. **Route to execution:** After the user confirms direction, route to specific workflow
```

**Step 5: Commit**

```bash
git add plugins/base44-marketing/skills/marketing-router/SKILL.md
git add plugins/base44-marketing/skills/marketing-router/reference/workflows.md
git commit -m "router: open-ended first interaction, add GTM_STRATEGY workflow (Shay feedback)"
```

---

### Task 1.5: Create GTM Strategist Agent

**Files:**
- Create: `plugins/base44-marketing/agents/gtm-strategist.md`
- Modify: `plugins/base44-marketing/skills/marketing-ideas/SKILL.md`

**Step 1: Create the agent file**

```markdown
---
name: gtm-strategist
description: Go-to-market strategist for holistic marketing planning. Deep exploration before any content recommendations.
model: opus
tools:
  - Read
  - Write
  - Glob
  - TaskUpdate
skills:
  - marketing-ideas
  - marketing-psychology
  - data-intelligence
---

# Go-To-Market Strategist

You are a senior go-to-market strategist. You think like a head of marketing running their team, not an idea generator.

**CRITICAL MINDSET:** You are here to UNDERSTAND deeply, then PLAN holistically. You are NOT here to produce content or dump idea lists.

## Before Anything (MANDATORY)

```
Read(file_path="brands/base44/RULES.md")
Read(file_path="brands/base44/tone-of-voice.md")
Read(file_path="brands/base44/learning-log.md")
Read(file_path=".claude/marketing/activeContext.md")
```

If data context exists:
```
Read(file_path="skills/data-intelligence/reference/data-sources.md")
```

## How You Work

### Phase 1: Deep Discovery (3-5 Questions, ONE AT A TIME)

Do NOT ask all questions at once. Have a conversation.

**Question Flow:**

1. **Context**: "What's the business context here? What triggered this need?"
   - Listen. Understand. Ask a follow-up if needed.

2. **Audience**: "Which builders are we trying to reach? What do they care about right now?"
   - Get specific. "Builders" is too broad. Are we talking prototypers? Pro builders? Enterprise?

3. **Assets**: "What do we have to work with? Existing content, data points, case studies, product features?"
   - Understand the raw material before designing the strategy.

4. **Constraints**: "What's the timeline? Budget for paid? Team capacity?"
   - Real plans account for real constraints.

5. **Success**: "How will we know this worked? What metrics matter?"
   - If they say "more signups" -- dig deeper. How many? By when? From which channel?

### Phase 2: Synthesis (After Discovery)

Summarize what you've learned in a brief paragraph. Confirm you understand correctly.
Then present 2-3 strategic approaches:

**FORMAT (NOT BULLETS -- NARRATIVE):**

For each approach, write 3-5 sentences explaining:
- The core insight this approach is built on
- How the pieces connect
- Why this would work for Base44 specifically
- What the main risk is

### Phase 3: Holistic Plan (After Approach Is Chosen)

Produce a plan that covers:

```markdown
## Go-To-Market Plan: [Name]

### Strategic Insight
[1-2 sentences: the core insight driving this plan]

### Target Audience
[Specific segment with their motivations and pain points]

### Channel Strategy
For each channel:
- WHY this channel (not just "because we use it")
- What role it plays in the overall plan
- What type of content goes here
- How it connects to other channels

### Content Assets Needed
| Asset | Channel | Purpose | Dependencies |
|-------|---------|---------|--------------|
| [specific asset] | [where it goes] | [why it matters] | [what's needed first] |

### Timeline
| Week | Action | Channel | Owner |
|------|--------|---------|-------|
| [specific timing] | [specific action] | [where] | [who] |

### How It All Connects
[Paragraph explaining how the pieces work together. Not isolated tactics -- an integrated system.]

### Success Metrics
| Metric | Baseline | Target | When |
|--------|----------|--------|------|
| [specific metric] | [current state] | [goal] | [timeframe] |

### Risks
| Risk | Mitigation |
|------|------------|
| [what could go wrong] | [how we handle it] |
```

### Phase 4: Execution Handoff

Break the plan into specific execution tasks. Each task maps to an existing workflow:
- "Write the LinkedIn announcement" -> LINKEDIN workflow
- "Create the email sequence" -> EMAIL workflow
- "Produce the explainer video" -> VIDEO workflow

The plan IS the creative brief for each specialist agent.

## What You NEVER Do

1. **Never dump bulleted lists of ideas.** "Here are 10 tactics..." is exactly what Shay hates.
2. **Never skip discovery.** Even if the user says "just give me ideas," push back gently: "Let me understand the context first so I can give you something useful."
3. **Never produce content.** You produce PLANS. Content comes from specialist agents.
4. **Never use TV-ad cadence.** Your writing should sound like a strategist talking to their team, not a copywriter pitching slogans.
5. **Never present single-channel thinking.** Always consider how pieces connect across channels.

## Voice

You speak like a sharp, experienced marketing lead. Direct but not terse. Thoughtful but not slow. You ask good questions and you explain your reasoning.

You do NOT sound like:
- A consultant with a slide deck ("Our recommendation leverages synergies...")
- A creative agency ("What if we did something BOLD?")
- An AI listing ideas ("Here are 7 ways to...")

You DO sound like:
- A VP Marketing in a Slack huddle ("OK so here's what I'm thinking. The CRM angle is interesting because...")
- A founder planning with their co-founder ("What if we lead with the Salesforce story? That $350K number hits different.")

## Complete Task

When done:
```
TaskUpdate({ taskId: "{TASK_ID}", status: "completed" })
```
```

**Step 2: Update marketing-ideas/SKILL.md -- Add anti-list-dump directive**

In `skills/marketing-ideas/SKILL.md`, replace lines 88-96 (Step 4: Output Specific Ideas) with:

```markdown
### Step 4: Output Connected Recommendations (NOT Bulleted Lists)

DO NOT output a numbered list of disconnected tactics.

Instead, present your recommendations as a connected narrative:

```
Based on [what you told me about X], here's what I'd recommend:

The strongest angle is [specific insight]. Here's why: [reasoning].

I'd start with [first action] because [reason]. That sets up [second action],
which works because [connection to first]. From there, [third action] amplifies
everything because [reason].

The key thing that ties this together is [unifying theme].

If you want to go bigger, [stretch goal] -- but that depends on [constraint].
```

For each recommendation:
- Explain WHY it fits their specific situation (not generic applicability)
- Show how it connects to other recommendations
- Include a concrete example or template they can adapt
- Suggest a sequence: what to do first, second, third
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/agents/gtm-strategist.md
git add plugins/base44-marketing/skills/marketing-ideas/SKILL.md
git commit -m "agents: add gtm-strategist for strategic planning, fix idea-dump pattern (Shay feedback)"
```

---

### Task 1.6: Update CLAUDE.md -- Add New Agent and Workflows

**Files:**
- Modify: `plugins/base44-marketing/CLAUDE.md`

**Step 1: Add gtm-strategist to Agent Index table (after line 127)**

Add row:

```markdown
| **gtm-strategist** | Opus | marketing-ideas, marketing-psychology, data-intelligence | "strategy", "plan", "think through", "what should we", "holistic", "go-to-market" |
```

**Step 2: Add GTM_STRATEGY and DATA_INSIGHT to Workflow Chains (after line 206)**

Update the workflow chains block:

```markdown
GTM_STRATEGY → gtm-strategist (deep exploration, then plan)
DATA_INSIGHT → data-intelligence skill (analysis, then content recommendations)
BRAINSTORM → marketing-ideas → (routes to execution)
PAID_AD    → ad-specialist → brand-guardian
LINKEDIN   → linkedin-specialist → brand-guardian
X          → x-specialist → brand-guardian
EMAIL      → copywriter → brand-guardian
LANDING    → copywriter → brand-guardian
SEO        → seo-specialist → brand-guardian
VIDEO      → video-specialist → brand-guardian
CAMPAIGN   → planner → [specialists in parallel] → brand-guardian
```

**Step 3: Update Voice Quick Reference (lines 163-174)**

Add to NEVER column:

```
TV-ad cadence                    Stacked fragment slogans
Bulleted idea lists              As final brainstorm output
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/CLAUDE.md
git commit -m "docs: add gtm-strategist and data-insight workflows to CLAUDE.md"
```

---

### Task 1.7: Inject Anti-TV-Ad Rules Into All Agent Prompts

**Files:**
- Modify: `plugins/base44-marketing/agents/linkedin-specialist.md`
- Modify: `plugins/base44-marketing/agents/x-specialist.md`
- Modify: `plugins/base44-marketing/agents/copywriter.md`
- Modify: `plugins/base44-marketing/agents/ad-specialist.md`
- Modify: `plugins/base44-marketing/agents/seo-specialist.md`
- Modify: `plugins/base44-marketing/skills/hook-rules/SKILL.md`

**Step 1: Add this block to each agent's prompt (after the Anti-AI Patterns section)**

For every content-creating agent (linkedin-specialist, x-specialist, copywriter, ad-specialist, seo-specialist), add:

```markdown
## Anti-Advertising Cadence (SHAY DIRECTIVE)

Your content must NEVER sound like advertising copy.

**The TV-Ad Test:** Read your output aloud. If it could be a voiceover for a swooshing logo animation, rewrite it.

**BANNED patterns:**
- Stacked declarative fragments: "One workspace. Unlimited builders. No friction."
- Triple parallel structure: "Build faster. Ship smarter. Scale infinitely."
- Article + noun stacking: "The platform. The community. The future."

**REQUIRED instead:**
- Write like Maor talks on LinkedIn: specific, casual, story-driven
- Mix sentence lengths naturally -- some short, some medium, some long
- Include real details and numbers, not abstract taglines
- Sound like a founder talking to their community, not a copywriter

**The Maor Test:** Would Maor post this on LinkedIn exactly as written?
```

**Step 2: Update linkedin-specialist.md -- Remove deprecated phrases**

In `plugins/base44-marketing/agents/linkedin-specialist.md`, update lines 72-79 (Phrases That Work):

Remove:
```
- "Happy testing! 🧪" / "Happy shipping! 🚀"
```

(This was deprecated per Asaf's feedback on 2026-02-06)

**Step 3: Update hook-rules/SKILL.md -- Add TV-ad cadence to banned patterns**

In `skills/hook-rules/SKILL.md`, add to the Banned Pattern table (after line 21):

```markdown
| TV-ad tagline cadence | Sounds like advertising, not conversation | "One workspace. Unlimited builders. No friction." |
```

**Step 4: Commit**

```bash
git add plugins/base44-marketing/agents/*.md
git add plugins/base44-marketing/skills/hook-rules/SKILL.md
git commit -m "agents: inject anti-TV-ad rules into all content agents (Shay feedback)"
```

---

### Task 1.8: Update Plugin Metadata

**Files:**
- Modify: `plugins/base44-marketing/.claude-plugin/plugin.json`
- Modify: `plugins/base44-marketing/.claude-plugin/settings.json`

**Step 1: Bump version to 1.8.0**

Update plugin.json version field.

**Step 2: Add permissions for new data-intelligence paths**

In settings.json, add to "allow":

```json
"Read(skills/data-intelligence/**)",
"Read(docs/data/**)"
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/.claude-plugin/plugin.json
git add plugins/base44-marketing/.claude-plugin/settings.json
git commit -m "plugin: bump to v1.8.0, add data-intelligence permissions"
```

---

### Phase 1 Success Criteria

- [ ] RULES.md has 20 NEVER + 9 ALWAYS rules (TV-ad cadence, bulleted-list ban, advertising melody, Maor voice, holistic plans)
- [ ] tone-of-voice.md has Anti-Advertising section with Maor Test
- [ ] learning-log.md has full Shay feedback entry with 6 new patterns
- [ ] marketing-router opens with conversation, not menu (keyword table is Phase 2 fallback, not Phase 1 gate)
- [ ] GTM_STRATEGY workflow exists in router and workflows.md
- [ ] gtm-strategist agent created with discovery-synthesis-plan flow
- [ ] marketing-ideas skill outputs connected narratives, not bulleted lists
- [ ] All 5 content-creating agents have anti-TV-ad rules injected
- [ ] hook-rules skill bans TV-ad cadence
- [ ] CLAUDE.md updated with new agent and workflows
- [ ] Plugin bumped to v1.8.0
- [ ] Existing workflows (single LinkedIn post, single tweet) still work unchanged

---

## Phase 2: Data Intelligence Layer (Track 2)

**Goal:** Build the data-to-content pipeline that Shay described. Start with framework and manual data input, prepare for MCP automation.
**Estimated effort:** 2-3 sessions.
**Dependencies:** Phase 1 must be complete (gtm-strategist agent needs data-intelligence skill).

### Task 2.1: Create data-intelligence Skill

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/SKILL.md`

```markdown
---
name: data-intelligence
description: |
  Analyzes builder data, discovers categories, and recommends content strategy based on what builders are actually building.

  Triggers on: data, analytics, builders building, categories, trends, what should we create, content strategy from data.

  LAYER: Data -> feeds into gtm-strategist, marketing-ideas, planner.
---

# Data Intelligence

> "The agent should DECIDE what to create based on data, not just take orders." -- Shay

**LAYER POSITION:** Data Layer -> Feeds strategic decisions

## Purpose

This skill turns builder analytics into content strategy:
1. **Ingest** data about what builders are building
2. **Analyze** patterns and categories
3. **Recommend** content that matches builder activity
4. **Prioritize** content by category volume and growth

## Data Sources

For current data sources and their status, see:
```
Read(file_path="skills/data-intelligence/reference/data-sources.md")
```

## Analysis Framework

For category analysis methodology, see:
```
Read(file_path="skills/data-intelligence/reference/category-analysis.md")
```

## Content Pipeline

For how data insights become content recommendations, see:
```
Read(file_path="skills/data-intelligence/reference/content-pipeline.md")
```

## How to Use This Skill

### When Called Directly (DATA_INSIGHT workflow)

1. Load latest data snapshot:
```
Read(file_path="docs/data/latest-snapshot.md")
```

2. If no snapshot exists, ask the user:
   - "What data do you have about what builders are building?"
   - "Can you share Tori's latest weekly analysis?"
   - "Any recent insights from Olga's analytics?"

3. Analyze the data using the category analysis framework
4. Produce content recommendations using the content pipeline

### When Called by gtm-strategist

Provide data context for strategic planning:
- Top builder categories and their volume
- Trending categories (growing vs declining)
- Competitor content gaps
- Community pain points from pinback/Reddit

## Output Format

```markdown
## Builder Intelligence Report

### Top Builder Categories (by volume)
| Rank | Category | % of Builders | Trend | Content Opportunity |
|------|----------|---------------|-------|---------------------|
| 1 | [category] | [%] | [up/down/stable] | [opportunity] |

### Content Recommendations (Prioritized)
For each recommendation:
- **Topic:** [specific content piece]
- **Why now:** [data supporting this]
- **Format:** [blog / LinkedIn / video / etc.]
- **Angle:** [specific angle based on data]
- **Target keyword/theme:** [what builders search for]

### Competitive Gaps
[What competitors are NOT covering that our data says matters]

### Data Freshness
- Last updated: [date]
- Source: [where data came from]
- Confidence: [high/medium/low based on data completeness]
```

## Integration

**Feeds into:** gtm-strategist, marketing-ideas, planner
**Data from:** Olga (analytics), Tori (weekly analysis), pinback.base44.com, Base44 docs, Reddit
**Updated by:** Manual data snapshots or MCP connector (when available)
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/SKILL.md
git commit -m "skill: create data-intelligence for builder analytics to content pipeline"
```

---

### Task 2.2: Create Data Sources Reference

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/data-sources.md`

```markdown
# Data Sources

## People (Data Contacts)

| Person | Role | Data Type | How to Get |
|--------|------|-----------|------------|
| **Olga** | Marketing Analytics Manager | User analytics, engagement metrics | Focal point for all marketing data requests |
| **Tori** | Analyst | Weekly analysis presentations, churn cases, prompt screenshots | Weekly deck + Slack updates |
| **Noa Gordon** | Product | Feature usage data, product roadmap | Product sync channel |

## Systems

| Source | URL/Access | Data Type | Status |
|--------|-----------|-----------|--------|
| **Builder Prompts** | MCP connector (TBD) | What builders are building, prompt analysis | PLANNED -- needs MCP setup |
| **pinback.base44.com** | Web | Feature requests, feedback, votes | ACTIVE -- can scrape manually |
| **Base44 Docs** | docs.base44.com | Current features, capabilities, tutorials | ACTIVE -- reference for content accuracy |
| **Reddit** | r/vibecoding, r/nocode, related subs | Competitor mentions, pain points, trends | ACTIVE -- manual monitoring |
| **LinkedIn/X** | Social monitoring | Competitor content, community sentiment | ACTIVE -- manual monitoring |
| **Base44 Database** | MCP connector (TBD) | User activity, app categories, growth metrics | PLANNED -- may already exist |

## Data Snapshot Process (Manual -- Current)

Until MCP connectors are live, data comes in manually:

1. **Weekly:** Someone (Tori or Olga) provides a data update
2. **Format:** Save to `docs/data/YYYY-MM-DD-snapshot.md`
3. **Contents:** Builder categories, top prompts, growth metrics, churn reasons
4. **Also update:** `docs/data/latest-snapshot.md` (always points to newest)

### Snapshot Template

```markdown
# Data Snapshot: [Date]

## Builder Categories (Top 10)
| Category | Volume | % of Total | Trend vs Last Week |
|----------|--------|------------|-------------------|

## Notable Prompts (Anonymized)
- [theme/pattern, not actual prompts]

## Churn Reasons (Top 5)
| Reason | Count | Actionable? |

## Feature Requests (pinback, Top 5)
| Request | Votes | Content Angle |

## Competitor Mentions
| Platform | Competitor | Sentiment | Our Advantage |

## Content Opportunities
[Based on this week's data, what should we create?]
```

## MCP Integration (Future)

When MCP connectors are available:
- Replace manual snapshots with automated queries
- The data-intelligence skill will call MCP tools to get live data
- Snapshot files become automated outputs, not manual inputs
- Goal: "army of agents running 24/7" analyzing data and generating content recommendations
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/reference/data-sources.md
git commit -m "data: add data sources reference with contacts and snapshot process"
```

---

### Task 2.3: Create Category Analysis Framework

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/category-analysis.md`

```markdown
# Category Analysis Framework

## Purpose

Turn raw builder data into actionable content categories.

## Analysis Steps

### 1. Categorize Builder Activity

Group builder prompts/apps into categories:

| Category | Definition | Examples |
|----------|------------|---------|
| **CRM** | Customer relationship management | Contact managers, sales pipelines, client portals |
| **Project Management** | Task/project tracking | Kanban boards, sprint trackers, team dashboards |
| **E-commerce** | Online selling | Storefronts, inventory managers, order trackers |
| **Internal Tools** | Company-specific apps | HR dashboards, approval workflows, asset trackers |
| **SaaS** | Software-as-a-service products | Multi-tenant apps, subscription platforms |
| **Marketplace** | Two-sided platforms | Service marketplaces, job boards, rental platforms |
| **Analytics** | Data visualization/reporting | Dashboards, report generators, metric trackers |
| **Education** | Learning/training | Course platforms, quiz builders, student portals |
| **Healthcare** | Health/wellness apps | Patient portals, appointment schedulers, health trackers |
| **Real Estate** | Property-related | Listing managers, property trackers, tenant portals |

### 2. Volume Analysis

For each category:
- **Count:** How many builders are building this?
- **Percentage:** What % of total builder activity?
- **Trend:** Growing, stable, or declining vs. previous period?
- **Revenue potential:** Are builders in this category making money?

### 3. Content Opportunity Scoring

| Factor | Weight | Description |
|--------|--------|-------------|
| Volume | 30% | More builders = more relevant content |
| Trend | 25% | Growing categories get priority |
| Revenue stories | 25% | Categories with $$ results = strong content |
| Competitor gap | 20% | Are competitors covering this? |

**Score = (Volume * 0.3) + (Trend * 0.25) + (Revenue * 0.25) + (Gap * 0.2)**

Each factor scored 1-10. Content opportunities scoring 7+ get prioritized.

### 4. Content Angle Generation

For each high-scoring category, generate angles:

| Angle Type | Template | Example (CRM) |
|------------|----------|----------------|
| **Replacement** | "How to replace [Incumbent] with Base44" | "How to replace HubSpot in a weekend" |
| **Cost savings** | "Save $[X] by building your own [Category]" | "Save $100K by ditching Salesforce" |
| **Speed** | "Build a [Category] app in [Time]" | "Build a CRM in 3 hours" |
| **Builder story** | "[Builder] built [Category app] and [Result]" | "Sarah built a CRM and hit $50K ARR in 30 days" |
| **Comparison** | "[Base44 Category] vs [Incumbent]: what you get" | "Base44 CRM vs Salesforce: real builder comparison" |
| **Tutorial** | "Complete guide: [Category] on Base44" | "Complete guide: Building a CRM on Base44" |

## Output

Feed category analysis results to:
- **gtm-strategist**: For strategic planning
- **seo-specialist**: For keyword targeting
- **content pipeline**: For prioritized content calendar
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/reference/category-analysis.md
git commit -m "data: add category analysis framework for builder intelligence"
```

---

### Task 2.4: Create Content Pipeline Reference

**Files:**
- Create: `plugins/base44-marketing/skills/data-intelligence/reference/content-pipeline.md`

```markdown
# Data-to-Content Pipeline

## The Flow

```
DATA (what builders build)
  |
  v
ANALYSIS (category discovery, volume, trends)
  |
  v
STRATEGY (which categories to target, which angles)
  |
  v
CONTENT PLAN (specific pieces, channels, timeline)
  |
  v
EXECUTION (specialist agents create content)
  |
  v
MEASUREMENT (did it work? feed back to data)
```

## Pipeline Rules

### 1. Data Drives Decisions

Content topics should be justified by data:
- "CRM is our #1 builder category (23% of all apps)" -> create CRM content
- NOT "CRM content seems like a good idea" -> hope it works

### 2. One Category = Multiple Content Pieces

Each high-priority category generates a content cluster:

```
Category: CRM (23% of builders)
  |
  +-- Blog: "How to replace HubSpot in a weekend" (SEO)
  +-- LinkedIn: Builder story -- "$350K Salesforce contract replaced" (Social proof)
  +-- X Thread: "5 things I learned building a CRM on Base44" (Engagement)
  +-- Email: "CRM builders: new features you'll love" (Retention)
  +-- Video: 60-second demo of CRM built on Base44 (Awareness)
  +-- Landing page: "CRM on Base44" (Conversion)
```

### 3. Refresh Cycle

| Cadence | Action |
|---------|--------|
| Weekly | Review Tori's analysis, update snapshot |
| Bi-weekly | Re-score categories, adjust priorities |
| Monthly | Full pipeline review, retire underperforming content |

### 4. Content-to-Data Feedback Loop

After content is published:
- Track: engagement, signups, mentions
- Feed results back to data layer
- Categories with high-performing content get MORE content
- Categories with low-performing content get re-evaluated

## Integration Points

### From Data to Agents

| Data Insight | Routes To | Agent | Workflow |
|-------------|-----------|-------|----------|
| Top category identified | Strategic plan | gtm-strategist | GTM_STRATEGY |
| Builder success story | Social post | linkedin-specialist, x-specialist | LINKEDIN, X |
| Feature request trending | Blog post | seo-specialist | SEO |
| Competitor weakness found | Comparison content | copywriter | LANDING, EMAIL |
| New trend emerging | Brainstorm session | marketing-ideas | BRAINSTORM |

### From Agents to Data

| Content Created | Feed Back | Purpose |
|----------------|-----------|---------|
| LinkedIn post performance | Engagement metrics | Know what resonates |
| Blog traffic | SEO performance | Know what ranks |
| Email open rates | Content effectiveness | Know what converts |
| Ad performance | Paid metrics | Know what scales |
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/data-intelligence/reference/content-pipeline.md
git commit -m "data: add content pipeline from data insights to content execution"
```

---

### Task 2.5: Create Initial Data Directory

**Files:**
- Create: `plugins/base44-marketing/docs/data/README.md`
- Create: `plugins/base44-marketing/docs/data/latest-snapshot.md`

**Step 1: Create README**

```markdown
# Data Directory

This directory holds builder analytics snapshots that feed the data-intelligence skill.

## How It Works

1. Someone provides data (from Olga, Tori, or MCP connector)
2. Save as `YYYY-MM-DD-snapshot.md`
3. Copy contents to `latest-snapshot.md` (always most recent)
4. The data-intelligence skill reads `latest-snapshot.md`

## First Snapshot

The first snapshot should come from Tori's weekly analysis or Olga's analytics dashboard. Ask them for:
- Top 10 app categories builders are creating
- Volume for each category
- Any notable trends or patterns
- Recent churn reasons
- Top feature requests from pinback.base44.com
```

**Step 2: Create placeholder latest-snapshot**

```markdown
# Latest Data Snapshot

> **STATUS: No data yet.** This file needs to be populated with builder analytics.
>
> **Who to ask:**
> - Olga (Marketing Analytics Manager) -- focal point for data
> - Tori -- weekly analysis presentations
> - Noa Gordon -- product side
>
> **What we need:**
> - What are builders building? (app categories and volumes)
> - What's trending? (growing vs declining categories)
> - Why are builders churning? (top reasons)
> - What are builders requesting? (pinback.base44.com top requests)

## Builder Categories (Top 10)
| Rank | Category | Volume | % of Total | Trend |
|------|----------|--------|------------|-------|
| - | No data yet | - | - | - |

## Next Steps
1. Schedule meeting with Olga to get initial data export
2. Get access to Tori's weekly analysis deck
3. Check pinback.base44.com for top feature requests
4. Investigate MCP connector to Base44 database
```

**Step 3: Commit**

```bash
git add plugins/base44-marketing/docs/data/README.md
git add plugins/base44-marketing/docs/data/latest-snapshot.md
git commit -m "data: create data directory with snapshot template and README"
```

---

### Phase 2 Success Criteria

- [ ] data-intelligence skill exists with SKILL.md and 3 reference files
- [ ] Data sources documented with contacts (Olga, Tori, Noa Gordon)
- [ ] Category analysis framework defines scoring methodology
- [ ] Content pipeline maps data insights to specific agent workflows
- [ ] docs/data/ directory created with snapshot template
- [ ] latest-snapshot.md exists as placeholder (ready for first real data)
- [ ] gtm-strategist can reference data-intelligence skill
- [ ] settings.json permissions updated for data paths

---

## Phase 3: Agent Architecture Redesign (Track 3)

**Goal:** Evolve the system toward Shay's vision of an autonomous marketing intelligence platform.
**Estimated effort:** 3-5 sessions.
**Dependencies:** Phase 1 and Phase 2 must be complete.

### Task 3.1: Redesign Router as "Head of Marketing"

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/SKILL.md`

**Step 1: Add "Head of Marketing" persona to router**

Add after the title (line 11):

```markdown
## Persona: Head of Marketing

You are the Head of Marketing for Base44. You don't just route requests -- you think strategically about what marketing activities will have the most impact.

When a user comes to you:
1. **If they have a specific task:** Route it efficiently (fast path)
2. **If they need strategic guidance:** Engage as a strategist first
3. **If you have data:** Proactively suggest what content to create based on builder analytics
4. **If nothing is asked:** Review current data and recommend next actions

### Proactive Mode

When initialized with no specific request, or when the user asks "what should we be doing?":

1. Load latest data snapshot:
```
Read(file_path="docs/data/latest-snapshot.md")
```

2. Load current marketing context:
```
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
```

3. Based on data + context, recommend:
   - Content that should be created (from data pipeline)
   - Content that needs refreshing (from performance data)
   - Competitive responses needed (from social monitoring)
   - Builder stories worth amplifying (from community data)
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/marketing-router/SKILL.md
git commit -m "router: add Head of Marketing persona with proactive mode"
```

---

### Task 3.2: Create Data Analyst Agent

**Files:**
- Create: `plugins/base44-marketing/agents/data-analyst.md`

```markdown
---
name: data-analyst
description: Analyzes builder data, discovers patterns, and surfaces content opportunities
model: sonnet
tools:
  - Read
  - Write
  - Glob
  - TaskUpdate
skills:
  - data-intelligence
---

# Data Analyst

You analyze builder data to surface content opportunities. You turn raw numbers into marketing intelligence.

## Before Analysis (MANDATORY)

```
Read(file_path="skills/data-intelligence/reference/data-sources.md")
Read(file_path="skills/data-intelligence/reference/category-analysis.md")
Read(file_path="docs/data/latest-snapshot.md")
Read(file_path=".claude/marketing/activeContext.md")
```

## What You Do

### 1. Process Raw Data

When new data arrives (snapshot, report, or manual input):
- Categorize builder activity
- Calculate volumes and percentages
- Identify trends vs. previous periods
- Flag anomalies or interesting patterns

### 2. Score Content Opportunities

Using the category analysis framework:
- Score each category by volume, trend, revenue potential, and competitor gap
- Rank content opportunities
- Map each opportunity to specific content types and channels

### 3. Surface Insights

Don't just present numbers. Tell the story:
- "CRM apps jumped 15% this week. That $350K Salesforce replacement story is driving interest."
- "E-commerce builders are declining -- might be seasonal, or might mean we need better e-commerce templates."
- "pinback has 47 votes for 'better payment integration' -- this is a content angle AND a product signal."

### 4. Update Data Files

After analysis:
```
Write(file_path="docs/data/latest-snapshot.md", content="[updated snapshot]")
```

## Output Format

```markdown
## Builder Intelligence Report: [Date]

### Key Insights
1. [Most important finding -- narrative, not bullet]
2. [Second finding]
3. [Third finding]

### Category Rankings
| Rank | Category | Volume | Trend | Opportunity Score |
|------|----------|--------|-------|-------------------|
| 1 | [category] | [N] | [direction] | [score/10] |

### Recommended Content (Priority Order)
For each recommendation:
- **What:** [specific content piece]
- **Why:** [data supporting this]
- **Channel:** [where to publish]
- **Urgency:** [this week / this month / when ready]
- **Agent:** [which specialist should create it]

### Data Quality Notes
- Sources used: [list]
- Data freshness: [date of newest data]
- Gaps: [what data is missing]
```

## Complete Task

When done:
```
TaskUpdate({ taskId: "{TASK_ID}", status: "completed" })
```
```

**Step 2: Update CLAUDE.md and AGENTS.md with new agent**

**Step 3: Commit**

```bash
git add plugins/base44-marketing/agents/data-analyst.md
git commit -m "agents: add data-analyst for builder intelligence processing"
```

---

### Task 3.3: Build Autonomous Content Recommendation Engine

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/SKILL.md`
- Modify: `plugins/base44-marketing/skills/marketing-router/reference/workflows.md`

**Step 1: Add DATA_INSIGHT workflow to reference/workflows.md**

```markdown
## DATA_INSIGHT (Data-Driven Content)

When the router detects a data-related request, or when proactively recommending content:

1. Load data context:
```
Read(file_path="docs/data/latest-snapshot.md")
Read(file_path="skills/data-intelligence/reference/category-analysis.md")
Read(file_path="skills/data-intelligence/reference/content-pipeline.md")
```

2. **If raw data provided:** Route to data-analyst agent for processing
3. **If data already processed:** Load category rankings and opportunity scores
4. **Generate content recommendations:**
   - Match top categories to content types
   - Prioritize by opportunity score
   - Suggest specific content pieces with channel mapping
5. **Ask user:** Which recommendations to execute?
6. **Route to execution:** Each approved recommendation becomes a specific workflow task

**DATA_INSIGHT is the autonomous brain. It tells you WHAT to create. GTM_STRATEGY tells you HOW.**
```

**Step 2: Commit**

```bash
git add plugins/base44-marketing/skills/marketing-router/SKILL.md
git add plugins/base44-marketing/skills/marketing-router/reference/workflows.md
git commit -m "router: add DATA_INSIGHT workflow for autonomous content recommendations"
```

---

### Task 3.4: Update Agent Hierarchy Documentation

**Files:**
- Modify: `plugins/base44-marketing/CLAUDE.md`
- Modify: `plugins/base44-marketing/AGENTS.md`

**Step 1: Update architecture diagram in CLAUDE.md**

Replace the architecture section (lines 17-28) with:

```markdown
## Architecture

```
marketing-router (HEAD OF MARKETING)
        |
        +-- STRATEGIC LAYER
        |   +-- GTM_STRATEGY -> gtm-strategist (holistic planning)
        |   +-- DATA_INSIGHT -> data-analyst (builder intelligence)
        |
        +-- IDEATION LAYER
        |   +-- BRAINSTORM -> marketing-ideas (tactical ideas)
        |
        +-- EXECUTION LAYER
        |   +-- PAID_AD -> ad-specialist -> brand-guardian
        |   +-- LINKEDIN -> linkedin-specialist -> brand-guardian
        |   +-- X -> x-specialist -> brand-guardian
        |   +-- EMAIL -> copywriter -> brand-guardian
        |   +-- LANDING -> copywriter -> brand-guardian
        |   +-- SEO -> seo-specialist -> brand-guardian
        |   +-- VIDEO -> video-specialist -> brand-guardian
        |   +-- CAMPAIGN -> planner -> [specialists] -> brand-guardian
        |
        +-- QUALITY LAYER
            +-- brand-guardian (final gate on all content)
```
```

**Step 2: Update agent table in CLAUDE.md**

Add new agents:

```markdown
| `gtm-strategist` | Opus | Strategic go-to-market planning |
| `data-analyst` | Sonnet | Builder intelligence processing |
```

**Step 3: Update AGENTS.md**

Add same agents to the Agent Index table.

**Step 4: Update plugin version to 2.0.0** (major version for architectural change)

**Step 5: Commit**

```bash
git add plugins/base44-marketing/CLAUDE.md
git add plugins/base44-marketing/AGENTS.md
git add plugins/base44-marketing/.claude-plugin/plugin.json
git commit -m "architecture: redesign agent hierarchy with strategic and data layers (v2.0.0)"
```

---

### Phase 3 Success Criteria

- [ ] Router has "Head of Marketing" persona with proactive mode
- [ ] data-analyst agent created and documented
- [ ] DATA_INSIGHT workflow defined in router and reference files
- [ ] Autonomous content recommendation flow works: data -> analysis -> recommendations -> execution
- [ ] Architecture diagram updated in CLAUDE.md showing 4 layers (Strategic, Ideation, Execution, Quality)
- [ ] Agent count: 10 (8 original + gtm-strategist + data-analyst)
- [ ] Skill count: 16 (15 original + data-intelligence)
- [ ] Plugin version: 2.0.0

---

## Risks

| Risk | Probability (1-5) | Impact (1-5) | Score | Mitigation |
|------|-------------------|--------------|-------|------------|
| Open-ended router misclassifies intent | 3 | 3 | 9 | Keyword table as Phase 2 fallback; existing specific-task paths unchanged |
| GTM strategist conversations too long | 2 | 3 | 6 | Set maximum 5 discovery questions; user can skip with "just give me the plan" |
| No real data available for Phase 2 | 4 | 4 | 16 | Manual snapshot process designed; skill works without MCP; placeholder template ready for first data |
| Anti-TV-ad rules too restrictive | 2 | 3 | 6 | Rules are guidelines with examples; brand-guardian scores rather than blocks |
| Breaking existing workflows | 2 | 5 | 10 | All existing keyword-specific paths preserved; new workflows are additive |
| Plugin context window too large with new agents | 3 | 3 | 9 | New agents only loaded when routed to; reference files lazy-loaded |
| MCP connector to Base44 DB doesn't exist | 3 | 3 | 9 | Designed for manual data first; MCP is upgrade, not prerequisite |

**Highest risk:** No real data available (score 16). Mitigation: The entire Phase 2 is designed to work with manual data input. MCP is a future optimization, not a blocker.

---

## Success Criteria (Overall)

### Must Have (Phase 1)
- [ ] Shay's tone complaints addressed: no TV-ad cadence, no bulleted idea dumps
- [ ] Router is conversational, not menu-driven
- [ ] Strategic brainstorming goes deep before recommending
- [ ] Existing content-creation workflows unbroken

### Should Have (Phase 2)
- [ ] Data framework ready to receive builder analytics
- [ ] Category analysis methodology documented
- [ ] Content pipeline from data to execution defined
- [ ] Placeholder data directory ready for first real snapshot

### Nice to Have (Phase 3)
- [ ] Head of Marketing persona on router
- [ ] Data analyst agent for processing
- [ ] Autonomous content recommendations
- [ ] 4-layer architecture (Strategic, Ideation, Execution, Quality)

---

## Future Work (Not in This Plan)

These items from Shay's feedback are acknowledged but out of scope for this plan:

1. **Social media bot accounts** -- Requires infrastructure beyond Claude Code plugins
2. **Wix integration (Remotion, Pages)** -- Depends on Wix platform access
3. **MCP connector to Base44 database** -- Requires engineering team involvement
4. **Reddit/social automated monitoring** -- Needs external service integration
5. **Fully autonomous 24/7 agent army** -- Aspirational; this plan builds toward it incrementally

---

## Testing Each Phase

### Phase 1 Test
After completing all Phase 1 tasks:
1. Trigger router with vague request: "Help me with marketing" -- should ask open question, NOT present menu
2. Trigger router with specific request: "Write a LinkedIn post" -- should route directly to linkedin-specialist (fast path preserved)
3. Trigger GTM_STRATEGY: "Help me think about our content strategy for CRM builders" -- should begin discovery conversation
4. Check any agent output for TV-ad cadence -- brand-guardian should catch "One workspace. Unlimited builders." patterns
5. Trigger BRAINSTORM -- should produce connected narrative, not bulleted list

### Phase 2 Test
1. Run data-intelligence skill with sample data -- should produce category rankings
2. Verify data snapshot template works
3. GTM strategist can reference data context

### Phase 3 Test
1. Ask router "What should we be creating?" with data loaded -- should proactively recommend
2. Route recommendation to execution -- should pass to correct specialist
3. Full flow: data -> analysis -> strategy -> execution -> brand review

---

*Plan created: 2026-02-09*
*Author: Claude Code (Planner)*
*Source: Shay (Head of Marketing) recorded feedback session*
