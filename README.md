# Base44 Marketing Plugin

> Orchestrated content creation with 8 brand-aware agents, 14 specialized skills, and evolving memory.

## Installation

### Quick Install (Recommended)

```bash
/plugin install github:blutrich/base44-marketing-plugin
```

### Via Marketplace

```bash
# Add the marketplace (one-time)
/plugin marketplace add blutrich/base44-marketing-plugin

# Install the plugin
/plugin install base44-marketing@blutrich-base44-marketing-plugin
```

### Update to Latest

```bash
/plugin update base44-marketing
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
        └── CAMPAIGN → planner → [specialists] → brand-guardian
```

## Skills (14)

| Skill | Purpose |
|-------|---------|
| `marketing-router` | Entry point - routes to workflows |
| `marketing-ideas` | 77+ tactics with playbooks |
| `marketing-psychology` | 71 persuasion principles |
| `linkedin-viral` | LinkedIn optimization |
| `x-viral` | X/Twitter optimization |
| `direct-response-copy` | THE SLIDE framework |
| `seo-content` | Search optimization |
| `geo-content` | AI citation (GEO) |
| `landing-page-architecture` | 8-Section Framework |
| `hook-rules` | Anti-AI hook creation rules |
| `cross-platform-repurpose` | Content transformation |
| `brand-memory` | Persistent learning |
| `remotion` | Video creation in React |
| `nano-banana` | AI image generation (Imagen 3) |

## Agents (8)

| Agent | Model | Purpose |
|-------|-------|---------|
| `ad-specialist` | Sonnet | Paid ads (Meta, LinkedIn, Reddit) |
| `linkedin-specialist` | Sonnet | Viral LinkedIn content |
| `x-specialist` | Sonnet | X/Twitter content |
| `copywriter` | Sonnet | Emails, landing pages |
| `seo-specialist` | Sonnet | Blog, SEO content |
| `video-specialist` | Sonnet | Remotion videos + AI imagery |
| `planner` | Sonnet | Multi-channel campaigns |
| `brand-guardian` | Haiku | Quality gate (fast reviews) |

## Usage

```bash
# LinkedIn post
Create a LinkedIn post about our new AI feature

# X/Twitter thread
Write a thread about the $1M ARR milestone

# Paid ad
Create a Meta feed ad for our AI feature

# Brainstorm ideas
I need marketing ideas to amplify our product launch

# Full campaign
Plan a multi-channel campaign for our native app launch
```

## Brand Voice

**BUILDER-FIRST | FAST-PACED | RESULTS-FOCUSED**

| USE | AVOID |
|-----|-------|
| "Builders" | "Users" / "Customers" |
| "Ship" / "Go live" | "Deploy" / "Launch" |
| "Vibe coding" | "No-code" alone |
| "Just shipped" | "We're excited to announce" |
| Action verbs, present tense | Passive voice |

## Hook Styles (5 Approved)

1. **Result-First**: Lead with outcome ("$350K saved. One app.")
2. **Builder Spotlight**: Feature a person ("Sarah launched her SaaS yesterday")
3. **Possibility Hook**: "What if..." questions
4. **Social Proof**: Numbers showing momentum ("12 apps launched this week")
5. **Direct Value**: Punchy benefit statements ("Ship faster. Iterate faster.")

## Memory System

### Plugin Core (versioned)
```
skills/         # Skill definitions
agents/         # Agent configs
brands/base44/  # Brand guidelines
```

### User Memory (preserved on updates)
```
~/.claude/marketing/
├── activeContext.md    # Current focus
├── patterns.md         # What works
├── feedback.md         # Pending reviews
└── learning-log.md     # Team feedback
```

## File Structure

```
base44-marketing-plugin/
├── .claude-plugin/
│   └── plugin.json         # Plugin metadata
├── CLAUDE.md               # Plugin instructions
├── README.md               # This file
├── skills/
│   ├── marketing-router/
│   ├── marketing-ideas/
│   ├── marketing-psychology/
│   ├── linkedin-viral/
│   ├── x-viral/
│   ├── direct-response-copy/
│   ├── seo-content/
│   ├── geo-content/
│   ├── landing-page-architecture/
│   ├── hook-rules/
│   ├── cross-platform-repurpose/
│   ├── brand-memory/
│   ├── remotion/
│   └── nano-banana/
├── agents/
│   ├── ad-specialist.md
│   ├── linkedin-specialist.md
│   ├── x-specialist.md
│   ├── copywriter.md
│   ├── seo-specialist.md
│   ├── video-specialist.md
│   ├── planner.md
│   └── brand-guardian.md
└── brands/
    └── base44/
        ├── tone-of-voice.md
        ├── learning-log.md
        ├── AGENTS.md
        └── templates/
```

## Anti-AI Patterns

**DON'T:**
- Arrows (→) in lists
- Too many bullet points
- Overly choppy sentences
- Repeated phrases every post

**DO:**
- Natural sentence flow
- Varied structure
- Conversational tone
- Occasional imperfection OK

---

*Version 1.7.0 | Router → Agent Chains → Quality Gate*
