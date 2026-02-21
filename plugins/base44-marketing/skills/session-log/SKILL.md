---
name: session-log
description: |
  Tracks team plugin usage: who used it, what they created, how long, time saved. Pushes to a shared Base44 PluginSession entity so the whole team can see usage.

  Triggers on: log session, save session, track session, session report, end session, wrap up, team usage, who used the plugin.
---

# Session Log

**PURPOSE:** Track plugin usage, time saved, and business impact. Data is shared across the team via the Base44 `PluginSession` entity.

## When to Use

- User says "log session", "save session", "track this session"
- User says "show team usage", "who used the plugin", "usage report"
- At the end of a session where content was created or data was queried
- When the marketing-router reminds the user to log

---

## Workflow: Log a Session

### Step 1: Load Credentials

Read from `.claude/marketing/api-config.json` (same file as `base44-feature`):

```bash
cat .claude/marketing/api-config.json 2>/dev/null || echo "NOT_FOUND"
```

If NOT_FOUND, ask the user for App ID and API Key. Use the Write tool to save to `.claude/marketing/api-config.json`. See `skills/base44-feature/SKILL.md` Step 2 for format.

### Step 2: Identify User

Check if user name is known from the conversation. If not, ask:

"Who's logging this session?"

Also read email from `~/.base44/auth/auth.json` if available.

### Step 3: Scan Conversation for Session Events

Look through the conversation history for:

| Event | Detection Pattern | Field |
|-------|-------------------|-------|
| Workflows triggered | Router classifications (GTM_STRATEGY, LINKEDIN, X, etc.) | `workflows_used` |
| Content pieces | `<!-- CONTENT_START -->` markers or distinct content blocks generated | `content_pieces` |
| Content channels | Channel mentioned in content generation (linkedin, x, email, etc.) | `content_channels` |
| Guardian scores | "Guardian Score: X/10" or "Score: X/10" patterns | `guardian_scores` |
| Data queries | Trino query executions or data-insight skill invocations | `data_queries_run` |
| Push events | push-to-ripple results with content IDs | `pushed_to_cms` |

### Step 4: Calculate Time Saved

Use the time savings model from [reference/time-model.md](reference/time-model.md).

Sum the "Saved" column for each workflow used. If a workflow was used multiple times, multiply accordingly.

### Step 5: Build Session Payload

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
  "pushed_to_cms": 1,
  "data_queries_run": ["GROWTH_WEEKLY"],
  "estimated_time_saved_min": 67,
  "session_summary": "Created 2 LinkedIn posts using weekly growth data"
}
```

### Step 6: Confirm with User

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

Save to Base44?
```

Let user adjust any values before pushing.

### Step 7: Push to Base44

```bash
APP_ID=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['app_id'])") && \
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/$APP_ID/entities/PluginSession" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/session-log.json
```

Steps:
1. Write JSON payload to `/tmp/session-log.json` using the Write tool
2. Run the single bash command above (reads config + curls in one shell)
3. Parse the response for the created record ID

### Step 8: Report Result

**Success:**
```
Session logged. ID: {id}
Time saved this session: ~{N} minutes
```

**Error:**
- 401: "API key invalid. Set BASE44_API_KEY in your environment."
- 404: "PluginSession entity not found. Create it in your Base44 app first."
- Other: Show the error message from the API response.

---

## Workflow: View Team Usage

When user asks "show team usage", "who used the plugin", or "usage report":

### Step 1: Fetch All Sessions

```bash
APP_ID=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['app_id'])") && \
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X GET "https://app.base44.com/api/apps/$APP_ID/entities/PluginSession" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json"
```

### Step 2: Display Summary

**Team Dashboard (default):**

```markdown
## Plugin Usage — Last 7 Days

| User | Sessions | Content Pieces | Avg Guardian | Time Saved |
|------|----------|---------------|--------------|------------|
| Alice | 5 | 12 | 8.2/10 | ~4.5 hrs |
| Bob | 3 | 7 | 7.8/10 | ~2.1 hrs |
| **Total** | **8** | **19** | **8.0/10** | **~6.6 hrs** |

Top workflows: LINKEDIN (8x), DATA_INSIGHT (5x), SEO (3x)
```

**Individual View** (when user asks about a specific person):

```markdown
## Alice — Last 7 Days

| Date | Workflows | Content | Guardian | Time Saved |
|------|-----------|---------|----------|------------|
| Feb 21 | LINKEDIN, DATA_INSIGHT | 3 pieces | 8.5 | ~1.2 hrs |
| Feb 20 | SEO | 2 pieces | 8.0 | ~40 min |
```

**Filters:**
- "this week" / "last 7 days" — filter by `session_date`
- "this month" — filter by month
- "Alice's sessions" — filter by `user_name`
- "LinkedIn usage" — filter where `workflows_used` contains LINKEDIN

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

## PluginSession Entity Schema

Create this entity in your Base44 app to enable team tracking:

| Field | Type | Description |
|-------|------|-------------|
| `user_name` | string | Who logged the session |
| `user_email` | string | Email address |
| `session_date` | string | ISO timestamp |
| `duration_minutes` | number | Estimated session length |
| `workflows_used` | string[] | Which workflows ran |
| `content_pieces` | number | How many pieces created |
| `content_channels` | string[] | Which channels (linkedin, x, email, etc.) |
| `guardian_scores` | number[] | Individual guardian scores |
| `avg_guardian_score` | number | Average score |
| `pushed_to_cms` | number | How many pieces pushed to CMS |
| `data_queries_run` | string[] | Which data queries ran |
| `estimated_time_saved_min` | number | Minutes saved vs manual |
| `session_summary` | string | One-line summary |

---

## Dependencies

- **Base44 App API:** Same `$BASE44_APP_ID` and `$BASE44_API_KEY` as `base44-feature`
- **PluginSession entity:** Must exist in the Base44 app (create it once)

## Integration

- **Called by:** marketing-router (session end reminder), user direct request
- **Reads from:** Conversation history (session events), Base44 API (team usage)
- **Writes to:** Base44 `PluginSession` entity
