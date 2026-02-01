# Active Context

## Current Focus
Global brand integration complete. Ready for content generation.

## Completed
- Global brand skill created at `~/.claude/skills/base44-brand/`
- All brand files symlinked from Marketing Playbook
- Existing skills updated to use shared brand (linkedin-post, x-post, pptx-generator)
- ai-marketing-agent repo synced locally

## Architecture

```
Marketing Playbook (Source of Truth)
├── AGENTS.md
├── brand/
│   ├── tone-of-voice.md
│   ├── brand.json
│   └── learning-log.md
│
    ↓ symlinks ↓

~/.claude/skills/base44-brand/ (Global Skill)
├── SKILL.md
└── references/
    ├── AGENTS.md → symlink
    ├── tone-of-voice.md → symlink
    ├── brand.json → symlink
    └── facts.md → symlink

    ↓ symlinks ↓

Individual Skills
├── linkedin-post/references/base44-voice.md → symlink
├── x-post/references/base44-voice.md → symlink
└── pptx-generator/brands/base44/tone-of-voice.md → symlink
```

## How to Use

**From any directory:**
- Say "use base44 brand" or "base44 voice" to load brand context
- LinkedIn/X/PPTX skills automatically use centralized brand

**Generate content:**
```bash
cd ~/Desktop/Dev/ai-marketing-agent/server
uvicorn server.main:app --reload --port 8000
# POST /generate-content with content_type and prompt
```

## Next Steps
1. [ ] Shay validation interview (guide at `Interview Guide - Shay Brand Discovery.md`)
2. [ ] Test content generation with synced system
3. [ ] Activate learning loop (log feedback → extract patterns → update AGENTS.md)

## Last Updated
2026-01-31
