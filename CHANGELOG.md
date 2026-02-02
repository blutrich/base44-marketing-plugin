# Changelog

All notable changes to the base44-marketing plugin.

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
