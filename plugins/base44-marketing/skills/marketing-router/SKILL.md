---
name: marketing-router
description: |
  Entry point for all Base44 marketing content. Routes requests to specialized agents and validates output through brand-guardian.

  Triggers on: linkedin, post, content, write, create, copy, email, landing, page, seo, blog, campaign, announce, launch, marketing, brand, Base44, brainstorm, ideas, tactics, video, remotion, animation, ad, paid.

  Executes workflows immediately. Never lists capabilities.
---

# Marketing Router

**EXECUTION ENGINE.** When loaded: Initialize memory > Read brand > Detect intent > Execute workflow > Update memory.

**NEVER** list capabilities. **ALWAYS** execute.

## Contents

- [Decision Tree](#decision-tree)
- [Agent Chains](#agent-chains)
- [Memory Init](#memory-initialization)
- [Voice Rules](#voice-rules)
- [Reference Files](#reference-files)

---

## Intent Detection (FOLLOW IN ORDER)

### Phase 1: Understand the User's Intent (MANDATORY)

**ALWAYS ask the user what they need before routing.** Never silently auto-detect and execute. The user must confirm intent.

**Step 1: Ask what they need.**

If the request is NOT already crystal clear (e.g., "Write a LinkedIn post about gift cards"), ask:

```
AskUserQuestion(questions=[{
  "question": "What are you looking to do?",
  "header": "Marketing Router",
  "options": [
    {"label": "Write content", "description": "LinkedIn post, X tweet, email, blog, ad copy"},
    {"label": "Launch a feature", "description": "Full launch waterfall: strategy > messaging > assets > execution"},
    {"label": "Plan strategy", "description": "Go-to-market thinking, content strategy, positioning"},
    {"label": "Create visuals", "description": "Branded social creatives, images, carousels"},
    {"label": "Build a landing page", "description": "Copy + HTML + deploy to Base44"},
    {"label": "Scan for features", "description": "Feature intel, feature scan, what's being built"},
    {"label": "Pull data", "description": "Analytics, growth numbers, builder stats"},
    {"label": "Something else", "description": "Repurpose, push to Ripple, video, campaign"}
  ],
  "multiSelect": false
}])
```

**Step 2: If they chose "Write content", ask which channel:**

```
AskUserQuestion(questions=[{
  "question": "Which channel?",
  "header": "Content Channel",
  "options": [
    {"label": "LinkedIn", "description": "Post for Base44 brand or Maor personal"},
    {"label": "X / Twitter", "description": "Tweet, thread, or quote tweet"},
    {"label": "Email", "description": "Email to builders"},
    {"label": "Blog / SEO", "description": "Blog post or SEO article"},
    {"label": "Paid ad", "description": "Meta, LinkedIn, or Reddit ad creative"},
    {"label": "Multiple channels", "description": "Campaign across channels"}
  ],
  "multiSelect": false
}])
```

**Step 3: Ask what it's about (the feature/topic):**

```
AskUserQuestion(questions=[{
  "question": "What's this about? Give me the context: which feature, milestone, or topic?",
  "header": "Content Brief"
}])
```

**Fast path:** If the user's original request already specifies intent + channel + topic (e.g., "Write a LinkedIn post about our new gift card feature"), skip directly to Phase 2 classification. No need to re-ask what they already said.

### Phase 2: Intent Classification (After Intent Is Confirmed)

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 0 | STRATEGY | strategy, plan, think through, what should we, holistic, go-to-market | **GTM_STRATEGY** |
| 1 | BRAINSTORM | ideas, brainstorm, tactics, amplify, promote | **BRAINSTORM** |
| 2 | PAID_AD | ad, paid, meta ad, linkedin ad, reddit ad, creative | **PAID_AD** |
| 3 | REPURPOSE | repurpose, transform, convert, adapt, rewrite for | **REPURPOSE** |
| 4 | LAUNCH | launch, ship feature, feature launch, product launch, launch plan, go-to-market launch, launch campaign, launch assets | **LAUNCH** |
| 5 | CAMPAIGN | campaign, multi-channel, announcement | **CAMPAIGN** |
| 6 | X | x, twitter, tweet, thread | **X** |
| 7 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 8 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 9 | LANDING | landing page, sales page, deploy landing page, base44 landing, host landing, ship landing page, create landing page, landing page for [feature] | **LANDING** |
| 10 | SEO | blog, seo, article, pillar | **SEO** |
| 11 | VIDEO | video, remotion, animation | **VIDEO** |
| 12 | DATA_INSIGHT | data, analytics, growth numbers, builder stats, conversion data, model usage, weekly numbers, metrics, how many builders, premium stats, user voice, top issues, builders building, categories, trends, app trends, apps created, feature adoption, agents usage, deep coding, remix, marketplace, funnel, drop-off, activation speed, referrals, model preferences, paid vs free, subscription, monetization, stripe, revenue, app classification, industry, audience | **DATA_INSIGHT** |
| 13 | APP_DATA | fetch features, show features, feature list, roadmap, pull data, product sync, what features, feature data | **APP_DATA** |
| 14 | PUSH_RIPPLE | push to ripple, save to ripple, send to ripple | **PUSH_RIPPLE** |
| 14.5 | PUSH_ACTIVITY | push to activity, save to activity, push assets, push waterfall, sync to product app, update marketing activity | **PUSH_ACTIVITY** |
| 15 | FEATURE_SCAN | scan features, feature scan, process features, brief all, morning scan, process the feature queue | **FEATURE_SCAN** |
| 16 | FEATURE_INTEL | feature intel, feature radar, feature discovery, what's being built, scan feat channels, what features are coming | **FEATURE_INTEL** |
| 17 | SESSION_LOG | log session, save session, track session, session report, wrap up, end session | **SESSION_LOG** |
| 18 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:**
- GTM_STRATEGY wins when the request is strategic/planning-oriented
- LAUNCH wins when a specific feature/product is being shipped (not generic campaigns)
- BRAINSTORM = ideation only (tactical ideas, not holistic plans)
- CAMPAIGN wins if multi-channel execution is specified WITHOUT a specific feature launch
- DATA_INSIGHT queries Trino analytics first, then routes to gtm-strategist if strategy is needed
- LAUNCH vs CAMPAIGN: If a specific feature is being launched, use LAUNCH (waterfall). If it's a general campaign (brand awareness, event), use CAMPAIGN.
- **FEATURE_SCAN vs FEATURE_INTEL:** SCAN processes the #product-marketing-sync queue (batch briefs). INTEL discovers new #feat-* channels (radar). "scan for new features" = INTEL. "process the feature queue" = SCAN.

---

## Agent Chains

| Workflow | Agents |
|----------|--------|
| GTM_STRATEGY | gtm-strategist (deep exploration, then plan) |
| LAUNCH | launch-waterfall skill (7-phase waterfall: discovery -> product -> positioning -> messaging -> asset plan -> creation -> execution) |
| BRAINSTORM | marketing-ideas (then routes to execution) |
| DATA_INSIGHT | data-insight skill (Trino analytics queries) -> gtm-strategist (if strategy requested) |
| PAID_AD | ad-specialist > brand-guardian |
| REPURPOSE | cross-platform-repurpose > brand-guardian |
| CAMPAIGN | planner > [specialists in parallel] > brand-guardian |
| X | x-specialist > brand-guardian |
| LINKEDIN | linkedin-specialist > brand-guardian |
| EMAIL | copywriter > brand-guardian |
| LANDING | base44-landing-page skill (8-Section Framework > HTML > Base44 CLI deploy) > brand-guardian |
| SEO | seo-specialist > brand-guardian |
| VIDEO | video-specialist > brand-guardian |
| APP_DATA | base44-feature skill (fetch & display) |
| PUSH_RIPPLE | push-to-ripple skill (extract content > push to Ripple CMS) |
| PUSH_ACTIVITY | push-to-activity skill (map channel content > push to MarketingActivity entity in Product App) |
| SESSION_LOG | session-log skill (capture session > push to Ripple) |
| FEATURE_SCAN | feature-scan skill (scan #product-marketing-sync > check Ripple > generate briefs + content > push > notify) |
| FEATURE_INTEL | feature-intel skill (scan #feat-* channels > detect new features in dev > post digests to #features-intel-changelog-4marketing) |
| CONTENT | copywriter > brand-guardian (default for generic content requests) |

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
3. When done, mark complete. Brand-guardian will review
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

Then load brand context per `brands/base44/context-loading.md`.

For full initialization sequence, see [reference/memory-init.md](reference/memory-init.md).

---

## Voice Rules

**Full voice rules:** See `agents/shared-instructions.md` (single source of truth).

**Quick reminders:** "Builders" not "users" | "Ship" not "deploy" | No TV-ad cadence | Maor Test

---

## Channel Rules (Quick Reference)

| Channel | Emoji | Key Pattern |
|---------|-------|-------------|
| LinkedIn | 1-3 | Hook > Details > CTA |
| X | 2-4 | Threads for long content |
| Discord | Many | Humor OK, casual |
| Email | Minimal | Problem > Solution > Result |

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

| Skill | Purpose | Loaded By |
|-------|---------|-----------|
| marketing-ideas | 77 tactics, playbooks | Router (BRAINSTORM) |
| marketing-psychology | 71 persuasion principles | Agents (gtm, planner, specialists) |
| hook-rules | Approved hooks, banned patterns | Agents (linkedin, x, ad, video) |
| base44-landing-page | HTML generation + Base44 hosting deployment | Router (LANDING) |
| landing-page-architecture | Copy Brief + 8-Section Framework (prerequisite for base44-landing-page) | copywriter agent |
| cross-platform-repurpose | Transform between platforms | Router (REPURPOSE) |
| brand-memory | Persistent learning | Router (init) |
| base44-feature | Fetch live data from Base44 app entities (features, roadmap) | Router (APP_DATA) |
| push-to-ripple | Push generated content into Ripple CMS | Router (PUSH_RIPPLE) |
| push-to-activity | Push channel content into MarketingActivity entity (Product App) | Router (PUSH_ACTIVITY), launch-waterfall (Phase 7) |
| data-insight | Trino analytics: growth, models, funnel, apps, features, remix, referrals, user voice (19 queries, 6 tables) | Router (DATA_INSIGHT) |
| session-log | Session tracking: usage, time saved, business impact | Router (SESSION_LOG) |
| direct-response-copy | THE SLIDE framework for conversion copy | copywriter agent |
| linkedin-viral | LinkedIn optimization patterns | linkedin-specialist agent |
| x-viral | X/Twitter optimization patterns | x-specialist agent |
| seo-content | Search optimization | seo-specialist agent |
| geo-content | AI citation optimization (ChatGPT, Perplexity, Claude) | seo-specialist agent |
| nano-banana | Marketing image generation via Google Imagen 3 | ad-specialist, video-specialist agents |
| remotion | Video creation in React (24 sub-rule files) | video-specialist agent |
| launch-waterfall | 7-phase waterfall for feature launches (auto-discovery to execution) | Router (LAUNCH) |
| verification-before-delivery | Quality assurance before output | Optional QA gate |
| feature-brief | Single-feature deep dive: Slack > MarketingActivity | Router (FEATURE_BRIEF) |
| feature-scan | Batch scanner: #product-marketing-sync > Ripple | Router (FEATURE_SCAN) |
| feature-intel | Intel scan: #feat-* channels > digest to Slack | Router (FEATURE_INTEL) |

---

## Reference Files

| File | Content |
|------|---------|
| [reference/workflows.md](reference/workflows.md) | Detailed workflow instructions |
| [reference/task-pattern.md](reference/task-pattern.md) | CC10X task hierarchy |
| [reference/memory-init.md](reference/memory-init.md) | Full initialization sequence |

---

## Session Logging (AUTOMATIC)

**For content workflows (LINKEDIN, X, EMAIL, SEO, LANDING, VIDEO, PAID_AD, CAMPAIGN, REPURPOSE):**
Brand-guardian handles auto-logging after every review. No action needed from the router.

**For non-guardian workflows (GTM_STRATEGY, BRAINSTORM, DATA_INSIGHT, APP_DATA, FEATURE_BRIEF, FEATURE_SCAN, FEATURE_INTEL):**
After the workflow completes, automatically invoke `session-log` in silent mode:
1. Scan conversation for workflows used, content pieces, data queries
2. Push to PluginSession entity (skip user confirmation)
3. Report: `Session logged. Time saved: ~{N} min`

If credentials missing, silently skip. Don't interrupt the workflow.

---

## Voice Test (Before Delivery)

1. Does this sound like a builder talking to a builder?
2. Are we using action verbs ("ship", "build", "drop")?
3. Are we showing results, not just promises?
4. Would reader feel "I can do this right now"?
5. Is there a shorter, punchier way to say this?
