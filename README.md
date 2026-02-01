# Base44 Marketing Plugin

> Orchestrated content creation with brand-aware sub-agents and evolving memory.

## Installation

### For Team Members (Recommended)

```bash
# Step 1: Add the marketplace (one-time)
/plugin marketplace add blutrich/base44-marketing-plugin

# Step 2: Install the plugin
/plugin install base44-marketing@blutrich-base44-marketing-plugin

# Step 3: Verify installation
/plugin list
```

### Alternative: Direct GitHub Install

```bash
/plugin install github:blutrich/base44-marketing-plugin
```

### Update to Latest Version

```bash
# Update the marketplace first
/plugin marketplace update blutrich-base44-marketing-plugin

# Then update the plugin
/plugin update base44-marketing@blutrich-base44-marketing-plugin
```

### Interactive UI

```bash
/plugin  # Opens tabbed interface
# Navigate to Marketplaces tab (Tab key)
# Add: blutrich/base44-marketing-plugin
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MARKETING-ROUTER (Entry Point)               │
└─────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐    ┌───────────────────┐    ┌──────────────────┐
│ IDEATION      │    │  EXECUTION        │    │ FOUNDATION       │
│ marketing-    │───▶│ linkedin-viral    │◀───│ marketing-       │
│ ideas (77+)   │    │ x-viral           │    │ psychology (71)  │
│               │    │ seo-content       │    │ brand-voice      │
└───────────────┘    └───────────────────┘    └──────────────────┘
                                 │
                                 ▼
                     ┌───────────────────┐
                     │  brand-guardian   │
                     └───────────────────┘
```

## Skills

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
| `brand-memory` | Persistent learning |
| `remotion` | Video creation in React |
| `nano-banana` | AI image generation (Imagen 3) |

## Agents

| Agent | Purpose |
|-------|---------|
| `linkedin-specialist` | Viral LinkedIn content |
| `x-specialist` | X/Twitter content |
| `copywriter` | Emails, landing pages |
| `seo-specialist` | Blog, SEO content |
| `brand-guardian` | Quality gate |
| `planner` | Multi-channel campaigns |
| `video-specialist` | Remotion videos + AI imagery |

## Usage

```bash
# LinkedIn post
Create a LinkedIn post about our new AI feature

# X/Twitter thread
Write a thread about the $1M ARR milestone

# Brainstorm ideas
I need marketing ideas to amplify our product launch

# Full campaign
Plan a multi-channel campaign for our native app launch
```

## Brand Voice (3 Words)

**BUILDER-FIRST | FAST-PACED | RESULTS-FOCUSED**

## Quick Rules

| USE | AVOID |
|-----|-------|
| "Builders" | "Users" / "Customers" |
| "Ship" / "Go live" | "Deploy" / "Launch" |
| "Vibe coding" | "No-code" alone |
| "Just shipped" / "Dropped" | "We're excited to announce" |
| Action verbs, present tense | Passive voice |

## Evolving Memory

The plugin maintains learning in two places:

### Plugin Core (versioned, updated via git)
```
skills/         # Skill definitions
agents/         # Agent configs
brands/base44/  # Brand guidelines
```

### User Memory (persisted, not overwritten)
```
~/.claude/marketing/
├── activeContext.md    # Current focus
├── patterns.md         # What works
├── feedback.md         # Pending reviews
└── learning-log.md     # Team feedback (synced from brand)
```

## Team Contributions

Team members can add feedback:

1. **In conversation:** Say "add to memory: [feedback]"
2. **Direct edit:** Update `learning-log.md` or `patterns.md`
3. **PR to repo:** For permanent skill/agent updates

## Updating

```bash
# Update to latest version
/plugin update base44-marketing
```

### What Gets Updated vs Preserved

| Component | On Update | Location |
|-----------|-----------|----------|
| Skills | **Overwritten** | `skills/` |
| Agents | **Overwritten** | `agents/` |
| Brand guidelines | **Overwritten** | `brands/base44/` |
| Learning log (team) | **Overwritten** | `brands/base44/learning-log.md` |
| User session data | **Preserved** | `~/.claude/marketing/` |

## Anti-AI Patterns

Based on team feedback (Lora, 2026-02-01):

**DON'T:**
- Arrows (→) in lists - outdated
- Too many bullet points
- Overly choppy sentences
- Repeated phrases every post

**DO:**
- Natural sentence flow
- Varied structure
- Conversational tone
- Occasional imperfection OK

## File Structure

```
base44-marketing/
├── .claude-plugin/
│   └── plugin.json         # Plugin metadata
├── CLAUDE.md               # Plugin instructions
├── README.md               # This file
├── skills/
│   ├── marketing-router/   # Entry point
│   ├── marketing-ideas/    # Ideation + playbooks
│   ├── marketing-psychology/
│   ├── linkedin-viral/
│   ├── x-viral/
│   ├── direct-response-copy/
│   ├── seo-content/
│   ├── geo-content/
│   ├── landing-page-architecture/
│   ├── brand-memory/
│   ├── remotion/
│   └── nano-banana/
├── agents/
│   ├── linkedin-specialist.md
│   ├── x-specialist.md
│   ├── copywriter.md
│   ├── seo-specialist.md
│   ├── brand-guardian.md
│   ├── planner.md
│   └── video-specialist.md
└── brands/
    └── base44/
        ├── tone-of-voice.md
        ├── learning-log.md
        ├── AGENTS.md
        └── templates/
```

## Team

| Role | Person |
|------|--------|
| Brand Lead | Shay |
| Content | Tiffany, Lora |
| Social | Lora |

---

*Version 1.4.0 | Following cc10x patterns: Router → Agent Chains → Quality Gate*
