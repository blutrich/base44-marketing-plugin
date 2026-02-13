# Wix CMS Schema for Landing Pages

> Defines the CMS collections that power automated landing page generation.

## Collection: `landing-pages`

The main collection. Each item = one landing page. Fields map to the 8-Section Framework.

| Field | Type | Section | Description |
|-------|------|---------|-------------|
| `title` | text | Internal | Page name (internal, not displayed) |
| `slug` | text | URL | URL path: `base44.com/landing/{slug}` |
| `template` | text | Layout | Template ID: `feature-launch`, `campaign`, `signup`, `case-study`, `enterprise` |
| `status` | text | Internal | `draft` or `published` |
| `created_date` | datetime | Internal | Auto-set on creation |

### Section 1: Hero

| Field | Type | Notes |
|-------|------|-------|
| `hero_eyebrow` | text | Social proof or category label. Max 60 chars. |
| `hero_headline` | text | Primary promise. 10-15 words max. |
| `hero_subheadline` | text | How + de-risk. 1-2 sentences. |
| `hero_cta_text` | text | Benefit-focused button text. Max 30 chars. |
| `hero_cta_url` | url | CTA destination link |
| `hero_trust_signals` | text | Logos, numbers, credentials. Pipe-separated. |

### Section 2: Success

| Field | Type | Notes |
|-------|------|-------|
| `success_confirmation` | text | Confirmation message (e.g., "You're in!") |
| `success_deliverables` | rich text | What they'll receive. Markdown list. |

### Section 3: Problem-Agitate

| Field | Type | Notes |
|-------|------|-------|
| `problem_points` | rich text | 3 pain points. Markdown list. |
| `problem_agitation` | text | Cost of inaction. Include specific number. |
| `problem_transition` | text | Personal transition into solution. |

### Section 4: Value Stack

| Field | Type | Notes |
|-------|------|-------|
| `value_stack` | rich text | 3-4 tiers with descriptions and values. Markdown table. |
| `value_total` | text | Sum of tier values (e.g., "$1,988") |
| `value_price` | text | Actual price or "FREE" |
| `value_cta_text` | text | CTA button text for value section |

### Section 5: Social Proof

| Field | Type | Notes |
|-------|------|-------|
| `testimonials` | rich text | 3 testimonials with name, role, result. Markdown formatted. |

### Section 6: Transformation

| Field | Type | Notes |
|-------|------|-------|
| `transformation` | rich text | Time-based progression. Week 1 → Month 1 → Month 3 → Year 1. |

### Section 7: Secondary CTA

| Field | Type | Notes |
|-------|------|-------|
| `secondary_headline` | text | Question headline targeting scroll-to-bottom visitors |
| `secondary_cta_text` | text | "Yes" button text |
| `secondary_objection` | text | Objection handler (e.g., "Still skeptical? Takes 2 min to read.") |

### Section 8: Footer

Footer is template-level (shared across all pages). Not stored per-page.

### SEO Fields

| Field | Type | Notes |
|-------|------|-------|
| `meta_title` | text | Page title for search engines. Max 60 chars. |
| `meta_description` | text | Meta description. Max 155 chars. |
| `og_image_url` | url | Social sharing image (1200x630) |

---

## Collection: `landing-page-templates`

Reference collection for template metadata. Populated once during setup.

| Field | Type | Description |
|-------|------|-------------|
| `template_id` | text | Unique ID: `feature-launch`, `campaign`, `signup`, `case-study`, `enterprise` |
| `name` | text | Display name |
| `description` | text | When to use this template |
| `layout_focus` | text | Primary visual emphasis |
| `sections_emphasized` | text | Which sections get extra visual weight |

### Template Definitions

| Template ID | Name | Layout Focus | Sections Emphasized |
|-------------|------|-------------|---------------------|
| `feature-launch` | Feature Launch | Hero + demo + social proof | Hero (large), Transformation, Social Proof |
| `campaign` | Campaign | Hero + urgency + CTA-heavy | Hero, Secondary CTA, Problem-Agitate |
| `signup` | Sign-up / Free Trial | Hero + value stack + objection handling | Hero, Value Stack, Secondary CTA |
| `case-study` | Case Study | Story + metrics + testimonial-heavy | Social Proof, Transformation, Problem-Agitate |
| `enterprise` | Enterprise / Security | Trust signals + compliance + CTA | Hero (trust-heavy), Social Proof, Footer |

---

## JSON Example: CMS Item Payload

```json
{
  "dataItem": {
    "data": {
      "title": "Debug Mode Feature Launch",
      "slug": "debug-mode",
      "template": "feature-launch",
      "status": "draft",
      "hero_eyebrow": "Just shipped",
      "hero_headline": "Find Bugs 10x Faster With Visual Debugging Built Into Your App",
      "hero_subheadline": "Debug Mode shows you exactly what's happening inside your Base44 app. No console logs. No guessing.",
      "hero_cta_text": "Try Debug Mode Free",
      "hero_cta_url": "https://base44.com/signup",
      "hero_trust_signals": "400K+ builders | 10M+ apps created | $80M acquisition",
      "problem_points": "- You push a change and something breaks, but you can't see where\n- Console logs everywhere, still no clarity\n- Hours wasted reproducing bugs your builders reported",
      "problem_agitation": "Every hour spent debugging is an hour not spent shipping. The average builder loses 4.2 hours per week to invisible bugs.",
      "problem_transition": "We built Debug Mode because we were tired of it too.",
      "value_stack": "| What You Get | Value |\n|---|---|\n| Visual Debugger — see data flow in real time | $49/mo |\n| Error Tracking — auto-catch before builders report | $29/mo |\n| Performance Insights — spot slowdowns instantly | $19/mo |",
      "value_total": "$97/mo",
      "value_price": "Included free on all plans",
      "value_cta_text": "Start Debugging Smarter",
      "testimonials": "**\"Found a bug in 30 seconds that took me 3 hours last week.\"**\n— Amit R., SaaS builder\nResult: 80% less debugging time\n\n**\"Debug Mode is the feature I didn't know I needed.\"**\n— Lisa K., marketplace builder\nResult: Shipped 2x faster after enabling it",
      "transformation": "**DAY 1:** Enable Debug Mode, see your first visual trace\n**WEEK 1:** Catch 3-5 bugs you didn't know existed\n**MONTH 1:** Debugging time drops by 60%+\n**MONTH 3:** Ship with confidence — bugs found before builders notice",
      "secondary_headline": "Ready to stop guessing and start seeing?",
      "secondary_cta_text": "Yes, Show Me Debug Mode",
      "secondary_objection": "Free on all plans. Takes 10 seconds to enable.",
      "meta_title": "Debug Mode — Visual Debugging for Base44 Apps",
      "meta_description": "Find bugs 10x faster with visual debugging built into your Base44 app. See data flow, catch errors, ship with confidence.",
      "og_image_url": ""
    }
  }
}
```

---

## Wix Studio Setup Notes

### Connecting CMS to Templates

1. In Wix Studio, create a **dynamic page** connected to the `landing-pages` collection
2. Bind each text element to the corresponding CMS field
3. Use **conditional sections** for template-specific layouts:
   - Show/hide sections based on `template` field
   - Adjust visual weight per template type
4. Set the page URL pattern to `/landing/{slug}`
5. Test with sample data before automating

### Important

- Rich text fields support markdown rendering in Wix
- Pipe-separated trust signals should be split in the template display logic
- The `status` field controls visibility: only `published` items render live pages
