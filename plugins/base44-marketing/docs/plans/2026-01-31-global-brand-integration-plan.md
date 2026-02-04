# Global Brand System Integration Plan

> **For Claude:** This is a research/architecture plan, not a build plan. It documents findings and recommended approach for making AGENTS.md brand rules available globally in Claude Code.

**Goal:** Make Base44 brand rules (AGENTS.md + tone-of-voice.md) available everywhere in Claude Code, not just when working in the Marketing Playbook directory.

**Research Date:** 2026-01-31

---

## Research Findings

### How Claude Code Actually Loads Context

Based on CLI analysis and project structure examination:

| Context Source | Scope | When Loaded | Priority |
|----------------|-------|-------------|----------|
| `CLAUDE.md` | Per-directory | When cd into that directory | Highest (project-specific) |
| `AGENTS.md` | Per-directory | Same as CLAUDE.md | Highest |
| `--system-prompt` | Session | CLI startup | High |
| `--append-system-prompt` | Session | CLI startup | High |
| `--settings <file-or-json>` | Session | CLI startup | High |
| Skills (`~/.claude/skills/`) | Invocation | When skill triggered | Medium |
| Plugins (`~/.claude/plugins/`) | Always | Every session | Low-Medium |

**Key Finding:** Claude Code has NO native "global rules" file that loads in EVERY directory. The CLAUDE.md/AGENTS.md pattern only works when you're IN that directory.

### Current State Analysis

| Asset | Location | When Available |
|-------|----------|----------------|
| AGENTS.md (brand index) | `/Users/oferbl/Desktop/Dev/Marketing Playbook/AGENTS.md` | Only in Marketing Playbook dir |
| tone-of-voice.md | `/Users/oferbl/Desktop/Dev/Marketing Playbook/brand/tone-of-voice.md` | Only in Marketing Playbook dir |
| brand.json | `/Users/oferbl/Desktop/Dev/Marketing Playbook/brand/brand.json` | Only in Marketing Playbook dir |
| Skill brand files | `~/.claude/skills/*/references/base44-*.md` | Only when skill invoked |

**Problem:** Brand files exist in 3 separate systems with no automatic integration.

---

## Solution Options Evaluated

### Option A: Symlink AGENTS.md to Home Directory

```bash
ln -s "/Users/oferbl/Desktop/Dev/Marketing Playbook/AGENTS.md" ~/AGENTS.md
```

**Pros:**
- Simple, one command
- AGENTS.md available when starting Claude from home

**Cons:**
- Only works when starting from ~ directory
- Doesn't work in other project directories
- Feels hacky

**Verdict:** NOT RECOMMENDED - Too limited.

### Option B: Global Settings File with System Prompt

Use Claude Code's `--settings` or `settings.json` to inject brand rules:

```json
// ~/.claude/settings.json
{
  "enabledPlugins": {...},
  "systemPrompt": "## Brand Voice\nYou are writing for Base44...",
  "appendSystemPrompt": "Always follow Base44 brand guidelines..."
}
```

**Pros:**
- Truly global - applies to every session
- Native Claude Code feature
- No symlinks or external tools

**Cons:**
- Settings.json format unclear (may not support systemPrompt)
- Would need to embed entire brand guide in JSON string
- Hard to maintain
- May conflict with other system prompts

**Verdict:** PARTIALLY RECOMMENDED - Could work but maintenance burden.

### Option C: Create a "Brand Context" Skill

Create a dedicated skill that loads brand context on demand:

```
~/.claude/skills/base44-brand/
  SKILL.md           # Trigger: "use base44 brand", "base44 voice"
  references/
    AGENTS.md        # Symlinked from Marketing Playbook
    tone-of-voice.md # Symlinked from Marketing Playbook
    brand.json       # Symlinked from Marketing Playbook
```

**Pros:**
- Works from any directory
- Invoked on demand (not always)
- Easy to maintain (single source)
- Follows existing skill pattern

**Cons:**
- Must remember to invoke
- Not automatic

**Verdict:** RECOMMENDED as primary solution.

### Option D: Update All Existing Skills to Reference Central Brand

Modify each skill (linkedin-post, pptx-generator, x-post, etc.) to read from a central brand location:

```python
# In skill SKILL.md
Read: ~/.claude/skills/_shared/brands/base44/AGENTS.md
```

**Pros:**
- Skills become brand-aware automatically
- Single source of truth

**Cons:**
- Must modify all skills
- Skills currently use hardcoded paths
- More complex maintenance

**Verdict:** RECOMMENDED as complementary solution.

### Option E: Shell Alias with --append-system-prompt

```bash
# ~/.zshrc
alias claude-brand='claude --append-system-prompt "$(cat ~/brand/AGENTS.md)"'
```

**Pros:**
- Simple to set up
- Works from any directory

**Cons:**
- Different command to remember
- Doesn't help with IDE integrations
- Token overhead every session

**Verdict:** OPTIONAL convenience.

---

## Recommended Implementation

### Primary: Create Shared Brand Skill (Option C)

**Phase 1: Set Up Shared Brand Directory**

```bash
mkdir -p ~/.claude/skills/base44-brand/references
```

**Phase 2: Symlink Brand Files**

```bash
# Core brand index (the compressed version)
ln -s "/Users/oferbl/Desktop/Dev/Marketing Playbook/AGENTS.md" \
      ~/.claude/skills/base44-brand/references/AGENTS.md

# Full voice guide
ln -s "/Users/oferbl/Desktop/Dev/Marketing Playbook/brand/tone-of-voice.md" \
      ~/.claude/skills/base44-brand/references/tone-of-voice.md

# Visual identity
ln -s "/Users/oferbl/Desktop/Dev/Marketing Playbook/brand/brand.json" \
      ~/.claude/skills/base44-brand/references/brand.json

# Quick facts (for content creation)
ln -s ~/.claude/skills/linkedin-post/references/base44-facts.md \
      ~/.claude/skills/base44-brand/references/facts.md
```

**Phase 3: Create SKILL.md**

```markdown
---
name: base44-brand
description: |
  Load Base44 brand voice and guidelines. Use when creating ANY content for Base44.

  TRIGGERS:
  - "use base44 brand" / "base44 voice"
  - "write in base44 style"
  - "create base44 content"
  - Before any marketing content creation
---

# Base44 Brand Context

This skill loads the Base44 brand voice and guidelines for content creation.

## When to Use

Invoke this skill BEFORE creating:
- Social media posts (LinkedIn, X, etc.)
- Presentations
- Marketing copy
- Product descriptions
- Any external-facing content

## Files Loaded

| File | Purpose |
|------|---------|
| `references/AGENTS.md` | Compressed brand index (read this first) |
| `references/tone-of-voice.md` | Full voice guide with examples |
| `references/brand.json` | Visual identity (colors, fonts) |
| `references/facts.md` | Stats and quotes for content |

## Usage

1. **Read AGENTS.md first** - Contains quick rules and vocabulary
2. **Reference tone-of-voice.md** - For detailed voice guidance
3. **Use facts.md** - For statistics and success stories
4. **Check brand.json** - For visual identity when needed

## Quick Reference

From AGENTS.md:

```
USE                          AVOID
--------------------------   --------------------------
"Builders"                   "Users" / "Customers"
"Ship" / "Go live"           "Deploy" / "Launch"
"Vibe coding"                "No-code" alone
"Just shipped" / "Dropped"   "We're excited to announce"
Action verbs, present        Passive voice
```

## Voice Character

Builder-first, fast-paced, results-focused. Like a cool big brother who's supportive, teaches, and occasionally teases.
```

### Secondary: Update Existing Skills (Option D)

Modify skill reference files to use symlinks or point to shared location.

**For linkedin-post skill:**

Replace `~/.claude/skills/linkedin-post/references/base44-voice.md` with a symlink:

```bash
rm ~/.claude/skills/linkedin-post/references/base44-voice.md
ln -s ~/.claude/skills/base44-brand/references/AGENTS.md \
      ~/.claude/skills/linkedin-post/references/base44-voice.md
```

**For x-post skill:**

```bash
rm ~/.claude/skills/x-post/references/base44-voice.md
ln -s ~/.claude/skills/base44-brand/references/AGENTS.md \
      ~/.claude/skills/x-post/references/base44-voice.md
```

**For pptx-generator skill:**

The pptx-generator already has its own brand folder structure. Update it to read from central location:

```bash
# Replace skill-specific brand files with symlinks
rm ~/.claude/skills/pptx-generator/brands/base44/tone-of-voice.md
ln -s ~/.claude/skills/base44-brand/references/tone-of-voice.md \
      ~/.claude/skills/pptx-generator/brands/base44/tone-of-voice.md
```

### Tertiary: Shell Alias (Option E)

Add convenience alias:

```bash
# Add to ~/.zshrc
alias cb='claude --append-system-prompt "Read ~/.claude/skills/base44-brand/references/AGENTS.md for brand voice before generating content."'
```

---

## Architecture Diagram

```
Central Brand Source (Marketing Playbook)
├── AGENTS.md (compressed brand index)
├── brand/
│   ├── tone-of-voice.md
│   ├── brand.json
│   └── learning-log.md
│
    ↓ symlinks ↓

Shared Skill (~/.claude/skills/base44-brand/)
├── SKILL.md (skill definition)
└── references/
    ├── AGENTS.md → symlink
    ├── tone-of-voice.md → symlink
    ├── brand.json → symlink
    └── facts.md → symlink

    ↓ symlinks ↓

Individual Skills
├── linkedin-post/references/base44-voice.md → symlink
├── x-post/references/base44-voice.md → symlink
├── pptx-generator/brands/base44/ → symlinks
└── remotion/references/base44-*.md → symlinks
```

---

## Benefits of This Approach

1. **Single Source of Truth**: Marketing Playbook remains the canonical location
2. **Automatic Updates**: Change AGENTS.md once, propagates everywhere via symlinks
3. **Works Anywhere**: base44-brand skill invokable from any directory
4. **Explicit Invocation**: User controls when brand context is loaded
5. **No Token Waste**: Brand context only loaded when needed
6. **Vercel Finding Maintained**: AGENTS.md in Marketing Playbook still works as expected

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Symlinks break on file move | Medium | High | Document canonical paths, use relative symlinks where possible |
| User forgets to invoke skill | High | Low | Add reminder to other skill SKILL.md files |
| Brand files out of sync | Low | Medium | All symlinks point to single source |
| Claude Code updates break skill | Low | Medium | Standard skill format, should be stable |

---

## Success Criteria

- [ ] Can invoke "base44 brand" from any directory
- [ ] Brand rules load correctly
- [ ] Existing skills (linkedin-post, pptx-generator) use centralized brand
- [ ] Changes to Marketing Playbook/AGENTS.md propagate everywhere
- [ ] No manual syncing required

---

## Next Steps

1. **Implement shared brand skill** (Phase 1-3)
2. **Update existing skill symlinks** (Secondary)
3. **Test from multiple directories**
4. **Document in Marketing Playbook README**

---

**Confidence Score: 8/10** for one-pass success

Factors:
- (+2) Clear file paths and symlink commands
- (+1) Architecture diagram shows relationships
- (+1) Risks documented with mitigations
- (+1) Existing patterns followed (skill structure)
- (-1) Untested with actual Claude Code version
- (-1) May need adjustments based on symlink behavior on macOS

Factors that could improve confidence:
- Test symlink resolution in actual Claude Code session
- Verify SKILL.md format matches current Claude Code expectations
- Confirm settings.json doesn't override skill loading
