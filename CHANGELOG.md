# Changelog

All notable changes to the base44-marketing plugin.

## [1.8.0] - 2026-02-09

### Added
- **GTM Strategist agent** (`gtm-strategist`) - Deep strategic exploration before planning
  - 4-phase workflow: Discovery, Synthesis, Holistic Plan, Execution Handoff
  - Opus model for complex reasoning
  - No bulleted idea dumps -- connected narratives only
- **GTM_STRATEGY workflow** in marketing-router - Routes strategic requests
- **DATA_INSIGHT workflow** in marketing-router - Routes to builder analytics (Phase 2)
- **Anti-TV-Ad Cadence rules** across all agents and skills
  - Injected into: linkedin-specialist, x-specialist, copywriter, ad-specialist, seo-specialist
  - Added to brand-guardian checklist
  - Added to hook-rules banned patterns
- **Anti-Advertising Patterns** section in tone-of-voice.md
  - The TV-Ad Test
  - The Maor Test
  - DON'T/DO examples for founder voice
- **Shay's feedback** logged in learning-log.md (6 key areas, full strategic direction)
- **5 new rules** in RULES.md:
  - No TV-ad tagline cadence (NEVER)
  - No bulleted idea lists as final output (NEVER)
  - No advertising melody (NEVER)
  - Sound like Maor (ALWAYS)
  - Holistic plans over idea dumps (ALWAYS)

### Changed
- **Marketing router redesigned** - Open-ended first interaction, no menu
  - Phase 1: Natural conversation (no forced categories)
  - Phase 2: Intent classification with keyword fallback
- **Brainstorm workflow updated** - Connected narrative output, not bullet lists
- **Hook-rules updated** - Direct Value hook example fixed (was using TV-ad cadence)
- **CLAUDE.md updated** - New agent, workflows, voice quick reference
- Bumped version to 1.8.0 (20 NEVER + 9 ALWAYS rules)

### Contributors
- Shay (Head of Marketing) - Strategic direction, tone feedback, data pipeline vision
- Ofer - Plugin architecture

## [1.7.0] - 2026-02-03

### Added
- **Claude Code Hooks** (`.claude-plugin/hooks.json`)
  - `PostToolUse` - Notification after agent tasks complete
  - `Stop` - Session logging to `~/.claude/marketing/session-log.txt`
- **Plugin Settings** (`.claude-plugin/settings.json`)
  - Pre-configured permissions for brand/skill/agent file access
  - Memory directory auto-creation allowed
  - Destructive git commands blocked by default
  - Environment variables for version and default brand

### Changed
- Bumped version to 1.7.0

## [1.6.0] - 2026-02-02

### Added
- **Hook Rules skill** (`hook-rules`) - Anti-AI hook patterns
  - 5 approved hook styles (Result-First, Builder Spotlight, Possibility, Social Proof, Direct Value)
  - Banned patterns (arrows, FOMO, contrarian, negative framing)
  - Approved emoji bullets vs. arrow bullets
  - Quick reference card for hook validation
- **Cross-Platform Repurpose skill** (`cross-platform-repurpose`)
  - LinkedIn → X (Tweet and Thread) transformations
  - LinkedIn → Email transformations
  - LinkedIn → Discord transformations
  - X → LinkedIn expansion
  - Platform-specific transformation prompts
- **Enhanced Brand Memory** - Feedback learning system
  - The Learning Loop (generate → review → feedback → pattern → rules)
  - Pattern detection with confidence levels (LOW → MEDIUM → HIGH → RULE)
  - Automatic pattern promotion after 5+ occurrences
  - Improvement tracking metrics
- **REPURPOSE workflow** in marketing-router

### Changed
- Updated `brand-guardian` with hook validation checks
- Updated `marketing-router` with REPURPOSE workflow and new skill references
- Enhanced skill hierarchy diagram with new skills
- Bumped version to 1.6.0

### Source
Content integrated from [Ripple](https://github.com/blutrich/Ripple) repository:
- `HOOK-CREATION-RULES.md`
- `CROSS-PLATFORM-REPURPOSE.md`
- `FEEDBACK-LEARNING-SYSTEM.md`

## [1.1.0] - 2026-02-01

### Added
- **X/Twitter skill** (`x-viral`) - Full platform optimization
- **X specialist agent** - Content creation for X
- **Marketing Ideas skill** - 77+ tactics with playbooks
  - Main playbook (77 tactics)
  - LinkedIn playbook
  - Guerrilla playbook
  - Product Hunt playbook
  - I.D.E.A. framework
- **Marketing Psychology skill** - 71 persuasion principles
- **Anti-AI patterns** - Based on Lora's feedback
- **Team learning system** - Contributors can update memory
- **Skill hierarchy diagram** in marketing-router

### Changed
- Updated `marketing-router` with BRAINSTORM workflow
- Enhanced `tone-of-voice.md` with anti-AI section
- Updated agents with anti-AI checklists
- Enhanced `templates/x.md` with full examples

### Contributors
- Lora (Content Manager) - Anti-AI patterns, voice clarifications
- Ofer - Plugin architecture

## [1.0.0] - 2026-01-31

### Added
- Initial release
- Marketing router with workflow detection
- LinkedIn, Email, SEO, Landing page skills
- Brand memory system
- Brand guardian quality gate

---

## How to Update

```bash
# Pull latest changes
cd /path/to/base44-marketing
git pull origin main

# Or reinstall
/plugin update base44-marketing
```

User memory in `~/.claude/marketing/` is preserved during updates.
