---
name: data-insight
description: |
  Queries the Trino analytics warehouse for real Base44 metrics. Pulls growth trends, LLM model usage, premium conversion funnels, app creation/deployment data, feature adoption, remix/marketplace activity, detailed funnel analysis, referral impact, and user voice insights. Feeds real numbers into content creation.

  Triggers on: data insight, analytics, growth numbers, builder stats, conversion data, model usage, weekly numbers, metrics, how many builders, premium stats, user voice, top issues, what builders complain about, app trends, feature adoption, remix, referrals, funnel, model preferences.

  REQUIRES: Trino MCP installed (see reference/setup.md)
---

# Data Insight

> Real analytics from the Trino warehouse, formatted for marketing.

## Contents

- [When to Use](#when-to-use)
- [Workflow](#workflow)
- [Query Catalog](#query-catalog)
- [Display Formats](#display-formats)
- [Feeding Data to Other Skills](#feeding-data-to-other-skills)
- [Tables Reference](#tables-reference)
- [Dependencies](#dependencies)
- [Integration](#integration)

---

## When to Use

Use this skill when:
- You need real growth numbers for content (weekly signups, publish rates, milestones)
- You want LLM model usage data (which models builders use, token costs)
- You need premium conversion funnel metrics (tier breakdown, time-to-value, churn)
- You want app creation trends (how many apps, deployment rates, weekly velocity)
- You need feature adoption data (agents, deep coding, GitHub, auth usage)
- You want remix/marketplace activity (community reuse, template purchases)
- You need detailed funnel analysis (every step from anonymous visit to premium)
- You want referral impact data (referred vs organic conversion rates)
- You want to know what builders are struggling with (user voice / top issues)
- The marketing router needs fresh data before creating content
- A content skill needs social proof numbers ("400K+ builders", "244K signups last week")

---

## Workflow

### Step 1: Determine Data Need

Classify what the user wants:

| User Says | Query Category |
|-----------|---------------|
| "growth numbers", "how many builders", "signups" | `GROWTH_WEEKLY` or `GROWTH_MONTHLY` |
| "model usage", "which models", "LLM stats" | `LLM_MODELS` or `LLM_TREND` |
| "premium", "conversion", "funnel", "churn" | `PREMIUM_FUNNEL` or `TIME_TO_VALUE` |
| "milestones", "total users", "all-time" | `MILESTONES` |
| "app categories", "what are builders building" | `APP_CATEGORIES` |
| "app trends", "how many apps", "apps created" | `APP_CREATION_TREND` |
| "model preferences", "what model do builders pick" | `APP_MODEL_PREFERENCES` |
| "feature adoption", "agents usage", "deep coding", "github" | `APP_FEATURE_ADOPTION` |
| "remix", "marketplace", "templates" | `APP_REMIX_MARKETPLACE` |
| "user voice", "top issues", "complaints", "what's broken" | `USER_VOICE` |
| "full funnel", "conversion funnel", "drop-off" | `FUNNEL_DETAILED` |
| "funnel timing", "how long to convert", "activation speed" | `FUNNEL_TIME_DETAILED` |
| "referrals", "referral impact", "word of mouth" | `REFERRAL_IMPACT` |
| "dashboard", "overview", "all metrics" | Run `GROWTH_WEEKLY` + `LLM_MODELS` + `PREMIUM_FUNNEL` |
| Anything else specific | `CUSTOM` — build SQL from user description |

### Step 2: Load and Run Query

```
Read(file_path="skills/data-insight/reference/queries.md")
```

Find the matching query. Execute it using the Trino MCP:

```
mcp__trino__trino__execute_trino_sql_query(query="<SQL from catalog>")
```

**If Trino MCP is not available:** Tell the user to install it — `Read(file_path="skills/data-insight/reference/setup.md")` and share the setup instructions.

### Step 3: Format Results

Choose a display format based on the user's intent:

| Intent | Format |
|--------|--------|
| "show me the numbers" | **Dashboard** |
| Creating content (post, ad, email) | **Social Proof Block** |
| Strategic planning | **Trend Narrative** |
| Deep analysis | **Raw Table** |

### Step 4: Feed to Content Skills (if requested)

If the user wants content based on the data:

1. Format the key numbers as a **Social Proof Block**
2. Pass to the appropriate content skill via the router:
   - "Write a LinkedIn post about our growth" -> pass numbers to linkedin-specialist
   - "Create an ad with our stats" -> pass numbers to ad-specialist
   - "Plan a campaign around milestones" -> pass numbers to planner

---

## Query Catalog

16 pre-built query categories. See `reference/queries.md` for exact SQL.

| ID | Purpose | Key Metrics |
|----|---------|-------------|
| `GROWTH_WEEKLY` | Weekly signups, publishes, premium conversions | New builders/week, publish rate, conversion rate |
| `GROWTH_MONTHLY` | Monthly aggregates with MoM % change | Monthly growth trends, acceleration |
| `LLM_MODELS` | Model distribution by provider | Top models, market share, token volume |
| `LLM_TREND` | Model usage over time (weekly) | Adoption curves, emerging models |
| `PREMIUM_FUNNEL` | Tier breakdown, publish rates, churn | Tier distribution, retention, churn rate |
| `TIME_TO_VALUE` | Avg hours: signup -> message -> publish -> premium | Funnel velocity, activation speed |
| `MILESTONES` | All-time totals | Total builders, total apps, total premium |
| `APP_CATEGORIES` | Top app verticals | What builders are building |
| `APP_CREATION_TREND` | Weekly app creation & deployment | Apps/week, deploy rate, remix volume |
| `APP_MODEL_PREFERENCES` | Builder model choices in editor | Model popularity, deploy success by model |
| `APP_FEATURE_ADOPTION` | Platform feature usage rates | Agents, deep coding, GitHub, auth adoption |
| `APP_REMIX_MARKETPLACE` | Remix and marketplace activity | Remix rate, marketplace purchases, community reuse |
| `FUNNEL_DETAILED` | Full funnel with all touchpoints | Anonymous → message → publish → credit wall → pricing → premium |
| `FUNNEL_TIME_DETAILED` | Hours between each funnel step | Step-by-step activation speed |
| `REFERRAL_IMPACT` | Referral-driven signups & conversion | Referral %, referred publish/premium rates |
| `USER_VOICE` | Top issues by highlight/ticket count | Pain points, trending complaints |

---

## Display Formats

### Dashboard

Best for: Quick overview of all key metrics.

```markdown
## Base44 Growth Dashboard

### Builders
- **Total:** 4.5M+
- **This week:** 244K new signups
- **Publish rate:** 32% (signup -> first app published)

### Premium
- **Active premium:** 120K builders
- **Top tier:** Builder (44K)
- **Time to premium:** ~48 hours from signup

### Models
- **#1:** Gemini 2.0 Flash Lite (42% of calls)
- **#2:** Claude Sonnet 4.5 (18%)
- **Rising:** GPT-5 (first appearances)

### User Voice
- **Top issue:** [issue title] ([N] highlights)
```

### Social Proof Block

Best for: Ready-to-paste numbers for content creation.

```markdown
## Social Proof Numbers (as of [date])

- 4.5M+ builders on Base44
- 244K new builders joined last week
- 120K premium builders
- 32% of builders publish an app within their first session
- Average time to first message: 5 hours from signup
- Builders use 15+ AI models including Claude, Gemini, and GPT
```

### Trend Narrative

Best for: GTM strategist context, strategy planning.

```markdown
## Growth Narrative

Base44 is adding ~244K new builders per week, roughly double the rate
from October 2025. The publish-to-signup ratio sits at 32%, meaning
about 1 in 3 new signups ships an app.

Premium conversion is strongest in the Builder tier (44K active),
with an average time-to-premium of ~48 hours from signup. Churn
remains low at [X]% monthly.

On the AI side, Gemini 2.0 Flash Lite dominates with 42% of model
calls, followed by Claude Sonnet 4.5 at 18%. GPT-5 is starting to
appear in the logs — worth watching.
```

### Raw Table

Best for: Data analysis, spreadsheet export.

Output the query results as a markdown table with all columns.

---

## Feeding Data to Other Skills

### Data -> LinkedIn Post

```
1. Run GROWTH_WEEKLY or MILESTONES query
2. Format as Social Proof Block
3. Pass to linkedin-specialist with context:
   "Here are the latest Base44 growth numbers: [social proof block].
    Write a LinkedIn post highlighting [specific metric]."
```

### Data -> Paid Ad

```
1. Run MILESTONES or PREMIUM_FUNNEL query
2. Format as Social Proof Block
3. Pass to ad-specialist with context:
   "Use these real numbers in the ad copy: [social proof block]."
```

### Data -> Email Campaign

```
1. Run GROWTH_WEEKLY + USER_VOICE queries
2. Combine growth story with user pain points
3. Pass to copywriter:
   "Growth context: [numbers]. User pain points: [top issues].
    Write a nurture email that addresses [issue] and shows momentum."
```

### Data -> GTM Strategy

```
1. Run all queries (dashboard format)
2. Pass full dashboard to gtm-strategist:
   "Here's the current Base44 analytics dashboard: [dashboard].
    Help me build a content strategy based on these numbers."
```

---

## Tables Reference

### `prod.wt_base44_users.base`

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | varchar | Unique builder ID |
| `created_date` | date | Signup date |
| `subscription_tier` | varchar | Current tier (free, builder, pro, etc.) |
| `is_active_premium_user` | boolean | Currently paying |
| `first_message_added_ts` | timestamp | First interaction |
| `first_app_published_ts` | timestamp | First app published |
| `first_premium_ts` | timestamp | First premium subscription |
| `first_premium_canceled_ts` | timestamp | First cancellation (null if active) |
| `is_qa_user` | boolean | Internal test account (exclude from metrics) |

### `prod.base44.datadog_llm_spans_log`

| Column | Type | Description |
|--------|------|-------------|
| `model_name` | varchar | Model identifier (e.g., "gemini-2.0-flash-lite") |
| `model_provider` | varchar | Provider (google, anthropic, openai) |
| `user_id` | varchar | Builder who triggered the call |
| `app_id` | varchar | App context |
| `input_tokens` | bigint | Prompt tokens |
| `output_tokens` | bigint | Completion tokens |
| `total_tokens` | bigint | Total tokens |
| `estimated_total_cost` | double | Estimated cost in USD |
| `timestamp` | timestamp | When the call happened |

### `prod.marketing.base44_user_generated_apps_v2`

| Column | Type | Description |
|--------|------|-------------|
| `_id` | varchar | Unique app ID |
| `created_date` | timestamp | App creation timestamp |
| `owner_id` | varchar | Builder who owns the app |
| `name` | varchar | App name |
| `user_description` | varchar | Builder's description of the app |
| `model` | varchar | AI model selected (e.g., "claude_sonnet_4_5", "gpt_5", "gemini_2_5_pro") |
| `agents_enabled` | boolean | AI agents feature active |
| `deep_coding_mode` | boolean | Deep coding mode active |
| `connected_to_github` | boolean | GitHub repo connected |
| `is_remixable` | boolean | App is available for remixing |
| `remixed_from_app_id` | varchar | Source app if remixed (null if original) |
| `is_marketplace_purchase` | varchar | Purchased from marketplace |
| `last_deployed_at` | timestamp | Last deployment timestamp (null if never deployed) |
| `app_stage` | varchar | "ready" or "pending" |
| `app_type` | varchar | "standard" or "baas" |
| `categories` | varchar | App categories |
| `enable_username_password` | boolean | Auth enabled |
| `is_deleted` | boolean | Soft-deleted (filter with `WHERE is_deleted = false`) |
| `slug` | varchar | App URL slug |
| `public_url` | varchar | Live app URL |

### `prod.wt_base44_users.base_full`

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | varchar | Unique builder ID |
| `created_date` | date | Signup date |
| `subscription_tier` | varchar | Current tier |
| `is_active_premium_user` | boolean | Currently paying |
| `first_anonymous_ts` | timestamp | First anonymous visit |
| `first_message_added_ts` | timestamp | First interaction |
| `second_message_added_ts` | timestamp | Second message (engagement depth) |
| `first_app_published_ts` | timestamp | First app published |
| `first_out_of_credits_ts` | timestamp | First time credits ran out |
| `first_package_picker_ts` | timestamp | First time saw pricing page |
| `first_purchase_page_ts` | timestamp | First time reached purchase page |
| `first_premium_ts` | timestamp | First premium subscription |
| `first_premium_canceled_ts` | timestamp | First cancellation |
| `referrer_user_id` | varchar | Builder who referred this user (null if organic) |
| `is_qa_user` | boolean | Internal test account (exclude from metrics) |

### `prod.cs_dwh.base44_user_voice_daily_pulse`

| Column | Type | Description |
|--------|------|-------------|
| `highlight_id` | varchar | Unique highlight ID |
| `ticket_id` | varchar | Support ticket ID |
| `base44_thread_id` | varchar | Thread reference |
| `issue_title` | varchar | Issue category/title |
| `issue_description` | varchar | Detailed description |
| `user_type` | varchar | Type of user |
| `is_partner` | boolean | Partner vs regular builder |
| `execution_date` | date | Date of the report |

---

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| Trino MCP | SQL query engine for analytics warehouse |

**Install:** See `reference/setup.md` for one-command installation.

All 4 data dimensions (growth, models, funnel, user voice) live in Trino. No other MCP needed.

---

## Integration

**Called by:** marketing-router (DATA_INSIGHT workflow)
**Depends on:** Trino MCP (`mcp__trino__trino__execute_trino_sql_query`)
**Feeds into:** linkedin-specialist, x-specialist, ad-specialist, copywriter, seo-specialist, planner, gtm-strategist
