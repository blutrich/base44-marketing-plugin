# Base44 Content Rules

> **MANDATORY.** Read this FIRST before creating ANY content.

---

## 6 Principles (internalize these)

### 1. Sound like Maor, not a marketer
Content reads like a builder talking to builders in a Slack thread. Not a press release. Not ad copy. Not a LinkedIn influencer. If the rhythm sounds like a billboard, a TV spot, or a YouTube intro, rewrite it. Maor's voice IS the standard. Stacked short fragments ("One workspace. Unlimited builders. No friction."), "let's dive in" openers, and "happy shipping" sign-offs all fail this test. Brand account = "we" voice. Only Maor's personal posts use "I".

### 2. Say the thing directly
Never announce what you're about to say, inflate its importance, or frame it through contrast. Delete "Here's why this matters", "The kicker?", "It's not X, it's Y", "marking a pivotal moment", "paving the way for." Just say the thing. Use "is" and "has" instead of "serves as" or "boasts." Start sentences clean: no However, Moreover, Furthermore, Additionally, Indeed. No trailing "-ing phrase" padding. No em dashes (zero tolerance, biggest AI tell in 2026).

### 3. Use plain words, not AI vocabulary
Every word in `banned-words.md` is banned. The short version: leverage = use, facilitate = help, craft = write, empower = let, streamline = simplify, curate = pick. Same for adjectives: groundbreaking, seamless, robust, transformative, unprecedented, innovative = say what you actually mean. If the word sounds like it came from a press release generator, replace it.

### 4. Lead with builder value, not the feature
Never headline what the feature IS. Lead with what it DOES for the builder. "We just became the first AI app builder with gift cards" = bad. "Send someone the ability to build their first app" = good. Feature name can appear once, buried. Hooks must be specific to THIS feature (not interchangeable). No question CTAs. No fake-relatable scenarios. No generic "just dropped."

### 5. Protect credibility
Never name competitors in published content (Lovable, Bolt, Bubble, Monday). Say "other platforms" or "your current tool." Never cite unverified competitor stats. Only use Base44's own verified metrics. Don't speak about what others don't have. Speak about what we do.

### 6. Brand visuals come from the design system
Every visual runs through nano-banana (Imagen 3 + composite_social.py). Never HTML/CSS as a creative. Every creative must include a product screenshot, Figma UI, or lifestyle photo alongside text (no empty text-on-gradient). No black backgrounds. Colors, fonts (STK Miso only), backgrounds (`bg_*` tokens), and logo come from `brand.json` and `design-system.md`. If it's not in the design system, it doesn't exist.

---

## 12-Point Quick-Scan Checklist

Brand-guardian scores these. Each is PASS or FAIL.

| # | Check | Fails if... | Enforced in code? |
|---|-------|-------------|-------------------|
| 1 | **Base44 vocabulary** | Uses "users", "customers", "deploy", "launch", "vibe-coder" in posts | No |
| 2 | **No AI vocabulary** | Any word from `banned-words.md` appears (verbs, adjectives, adverbs) | No |
| 3 | **No AI structure patterns** | Rule-of-three, contrast framing, self-narration, significance inflation, transition openers, em dashes, synonym cycling, false ranges, fake naming | No |
| 4 | **Builder voice** | TV-ad cadence, choppy fragments, ad melody, "let's" openers, "happy shipping" sign-offs, question CTAs, boldface abuse | No |
| 5 | **User value first** | Hook/headline leads with the feature name instead of builder value | No |
| 6 | **No competitor names** | Names a specific competitor or cites unverified competitor stats | No |
| 7 | **Correct voice persona** | Brand account uses "I" voice, or Maor post uses "we" | No |
| 8 | **Channel format** | Wrong dimensions, character limits, links in main LinkedIn/X post, walls of text | No |
| 9 | **Multiple variations** | Only one version delivered for social posts (need 2-3) | No |
| 10 | **Brand visuals** | Off-brand colors, wrong font, missing logo, black/dark background | Yes (composite_social.py) |
| 11 | **No empty creatives** | Text-on-gradient only, no product screenshot/Figma UI/photo | No |
| 12 | **The Maor Test** | Would Maor need to "polish" this before posting? If yes, it fails | No |

**Ad creatives add 4 more checks (items 13-16):**

| # | Check | Fails if... |
|---|-------|-------------|
| 13 | **One message per ad** | Multiple sections, feature lists, testimonial boxes in the image |
| 14 | **Readable at feed size** | Text unreadable at 400px wide (phone feed) |
| 15 | **Single visual surface** | Dark panels on colored backgrounds, boxes-within-boxes |
| 16 | **Max 15 words on creative** | More than headline + subtext on the image |

---

## Scoring

- **Social content:** 12 checks. Score = passing / 12, mapped to 1-10.
- **Ad content:** 16 checks. Score = passing / 16, mapped to 1-10.
- **9/10+:** APPROVED.
- **7-8/10:** AUTO-REVISE (fix all failures, re-score, deliver improved version).
- **Below 7:** REWRITE.

### Instant Rejects (any one = automatic fail regardless of score)
- Black/dark background on any creative (Principle 6)
- HTML/CSS used as a visual creative (Principle 6)
- Empty creative with no visual element (check #11)
- Ad failure on checks 13-16 (structural)

---

## ALWAYS DO

1. **Sound like builder to builder** - Peer conversation, not corporate
2. **Use specific numbers** - "$1M ARR", "400K+ builders", "3 weeks"
3. **Show results, not promises** - What happened, not what might
4. **Natural sentence flow** - Mix short and medium sentences
5. **Vary structure** - Not every post needs lists
6. **Hooks must match the feature** - Only make sense for THIS specific feature
7. **End posts with engagement, not filler** - Feature-relevant closers
8. **Sound like Maor** - Casual, specific, story-driven. Not copywriting
9. **Holistic plans over idea dumps** - Integrated plans, not grocery lists
10. **Use inline SVG for the logo** - Never plain text, never base64 PNG
11. **Use plain words** - See Principle 3 + `banned-words.md`
12. **Vary groupings** - Two or four+, never three
13. **Have opinions** - Mixed feelings are human. Neutral lists are not
14. **Leave some imperfection** - An aside or half-formed thought beats a perfect five-paragraph essay

---

## Reference Files

| File | Contains |
|------|----------|
| `banned-words.md` | Full banned vocabulary list (130+ words) |
| `brand.json` | Design tokens (colors, fonts, gradients, spacing) |
| `design-system.md` | CSS components, backgrounds, logo SVG |
| `tone-of-voice.md` | Full voice guide with Maor post examples |
| `learning-log.md` | Active feedback patterns |

---

## Rule Lifecycle

| Count | Action |
|-------|--------|
| 1x feedback | Log to learning-log.md |
| 2x feedback | Promote to this file (add to relevant Principle or Check) |
| Core to brand | Promote to tone-of-voice.md |

---

*Last updated: 2026-03-15*
*6 Principles + 12 Checks (16 for ads) + 14 ALWAYS*
