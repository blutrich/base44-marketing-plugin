# Brand Content Rules for Claude

## Priority Order

1. **ALWAYS** read `brands/base44/RULES.md` before generating any marketing content
2. **ALWAYS** read `agents/shared-instructions.md` for voice rules
3. **ALWAYS** check `brands/base44/learning-log.md` for feedback patterns

## Content Generation Workflow

```
1. Read RULES.md (hard rules)
2. Read shared-instructions.md (voice rules)
3. Identify: audience + channel + content pillar
4. Load relevant template from brands/base44/templates/
5. Generate content matching voice rules
6. Self-check against AVOID list
7. Output with confidence level
```

## Self-Learning Trigger

When content feedback is received:
```
IF feedback == "rejected" OR feedback == "needs revision":
    1. Log to brands/base44/learning-log.md
    2. Capture: original → feedback → corrected
    3. Identify pattern
    4. Increment pattern count; promote to RULES.md if count reaches 2
```

## Quality Gates

Before outputting content, verify:
- [ ] Matches brand voice (cool big brother, not corporate)
- [ ] Uses approved words/phrases
- [ ] Avoids blacklisted words/phrases
- [ ] Fits channel format (character limits, style)
- [ ] Addresses correct audience segment

## Uncertainty Protocol

If uncertain about brand fit:
- Flag confidence level (low/medium/high)
- Cite which guideline is unclear
- Suggest alternatives for human review
