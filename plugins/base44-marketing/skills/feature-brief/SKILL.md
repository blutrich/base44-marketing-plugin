---
name: feature-brief
description: |
  Fetches Slack feature channel content (via Slack MCP), summarizes it into structured marketing briefs, and pushes them to Ripple's FeatureBrief entity. Extracts signal from noisy product discussions (Hebrew/English mix, join messages, bot reports) into clean, marketing-ready briefs.

  Triggers on: feature brief, summarize channel, summarize feature, brief me on, what is [feature], feature context, slack summary, channel summary, pull feature brief, update brief, fetch feat, read feat channel, list feat channels, what's in feat.
---

# Feature Brief

> Turn noisy Slack feature channels into structured marketing intelligence.

## When This Skill Activates

User says any of:
- "Summarize this feature channel"
- "Brief me on [feature name]"
- "Create a feature brief from this Slack dump"
- "What's the latest on [feature]?"
- "Pull the feature brief for [feature]"
- "Update the brief for [feature]"
- "Fetch feat-builder-mcp from Slack"
- "Read the feat channel for [feature]"
- "What's happening in feat-*?"
- "List feat channels"
- Pastes raw Slack channel content and asks for a summary

## Three Modes

### Mode A: Summarize (raw Slack content provided)

User pastes raw Slack channel content. Skill extracts a structured brief.

### Mode B: Pull (read existing brief from Ripple)

User asks about a feature by name. Skill fetches the FeatureBrief from Ripple and provides context to other skills/agents.

### Mode C: Fetch from Slack (live channel read via Slack MCP)

User asks to fetch/read a feat channel directly. Skill uses Slack MCP tools to discover channels, read messages, filter noise, and extract a structured brief — no manual pasting required.

---

## Mode A: Summarize Raw Slack Content

### Step 1: Filter Noise

Before summarizing, strip these from the raw content:
- `joined #channel` / `was added to #channel by` messages
- `made updates to` canvas notifications
- Mixpanel bot reports (keep the data if meaningful, strip the bot formatting)
- Empty messages (file-only with no text context)
- Single-word reactions ("nice!", "yayyy", "cool")
- Slack invitation links (`https://join.slack.com/share/...`)
- Channel rename notifications

### Step 2: Extract Signal

From the filtered content, identify and extract:

| Field | What to Look For |
|-------|-----------------|
| **feature_name** | Channel name without `feat-` prefix |
| **one_liner** | First description of what the feature does (usually from PM or tech lead in first messages) |
| **status** | `building` / `shipped` / `iterating` / `planned` based on latest messages |
| **summary** | 2-3 paragraph overview: what it is, why it matters, current state |
| **user_value** | What builders/users get from this feature. Translate engineering language to user benefits |
| **marketing_hooks** | 2-3 angles for content creation. Format: `Hook text (Target: audience, Channel: platform)` |
| **metrics** | Any numbers mentioned: adoption, conversion, engagement, token usage, costs, user counts |
| **key_decisions** | Architecture choices, scope decisions, pricing/gating decisions. Include who decided and when |
| **timeline** | Key dates: channel created, milestones, launches, reviews. End with current status |
| **stakeholders** | People mentioned with their roles. Infer role from context (PM, eng, UX, QA, marketing) |
| **competitive_context** | Competitor mentions, comparisons, inspiration sources |
| **technical_details** | Architecture, infrastructure, integrations. Summarize for non-engineers |
| **message_count** | Approximate count of meaningful messages (after filtering noise) |

### Step 3: Handle Hebrew/English Mix

The Slack channels mix Hebrew and English. When summarizing:
- Translate Hebrew content to English in the brief
- Preserve the original meaning and context
- If a Hebrew message contains a key decision or insight, translate it accurately
- Names stay as-is (don't transliterate)

### Step 4: Generate Marketing Hooks

For each feature, generate 2-3 marketing hooks following these patterns:

1. **Competitive angle**: How Base44 does it differently/better than competitors
2. **Builder value**: What builders can now do that they couldn't before
3. **Vision angle**: What this enables for the future of the platform

Each hook must include:
- The hook text (1 sentence, punchy)
- Target audience: `Prototypers` / `Pro Builders` / `Enterprise` / `Devs`
- Best channel: `LinkedIn` / `X` / `Blog` / `Email`

### Step 5: Push to Ripple

Build the JSON payload and push to the FeatureBrief entity in Ripple.

**API Details:**

```
Ripple App ID: 69809e95545ed2e086d167f9
Entity: FeatureBrief
```

**Credentials:** Read from `.claude/marketing/api-config.json`

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X POST "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/feature-brief.json
```

**To update an existing brief:**

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s -X PUT "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief/{RECORD_ID}" \
  -H "api_key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/feature-brief.json
```

**Payload structure:**

```json
{
  "feature_name": "builder-mcp",
  "slack_channel": "feat-builder-mcp",
  "one_liner": "Connect external tools to the AI builder via native OAuth",
  "status": "shipped",
  "summary": "Full 2-3 paragraph summary...",
  "user_value": "What builders get from this...",
  "marketing_hooks": "1. Hook (Target: X, Channel: Y)\n2. Hook...",
  "metrics": "Key numbers...",
  "key_decisions": "Decision 1 (Who, When)\nDecision 2...",
  "timeline": "Date 1: event. Date 2: event...",
  "stakeholders": "Name (role), Name (role)...",
  "competitive_context": "How competitors do it...",
  "technical_details": "Architecture summary...",
  "raw_slack_dump": "Full filtered text for reference",
  "last_updated": "2026-03-01T00:00:00Z",
  "message_count": 85
}
```

### Step 6: Confirm with User

After pushing, report:

```
Feature Brief: [feature_name]
Status: [status]
Pushed to Ripple: [record_id]

Summary: [one_liner]

Marketing Hooks:
1. [hook 1]
2. [hook 2]
3. [hook 3]

Key metrics: [top 3 numbers]

Ready for content creation. Use "write about [feature]" to create content with this context.
```

---

## Mode C: Fetch from Slack

> **Depends on:** Slack MCP tools (`slack_search_channels`, `slack_read_channel`)

Use this mode when the user asks to fetch, read, or pull from a feat channel directly. No copy-paste needed.

### Step 1: Detect Intent

| User says | Action |
|-----------|--------|
| "List feat channels" / "What feat channels exist?" | **Discovery** — list all feat-* channels |
| "Fetch feat-builder-mcp" / "Read the feat channel for skills" | **Single channel** — read that specific channel |
| "What's happening in feat-*?" / "Any new feat channels?" | **Discovery** — list channels, let user pick |

### Step 2: Discover Channels

Use the Slack MCP `slack_search_channels` tool to find feat channels:

```
Tool: slack_search_channels
Query: "feat-"
```

From the results, filter to channels whose name starts with `feat-`. Present them to the user:

```
Found [N] feat channels:

#feat-builder-mcp      — [topic/purpose if available]
#feat-debug-mode       — [topic/purpose if available]
#feat-skills           — [topic/purpose if available]
...

Which channel should I read? (or "all" for a summary of each)
```

If the user already specified a channel name, skip discovery and go straight to Step 3.

### Step 3: Read Channel Messages + Threads

Use the Slack MCP `slack_read_channel` tool to pull top-level messages:

```
Tool: slack_read_channel
Channel: #feat-[feature-name]
```

Read the channel content. If the channel has a lot of history, focus on the most recent messages first (they contain current status). Older messages provide timeline and decisions context.

**Then read all threads.** Most of the real discussion, decisions, and technical details live in threads, not top-level messages. For every message that has replies (indicated by "Thread: N replies" in the output):

```
Tool: slack_read_thread
Channel: [channel_id]
Message TS: [parent_message_ts]
```

Prioritize threads with:
- 3+ replies (active discussions)
- Threads from stakeholders (PM, eng leads, product)
- Threads that mention decisions, launches, metrics, or blockers

Skip threads that are purely:
- Bot notification threads (Mixpanel subscriptions)
- Single "thanks" or emoji-only replies
- Join notification threads

Combine top-level messages and thread content into a single filtered stream before moving to Step 4.

### Step 4: Filter Noise

Apply the same noise filter as Mode A Step 1:
- Strip `joined #channel` / `was added to #channel by` messages
- Strip `made updates to` canvas notifications
- Strip Mixpanel bot formatting (keep meaningful data)
- Strip empty messages (file-only with no text)
- Strip single-word reactions ("nice!", "yayyy", "cool")
- Strip Slack invitation links
- Strip channel rename notifications

### Step 5: Extract Signal

Run the same extraction as Mode A Step 2. From the filtered content, extract all fields:
`feature_name`, `one_liner`, `status`, `summary`, `user_value`, `marketing_hooks`, `metrics`, `key_decisions`, `timeline`, `stakeholders`, `competitive_context`, `technical_details`, `message_count`.

### Step 6: Handle Hebrew/English Mix

Same as Mode A Step 3 — translate Hebrew to English, preserve meaning, keep names as-is.

### Step 7: Generate Marketing Hooks

Same as Mode A Step 4 — competitive angle, builder value, vision angle.

### Step 8: Present Brief to User

Display the structured brief for review before pushing anywhere:

```
Feature Brief: [feature_name]
Source: #feat-[name] (fetched live from Slack)
Status: [status]
Messages read: [count]

One-liner: [one_liner]

Summary:
[2-3 paragraph summary]

Builder Value:
[user_value]

Marketing Hooks:
1. [hook 1] (Target: [audience], Channel: [platform])
2. [hook 2] (Target: [audience], Channel: [platform])
3. [hook 3] (Target: [audience], Channel: [platform])

Key Metrics: [metrics]

Ready to use as context for content creation.
Want me to push this to Ripple? Or write content about this feature?
```

### Step 9: Optional — Push to Ripple

If the user confirms, push using the same flow as Mode A Step 5 (POST/PUT to FeatureBrief entity). Add `source: "slack_mcp"` to the payload to track where the brief came from.

### Step 10: Feed Into Content Creation

The brief is now available as context. The user can say:
- "Write a LinkedIn post about this" → routes to linkedin-specialist with the brief as context
- "Create an X thread about this feature" → routes to x-specialist
- Any other content request → the brief travels as context through the marketing router

---

## Mode B: Pull Existing Brief

### Step 1: Fetch from Ripple

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY"
```

### Step 2: Match Feature

Search by `feature_name` field. Fuzzy match: "builder mcp" matches "builder-mcp", "skills" matches "feat-skills", etc.

### Step 3: Return Brief

If found, return the structured brief to the requesting agent/skill. When another skill (like linkedin-specialist) needs feature context, this is what it gets.

If not found, tell the user:
> No feature brief found for "[name]". I can fetch it directly from Slack — say "fetch feat-[name] from Slack". Or paste the channel content and I'll create one.

### Step 4: List All Briefs

If user asks "what briefs do we have" or "list features":

```bash
API_KEY=$(python3 -c "import json; print(json.load(open('.claude/marketing/api-config.json'))['api_key'])") && \
curl -s "https://app.base44.com/api/apps/69809e95545ed2e086d167f9/entities/FeatureBrief" \
  -H "api_key: $API_KEY" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data:
    print(f'{r[\"feature_name\"]:25} | {r[\"status\"]:10} | {r[\"one_liner\"][:60]}')
"
```

---

## Integration with Marketing Router

When the marketing router detects a content request about a specific feature:

1. Router identifies the feature name from the user's request
2. Router calls this skill in Mode B (pull from Ripple) or Mode C (fetch from Slack) to get the brief
3. Brief is passed as context to the content specialist (linkedin, x, email, etc.)
4. Content is created with full feature context

This means:
- "Write a LinkedIn post about Base Agent" → pulls the brief from Ripple (Mode B) and feeds to linkedin-specialist
- "Fetch feat-base-agent and write a post" → reads from Slack (Mode C), extracts brief, feeds to linkedin-specialist

---

## Also Push to Product App Feature Entity

When pushing a brief to Ripple, also update the corresponding Feature record in the product app if it exists:

```
Product App ID: 692b72212d45f3a5bc07e7ae
Entity: Feature
Field: marketing_description
```

Search for a matching Feature by title, then update its `marketing_description` with a formatted version of the brief. This keeps both Ripple (FeatureBrief) and the product app (Feature.marketing_description) in sync.

---

## Dependencies

- **Mode A:** No external dependencies (user provides content)
- **Mode B:** Base44 REST API (credentials in `.claude/marketing/api-config.json`)
- **Mode C:** Slack MCP tools — `slack_search_channels`, `slack_read_channel` (must be connected)

## Notes

- All briefs are living documents. Re-running on updated Slack content should UPDATE the existing record, not create a duplicate
- The `raw_slack_dump` field stores filtered content (noise removed) for future re-processing
- Hebrew content is translated to English in all structured fields
- Briefs should be re-generated when significant new content arrives (launch, metrics, pivot)
- The skill works standalone or as a dependency for other marketing skills
- Mode C requires the Slack MCP server to be connected. If not available, fall back to Mode A (paste) or Mode B (Ripple)
- When using Mode C, the `source` field in the payload is set to `"slack_mcp"` to distinguish from paste-based briefs
