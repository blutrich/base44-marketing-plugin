# OpenClaw-Inspired Pipeline Redesign -- Implementation Plan

> **For Claude:** REQUIRED: Follow this plan task-by-task. Each task includes exact file paths and content.
> **Predecessor:** `docs/plans/2026-02-15-api-content-pipeline-plan.md` (API pipeline -- still valid, execute first)
> **Research:** `docs/research/2026-02-15-openclaw-patterns-research.md` (8 patterns extracted from OpenClaw)

**Goal:** Upgrade the Base44 marketing plugin from a single-session content tool to a persistent, self-learning, multi-user content pipeline with heartbeat monitoring, two-layer memory, git-tracked pipeline data, compaction safety, team file permissions, expanded CLAUDE.md, and an 8-stage content lifecycle.

**Architecture:** Eight OpenClaw-inspired patterns layered onto the existing plugin. The API content pipeline plan (predecessor) handles data fetch and content brief generation. This plan adds the operational infrastructure around it: scheduling, memory, versioning, learning, and multi-user safety.

**Tech Stack:** .md files only (no custom code). Relies on existing plugin runtime (Claude Code plugin system), git for versioning, curl for API calls, and the brand-memory skill for learning persistence.

**Prerequisites:**
- API Content Pipeline plan (`docs/plans/2026-02-15-api-content-pipeline-plan.md`) Tasks 1.1-1.4 COMPLETE (data-intelligence skill exists)
- Plugin version >= 1.9.0
- Team members identified: Lora (content), Assaf (product), Tiffany (product marketing), Shira (growth), Ofer (maintainer)

---

## What's NEW vs What the API Pipeline Plan Already Covers

| Pattern | Status | This Plan Adds |
|---------|--------|----------------|
| 1. CONTENT_HEARTBEAT.md | NEW | Checklist file the plugin reads on trigger to detect pipeline-worthy features |
| 2. Two-Layer Memory | PARTIALLY EXISTS (brand-memory skill has `.claude/marketing/` files) | Adds daily append-only log at `.claude/marketing/log/YYYY-MM-DD.md` + curated `MEMORY.md` with structured schema |
| 3. Git-Tracked Pipeline Data | NEW | `data/pipeline/` directory with dated scan, brief, and calendar files |
| 4. Compaction Flush Template | NEW | `COMPACTION_FLUSH.md` ensuring brand learnings survive long sessions |
| 5. Multi-User Safety | PARTIALLY EXISTS (teams/memory-protocol.md defines isolation) | Adds explicit file permissions matrix for Lora/Assaf/Tiffany/Shira/Ofer |
| 6. CLAUDE.md Expansion | PARTIALLY EXISTS (CLAUDE.md has architecture block) | Adds Feature entity schema, 8-stage diagram, multi-agent safety rules, data source registry |
| 7. Self-Learning System | PARTIALLY EXISTS (learning-log.md has pattern promotion) | Adds confidence scores, automated redistribution, brand-guardian -> rules feedback loop |
| 8. 8-Stage Pipeline | NEW (API pipeline plan covers stages 1-5 informally) | Formal state machine: data_fetch -> brief_generation -> content_planning -> content_creation -> brand_review -> publish -> track -> learn |

---

## Architecture Decision Records

### ADR-007: Heartbeat File vs Cron-Based Pipeline Trigger

**Context:** OpenClaw offers two scheduling modes: heartbeat (periodic checks within main session) and cron (isolated scheduled sessions). The marketing plugin runs in Claude Code, which does not support cron. The plugin needs a way to check the feature pipeline without the user manually asking.

**Decision:** Use a `CONTENT_HEARTBEAT.md` checklist file that the router reads when the plugin loads or when the user triggers a session. This is a pull model (read file, act on it) rather than a push model (cron fires automatically). The file can also be read by any agent that needs to check pipeline state.

**Consequences:**
- **Positive:** Works within plugin constraints (no cron needed). File is editable by maintainer. Agents can check it proactively. Git-tracked.
- **Negative:** Not truly periodic -- depends on user starting a session. Cannot auto-fire at 9 AM Monday.
- **Alternatives Considered:** True cron (not available in plugin runtime); user-triggered-only (current state, no heartbeat awareness); external scheduler calling the plugin (over-engineering for current scale).

### ADR-008: Two-Layer Memory vs Single Memory File

**Context:** The current brand-memory skill uses three files (`activeContext.md`, `patterns.md`, `feedback.md`) in `.claude/marketing/`. These are session-focused. There is no historical log of what was created, when, or for which features. Long sessions lose context on compaction.

**Decision:** Add two new layers: (1) daily append-only logs at `.claude/marketing/log/YYYY-MM-DD.md` that record what happened each day (content created, features pulled, approvals received), and (2) a curated `MEMORY.md` at `.claude/marketing/MEMORY.md` with a structured schema for long-term brand intelligence.

**Consequences:**
- **Positive:** Full audit trail of content creation. Curated memory survives compaction and session resets. Aligns with OpenClaw's proven two-layer approach. Existing `.claude/marketing/` files continue working.
- **Negative:** More files to maintain. Daily logs accumulate (mitigated: append-only, no cleanup needed). Overlap with existing `patterns.md` (mitigated: MEMORY.md is structured schema, patterns.md is tabular tracking).
- **Alternatives Considered:** Replace existing memory files (too disruptive, existing files serve agent needs); single MEMORY.md only (loses daily audit trail); database (not available in .md-only plugin).

### ADR-009: Git-Tracked Pipeline Data vs Ephemeral Pipeline Output

**Context:** Currently, when the data-intelligence skill runs, it fetches features and presents them in the conversation. This output is ephemeral -- it disappears when the session ends. There is no record of what was scanned, what briefs were generated, or what the content calendar looked like on a given date.

**Decision:** Create a `data/pipeline/` directory with dated files: `YYYY-MM-DD-feature-scan.md` (raw API scan results), `YYYY-MM-DD-content-briefs.md` (generated briefs), `YYYY-MM-DD-content-calendar.md` (calendar presented to marketeer). These are auto-generated by the data-intelligence skill and committed to git.

**Consequences:**
- **Positive:** Full history of pipeline runs. Git blame shows who ran what when. Briefs are reusable across sessions. Calendar is reviewable offline.
- **Negative:** Directory accumulates files (mitigated: daily files are small, git handles well). Must remember to commit.
- **Alternatives Considered:** Keep ephemeral only (loses history); save to `.claude/marketing/` (not git-tracked, local only); save to Obsidian (external dependency).

### ADR-010: File Permissions Matrix for Multi-User Safety

**Context:** The plugin is used by 5 people (Lora, Assaf, Tiffany, Shira, Ofer). Currently, teams/memory-protocol.md defines isolation for Agent Teams workflows, but there are no explicit rules about who can edit what in regular sessions. A content manager editing agent prompts or a growth marketer overwriting brand rules could break the system.

**Decision:** Define a 5-layer file permissions matrix: Plugin Core (READ-ONLY for all except Ofer), Brand Assets (READ-ONLY for users, Marketing Lead proposes changes), Pipeline Data (shared, auto-generated), Generated Content (per-session, ephemeral), Session Memory (per-user, local). Enforce via documentation and plugin settings, not filesystem permissions.

**Consequences:**
- **Positive:** Clear ownership boundaries. Prevents accidental edits to core files. Allows safe concurrent use by the full team.
- **Negative:** Enforcement is documentation-based, not technical (plugin settings can restrict paths but not user identity). Relies on team discipline.
- **Alternatives Considered:** Filesystem permissions (not available in plugin runtime); branch-per-user (over-engineering); single-user mode (wastes team capacity).

---

## 8-Stage Pipeline State Machine

```
STAGE 1: DATA_FETCH
  Responsible: data-intelligence skill (via base44-api)
  Inputs: $BASE44_APP_ID, $BASE44_API_KEY, CONTENT_HEARTBEAT.md checklist
  Outputs: data/pipeline/YYYY-MM-DD-feature-scan.md
  Gate: API returns 200, at least 1 feature parsed
       |
       v
STAGE 2: BRIEF_GENERATION
  Responsible: data-intelligence skill
  Inputs: feature-scan.md, content-brief-template.md
  Outputs: data/pipeline/YYYY-MM-DD-content-briefs.md
  Gate: Each brief has title, audience, angles, channels
       |
       v
STAGE 3: CONTENT_PLANNING
  Responsible: marketeer (human) OR gtm-strategist (if strategic)
  Inputs: content-briefs.md, brand context
  Outputs: data/pipeline/YYYY-MM-DD-content-calendar.md (approved subset)
  Gate: Human approves at least 1 brief for execution
       |
       v
STAGE 4: CONTENT_CREATION
  Responsible: specialist agents (linkedin-specialist, x-specialist, copywriter, etc.)
  Inputs: approved brief from calendar, brand context, channel skill
  Outputs: draft content in conversation (or output/ directory for teams)
  Gate: Content generated, matches brief requirements
       |
       v
STAGE 5: BRAND_REVIEW
  Responsible: brand-guardian agent
  Inputs: draft content, RULES.md, tone-of-voice.md, learning-log.md
  Outputs: score (1-10), feedback, approval/rejection
  Gate: Score >= 7/10. If < 7, loop back to STAGE 4 with feedback
       |
       v
STAGE 6: PUBLISH
  Responsible: human (copy-paste) OR deployment skill (LANDING_DEPLOY)
  Inputs: approved content, target platform
  Outputs: published content (URL or confirmation)
  Gate: Content live on target platform
       |
       v
STAGE 7: TRACK
  Responsible: human (reports back) OR future analytics integration
  Inputs: published content URL, engagement metrics
  Outputs: performance data logged to .claude/marketing/log/YYYY-MM-DD.md
  Gate: Metrics recorded within 48 hours of publish
       |
       v
STAGE 8: LEARN
  Responsible: brand-memory skill + self-learning system
  Inputs: performance data, human feedback, brand-guardian scores
  Outputs: updated learning-log.md, patterns.md, MEMORY.md, potentially RULES.md
  Gate: Learning captured. If pattern count >= 2, promote to RULES.md
```

---

## Phase 1: Heartbeat + Pipeline Data + Compaction Safety

> **Exit Criteria:** CONTENT_HEARTBEAT.md exists and the router reads it. Pipeline data directory exists with scan/brief/calendar file templates. COMPACTION_FLUSH.md template ensures brand learnings survive long sessions.

**Goal:** Lay the operational infrastructure for the pipeline.
**Estimated effort:** 1 session.
**Dependencies:** API Content Pipeline plan Phase 1 COMPLETE (data-intelligence skill exists).

### Task 1.1: Create CONTENT_HEARTBEAT.md

**Files:**
- Create: `plugins/base44-marketing/CONTENT_HEARTBEAT.md`

**What this file does:** When the router loads, it reads this file and acts on its checklist. Each item is a condition to check against the Base44 API. If any condition is true, the plugin surfaces it to the user instead of waiting to be asked.

**Content:**

```markdown
# Content Heartbeat

> Checklist for proactive content pipeline monitoring.
> The marketing router reads this file on session start.
> If all checks pass with no action needed: HEARTBEAT_OK (silent).
> If any check triggers: surface to user as a content opportunity.

---

## Checklist

### 1. Upcoming Releases (ETA within 14 days)

```
Fetch Feature entities from base44-api.
Filter: eta within 14 days AND status != "released" AND hide_from_marketing == false AND archived == false.
If count > 0: "You have {N} features launching in the next 2 weeks. Want to see the content pipeline?"
If count == 0: PASS
```

### 2. Released Without Marketing Content

```
Filter: status == "released" AND marketing_description is empty AND hide_from_marketing == false.
If count > 0: "{N} released features have no marketing copy. Want to generate content briefs?"
If count == 0: PASS
```

### 3. Status Changes Since Last Scan

```
Compare current API data against last scan file: data/pipeline/YYYY-MM-DD-feature-scan.md.
If any feature changed status (e.g., in_progress -> released): "Feature '{title}' just moved to {new_status}. Content needed?"
If no changes: PASS
```

### 4. Stale Pipeline (No scan in 7+ days)

```
Check modification date of most recent data/pipeline/*-feature-scan.md file.
If older than 7 days: "Last pipeline scan was {N} days ago. Run a fresh scan?"
If recent: PASS
```

### 5. Unapproved Briefs

```
Check data/pipeline/*-content-briefs.md for briefs not yet in a calendar file.
If orphaned briefs exist: "{N} content briefs were generated but not yet scheduled. Review them?"
If all processed: PASS
```

---

## Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Check on session start | Yes | Router reads this file during memory init |
| Suppress if no action | Yes | Only surface if a check triggers |
| Scan lookback window | 14 days | For upcoming releases |
| Stale threshold | 7 days | For "last scan" check |

---

## How the Router Uses This File

In the marketing-router SKILL.md, after memory initialization:

```
Read(file_path="CONTENT_HEARTBEAT.md")
```

If the user's request is ambiguous or open-ended (Phase 1 of intent detection):
1. Run heartbeat checks against live API data
2. If any check triggers, present the opportunity BEFORE asking what the user wants
3. If all pass, proceed with normal open-ended conversation

This makes the plugin PROACTIVE -- it tells the marketeer what needs attention, not just what they ask for.
```

**Step 1:** Create the file at the path above.

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/CONTENT_HEARTBEAT.md
git commit -m "heartbeat: add CONTENT_HEARTBEAT.md checklist for proactive pipeline monitoring"
```

---

### Task 1.2: Create Pipeline Data Directory + File Templates

**Files:**
- Create: `plugins/base44-marketing/data/pipeline/.gitkeep`
- Create: `plugins/base44-marketing/data/pipeline/README.md`

**What this adds:** A git-tracked directory where pipeline scans, briefs, and calendars are saved. Each pipeline run produces dated files. The directory is the source of truth for "what was the pipeline state on date X?"

**Content for README.md:**

```markdown
# Pipeline Data

Git-tracked pipeline output. Auto-generated by the data-intelligence skill.

## File Naming Convention

| File Pattern | Generated By | Contents |
|--------------|-------------|----------|
| `YYYY-MM-DD-feature-scan.md` | data-intelligence (Stage 1: DATA_FETCH) | Raw API response summary: all features with status, tier, ETA |
| `YYYY-MM-DD-content-briefs.md` | data-intelligence (Stage 2: BRIEF_GENERATION) | Structured content briefs for pipeline-worthy features |
| `YYYY-MM-DD-content-calendar.md` | data-intelligence (Stage 3: CONTENT_PLANNING) | Approved calendar: which briefs to execute, on which channels, by when |

## Example

After running the content pipeline on 2026-02-15:

```
data/pipeline/
  2026-02-15-feature-scan.md      # 66 features fetched, 3 upcoming, 2 released-without-marketing
  2026-02-15-content-briefs.md    # 5 briefs generated
  2026-02-15-content-calendar.md  # 3 briefs approved for this week
```

## Pipeline Stage Reference

```
DATA_FETCH -> feature-scan.md
BRIEF_GENERATION -> content-briefs.md
CONTENT_PLANNING -> content-calendar.md
```

## Who Generates These Files

The data-intelligence skill writes these files automatically during pipeline execution.
Marketeer approval is recorded in the calendar file.
No manual editing needed -- these are auto-generated artifacts.
```

**Step 1:** Create directory and files.

```bash
mkdir -p plugins/base44-marketing/data/pipeline
touch plugins/base44-marketing/data/pipeline/.gitkeep
```

**Step 2:** Write README.md.

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/data/pipeline/
git commit -m "data: create pipeline data directory with README for git-tracked pipeline output"
```

---

### Task 1.3: Create COMPACTION_FLUSH.md Template

**Files:**
- Create: `plugins/base44-marketing/COMPACTION_FLUSH.md`

**What this does:** When a session is nearing context limit, this template guides the memory flush to persist all brand learnings, pipeline state, and feedback before compaction destroys them.

**Content:**

```markdown
# Compaction Flush Template

> Read this file when session context is running low.
> Persist all durable information BEFORE compaction.
> APPEND only -- never overwrite existing entries.

---

## Flush Sequence

### 1. Brand Learnings -> MEMORY.md

```
Read(file_path=".claude/marketing/MEMORY.md")
```

Append any new entries to the appropriate section:
- New patterns discovered this session -> `## learned_preferences`
- Feedback received -> `## improvement_log`
- Content created -> `## content_references`

### 2. Pipeline State -> Daily Log

```
Read(file_path=".claude/marketing/log/{today}.md")
```

Append:
- Features pulled from API (count, names)
- Briefs generated (count, feature names)
- Content created (type, channel, status)
- Approvals/rejections from brand-guardian

### 3. Brand-Guardian Feedback -> learning-log.md

```
Read(file_path="brands/base44/learning-log.md")
```

If brand-guardian rejected or revised content this session:
- Log the pattern (original -> feedback -> corrected)
- Increment pattern count if existing
- Check promotion threshold (count >= 2 -> RULES.md)

### 4. Pipeline Scan Results -> data/pipeline/

If a pipeline scan was run but not yet saved:
- Save feature scan to `data/pipeline/YYYY-MM-DD-feature-scan.md`
- Save content briefs to `data/pipeline/YYYY-MM-DD-content-briefs.md`
- Save calendar (if approved) to `data/pipeline/YYYY-MM-DD-content-calendar.md`

### 5. Session Context -> activeContext.md

```
Read(file_path=".claude/marketing/activeContext.md")
```

Update:
- `## Current Focus` with what was being worked on
- `## Recent Content` with any content created
- `## Last Updated` with current timestamp

---

## Flush Rules

1. **APPEND only** -- never overwrite existing entries in any file
2. **If nothing to store** -- skip that section (do not write empty entries)
3. **One flush per compaction** -- do not flush multiple times
4. **Verify after each write** -- Read back the file to confirm

---

## When to Trigger

| Trigger | Action |
|---------|--------|
| Session feels long (30+ tool calls) | Read this file and execute flush |
| User says "save progress" or "checkpoint" | Execute flush |
| Before ending a session | Execute flush |
| After completing a pipeline run | Execute steps 2 + 4 |

---

## What Survives Compaction

| Data Type | Survives? | Where |
|-----------|-----------|-------|
| Brand rules (RULES.md) | Yes | Git-tracked plugin file |
| Learning patterns | Yes if flushed | MEMORY.md + learning-log.md |
| Pipeline scans | Yes if saved | data/pipeline/*.md |
| Session conversation | No | Lost on compaction |
| In-progress content drafts | No unless saved | Lost unless committed |
```

**Step 1:** Create the file.

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/COMPACTION_FLUSH.md
git commit -m "memory: add COMPACTION_FLUSH.md template for pre-compaction brand learning persistence"
```

---

### Task 1.4: Update data-intelligence Skill to Save Pipeline Files

**Files:**
- Modify: `plugins/base44-marketing/skills/data-intelligence/SKILL.md` (created by API pipeline plan Task 1.2)

**What this changes:** After the data-intelligence skill runs, it saves results to `data/pipeline/` as dated files.

**Step 1:** Add a new section to the data-intelligence SKILL.md after "Step 6: Present Content Calendar" and before "Step 7: Route Approved Briefs":

```markdown
### Step 6b: Save Pipeline Data (Git-Tracked)

After generating the content calendar, persist results to `data/pipeline/`:

**Feature Scan:**
```bash
mkdir -p data/pipeline
```

Write to `data/pipeline/YYYY-MM-DD-feature-scan.md`:
```markdown
# Feature Scan: {today's date}

**Source:** Base44 App API (live)
**Total features:** {total_count}
**Pipeline candidates:** {pipeline_count}
**Released without marketing:** {released_no_marketing_count}

## All Features (Summary)

| Title | Status | Tier | ETA | Marketing Ready |
|-------|--------|------|-----|-----------------|
| ... | ... | ... | ... | Yes/No |

## Pipeline Stage: DATA_FETCH complete
```

**Content Briefs:**

Write to `data/pipeline/YYYY-MM-DD-content-briefs.md`:
```markdown
# Content Briefs: {today's date}

**Generated from:** {today's date} feature scan
**Briefs count:** {brief_count}

[Full briefs as generated in Step 5]

## Pipeline Stage: BRIEF_GENERATION complete
```

**Content Calendar (after marketeer approves):**

Write to `data/pipeline/YYYY-MM-DD-content-calendar.md`:
```markdown
# Content Calendar: {today's date}

**Approved by:** {marketeer name}
**Briefs selected:** {selected_count} of {total_count}

| # | Feature | Channel | Agent | Status | Due |
|---|---------|---------|-------|--------|-----|
| 1 | {title} | LinkedIn | linkedin-specialist | pending | {date} |
| ... | ... | ... | ... | ... | ... |

## Pipeline Stage: CONTENT_PLANNING complete
```

These files are the git-tracked source of truth for the pipeline.
```

**Step 2:** Verify the section integrates cleanly with the existing skill.

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/skills/data-intelligence/SKILL.md
git commit -m "data-intelligence: save pipeline scan, briefs, calendar to data/pipeline/ (git-tracked)"
```

---

### Task 1.5: Wire Heartbeat into Marketing Router

**Files:**
- Modify: `plugins/base44-marketing/skills/marketing-router/SKILL.md`

**What this changes:** The router reads CONTENT_HEARTBEAT.md during initialization and runs heartbeat checks when the user's request is open-ended.

**Step 1:** In the Memory Initialization section (currently lines 174-190), add after the brand context loading block:

```markdown
Then check content heartbeat:
```
Read(file_path="CONTENT_HEARTBEAT.md")
```

If the user's request is open-ended (Phase 1, case 3 -- ambiguous request):
- Before asking the open question, run heartbeat checks against live data
- If any heartbeat check triggers, present the opportunity:
  "I noticed {N} features are launching in the next 2 weeks. Want me to pull up the content pipeline?"
- If all heartbeat checks pass: proceed with normal open-ended conversation
```

**Step 2:** Add `CONTENT_HEARTBEAT` to the Supporting Skills table:

In the Supporting Skills table (currently lines 237-249), add a new row:

```markdown
| CONTENT_HEARTBEAT.md | Proactive pipeline monitoring checklist (read on session start) |
```

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/skills/marketing-router/SKILL.md
git commit -m "router: wire CONTENT_HEARTBEAT.md into session initialization for proactive pipeline checks"
```

---

### Phase 1 Exit Criteria

- [ ] `CONTENT_HEARTBEAT.md` exists at plugin root with 5 pipeline checks
- [ ] `data/pipeline/` directory exists with README.md explaining file conventions
- [ ] `COMPACTION_FLUSH.md` exists with flush sequence for 5 data types
- [ ] data-intelligence skill saves scan/brief/calendar to `data/pipeline/`
- [ ] Marketing router reads CONTENT_HEARTBEAT.md during initialization
- [ ] All files committed to git

---

## Phase 2: Two-Layer Memory + Self-Learning System

> **Exit Criteria:** Daily append-only logs exist. Curated MEMORY.md exists with structured schema. Brand-guardian rejections feed back into learning-log.md with confidence scores. Pattern promotion is automated at count >= 2.

**Goal:** Build the persistent intelligence layer.
**Estimated effort:** 1 session.
**Dependencies:** Phase 1 complete.

### Task 2.1: Create Daily Log Directory + Log Template

**Files:**
- Create: `plugins/base44-marketing/.claude/marketing/log/README.md`

**What this adds:** A directory for daily append-only logs. Each day gets a file. The log records what happened: content created, features pulled, approvals, rejections, learnings.

**Content for README.md:**

```markdown
# Daily Marketing Logs

Append-only daily logs of marketing activity.

## File Convention

One file per day: `YYYY-MM-DD.md`

## Log Entry Format

```markdown
# Marketing Log: YYYY-MM-DD

## Content Created
- [{time}] {channel}: "{title}" -- {status} (score: {brand_guardian_score})

## Features Pulled
- [{time}] Pipeline scan: {N} features fetched, {M} pipeline candidates

## Approvals
- [{time}] {content_type} approved by {reviewer} -- score {score}/10

## Rejections
- [{time}] {content_type} rejected -- reason: {feedback}

## Learnings
- [{time}] {pattern learned or feedback received}

## Pipeline State
- Last scan: {date}
- Pending briefs: {N}
- Content in review: {N}
```

## Rules

1. **APPEND ONLY** -- never edit or overwrite existing entries
2. One file per day -- create new file each day
3. Read today + yesterday when loading context
4. Old logs accumulate -- no cleanup needed (they are the audit trail)
```

**Step 1:** Create directory and README.

```bash
mkdir -p plugins/base44-marketing/.claude/marketing/log
```

**Step 2:** Write README.md.

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/.claude/marketing/log/
git commit -m "memory: create daily log directory for append-only marketing activity tracking"
```

---

### Task 2.2: Create Curated MEMORY.md

**Files:**
- Create: `plugins/base44-marketing/.claude/marketing/MEMORY.md`

**What this adds:** The curated long-term memory file with a structured schema. This is the "wisdom" layer -- not raw logs, but distilled intelligence about what works for Base44 marketing.

**Content:**

```markdown
# Marketing Memory (Curated)

> Long-term brand intelligence. Updated by flush operations and post-session reviews.
> This file is the WISDOM layer. Daily logs are the HISTORY layer.

---

## content_references

Recent content created, with performance data where available.

| Date | Type | Channel | Feature | Performance | Link |
|------|------|---------|---------|-------------|------|
<!-- Append new entries here -->

---

## brand_principles

Core brand truths learned through content creation. These are PROVEN, not aspirational.

| Principle | Evidence | Confidence | Source |
|-----------|----------|------------|--------|
| "Builders" not "users" | Every post using "users" gets rejected | 1.0 | RULES.md #2 |
| Show results, not promises | Posts with specific numbers get 2x engagement | 0.9 | learning-log.md |
| Builder is the creator, not Base44 | "You ship it" framing always approved | 0.8 | Shay feedback |
<!-- Append new entries here -->

---

## content_templates

Proven content structures that consistently score >= 7 with brand-guardian.

| Template | Channel | Structure | Avg Score | Uses |
|----------|---------|-----------|-----------|------|
| Feature announcement | LinkedIn | Hook (specific) -> What shipped -> Who it's for -> CTA | - | - |
| Builder story | LinkedIn | Situation -> What they built -> Result -> Base44 role | - | - |
| Thread format | X | Hook tweet -> 3-5 detail tweets -> CTA tweet | - | - |
<!-- Append new entries here -->

---

## learned_preferences

Preferences discovered through feedback. Each has a confidence score.

| Preference | Confidence | Count | Last Updated | Source |
|------------|------------|-------|--------------|--------|
| Feature-specific hooks over generic ones | 0.8 | 2 | 2026-02-06 | Asaf, Ofer |
| No "Happy shipping" sign-offs | 0.7 | 1 | 2026-02-06 | Asaf |
| Flowing sentences over choppy structure | 0.9 | 3 | 2026-02-06 | Asaf, Ofer |
| Sound like Maor's LinkedIn cadence | 0.8 | 1 | 2026-02-09 | Shay |
| Holistic plans, not bullet lists | 0.7 | 1 | 2026-02-09 | Shay |
<!-- Append new entries here -->

### Confidence Score Scale

| Score | Meaning | Action |
|-------|---------|--------|
| 0.0 - 0.3 | Weak signal | Log, watch for repetition |
| 0.4 - 0.6 | Emerging pattern | Apply when relevant, note in content |
| 0.7 - 0.8 | Strong pattern | Apply consistently |
| 0.9 - 1.0 | Proven rule | Enforce always, should be in RULES.md |

---

## improvement_log

System improvements over time. Used to track whether learning is actually working.

| Date | Change | Impact | Metric |
|------|--------|--------|--------|
<!-- Append new entries here -->

---

## Last Updated
2026-02-15
```

**Step 1:** Create the file.

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/.claude/marketing/MEMORY.md
git commit -m "memory: create curated MEMORY.md with structured schema for long-term brand intelligence"
```

---

### Task 2.3: Enhance Self-Learning System in brand-memory Skill

**Files:**
- Modify: `plugins/base44-marketing/skills/brand-memory/SKILL.md`
- Modify: `plugins/base44-marketing/skills/brand-memory/reference/learning-loop.md`

**What this changes:** The learning loop gains three new capabilities:
1. **Confidence scores** on learned preferences (0.0 to 1.0)
2. **Automated redistribution** of winning patterns (brand-guardian approvals feed back)
3. **Three-tier promotion** (1x = log, 2x = RULES.md, 3+ = enforced by brand-guardian)

**Step 1:** In `skills/brand-memory/SKILL.md`, add a new section after "## Learning Loop" (line 85):

```markdown
## Self-Learning Protocol

### After EVERY Session

1. **Track corrections:** If brand-guardian rejected or revised content, log the pattern:
   - Original content -> Feedback -> Corrected version
   - Category: voice, structure, hook, cta, vocabulary, format
   - Update pattern count in learning-log.md

2. **Update confidence scores:** In `.claude/marketing/MEMORY.md` under `## learned_preferences`:
   - If feedback reinforces a preference: confidence += 0.1 (cap at 1.0)
   - If feedback contradicts a preference: confidence -= 0.2 (floor at 0.0)
   - If preference reaches 0.0: remove from active preferences

3. **Redistribute winning patterns:** When content scores >= 8/10 from brand-guardian:
   - Extract the structural pattern (hook type, sentence flow, CTA style)
   - Add to `## content_templates` in MEMORY.md
   - Increment the template's `Uses` count

### Promotion Ladder

| Feedback Count | Action | Where |
|----------------|--------|-------|
| 1x | Log to learning-log.md | Pattern Tracking table, status: watching |
| 2x | **Promote to RULES.md** | Add as NEVER DO or ALWAYS DO rule |
| 3+ | Enforced by brand-guardian | Guardian checks against this rule automatically |

### Confidence -> Rule Promotion

When a learned preference in MEMORY.md reaches confidence >= 0.9:
1. Flag it for RULES.md promotion
2. Draft the rule text
3. Present to maintainer (Ofer) for approval before adding

This prevents rules from being added without human oversight while ensuring the system surfaces strong patterns.
```

**Step 2:** In `skills/brand-memory/reference/learning-loop.md`, update the Confidence Levels section (lines 59-66):

Replace:
```
COUNT    CONFIDENCE    EFFECT
1        LOW           Logged, watching
2        MEDIUM        Soft suggestion
3        HIGH          Auto-promote to RULES.md
5+       RULE          Enforced by brand-guardian
```

With:
```
COUNT    CONFIDENCE    EFFECT
1        0.3 (LOW)     Logged in learning-log.md, watching
2        0.6 (MEDIUM)  Auto-promote to RULES.md
3+       0.8 (HIGH)    Enforced by brand-guardian, redistributed as template
5+       1.0 (PROVEN)  Core brand rule, flagged for tone-of-voice.md review
```

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/skills/brand-memory/SKILL.md
git add plugins/base44-marketing/skills/brand-memory/reference/learning-loop.md
git commit -m "brand-memory: add self-learning protocol with confidence scores and automated redistribution"
```

---

### Task 2.4: Wire Two-Layer Memory into brand-memory Initialization

**Files:**
- Modify: `plugins/base44-marketing/skills/brand-memory/SKILL.md`

**What this changes:** The brand-memory initialization now also loads and checks the daily log and curated MEMORY.md.

**Step 1:** In the Initialization section (lines 24-38), add after the existing file checks:

```markdown
Check two-layer memory:
```
Read(file_path=".claude/marketing/MEMORY.md")
Read(file_path=".claude/marketing/log/{today}.md")
Read(file_path=".claude/marketing/log/{yesterday}.md")
```

If MEMORY.md missing, create from template (see Task 2.2).
If today's log missing, create with header:
```markdown
# Marketing Log: {today}

## Content Created

## Features Pulled

## Approvals

## Rejections

## Learnings

## Pipeline State
```
```

**Step 2:** Update the Memory Files table (lines 42-58) to include the new files:

Add these rows:

```markdown
| `MEMORY.md` | Curated long-term brand intelligence (structured schema) |
| `log/YYYY-MM-DD.md` | Daily append-only activity log |
```

**Step 3:** Update the Session Checklist (lines 133-143) to include:

```markdown
- [ ] Check MEMORY.md exists
- [ ] Check today's log exists in log/
- [ ] Load yesterday's log for context continuity
```

**Step 4:** Commit.

```bash
git add plugins/base44-marketing/skills/brand-memory/SKILL.md
git commit -m "brand-memory: wire two-layer memory (daily logs + curated MEMORY.md) into initialization"
```

---

### Phase 2 Exit Criteria

- [ ] `.claude/marketing/log/` directory exists with README and log template
- [ ] `.claude/marketing/MEMORY.md` exists with 5 structured sections (content_references, brand_principles, content_templates, learned_preferences, improvement_log)
- [ ] brand-memory skill loads MEMORY.md + daily logs during initialization
- [ ] Self-learning protocol defined: confidence scores, redistribution, 3-tier promotion
- [ ] learning-loop.md updated with confidence score scale
- [ ] brand-memory session checklist includes MEMORY.md and daily log checks
- [ ] All files committed

---

## Phase 3: Multi-User Safety + CLAUDE.md Expansion

> **Exit Criteria:** File permissions matrix defined for 5 team members. CLAUDE.md expanded with Feature entity schema, 8-stage pipeline diagram, multi-agent safety rules, and data source registry.

**Goal:** Make the plugin safe for concurrent team use and provide comprehensive documentation.
**Estimated effort:** 1 session.
**Dependencies:** Phase 2 complete.

### Task 3.1: Create Multi-User Permissions Matrix

**Files:**
- Create: `plugins/base44-marketing/PERMISSIONS.md`

**What this adds:** Explicit file ownership and access rules for each team member.

**Content:**

```markdown
# Multi-User File Permissions

> Who can read/write what. Enforced by convention and plugin settings.

---

## Team Members

| Name | Role | Primary Use |
|------|------|-------------|
| Ofer | Plugin Maintainer | Edit skills, agents, brand rules, all files |
| Lora | Content Manager | Create social content, update learning-log |
| Assaf | Product | Feature announcements, product content |
| Tiffany | Product Marketing | Feature launches, campaigns |
| Shira | Growth | Growth content, experiments |

---

## Permission Layers

### Layer 1: Plugin Core (READ-ONLY)

**Files:** `skills/`, `agents/`, `CLAUDE.md`, `.claude-plugin/`, `teams/`, `hooks/`

| User | Access |
|------|--------|
| Ofer | READ + WRITE (maintainer) |
| All others | READ ONLY |

**Why:** These files define the plugin's behavior. Editing them without understanding the full system can break routing, agent behavior, or brand governance. Changes require a PR reviewed by Ofer.

### Layer 2: Brand Assets (PROPOSE CHANGES)

**Files:** `brands/base44/RULES.md`, `brands/base44/tone-of-voice.md`, `brands/base44/brand.json`, `brands/base44/design-system.md`

| User | Access |
|------|--------|
| Ofer | READ + WRITE |
| All others | READ + PROPOSE (via learning-log.md) |

**Why:** Brand rules affect all content. Changes should be deliberate and go through the pattern promotion system (learning-log.md count >= 2 -> RULES.md).

**Exception:** `brands/base44/learning-log.md` is APPEND-WRITE for all team members (feedback logging).

### Layer 3: Pipeline Data (SHARED, AUTO-GENERATED)

**Files:** `data/pipeline/`, `CONTENT_HEARTBEAT.md`

| User | Access |
|------|--------|
| All users | READ |
| data-intelligence skill | WRITE (auto-generated) |
| Ofer | WRITE (can edit CONTENT_HEARTBEAT.md) |

**Why:** Pipeline data is auto-generated from API. Manual edits would create inconsistency with the API source. The heartbeat checklist is maintained by the plugin maintainer.

### Layer 4: Generated Content (PER-SESSION)

**Files:** `output/`, conversation content

| User | Access |
|------|--------|
| Each user | READ + WRITE to their own session output |
| Other users | No access (session-isolated) |

**Why:** Content generation is per-session. One user's drafts should not interfere with another's. For Agent Teams, each teammate has an isolated `output/{channel}/` directory.

### Layer 5: Session Memory (PER-USER, LOCAL)

**Files:** `.claude/marketing/activeContext.md`, `.claude/marketing/patterns.md`, `.claude/marketing/feedback.md`, `.claude/marketing/log/`

| User | Access |
|------|--------|
| Each user | READ + WRITE in their own session |
| MEMORY.md | APPEND-WRITE (all users contribute, no overwriting) |
| Daily logs | APPEND-WRITE (all users contribute) |

**Why:** Session memory is local to each user's Claude Code instance. MEMORY.md and daily logs are shared but append-only to prevent conflicts.

---

## Permission Matrix (Quick Reference)

| File/Directory | Ofer | Lora | Assaf | Tiffany | Shira |
|----------------|------|------|-------|---------|-------|
| `skills/` | RW | R | R | R | R |
| `agents/` | RW | R | R | R | R |
| `CLAUDE.md` | RW | R | R | R | R |
| `.claude-plugin/` | RW | R | R | R | R |
| `brands/base44/RULES.md` | RW | R | R | R | R |
| `brands/base44/learning-log.md` | RW | A | A | A | A |
| `brands/base44/tone-of-voice.md` | RW | R | R | R | R |
| `brands/base44/templates/` | RW | R | R | R | R |
| `data/pipeline/` | RW | R | R | R | R |
| `CONTENT_HEARTBEAT.md` | RW | R | R | R | R |
| `.claude/marketing/activeContext.md` | RW | RW | RW | RW | RW |
| `.claude/marketing/MEMORY.md` | RW | A | A | A | A |
| `.claude/marketing/log/` | RW | A | A | A | A |
| `output/` | RW | RW(own) | RW(own) | RW(own) | RW(own) |

**Legend:** R = Read, W = Write, A = Append-only, RW(own) = Read-Write own session only

---

## Enforcement

### Plugin Settings (settings.json)

The `permissions.allow` list in `.claude-plugin/settings.json` controls what the plugin CAN do. This restricts all users equally. Fine-grained per-user permissions are enforced by:
1. This documentation (team convention)
2. Agent prompts (agents check permissions before writing)
3. PR reviews (Ofer reviews changes to core files)

### Multi-Agent Safety Rules

When multiple agents or users work concurrently:
1. **Do not create/apply/drop git stash** unless explicitly requested
2. **Assume other agents may be working** -- keep unrelated files untouched
3. **Scope commits to your changes only** -- do not `git add .`
4. **Do not edit files outside your permission layer** -- agents check PERMISSIONS.md
5. **APPEND-ONLY for shared files** (MEMORY.md, daily logs, learning-log.md)
```

**Step 1:** Create the file.

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/PERMISSIONS.md
git commit -m "permissions: add multi-user file permissions matrix for team safety"
```

---

### Task 3.2: Expand CLAUDE.md

**Files:**
- Modify: `plugins/base44-marketing/CLAUDE.md`

**What this changes:** Adds four new sections to CLAUDE.md: Feature Entity API Schema, 8-Stage Pipeline State Machine, Multi-Agent Safety Rules, and Data Source Registry.

**Step 1:** After the existing "## Brand Voice (TL;DR)" section, add:

```markdown
## Feature Entity API Schema (Quick Reference)

The Base44 App API exposes Feature entities with these key fields:

| Field | Type | Marketing Use |
|-------|------|---------------|
| `title` | string | Feature name in all content |
| `status` | string | new / in_progress / released |
| `tier` | string | tier_1 (all channels), tier_2 (social), tier_3 (brief only) |
| `eta` | string | Release date -- drives pipeline urgency |
| `whats_new` | string | What changed -- core of announcement copy (may contain HTML) |
| `who_is_this_for` | string | Target audience (may contain HTML) |
| `why_building` | string | Pain point being solved (may contain HTML) |
| `marketing_description` | string | Marketing copy (empty for 62/66 features -- auto-generate) |
| `hide_from_marketing` | boolean | Exclude from pipeline if true |
| `media_urls` | string[] | Visual assets |
| `showcase_link` | string | Demo link |

**Full schema:** `skills/base44-api/reference/api.md`

## 8-Stage Content Pipeline

```
DATA_FETCH -> BRIEF_GENERATION -> CONTENT_PLANNING -> CONTENT_CREATION
     |              |                    |                    |
  base44-api   data-intelligence   human approval      specialist agents
                                                            |
                                                            v
                                        BRAND_REVIEW -> PUBLISH -> TRACK -> LEARN
                                             |             |          |        |
                                        brand-guardian   human    metrics  learning-log
```

| Stage | Agent/Actor | Input | Output | Gate |
|-------|-------------|-------|--------|------|
| 1. DATA_FETCH | data-intelligence + base44-api | API credentials | feature-scan.md | API 200, >= 1 feature |
| 2. BRIEF_GENERATION | data-intelligence | feature-scan | content-briefs.md | Brief has title, audience, angles |
| 3. CONTENT_PLANNING | human / gtm-strategist | briefs | content-calendar.md | >= 1 brief approved |
| 4. CONTENT_CREATION | specialist agent | approved brief | draft content | Content matches brief |
| 5. BRAND_REVIEW | brand-guardian | draft | score + feedback | Score >= 7/10 |
| 6. PUBLISH | human / LANDING_DEPLOY | approved content | live URL | Content published |
| 7. TRACK | human / future analytics | published URL | metrics | Metrics logged within 48h |
| 8. LEARN | brand-memory | metrics + feedback | updated MEMORY.md | Learnings captured |

**Pipeline data:** `data/pipeline/` (git-tracked)
**Heartbeat:** `CONTENT_HEARTBEAT.md` (proactive monitoring)

## Multi-Agent Safety Rules

When multiple team members or agents work concurrently:

1. **Do not edit files outside your permission layer** -- see `PERMISSIONS.md`
2. **APPEND-ONLY for shared files** -- MEMORY.md, daily logs, learning-log.md
3. **Scope git operations to your changes** -- never `git add .` or `git add -A`
4. **Assume others are working** -- do not touch unrelated WIP files
5. **Do not stash/drop** unless explicitly asked
6. **Plugin core is READ-ONLY** -- skills/, agents/, CLAUDE.md (only Ofer edits)

## Data Source Registry

| Source | Type | Status | Contact | Access Method |
|--------|------|--------|---------|---------------|
| Base44 App API | Feature entities | ACTIVE | Ofer | `curl` via base44-api skill |
| Learning log | Brand patterns | ACTIVE | All (append) | `brands/base44/learning-log.md` |
| pinback.base44.com | Feature requests | ACTIVE | - | Manual reference |
| Builder analytics | Usage metrics | MANUAL | Olga | Share in conversation |
| Weekly analysis | Churn, trends | MANUAL | Tori | Share deck insights |
| Product roadmap | Strategy | MANUAL | Noa Gordon | Product sync |
| Reddit / social | Competitor intel | MANUAL | - | Monitor manually |
| Builder prompts | Anonymized usage | PLANNED | - | Future MCP connector |
| Usage analytics | Behavioral data | PLANNED | - | Future MCP connector |
```

**Step 2:** Update the Architecture diagram to include the pipeline and heartbeat:

In the existing architecture block, add between APP_DATA and PAID_AD:

```markdown
        +-- CONTENT_PIPELINE -> data-intelligence (fetch, brief, calendar, route)
```

**Step 3:** Update the Skills table to include data-intelligence:

```markdown
| `data-intelligence` | Live API content pipeline: feature briefs + content calendar |
```

**Step 4:** Commit.

```bash
git add plugins/base44-marketing/CLAUDE.md
git commit -m "CLAUDE.md: expand with Feature schema, 8-stage pipeline, multi-agent safety, data registry"
```

---

### Task 3.3: Update settings.json for Pipeline Permissions

**Files:**
- Modify: `plugins/base44-marketing/.claude-plugin/settings.json`

**What this changes:** Adds permissions for pipeline data, daily logs, curl API calls, and MEMORY.md.

**Step 1:** Add these entries to the `permissions.allow` array:

```json
"Read(data/**)",
"Write(data/pipeline/**)",
"Bash(mkdir -p data/pipeline)",
"Read(.claude/marketing/MEMORY.md)",
"Edit(.claude/marketing/MEMORY.md)",
"Write(.claude/marketing/log/**)",
"Bash(mkdir -p .claude/marketing/log)",
"Read(.claude/marketing/log/**)",
"Read(CONTENT_HEARTBEAT.md)",
"Read(COMPACTION_FLUSH.md)",
"Read(PERMISSIONS.md)",
"Bash(curl -s -X GET *base44.com*)"
```

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/.claude-plugin/settings.json
git commit -m "settings: add pipeline data, daily logs, curl, and MEMORY.md permissions"
```

---

### Phase 3 Exit Criteria

- [ ] `PERMISSIONS.md` exists with 5-layer permission matrix for all team members
- [ ] CLAUDE.md has Feature Entity API Schema section
- [ ] CLAUDE.md has 8-Stage Content Pipeline diagram + stage table
- [ ] CLAUDE.md has Multi-Agent Safety Rules section
- [ ] CLAUDE.md has Data Source Registry table
- [ ] CLAUDE.md architecture block includes CONTENT_PIPELINE
- [ ] CLAUDE.md skills table includes data-intelligence
- [ ] settings.json updated with pipeline, log, curl, and MEMORY.md permissions
- [ ] All files committed

---

## Phase 4: Integration + Version Bump

> **Exit Criteria:** All 8 patterns are wired together. Plugin version bumped. End-to-end flow testable: heartbeat -> pipeline -> brief -> content -> review -> learn.

**Goal:** Connect all the pieces and verify the full pipeline works.
**Estimated effort:** 30 minutes.
**Dependencies:** Phase 3 complete + API Content Pipeline plan fully executed.

### Task 4.1: Update brand-guardian to Feed Self-Learning System

**Files:**
- Modify: `plugins/base44-marketing/agents/brand-guardian.md`

**What this changes:** After brand-guardian scores content, it records the result in the daily log and triggers the self-learning protocol when content is rejected.

**Step 1:** Add a section at the end of brand-guardian.md:

```markdown
## Post-Review Actions

After scoring content:

### If score >= 7 (APPROVED):
1. Log to daily log: `{time}] {content_type} approved -- score {score}/10`
2. If score >= 8: Extract structural pattern for MEMORY.md `## content_templates`

### If score < 7 (REJECTED):
1. Log to daily log: `[{time}] {content_type} rejected -- reason: {feedback}`
2. Log rejection pattern to `brands/base44/learning-log.md`:
   - Pattern: what went wrong
   - Category: voice, structure, hook, cta, vocabulary, format
   - Increment count if pattern exists
3. If pattern count reaches 2: Flag for RULES.md promotion
4. Return content to specialist with specific feedback for revision
```

**Step 2:** Commit.

```bash
git add plugins/base44-marketing/agents/brand-guardian.md
git commit -m "brand-guardian: add post-review actions to feed self-learning system"
```

---

### Task 4.2: Update Plugin Version + Metadata

**Files:**
- Modify: `plugins/base44-marketing/.claude-plugin/plugin.json`
- Modify: `plugins/base44-marketing/.claude-plugin/settings.json`

**Note:** The API Content Pipeline plan already bumps to 2.0.0. If that plan has been executed first, this task bumps to 2.1.0. If not, coordinate with that plan's Task 3.1.

**Step 1:** Update version in plugin.json:

```json
"version": "2.1.0"
```

Update description:

```json
"description": "Marketing intelligence system with live API content pipeline, 8-stage content lifecycle, proactive heartbeat monitoring, two-layer memory (daily logs + curated MEMORY.md), self-learning with confidence scores, multi-user safety for team workflows, and compaction-safe persistence. 9 agents, 77+ tactics, 71 psychology principles, brand governance."
```

**Step 2:** Update settings.json version:

```json
"MARKETING_PLUGIN_VERSION": "2.1.0"
```

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/.claude-plugin/plugin.json
git add plugins/base44-marketing/.claude-plugin/settings.json
git commit -m "plugin: bump to v2.1.0 with OpenClaw-inspired pipeline redesign"
```

---

### Task 4.3: Create Integration Test Checklist

**Files:**
- Create: `plugins/base44-marketing/tests/pipeline-integration-checklist.md`

**What this adds:** A manual test checklist verifying the full 8-stage pipeline works end-to-end.

**Content:**

```markdown
# Pipeline Integration Test Checklist

## Prerequisites
- [ ] API credentials set ($BASE44_APP_ID, $BASE44_API_KEY)
- [ ] data-intelligence skill exists at skills/data-intelligence/SKILL.md
- [ ] CONTENT_HEARTBEAT.md exists at plugin root
- [ ] data/pipeline/ directory exists

---

## Test 1: Heartbeat Detection
- [ ] Start a new session
- [ ] Router reads CONTENT_HEARTBEAT.md during initialization
- [ ] If features with upcoming ETAs exist: plugin surfaces them proactively
- [ ] If no features need attention: session proceeds normally (HEARTBEAT_OK)

## Test 2: Full Pipeline Run (Stages 1-3)
- [ ] Say "what should we create?" or "run the content pipeline"
- [ ] Stage 1: data-intelligence fetches features via API (DATA_FETCH)
- [ ] Stage 1: Results saved to data/pipeline/YYYY-MM-DD-feature-scan.md
- [ ] Stage 2: Content briefs generated for pipeline-worthy features (BRIEF_GENERATION)
- [ ] Stage 2: Briefs saved to data/pipeline/YYYY-MM-DD-content-briefs.md
- [ ] Stage 3: Content calendar presented with priority scoring (CONTENT_PLANNING)
- [ ] Stage 3: After approval, calendar saved to data/pipeline/YYYY-MM-DD-content-calendar.md

## Test 3: Content Creation (Stage 4)
- [ ] Select a feature from the calendar for LinkedIn
- [ ] Router routes to LINKEDIN workflow with brief as context
- [ ] linkedin-specialist generates content using brief data

## Test 4: Brand Review (Stage 5)
- [ ] brand-guardian scores the content
- [ ] If score >= 7: content approved, log to daily log
- [ ] If score < 7: feedback returned, pattern logged to learning-log.md
- [ ] If score >= 8: structural pattern extracted for MEMORY.md

## Test 5: Memory System
- [ ] MEMORY.md loaded during initialization
- [ ] Daily log created for today
- [ ] After content creation: log entry appended
- [ ] After brand review: learning captured in appropriate file

## Test 6: Compaction Safety
- [ ] Run COMPACTION_FLUSH.md sequence manually
- [ ] Verify: MEMORY.md updated with session learnings
- [ ] Verify: Daily log has all session activity
- [ ] Verify: Pipeline data files saved

## Test 7: Multi-User Simulation
- [ ] Verify: Non-Ofer user cannot edit skills/ or agents/ (documentation check)
- [ ] Verify: learning-log.md is append-only for team members
- [ ] Verify: MEMORY.md is append-only for team members

## Test 8: Self-Learning Loop
- [ ] Create content that brand-guardian rejects
- [ ] Verify: Rejection pattern logged in learning-log.md
- [ ] Verify: Pattern count incremented
- [ ] If count reaches 2: verify RULES.md promotion flagged
```

**Step 1:** Create directory and file.

```bash
mkdir -p plugins/base44-marketing/tests
```

**Step 2:** Write the file.

**Step 3:** Commit.

```bash
git add plugins/base44-marketing/tests/
git commit -m "tests: add pipeline integration test checklist for 8-stage content lifecycle"
```

---

### Phase 4 Exit Criteria

- [ ] brand-guardian records post-review actions (daily log + learning-log)
- [ ] Plugin version bumped (2.1.0 or coordinated with API pipeline plan)
- [ ] Integration test checklist exists at `tests/pipeline-integration-checklist.md`
- [ ] All 8 patterns are addressable:
  1. CONTENT_HEARTBEAT.md -- proactive monitoring
  2. Two-layer memory -- MEMORY.md + daily logs
  3. Git-tracked pipeline data -- data/pipeline/
  4. Compaction flush -- COMPACTION_FLUSH.md
  5. Multi-user safety -- PERMISSIONS.md
  6. CLAUDE.md expansion -- schema, pipeline, safety, registry
  7. Self-learning -- confidence scores, redistribution, promotion
  8. 8-stage pipeline -- formal state machine with gates

---

## File-by-File Task List (All Tasks)

| File | Action | Task | Phase |
|------|--------|------|-------|
| `CONTENT_HEARTBEAT.md` | CREATE | 1.1 | 1 |
| `data/pipeline/.gitkeep` | CREATE | 1.2 | 1 |
| `data/pipeline/README.md` | CREATE | 1.2 | 1 |
| `COMPACTION_FLUSH.md` | CREATE | 1.3 | 1 |
| `skills/data-intelligence/SKILL.md` | MODIFY | 1.4 | 1 |
| `skills/marketing-router/SKILL.md` | MODIFY | 1.5 | 1 |
| `.claude/marketing/log/README.md` | CREATE | 2.1 | 2 |
| `.claude/marketing/MEMORY.md` | CREATE | 2.2 | 2 |
| `skills/brand-memory/SKILL.md` | MODIFY | 2.3, 2.4 | 2 |
| `skills/brand-memory/reference/learning-loop.md` | MODIFY | 2.3 | 2 |
| `PERMISSIONS.md` | CREATE | 3.1 | 3 |
| `CLAUDE.md` | MODIFY | 3.2 | 3 |
| `.claude-plugin/settings.json` | MODIFY | 3.3 | 3 |
| `agents/brand-guardian.md` | MODIFY | 4.1 | 4 |
| `.claude-plugin/plugin.json` | MODIFY | 4.2 | 4 |
| `.claude-plugin/settings.json` | MODIFY | 4.2 | 4 |
| `tests/pipeline-integration-checklist.md` | CREATE | 4.3 | 4 |

**Total:** 10 files created, 7 files modified, 4 phases, 13 tasks.

All paths are relative to `plugins/base44-marketing/`.

---

## Risks

| Risk | Probability (1-5) | Impact (1-5) | Score | Mitigation |
|------|-------------------|--------------|-------|------------|
| Memory files grow too large (MEMORY.md) | 2 | 3 | 6 | Curated file, not append-only. Periodic review by maintainer. |
| Daily logs accumulate without cleanup | 3 | 1 | 3 | Logs are small (.md), git handles well. Archive if > 100 files. |
| Team members edit core files despite permissions doc | 3 | 4 | 12 | PR review required. Settings.json restricts write paths. Onboarding doc. |
| Heartbeat checks slow down session start | 2 | 3 | 6 | API call is single request (all features). Only runs if user is open-ended. |
| Compaction flush not triggered (user closes session abruptly) | 3 | 3 | 9 | Flush also runs on checkpoint commands. Pipeline data is git-tracked so survives. |
| Self-learning creates contradictory rules | 2 | 4 | 8 | Confidence scores prevent weak patterns from promoting. Ofer reviews RULES.md changes. |
| data-intelligence save step fails (no write permission) | 2 | 3 | 6 | settings.json includes `Write(data/pipeline/**)`. Test with Phase 1 integration check. |
| Overlap between MEMORY.md and patterns.md causes confusion | 3 | 2 | 6 | MEMORY.md = structured schema for long-term intelligence. patterns.md = session tabular tracking. Document distinction in brand-memory SKILL.md. |

**Highest risks:**
1. Team members editing core files (score 12) -- mitigated by PR review, settings.json, onboarding
2. Compaction flush not triggered (score 9) -- mitigated by pipeline data being git-tracked, checkpoint commands
3. Self-learning contradictions (score 8) -- mitigated by confidence scores, human review at promotion

---

## Success Criteria

### Must Have
- [ ] CONTENT_HEARTBEAT.md read by router on session start
- [ ] Pipeline data saved to git-tracked data/pipeline/ directory
- [ ] Two-layer memory (daily logs + MEMORY.md) operational
- [ ] File permissions documented for all 5 team members
- [ ] 8-stage pipeline formally defined with gates

### Should Have
- [ ] Compaction flush template functional
- [ ] Self-learning with confidence scores
- [ ] CLAUDE.md expanded with all 4 new sections
- [ ] brand-guardian feeds self-learning system

### Nice to Have
- [ ] Integration test checklist passing
- [ ] Version bump coordinated with API pipeline plan

---

## Relationship to Predecessor Plans

| Plan | Relationship |
|------|-------------|
| `docs/plans/2026-02-15-api-content-pipeline-plan.md` | **PREREQUISITE.** Execute first. This plan adds infrastructure around the API pipeline. |
| `docs/plans/2026-02-09-shay-feedback-implementation-plan.md` | Phase 1 COMPLETE. Phase 2 REPLACED by API pipeline. Phase 3 partially addressed by 8-stage pipeline. |
| `docs/plans/2026-02-09-agent-teams-integration-plan.md` | COMPATIBLE. Teams use the same permission matrix from PERMISSIONS.md. |
| `docs/research/2026-02-15-openclaw-patterns-research.md` | **SOURCE.** All 8 patterns originate from this research. |

---

### Memory Notes

**Learnings:**
- OpenClaw's two-layer memory (daily logs + curated MEMORY.md) maps directly to the marketing plugin's needs. Daily logs provide audit trail, MEMORY.md provides wisdom.
- The heartbeat pattern works within plugin constraints (no cron) as a pull-based checklist read on session start.
- Multi-user safety in a .md-only plugin must be documentation-enforced, not filesystem-enforced. Settings.json provides partial technical enforcement via path restrictions.
- The existing brand-memory skill already has pattern promotion (1x log, 2x RULES.md). This plan adds confidence scores (0.0-1.0) and automated redistribution of winning patterns.
- The 8-stage pipeline formalizes what the API pipeline plan describes informally. Each stage has a responsible agent, inputs, outputs, and gate criteria.

**Patterns:**
- Plugin architecture: .md files only, no custom code. All behavior defined through skill/agent prompts.
- Memory hierarchy: activeContext (session) < patterns (session tabular) < MEMORY.md (curated long-term) < daily logs (append-only history) < learning-log.md (shared brand patterns) < RULES.md (enforced rules)
- File permissions: 5 layers -- Plugin Core (R), Brand Assets (R+propose), Pipeline Data (shared/auto), Generated Content (per-session), Session Memory (per-user)

**Verification:**
- Plan saved at `docs/plans/2026-02-15-openclaw-pipeline-redesign-plan.md`
- 4 phases, 13 tasks, 10 new files, 7 modified files
- 4 ADRs (007-010): Heartbeat vs Cron, Two-Layer Memory, Git-Tracked Data, Multi-User Permissions

---

*Plan created: 2026-02-15*
*Author: Claude Code (Planner)*
*Source: OpenClaw patterns research + existing API content pipeline plan*
*Predecessor: docs/plans/2026-02-15-api-content-pipeline-plan.md*
