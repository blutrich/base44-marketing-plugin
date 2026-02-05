# Workflow Execution Details

Detailed instructions for each marketing workflow.

---

## BRAINSTORM (Ideation Layer)

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
7. **Route to execution:** After brainstorming, ask which idea to execute

**BRAINSTORM is INPUT stage. It generates ideas, then hands off to execution skills.**

---

## PAID_AD (Paid Advertising)

Create paid ad creatives for Meta, LinkedIn, Reddit.

1. Load brand context + memory
2. **CLARIFY** (REQUIRED): Use AskUserQuestion
   - Platform: Meta / LinkedIn / Reddit
   - Format: Feed / Story
   - Goal: Awareness / Signups / Feature promotion
   - Key message or product to highlight
   - Number of variations needed?
3. Create task hierarchy (see task-pattern.md)
4. Execute chain: ad-specialist → brand-guardian
5. **Output includes:**
   - 3 headline variations
   - 3 primary text variations
   - Recommended visual style
   - nano-banana commands to generate image
6. Update memory with learnings

---

## X (Twitter)

1. Load brand context + memory
2. **CLARIFY** (if needed): Use AskUserQuestion
   - Single tweet or thread?
   - What's the key message?
   - Any specific numbers/results to include?
3. Create task hierarchy
4. Execute chain: x-specialist → brand-guardian
5. Update memory with learnings

---

## LINKEDIN

1. Load brand context + memory
2. **CLARIFY** (if needed): Use AskUserQuestion
   - What's the key message?
   - What outcome/result to highlight?
   - Any specific numbers to include?
3. Create task hierarchy
4. Execute chain: linkedin-specialist → brand-guardian
5. Update memory with learnings

---

## CAMPAIGN (Multi-Channel)

1. Load brand context + memory
2. **CLARIFY** (REQUIRED):
   - What channels? (LinkedIn, Email, Landing page)
   - What's the launch/announcement?
   - Key messages and CTAs?
3. Create task hierarchy with parallel specialists
4. Execute parallel → then review
5. Update memory

---

## REPURPOSE

Transform existing content for a different platform.

1. Load brand context + memory
2. Load cross-platform-repurpose skill:
```
Read(file_path="skills/cross-platform-repurpose/SKILL.md")
```
3. **IDENTIFY source and target:**
   - What platform is the original content from?
   - What platform(s) to transform to?
4. **Apply transformation rules:**
   - LinkedIn → X: Compress to 280 chars, punchier
   - LinkedIn → Thread: Break into 5-7 numbered tweets
   - LinkedIn → Email: Make personal, add subject line
   - X → LinkedIn: Expand with context and story
5. Validate with brand-guardian
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

---

## Agent Invocation Template

Pass brand context to each agent:
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

When complete: TaskUpdate({ taskId: '{task_id}', status: 'completed' })
")
```
