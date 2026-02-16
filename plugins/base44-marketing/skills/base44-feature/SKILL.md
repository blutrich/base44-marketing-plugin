---
name: base44-feature
description: |
  Pulls product features from the Base44 App API. Fetches feature data for content creation, marketing strategy, and campaign planning.

  Triggers on: pull features, show features, feature list, product sync, what features, fetch features, roadmap, feature data.
---

# Base44 Feature

> Fetch live data from any Base44 app entity and display it.

## Contents

- [When to Use](#when-to-use)
- [Workflow](#workflow)
- [Display Formats](#display-formats)
- [Filters](#filters)
- [Integration](#integration)

---

## When to Use

Use this skill when:
- You need to see what features exist in the Base44 app
- You want to check feature status, owners, or marketing readiness
- You need live data from any entity to inform content creation
- The marketing router needs feature data for campaigns or announcements

---

## Workflow

### Step 1: Load API Reference

```
Read(file_path="skills/base44-feature/reference/api.md")
```

### Step 2: Check Credentials

The API requires two values. Check if they are available:

```bash
# Check if environment variables are set
echo "APP_ID: ${BASE44_APP_ID:-(not set)}"
echo "API_KEY: ${BASE44_API_KEY:+(set)}"
```

**If not set**, ask the user to provide them or set environment variables:

```bash
export BASE44_APP_ID="your-app-id"
export BASE44_API_KEY="your-api-key"
```

Alternatively, the user may provide them inline. **NEVER output the actual API key in responses or logs.** Reference it only as `$BASE44_API_KEY`.

### Step 3: Fetch Data

Determine what entity and scope the user needs. Default entity is `Feature`.

**List all records:**

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/{Entity}" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

**Get a single record by ID:**

```bash
curl -s -X GET "https://app.base44.com/api/apps/$BASE44_APP_ID/entities/{Entity}/{id}" \
  -H "api_key: $BASE44_API_KEY" \
  -H "Content-Type: application/json"
```

### Step 4: Parse & Filter

Parse the JSON response. Apply any user-requested filters:

| Filter | How to Apply |
|--------|-------------|
| By status | Filter where `status` matches (e.g., `released`, `in_progress`, `new`) |
| By tier | Filter where `tier` matches (e.g., `tier_1`, `tier_2`) |
| By owner | Filter where `owners` array contains the name |
| By marketing readiness | Filter where `hide_from_marketing` is `false` AND `marketing_description` is not empty |
| By date range | Filter by `eta`, `released_at`, or `created_date` |
| Exclude archived | Filter where `archived` is `false` (default behavior) |

### Step 5: Display Results

Choose the display format based on the user's intent and the number of results.

---

## Display Formats

### Summary Table (default for lists)

Best for: Quick overview of multiple items.

```markdown
## Features ({count} total)

| Title | Status | Tier | Owners | ETA |
|-------|--------|------|--------|-----|
| Feature A | released | tier_1 | Alice | 2026-02-01 |
| Feature B | in_progress | tier_2 | Bob | 2026-03-01 |
```

### Marketing View (for content planning)

Best for: Identifying features ready for marketing content.

```markdown
## Features Ready for Marketing ({count})

### Feature A
- **Status:** released
- **Marketing description:** [description]
- **Marketing owner:** [name]
- **Media:** [links]
- **What's new:** [text]

### Feature B
...
```

### Detail View (for single records)

Best for: Deep dive into one feature.

```markdown
## Feature: {title}

**Status:** {status} | **Tier:** {tier} | **ETA:** {eta}
**Owners:** {owners}
**Developer:** {developer}

### Why We're Building This
{why_building}

### Who Is This For
{who_is_this_for}

### What's New
{whats_new}

### Marketing
- **Description:** {marketing_description}
- **Owner:** {marketing_owner}
- **Release date:** {marketing_release_date}
- **Media:** {marketing_media_urls}
- **Hide from marketing:** {hide_from_marketing}

### Links
- Figma: {figma_link}
- Showcase: {showcase_link}
```

### Status Board (for roadmap view)

Best for: Roadmap overview grouped by status.

```markdown
## Roadmap

### Released
- Feature A (tier_1) - [owners]
- Feature B (tier_2) - [owners]

### In Progress
- Feature C (tier_1, ETA: 2026-03-01) - [owners]

### New
- Feature D (tier_2, ETA: 2026-04-01) - [owners]
```

---

## Filters

When the user asks for specific subsets, apply these common filter patterns:

| User Says | Filter Logic |
|-----------|-------------|
| "released features" | `status == "released"` |
| "features in progress" | `status == "in_progress"` |
| "tier 1 features" | `tier == "tier_1"` |
| "features ready for marketing" | `hide_from_marketing == false` AND `status == "released"` |
| "features without marketing copy" | `marketing_description` is empty AND `status == "released"` |
| "features by [name]" | `owners` contains name |
| "recent features" | Sort by `released_at` or `updated_date` descending |
| "upcoming features" | `status != "released"` sorted by `eta` |

---

## Feeding Data to Other Skills

This skill is designed to feed live data into other marketing skills:

### Feature -> LinkedIn Post

```
1. Fetch released features via base44-feature
2. Pick a feature with marketing_description
3. Pass to linkedin-specialist:
   - title, whats_new, who_is_this_for, marketing_description
```

### Feature -> Landing Page

```
1. Fetch a specific feature via base44-feature
2. Pass to landing-page-generator:
   - title → page title
   - whats_new → hero copy
   - who_is_this_for → persona
   - why_building → problem section
   - media_urls → hero image
```

### Feature -> Campaign

```
1. Fetch tier_1 released features via base44-feature
2. Pass list to planner agent for multi-channel campaign
```

---

## Edge Cases

### No records returned
Output: "No {Entity} records found matching your criteria."

### API key not set
Output the curl command template and instructions for the user to set credentials. Do not block — the user can provide credentials and retry.

### HTML in fields
Some fields (`why_building`, `who_is_this_for`, `whats_new`) may contain HTML tags. Strip tags for display, or note that raw HTML is available.

### Large result sets
If more than 50 records, show a summary count and ask the user if they want full results or a filtered subset.

---

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| Base44 App API | Data source |
| `$BASE44_APP_ID` | Identifies the target app |
| `$BASE44_API_KEY` | Authentication |

## Integration

**Called by:** marketing-router (DATA_INSIGHT workflow), agents needing live feature data
**Depends on:** Base44 App API credentials
**Feeds into:** linkedin-specialist, x-specialist, landing-page-generator, copywriter, planner
