---
name: marketing-router
description: |
  Entry point for all Base44 marketing content. Routes requests to specialized agents and validates output through brand-guardian.

  Triggers on: linkedin, post, content, write, create, copy, email, landing, page, seo, blog, campaign, announce, launch, marketing, brand, Base44, brainstorm, ideas, tactics, video, remotion, animation, ad, paid.

  Executes workflows immediately. Never lists capabilities.
---

# Marketing Router

**EXECUTION ENGINE.** When loaded: Initialize memory → Read brand → Detect intent → Execute workflow → Update memory.

**NEVER** list capabilities. **ALWAYS** execute.

## Contents

- [Decision Tree](#decision-tree)
- [Agent Chains](#agent-chains)
- [Memory Init](#memory-initialization)
- [Voice Rules](#voice-rules)
- [Reference Files](#reference-files)

---

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
| 0 | STRATEGY | strategy, plan, think through, what should we, holistic, go-to-market | **GTM_STRATEGY** |
| 1 | BRAINSTORM | ideas, brainstorm, tactics, amplify, promote | **BRAINSTORM** |
| 2 | PAID_AD | ad, paid, meta ad, linkedin ad, reddit ad, creative | **PAID_AD** |
| 3 | REPURPOSE | repurpose, transform, convert, adapt, rewrite for | **REPURPOSE** |
| 4 | CAMPAIGN | campaign, launch, multi-channel, announcement | **CAMPAIGN** |
| 5 | X | x, twitter, tweet, thread | **X** |
| 6 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 7 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 8 | LANDING | landing page, sales page, copy for page | **LANDING** |
| 8.3 | LANDING_DEPLOY | deploy landing page, base44 landing, host landing, ship landing page, live landing page, build landing page on base44 | **LANDING_DEPLOY** |
| 8.5 | LANDING_GENERATE | generate landing page, create landing page, push landing page, landing page pipeline, landing page for [feature] | **LANDING_GENERATE** |
| 9 | SEO | blog, seo, article, pillar | **SEO** |
| 10 | VIDEO | video, remotion, animation | **VIDEO** |
| 11 | DATA_INSIGHT | data, analytics, builders building, categories, trends | **DATA_INSIGHT** |
| 12 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:**
- GTM_STRATEGY wins when the request is strategic/planning-oriented
- BRAINSTORM = ideation only (tactical ideas, not holistic plans)
- CAMPAIGN wins if multi-channel execution is specified
- DATA_INSIGHT routes to gtm-strategist for builder analytics (Phase 2)

---

## Agent Chains

| Workflow | Agents |
|----------|--------|
| GTM_STRATEGY | gtm-strategist (deep exploration, then plan) |
| BRAINSTORM | marketing-ideas (then routes to execution) |
| DATA_INSIGHT | gtm-strategist (data-driven content analysis — Phase 2) |
| PAID_AD | ad-specialist → brand-guardian |
| REPURPOSE | cross-platform-repurpose → brand-guardian |
| CAMPAIGN | planner → [specialists in parallel] → brand-guardian |
| X | x-specialist → brand-guardian |
| LINKEDIN | linkedin-specialist → brand-guardian |
| EMAIL | copywriter → brand-guardian |
| LANDING | copywriter → brand-guardian |
| LANDING_DEPLOY | base44-landing-page skill → brand-guardian → Base44 CLI deploy |
| LANDING_GENERATE | landing-page-generator skill → brand-guardian → Wix CMS push |
| SEO | seo-specialist → brand-guardian |
| VIDEO | video-specialist → brand-guardian |

For detailed workflows, see [reference/workflows.md](reference/workflows.md).

---

## Team Escalation Rules

After determining the workflow, check if Agent Teams should be used:

### Escalation Triggers
| Condition | Action |
|-----------|--------|
| CAMPAIGN workflow with 3+ channels mentioned | Spawn campaign-launch team |
| Request mentions "sprint", "batch", "week of content" | Spawn content-sprint team |
| Request mentions "audit", "review all", "brand check" | Spawn brand-audit team |
| Request mentions "A/B", "variants", "test versions" | Spawn ab-testing team |
| Any other workflow | Use existing single-agent chain |

### How to Spawn a Team
1. Read the relevant template from `teams/{template}.md`
2. Create the output directory structure defined in the template
3. Tell Claude to create an agent team following the template
4. Use delegate mode (Shift+Tab) so the lead coordinates, not implements
5. Each teammate spawn prompt MUST include:
   - Full campaign brief or content brief
   - Brand context: Read RULES.md, tone-of-voice.md
   - Channel-specific skill: Load the relevant SKILL.md
   - Output directory assignment
   - Instruction to create tasks in the shared task list

### Spawn Prompt Template
```
You are the {ROLE} for a {TEMPLATE} team.

## Brand Context
{Contents of RULES.md}
{Contents of tone-of-voice.md}

## Your Skill
{Contents of relevant SKILL.md}

## Your Assignment
{Specific content brief}

## File Ownership
Write ALL your output to: output/{channel}/
Do NOT modify files outside your directory.

## Task Protocol
1. Create a task for each content piece
2. Mark tasks in_progress when you start
3. When done, mark complete — brand-guardian will review
4. If guardian requests revision, create a new task
```

---

## Token Cost Awareness

Agent Teams use 3-6x more tokens than single-agent chains. Use teams only when the parallelism benefit justifies the cost.

### Cost Tiers
| Workflow | Estimated Tokens | Cost Level |
|----------|-----------------|------------|
| Single post (1 agent + guardian) | ~5K-10K | LOW |
| Campaign team (5 teammates) | ~30K-60K | HIGH |
| Content sprint (3 teammates) | ~20K-40K | MEDIUM |
| Brand audit (4 teammates) | ~25K-50K | MEDIUM-HIGH |

### Cost Guard
Before spawning a team, confirm with the user:
"This will spawn a team of {N} agents working in parallel. This uses ~{estimate} tokens ({cost_level} cost). Proceed?"

Skip confirmation if the user explicitly requested a team or campaign.

---

## Memory Initialization

**IRON LAW:** Memory MUST be initialized before ANY content work.

```
Bash(command="mkdir -p .claude/marketing")
Read(file_path=".claude/marketing/activeContext.md")  # Create if missing
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
```

Then load brand context:
```
Read(file_path="brands/base44/RULES.md")
Read(file_path="brands/base44/tone-of-voice.md")
Read(file_path="brands/base44/learning-log.md")
```

For full initialization sequence, see [reference/memory-init.md](reference/memory-init.md).

---

## Voice Rules

### ALWAYS USE
- "Builders" (never "users" or "customers")
- "Ship" / "Go live" (never "deploy" or "launch")
- "Just shipped" / "Just dropped"
- Action verbs, present tense
- Specific numbers ($1M ARR, 400K+ builders)

### NEVER USE
- "Users" / "Customers"
- "Deploy" / "Launch"
- "We're excited to announce"
- Corporate hedging
- Passive voice
- Arrow bullets (→)

---

## Channel Rules (Quick Reference)

| Channel | Emoji | Key Pattern |
|---------|-------|-------------|
| LinkedIn | 1-3 | Hook → Details → CTA |
| X | 2-4 | Threads for long content |
| Discord | Many | Humor OK, casual |
| Email | Minimal | Problem → Solution → Result |

---

## Validation Gates

| Agent | Threshold |
|-------|-----------|
| All specialists | Confidence ≥70% |
| brand-guardian | Score ≥7/10 |

**Score < 7 = content does NOT leave the system**

For task hierarchy and validation details, see [reference/task-pattern.md](reference/task-pattern.md).

---

## Supporting Skills

| Skill | Purpose |
|-------|---------|
| marketing-ideas | 77 tactics, playbooks |
| marketing-psychology | 71 persuasion principles |
| hook-rules | Approved hooks, banned patterns |
| landing-page-generator | CMS-driven landing page pipeline |
| base44-landing-page | HTML generation + Base44 hosting deployment |
| cross-platform-repurpose | Transform between platforms |
| brand-memory | Persistent learning |
| data-intelligence | Builder analytics, content pipeline (Phase 2 — not yet built) |

---

## Reference Files

| File | Content |
|------|---------|
| [reference/workflows.md](reference/workflows.md) | Detailed workflow instructions |
| [reference/task-pattern.md](reference/task-pattern.md) | CC10X task hierarchy |
| [reference/memory-init.md](reference/memory-init.md) | Full initialization sequence |

---

## Voice Test (Before Delivery)

1. Does this sound like a builder talking to a builder?
2. Are we using action verbs ("ship", "build", "drop")?
3. Are we showing results, not just promises?
4. Would reader feel "I can do this right now"?
5. Is there a shorter, punchier way to say this?
