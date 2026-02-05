# Memory File Templates

Templates for creating memory files with guaranteed anchors.

---

## activeContext.md Template

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
```

---

## patterns.md Template

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

## Last Updated
[timestamp]
```

---

## feedback.md Template

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

## Last Updated
[timestamp]
```
