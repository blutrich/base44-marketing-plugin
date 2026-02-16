# OpenClaw Patterns Research

**Date:** 2026-02-15
**Source:** https://github.com/openclaw/openclaw
**Purpose:** Extract patterns for the Base44 marketing plugin content pipeline

## 1. HEARTBEAT.md Pattern

OpenClaw runs a periodic agent turn (default: 30 min) in the main session. The agent reads `HEARTBEAT.md` as a checklist and acts on it.

**Key behaviors:**
- If nothing needs attention: reply `HEARTBEAT_OK` (suppressed — user never sees it)
- If something needs attention: surface it as an alert
- Checklist is a simple markdown file the agent can also update
- Config: `agents.defaults.heartbeat.every`, `activeHours`, `target`
- Empty `HEARTBEAT.md` = skip heartbeat (saves API calls)

**Example HEARTBEAT.md:**
```md
# Heartbeat checklist
- Quick scan: anything urgent in inboxes?
- If it's daytime, do a lightweight check-in
- If a task is blocked, write down what is missing
```

**Relevance:** Could become `CONTENT_HEARTBEAT.md` — the plugin checks the feature pipeline periodically and flags what needs content.

## 2. Cron vs Heartbeat — Two Scheduling Modes

| Pattern | When | Session | Use for |
|---------|------|---------|---------|
| Heartbeat | Every 30m, batches checks | Main session (full context) | Monitoring, awareness |
| Cron | Exact times | Isolated session (clean) | Weekly reports, scheduled tasks |

**Cron features:**
- Three schedule kinds: `at` (one-shot), `every` (interval ms), `cron` (5-field expression + tz)
- Session isolation: `cron:<jobId>` sessions don't pollute main history
- Model overrides per job (use cheaper model for routine tasks)
- Delivery modes: `announce` (summary to channel) or `none` (internal only)
- Persisted at `~/.openclaw/cron/jobs.json`
- Exponential retry backoff for failures

**Relevance:** Weekly content calendar generation = cron. Feature pipeline monitoring = heartbeat.

## 3. Two-Layer Memory

```
memory/YYYY-MM-DD.md  ← Daily log (append-only, read today + yesterday)
MEMORY.md             ← Curated long-term (manually maintained)
```

**Key behaviors:**
- Daily logs are append-only — cheap to write, give history trail
- `MEMORY.md` is curated wisdom — only load in private session
- Vector search (BM25 + embeddings) over memory files via QMD sidecar
- Hybrid search: vector for semantic, BM25 for exact tokens

**Relevance:** Marketing plugin could adopt `log/YYYY-MM-DD.md` (daily content log) + `MEMORY.md` (curated brand intelligence).

## 4. Memory Flush Before Compaction

When session nears auto-compaction, OpenClaw triggers a **silent agent turn**:

```
DEFAULT_MEMORY_FLUSH_PROMPT:
"Pre-compaction memory flush. Store durable memories now.
Use memory/YYYY-MM-DD.md; create memory/ if needed.
APPEND new content only — do not overwrite existing entries.
If nothing to store, reply with NO_REPLY."
```

**Implementation details (from `memory-flush.ts`):**
- Soft threshold: triggers at `contextWindow - reserveTokensFloor - softThresholdTokens`
- Default: 4000 tokens before compaction
- One flush per compaction cycle (tracked in sessions.json)
- Skipped if workspace is read-only
- `ensureNoReplyHint()` appends NO_REPLY hint if not in prompt

**Relevance:** Critical for long marketing sessions — ensures brand learnings survive compaction.

## 5. AGENTS.md Pattern

OpenClaw's `AGENTS.md` (~17K chars) is the single source of project truth:

**Key sections:**
- Project structure and module organization
- Build/test/development commands
- Coding style and naming conventions
- Security and configuration tips
- Multi-agent safety rules
- Agent-specific vocabulary normalizations
- Version locations across all files
- Shorthand commands (e.g., `sync` = commit + pull --rebase + push)

**Multi-agent safety rules (critical for team use):**
- "Do not create/apply/drop git stash unless explicitly requested"
- "Assume other agents may be working; keep unrelated WIP untouched"
- "When user says 'commit', scope to your changes only"
- "Focus reports on your edits; avoid guard-rail disclaimers unless truly blocked"
- "When multiple agents touch the same file, continue if safe"

**Relevance:** Marketing plugin's CLAUDE.md should adopt multi-agent safety for team workflows.

## 6. Git as Source of Truth

OpenClaw philosophy: **Markdown stays the source of truth.**
- Memory, config, agent rules, skills — all plain files in git-trackable workspace
- No database needed
- QMD indexes markdown files but doesn't replace them
- `memory_search` returns snippets; `memory_get` reads the actual file

**Relevance:** Content pipeline data (API snapshots, briefs, calendar) should be git-tracked `.md` files.

## 7. Multi-User / Multi-Agent Model

OpenClaw uses per-agent workspaces:
- Each agent has own workspace, own session store, own auth profiles
- Routing binds messages to agents via peer/guild/team/channel rules
- Session keys scope conversations: `agent:<id>:<mainKey>`
- `per-channel-peer` mode prevents cross-user context leaks

**Plugin ownership layers (for Base44 marketing team):**
| Layer | Owner | Changes by |
|-------|-------|-----------|
| Plugin core (skills, agents, brand) | Maintainer | PRs to plugin repo |
| Brand assets (RULES.md, voice, tokens) | Marketing lead | Deliberate updates |
| Pipeline data (API snapshots, briefs) | Shared (auto-generated) | Plugin execution |
| Generated content (posts, emails) | Each team member | Per-session |
| Session memory | Each team member | Auto per-session |

## 8. Lobster — Deterministic Workflows with Approvals

OpenClaw's workflow runtime for multi-step tool pipelines:
- Resumable runs with human checkpoints
- Approval gates for side effects
- Pairs with cron/heartbeat: cron decides WHEN, Lobster decides WHAT

**Relevance:** Content pipeline could use approval gates: brief generated → human approves → content agent executes → brand guardian validates.
