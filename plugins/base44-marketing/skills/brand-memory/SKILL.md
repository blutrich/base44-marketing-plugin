---
name: brand-memory
description: |
  Manages brand context and learning across sessions. Persists patterns, feedback, and improvements.

  Triggers on: memory, learning, patterns, feedback, what worked, what didn't, brand context.
---

# Brand Memory System

Persistent memory for marketing content creation. Tracks what works, what doesn't, and patterns learned.

---

## Auto-Initialization (MANDATORY AT SESSION START)

**IRON LAW:** Memory files MUST exist before any content work. If they don't exist, CREATE them.

### Initialization Sequence

```bash
# Step 1: Ensure directory exists
Bash(command="mkdir -p ~/.claude/marketing")

# Step 2: Check which files exist
Bash(command="ls -la ~/.claude/marketing/ 2>/dev/null || echo 'Directory empty or missing'")
```

### Step 3: Create Missing Files

For EACH file that doesn't exist, create it with the template below:

```
# If activeContext.md missing:
Write(file_path="~/.claude/marketing/activeContext.md", content="[ACTIVE_CONTEXT_TEMPLATE]")

# If patterns.md missing:
Write(file_path="~/.claude/marketing/patterns.md", content="[PATTERNS_TEMPLATE]")

# If feedback.md missing:
Write(file_path="~/.claude/marketing/feedback.md", content="[FEEDBACK_TEMPLATE]")
```

### Step 4: Verify Creation

```
Read(file_path="~/.claude/marketing/activeContext.md")
Read(file_path="~/.claude/marketing/patterns.md")
Read(file_path="~/.claude/marketing/feedback.md")
```

**If any read fails after creation: STOP and report error.**

---

## Guaranteed Anchors

These headers MUST exist in each file. If missing, the file is corrupted.

### activeContext.md Anchors
| Anchor | Required | Purpose |
|--------|----------|---------|
| `## Current Focus` | YES | Current campaign/priority |
| `## Recent Content` | YES | Last 5 content pieces |
| `## Key Messages` | YES | Current messaging priorities |
| `## Numbers to Use` | YES | Current stats (ARR, users, etc.) |
| `## References` | YES | Links to plans, briefs |
| `## Last Updated` | YES | Timestamp for staleness check |

### patterns.md Anchors
| Anchor | Required | Purpose |
|--------|----------|---------|
| `## Phrases That Work` | YES | Proven successful phrases |
| `## Phrases to AVOID` | YES | Anti-patterns learned |
| `## Channel Patterns` | YES | Platform-specific rules |
| `## Content That Got Approved` | YES | Success log |
| `## Content That Got Rejected` | YES | Failure log |
| `## Pattern Tracking` | YES | Count-based pattern detection |
| `## Last Updated` | YES | Timestamp |

### feedback.md Anchors
| Anchor | Required | Purpose |
|--------|----------|---------|
| `## Awaiting Review` | YES | Pending content |
| `## Recent Feedback` | YES | Logged feedback |
| `## Debug Attempts` | YES | Failed verification tracking |
| `## Last Updated` | YES | Timestamp |

---

## Auto-Heal Protocol

If a guaranteed anchor is missing, recreate the file from template:

```
# Check for anchors
Read(file_path="~/.claude/marketing/activeContext.md")

# If "## Current Focus" NOT found:
#   → File is corrupted
#   → Backup existing content
#   → Recreate from template
#   → Append any recoverable content

Write(file_path="~/.claude/marketing/activeContext.md", content="[ACTIVE_CONTEXT_TEMPLATE]")
```

### Heal Decision Tree

```
Read file → Check anchors → All present?
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   YES                  NO
                    │                   │
                    ▼                   ▼
              Continue            Auto-Heal:
                                  1. Log missing anchors
                                  2. Recreate from template
                                  3. Log recovery to feedback.md
                                  4. Verify anchors present
```

---

## Team Contributors

| Name | Role | Focus Areas |
|------|------|-------------|
| Lora | Content Manager | Voice, social posts, product updates |
| Tiffany | Product Marketing | Feature announcements, positioning |
| Maor | Founder | Overall voice, final approval |

**How to add feedback:** Edit the patterns.md or feedback.md files, or say "add to memory: [feedback]" in conversation.

## Memory Files (Two Locations)

### Plugin Data (updated via git, shared with team)
```
brands/base44/
├── tone-of-voice.md    # Brand guidelines (plugin update overwrites)
├── learning-log.md     # MASTER learning log (team contributions via git)
└── templates/          # Channel templates
```

### User Data (local, NEVER overwritten by updates)
```
~/.claude/marketing/
├── activeContext.md    # Current campaign/focus
├── patterns.md         # Session patterns
├── feedback.md         # Pending feedback
└── local-learnings.md  # User's local additions
```

## Update Behavior

| On `/plugin update` | What Happens |
|---------------------|--------------|
| `skills/*` | Overwritten with latest |
| `agents/*` | Overwritten with latest |
| `brands/base44/learning-log.md` | Overwritten (team version from git) |
| `~/.claude/marketing/*` | **PRESERVED** (user's local data) |

**To contribute learnings back to team:** Edit `learning-log.md` in git repo and push

## File Templates (With Guaranteed Anchors)

### ACTIVE_CONTEXT_TEMPLATE (activeContext.md)
```markdown
# Marketing Active Context

## Current Focus
- Campaign: [none]
- Channel: [none]
- Deadline: [none]
- Priority: [normal]

## Recent Content
| Date | Type | Channel | Status | Score |
|------|------|---------|--------|-------|
| [DATE] | [type] | [channel] | [status] | [X/10] |

## Key Messages
- [Add current messaging priorities here]

## Numbers to Use
| Metric | Value | Last Updated |
|--------|-------|--------------|
| ARR | $X | [date] |
| Users/Builders | X | [date] |
| Apps shipped | X | [date] |

## References
- Plan: [path or N/A]
- Brief: [path or N/A]
- Learning Log: brands/base44/learning-log.md

## Last Updated
[timestamp]
```

### PATTERNS_TEMPLATE (patterns.md)
```markdown
# Learned Patterns

## Phrases That Work
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| "Less guessing. More shipping." | Punchy, parallel structure | Tiffany/Debug Mode | 5 |
| "Another feature just dropped:" | Clean announcement format | LinkedIn analysis | 4 |
| "Happy [action]! [emoji]" | Friendly sign-off | LinkedIn | 3 |

## Phrases to AVOID
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| "We're excited to announce" | Corporate, not builder-voice | Brand rules | - |
| "users" / "customers" | Not builder-centric | RULES.md | - |
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
| Example pattern | do/dont | voice | [COUNT: 0] | watching |

## Last Updated
[timestamp]
```

### FEEDBACK_TEMPLATE (feedback.md)
```markdown
# Pending Feedback

## Awaiting Review
| Date | Content | Channel | Status | Assigned |
|------|---------|---------|--------|----------|

## Recent Feedback
### [DATE] - [CHANNEL]
**Original:**
> [content]

**Feedback:**
> [what was said]

**Action:**
- [ ] Update patterns.md
- [ ] Update RULES.md if pattern repeats 3+ times

**Pattern Count:** [COUNT: 1]

## Debug Attempts
| Date | Content | Issue | Attempts | Resolution |
|------|---------|-------|----------|------------|
| [DATE] | [desc] | [issue] | [DEBUG-N] | [fixed/escalated] |

## Last Updated
[timestamp]
```

## Memory Operations (CC10X PATTERN)

### Load Memory (Start of Session)
```
Bash(command="mkdir -p .claude/marketing")
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
# If any file errors → Create with template above
```

### Read-Edit-Verify Cycle (MANDATORY)

**Every edit must follow this pattern:**
```
1. Read(file_path=".claude/marketing/{file}.md")      # Load current state
2. Edit(file_path=".claude/marketing/{file}.md", ...) # Make change
3. Read(file_path=".claude/marketing/{file}.md")      # VERIFY applied
```

**NEVER skip step 3.** Edits can fail silently.

### Stable Anchors (Use THESE headers for Edit)

| File | Valid Anchors |
|------|---------------|
| activeContext.md | `## Current Focus`, `## Recent Content`, `## Key Messages`, `## Last Updated` |
| patterns.md | `## Phrases That Work`, `## Phrases to AVOID`, `## Content That Got Approved` |
| feedback.md | `## Awaiting Review`, `## Recent Feedback`, `## Last Updated` |

### Update Memory (After Content Creation)
```
# Step 1: Read current state
Read(file_path=".claude/marketing/activeContext.md")

# Step 2: Edit using stable anchor
Edit(file_path=".claude/marketing/activeContext.md",
     old_string="## Recent Content\n- [DATE]",
     new_string="## Recent Content\n- [TODAY]: [type] - [status]\n- [DATE]")

# Step 3: Verify edit applied
Read(file_path=".claude/marketing/activeContext.md")
```

### Log Learning (After Feedback)
```
# Local patterns
Edit(file_path=".claude/marketing/patterns.md", ...)
Read(file_path=".claude/marketing/patterns.md")  # Verify

# Permanent team record
Edit(file_path="brands/base44/learning-log.md", ...)
Read(file_path="brands/base44/learning-log.md")  # Verify
```

## Self-Learning Protocol

When feedback is received:

```
IF feedback == "approved":
    → Log to patterns.md "Content That Got Approved"
    → Extract winning elements

IF feedback == "rejected" OR "needs revision":
    → Log to patterns.md "Content That Got Rejected"
    → Log to brands/base44/learning-log.md (permanent)
    → Identify pattern
    → IF pattern repeats 3+ times:
        → Suggest AGENTS.md update
```

---

## The Learning Loop

```
     ┌──────────────┐
     │   GENERATE   │ ←───────────────────────────────────────────┐
     │   Content    │                                             │
     └──────┬───────┘                                             │
            │                                                     │
            ▼                                                     │
     ┌──────────────┐                                             │
     │   REVIEW     │                                             │
     │   + Score    │                                             │
     └──────┬───────┘                                             │
            │                                                     │
            ▼                                                     │
     ┌──────────────┐     ┌──────────────┐                        │
     │   FEEDBACK   │────▶│   CAPTURE    │                        │
     │   (Team)     │     │   What + Why │                        │
     └──────────────┘     └──────┬───────┘                        │
                                 │                                │
                                 ▼                                │
                          ┌──────────────┐                        │
                          │   PATTERN    │                        │
                          │   DETECT     │                        │
                          └──────┬───────┘                        │
                                 │                                │
                                 ▼                                │
                          ┌──────────────┐     ┌──────────────┐   │
                          │   RULES      │────▶│   UPDATE     │───┘
                          │   UPDATE     │     │   AI PROMPTS │
                          └──────────────┘     └──────────────┘
```

---

## Feedback Types

### 1. Approval Feedback
When content is approved, rejected, or edited.

| Action | What It Teaches |
|--------|-----------------|
| ✅ Approved as-is | This pattern works. Reinforce it. |
| 📝 Approved + edit | Close, but needed adjustment. Learn the diff. |
| 🔄 Regenerate | Missed the mark. Note what was wrong. |
| ❌ Rejected | Significant issue. Capture reason as anti-pattern. |

### 2. Edit-Based Feedback
When someone edits generated content, we learn from the diff.

```
ORIGINAL (AI Generated):
"We're excited to announce our new OAuth feature..."

EDITED (Human):
"Just shipped: OAuth 2.0 🔐 Connect to any service in 5 minutes..."

LEARNED:
- "We're excited to announce" → "Just shipped:"
- Add specific time ("5 minutes")
- Add relevant emoji
- Lead with benefit, not announcement
```

### 3. Comment Feedback Categories

| Category | Examples |
|----------|----------|
| Voice | "Too corporate", "Not builder-y enough" |
| Structure | "Hook too weak", "Needs better CTA" |
| Hook | "Boring opening", "Doesn't stop scroll" |
| CTA | "Too pushy", "Not clear enough" |
| Emoji | "Too many", "Wrong placement" |
| Length | "Too long", "Needs more detail" |
| Accuracy | "Wrong number", "Outdated info" |
| Vocabulary | "Don't say X, say Y" |

### 4. Performance Feedback
Learn from what actually works with the audience.

```
POST PUBLISHED → 7 DAYS LATER → PERFORMANCE ANALYSIS

High Performers (top 20% engagement):
- What hooks were used?
- What structure?
- What time posted?
- What topics?

Low Performers (bottom 20%):
- What patterns to avoid?
- What didn't resonate?
```

---

## Pattern Detection

### Confidence Levels & Promotion

```
OCCURRENCE    CONFIDENCE    EFFECT ON AI
───────────────────────────────────────────────────────────────

1x            LOW           Logged, but not used yet
              ░░░░░░░░░░

2x            LOW           Still observing
              ██░░░░░░░░

3x            MEDIUM        Soft suggestion in prompts
              █████░░░░░    "Consider avoiding X"

5x            HIGH          Strong guidance in prompts
              ████████░░    "Don't use X, use Y instead"

5x + Manual   RULE          Added to AGENTS.md
Approval      ██████████    Hard requirement, checked by Brand Guardian
```

### Pattern Types

| Type | Meaning | Action |
|------|---------|--------|
| `do` | Positive pattern to repeat | Include in generation |
| `dont` | Anti-pattern to avoid | Check & flag |
| `prefer` | Better alternative exists | Suggest replacement |
| `avoid` | Weak pattern, not banned | Lower priority |

### Pattern Categories

- `voice` - Tone, personality
- `structure` - Post organization
- `hook` - Opening lines
- `cta` - Calls to action
- `emoji` - Emoji usage
- `length` - Content length
- `vocabulary` - Word choices
- `timing` - When to post
- `channel` - Platform-specific

---

## Pattern Tracking Format

Add to `patterns.md`:

```markdown
## Detected Patterns

### HIGH CONFIDENCE (5+ occurrences) - Promote to Rules
| Pattern | Type | Category | Occurrences | Action |
|---------|------|----------|-------------|--------|
| Say "builders" not "users" | prefer | vocabulary | 7 | RULE |
| Start with "Just shipped:" | do | hook | 5 | Suggest |

### MEDIUM CONFIDENCE (3-4 occurrences) - Monitor
| Pattern | Type | Category | Occurrences | Source |
|---------|------|----------|-------------|--------|
| Avoid "leverage" | avoid | vocabulary | 3 | Edits |
| Keep LinkedIn under 1000 chars | prefer | length | 4 | Performance |

### LOW CONFIDENCE (1-2 occurrences) - Watch
| Pattern | Type | Category | Occurrences | Source |
|---------|------|----------|-------------|--------|
| Use question hooks for engagement | do | hook | 2 | Comment |
```

---

## Promotion to Rules

When a pattern reaches HIGH confidence (5+ occurrences):

1. **Flag for review:**
   ```
   Edit(file_path=".claude/marketing/patterns.md", ...)
   # Add [READY FOR PROMOTION] tag
   ```

2. **After manual approval, add to AGENTS.md:**
   ```
   Edit(file_path="brands/base44/AGENTS.md", ...)
   # Add under ## NEVER DO or ## ALWAYS DO
   ```

3. **Log the promotion:**
   ```
   Edit(file_path="brands/base44/learning-log.md", ...)
   # Record: Pattern promoted to rule on [DATE]
   ```

---

## Improvement Tracking

Track system improvement over time:

```markdown
## Improvement Metrics

### First-Pass Approval Rate
| Week | Rate | Trend |
|------|------|-------|
| Week 1 | 45% | - |
| Week 2 | 58% | ↑ |
| Week 3 | 71% | ↑ |
| Week 4 | 82% | ↑ |

### Brand Guardian Average Score
| Week | Score | Trend |
|------|-------|-------|
| Week 1 | 6.2 | - |
| Week 2 | 7.1 | ↑ |
| Week 3 | 7.8 | ↑ |
| Week 4 | 8.1 | ↑ |

### Patterns Learned This Month
- Total feedback received: 47
- Patterns detected: 12
- Rules created: 3
```

---

## Auto-Heal Missing Sections

If required sections missing:
```
Edit(file_path=".claude/marketing/activeContext.md",
     old_string="## Last Updated",
     new_string="## References\n- Plan: N/A\n\n## Last Updated")
```

---

## Automated Pattern Promotion

### The Count System

Every time feedback is logged, increment the pattern count:

```markdown
## Pattern Tracking (in patterns.md)
| Pattern | Type | Category | Count | Status |
|---------|------|----------|-------|--------|
| "Don't use arrows" | dont | format | [COUNT: 3] | PROMOTE |
```

### Promotion Thresholds

| Count | Status | Action |
|-------|--------|--------|
| 1 | Logged | Added to patterns.md, watching |
| 2 | **PROMOTE** | Auto-add to RULES.md under NEVER/ALWAYS |
| 3 | Rule | Now enforced by brand-guardian |
| 5+ | TOV Review | Flag for tone-of-voice.md update |

### Promotion Protocol

When pattern count reaches 2:

```
# Step 1: Read current RULES.md
Read(file_path="brands/base44/RULES.md")

# Step 2: Add new rule
Edit(file_path="brands/base44/RULES.md",
     old_string="## NEVER DO",
     new_string="## NEVER DO\n- [New pattern from patterns.md]")

# Step 3: Verify
Read(file_path="brands/base44/RULES.md")

# Step 4: Update patterns.md status
Edit(file_path=".claude/marketing/patterns.md",
     old_string="| [Pattern] | dont | [cat] | [COUNT: 2] | PROMOTE |",
     new_string="| [Pattern] | dont | [cat] | [COUNT: 2] | RULE |")

# Step 5: Log promotion
Edit(file_path="brands/base44/learning-log.md",
     old_string="## Patterns Discovered",
     new_string="## Patterns Discovered\n\n### [DATE] - PATTERN PROMOTED TO RULE\n- Pattern: [description]\n- Count: 2\n- Added to: RULES.md\n")
```

### Increment Pattern Count

When same feedback appears again:

```
# Find existing pattern
Read(file_path=".claude/marketing/patterns.md")

# Increment count
Edit(file_path=".claude/marketing/patterns.md",
     old_string="| [Pattern] | [type] | [cat] | [COUNT: 1] |",
     new_string="| [Pattern] | [type] | [cat] | [COUNT: 2] |")

# Check if promotion threshold reached
# If COUNT: 2 → trigger promotion protocol
```

---

## Debug Attempt Tracking

### Format

```
[DEBUG-N]: [Issue] → [Attempted Fix] → [Result]
```

### Track in feedback.md

```markdown
## Debug Attempts
| Date | Content | Issue | Attempts | Resolution |
|------|---------|-------|----------|------------|
| 2026-02-04 | LinkedIn post | Arrow bullets | [DEBUG-1] | Fixed |
| 2026-02-04 | Email | Too corporate | [DEBUG-3] | Escalated |
```

### Escalation Rules

| DEBUG Level | Action |
|-------------|--------|
| DEBUG-1 | Normal fix, continue |
| DEBUG-2 | Log pattern, continue |
| DEBUG-3+ | Log to learning-log.md as pattern |
| DEBUG-5+ | Flag for human review |

### Learning from Debug

After DEBUG-3+:
```
Edit(file_path="brands/base44/learning-log.md",
     old_string="## Feedback Log",
     new_string="## Feedback Log\n\n### [DATE] - DEBUG ESCALATION\n**Issue:** [what kept failing]\n**Attempts:** [DEBUG-N]\n**Root Cause:** [identified pattern]\n**Resolution:** [how it was finally fixed]\n**New Rule:** [if any]\n")
```

---

## Session Initialization Checklist

At START of every marketing session:

```
- [ ] mkdir ~/.claude/marketing/
- [ ] Check activeContext.md exists → create if missing
- [ ] Check patterns.md exists → create if missing
- [ ] Check feedback.md exists → create if missing
- [ ] Verify all guaranteed anchors present
- [ ] Auto-heal any corrupted files
- [ ] Load brand context (tone-of-voice.md, RULES.md, learning-log.md)
- [ ] Check for pending promotions (patterns at COUNT: 2)
```

**Only after ALL checks pass: Begin content work.**
