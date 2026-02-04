---
name: marketing-router
description: |
  Entry point for all Base44 marketing content. Routes requests to specialized agents and validates output through brand-guardian.

  Triggers on: linkedin, post, content, write, create, copy, email, landing, page, seo, blog, campaign, announce, launch, marketing, brand, Base44, brainstorm, ideas, tactics, video, remotion, animation, ad, paid.

  Executes workflows immediately. Never lists capabilities.
---

# Marketing Router

**EXECUTION ENGINE.** When loaded: Initialize memory → Read brand → Detect intent → Create tasks → Execute workflow → Update learning log.

**NEVER** list capabilities. **ALWAYS** execute.

---

## Task Hierarchy Pattern (CC10X)

Every workflow creates a task hierarchy for tracking:

```
┌─────────────────────────────────────────────────────────────────┐
│  PARENT TASK: MARKETING [WORKFLOW]: [topic]                      │
│  Status: in_progress                                             │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── CHILD: [specialist]-agent: Create content
         │         Status: pending → in_progress → completed
         │
         ├─── CHILD: brand-guardian: Review content
         │         Status: pending (blocked by specialist)
         │         → in_progress → completed
         │
         └─── CHILD: memory-update: Log learnings
                   Status: pending (blocked by guardian)
                   → in_progress → completed
```

### Task Creation Protocol

```
# Step 1: Create parent task
TaskCreate({
  subject: "MARKETING [WORKFLOW]: [topic]",
  description: "Full workflow for [description]",
  activeForm: "Creating [content type]"
})
# → Returns parent_id

# Step 2: Create specialist task
TaskCreate({
  subject: "[agent-name]: [action]",
  description: "Create [content type] following brand guidelines",
  activeForm: "Writing [content type]"
})
# → Returns specialist_id

# Step 3: Create guardian task
TaskCreate({
  subject: "brand-guardian: Review [content type]",
  description: "Validate brand consistency, score content",
  activeForm: "Reviewing content"
})
# → Returns guardian_id

# Step 4: Create memory task
TaskCreate({
  subject: "memory-update: Log learnings",
  description: "Update patterns.md, feedback.md, learning-log.md",
  activeForm: "Updating memory"
})
# → Returns memory_id

# Step 5: Set dependencies
TaskUpdate({ taskId: guardian_id, addBlockedBy: [specialist_id] })
TaskUpdate({ taskId: memory_id, addBlockedBy: [guardian_id] })
```

### Task Completion Protocol

After each step:
```
TaskUpdate({
  taskId: "[task_id]",
  status: "completed",
  metadata: {
    output_summary: "[brief description]",
    score: [X/10 if applicable],
    evidence_captured: [true/false]
  }
})
```

### Workflow Tracking Table

At start of workflow, output:
```markdown
## Workflow: MARKETING [TYPE]

| Task | Agent | Status | Blocked By |
|------|-------|--------|------------|
| Parent | router | in_progress | - |
| Content | [specialist] | pending | - |
| Review | brand-guardian | pending | Content |
| Memory | memory-update | pending | Review |
```

Update as tasks complete.

---

## Skill Hierarchy (UNDERSTAND THIS FIRST)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MARKETING-ROUTER (this skill)                │
│                      Orchestrator / Entry Point                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐    ┌───────────────────┐    ┌──────────────────┐
│ IDEATION LAYER│    │  EXECUTION LAYER  │    │ FOUNDATION LAYER │
│               │    │                   │    │                  │
│ marketing-    │───▶│ linkedin-viral    │◀───│ marketing-       │
│ ideas         │    │ x-viral           │    │ psychology       │
│ (brainstorm,  │    │ seo-content       │    │ (71 principles)  │
│ 77 tactics)   │    │ direct-response   │    │                  │
│               │    │ landing-page      │    │ hook-rules       │
└───────────────┘    │                   │    │ (anti-AI hooks)  │
                     │ cross-platform-   │    │                  │
                     │ repurpose         │    │ brand-voice      │
                     └───────────────────┘    └──────────────────┘
                                 │
                                 ▼
                     ┌───────────────────┐
                     │   REVIEW LAYER    │
                     │                   │
                     │  brand-guardian   │
                     │  (validates all)  │
                     └───────────────────┘
                                 │
                                 ▼
                           [ OUTPUT ]
```

**Flow:**
1. IDEATION → Generates ideas/tactics (marketing-ideas)
2. EXECUTION → Creates content (channel skills)
3. FOUNDATION → Informs all layers (psychology, voice)
4. REVIEW → Validates brand fit (brand-guardian)

## Decision Tree (FOLLOW IN ORDER)

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 0 | BRAINSTORM | ideas, brainstorm, tactics, amplify, promote, growth hacks | **BRAINSTORM** |
| 1 | PAID_AD | ad, paid, meta ad, facebook ad, instagram ad, linkedin ad, reddit ad, creative, banner, sponsored | **PAID_AD** |
| 2 | REPURPOSE | repurpose, transform, convert, adapt, rewrite for | **REPURPOSE** |
| 3 | CAMPAIGN | campaign, launch, multi-channel, announcement | **CAMPAIGN** |
| 4 | X | x, twitter, tweet, thread | **X** |
| 5 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 6 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 7 | LANDING | landing page, sales page, signup | **LANDING** |
| 8 | SEO | blog, seo, article, pillar | **SEO** |
| 9 | VIDEO | video, remotion, animation, thumbnail, clip, reel | **VIDEO** |
| 10 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:**
- BRAINSTORM = ideation only (generates ideas, routes to execution)
- PAID_AD = takes priority for any paid/sponsored content requests
- REPURPOSE = takes existing content and transforms for new platform
- CAMPAIGN always wins if multi-channel detected for execution

## Agent Chains

| Workflow | Agents | Layer |
|----------|--------|-------|
| BRAINSTORM | marketing-ideas → (routes to execution) | Ideation |
| PAID_AD | ad-specialist → brand-guardian | Execution |
| REPURPOSE | cross-platform-repurpose → brand-guardian | Utility |
| CAMPAIGN | planner → **[linkedin ∥ x ∥ copywriter ∥ seo ∥ ad-specialist]** → brand-guardian | Execution |
| X | x-specialist → brand-guardian | Execution |
| LINKEDIN | linkedin-specialist → brand-guardian | Execution |
| EMAIL | copywriter → brand-guardian | Execution |
| LANDING | copywriter → brand-guardian | Execution |
| SEO | seo-specialist → brand-guardian | Execution |
| VIDEO | video-specialist → brand-guardian | Execution |
| CONTENT | content-writer → brand-guardian | Execution |

**∥ = PARALLEL** - run simultaneously for multi-channel campaigns

## Supporting Skills (Reference as needed)

| Skill | Layer | Purpose |
|-------|-------|---------|
| marketing-ideas | Ideation | 77 tactics, playbooks (LinkedIn, Guerrilla, PH, IDEA) |
| marketing-psychology | Foundation | 71 principles for persuasion/conversion |
| brand-voice | Foundation | Base44 tone and vocabulary |
| brand-memory | Context | Persistent patterns, learnings, feedback loop |
| hook-rules | Foundation | Approved hook styles, banned patterns (no arrows, no FOMO) |
| cross-platform-repurpose | Utility | Transform content between platforms (LinkedIn→X, etc.) |

## Memory Initialization (5-STEP SEQUENCE - MANDATORY)

**IRON LAW:** Memory MUST be initialized before ANY content work.

### Step 1: Create Directory
```
Bash(command="mkdir -p ~/.claude/marketing")
```

### Step 2: Check Existing Files
```
Bash(command="ls -la ~/.claude/marketing/ 2>/dev/null || echo 'EMPTY'")
```

### Step 3: Create Missing Files

If `activeContext.md` missing:
```
Write(file_path="~/.claude/marketing/activeContext.md", content="
# Marketing Active Context

## Current Focus
- Campaign: [none]
- Channel: [none]
- Deadline: [none]
- Priority: [normal]

## Recent Content
| Date | Type | Channel | Status | Score |
|------|------|---------|--------|-------|

## Key Messages
- [Add current messaging priorities here]

## Numbers to Use
| Metric | Value | Last Updated |
|--------|-------|--------------|
| ARR | $X | [date] |
| Users/Builders | X | [date] |
| Apps shipped | X | [date] |

## References
- Plan: N/A
- Brief: N/A
- Learning Log: brands/base44/learning-log.md

## Last Updated
[timestamp]
")
```

If `patterns.md` missing:
```
Write(file_path="~/.claude/marketing/patterns.md", content="
# Learned Patterns

## Phrases That Work
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| \"Less guessing. More shipping.\" | Punchy, parallel structure | Tiffany/Debug Mode | 5 |
| \"Another feature just dropped:\" | Clean announcement format | LinkedIn analysis | 4 |
| \"Happy [action]! [emoji]\" | Friendly sign-off | LinkedIn | 3 |

## Phrases to AVOID
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| \"We're excited to announce\" | Corporate, not builder-voice | Brand rules | - |
| \"users\" / \"customers\" | Not builder-centric | RULES.md | - |
| Arrow bullets (→) | AI detection flag | Lora feedback | - |

## Channel Patterns
### LinkedIn
- 1-3 emoji max
- Hook → Details → CTA
- Numbers always specific

### Discord
- More emoji OK
- Humor OK
- Self-deprecating works

### Email
- Problem → Solution → Result
- Single CTA
- Short paragraphs (150-200 words)

### X (Twitter)
- 2-4 emoji OK
- Thread format for long content
- Intrigue hooks work

## Content That Got Approved
| Date | Type | Channel | Key Elements | Score |
|------|------|---------|--------------|-------|

## Content That Got Rejected
| Date | Type | Channel | Issue | Fix | DEBUG |
|------|------|---------|-------|-----|-------|

## Pattern Tracking
| Pattern | Type | Category | Count | Status |
|---------|------|----------|-------|--------|

## Last Updated
[timestamp]
")
```

If `feedback.md` missing:
```
Write(file_path="~/.claude/marketing/feedback.md", content="
# Pending Feedback

## Awaiting Review
| Date | Content | Channel | Status | Assigned |
|------|---------|---------|--------|----------|

## Recent Feedback

## Debug Attempts
| Date | Content | Issue | Attempts | Resolution |
|------|---------|-------|----------|------------|

## Last Updated
[timestamp]
")
```

### Step 4: Load Brand Context
```
Read(file_path="brands/base44/RULES.md")           # FIRST - hard rules
Read(file_path="brands/base44/tone-of-voice.md")   # Voice guide
Read(file_path="brands/base44/AGENTS.md")          # Agent index
Read(file_path="brands/base44/learning-log.md")    # Recent learnings
```

### Step 5: Verify All Files & Anchors
```
Read(file_path="~/.claude/marketing/activeContext.md")
Read(file_path="~/.claude/marketing/patterns.md")
Read(file_path="~/.claude/marketing/feedback.md")

# Check guaranteed anchors exist:
# activeContext.md: ## Current Focus, ## Recent Content, ## Last Updated
# patterns.md: ## Phrases That Work, ## Phrases to AVOID, ## Pattern Tracking
# feedback.md: ## Awaiting Review, ## Recent Feedback, ## Debug Attempts

# If ANY anchor missing → Auto-heal (recreate from template)
```

### Initialization Checklist

Before proceeding to routing:
- [ ] Directory exists (~/.claude/marketing/)
- [ ] activeContext.md exists and has anchors
- [ ] patterns.md exists and has anchors
- [ ] feedback.md exists and has anchors
- [ ] Brand files loaded (RULES.md, tone-of-voice.md, learning-log.md)
- [ ] No pending promotions (patterns at COUNT: 2)

**Only when ALL boxes checked: Proceed to routing.**

## Voice Rules (FROM AGENTS.md)

### ALWAYS USE
- "Builders" (never "users" or "customers")
- "Ship" / "Go live" (never "deploy" or "launch")
- "Just shipped" / "Just dropped"
- "Vibe coding" (our category name)
- Action verbs, present tense
- Specific numbers ($1M ARR, 140K users, 3 weeks)
- Short paragraphs

### NEVER USE
- "Users" / "Customers"
- "Deploy" / "Launch"
- "We're excited to announce"
- Corporate hedging
- Passive voice
- Walls of text
- Vague claims

## Channel-Specific Rules

### LinkedIn
- Emoji: 1-3 per post (🎉🚀💪🧪)
- Format: Hook → Details → CTA
- Numbers: Always specific
- Phrases: "Another feature just dropped:", "We can't wait to see what you build"

### Discord
- Emoji: Lots (💪😅🎉)
- Tone: Casual, humor OK
- Self-deprecating jokes work
- "Happy [action]!" sign-offs

### X (Twitter)
- Emoji: Some (🎉🚀🙏🏼🤯)
- Threads: Numbered points for long content
- Repost builder content
- Intrigue hooks: "The results were honestly shocking"

### Email
- Problem → Solution → Result arc
- "Less guessing. More shipping." tagline style
- Direct CTA

## Workflow Execution

### BRAINSTORM (Ideation Layer)
1. Load brand context
2. Load marketing-ideas skill:
```
Read(file_path="skills/marketing-ideas/SKILL.md")
```
3. **ASK for content:** What are they trying to amplify?
4. **ASK for goal:** Use AskUserQuestion
   - More leads/signups
   - Buzz without paid ads
   - Get customers to share
   - Beat competitors
   - Retain customers
   - Win at events
   - Build for the future
5. **Load appropriate playbook:**
```
Read(file_path="skills/marketing-ideas/playbooks/main.md")
Read(file_path="skills/marketing-ideas/playbooks/linkedin.md")  # if relevant
Read(file_path="skills/marketing-ideas/playbooks/guerrilla.md")  # if budget-conscious
```
6. **Output 3-5 specific tactics** with concrete examples
7. **Route to execution:** After brainstorming, ask which idea to execute → route to appropriate channel workflow

**BRAINSTORM is INPUT stage. It generates ideas, then hands off to execution skills.**

### PAID_AD (Paid Advertising)
Create paid ad creatives for Meta, LinkedIn, Reddit.

1. Load brand context + memory
2. Load ad references:
```
Read(file_path="~/.claude/skills/nano-banana/references/paid-ads-specs.md")
Read(file_path="~/.claude/skills/nano-banana/references/base44/ad-messaging.md")
Read(file_path="~/.claude/skills/nano-banana/references/base44/ad-styles.md")
```
3. **CLARIFY** (REQUIRED): Use AskUserQuestion
   - Platform: Meta / LinkedIn / Reddit
   - Format: Feed / Story
   - Goal: Awareness / Signups / Feature promotion
   - Key message or product to highlight
   - Number of variations needed?
4. **Create task hierarchy:**
```
TaskCreate({ subject: "MARKETING PAID_AD: {platform} {goal}", description: "...", activeForm: "Creating paid ad" })
TaskCreate({ subject: "ad-specialist: Generate ad package", ... })
TaskCreate({ subject: "brand-guardian: Review ad creative", ... })
TaskUpdate({ taskId: guardian_id, addBlockedBy: [specialist_id] })
```
5. Execute chain: ad-specialist → brand-guardian
6. **Output includes:**
   - 3 headline variations
   - 3 primary text variations
   - Recommended visual style
   - nano-banana commands to generate image
7. Update memory with learnings

**PAID_AD generates copy + visual package. Use nano-banana skill to create final images.**

### X (Twitter)
1. Load brand context + memory
2. **CLARIFY** (if needed): Use AskUserQuestion
   - Single tweet or thread?
   - What's the key message?
   - Any specific numbers/results to include?
3. **Create task hierarchy:**
```
TaskCreate({ subject: "MARKETING X: {topic}", description: "...", activeForm: "Creating X content" })
TaskCreate({ subject: "x-specialist: Write tweet/thread", ... })
TaskCreate({ subject: "brand-guardian: Review content", ... })
TaskUpdate({ taskId: guardian_id, addBlockedBy: [specialist_id] })
```
4. Execute chain
5. Update memory with learnings

### LINKEDIN
1. Load brand context + memory
2. **CLARIFY** (if needed): Use AskUserQuestion
   - What's the key message?
   - What outcome/result to highlight?
   - Any specific numbers to include?
3. **Create task hierarchy:**
```
TaskCreate({ subject: "MARKETING LINKEDIN: {topic}", description: "...", activeForm: "Creating LinkedIn post" })
TaskCreate({ subject: "linkedin-specialist: Write post", ... })
TaskCreate({ subject: "brand-guardian: Review post", ... })
TaskUpdate({ taskId: guardian_id, addBlockedBy: [specialist_id] })
```
4. Execute chain
5. Update memory with learnings

### CAMPAIGN
1. Load brand context + memory
2. **CLARIFY** (REQUIRED):
   - What channels? (LinkedIn, Email, Landing page)
   - What's the launch/announcement?
   - Key messages and CTAs?
3. **Create task hierarchy:**
```
TaskCreate({ subject: "MARKETING CAMPAIGN: {name}", ... })
# Parallel content creation
TaskCreate({ subject: "linkedin-specialist: Campaign post", ... })
TaskCreate({ subject: "copywriter: Campaign email", ... })
TaskCreate({ subject: "seo-specialist: Campaign blog", ... })
# Sequential review
TaskCreate({ subject: "brand-guardian: Review all content", ... })
TaskUpdate({ taskId: guardian_id, addBlockedBy: [linkedin_id, email_id, seo_id] })
```
4. Execute parallel → then review
5. Update memory

### REPURPOSE
Transform existing content for a different platform.

1. Load brand context + memory
2. Load cross-platform-repurpose skill:
```
Read(file_path="skills/cross-platform-repurpose/SKILL.md")
```
3. **IDENTIFY source and target:**
   - What platform is the original content from?
   - What platform(s) to transform to?
4. **Apply transformation rules** from the skill:
   - LinkedIn → X: Compress to 280 chars, punchier
   - LinkedIn → Thread: Break into 5-7 numbered tweets
   - LinkedIn → Email: Make personal, add subject line
   - X → LinkedIn: Expand with context and story
5. **Validate with brand-guardian**
6. **Output format:**
```markdown
## Original ([Source Platform])
[Original content]

## Repurposed for [Target Platform]
[Transformed content]

### Transformation Notes
- Key changes made
- Brand voice maintained: Yes
```

## Agent Invocation

**Pass brand context to each agent:**
```
Task(subagent_type="base44-marketing:linkedin-specialist", prompt="
## Brand Context
- Voice: Builder-first, fast-paced, results-focused
- Style: 'Cool big brother' - supportive, teaches, teases

## Task
{user_request}

## Key Numbers/Results
{specific metrics if any}

## Memory Context
{from activeContext.md}

## SKILL_HINTS
{detected skills}

When complete: TaskUpdate({ taskId: '{task_id}', status: 'completed' })
")
```

## Post-Agent Validation (CC10X PATTERN)

After each agent completes, **VALIDATE before proceeding**:

### Validation Gates

| Agent | Required Output | Threshold |
|-------|-----------------|-----------|
| linkedin-specialist | Post + Metadata | Confidence ≥70 |
| x-specialist | Tweet/Thread + Metadata | Confidence ≥70 |
| copywriter | Copy + Framework used | Confidence ≥70 |
| seo-specialist | Content + SEO Metadata | Confidence ≥70 |
| brand-guardian | Score + Verdict | Score ≥7/10 |

### Validation Check (Run after EVERY agent)

```
### Agent Validation: {agent_name}
- Required Sections: [Present/Missing]
- Confidence Score: [X/100 or X/10]
- Threshold Met: [Yes/No]
- Proceeding: [Yes/No + reason]
```

### Failure Handling

**If confidence < threshold OR required sections missing:**
1. Create remediation task
2. Block downstream tasks
3. Do NOT proceed to brand-guardian with incomplete content

```
TaskCreate({
  subject: "REMEDIATE: {agent_name} output incomplete",
  description: "Missing: {what's missing}\nRequired: {what's needed}",
  activeForm: "Fixing content"
})
TaskUpdate({ taskId: guardian_id, addBlockedBy: [remediation_id] })
```

### Brand Guardian Verdicts

| Score | Verdict | Action |
|-------|---------|--------|
| 9-10 | APPROVED | Deliver to user |
| 7-8 | APPROVED WITH NOTES | Deliver + show suggestions |
| 5-6 | NEEDS REVISION | Return to specialist |
| 1-4 | REJECTED | Rewrite from scratch |

**CRITICAL:** Score < 7 = content does NOT leave the system

## Memory Management (CC10X PATTERN)

### Memory Files Structure

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `activeContext.md` | Current focus, recent work | Every session |
| `patterns.md` | What works, reusable insights | When patterns emerge |
| `feedback.md` | Pending team feedback | After reviews |

### Read-Edit-Verify Cycle (MANDATORY)

**Every memory edit follows this pattern:**
```
1. Read(file_path=".claude/marketing/{file}.md")  # Load current
2. Edit(file_path=".claude/marketing/{file}.md", old_string="...", new_string="...")  # Update
3. Read(file_path=".claude/marketing/{file}.md")  # VERIFY edit applied
```

**NEVER skip step 3.** Edits can fail silently.

### Stable Anchors (Edit using THESE headers only)

**activeContext.md:**
- `## Current Focus`
- `## Recent Content`
- `## Next Steps`
- `## Active Campaigns`
- `## Last Updated`

**patterns.md:**
- `## Voice Patterns`
- `## Platform Patterns`
- `## Engagement Patterns`
- `## Anti-Patterns`

**feedback.md:**
- `## Pending Review`
- `## Applied Feedback`
- `## Rejected Ideas`

### Learning Log Update

After successful content delivery:
```
Edit(file_path="brands/base44/learning-log.md", ...)
# Add entry under ## Recent Entries:
# - Date, Channel, Type
# - What worked well
# - Pattern to repeat
```

After rejection/revision:
```
Edit(file_path="brands/base44/learning-log.md", ...)
# Add entry under ## Corrections:
# - Original issue
# - Fix applied
# - Rule learned
```

### Escalation to RULES.md

**If same feedback appears 3+ times in learning-log.md:**
```
Edit(file_path="brands/base44/RULES.md", ...)
# Add to ## NEVER DO section
# This makes it a HARD RULE all agents read FIRST
```

---

**Voice Test (Before Delivery):**
1. Does this sound like a builder talking to a builder?
2. Are we using action verbs ("ship", "build", "drop")?
3. Are we showing results, not just promises?
4. Would reader feel "I can do this right now"?
5. Is there a shorter, punchier way to say this?
