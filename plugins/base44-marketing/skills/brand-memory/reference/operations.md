# Memory Operations

Detailed patterns for reading, writing, and updating memory files.

---

## Load Memory (Session Start)

```
Bash(command="mkdir -p .claude/marketing")
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
# If any file errors → Create with template
```

---

## Stable Anchors for Edit

Use ONLY these headers when editing to avoid breaking structure:

| File | Valid Anchors |
|------|---------------|
| activeContext.md | `## Current Focus`, `## Recent Content`, `## Key Messages`, `## Last Updated` |
| patterns.md | `## Phrases That Work`, `## Phrases to AVOID`, `## Content That Got Approved` |
| feedback.md | `## Awaiting Review`, `## Recent Feedback`, `## Last Updated` |

---

## Update activeContext

After content creation:
```
Read(file_path=".claude/marketing/activeContext.md")

Edit(file_path=".claude/marketing/activeContext.md",
     old_string="## Recent Content\n| Date",
     new_string="## Recent Content\n| [TODAY] | [type] | [channel] | [status] | [score] |\n| Date")

Read(file_path=".claude/marketing/activeContext.md")  # Verify
```

---

## Log Learning

After feedback:
```
# Local patterns
Edit(file_path=".claude/marketing/patterns.md", ...)
Read(file_path=".claude/marketing/patterns.md")  # Verify

# Permanent team record
Edit(file_path="brands/base44/learning-log.md", ...)
Read(file_path="brands/base44/learning-log.md")  # Verify
```

---

## Auto-Heal Protocol

If a guaranteed anchor is missing:

```
Read(file_path=".claude/marketing/activeContext.md")

# If "## Current Focus" NOT found:
#   → File is corrupted
#   → Recreate from template

Write(file_path=".claude/marketing/activeContext.md", content="[TEMPLATE]")
```

### Heal Decision Tree

```
Read file → Check anchors → All present?
                              │
                    YES       │       NO
                      │       │       │
                      ▼               ▼
                Continue        Auto-Heal:
                                1. Log missing anchors
                                2. Recreate from template
                                3. Verify anchors present
```

---

## Debug Attempt Tracking

Format:
```
[DEBUG-N]: [Issue] → [Attempted Fix] → [Result]
```

Track in feedback.md:
```markdown
## Debug Attempts
| Date | Content | Issue | Attempts | Resolution |
|------|---------|-------|----------|------------|
| 2026-02-04 | LinkedIn post | Arrow bullets | [DEBUG-1] | Fixed |
```

### Escalation Rules

| DEBUG Level | Action |
|-------------|--------|
| DEBUG-1 | Normal fix, continue |
| DEBUG-2 | Log pattern, continue |
| DEBUG-3+ | Log to learning-log.md |
| DEBUG-5+ | Flag for human review |
