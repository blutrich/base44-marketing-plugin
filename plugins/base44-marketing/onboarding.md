# Marketing Agent Onboarding

> Get set up in 10 minutes. Works in Claude Code (terminal) or Claude Cowork (desktop UI).

---

## Step 1: Get Claude

**Option A: Claude Cowork (recommended for non-technical users)**
- Download from [claude.ai/downloads](https://claude.ai/downloads)
- Open Cowork tab (middle tab)
- Choose a working folder when prompted

**Option B: Claude Code (terminal)**
- Already installed if you use the CLI
- Open terminal, navigate to your working folder

Both use the same engine. Cowork is a visual wrapper around Code.

---

## Step 2: Connect Slack

Slack is how the agent reads feature channels, product sync, and builder feedback.

1. Go to **Customize** (left sidebar)
2. Click **Connect your tools**
3. Find **Slack** and click **Connect**
4. Authorize the Base44 workspace when prompted
5. Verify it says **Connected** (or **Interactive**)

**Troubleshooting:**
- "Error connecting to MCP server": Try disconnecting and reconnecting
- "Network access blocked": Your IT policy may be blocking the connection. Contact Ayal Nahari or Talia (Base44 IT)
- Enterprise license conflicts: If Wix is migrating to Claude Enterprise, your personal account may be blocked. Ask Saray for help

---

## Step 3: Install the Marketing Plugin

1. Go to **Customize** > **Browse Plugins**
2. Click the **+** button next to "Personal"
3. Select **Add marketplace from URL**
4. Paste: `https://github.com/blutrich/base44-marketing-agent`
5. Click **Install**
6. Click **Manage** to verify it's active

**After install, you should see:**
- 9 agents (gtm-strategist, linkedin-specialist, x-specialist, etc.)
- 24+ skills (waterfall, feature-intel, push-to-activity, etc.)

**Troubleshooting:**
- "Network access to github.com is blocked": Try "Add marketplace from GitHub" instead of URL. If still blocked, use Claude Code terminal instead: the plugin works there even if Cowork blocks it
- Plugin shows but skills are empty: Click **See all** to expand the full list

---

## Step 4: Set Up API Keys (Optional)

Only needed if you want to push content to the Product App or Ripple.

1. Create the config file:
   ```
   mkdir -p .claude/marketing
   ```
2. Create `.claude/marketing/api-config.json`:
   ```json
   {
     "api_key": "YOUR_API_KEY_HERE"
   }
   ```
3. Get the API key from Ofer or the #claude-code-for-marketing-team Slack channel

---

## Quick Start: Your First Prompt

### Scan for upcoming features
```
Use Base44 marketing waterfall skill to find upcoming features
```

### Run a full waterfall on a specific feature
```
Use Base44 marketing waterfall skill on [feature name]
```

### Write a LinkedIn post
```
Write a LinkedIn post about [topic]
```

### Get a feature digest
```
Run feature intel scan
```

---

## Key Things to Know

### The Waterfall (8 phases)
The waterfall is the main workflow for feature launches. It goes:
1. **Discovery** - Scans Slack + web for competitive landscape
2. **Product Understanding** - What it does, who it's for, constraints
3. **Positioning** - Pain points, proof points, competitive matrix
4. **Messaging Framework** - THE critical gate. All content derives from this. You approve it before assets are created.
5. **Asset Creation** - LinkedIn, X, email, Discord, blog, video scripts (runs in parallel)
6. **Launch Execution** - Day-of checklist
7. **Push to Product App** - Syncs all content to MarketingActivity entity

You can stop, give feedback, and redirect at any phase. The agent waits for your approval before moving to the next phase.

### Brand Guardian
Every piece of content goes through an automated brand check (21 rules). It scores content 1-10. Below 9, it auto-rewrites. You always see the score.

### Working Folder
All output goes to a folder on your machine. You can find it in the right sidebar (Cowork) or in the terminal output (Code). Files are organized by launch/feature.

### You Can Always Redirect
Type feedback while the agent is working. You don't need to wait for it to finish. Say things like:
- "Don't mention competitor names"
- "Focus on the builder pain point, not the feature"
- "Make it shorter"
- "This isn't how the feature works, here's what it actually does: ..."

### PMM Notes Are Gold
The agent reads Slack channels for context, but your conversations with PMs and devs add details that Slack doesn't capture. Paste your interview notes or meeting summaries into the conversation during Phase 1 (Product Understanding) for much better output.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| Agent defaults to Maor's voice for brand posts | Fixed in v1.14.0+. Update the plugin. |
| Agent names competitors in posts | Fixed in v1.15.0+. Now a hard rule: no competitor names in published content. |
| Content scores 7/10 but agent doesn't improve it | Fixed in v1.15.0+. Guardian now auto-revises anything below 9/10. |
| Can't install plugin in Cowork | Try Claude Code terminal instead. Same engine, just different UI. |
| Slack not connecting | Disconnect, reconnect. Check with IT if blocked by enterprise policy. |
| "I" voice on brand account | Fixed in v1.15.0+. Brand = "we", Maor = "I". |

---

## Getting Help

- **Slack:** #claude-code-for-marketing-team
- **Ofer:** DM for plugin issues, API keys, or feature requests
- **IT issues:** Ayal Nahari, Talia, Eitan
