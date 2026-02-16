# Base44 Marketing Plugin

> Orchestrated content creation with brand-aware sub-agents.

## Quick Start

```bash
# Install the plugin
/plugin marketplace add blutrich/base44-marketing-plugin

# Create content
/marketing-router Write a LinkedIn post about our new AI feature
```

## Architecture

```
marketing-router (ENTRY POINT — open-ended, no menu)
        │
        ├── GTM_STRATEGY → gtm-strategist (deep exploration, then plan)
        ├── BRAINSTORM → marketing-ideas (connected narrative, not bullet dumps)
        ├── DATA_INSIGHT → gtm-strategist (builder analytics — Phase 2)
        ├── APP_DATA → base44-feature (pull product features for content)
        ├── PAID_AD → ad-specialist → brand-guardian
        ├── LINKEDIN → linkedin-specialist → brand-guardian
        ├── X → x-specialist → brand-guardian
        ├── EMAIL → copywriter → brand-guardian
        ├── LANDING → base44-landing-page (8-Section → HTML → Base44 CLI deploy) → brand-guardian
        ├── SEO → seo-specialist → brand-guardian
        ├── VIDEO → video-specialist → brand-guardian
        ├── PUSH_RIPPLE → push-to-ripple (extract content → push to Ripple CMS)
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
| `push-to-ripple` | Push generated content into Ripple CMS |

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

### Paid Ad
```
/marketing-router Create a Meta feed ad for our AI feature
```

### LinkedIn Post
```
/marketing-router Write a LinkedIn post about our $1M ARR milestone
```

### Email Campaign
```
/marketing-router Create an email sequence for our new feature launch
```

### Full Campaign
```
/marketing-router Plan a multi-channel campaign for Debug Mode launch
```

### Fetch App Data
```
/marketing-router Show me released features ready for marketing
```

### Push to Ripple
```
/marketing-router Push this to ripple
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
