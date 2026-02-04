# Brand Content Rules for Claude

## Priority Order

1. **ALWAYS** read `/AGENTS.md` before generating any marketing content
2. **ALWAYS** check `/design-log/` for context on past decisions
3. **ALWAYS** check `/brand/learning-log.md` for feedback patterns

## Content Generation Workflow

```
1. Read AGENTS.md (brand index)
2. Identify: audience + channel + content pillar
3. Load relevant template from brand/templates/
4. Generate content matching voice rules
5. Self-check against AVOID list
6. Output with confidence level
```

## Self-Learning Trigger

When content feedback is received:
```
IF feedback == "rejected" OR feedback == "needs revision":
    1. Log to brand/learning-log.md
    2. Capture: original → feedback → corrected
    3. Identify pattern
    4. Suggest AGENTS.md update if pattern repeats 3+ times
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
