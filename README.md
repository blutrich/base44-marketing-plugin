# Base44 Marketing Playbook

Brand guidelines and AI-powered content generation system for Base44.

## What This Is

A single source of truth for Base44's brand voice, enabling consistent content generation across all channels using Claude Code.

## Quick Start

```bash
# In any directory with Claude Code
> use base44 brand

# Or invoke specific skills
> /linkedin-post
> /x-post
> /pptx-generator
```

## Structure

```
├── AGENTS.md                 # Compressed brand index (AI reads this first)
├── brand/
│   ├── tone-of-voice.md      # Full voice guide
│   ├── brand.json            # Visual identity (colors, fonts)
│   ├── learning-log.md       # Feedback patterns from team
│   └── templates/            # Channel-specific templates
├── transcriptions/           # Team interview research
└── docs/plans/               # Integration plans
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

## How It Works

1. **AGENTS.md** loads automatically when working in this directory
2. **Skills** (linkedin-post, x-post, pptx-generator) use symlinked brand files
3. **Learning loop** captures feedback → updates patterns → improves future content

## Content Generation

| Channel | Skill | Command |
|---------|-------|---------|
| LinkedIn | linkedin-post | `/linkedin-post` |
| X/Twitter | x-post | `/x-post` |
| Presentations | pptx-generator | `/pptx-generator` |
| Carousels | pptx-generator | "create carousel about X" |

## Global Access

Brand voice is available from any directory via the `base44-brand` skill:

```
~/.claude/skills/base44-brand/  →  symlinks to this repo
```

## Learning Loop

When team reviews content:
1. Approved patterns → logged in `brand/learning-log.md`
2. After 3+ similar patterns → AGENTS.md updates
3. Future content follows proven patterns

## Team

| Role | Person |
|------|--------|
| Brand Lead | Shay |
| Content | Tiffany, Lora |
| Social | Laura |

---

*Synced with: [ai-marketing-agent](https://github.com/blutrich/ai-marketing-agent)*
