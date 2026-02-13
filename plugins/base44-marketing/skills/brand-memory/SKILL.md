---
name: brand-memory
description: |
  Manages brand context and learning across sessions. Persists patterns, feedback, and improvements.

  Triggers on: memory, learning, patterns, feedback, what worked, what didn't, brand context.
---

# Brand Memory System

Persistent memory for marketing content creation. Tracks what works, what doesn't, and patterns learned.

## Contents

- [Initialization](#initialization)
- [Memory Files](#memory-files)
- [Operations](#operations)
- [Learning Loop](#learning-loop)
- [Reference Files](#reference-files)

---

## Initialization

**IRON LAW:** Memory files MUST exist before any content work.

```bash
Bash(command="mkdir -p .claude/marketing")
```

Check and create missing files:
```
Read(file_path=".claude/marketing/activeContext.md")
Read(file_path=".claude/marketing/patterns.md")
Read(file_path=".claude/marketing/feedback.md")
```

If any file missing, create from templates in [reference/templates.md](reference/templates.md).

---

## Memory Files

### Location Structure

| Location | Purpose | On Plugin Update |
|----------|---------|------------------|
| `brands/base44/` | Team data (git) | Overwritten |
| `.claude/marketing/` | User data (local) | **Preserved** |

### File Purposes

| File | Purpose |
|------|---------|
| `activeContext.md` | Current campaign, recent work, key messages |
| `patterns.md` | Phrases that work/avoid, channel patterns |
| `feedback.md` | Pending reviews, debug attempts |

### Guaranteed Anchors

Each file has required headers. If missing, file is corrupted - recreate from template.

**activeContext.md:** `## Current Focus`, `## Recent Content`, `## Last Updated`
**patterns.md:** `## Phrases That Work`, `## Phrases to AVOID`, `## Pattern Tracking`
**feedback.md:** `## Awaiting Review`, `## Recent Feedback`, `## Debug Attempts`

---

## Operations

### Read-Edit-Verify Cycle (MANDATORY)

```
1. Read(file_path=".claude/marketing/{file}.md")      # Load current
2. Edit(file_path=".claude/marketing/{file}.md", ...) # Make change
3. Read(file_path=".claude/marketing/{file}.md")      # VERIFY applied
```

**NEVER skip step 3.** Edits can fail silently.

For detailed operations, see [reference/operations.md](reference/operations.md).

---

## Learning Loop

```
GENERATE → REVIEW → FEEDBACK → PATTERN DETECT → RULES UPDATE → GENERATE
```

### Pattern Promotion

| Count | Status | Action |
|-------|--------|--------|
| 1 | Logged | Watching |
| 2 | **PROMOTE** | Auto-add to RULES.md |
| 3+ | Rule | Enforced by brand-guardian |

For full learning system, see [reference/learning-loop.md](reference/learning-loop.md).

---

## Team Contributors

| Name | Role | Focus |
|------|------|-------|
| Lora | Content Manager | Voice, social posts |
| Tiffany | Product Marketing | Feature announcements |
| Maor | Founder | Final approval |

---

## Agent Teams Memory Integration

When running Agent Teams, memory follows the [Team Memory Protocol](../../teams/memory-protocol.md):

- **During team work:** All teammates read brand context from `brands/base44/` and `.claude/marketing/` (read-only). Only the lead writes to memory files.
- **Post-team:** Lead updates `activeContext.md` with campaign results, `patterns.md` with what worked. Guardian findings append to `learning-log.md`.
- **Isolation rule:** Teammates MUST NOT write to `.claude/marketing/`, `brands/base44/`, other teammates' output directories, or plugin source files.

---

## Reference Files

| File | Content |
|------|---------|
| [reference/templates.md](reference/templates.md) | File templates with anchors |
| [reference/operations.md](reference/operations.md) | Memory CRUD operations |
| [reference/learning-loop.md](reference/learning-loop.md) | Pattern detection & promotion |

---

## Session Checklist

```
- [ ] mkdir .claude/marketing/
- [ ] Check activeContext.md exists
- [ ] Check patterns.md exists
- [ ] Check feedback.md exists
- [ ] Verify all anchors present
- [ ] Load brand context
```

**Only after ALL checks pass: Begin content work.**
