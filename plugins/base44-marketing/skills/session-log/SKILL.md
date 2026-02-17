---
name: session-log
description: |
  Captures plugin session data (who, what, how long, time saved) and pushes it to Ripple for ROI tracking.

  Triggers on: log session, save session, track session, session report, end session, wrap up.
---

# Session Log

**PURPOSE:** Track plugin usage, time saved, and business impact by logging each session to Ripple.

## When to Use

- User says "log session", "save session", "track this session"
- At the end of a session where content was created or data was queried
- When the marketing-router reminds the user to log

## Workflow

### Step 1: Identify User

Check if user name is known from the conversation. If not, ask:

"Who's logging this session?"

Read email from `~/.base44/auth/auth.json` if available.

### Step 2: Scan Conversation for Session Events

Look through the conversation history for:

| Event | Detection Pattern | Field |
|-------|-------------------|-------|
| Workflows triggered | Router classifications (GTM_STRATEGY, LINKEDIN, X, etc.) | `workflows_used` |
| Content pieces | `<!-- CONTENT_START -->` markers or distinct content blocks generated | `content_pieces` |
| Content channels | Channel mentioned in content generation (linkedin, x, email, etc.) | `content_channels` |
| Guardian scores | "Guardian Score: X/10" or "Score: X/10" patterns | `guardian_scores` |
| Data queries | Trino query executions or data-insight skill invocations | `data_queries_run` |
| Push events | push-to-ripple results with content IDs | `pushed_to_ripple`, `content_ids` |

### Step 3: Calculate Time Saved

Use the time savings model from [reference/time-model.md](reference/time-model.md).

Sum the "Saved" column for each workflow used. If a workflow was used multiple times, multiply accordingly.

### Step 4: Build Session Payload

```json
{
  "user_name": "Team Member",
  "user_email": "team-member@base44.com",
  "session_date": "2026-02-16T14:30:00Z",
  "duration_minutes": 12,
  "workflows_used": ["LINKEDIN", "DATA_INSIGHT"],
  "content_pieces": 2,
  "content_channels": ["linkedin"],
  "guardian_scores": [8, 9],
  "avg_guardian_score": 8.5,
  "pushed_to_ripple": 1,
  "data_queries_run": ["GROWTH_WEEKLY"],
  "estimated_time_saved_min": 67,
  "session_summary": "Created 2 LinkedIn posts using weekly growth data, pushed 1 to Ripple"
}
```

### Step 5: Confirm with User

Show a summary before pushing:

```
Session Log:
  User: Team Member
  Date: Feb 16, 2026
  Workflows: LINKEDIN, DATA_INSIGHT
  Content: 2 pieces (linkedin)
  Guardian avg: 8.5/10
  Time saved: ~67 min
  Summary: Created 2 LinkedIn posts using weekly growth data

Push to Ripple?
```

Let user adjust any values before pushing. If user wants to override time saved, use their number.

### Step 6: Push to Ripple

Write JSON to temp file and pipe to bridge script:

```bash
cat /tmp/session-log.json | node "$RIPPLE_PROJECT_DIR/scripts/push-session.js"
```

### Step 7: Report Result

**Success:**
```
Session logged. ID: {session_id}
Time saved this session: ~{N} minutes
```

**Error:**
```
Failed to log session: {error}
Check: Is Base44 auth valid? Run `npx base44 login` in the Ripple project.
```

---

## Duration Estimation

Estimate `duration_minutes` based on workflows used:

| Workflow | Estimated Plugin Time (min) |
|----------|-----------------------------|
| LINKEDIN | 5 |
| X | 3 |
| EMAIL | 12 |
| LANDING | 30 |
| SEO | 20 |
| PAID_AD | 8 |
| VIDEO | 12 |
| CAMPAIGN | 20 |
| GTM_STRATEGY | 45 |
| DATA_INSIGHT | 3 |
| BRAINSTORM | 8 |
| APP_DATA | 2 |

Sum the plugin time for each workflow used.

---

## Dependencies

- **Bridge script:** `$RIPPLE_PROJECT_DIR/scripts/push-session.js`
- **Auth:** `~/.base44/auth/auth.json` (run `npx base44 login` in Ripple project)
- **Backend function:** `cli-push-session` in Ripple

## Integration

- **Called by:** marketing-router (session end reminder), user direct request
- **Reads from:** Conversation history (session events)
- **Writes to:** Ripple PluginSession entity via CLI bridge
