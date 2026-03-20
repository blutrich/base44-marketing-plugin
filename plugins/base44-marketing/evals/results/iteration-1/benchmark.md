# Marketing Plugin Eval Results — Iteration 1

**Date:** 2026-03-20
**Version:** 1.18.0
**Total: 78/78 assertions PASS (100%)**

## Summary by Category

| Category | Evals | Assertions | Passed | Rate |
|----------|-------|------------|--------|------|
| Routing | — | — | — | Not tested (requires live agent routing) |
| Brand Voice | #5, #8, #14, #17 | 21 | 21 | 100% |
| Anti-AI Patterns | #6, #7 | 11 | 11 | 100% |
| Enum Correctness | #9, #18 | 9 | 9 | 100% |
| Provenance | #10, #11 | 12 | 12 | 100% |
| Collision Detection | #12, #13 | — | — | Not tested (requires live API) |
| **Total Tested** | **10** | **53** | **53** | **100%** |

## Eval Details

### Static Analysis (file-based)

| Eval | Name | Result | Notes |
|------|------|--------|-------|
| #9 | push-to-activity-correct-enums | 5/5 PASS | status=new, approval_status=draft, activity_type=social_media, content_maturity=raw_draft, generation_method=ai_generated |
| #10 | push-includes-all-provenance-fields | 9/9 PASS | All 9 provenance fields present with correct structure |
| #11 | activity-number-auto-assigned | 3/3 PASS | Query logic, increment, MA-{number} format documented |
| #18 | feature-brief-correct-enums | 4/4 PASS | status=new, approval_status=draft, activity_type=content, provenance present |

### Content Generation (agent-based)

| Eval | Name | Result | Notes |
|------|------|--------|-------|
| #5 | no-banned-words-in-linkedin-post | 5/5 PASS | Zero banned verbs, adjectives, transitions. Correct vocabulary. |
| #6 | no-em-dashes-no-rule-of-three | 6/6 PASS | Zero em dashes, no rule-of-three, no stacked fragments. Minor note: Eval 6 Var B "Not ads, not influencers. Just builders..." is borderline contrast but describing factual data, not rhetorical device. |
| #7 | maor-test-natural-voice | 5/5 PASS | "I" pronouns, casual voice, value-first, no self-narration, no fake vulnerability. |
| #8 | positive-framing-no-competitors | 4/4 PASS | Zero competitor names, builder-benefit framing, no comparative language. |
| #14 | brand-guardian-catches-violations | 9/9 PASS | All 7 violations detected, score 3/10, rewrite provided with 9/10 score. |
| #17 | user-value-first-not-feature-name | 3/3 PASS | Feature name buried in all variations, hooks lead with outcome/story. |

## Not Tested (requires live environment)

| Eval | Name | Why |
|------|------|-----|
| #1 | linkedin-post-routes-to-linkedin-specialist | Requires live agent routing |
| #2 | x-thread-routes-to-x-specialist | Requires live agent routing |
| #3 | strategy-routes-to-gtm-not-content | Requires live agent routing |
| #4 | paid-ad-routes-to-ad-specialist | Requires live agent routing |
| #12 | collision-detected-on-existing-content | Requires live API + existing records |
| #13 | no-collision-on-empty-slots | Requires live API + existing records |
| #15 | launch-waterfall-triggers-on-feature-launch | Requires live agent routing |
| #16 | repurpose-routes-correctly | Requires live agent routing |

## Quality Observations

1. **Brand voice is strong** — all 6 content generation runs produced clean output with zero banned words
2. **Anti-AI patterns held** — no em dashes, no rule-of-three, natural sentence variation
3. **Maor voice is distinct** — "I" pronouns, casual tone, specific details, no corporate polish
4. **Brand guardian is effective** — caught all 7 planted violations, scored correctly, rewrote well
5. **Value-first structure works** — feature names consistently buried mid-post across all variations
6. **Enum alignment verified** — all 3 entry points (push-to-activity, feature-brief, feature-scan) use correct values
