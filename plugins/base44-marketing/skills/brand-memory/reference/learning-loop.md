# Learning Loop & Pattern Detection

How the system learns from feedback and promotes patterns to rules.

---

## The Learning Loop

```
GENERATE → REVIEW → FEEDBACK → CAPTURE → PATTERN DETECT → RULES UPDATE
     ↑                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## Feedback Types

### 1. Approval Feedback

| Action | What It Teaches |
|--------|-----------------|
| ✅ Approved as-is | This pattern works. Reinforce it. |
| 📝 Approved + edit | Close, but needed adjustment. Learn the diff. |
| 🔄 Regenerate | Missed the mark. Note what was wrong. |
| ❌ Rejected | Significant issue. Capture reason as anti-pattern. |

### 2. Edit-Based Feedback

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
| Emoji | "Too many", "Wrong placement" |
| Length | "Too long", "Needs more detail" |
| Vocabulary | "Don't say X, say Y" |

---

## Pattern Detection

### Confidence Levels

```
COUNT    CONFIDENCE    EFFECT
1        LOW           Logged, watching
2        MEDIUM        Soft suggestion
3        HIGH          Auto-promote to RULES.md
5+       RULE          Enforced by brand-guardian
```

### Pattern Types

| Type | Meaning | Action |
|------|---------|--------|
| `do` | Positive pattern to repeat | Include in generation |
| `dont` | Anti-pattern to avoid | Check & flag |
| `prefer` | Better alternative exists | Suggest replacement |
| `avoid` | Weak pattern, not banned | Lower priority |

### Pattern Categories

`voice`, `structure`, `hook`, `cta`, `emoji`, `length`, `vocabulary`, `timing`, `channel`

---

## Pattern Tracking Format

In patterns.md:

```markdown
## Pattern Tracking
| Pattern | Type | Category | Count | Status |
|---------|------|----------|-------|--------|
| Say "builders" not "users" | prefer | vocabulary | [COUNT: 3] | RULE |
| Start with "Just shipped:" | do | hook | [COUNT: 2] | PROMOTE |
| Avoid "leverage" | avoid | vocabulary | [COUNT: 1] | watching |
```

---

## Promotion Protocol

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
Edit(file_path="brands/base44/learning-log.md", ...)
```

---

## Increment Pattern Count

When same feedback appears again:

```
Read(file_path=".claude/marketing/patterns.md")

Edit(file_path=".claude/marketing/patterns.md",
     old_string="| [Pattern] | [type] | [cat] | [COUNT: 1] |",
     new_string="| [Pattern] | [type] | [cat] | [COUNT: 2] |")

# If COUNT: 2 → trigger promotion protocol
```

---

## Improvement Tracking

Track system improvement over time in patterns.md:

```markdown
## Improvement Metrics

### First-Pass Approval Rate
| Week | Rate | Trend |
|------|------|-------|
| Week 1 | 45% | - |
| Week 2 | 58% | ↑ |

### Brand Guardian Average Score
| Week | Score | Trend |
|------|-------|-------|
| Week 1 | 6.2 | - |
| Week 2 | 7.1 | ↑ |
```
