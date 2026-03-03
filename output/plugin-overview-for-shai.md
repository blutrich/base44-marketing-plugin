# Base44 Marketing Plugin — Overview for Shai

> One command. Nine agents. Every piece of content validated before you see it.

---

## Getting Started — Install Claude Code + the Plugin

### Step 1: Install Claude Code

Claude Code is Anthropic's CLI tool that runs in your terminal. You need Node.js 18+ installed.

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code
```

After installing, run `claude` in your terminal to start it. On first run it will ask you to log in to your Anthropic account.

```bash
# Start Claude Code
claude
```

You'll see an interactive prompt where you can type requests. Claude Code runs in your terminal — no browser needed.

### Step 2: Install the Marketing Plugin

Inside Claude Code, run these two commands:

```
/plugin marketplace add blutrich/base44-marketing-plugin
/plugin install base44-marketing@blutrich-base44-marketing-plugin
```

That's it. The first line registers the source, the second installs the plugin. One-time setup.

### Step 3: Verify It Works

```
/base44-marketing:marketing-router Write a LinkedIn post about Base44
```

If you see the router classify your intent and an agent start generating content, you're set.

### Updating the Plugin

The plugin has `autoUpdate: true` — it pulls the latest version automatically when Claude Code starts. To force an update manually:

```
/plugin marketplace update base44-marketing
```

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `claude: command not found` | Run `npm install -g @anthropic-ai/claude-code` again, then restart your terminal |
| `/base44-marketing:marketing-router` not recognized | Make sure you ran both `marketplace register` and `marketplace add` steps |
| "Permission denied" errors | Check that you're logged in to Claude Code (`claude login`) |
| Fonts/logo missing in landing pages | Force update the plugin — font + logo assets are git-tracked since v1.9.0 |

---

## What It Does

`/base44-marketing:marketing-router` is the single entry point. Type what you need in plain English — the router classifies intent and chains to the right specialist agent. No menus, no setup. Every finished piece passes through a brand-guardian that scores it against 30 hard rules and rejects anything below 7/10.

```
/base44-marketing:marketing-router Write a LinkedIn post about our Debug Mode feature
```

---

## The Agent System

| Agent | What It Does | Model |
|-------|-------------|-------|
| **gtm-strategist** | Deep strategic planning — asks questions first, then delivers holistic GTM plans | Opus |
| **linkedin-specialist** | Viral LinkedIn posts in builder-to-builder voice | Opus |
| **x-specialist** | X/Twitter — tweets and threads, punchier than LinkedIn | Opus |
| **copywriter** | Email sequences, landing page copy, conversion copy (THE SLIDE framework) | Sonnet |
| **ad-specialist** | Paid ads for Meta, LinkedIn, Reddit — 3 headlines + 3 texts + visual | Sonnet |
| **seo-specialist** | Blog posts, pillar pages, SEO + GEO (AI citation optimization) | Sonnet |
| **video-specialist** | Marketing videos via Remotion (React-based) + storyboards | Sonnet |
| **planner** | Multi-channel campaigns — spawns agent teams for parallel execution | Opus |
| **brand-guardian** | Quality gate — scores every piece 1-10, rejects below 7, learns from feedback | Haiku |

---

## What You Can Create

| Content Type | Command Example |
|-------------|----------------|
| LinkedIn post | `/base44-marketing:marketing-router Write a LinkedIn post about AI agents` |
| X tweet/thread | `/base44-marketing:marketing-router Create a thread about our $1M ARR milestone` |
| Email sequence | `/base44-marketing:marketing-router Write an email for our new feature launch` |
| Blog / SEO article | `/base44-marketing:marketing-router Write a blog post about no-code AI agents` |
| Paid ad (Meta/LinkedIn/Reddit) | `/base44-marketing:marketing-router Create a Meta feed ad for Debug Mode` |
| Landing page (live URL) | `/base44-marketing:marketing-router Build a landing page for Debug Mode` |
| Video storyboard | `/base44-marketing:marketing-router Create a 30s video for our AI feature` |
| Multi-channel campaign | `/base44-marketing:marketing-router Plan a multi-channel launch for AI agents` |
| Data-driven content | `/base44-marketing:marketing-router Show me growth numbers and write a post` |
| Repurpose content | `/base44-marketing:marketing-router Turn this LinkedIn post into a tweet thread` |

---

## Data-Driven Content

The plugin queries Trino (our analytics warehouse) with 19 pre-built queries across 6 tables:

- **Growth** — weekly/monthly signups, publish rates, milestones
- **Model usage** — LLM distribution by provider, adoption trends
- **Funnel** — anonymous visit to premium, conversion rates, churn
- **App trends** — creation patterns, feature adoption (agents, deep coding, GitHub, auth)
- **Monetization** — Stripe integration, AI-predicted payment likelihood, paid vs free
- **User voice** — top pain points from CS tickets

Real numbers go directly into content. No more inventing stats.

---

## How Content Flows

```
You type a request
    |
    v
marketing-router (classifies intent)
    |
    v
Specialist agent (generates content)
    |  - Loads RULES.md (30 hard rules)
    |  - Loads tone-of-voice.md
    |  - Loads channel template
    |  - Pulls data if needed (Trino)
    |
    v
brand-guardian (scores 1-10)
    |  - Below 7 = rejected, sent back with fixes
    |  - Above 7 = approved, delivered to you
    |
    v
You review the output
    |
    v
Optional: "push to ripple" → lands as draft in Ripple CMS
```

---

## The Quality Gate

Every piece of content is checked against:

**Instant rejections (NEVER rules):**
- "users" or "customers" (we say "builders")
- "deploy" or "launch" (we say "ship" or "go live")
- "We're excited to announce" or any corporate opener
- Arrow bullets, emoji-as-bullets, default hashtags
- TV-ad tagline cadence ("Build. Ship. Scale.")
- Advertising melody (if it sounds like a billboard, rewrite)

**Required (ALWAYS rules):**
- Builder-to-builder voice
- Specific numbers ("400K+ builders", not "thousands")
- Results not promises
- Natural sentence flow
- The Maor Test: would Maor post this exactly as written?

The guardian also learns — when any issue appears twice, it auto-promotes to the rules so it never happens again.

---

## Landing Pages (End-to-End)

The plugin generates and deploys landing pages in one flow:

1. Gathers input (slug, goal, persona, key message)
2. Selects template (feature-launch, campaign, signup, case-study, enterprise)
3. Generates 8-section copy using the SLIDE framework
4. Validates against brand rules (must score 7+ before HTML generation)
5. Builds self-contained HTML — fonts and logo base64-embedded
6. Deploys via Base44 CLI
7. Returns live URL: `https://{slug}-landing.base44.app`

Fonts (STK Miso) and logo are now git-tracked in `assets/` — works for everyone.

---

## Multi-Channel Campaigns

When 3+ channels are mentioned, the router spawns an agent team:

```
planner (creates campaign brief)
    |
    +-- linkedin-specialist  --|
    +-- x-specialist          --|--> work in parallel
    +-- copywriter            --|
    +-- seo-specialist        --|
    |
    v
brand-guardian (reviews each piece)
    |
    v
Campaign package delivered
```

Cost warning is shown before spawning. Each agent writes to its own `output/{channel}/` directory.

---

## Ripple Integration

After generating any content:
```
/base44-marketing:marketing-router Push this to ripple
```

- Extracts content from the conversation
- Builds payload (channel, body, title, guardian score)
- Pushes as **draft** to Ripple CMS
- Team publishes from Ripple UI

Valid channels: linkedin, x, email, blog, landing, discord, video, meta_ads, linkedin_ads, reddit_ads.

---

## Session Tracking

At the end of any work session:
```
/base44-marketing:marketing-router Log this session
```

Captures: workflows triggered, content pieces created, guardian scores, data queries run, Ripple pushes. Calculates time saved (e.g., GTM strategy = 45 min saved, landing page = 30 min saved). Pushes to Ripple for ROI tracking.

---

## How the Team Starts Using It

```bash
# 1. Install the plugin
/plugin marketplace add blutrich/base44-marketing-plugin

# 2. Use it
/base44-marketing:marketing-router [what you need in plain English]

# 3. Review output, push to Ripple when ready
/base44-marketing:marketing-router Push this to ripple
```

No configuration needed. Brand rules, voice guidelines, templates, and design system are all bundled in the plugin.

---

## What's Ready Now (v1.9.0)

- 9 agents covering all marketing channels
- 20 skills (content, data, deployment, repurposing, session tracking)
- 30 hard brand rules with self-learning
- Trino data integration (19 queries, 6 tables)
- Landing page generation + Base44 hosting
- Ripple CMS integration
- Cross-platform repurposing
- Session logging with time-saved tracking
- Shared brand assets (fonts + logo) git-tracked for the whole team

---

## Open Items

| Item | Status |
|------|--------|
| Channel templates need Shai-approved real examples (LinkedIn, email, Discord have placeholders) | Ready for input |
| Router pre-loads ~47KB before routing (token optimization) | Planned for Phase 3 |
| Agent architecture redesign (Phase 3) | Not started |
