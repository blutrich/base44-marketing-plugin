# Base44 Marketing Plugin

> Orchestrated content creation with brand-aware sub-agents.

## How Workflows Execute

The `marketing-router` skill is the entry point. When it loads, it:

1. Initializes memory → reads brand → detects intent → executes the matching workflow
2. Chains to the right agent + skill files based on intent
3. Finishes every content workflow through `agents/brand-guardian.md` (quality gate)

**Workflow chains by intent:**

| Intent | Chain |
|--------|-------|
| LinkedIn post | `marketing-router` → `linkedin-specialist` → `linkedin-viral` → `brand-guardian` |
| X/Twitter | `marketing-router` → `x-specialist` → `x-viral` → `brand-guardian` |
| Email | `marketing-router` → `copywriter` → `direct-response-copy` → `brand-guardian` |
| Paid ad | `marketing-router` → `ad-specialist` → `brand-guardian` |
| Landing page | `marketing-router` → `base44-landing-page` → `brand-guardian` |
| Blog / SEO | `marketing-router` → `seo-specialist` → `seo-content` → `brand-guardian` |
| Video | `marketing-router` → `video-specialist` → `brand-guardian` |
| Strategy / GTM | `marketing-router` → `gtm-strategist` |
| Campaign | `marketing-router` → `planner` → [specialists in parallel] → `brand-guardian` |
| Data / Analytics | `marketing-router` → `data-insight` |
| Brainstorm | `marketing-router` → `marketing-ideas` |
| Push to Ripple | `marketing-router` → `push-to-ripple` |
| Log session | `marketing-router` → `session-log` |

**Every content workflow** must also read `agents/shared-instructions.md` and `brands/base44/RULES.md` before generating.

## Architecture

```
marketing-router (ENTRY POINT — open-ended, no menu)
        │
        ├── GTM_STRATEGY → gtm-strategist (deep exploration, then plan)
        ├── BRAINSTORM → marketing-ideas (connected narrative, not bullet dumps)
        ├── DATA_INSIGHT → data-insight (Trino analytics) → gtm-strategist (if strategy)
        ├── APP_DATA → base44-feature (pull product features for content)
        ├── PAID_AD → ad-specialist → brand-guardian
        ├── LINKEDIN → linkedin-specialist → brand-guardian
        ├── X → x-specialist → brand-guardian
        ├── EMAIL → copywriter → brand-guardian
        ├── LANDING → base44-landing-page (8-Section → HTML → Base44 CLI deploy) → brand-guardian
        ├── SEO → seo-specialist → brand-guardian
        ├── VIDEO → video-specialist → brand-guardian
        ├── PUSH_RIPPLE → push-to-ripple (extract content → push to Ripple CMS)
        ├── SESSION_LOG → session-log (team usage → Base44 PluginSession entity)
        └── CAMPAIGN → planner → [specialists ∥] → brand-guardian
```

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| `gtm-strategist` | Opus | Deep strategic planning (explore first, plan holistically) |
| `ad-specialist` | Sonnet | Paid ads (Meta, LinkedIn, Reddit) |
| `linkedin-specialist` | Opus | Viral LinkedIn content |
| `x-specialist` | Opus | X/Twitter content |
| `copywriter` | Sonnet | Emails, landing pages |
| `seo-specialist` | Sonnet | Blog posts, SEO/GEO content |
| `video-specialist` | Sonnet | Remotion videos |
| `planner` | Opus | Multi-channel campaigns |
| `brand-guardian` | Haiku | Quality gate (fast reviews) |

## Skills

| Skill | Purpose |
|-------|---------|
| `marketing-router` | Entry point - routes to workflows |
| `brand-memory` | Persistent learning across sessions |
| `linkedin-viral` | LinkedIn optimization patterns |
| `direct-response-copy` | THE SLIDE framework |
| `seo-content` | Search optimization |
| `geo-content` | AI citation optimization |
| `landing-page-architecture` | 8-Section Framework (copy structure) |
| `base44-landing-page` | HTML generation + Base44 hosting deployment |
| `base44-feature` | Pull product features for content creation |
| `data-insight` | Trino analytics: growth, models, funnel, apps, features, remix, referrals, monetization, AI classification, user voice (19 queries, 6 tables) |
| `push-to-ripple` | Push generated content into Ripple CMS |
| `session-log` | Team usage tracking via Base44 PluginSession entity |

## Brand Voice (TL;DR)

```
USE                          AVOID
─────────────────────────    ─────────────────────────
"Builders"                   "Users" / "Customers"
"Ship" / "Go live"           "Deploy" / "Launch"
"Just shipped"               "We're excited to announce"
Action verbs, present        Passive voice
Specific numbers             Vague claims
Short paragraphs             Walls of text
```

## Usage Examples

Just ask in plain English. The plugin context is always loaded — no slash command needed.

```
Write a LinkedIn post about our $1M ARR milestone
```
```
Create a Meta feed ad for our AI feature
```
```
Plan a multi-channel campaign for Debug Mode launch
```
```
Show me growth numbers and turn them into a post
```
```
Build a landing page for Debug Mode
```
```
Push this to ripple
```

## Memory System

The plugin maintains brand learning in `.claude/marketing/`:
- `activeContext.md` - Current focus
- `patterns.md` - What works/doesn't
- `feedback.md` - Pending reviews

## Brand Assets

Located in `brands/base44/`:
- `tone-of-voice.md` - Full voice guide
- `brand.json` - Design tokens (colors, fonts, typography, spacing, gradients, syntax highlighting)
- `design-system.md` - HTML/CSS/React component library (headers, heroes, cards, CTAs, FAQ, terminal, footer)
- `learning-log.md` - Feedback patterns
- `templates/` - Channel templates

Located in `agents/`:
- `shared-instructions.md` - Common voice rules for all content agents

---

*Following the cc10x pattern: Router → Agent Chains → Quality Gate*
