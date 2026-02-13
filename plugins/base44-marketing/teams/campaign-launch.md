# Campaign Launch Team Template

## When to Use
Multi-channel product launch or feature announcement requiring 3+ content pieces.

## Team Structure
| Role | Agent Source | Model | Owns Files |
|------|------------|-------|------------|
| Lead (you) | planner | Opus | Campaign brief, final synthesis |
| Teammate 1 | linkedin-specialist | Sonnet | output/linkedin/ |
| Teammate 2 | x-specialist | Sonnet | output/x/ |
| Teammate 3 | copywriter (email) | Sonnet | output/email/ |
| Teammate 4 | seo-specialist | Sonnet | output/blog/ |
| Teammate 5 | brand-guardian | Haiku | Reviews all output/ files |

## Spawn Prompts
Each teammate gets:
1. Campaign brief (from lead's planning phase)
2. Brand context (RULES.md + tone-of-voice.md)
3. Channel-specific skill instructions
4. Output directory assignment (prevents file conflicts)

## Task Breakdown Pattern
1. Lead creates campaign brief (2-3 tasks)
2. Specialists generate content in parallel (1 task each, own directory)
3. Brand guardian reviews all outputs sequentially (1 task per piece)
4. Lead synthesizes final campaign package

## File Ownership (CRITICAL — Prevents Conflicts)
```
output/
├── campaign-brief.md          ← Lead only
├── linkedin/
│   ├── post-1.md              ← linkedin-specialist only
│   └── carousel-notes.md      ← linkedin-specialist only
├── x/
│   ├── thread.md              ← x-specialist only
│   └── standalone-tweets.md   ← x-specialist only
├── email/
│   ├── announcement.md        ← copywriter only
│   └── nurture-sequence.md    ← copywriter only
├── blog/
│   └── launch-post.md         ← seo-specialist only
└── reviews/
    └── guardian-report.md      ← brand-guardian only
```
