# Base44 Marketing Agent

> Compressed brand index. Read this BEFORE generating any marketing content.
> **Source of truth:** `/Users/oferbl/Desktop/Dev/ai-marketing-agent/brands/base44/`

## Voice (3 Words)

```
BUILDER-FIRST | FAST-PACED | RESULTS-FOCUSED
```

## Quick Rules

```
USE                          AVOID
─────────────────────────    ─────────────────────────
"Builders"                   "Users" / "Customers" / "Vibe-coders"
"Ship" / "Go live"           "Deploy" / "Launch"
"Vibe coding" (category)     "No-code" alone
"Just shipped" / "Dropped"   "We're excited to announce"
"Wild" / "Finally"           Corporate hedging
Action verbs, present        Passive voice
Short paragraphs             Walls of text
Specific numbers             Vague claims
Action CTAs                  Question CTAs (no "What would you build?")
```

**Note:** "Vibe coding" = category/positioning term. Address audience as "builders", never "vibe-coders".

## Voice Character

We speak peer-to-peer with builders. Fast-paced, action-oriented. Celebrate real results (revenue, apps shipped, time saved) not abstract promises. Like a cool big brother — supportive, teaches, teases occasionally.

## Signature Phrases

- "Just shipped:" / "Just dropped:"
- "What's wild is—"
- "Here's the thing—"
- "Let's make your dream a reality. Right now."
- "[Builder] built [app] in [time]. Here's what happened."

## Docs Index (ai-marketing-agent)

```
RESOURCE                     PATH
──────────────────────────   ─────────────────────────────────────────
Full voice guide             brands/base44/tone-of-voice.md
Brand system                 brands/base44/brand-system.md
Visual identity              brands/base44/brand.json
CTAs library                 brands/base44/content-library/ctas.md
Hooks library                brands/base44/content-library/hooks.md
Objection handling           brands/base44/content-library/objection-handling.md
Value propositions           brands/base44/content-library/value-props.md
Testimonials                 brands/base44/feedback/testimonials.md
Pain points                  brands/base44/feedback/pain-points.md
Case studies                 brands/base44/case-studies/
```

## Content Generation (ai-marketing-agent server)

```bash
# Generate content via API
curl -X POST http://localhost:8000/generate-content \
  -H "Content-Type: application/json" \
  -d '{"content_type": "linkedin", "prompt": "Plan Mode feature launch"}'

# Available content types:
# linkedin, email, seo, geo, direct-response, landing-page, general
```

## Skills Available

| Type | Skill | Purpose |
|------|-------|---------|
| `linkedin` | linkedin-viral | LinkedIn posts with hooks |
| `email` | direct-response-copy | THE SLIDE framework |
| `seo` | seo-content | Search-optimized content |
| `geo` | geo-content | AI citation optimization |
| `landing-page` | landing-page-architecture | 8-Section Framework |
| `general` | brand-voice | Default tone (fallback) |

## Audience

```
PROTOTYPERS  | vibe coders, students     | X, IG, Reddit  | educational
PRO_BUILDERS | freelancers, startups     | LinkedIn, X    | features, ROI
ENTERPRISE   | large companies           | LinkedIn       | thought leadership
```

## Before Publishing

1. Does this sound like a builder talking to a builder?
2. Are we using action verbs ("ship", "build")?
3. Are we showing results, not just promises?
4. Would reader feel "I can do this right now"?
5. Is there a shorter way to say this?

---
*Synced with: ai-marketing-agent/brands/base44/*
*Server: ai-marketing-agent/server/*
