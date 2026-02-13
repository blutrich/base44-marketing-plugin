# Agent Teams — Practical Examples

## Example 1: Feature Launch Campaign

**User prompt:**
"Plan a multi-channel campaign for our new Debug Mode feature. Cover LinkedIn, X, email, and a blog post."

**What happens:**
1. Router detects CAMPAIGN + 4 channels → team escalation
2. Lead reads `teams/campaign-launch.md` template
3. Lead creates campaign brief in `output/campaign-brief.md`
4. Lead spawns 4 teammates + 1 brand guardian
5. Teammates work in parallel (~2-3 min each vs ~10 min sequential)
6. Guardian reviews each piece as teammates complete
7. Lead synthesizes final campaign package

**Estimated token savings:** None — teams use MORE tokens (5 context windows).
**Estimated time savings:** 3-5x faster (parallel execution).

## Example 2: Weekly Content Sprint

**User prompt:**
"Create this week's content: 3 LinkedIn posts (personal story, how-to, social proof), 2 tweets, and 1 email."

**What happens:**
1. Router detects "week" + multiple content types → sprint escalation
2. Lead reads `teams/content-sprint.md` template
3. Lead assigns: Teammate 1 gets 3 LinkedIn posts, Teammate 2 gets 2 tweets + 1 email
4. Guardian reviews as content flows in
5. Total: 6 pieces in ~5 min vs ~15 min sequential

## Example 3: A/B Hook Testing

**User prompt:**
"Create 2 versions of a LinkedIn post about our fundraise — one with a result-first hook, one with a builder spotlight."

**What happens:**
1. Router detects "2 versions" → A/B escalation
2. Each variant writer gets the same brief but different hook style
3. Guardian scores both
4. Lead recommends the winner with reasoning

## Example 4: Brand Consistency Audit

**User prompt:**
"Review all our recent LinkedIn posts for brand consistency."

**What happens:**
1. Router detects "review all" → audit escalation
2. Three reviewers analyze from different angles (voice, format, psychology)
3. Lead produces consolidated report with specific fixes
