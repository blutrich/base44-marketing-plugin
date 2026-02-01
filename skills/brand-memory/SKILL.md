---
name: brand-memory
description: |
  Manages brand context and learning across sessions. Load this skill to persist patterns, feedback, and improvements.

  Team members can add feedback by editing the learning files directly or through conversation.
---

# Brand Memory System

Persistent memory for marketing content creation. Tracks what works, what doesn't, and patterns learned.

## Team Contributors

| Name | Role | Focus Areas |
|------|------|-------------|
| Lora | Content Manager | Voice, social posts, product updates |
| Tiffany | Product Marketing | Feature announcements, positioning |
| Maor | Founder | Overall voice, final approval |

**How to add feedback:** Edit the patterns.md or feedback.md files, or say "add to memory: [feedback]" in conversation.

## Memory Files

```
.claude/marketing/
├── activeContext.md    # Current campaign/focus
├── patterns.md         # Learned patterns (what works)
└── feedback.md         # Pending feedback to process
```

## File Templates

### activeContext.md
```markdown
# Marketing Active Context

## Current Focus
- Campaign: [name or none]
- Channel: [LinkedIn/Email/etc.]
- Deadline: [if any]

## Recent Content
- [DATE]: [content type] - [status]

## Key Messages
- [current messaging priorities]

## Numbers to Use
- [current stats: ARR, users, etc.]

## References
- Plan: [path or N/A]
- Brief: [path or N/A]

## Last Updated
[timestamp]
```

### patterns.md
```markdown
# Learned Patterns

## Phrases That Work
| Phrase | Why | Source |
|--------|-----|--------|
| "Less guessing. More shipping." | Punchy, parallel structure | Tiffany/Debug Mode |
| "Another feature just dropped:" | Clean announcement format | LinkedIn analysis |

## Phrases to AVOID
| Phrase | Why | Source |
|--------|-----|--------|
| "We're excited to announce" | Corporate, not builder-voice | Brand rules |

## Channel Patterns
### LinkedIn
- 1-3 emoji
- Hook → Details → CTA
- Numbers always

### Discord
- More emoji OK
- Humor OK
- Self-deprecating works

### Email
- Problem → Solution → Result
- Single CTA
- Short paragraphs

## Content That Got Approved
| Date | Type | Key Elements |
|------|------|--------------|

## Content That Got Rejected
| Date | Type | Issue | Fix |
|------|------|-------|-----|

## Last Updated
[timestamp]
```

### feedback.md
```markdown
# Pending Feedback

## Awaiting Review
| Date | Content | Channel | Status |
|------|---------|---------|--------|

## Recent Feedback
### [DATE] - [CHANNEL]
**Original:**
> [content]

**Feedback:**
> [what was said]

**Action:**
- [ ] Update patterns.md
- [ ] Update AGENTS.md if pattern repeats 3+ times

## Last Updated
[timestamp]
```

## Memory Operations

### Load Memory (Start of Session)
```
Bash(command="mkdir -p .claude/marketing")
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
```

### Update Memory (After Content Creation)
```
Edit(file_path=".claude/marketing/activeContext.md", ...)
Read(file_path=".claude/marketing/activeContext.md")  # Verify
```

### Log Learning (After Feedback)
```
Edit(file_path=".claude/marketing/patterns.md", ...)
Edit(file_path="brand/learning-log.md", ...)  # Permanent record
```

## Self-Learning Protocol

When feedback is received:

```
IF feedback == "approved":
    → Log to patterns.md "Content That Got Approved"
    → Extract winning elements

IF feedback == "rejected" OR "needs revision":
    → Log to patterns.md "Content That Got Rejected"
    → Log to brand/learning-log.md (permanent)
    → Identify pattern
    → IF pattern repeats 3+ times:
        → Suggest AGENTS.md update
```

## Auto-Heal Missing Sections

If required sections missing:
```
Edit(file_path=".claude/marketing/activeContext.md",
     old_string="## Last Updated",
     new_string="## References\n- Plan: N/A\n\n## Last Updated")
```
