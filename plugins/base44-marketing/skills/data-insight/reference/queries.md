# Data Insight Query Catalog

> Pre-built, tested SQL queries for Base44 analytics. All queries run against the `prod` catalog via the Trino MCP.

**Important:** Always filter out QA/test accounts with `WHERE is_qa_user = false` on user queries.

---

## GROWTH_WEEKLY

Weekly signups, publishes, and premium conversions for the last 12 weeks.

```sql
SELECT
  date_trunc('week', created_date) AS week,
  count(DISTINCT user_id) AS new_signups,
  count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) AS published,
  count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END) AS converted_premium,
  round(100.0 * count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) / count(DISTINCT user_id), 1) AS publish_rate_pct,
  round(100.0 * count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END) / count(DISTINCT user_id), 1) AS premium_rate_pct
FROM prod.wt_base44_users.base
WHERE is_qa_user = false
  AND created_date >= current_date - interval '12' week
GROUP BY 1
ORDER BY 1 DESC
```

**Columns:** week, new_signups, published, converted_premium, publish_rate_pct, premium_rate_pct
**Marketing use:** Weekly growth momentum, "X builders joined last week", signup acceleration trends

---

## GROWTH_MONTHLY

Monthly aggregates with month-over-month % change.

```sql
WITH monthly AS (
  SELECT
    date_trunc('month', created_date) AS month,
    count(DISTINCT user_id) AS new_signups,
    count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) AS published,
    count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END) AS converted_premium
  FROM prod.wt_base44_users.base
  WHERE is_qa_user = false
    AND created_date >= current_date - interval '6' month
  GROUP BY 1
)
SELECT
  month,
  new_signups,
  published,
  converted_premium,
  round(100.0 * (new_signups - lag(new_signups) OVER (ORDER BY month)) / lag(new_signups) OVER (ORDER BY month), 1) AS signup_mom_pct,
  round(100.0 * published / new_signups, 1) AS publish_rate_pct
FROM monthly
ORDER BY month DESC
```

**Columns:** month, new_signups, published, converted_premium, signup_mom_pct, publish_rate_pct
**Marketing use:** Monthly growth narratives, MoM acceleration, "signups doubled since October"

---

## LLM_MODELS

Model usage distribution — top models by call volume.

```sql
SELECT
  model_name,
  model_provider,
  count(*) AS total_calls,
  round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_of_calls,
  sum(total_tokens) AS total_tokens,
  round(sum(estimated_total_cost), 2) AS total_cost_usd
FROM prod.base44.datadog_llm_spans_log
WHERE timestamp >= current_date - interval '7' day
GROUP BY 1, 2
ORDER BY total_calls DESC
LIMIT 20
```

**Columns:** model_name, model_provider, total_calls, pct_of_calls, total_tokens, total_cost_usd
**Marketing use:** "Builders use 15+ AI models", model distribution chart, provider diversity story

---

## LLM_TREND

Weekly model usage trends — track adoption curves.

```sql
SELECT
  date_trunc('week', timestamp) AS week,
  model_name,
  model_provider,
  count(*) AS calls,
  sum(total_tokens) AS tokens
FROM prod.base44.datadog_llm_spans_log
WHERE timestamp >= current_date - interval '8' week
GROUP BY 1, 2, 3
ORDER BY 1 DESC, calls DESC
```

**Columns:** week, model_name, model_provider, calls, tokens
**Marketing use:** "GPT-5 adoption growing", model trend narratives, emerging AI capabilities

---

## PREMIUM_FUNNEL

Tier distribution and activity rates for active premium builders.

```sql
SELECT
  subscription_tier,
  count(DISTINCT user_id) AS total_users,
  count(DISTINCT CASE WHEN is_active_premium_user = true THEN user_id END) AS active_premium,
  count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) AS has_published,
  round(100.0 * count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) / count(DISTINCT user_id), 1) AS publish_rate_pct,
  count(DISTINCT CASE WHEN first_premium_canceled_ts IS NOT NULL THEN user_id END) AS churned,
  round(100.0 * count(DISTINCT CASE WHEN first_premium_canceled_ts IS NOT NULL THEN user_id END) / NULLIF(count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END), 0), 1) AS churn_rate_pct
FROM prod.wt_base44_users.base
WHERE is_qa_user = false
GROUP BY 1
ORDER BY total_users DESC
```

**Columns:** subscription_tier, total_users, active_premium, has_published, publish_rate_pct, churned, churn_rate_pct
**Marketing use:** Tier breakdown for pricing pages, "80% of premium builders publish an app", churn narratives

---

## TIME_TO_VALUE

Average hours from signup to key milestones.

```sql
SELECT
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_message_added_ts)), 1) AS avg_hours_to_first_message,
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_app_published_ts)), 1) AS avg_hours_to_first_publish,
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_premium_ts)), 1) AS avg_hours_to_premium
FROM prod.wt_base44_users.base
WHERE is_qa_user = false
  AND created_date >= current_date - interval '30' day
  AND first_message_added_ts IS NOT NULL
```

**Columns:** avg_hours_to_first_message, avg_hours_to_first_publish, avg_hours_to_premium
**Marketing use:** "Ship your first app in hours, not months", activation speed, time-to-value narratives

---

## MILESTONES

All-time totals for milestone announcements.

```sql
SELECT
  count(DISTINCT user_id) AS total_builders,
  count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) AS builders_who_published,
  count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END) AS total_ever_premium,
  count(DISTINCT CASE WHEN is_active_premium_user = true THEN user_id END) AS active_premium_now,
  min(created_date) AS platform_launch_date
FROM prod.wt_base44_users.base
WHERE is_qa_user = false
```

**Columns:** total_builders, builders_who_published, total_ever_premium, active_premium_now, platform_launch_date
**Marketing use:** "4.5M+ builders", milestone announcements, press kit numbers

---

## APP_CATEGORIES

Top app verticals — what builders are building.

```sql
SELECT
  classification,
  count(DISTINCT id) AS app_count,
  round(100.0 * count(DISTINCT id) / sum(count(DISTINCT id)) OVER (), 1) AS pct_of_apps
FROM prod.wt_apps.base
WHERE classification IS NOT NULL
  AND classification != ''
GROUP BY 1
ORDER BY app_count DESC
LIMIT 20
```

**Columns:** classification, app_count, pct_of_apps
**Marketing use:** "Builders are creating everything from CRMs to AI agents", vertical diversity, use case stories

---

## USER_VOICE

Top issues reported by builders, ranked by highlight count.

```sql
SELECT
  issue_title,
  count(DISTINCT highlight_id) AS highlight_count,
  count(DISTINCT ticket_id) AS ticket_count,
  count(DISTINCT CASE WHEN is_partner = true THEN highlight_id END) AS partner_highlights,
  max(execution_date) AS latest_report
FROM prod.cs_dwh.base44_user_voice_daily_pulse
WHERE execution_date >= current_date - interval '7' day
GROUP BY 1
ORDER BY highlight_count DESC
LIMIT 15
```

**Columns:** issue_title, highlight_count, ticket_count, partner_highlights, latest_report
**Marketing use:** Understand builder pain points, inform content that addresses real issues, empathy-driven messaging

---

## APP_CREATION_TREND

Weekly app creation and deployment trends.

```sql
SELECT
  date_trunc('week', created_date) AS week,
  count(*) AS apps_created,
  count(CASE WHEN last_deployed_at IS NOT NULL THEN 1 END) AS apps_deployed,
  round(100.0 * count(CASE WHEN last_deployed_at IS NOT NULL THEN 1 END) / count(*), 1) AS deploy_rate_pct,
  count(CASE WHEN remixed_from_app_id IS NOT NULL THEN 1 END) AS remixed,
  count(CASE WHEN agents_enabled = true THEN 1 END) AS with_agents
FROM prod.marketing.base44_user_generated_apps_v2
WHERE is_deleted = false
  AND created_date >= current_date - interval '84' day
GROUP BY 1
ORDER BY 1 DESC
```

**Columns:** week, apps_created, apps_deployed, deploy_rate_pct, remixed, with_agents
**Marketing use:** "Builders created X apps last week", app velocity trends, deployment momentum

---

## APP_MODEL_PREFERENCES

Which AI models builders select in the editor.

```sql
SELECT
  model,
  count(*) AS app_count,
  round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_of_apps,
  count(CASE WHEN last_deployed_at IS NOT NULL THEN 1 END) AS deployed,
  round(100.0 * count(CASE WHEN last_deployed_at IS NOT NULL THEN 1 END) / NULLIF(count(*), 0), 1) AS deploy_rate_pct
FROM prod.marketing.base44_user_generated_apps_v2
WHERE is_deleted = false
  AND model IS NOT NULL
  AND model != 'default'
GROUP BY 1
ORDER BY app_count DESC
```

**Columns:** model, app_count, pct_of_apps, deployed, deploy_rate_pct
**Marketing use:** "Most popular builder model choices", model preference vs deployment success

---

## APP_FEATURE_ADOPTION

Platform feature adoption rates across all active apps.

```sql
SELECT
  count(*) AS total_apps,
  count(CASE WHEN agents_enabled = true THEN 1 END) AS agents_enabled,
  round(100.0 * count(CASE WHEN agents_enabled = true THEN 1 END) / count(*), 1) AS agents_pct,
  count(CASE WHEN deep_coding_mode = true THEN 1 END) AS deep_coding,
  round(100.0 * count(CASE WHEN deep_coding_mode = true THEN 1 END) / count(*), 1) AS deep_coding_pct,
  count(CASE WHEN connected_to_github = true THEN 1 END) AS github_connected,
  round(100.0 * count(CASE WHEN connected_to_github = true THEN 1 END) / count(*), 1) AS github_pct,
  count(CASE WHEN is_remixable = true THEN 1 END) AS remixable,
  round(100.0 * count(CASE WHEN is_remixable = true THEN 1 END) / count(*), 1) AS remixable_pct,
  count(CASE WHEN enable_username_password = true THEN 1 END) AS has_auth,
  round(100.0 * count(CASE WHEN enable_username_password = true THEN 1 END) / count(*), 1) AS auth_pct
FROM prod.marketing.base44_user_generated_apps_v2
WHERE is_deleted = false
```

**Columns:** total_apps, agents_enabled, agents_pct, deep_coding, deep_coding_pct, github_connected, github_pct, remixable, remixable_pct, has_auth, auth_pct
**Marketing use:** "42% of apps use AI agents", feature adoption stories, platform capability proof points

---

## APP_REMIX_MARKETPLACE

Remix and marketplace activity.

```sql
SELECT
  count(*) AS total_apps,
  count(CASE WHEN remixed_from_app_id IS NOT NULL THEN 1 END) AS remixed_apps,
  round(100.0 * count(CASE WHEN remixed_from_app_id IS NOT NULL THEN 1 END) / count(*), 1) AS remix_rate_pct,
  count(CASE WHEN is_marketplace_purchase = 'true' THEN 1 END) AS marketplace_purchases,
  count(CASE WHEN purchase_from_id IS NOT NULL THEN 1 END) AS purchased_apps,
  count(DISTINCT remixed_from_app_id) AS unique_source_apps
FROM prod.marketing.base44_user_generated_apps_v2
WHERE is_deleted = false
```

**Columns:** total_apps, remixed_apps, remix_rate_pct, marketplace_purchases, purchased_apps, unique_source_apps
**Marketing use:** Remix/community narrative, "X apps remixed from the community", marketplace traction

---

## FUNNEL_DETAILED

Full funnel with all touchpoints from signup to premium (uses base_full for deeper timestamps).

```sql
SELECT
  count(DISTINCT user_id) AS total_builders,
  count(DISTINCT CASE WHEN first_anonymous_ts IS NOT NULL THEN user_id END) AS visited_anonymous,
  count(DISTINCT CASE WHEN first_message_added_ts IS NOT NULL THEN user_id END) AS sent_first_message,
  count(DISTINCT CASE WHEN second_message_added_ts IS NOT NULL THEN user_id END) AS sent_second_message,
  count(DISTINCT CASE WHEN first_app_published_ts IS NOT NULL THEN user_id END) AS published_app,
  count(DISTINCT CASE WHEN first_out_of_credits_ts IS NOT NULL THEN user_id END) AS hit_credit_wall,
  count(DISTINCT CASE WHEN first_package_picker_ts IS NOT NULL THEN user_id END) AS saw_pricing,
  count(DISTINCT CASE WHEN first_purchase_page_ts IS NOT NULL THEN user_id END) AS reached_purchase,
  count(DISTINCT CASE WHEN first_premium_ts IS NOT NULL THEN user_id END) AS converted_premium,
  count(DISTINCT CASE WHEN first_premium_canceled_ts IS NOT NULL THEN user_id END) AS canceled
FROM prod.wt_base44_users.base_full
WHERE is_qa_user = false
  AND created_date >= current_date - interval '30' day
```

**Columns:** total_builders, visited_anonymous, sent_first_message, sent_second_message, published_app, hit_credit_wall, saw_pricing, reached_purchase, converted_premium, canceled
**Marketing use:** Full conversion funnel, drop-off analysis, "X% of builders who hit the credit wall convert to premium"

---

## FUNNEL_TIME_DETAILED

Average hours between each funnel step (uses base_full).

```sql
SELECT
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_message_added_ts)), 1) AS hrs_to_first_message,
  round(avg(date_diff('hour', first_message_added_ts, second_message_added_ts)), 1) AS hrs_to_second_message,
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_app_published_ts)), 1) AS hrs_to_publish,
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_out_of_credits_ts)), 1) AS hrs_to_credit_wall,
  round(avg(date_diff('hour', first_out_of_credits_ts, first_premium_ts)), 1) AS hrs_credit_wall_to_premium,
  round(avg(date_diff('hour', first_package_picker_ts, first_purchase_page_ts)), 1) AS hrs_pricing_to_purchase,
  round(avg(date_diff('hour', cast(created_date AS timestamp), first_premium_ts)), 1) AS hrs_to_premium
FROM prod.wt_base44_users.base_full
WHERE is_qa_user = false
  AND created_date >= current_date - interval '30' day
  AND first_message_added_ts IS NOT NULL
```

**Columns:** hrs_to_first_message, hrs_to_second_message, hrs_to_publish, hrs_to_credit_wall, hrs_credit_wall_to_premium, hrs_pricing_to_purchase, hrs_to_premium
**Marketing use:** "Builders go from signup to premium in X hours", time-to-value at each step, activation speed narratives

---

## REFERRAL_IMPACT

Referral-driven signups and their conversion rates.

```sql
SELECT
  count(DISTINCT user_id) AS total_builders,
  count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL THEN user_id END) AS referred_builders,
  round(100.0 * count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL THEN user_id END) / count(DISTINCT user_id), 1) AS referral_pct,
  count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL AND first_app_published_ts IS NOT NULL THEN user_id END) AS referred_published,
  round(100.0 * count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL AND first_app_published_ts IS NOT NULL THEN user_id END) / NULLIF(count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL THEN user_id END), 0), 1) AS referred_publish_rate_pct,
  count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL AND first_premium_ts IS NOT NULL THEN user_id END) AS referred_premium,
  round(100.0 * count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL AND first_premium_ts IS NOT NULL THEN user_id END) / NULLIF(count(DISTINCT CASE WHEN referrer_user_id IS NOT NULL THEN user_id END), 0), 1) AS referred_premium_rate_pct,
  count(DISTINCT referrer_user_id) AS unique_referrers
FROM prod.wt_base44_users.base_full
WHERE is_qa_user = false
  AND created_date >= current_date - interval '30' day
```

**Columns:** total_builders, referred_builders, referral_pct, referred_published, referred_publish_rate_pct, referred_premium, referred_premium_rate_pct, unique_referrers
**Marketing use:** "Referred builders convert X% better", referral program proof, community-driven growth narrative

---

## CUSTOM

For any query not covered above, build SQL directly from the user's request using the table schemas in SKILL.md.

**Guidelines:**
- Always filter `is_qa_user = false` on user tables
- Use `prod.` catalog prefix for all tables
- Limit results to avoid token overload (`LIMIT 50` default)
- Use `date_trunc` for time-series grouping
- Prefer `count(DISTINCT ...)` over `count(*)` for user metrics
