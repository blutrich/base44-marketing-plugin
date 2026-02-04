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
        ├── PAID_AD → ad-specialist → brand-guardian
        ├── LINKEDIN → linkedin-specialist → brand-guardian
        ├── X → x-specialist → brand-guardian
        ├── EMAIL → copywriter → brand-guardian
        ├── LANDING → copywriter → brand-guardian
        ├── SEO → seo-specialist → brand-guardian
        ├── VIDEO → video-specialist → brand-guardian
        └── CAMPAIGN → planner → [specialists ∥] → brand-guardian
```

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
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

---

## Agent & Skill Index (Compressed Reference)

> **STOP.** What you remember about Base44 marketing is WRONG. Always read brand files and agent instructions before any task.
>
> This section provides indexed context for the main agent. Read by marketing-router before every task.

### Agent Index

| Agent | Model | Skills | Invocation Triggers |
|-------|-------|--------|---------------------|
| **ad-specialist** | Sonnet | nano-banana, marketing-psychology, hook-rules | "ad", "paid", "meta ad", "linkedin ad", "reddit ad", "creative", "banner" |
| **linkedin-specialist** | Opus | linkedin-viral, marketing-psychology, hook-rules | "linkedin", "post", "social", "viral" |
| **x-specialist** | Opus | x-viral, marketing-psychology, hook-rules | "x", "twitter", "tweet", "thread" |
| **copywriter** | Sonnet | direct-response-copy, landing-page-architecture, marketing-psychology, hook-rules | "email", "landing page", "sales page", "nurture", "sequence" |
| **seo-specialist** | Sonnet | seo-content, geo-content, marketing-psychology | "blog", "seo", "article", "pillar", "search" |
| **video-specialist** | Sonnet | remotion, nano-banana, hook-rules | "video", "remotion", "animation", "thumbnail", "clip", "reel" |
| **planner** | Opus | marketing-ideas, marketing-psychology | "campaign", "multi-channel", "announcement", "launch plan" |
| **brand-guardian** | Haiku | hook-rules | Final review gate (always last in chain) |

### Skill Index by Layer

#### Ideation Layer
| Skill | Purpose | Key Patterns |
|-------|---------|--------------|
| **marketing-ideas** | 77 tactics playbook | IDEA framework, LinkedIn mastery, guerrilla tactics, Product Hunt |

#### Execution Layer (Channel-Specific)
| Skill | Purpose | Key Patterns |
|-------|---------|--------------|
| **linkedin-viral** | LinkedIn algorithm optimization | 40/30/20/10 mix, hook patterns, carousel guidelines |
| **x-viral** | X/Twitter optimization | Thread structure, engagement tactics |
| **direct-response-copy** | Conversion copy | THE SLIDE framework, SO WHAT chain |
| **landing-page-architecture** | Landing pages | 8-Section Framework |
| **seo-content** | Search optimization | SEO checklist, keyword targeting |
| **geo-content** | AI citation optimization | GEO checklist, citation-worthy format |
| **nano-banana** | Image generation | Meta/LinkedIn/Reddit ad sizes, headline overlays |
| **remotion** | Video creation | React-based video, animation patterns |

#### Foundation Layer (All Agents Use)
| Skill | Purpose | Key Patterns |
|-------|---------|--------------|
| **marketing-psychology** | 71 persuasion principles | Cognitive biases, emotional triggers |
| **hook-rules** | Anti-AI hook creation | 5 approved styles, banned patterns (no arrows, no FOMO) |

#### Utility Layer
| Skill | Purpose | Key Patterns |
|-------|---------|--------------|
| **cross-platform-repurpose** | Content transformation | LinkedIn→X, X→Email, platform mapping |
| **brand-memory** | Persistent learning | activeContext, patterns, feedback files |

### Voice Quick Reference

```
ALWAYS                          NEVER
─────────────────────────       ─────────────────────────
"Builders"                      "Users" / "Customers"
"Ship" / "Go live"              "Deploy" / "Launch"
"Just shipped"                  "We're excited to announce"
"Vibe coding"                   "No-code" (alone)
Action verbs, present           Passive voice
Specific numbers                Vague claims
Short paragraphs                Walls of text
Emoji bullets (✅🚀💡🔥⚡🎯💪🛠️)   Arrow bullets (→ ➡️ ▸)
```

### Hook Styles (5 Approved)

1. **Result-First**: Lead with outcome ("$350K saved. One app.")
2. **Builder Spotlight**: Feature a person ("Sarah launched her SaaS yesterday")
3. **Possibility Hook**: "What if..." questions
4. **Social Proof**: Numbers showing momentum ("12 apps launched this week")
5. **Direct Value**: Punchy benefit statements ("Ship faster. Iterate faster.")

### Key Frameworks

| Framework | Skill | Use For |
|-----------|-------|---------|
| **THE SLIDE** | direct-response-copy | Landing pages, emails (Situation→Limitation→Implication→Destination→Evidence) |
| **SO WHAT Chain** | direct-response-copy | Feature→Function→Financial→Emotional benefits |
| **8-Section** | landing-page-architecture | Landing pages (Hero→Pain→Solution→How→Proof→Features→FAQ→CTA) |
| **40/30/20/10** | linkedin-viral | Content mix (Personal 40%, Insights 30%, How-to 20%, Promo 10%) |
| **IDEA** | marketing-ideas | Brainstorming (Identify→Develop→Execute→Amplify) |

### Platform Specs (Ads)

| Platform | Format | Size | Headline | Primary Text |
|----------|--------|------|----------|--------------|
| Meta Feed | 4:5 | 1080×1350 | 40 chars | 130 chars |
| Meta Story | 9:16 | 1080×1920 | 40 chars | 130 chars |
| LinkedIn | 1:1 | 1200×1200 | 40 chars | 130 chars |
| Reddit | 1:1 | 1200×1200 | 300 chars | — |

### Workflow Chains

```
BRAINSTORM → marketing-ideas → (routes to execution)
PAID_AD    → ad-specialist → brand-guardian
LINKEDIN   → linkedin-specialist → brand-guardian
X          → x-specialist → brand-guardian
EMAIL      → copywriter → brand-guardian
LANDING    → copywriter → brand-guardian
SEO        → seo-specialist → brand-guardian
VIDEO      → video-specialist → brand-guardian
CAMPAIGN   → planner → [specialists ∥] → brand-guardian
```

### Memory Files

| File | Location | Purpose |
|------|----------|---------|
| activeContext.md | .claude/marketing/ | Current focus, recent work |
| patterns.md | .claude/marketing/ | What works, reusable insights |
| feedback.md | .claude/marketing/ | Pending team feedback |
| learning-log.md | brands/base44/ | Feedback patterns, corrections |
| RULES.md | brands/base44/ | Hard rules (instant rejection if violated) |

### Validation Gates

| Agent Output | Threshold | Action if Failed |
|--------------|-----------|------------------|
| Content confidence | ≥70% | Remediate before brand-guardian |
| Brand-guardian score | ≥7/10 | Pass to user |
| Brand-guardian score | 5-6/10 | Return to specialist |
| Brand-guardian score | <5/10 | Rewrite from scratch |

---

*This index follows the Vercel AGENTS.md pattern for 100% agent context retention.*
