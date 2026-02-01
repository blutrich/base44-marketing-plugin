---
name: marketing-router
description: |
  THE ONLY ENTRY POINT FOR BASE44 MARKETING. This skill MUST be activated for ANY content request.

  Use this skill when: creating content, writing posts, generating copy, planning campaigns, or ANY marketing request.

  Triggers: linkedin, post, content, write, create, copy, email, landing, page, seo, blog, campaign, announce, launch, marketing, brand, Base44.

  CRITICAL: Execute workflow immediately. Never just describe capabilities.
---

# Marketing Router

**EXECUTION ENGINE.** When loaded: Read brand → Detect intent → Load memory → Execute workflow → Update learning log.

**NEVER** list capabilities. **ALWAYS** execute.

## Decision Tree (FOLLOW IN ORDER)

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 1 | CAMPAIGN | campaign, launch, multi-channel, announcement | **CAMPAIGN** |
| 2 | LINKEDIN | linkedin, post, social, viral | **LINKEDIN** |
| 3 | EMAIL | email, nurture, sequence, drip | **EMAIL** |
| 4 | LANDING | landing page, sales page, signup | **LANDING** |
| 5 | SEO | blog, seo, article, pillar | **SEO** |
| 6 | DEFAULT | content, write, create | **CONTENT** |

**Conflict Resolution:** CAMPAIGN always wins if multi-channel detected.

## Agent Chains

| Workflow | Agents |
|----------|--------|
| CAMPAIGN | planner → **[linkedin-specialist ∥ copywriter ∥ seo-specialist]** → brand-guardian |
| LINKEDIN | linkedin-specialist → brand-guardian |
| EMAIL | copywriter → brand-guardian |
| LANDING | copywriter → brand-guardian |
| SEO | seo-specialist → brand-guardian |
| CONTENT | content-writer → brand-guardian |

**∥ = PARALLEL** - run simultaneously for multi-channel campaigns

## Brand Context (LOAD FIRST - MANDATORY)

```
Read(file_path="brands/base44/tone-of-voice.md")
Read(file_path="brands/base44/AGENTS.md")
Read(file_path="brand/learning-log.md")
```

## Brand Memory (PERMISSION-FREE)

**LOAD BEFORE ROUTING:**
```
Bash(command="mkdir -p .claude/marketing")
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
```

If any memory file is missing, create it with templates from `base44-marketing:brand-memory`.

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

## Post-Agent Validation

After each agent completes:

1. Check output has required sections
2. **Brand Guardian is MANDATORY** - all content must pass review
3. If Guardian rejects: Create remediation task, block delivery

```
### Agent Validation: {agent_name}
- Brand Voice Check: [Pass/Fail]
- Required Elements: [Present/Missing]
- Proceeding: [Yes/No + reason]
```

## Learning Log Update

After successful content delivery:

```
Edit(file_path="brand/learning-log.md", ...)
# Add entry:
# - What was created
# - What worked well
# - Patterns to repeat
```

After rejection/revision:

```
Edit(file_path="brand/learning-log.md", ...)
# Add entry:
# - Original content
# - Feedback received
# - Corrected version
# - Pattern learned
```

---

**Voice Test (Before Delivery):**
1. Does this sound like a builder talking to a builder?
2. Are we using action verbs ("ship", "build", "drop")?
3. Are we showing results, not just promises?
4. Would reader feel "I can do this right now"?
5. Is there a shorter, punchier way to say this?
