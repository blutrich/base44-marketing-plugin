# Wix CMS API Reference

> REST API integration for pushing landing page content to Wix CMS.

## Authentication

Wix API requires an API key. Store it as an environment variable — never in plugin files.

```bash
export WIX_API_KEY="your-api-key-here"
export WIX_SITE_ID="your-site-id-here"
```

### Getting API Credentials

1. Go to Wix Dashboard → Settings → API Keys
2. Create a new API key with **Wix Data (CMS)** permissions
3. Copy the API key and site ID
4. Set as environment variables in your shell profile

---

## Endpoints

### Create a CMS Item

Creates a new landing page entry in the CMS.

```
POST https://www.wixapis.com/wix-data/v2/items
```

**Headers:**
```
Authorization: {WIX_API_KEY}
wix-site-id: {WIX_SITE_ID}
Content-Type: application/json
```

**Body:**
```json
{
  "dataCollectionId": "landing-pages",
  "dataItem": {
    "data": {
      "title": "Page Title",
      "slug": "page-slug",
      "template": "feature-launch",
      "status": "draft",
      "hero_eyebrow": "...",
      "hero_headline": "...",
      "hero_subheadline": "...",
      "hero_cta_text": "...",
      "hero_cta_url": "...",
      "hero_trust_signals": "...",
      "problem_points": "...",
      "problem_agitation": "...",
      "problem_transition": "...",
      "value_stack": "...",
      "value_total": "...",
      "value_price": "...",
      "value_cta_text": "...",
      "testimonials": "...",
      "transformation": "...",
      "secondary_headline": "...",
      "secondary_cta_text": "...",
      "secondary_objection": "...",
      "meta_title": "...",
      "meta_description": "...",
      "og_image_url": ""
    }
  }
}
```

**curl example:**

```bash
curl -X POST "https://www.wixapis.com/wix-data/v2/items" \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID" \
  -H "Content-Type: application/json" \
  -d @landing-page-payload.json
```

### Update an Existing CMS Item

Updates an existing landing page by item ID.

```
PUT https://www.wixapis.com/wix-data/v2/items/{itemId}
```

**Body:** Same as create, but with the updated fields.

```bash
curl -X PUT "https://www.wixapis.com/wix-data/v2/items/{itemId}" \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID" \
  -H "Content-Type: application/json" \
  -d @landing-page-payload.json
```

### Query CMS Items

Find existing landing pages (e.g., check if slug already exists).

```
POST https://www.wixapis.com/wix-data/v2/items/query
```

**Body:**
```json
{
  "dataCollectionId": "landing-pages",
  "query": {
    "filter": {
      "slug": { "$eq": "debug-mode" }
    }
  }
}
```

```bash
curl -X POST "https://www.wixapis.com/wix-data/v2/items/query" \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "dataCollectionId": "landing-pages",
    "query": {
      "filter": { "slug": { "$eq": "debug-mode" } }
    }
  }'
```

### Delete a CMS Item

```
DELETE https://www.wixapis.com/wix-data/v2/items/{itemId}?dataCollectionId=landing-pages
```

```bash
curl -X DELETE "https://www.wixapis.com/wix-data/v2/items/{itemId}?dataCollectionId=landing-pages" \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID"
```

---

## Publish Workflow

1. **Create as draft:** Set `status: "draft"` on initial push
2. **Review:** Open Wix Studio, preview the dynamic page
3. **Publish:** Update `status` to `"published"` via API or Wix dashboard
4. **Page is live** at `base44.com/landing/{slug}`

### Auto-publish (optional)

To skip the review step, set `status: "published"` on creation. Only do this for well-tested templates with high brand-guardian confidence scores.

---

## Error Handling

| HTTP Code | Meaning | Action |
|-----------|---------|--------|
| 200 | Success | Page created/updated |
| 400 | Bad request | Check field names match CMS schema |
| 401 | Unauthorized | Check API key and site ID |
| 404 | Not found | Collection doesn't exist — create in Wix Studio first |
| 409 | Conflict | Slug already exists — use update instead |
| 429 | Rate limited | Wait and retry (Wix allows ~100 req/min) |

---

## Response Format

Successful creation returns the full item with its `_id`:

```json
{
  "dataItem": {
    "_id": "abc123-def456",
    "data": {
      "title": "Debug Mode Feature Launch",
      "slug": "debug-mode",
      ...
    }
  }
}
```

Save the `_id` for future updates.

---

## Prerequisites Checklist

Before the API integration works:

- [ ] Wix Studio account with CMS access
- [ ] API key created with Wix Data permissions
- [ ] `WIX_API_KEY` and `WIX_SITE_ID` environment variables set
- [ ] `landing-pages` collection created in Wix CMS with all fields from `cms-schema.md`
- [ ] At least one dynamic page template built and connected to the collection
- [ ] Test with sample data to verify CMS binding works
