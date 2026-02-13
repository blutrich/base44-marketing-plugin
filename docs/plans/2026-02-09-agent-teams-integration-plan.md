# Agent Teams Integration Plan for base44-marketing-plugin

> **For Claude:** This plan defines how to leverage Claude Code Agent Teams for parallel marketing content orchestration.
> **Status:** DRAFT - Awaiting approval

**Goal:** Integrate Claude Code Agent Teams into the marketing plugin to enable parallel multi-channel content generation, collaborative review, and campaign orchestration — replacing the current sequential agent chain with parallel teammates where it adds value.

**Key Insight:** Agent Teams are NOT a replacement for the existing router → agent → brand-guardian pattern. They are an **upgrade path for CAMPAIGN workflows** and a **new capability for collaborative review**. Single-channel content (LinkedIn post, tweet, blog) should stay sequential — teams add overhead without benefit there.

---

## When Agent Teams vs Single Agent

| Scenario | Use Agent Teams? | Why |
|----------|-----------------|-----|
| Single LinkedIn post | NO | One specialist + guardian is faster and cheaper |
| Single tweet/thread | NO | Same — no parallelism benefit |
| Multi-channel campaign launch | **YES** | 4-6 specialists work in parallel, 3-5x faster |
| Content sprint (batch of posts) | **YES** | Each teammate handles a different piece |
| Brand audit / content review | **YES** | Multiple reviewers catch different issues |
| A/B testing variants | **YES** | Teammates generate competing versions |
| Repurpose across platforms | **YES** | Each teammate adapts for one platform |

---

## Phase 1: Foundation — Team Templates & Configuration

### Task 1: Enable Agent Teams in Plugin Settings

**Files:**
- Edit: `plugins/base44-marketing/.claude-plugin/settings.json`
- Edit: `plugins/base44-marketing/CLAUDE.md`

**Changes:**

Add to `settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Add to `CLAUDE.md` a new section:

```markdown
## Agent Teams (Multi-Channel Orchestration)

When a request requires **3+ channels or parallel content**, use Agent Teams instead of sequential chains.

### Team Decision Rule
```
IF workflow == CAMPAIGN AND channels >= 3 → SPAWN TEAM
IF request contains "sprint" or "batch" → SPAWN TEAM
IF request contains "A/B" or "variants" → SPAWN TEAM
ELSE → Use single agent chain (existing pattern)
```
```

---

### Task 2: Create Team Template Definitions

**Files:**
- Create: `plugins/base44-marketing/teams/campaign-launch.md`
- Create: `plugins/base44-marketing/teams/content-sprint.md`
- Create: `plugins/base44-marketing/teams/brand-audit.md`
- Create: `plugins/base44-marketing/teams/ab-testing.md`

These are natural-language templates the lead reads before spawning a team. They define the structure, roles, and file ownership.

**`teams/campaign-launch.md`:**
```markdown
# Campaign Launch Team Template

## When to Use
Multi-channel product launch or feature announcement requiring 3+ content pieces.

## Team Structure
| Role | Agent Source | Model | Owns Files |
|------|------------|-------|------------|
| Lead (you) | planner | Opus | Campaign brief, final synthesis |
| Teammate 1 | linkedin-specialist | Sonnet | output/linkedin/ |
| Teammate 2 | x-specialist | Sonnet | output/x/ |
| Teammate 3 | copywriter (email) | Sonnet | output/email/ |
| Teammate 4 | seo-specialist | Sonnet | output/blog/ |
| Teammate 5 | brand-guardian | Haiku | Reviews all output/ files |

## Spawn Prompts
Each teammate gets:
1. Campaign brief (from lead's planning phase)
2. Brand context (AGENTS.md + tone-of-voice.md + RULES.md)
3. Channel-specific skill instructions
4. Output directory assignment (prevents file conflicts)

## Task Breakdown Pattern
1. Lead creates campaign brief (2-3 tasks)
2. Specialists generate content in parallel (1 task each, own directory)
3. Brand guardian reviews all outputs sequentially (1 task per piece)
4. Lead synthesizes final campaign package

## File Ownership (CRITICAL — Prevents Conflicts)
```
output/
├── campaign-brief.md          ← Lead only
├── linkedin/
│   ├── post-1.md              ← linkedin-specialist only
│   └── carousel-notes.md      ← linkedin-specialist only
├── x/
│   ├── thread.md              ← x-specialist only
│   └── standalone-tweets.md   ← x-specialist only
├── email/
│   ├── announcement.md        ← copywriter only
│   └── nurture-sequence.md    ← copywriter only
├── blog/
│   └── launch-post.md         ← seo-specialist only
└── reviews/
    └── guardian-report.md      ← brand-guardian only
```
```

**`teams/content-sprint.md`:**
```markdown
# Content Sprint Team Template

## When to Use
Batch content generation — e.g., "Create 5 LinkedIn posts and 3 tweets for this week."

## Team Structure
| Role | Count | Model | Owns Files |
|------|-------|-------|------------|
| Lead | 1 | Opus | Sprint plan, assignment |
| LinkedIn writers | 1-2 | Sonnet | output/linkedin/post-N.md |
| X writers | 1 | Sonnet | output/x/tweet-N.md |
| Brand guardian | 1 | Haiku | output/reviews/ |

## Task Sizing
- 3-5 content pieces per teammate (sweet spot)
- Each piece = 1 task in the shared task list
- Guardian reviews after each piece completes (use task dependencies)
```

**`teams/brand-audit.md`:**
```markdown
# Brand Audit Team Template

## When to Use
Review existing content for brand consistency, or audit the plugin's own outputs.

## Team Structure
| Role | Focus | Model |
|------|-------|-------|
| Lead | Coordinate and synthesize | Opus |
| Voice reviewer | Tone, word choice, banned phrases | Sonnet |
| Format reviewer | Structure, hooks, CTAs, platform specs | Sonnet |
| Psychology reviewer | Persuasion principles, bias usage | Sonnet |

## Process
1. All reviewers read the same content
2. Each applies their lens independently
3. Lead collects findings, resolves conflicts, produces final report
```

**`teams/ab-testing.md`:**
```markdown
# A/B Testing Team Template

## When to Use
Generate competing content variants for the same channel to test messaging.

## Team Structure
| Role | Approach | Model |
|------|----------|-------|
| Lead | Define test hypothesis, judge winner | Opus |
| Variant A writer | Approach A (e.g., result-first hook) | Sonnet |
| Variant B writer | Approach B (e.g., builder spotlight hook) | Sonnet |
| Brand guardian | Score both variants | Haiku |

## File Ownership
- Variant A: output/variant-a/
- Variant B: output/variant-b/
- Guardian: output/reviews/
```

---

### Task 3: Create Quality Gate Hooks

**Files:**
- Create: `plugins/base44-marketing/hooks/teammate-idle.sh`
- Create: `plugins/base44-marketing/hooks/task-completed.sh`
- Edit: `plugins/base44-marketing/.claude-plugin/hooks.json`

**Purpose:** Enforce brand-guardian review before marking team tasks complete.

**`hooks/task-completed.sh`:**
```bash
#!/bin/bash
# TaskCompleted hook — ensures brand-guardian has reviewed before completion
# Exit code 2 = reject completion with feedback message

TASK_SUBJECT="$1"
TASK_OWNER="$2"

# Skip if the brand-guardian itself is completing a review task
if [[ "$TASK_OWNER" == *"guardian"* ]] || [[ "$TASK_SUBJECT" == *"review"* ]]; then
  exit 0
fi

# Check if a corresponding review task exists and is completed
REVIEW_TASK="Review: $TASK_SUBJECT"
# If no review exists, reject completion
echo "HOLD: Content must pass brand-guardian review before marking complete. Create a review task for brand-guardian."
exit 2
```

**`hooks/teammate-idle.sh`:**
```bash
#!/bin/bash
# TeammateIdle hook — redirect idle teammates to unclaimed tasks
echo "Check the shared task list for unclaimed tasks before going idle."
exit 2
```

**Update `hooks.json`:**
```json
{
  "hooks": [
    {
      "event": "TaskCompleted",
      "command": "bash hooks/task-completed.sh \"$TASK_SUBJECT\" \"$TASK_OWNER\""
    },
    {
      "event": "TeammateIdle",
      "command": "bash hooks/teammate-idle.sh"
    }
  ]
}
```

---

## Phase 2: Router Integration — Team-Aware Routing

### Task 4: Update marketing-router to Support Team Spawning

**Files:**
- Edit: `plugins/base44-marketing/skills/marketing-router/SKILL.md`

**Changes:** Add a new section after the Decision Tree:

```markdown
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
   - Brand context: Read AGENTS.md, RULES.md, tone-of-voice.md
   - Channel-specific skill: Load the relevant SKILL.md
   - Output directory assignment
   - Instruction to create tasks in the shared task list

### Spawn Prompt Template
```
You are the {ROLE} for a {TEMPLATE} team.

## Brand Context
{Contents of AGENTS.md}
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
```

---

### Task 5: Add Campaign Brief Generator to Planner Agent

**Files:**
- Edit: `plugins/base44-marketing/agents/planner.md`

**Changes:** Add a section for team-aware campaign planning:

```markdown
## Campaign Brief for Agent Teams

When spawning an agent team, first create a campaign brief with:

1. **Objective**: What are we announcing/promoting?
2. **Audience**: Who are we targeting?
3. **Key Messages**: 3-5 core messages (all teammates use these)
4. **Channel Plan**: Which channels, what format each
5. **Tone Guidance**: Any campaign-specific voice adjustments
6. **Timeline**: When content should be ready
7. **Success Metrics**: What does good look like?

Save to `output/campaign-brief.md` before spawning teammates.
All teammates read this brief as their starting context.
```

---

## Phase 3: Memory & Context Sharing

### Task 6: Team Memory Protocol

**Files:**
- Edit: `plugins/base44-marketing/skills/brand-memory/SKILL.md`
- Create: `plugins/base44-marketing/teams/memory-protocol.md`

**Key Design Decision:** Teammates share brand context through files, not messages.

**Why files over messaging:**
- Each teammate loads CLAUDE.md and brand files automatically
- File-based sharing scales without token overhead
- The shared task list handles coordination
- Messages are reserved for targeted feedback (guardian → specialist)

**`teams/memory-protocol.md`:**
```markdown
# Team Memory Protocol

## What Teammates Share (via filesystem)
- Brand context: `brands/base44/` (read-only for all)
- Campaign brief: `output/campaign-brief.md` (read-only, lead writes)
- Marketing memory: `.claude/marketing/` (read-only during team work)

## What Teammates Own (exclusive write)
- Their output directory: `output/{channel}/`
- Their review responses: within their output directory

## Post-Team Memory Update
After the team completes:
1. Lead updates `.claude/marketing/activeContext.md` with campaign results
2. Lead updates `.claude/marketing/patterns.md` with what worked
3. Guardian findings get appended to `brands/base44/learning-log.md`

## Memory Isolation Rule
Teammates MUST NOT write to:
- `.claude/marketing/` (lead's responsibility)
- `brands/base44/` (permanent brand assets)
- Other teammates' `output/{channel}/` directories
- Any plugin source files (`agents/`, `skills/`)
```

---

## Phase 4: Practical Workflow Examples

### Task 7: Document Concrete Use Cases

**Files:**
- Create: `plugins/base44-marketing/teams/examples.md`

**Content:**

```markdown
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
```

---

## Phase 5: Token Cost Management

### Task 8: Add Cost Awareness to Router

**Files:**
- Edit: `plugins/base44-marketing/skills/marketing-router/SKILL.md`

**Add after Team Escalation Rules:**

```markdown
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
```

---

## Phase 6: Integration Testing

### Task 9: Create Team Validation Script

**Files:**
- Create: `plugins/base44-marketing/teams/validate-teams.sh`

**Purpose:** Verify team templates, hooks, and output structure are correct.

```bash
#!/bin/bash
# Validate agent teams configuration

echo "=== Agent Teams Validation ==="

# Check team templates exist
TEMPLATES=("campaign-launch" "content-sprint" "brand-audit" "ab-testing")
for t in "${TEMPLATES[@]}"; do
  if [ -f "teams/$t.md" ]; then
    echo "✅ Template: $t.md"
  else
    echo "❌ Missing template: $t.md"
  fi
done

# Check hooks
if [ -f "hooks/task-completed.sh" ]; then
  echo "✅ Hook: task-completed.sh"
else
  echo "❌ Missing hook: task-completed.sh"
fi

if [ -f "hooks/teammate-idle.sh" ]; then
  echo "✅ Hook: teammate-idle.sh"
else
  echo "❌ Missing hook: teammate-idle.sh"
fi

# Check memory protocol
if [ -f "teams/memory-protocol.md" ]; then
  echo "✅ Memory protocol defined"
else
  echo "❌ Missing memory protocol"
fi

# Check examples
if [ -f "teams/examples.md" ]; then
  echo "✅ Examples documented"
else
  echo "❌ Missing examples"
fi

# Check settings.json has agent teams enabled
if grep -q "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" .claude-plugin/settings.json 2>/dev/null; then
  echo "✅ Agent teams enabled in settings"
else
  echo "⚠️  Agent teams not enabled in settings.json"
fi

echo ""
echo "=== Validation Complete ==="
```

---

## Architecture Decision Records

### ADR-1: Teams for CAMPAIGN Only (Not All Workflows)

**Decision:** Only escalate to Agent Teams for multi-channel campaigns, sprints, audits, and A/B tests. Single-channel content stays sequential.

**Why:**
- Teams add 3-6x token overhead per request
- Single-channel content gains nothing from parallelism
- The existing router → specialist → guardian chain is fast enough for single pieces
- Teams shine when 3+ independent workers can run simultaneously

### ADR-2: File-Based Context Sharing (Not Message Passing)

**Decision:** Teammates share context through the filesystem (brand files, campaign brief, output directories). Reserve inter-agent messaging for targeted feedback only.

**Why:**
- Each teammate auto-loads CLAUDE.md and brand context on spawn
- File-based sharing doesn't consume message tokens
- The shared task list handles coordination
- Messages should be used for specific feedback (e.g., "revise the hook — too generic")

### ADR-3: Strict File Ownership (No Shared Writes)

**Decision:** Each teammate writes exclusively to their assigned `output/{channel}/` directory. No teammate may write to another's directory, brand files, or memory files.

**Why:**
- Agent Teams documentation explicitly warns about file conflicts
- Two teammates editing the same file leads to overwrites
- Directory-based ownership is simple to enforce and verify
- The lead is responsible for final synthesis

### ADR-4: Brand Guardian as Teammate (Not Hook)

**Decision:** Brand guardian runs as a teammate in the team, reviewing content via the shared task list with task dependencies. It does NOT run as a TaskCompleted hook.

**Why:**
- TaskCompleted hooks are shell scripts — they can't run Claude for content review
- A guardian teammate can read content files and provide rich, contextual feedback
- Task dependencies ensure content is reviewed before the campaign is marked complete
- The hook enforces that review tasks exist; the teammate does the actual review

### ADR-5: Delegate Mode for Campaign Lead

**Decision:** When running a campaign team, the lead SHOULD use delegate mode (Shift+Tab) to prevent it from implementing content itself.

**Why:**
- Without delegate mode, the lead tends to start writing content instead of coordinating
- The lead's job is: create brief → spawn teammates → monitor → synthesize
- Teammates own the content creation
- This matches the existing planner agent's role

---

## File Change Summary

| Action | File | Phase |
|--------|------|-------|
| EDIT | `.claude-plugin/settings.json` | 1 |
| EDIT | `CLAUDE.md` | 1 |
| CREATE | `teams/campaign-launch.md` | 1 |
| CREATE | `teams/content-sprint.md` | 1 |
| CREATE | `teams/brand-audit.md` | 1 |
| CREATE | `teams/ab-testing.md` | 1 |
| CREATE | `hooks/task-completed.sh` | 1 |
| CREATE | `hooks/teammate-idle.sh` | 1 |
| EDIT | `.claude-plugin/hooks.json` | 1 |
| EDIT | `skills/marketing-router/SKILL.md` | 2 |
| EDIT | `agents/planner.md` | 2 |
| EDIT | `skills/brand-memory/SKILL.md` | 3 |
| CREATE | `teams/memory-protocol.md` | 3 |
| CREATE | `teams/examples.md` | 4 |
| EDIT | `skills/marketing-router/SKILL.md` (cost section) | 5 |
| CREATE | `teams/validate-teams.sh` | 6 |

**Total:** 10 new files, 6 edited files, 0 deleted files.

---

## Risks

| Risk | P | I | Mitigation |
|------|---|---|------------|
| Agent Teams is experimental — may change/break | 3 | 4 | Templates are markdown (easy to update), no hard code dependencies |
| Token cost surprises on large campaigns | 3 | 3 | Cost guard confirmation before spawning teams |
| File conflicts if teammates ignore ownership | 2 | 4 | Directory-based isolation, hooks enforce review |
| Lead implements instead of delegating | 3 | 2 | Delegate mode instruction, template reminder |
| Guardian bottleneck (reviews are sequential) | 2 | 3 | Guardian uses Haiku (fast), reviews as content flows in |
| Teammates spawn with wrong context | 2 | 3 | Spawn prompt template includes all brand files |

---

## Success Criteria

- [ ] `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` enabled in plugin settings
- [ ] 4 team templates created and validated
- [ ] marketing-router correctly escalates CAMPAIGN + 3 channels to team
- [ ] marketing-router does NOT escalate single-channel requests
- [ ] All teammates write only to their assigned output directories
- [ ] Brand guardian reviews every piece before campaign completion
- [ ] Cost confirmation shown before team spawn
- [ ] `teams/validate-teams.sh` passes all checks

---

## Confidence: 7.5/10

**Why not higher:**
- Agent Teams is experimental with known limitations (no session resumption, shutdown can be slow)
- Hook mechanism for TaskCompleted/TeammateIdle needs real-world testing
- Token cost estimates are rough — actual usage depends on content complexity
- The feature requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` which users must enable

**Why not lower:**
- The plan is additive — it doesn't break any existing functionality
- All changes are markdown files (easy to iterate)
- File ownership pattern is proven (from Agent Teams docs best practices)
- Clear escalation rules prevent unnecessary team spawning
