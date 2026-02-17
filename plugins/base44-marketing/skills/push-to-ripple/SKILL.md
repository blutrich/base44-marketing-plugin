---
name: push-to-ripple
description: Push generated marketing content into Ripple's Content entity. Use when user says "push to ripple", "save to ripple", "send to ripple", or wants to persist generated content into the Ripple CMS.
---

# Push to Ripple

> Bridge CLI-generated marketing content into Ripple's Content entity.

## When This Skill Activates

User says any of:
- "push to ripple"
- "save to ripple"
- "send to ripple"
- "push this to ripple"
- Wants to persist generated content into Ripple

## Step 1: Extract Content from Conversation

Scan the conversation for `<!-- CONTENT_START:channel -->` markers using this pattern:

```
/<!-- CONTENT_START:(\w+) -->\s*([\s\S]*?)\s*<!-- CONTENT_END -->/g
```

For each match:
- **channel** = capture group 1 (e.g., `linkedin`, `x`, `email`, `blog`)
- **body** = capture group 2 (the content between markers)

Also extract the guardian score if present. Look for patterns like:
- `Guardian Score: X/10`
- `Score: X/10`
- `Brand Guardian: X`

**Fallback:** If no `CONTENT_START` markers are found, detect the channel from conversation context (e.g., if a LinkedIn post was just generated, channel = `linkedin`). Use the full generated text as the body.

## Step 2: Build JSON Payload

For each extracted content piece, build an item object:

```json
{
  "items": [
    {
      "channel": "<detected channel>",
      "body": "<extracted content body>",
      "title": "<first line of content or subject line if email>",
      "content_type": "<post|thread|tweet|blog_post|etc>",
      "guardian_score": <number or null>
    }
  ]
}
```

**Channel-to-content_type mapping defaults:**
- linkedin → `post`
- x → `tweet` (or `thread` if multi-part)
- email → `nurture`
- blog → `blog_post`
- landing → `landing`
- discord → `announcement`
- video → `clip`
- meta_ads → `feed_ad`
- linkedin_ads → `feed_ad`
- reddit_ads → `feed_ad`

## Step 3: Confirm with User

Before pushing, show the user what will be sent:

```
Ready to push to Ripple:
- 1x LinkedIn post (Guardian Score: 8/10)
- 1x X tweet (Guardian Score: 7/10)

Confirm? (y/n)
```

Use AskUserQuestion to get confirmation.

## Step 4: Execute Bridge Script

Write the JSON payload to a temp file to avoid shell escaping issues, then pipe it to the bridge script:

```bash
cat /tmp/ripple-push.json | node "$RIPPLE_PROJECT_DIR/scripts/push-to-ripple.js"
```

Steps:
1. Write JSON payload to `/tmp/ripple-push.json` using the Write tool
2. Run the bash command above to pipe it to the bridge script
3. Capture stdout (the result JSON)

## Step 5: Report Results

Parse the JSON output from the script.

**On success:**
```
Pushed to Ripple:
- LinkedIn post → content_id: abc123 (draft)
- X tweet → content_id: def456 (draft)

Batch ID: cli_1739654400000
Open Ripple to review and publish.
```

**On error:**
- If auth error: Tell user to run `npx base44 login`
- If per-item errors: Report which items failed and which succeeded
- If total failure: Show the error message from the script

## Valid Channels

`linkedin`, `x`, `email`, `blog`, `landing`, `discord`, `video`, `meta_ads`, `linkedin_ads`, `reddit_ads`

## Notes

- All content is created as **draft** status — user publishes from Ripple UI
- Guardian review is NOT needed here — it's already built into the marketing skills
- The `source: cli_marketing_skill` metadata tag identifies CLI-pushed content in Ripple
- Multiple content pieces from the same push share a `batch_id` for grouping
