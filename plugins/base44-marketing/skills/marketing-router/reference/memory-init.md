# Memory Initialization Sequence

Complete 5-step sequence for initializing memory before content work.

---

## Step 1: Create Directory

```
Bash(command="mkdir -p .claude/marketing")
```

---

## Step 2: Check Existing Files

```
Bash(command="ls -la .claude/marketing/ 2>/dev/null || echo 'EMPTY'")
```

---

## Step 3: Create Missing Files

### If activeContext.md missing:
```
Write(file_path=".claude/marketing/activeContext.md", content="
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

### If patterns.md missing:
```
Write(file_path=".claude/marketing/patterns.md", content="
# Learned Patterns

## Phrases That Work
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| \"Less guessing. More shipping.\" | Punchy, parallel | Tiffany | 5 |

## Phrases to AVOID
| Phrase | Why | Source | Count |
|--------|-----|--------|-------|
| \"We're excited to announce\" | Corporate | Brand rules | - |
| Arrow bullets (→) | AI detection | Lora | - |

## Channel Patterns
### LinkedIn
- 1-3 emoji max
- Hook → Details → CTA

### X (Twitter)
- 2-4 emoji OK
- Thread format for long content

## Content That Got Approved
| Date | Type | Channel | Key Elements | Score |
|------|------|---------|--------------|-------|

## Content That Got Rejected
| Date | Type | Channel | Issue | Fix |
|------|------|---------|-------|-----|

## Pattern Tracking
| Pattern | Type | Category | Count | Status |
|---------|------|----------|-------|--------|

## Last Updated
[timestamp]
")
```

### If feedback.md missing:
```
Write(file_path=".claude/marketing/feedback.md", content="
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

---

## Step 4: Load Brand Context

```
Read(file_path="brands/base44/RULES.md")           # FIRST - hard rules
Read(file_path="brands/base44/tone-of-voice.md")   # Voice guide
Read(file_path="brands/base44/AGENTS.md")          # Agent index
Read(file_path="brands/base44/learning-log.md")    # Recent learnings
```

---

## Step 5: Verify All Files & Anchors

```
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
```

Check guaranteed anchors exist:
- **activeContext.md:** `## Current Focus`, `## Recent Content`, `## Last Updated`
- **patterns.md:** `## Phrases That Work`, `## Phrases to AVOID`, `## Pattern Tracking`
- **feedback.md:** `## Awaiting Review`, `## Recent Feedback`, `## Debug Attempts`

If ANY anchor missing → Auto-heal (recreate from template)

---

## Initialization Checklist

Before proceeding to routing:
```
- [ ] Directory exists (.claude/marketing/)
- [ ] activeContext.md exists and has anchors
- [ ] patterns.md exists and has anchors
- [ ] feedback.md exists and has anchors
- [ ] Brand files loaded (RULES.md, tone-of-voice.md, learning-log.md)
- [ ] No pending promotions (patterns at COUNT: 2)
```

**Only when ALL boxes checked: Proceed to routing.**

---

## Memory Update After Content

### Read-Edit-Verify Cycle

```
1. Read(file_path=".claude/marketing/{file}.md")  # Load current
2. Edit(file_path=".claude/marketing/{file}.md", old_string="...", new_string="...")
3. Read(file_path=".claude/marketing/{file}.md")  # VERIFY applied
```

**NEVER skip step 3.** Edits can fail silently.

### Stable Anchors for Edit

| File | Valid Anchors |
|------|---------------|
| activeContext.md | `## Current Focus`, `## Recent Content`, `## Last Updated` |
| patterns.md | `## Phrases That Work`, `## Phrases to AVOID` |
| feedback.md | `## Awaiting Review`, `## Recent Feedback` |

### Update Learning Log

After successful delivery:
```
Edit(file_path="brands/base44/learning-log.md", ...)
# Add: Date, Channel, Type, What worked, Pattern to repeat
```

After rejection:
```
Edit(file_path="brands/base44/learning-log.md", ...)
# Add: Original issue, Fix applied, Rule learned
```
