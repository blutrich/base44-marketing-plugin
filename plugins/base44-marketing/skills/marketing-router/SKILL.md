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

## Decision Tree (FOLLOW IN ORDER)

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 0 | BRAINSTORM | ideas, brainstorm, tactics, amplify, promote | **BRAINSTORM** |
| 1 | PAID_AD | ad, paid, meta ad, linkedin ad, reddit ad, creative | **PAID_AD** |
| 2 | REPURPOSE | repurpose, transform, convert, adapt, rewrite for | **REPURPOSE** |
| 3 | CAMPAIGN | campaign, launch, multi-channel, announcement | **CAMPAIGN** |
| 4 | X | x, twitter, tweet, thread | **X** |
| 5 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 6 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 7 | LANDING | landing page, sales page, signup | **LANDING** |
| 8 | SEO | blog, seo, article, pillar | **SEO** |
| 9 | VIDEO | video, remotion, animation | **VIDEO** |
| 10 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:** BRAINSTORM = ideation only. CAMPAIGN wins if multi-channel.

---

## Agent Chains

| Workflow | Agents |
|----------|--------|
| BRAINSTORM | marketing-ideas → (routes to execution) |
| PAID_AD | ad-specialist → brand-guardian |
| REPURPOSE | cross-platform-repurpose → brand-guardian |
| CAMPAIGN | planner → [specialists in parallel] → brand-guardian |
| X | x-specialist → brand-guardian |
| LINKEDIN | linkedin-specialist → brand-guardian |
| EMAIL | copywriter → brand-guardian |
| LANDING | copywriter → brand-guardian |
| SEO | seo-specialist → brand-guardian |
| VIDEO | video-specialist → brand-guardian |

For detailed workflows, see [reference/workflows.md](reference/workflows.md).

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
- Specific numbers ($1M ARR, 140K users)

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
| cross-platform-repurpose | Transform between platforms |
| brand-memory | Persistent learning |

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
