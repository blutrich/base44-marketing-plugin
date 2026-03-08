---
name: landing-page-architecture
description: |
  Builds high-converting landing pages using the Copy Brief System + 8-Section Framework. The Copy Brief is MANDATORY before any HTML generation. It ensures every claim is grounded in real evidence, every hook is tested against the Hormozi formula, and every section has a clear audience and wedge.

  Triggers on: landing page, sales page, product page, LP, create a landing page, build a page, lp copy, landing page copy, page architecture.
---

# Landing Page Architecture Skill

> Copy Brief (grounded) then Structure (8 sections) then HTML (design system).

## When to Use This Skill

Apply when creating:
- Landing pages
- Lead magnet pages
- Product launch pages
- Sales pages
- Feature announcement pages
- Pricing pages

## Core Philosophy

**Copy comes before design.** The #1 mistake is jumping to HTML before the copy is locked. Every landing page needs:

1. **Copy Brief** (Phase 1) - WHO are we talking to, WHAT's the wedge, WHERE's the proof
2. **8-Section Framework** (Phase 2) - WHERE elements go and WHY
3. **HTML Generation** (Phase 3) - Handled by `base44-landing-page` skill

**Never skip Phase 1.** A beautiful page with weak copy converts at 0%.

---

# PHASE 1: COPY BRIEF (MANDATORY)

> Complete this BEFORE writing any section copy. No exceptions.

## Step 1: Audience Lock

Define 2-4 specific audience segments. Generic "all builders" is rejected.

**For each segment, fill:**

| Field | Requirement |
|-------|-------------|
| Segment name | Specific label (e.g., "Non-technical PMs at startups") |
| Pain | What they can't do today, in their words |
| Trigger | What event makes them search for this |
| Evidence | Link to Slack message, tweet, support ticket, or user quote that proves this segment exists |
| Size signal | Any number that shows this segment matters (waitlist count, search volume, channel size) |

**How to find segments:**
1. Read the feature's Slack channel (Slack MCP: `slack_read_channel`)
2. Read threads with 3+ replies (that's where real pain shows up)
3. Check Product Insights Bot reports for usage patterns
4. Look for user feedback in #base-agent, #feat-* channels, Discord

**Output format:**
```
AUDIENCE LOCK
Segment 1: [Name]
  Pain: [specific]
  Trigger: [event]
  Evidence: [Slack quote or data point]

Segment 2: [Name]
  Pain: [specific]
  Trigger: [event]
  Evidence: [Slack quote or data point]

Primary segment: [which one the H1 targets]
```

## Step 2: Competitor Wedge

Research the main alternative and find the positioning gap.

**Process:**
1. Identify the top 1-2 alternatives (what would the audience use instead?)
2. Search for complaints about those alternatives (Tavily/WebSearch: "[competitor] problems", "[competitor] setup difficulty", "[competitor] vs")
3. Find the wedge: the ONE thing they do badly that we do well

**Sources to check:**
- Reddit threads complaining about the competitor
- GitHub issues / discussions
- Hacker News comments
- "X vs Y" blog posts and comparison sites
- Twitter/X complaints

**Output format:**
```
COMPETITOR WEDGE
Alternative: [name]
Top complaints:
  1. [complaint] (source: [link/quote])
  2. [complaint] (source: [link/quote])
  3. [complaint] (source: [link/quote])

Our wedge: [one sentence, e.g., "They proved the demand. We removed the friction."]
Proof: [specific fact, e.g., "2 minutes vs 3 hours setup"]
```

**Skip this step** only if the feature has no direct competitor (rare).

## Step 3: Proof Points

Gather every real number, quote, and data point BEFORE writing copy. No copy should contain a claim that isn't backed by something here.

**Collect from:**
- Slack channels (feature channel + #product-marketing-sync)
- Product Insights Bot reports
- Metrics (user counts, session counts, waitlist size)
- Real user quotes (with name or anonymized role)
- External validation (tweets, posts, press)

**Output format:**
```
PROOF POINTS
Numbers:
  - [metric]: [number] (source: [where])
  - [metric]: [number] (source: [where])

Quotes:
  - "[exact quote]" - [who] (source: [where])
  - "[exact quote]" - [who] (source: [where])

External:
  - [tweet/post/article] (source: [link])

User stories:
  - [Name/Role]: [what they did with the feature, in 1-2 sentences]
```

## Step 4: Hook Generation (Hormozi Formula)

Generate 4-5 H1 candidates using the **Hormozi Hook Formula**:

```
[Specific Result] + [Surprising Context] + [Implied "how"]
```

**Rules:**
- The result must come from Proof Points (Step 3)
- The context must attack the Competitor Wedge (Step 2)
- The "how" is implied, never stated (creates curiosity)
- Target the Primary Segment from Audience Lock (Step 1)

**Examples:**
```
"His AI agent was live in 2 minutes. No terminal. No Docker. No API keys."
  Result: AI agent was live
  Context: 2 minutes (vs hours for competitors)
  Implied how: How is that possible? (Base44)

"She replaced 4 SaaS tools with one app she built over lunch."
  Result: replaced 4 tools
  Context: built over lunch (speed)
  Implied how: what tool lets you do that?
```

**Validation checklist (from hook-rules):**
- [ ] Hook only makes sense for THIS feature (not interchangeable)
- [ ] No TV-ad cadence
- [ ] No em dashes
- [ ] No "we're excited"
- [ ] Passes Maor Test
- [ ] Grounded in a real proof point
- [ ] Attacks the competitor wedge without naming them

**Output: Pick top 2 candidates. Present both to user for selection.**

## Step 5: Section Copy Brief

For each of the 8 sections, write a 1-2 sentence brief BEFORE writing the actual copy. This prevents drift.

```
SECTION COPY BRIEF

HERO:
  H1: [selected hook]
  H2: [what it does + how, 1 sentence]
  Trust: [which proof points to show]
  CTA: [benefit-focused, from audience pain]

SUCCESS:
  What they get: [4-5 deliverables/capabilities]
  Feeling: [what emotion after reading this section]

PROBLEM-AGITATE:
  Problems: [2-4 pain points from audience research]
  Agitation: [cost of not acting, with number]
  Source: [which Slack quotes or competitor complaints]

VALUE STACK:
  Features: [4-6 capabilities, each with SO WHAT benefit]
  Comparison: [optional: us vs alternative table]

SOCIAL PROOF:
  Quotes: [which proof points to use]
  Results: [specific numbers per quote]

TRANSFORMATION:
  Timeline: [realistic progression for THIS feature]

SECONDARY CTA:
  Objection: [biggest remaining doubt]
  Handler: [how we address it]

FAQ:
  Questions: [4-6 real questions from Slack/support]
```

**This brief is the contract.** All copy must trace back to it.

---

# PHASE 2: 8-SECTION FRAMEWORK

> Now write the actual copy, section by section. Every claim must reference something from the Copy Brief.

## The 8-Section Framework

### 1. HERO
**Job:** Get email OR get scroll

**Components:** Eyebrow → Headline → Subheadline → CTA → Trust Signals

```
[Eyebrow: Social proof or category]
For AI Consultants Who Want Predictable Revenue

[Headline: 10-15 words max]
Get 3 Qualified Leads Per Week Without Cold Outreach

[Subheadline: How + de-risk]
The exact system I used to book $47K in Q1. No ads. No cold DMs.

[CTA: Benefit-focused]
[Get the Free Playbook]

[Trust signals]
Trusted by 2,847 consultants | Featured in Forbes
```

### 2. SUCCESS
**Job:** Kill buyer's remorse

**Components:** Checkmark → Confirmation → Deliverable list

```
✓ You're in! Here's what happens next:

In the next 5 minutes, you'll receive:
□ The 3-Step Lead System PDF (47 pages)
□ The Outreach Template Pack (12 templates)
□ The Qualification Scorecard
```

### 3. PROBLEM-AGITATE
**Job:** Make status quo painful

**Components:** 3 problems → Agitation → Personal transition

```
Sound familiar?

❌ You're great at your work, but terrible at finding it
❌ Feast or famine pipeline - no predictability
❌ Spending nights on proposals that go nowhere

Here's the worst part: Every week without a system
costs you $4,000+ in missed opportunities.

I know because I was there...
```

### 4. VALUE STACK
**Job:** Make "no" feel stupid

**Components:** 4 tiers → Total value → Your price

```
Here's everything you get:

┌─────────────────────────────────────┐
│ Complete Lead Generation System    │
│ 47-page playbook           $997    │
├─────────────────────────────────────┤
│ 12 Outreach Templates      $497    │
├─────────────────────────────────────┤
│ Qualification Scorecard    $297    │
├─────────────────────────────────────┤
│ Private Community Access   $197    │
└─────────────────────────────────────┘
               Total Value: $1,988

          Your Investment: FREE
```

### 5. SOCIAL PROOF
**Job:** Let others convince

**Components:** Header → 3 testimonials with specific results

```
What others are saying:

"I went from 0 to 3 clients in my first month."
— Sarah Chen, AI Strategy Consultant
   Result: $34,500 in new revenue

"Closed $18K while on vacation."
— Marcus Johnson, Data Consultant
   Result: 2.3x pipeline in 60 days
```

### 6. TRANSFORMATION
**Job:** Make outcome tangible

**Components:** Quick win → Compound → Advantage → 10x

```
Here's what happens when you implement this:

WEEK 1: Quick Win
→ Send first outreach, book 2-3 calls

MONTH 1: Compound Effect
→ Pipeline fills, stop saying yes to bad clients

MONTH 3: Unfair Advantage
→ Referrals unprompted, clients pre-sold

YEAR 1: 10x Outcome
→ 3x revenue, waitlist for services
```

### 7. SECONDARY CTA
**Job:** Catch scroll-to-bottom visitors

**Components:** Avatar stack → Question headline → "Yes" button

```
[Avatar stack: 5-7 photos]
Join 2,847 consultants who already have the playbook

Ready to stop guessing and start growing?

[Yes, Send Me the Playbook]

Still have questions? Email: ofer@base44.ai
```

### 8. FOOTER
**Job:** Professional legitimacy

**Components:** Logo → Navigation → Legal → Social

```
[Logo]

Resources    Company      Connect
Playbook     About        Twitter
Templates    Contact      LinkedIn

© 2024 Base44. All rights reserved.
Privacy | Terms
```

---

## SLIDE Alignment

| SLIDE | Section | Purpose |
|-------|---------|---------|
| **S** - Situation | HERO | Headline sets the scene |
| **L** - Limitation | PROBLEM-AGITATE | Names the obstacle |
| **I** - Implication | PROBLEM-AGITATE | Agitation - cost of inaction |
| **D** - Destination | TRANSFORMATION | The after picture |
| **E** - Evidence | SOCIAL PROOF + VALUE STACK | Proof it works |

---

## Section Rules

### Every Section Must Have:
- A specific claim traced back to the Copy Brief proof points
- One clear job (not multiple objectives)
- Transition to next section (flow)
- Real numbers from Step 3, not invented ones

### Hero Section:
- H1 = Hormozi formula hook from Step 4 (user-approved)
- H2 = what it does + how, plain language
- CTA = benefit-focused, attacks primary audience pain
- Trust = real numbers from proof points only

### Problem-Agitate:
- Pain points from Audience Lock (Step 1), not invented
- Competitor complaints from Wedge Research (Step 2)
- Agitation uses real cost/time numbers
- Optional: comparison table (us vs alternative)

### Value Stack:
- Features map to SO WHAT benefits
- Each feature grounded in Slack evidence
- For free products: show capability value, not dollar amounts
- For paid: 4 tiers, total 3x+ price

### Social Proof:
- Only real quotes from Proof Points (Step 3)
- Name + role (or anonymized "Head of Product at fintech")
- Specific result per quote
- If not enough real quotes: use metric proof instead (700 signups, 150 sessions)

### Transformation:
- Timeline realistic for THIS feature
- Each stage references something a real user did
- End with aspirational but grounded outcome

---

## Output Format

When creating landing pages, output:

```
## [Page Title]

### SECTION 1: HERO
[Eyebrow]
[Headline]
[Subheadline]
[Primary CTA]
[Trust Signals]

### SECTION 2: SUCCESS
[Confirmation]
[Deliverable list]

### SECTION 3: PROBLEM-AGITATE
[3 pain points]
[Agitation]
[Transition]

### SECTION 4: VALUE STACK
[Tier 1-4 with values]
[Total value]
[Your price]
[CTA]

### SECTION 5: SOCIAL PROOF
[Header]
[Testimonial 1 + result]
[Testimonial 2 + result]
[Testimonial 3 + result]

### SECTION 6: TRANSFORMATION
[Week 1]
[Month 1]
[Month 3]
[Year 1]

### SECTION 7: SECONDARY CTA
[Avatar stack]
[Question]
[Yes CTA]
[Objection handler]

### SECTION 8: FOOTER
[Standard footer]
```

---

## Quality Checklist

Before finalizing:

**Copy Brief (Phase 1):**
- [ ] Audience Lock complete (2-4 segments with evidence)
- [ ] Competitor Wedge researched (or explicitly marked "no competitor")
- [ ] Proof Points gathered (numbers, quotes, external)
- [ ] H1 generated with Hormozi formula and user-approved
- [ ] Section Copy Brief written for all 8 sections

**Structure (Phase 2):**
- [ ] All 8 sections present in order
- [ ] Each section does ONE job
- [ ] Every claim traces to a Copy Brief proof point

**Copy:**
- [ ] Applied SO WHAT chain to features
- [ ] Zero brand-voice kill list words (check RULES.md)
- [ ] No em dashes, no arrows, no AI filler
- [ ] Specific numbers from real data, not invented
- [ ] H1 passes Hormozi formula validation
- [ ] Passes Maor Test

**Conversion:**
- [ ] Trust signals use real proof points
- [ ] Secondary CTA handles biggest objection
- [ ] Comparison table attacks competitor wedge (if applicable)
- [ ] FAQ uses real questions from Slack/support

---

## Full Example: AI Consulting Lead Magnet

```
### SECTION 1: HERO
For Business Leaders Drowning in AI Hype

Get the 5-Question Framework That Separates
AI That Works From AI That Wastes Money

I've evaluated 127 AI tools in 2024.
Only 23 passed these 5 questions.

[Get the Framework Free]

Trusted by 2,400+ executives at Fortune 500 companies


### SECTION 2: SUCCESS
✓ Check your inbox—the framework is on its way!

In 2 minutes, you'll receive:
□ The 5-Question AI Evaluation Framework (PDF)
□ 3 Red Flags That Predict AI Project Failure
□ The "Should We Build or Buy?" Decision Tree


### SECTION 3: PROBLEM-AGITATE
You've probably noticed:

❌ Every vendor claims their AI is "game-changing"
❌ Your team can't agree on what AI to prioritize
❌ You've wasted budget on tools nobody uses

The cost? Average company wastes $147,000 on AI tools
abandoned within 90 days.

That's not a tech problem. It's an evaluation problem.


### SECTION 4: VALUE STACK
Here's what you're getting:

┌─────────────────────────────────────┐
│ 5-Question Evaluation Framework    │
│ Used for $4.2M in AI decisions     │
│                        Value: $497 │
├─────────────────────────────────────┤
│ 3 Red Flags Cheatsheet            │
│ Spot failures before they happen   │
│                        Value: $197 │
├─────────────────────────────────────┤
│ Build vs. Buy Decision Tree       │
│ End internal debates in 10 min     │
│                        Value: $147 │
└─────────────────────────────────────┘
               Total Value: $841

          Your Investment: FREE

[Get Instant Access]


### SECTION 5: SOCIAL PROOF
What executives are saying:

"Saved us from a $200K mistake. We were about to sign
with an AI vendor that failed question #3."
— Jennifer Martinez, CTO at ScaleUp Inc
   Result: $200K saved

"Finally, a framework that cuts through the BS."
— David Park, VP Operations at TechFlow
   Result: 3 AI projects launched successfully

"Question #4 alone changed how we evaluate everything."
— Sarah Williams, Director of Innovation
   Result: 40% faster decisions


### SECTION 6: TRANSFORMATION
Here's what happens when you use this:

DAY 1: Instant Clarity
→ Know exactly what questions to ask
→ Feel confident in AI conversations

WEEK 1: Better Decisions
→ Evaluate tools in 15 minutes, not 15 meetings
→ Kill bad ideas before they waste resources

MONTH 1: Measurable Results
→ Only invest in AI that actually works
→ Become the "AI decision maker"


### SECTION 7: SECONDARY CTA
[7 executive headshots]
Join 2,400+ executives who make better AI decisions

Ready to stop guessing and start evaluating?

[Yes, Send Me the Framework]

Still skeptical? Takes 2 minutes to read.
Could save you $147K. Worth a shot?


### SECTION 8: FOOTER
[Base44 Logo]

Resources     Company      Connect
Framework     About        LinkedIn
Newsletter    Contact      Twitter

© 2024 Base44. Making AI make sense.
Privacy | Terms
```

---

## Brand Data Loading (Base44)

Before creating landing page content, load brand context:

**Required reads:**
- `Read: brands/base44/tone-of-voice.md` - Voice guidelines and vocabulary
- `Read: brands/base44/brand.json` - Colors, fonts, typography scale, spacing, gradients
- `Read: brands/base44/design-system.md` - HTML/CSS/React component templates (headers, heroes, cards, CTAs, FAQ, footer)
- `Read: brands/base44/brand-system.md` - Design philosophy and positioning

**For social proof sections:**
- `Read: brands/base44/facts/metrics.md` - Stats ($80M acquisition, 400K+ builders, 10M apps)
- `Read: brands/base44/case-studies/index.md` - Success stories for transformation section
- `Read: brands/base44/feedback/testimonials.md` - Quotable builder quotes

**For value stack and CTAs:**
- `Read: brands/base44/content-library/value-props.md` - Key differentiators
- `Read: brands/base44/content-library/hooks.md` - Proven attention openers
- `Read: brands/base44/content-library/ctas.md` - Call-to-action templates

---

## Pipeline: Copy Brief to Live Page

```
PHASE 1: Copy Brief (this skill)
  Step 1: Audience Lock (Slack MCP + user input)
  Step 2: Competitor Wedge (Tavily/WebSearch)
  Step 3: Proof Points (Slack + metrics + external)
  Step 4: Hook Generation (Hormozi formula)
  Step 5: Section Copy Brief
     ↓
PHASE 2: Section Copy (this skill)
  Write 8 sections using Copy Brief as contract
  Run brand-guardian (score >= 7/10)
     ↓
PHASE 3: HTML Generation (base44-landing-page skill)
  Load design-system.md + brand.json
  Generate self-contained HTML
  Deploy via Base44 CLI
```

**HARD RULE:** Phase 3 cannot start until Phase 1 and 2 are complete. The `base44-landing-page` skill expects finished copy as input.

## Integration

**Depends on:** brand-voice (tone), direct-response-copy (THE SLIDE), hook-rules (Hormozi formula)
**Used by:** `base44-landing-page` (HTML generation), campaign launches, product launches
**Layer:** Copy strategy + page architecture. Runs BEFORE design/HTML.
**Data sources:** Slack MCP (channels, threads), Tavily (competitor research), Product App API (metrics)

---

*Copy Brief System based on real-session patterns. 8-Section Framework based on James Dickerson / The Boring Marketer.*
