# Phase 1: Copy Brief (MANDATORY)

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
