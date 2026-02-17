# Workflow Execution Details

Detailed instructions for each marketing workflow.

---

## GTM_STRATEGY (Strategic Planning Layer)

This workflow is for when the user needs strategic thinking, not just content creation.

1. Load brand context + memory
2. **EXPLORE deeply** -- Do NOT jump to suggestions. Ask probing questions one at a time:
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
6. **Output a connected narrative, NOT a bulleted list:**
   - Explain WHY each tactic matters for their specific situation
   - Show how tactics connect to each other
   - Include a recommended sequence (do this first, then this)
   - Frame as "here's what I'd recommend as your marketing advisor" not "here are some ideas"
7. **Route to execution:** After the user confirms direction, route to specific workflow

**BRAINSTORM is INPUT stage. It generates ideas as a connected strategy, then hands off to execution skills.**

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

## LANDING (Base44-Hosted Landing Page)

Generate a self-contained HTML landing page and deploy it to Base44 hosting via the Base44 CLI.

1. Load brand context + memory
2. **Load design system** (MANDATORY for any HTML output):
```
Read(file_path="brands/base44/design-system.md")
Read(file_path="brands/base44/brand.json")
```
   - Use `logo.png` image for headers — never render the logo as plain text
3. Load base44-landing-page skill:
```
Read(file_path="skills/base44-landing-page/SKILL.md")
```
4. **GATHER INPUT** (use AskUserQuestion for missing items):
   - Page goal (feature launch, campaign, signup, etc.)
   - Target persona
   - Key message / product / feature
   - URL slug (used as Base44 app name)
   - CTA URL (default: `https://base44.com`)
5. **SELECT TEMPLATE** based on goal:
   - Feature launch → `feature-launch`
   - Campaign / event → `campaign`
   - Sign-up / free trial → `signup`
   - Case study → `case-study`
   - Enterprise / security → `enterprise`
6. **GENERATE COPY** using 8-Section Framework:
   - Load `landing-page-architecture` skill
   - Load brand files (testimonials, value-props, hooks, CTAs)
   - Generate all 8 sections with brand voice applied
7. **VALIDATE** with brand-guardian (score >= 7/10)
8. **GENERATE HTML** from design system:
   - Load `reference/html-template.md` for skeleton
   - Load `reference/asset-strategy.md` for logo embedding
   - Apply `brand.json` tokens as CSS custom properties
   - Single self-contained `index.html` (works in browser, no server)
9. **DEPLOY VIA BASE44 CLI:**
   - Auth check: `npx base44 whoami`
   - Scaffold project if needed: `npx base44 create {slug}-landing -p .`
   - Write HTML to `dist/index.html`
   - Deploy: `npx base44 site deploy -y`
   - If not authenticated: save HTML locally, provide manual deploy steps
10. **RETURN** live URL (`https://{slug}-landing.base44.app`), copy preview, and next steps

**LANDING produces a live Base44-hosted page from HTML.**

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
