---
name: verification-before-delivery
description: |
  CC10X verification pattern for marketing domain. Ensures quality through evidence, not claims.

  Triggers on: verify, review, check, quality gate, before delivery, evidence.
---

# Verification Before Delivery

**IRON LAW:** No completion claims without fresh evidence. "I verified" means nothing. Show the verification.

---

## The Verification Mandate

Every piece of content MUST pass verification before delivery. This is not optional.

```
WRONG: "I've reviewed the content and it looks good."
RIGHT: "Brand-guardian scored 8/10. Evidence: [table with checks]"
```

---

## Self-Critique Gate (Run BEFORE Review)

Before ANY content goes to brand-guardian, the creating agent MUST run this self-critique:

### 4 Critical Questions

| # | Question | STOP If |
|---|----------|---------|
| 1 | Does this contain ANY banned phrases? | Any match found |
| 2 | Does this match the requested channel format? | Format mismatch |
| 3 | Are specific numbers/results included (if applicable)? | Missing when available |
| 4 | Would this pass our anti-AI checklist? | Arrows, choppy sentences, perfect structure |

### Self-Critique Output Format

```markdown
## Self-Critique: [Content Type]

### Banned Phrase Check
| Phrase | Found | Location |
|--------|-------|----------|
| "users/customers" | No | - |
| "deploy/launch" | No | - |
| "we're excited" | No | - |
| Arrow bullets (→) | No | - |

### Format Check
- Channel: [LinkedIn/X/Email/etc.]
- Expected format: [Hook→Details→CTA / Thread / etc.]
- Matches: [Yes/No]

### Numbers Check
- Numbers available: [Yes/No]
- Numbers included: [Yes/No/N/A]

### Anti-AI Check
- Arrow bullets: [None/Found]
- Choppy sentences: [Natural flow/Too robotic]
- Structure variety: [Varied/Too predictable]
- Repeated phrases: [Minimal/Overused]

### Verdict: [PASS TO REVIEW / FIX FIRST]
```

**CRITICAL:** If Self-Critique = "FIX FIRST", do NOT proceed to brand-guardian.

---

## Stub Detection Patterns (Auto-Fail Markers)

These indicate incomplete work. Finding ANY of these = automatic failure:

### Content Stubs
| Pattern | Meaning | Action |
|---------|---------|--------|
| `[TODO]` | Incomplete section | Complete or remove |
| `[TBD]` | Decision pending | Make decision |
| `[PLACEHOLDER]` | Missing content | Add real content |
| `[INSERT X]` | Missing data | Insert actual data |
| `Lorem ipsum` | Dummy text | Replace with real copy |
| `Example text` | Placeholder | Write actual content |

### Incomplete Structures
| Pattern | Meaning | Action |
|---------|---------|--------|
| Empty table rows | Incomplete data | Fill or remove |
| `...` at end of list | Incomplete list | Complete list |
| Single-item bullets | Lazy placeholder | Add real items or remove list |
| `[number]` | Missing metric | Find actual number |

### Detection Command

Before delivery, scan for stubs:
```
Grep(pattern="\\[TODO\\]|\\[TBD\\]|\\[PLACEHOLDER\\]|\\[INSERT|Lorem ipsum|Example text", ...)
```

If ANY matches found: **STOP. Complete the stubs first.**

---

## Evidence Capture Template

Every review MUST produce this evidence table:

```markdown
## Verification Evidence: [Content ID/Description]

### Timestamp
- Verified: [YYYY-MM-DD HH:MM]
- By: [Agent Name]

### Content Summary
- Type: [LinkedIn post / Email / Landing page / etc.]
- Channel: [Platform]
- Word count: [N]

### Checks Performed

| Check | Result | Evidence |
|-------|--------|----------|
| Voice rules | [Pass/Fail] | [Specific items checked] |
| Banned phrases | [Pass/Fail] | [Grep results or "None found"] |
| Channel format | [Pass/Fail] | [Format verified] |
| Numbers included | [Pass/Fail/N/A] | [Numbers used: X, Y, Z] |
| Anti-AI markers | [Pass/Fail] | [Checklist results] |
| Hook style | [Pass/Fail] | [Which of 5 approved styles] |

### Brand Guardian Score
- Score: [X/10]
- Verdict: [APPROVED / NEEDS REVISION / REJECTED]

### Issues Found (if any)
| Issue | Location | Fix Applied |
|-------|----------|-------------|
| [Issue description] | [Where in content] | [How it was fixed] |

### Final Status
- [x] Self-critique passed
- [x] Stub detection passed
- [x] Brand-guardian reviewed
- [x] Score meets threshold (≥7/10)
- [x] Evidence captured

**DELIVERY AUTHORIZED: [Yes/No]**
```

---

## Integration with brand-guardian

### Before Calling brand-guardian

1. Run self-critique (4 questions)
2. Run stub detection
3. If either fails: FIX FIRST, do not proceed

### After brand-guardian Returns

1. Capture evidence in template above
2. If score < 7: Return to creating agent with specific fixes
3. If score ≥ 7: Authorize delivery
4. Log to memory files (patterns.md, feedback.md)

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT CREATED                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SELF-CRITIQUE GATE                            │
│  • 4 Critical Questions                                          │
│  • If ANY fail → FIX FIRST (loop back)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STUB DETECTION                                │
│  • Scan for [TODO], [TBD], Lorem ipsum, etc.                    │
│  • If ANY found → COMPLETE FIRST (loop back)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BRAND-GUARDIAN REVIEW                         │
│  • Full voice/tone/channel checks                                │
│  • Score 1-10                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EVIDENCE CAPTURE                              │
│  • Fill verification evidence template                           │
│  • Log to memory files                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Score ≥ 7?     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        ┌───────────┐                ┌───────────────┐
        │   YES     │                │      NO       │
        │  DELIVER  │                │ RETURN TO     │
        │           │                │ SPECIALIST    │
        └───────────┘                └───────────────┘
```

---

## Debug Attempt Tracking

When content fails verification, track attempts:

### Format
```
[DEBUG-N]: [Issue] → [Attempted Fix] → [Result]
```

### Examples
```
[DEBUG-1]: Arrow bullets found → Replaced with emoji bullets → PASSED
[DEBUG-2]: Score 5/10 "too corporate" → Rewrote opener with builder voice → Score 8/10
[DEBUG-3]: Missing numbers → Added "140K builders" → PASSED
```

### Escalation
- **DEBUG-1 to DEBUG-2:** Normal iteration
- **DEBUG-3+:** Flag as pattern issue, log to learning-log.md
- **DEBUG-5+:** Human intervention required

---

## Memory Integration

### After Successful Verification

Update `.claude/marketing/patterns.md`:
```markdown
## Content That Got Approved
| Date | Type | Key Elements | Score |
|------|------|--------------|-------|
| [DATE] | [type] | [what worked] | [X/10] |
```

### After Failed Verification

Update `.claude/marketing/feedback.md`:
```markdown
## Recent Feedback
### [DATE] - [CHANNEL]
**Issue:** [what failed]
**Fix:** [how it was fixed]
**DEBUG attempts:** [N]
```

If same issue appears 3+ times in feedback.md:
```
→ Promote to patterns.md "Phrases to AVOID"
→ Log to brands/base44/learning-log.md
→ Consider adding to RULES.md
```

---

## Verification Checklist (Quick Reference)

Before marking ANY content as complete:

- [ ] Self-critique passed (4 questions)
- [ ] Stub detection passed (no TODO/TBD/placeholders)
- [ ] Brand-guardian reviewed
- [ ] Score ≥ 7/10
- [ ] Evidence template filled
- [ ] Memory files updated
- [ ] DEBUG attempts logged (if any)

**Only when ALL boxes checked: DELIVERY AUTHORIZED**

---

*"Trust but verify" is wrong. VERIFY, then trust the verification.*
