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
marketing-router (ENTRY POINT)
        │
        ├── LINKEDIN → linkedin-specialist → brand-guardian
        ├── EMAIL → copywriter → brand-guardian
        ├── LANDING → copywriter → brand-guardian
        ├── SEO → seo-specialist → brand-guardian
        └── CAMPAIGN → planner → [specialists ∥] → brand-guardian
```

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| `linkedin-specialist` | Sonnet | Viral LinkedIn content |
| `copywriter` | Sonnet | Emails, landing pages, ads |
| `seo-specialist` | Sonnet | Blog posts, SEO/GEO content |
| `planner` | Sonnet | Multi-channel campaigns |
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
| `landing-page-architecture` | 8-Section Framework |

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

## Memory System

The plugin maintains brand learning in `.claude/marketing/`:
- `activeContext.md` - Current focus
- `patterns.md` - What works/doesn't
- `feedback.md` - Pending reviews

## Brand Assets

Located in `brands/base44/`:
- `tone-of-voice.md` - Full voice guide
- `AGENTS.md` - Compressed brand index
- `learning-log.md` - Feedback patterns
- `templates/` - Channel templates

---

*Following the cc10x pattern: Router → Agent Chains → Quality Gate*
