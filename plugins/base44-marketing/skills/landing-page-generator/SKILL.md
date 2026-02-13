---
name: landing-page-generator
description: |
  Generates landing pages and pushes them to Wix CMS as structured content. Combines the 8-Section Framework with template selection and automated CMS publishing.

  Triggers on: generate landing page, create landing page, push landing page, landing page for [feature/campaign], new landing page, landing page pipeline.
---

# Landing Page Generator

> Generate copy, format as CMS data, push to Wix. One command = live landing page.

## Architecture

```
Input (goal, persona, message)
        |
        v
  Template Selection (5 layouts)
        |
        v
  Copy Generation (8-Section Framework)
        |
        v
  Brand Validation (brand-guardian)
        |
        v
  CMS JSON Formatting
        |
        v
  Wix CMS API Push
        |
        v
  Live Page: base44.com/landing/{slug}
```

---

## When to Use This Skill

Use when the goal is a **live landing page**, not just copy:
- Feature launches that need a dedicated page
- Campaign landing pages (sign-up, event, contest)
- Case study pages
- Enterprise/security trust pages

For **copy-only** (no CMS push), use `landing-page-architecture` skill directly.

---

## Workflow

### Step 1: Gather Input

Collect from user (use AskUserQuestion if not provided):

| Input | Required | Example |
|-------|----------|---------|
| Page goal | Yes | "Feature launch page for Debug Mode" |
| Target persona | Yes | "Technical builders who ship weekly" |
| Key message | Yes | "Find bugs 10x faster with visual debugging" |
| Product/feature | Yes | "Debug Mode" |
| Slug | Yes | "debug-mode" |
| Template preference | No | Auto-selected if not specified |

### Step 2: Select Template

Pick template based on page goal. If the user didn't specify, auto-select:

| Goal Pattern | Template | Why |
|-------------|----------|-----|
| Feature launch, new feature, just shipped | `feature-launch` | Hero + demo + social proof emphasis |
| Campaign, event, contest, announcement | `campaign` | Urgency + CTA-heavy layout |
| Sign-up, free trial, get started, onboarding | `signup` | Value stack + objection handling |
| Case study, success story, builder spotlight | `case-study` | Story + metrics + testimonial-heavy |
| Security, enterprise, compliance, trust | `enterprise` | Trust signals + compliance + CTA |

**Default:** `feature-launch` (most common for Base44)

### Step 3: Load Brand Context

```
Read(file_path="brands/base44/RULES.md")
Read(file_path="brands/base44/tone-of-voice.md")
Read(file_path="brands/base44/learning-log.md")
Read(file_path="brands/base44/feedback/testimonials.md")
Read(file_path="brands/base44/feedback/personas.md")
Read(file_path="brands/base44/content-library/value-props.md")
Read(file_path="brands/base44/content-library/hooks.md")
Read(file_path="brands/base44/content-library/ctas.md")
Read(file_path="brands/base44/content-library/objection-handling.md")
```

### Step 4: Generate Copy (8-Section Framework)

Load the architecture skill:
```
Read(file_path="skills/landing-page-architecture/SKILL.md")
```

Generate all 8 sections following the framework. Apply brand voice rules throughout:
- "Builders" not "users/customers"
- "Ship" not "deploy/launch"
- No TV-ad cadence
- Specific numbers in every section
- Maor Test: would he post this exactly as written?

Use real data from brand context files:
- Testimonials from `feedback/testimonials.md`
- Metrics from content library
- Personas for targeting

### Step 5: Brand Validation

Before formatting as CMS data, run brand-guardian validation:
- Score must be >= 7/10
- If < 7, revise copy and re-validate
- Check all RULES.md constraints

### Step 6: Format as CMS JSON

Transform the 8 sections into the CMS schema format.

Load the schema reference:
```
Read(file_path="skills/landing-page-generator/reference/cms-schema.md")
```

**Output the complete JSON payload** matching the schema. Example structure:

```json
{
  "dataCollectionId": "landing-pages",
  "dataItem": {
    "data": {
      "title": "[Internal page name]",
      "slug": "[url-slug]",
      "template": "[template-id]",
      "status": "draft",
      "hero_eyebrow": "[Section 1: eyebrow text]",
      "hero_headline": "[Section 1: 10-15 word headline]",
      "hero_subheadline": "[Section 1: how + de-risk]",
      "hero_cta_text": "[Section 1: benefit-focused CTA]",
      "hero_cta_url": "[CTA destination]",
      "hero_trust_signals": "[Section 1: pipe-separated trust signals]",
      "success_confirmation": "[Section 2: confirmation message]",
      "success_deliverables": "[Section 2: markdown list]",
      "problem_points": "[Section 3: markdown list of 3 pain points]",
      "problem_agitation": "[Section 3: cost of inaction with number]",
      "problem_transition": "[Section 3: personal transition]",
      "value_stack": "[Section 4: markdown table of tiers]",
      "value_total": "[Section 4: total value]",
      "value_price": "[Section 4: actual price]",
      "value_cta_text": "[Section 4: CTA text]",
      "testimonials": "[Section 5: markdown formatted testimonials]",
      "transformation": "[Section 6: time-based progression]",
      "secondary_headline": "[Section 7: question headline]",
      "secondary_cta_text": "[Section 7: yes button text]",
      "secondary_objection": "[Section 7: objection handler]",
      "meta_title": "[SEO: max 60 chars]",
      "meta_description": "[SEO: max 155 chars]",
      "og_image_url": ""
    }
  }
}
```

### Step 7: Push to Wix CMS

Load the API reference:
```
Read(file_path="skills/landing-page-generator/reference/wix-api.md")
```

**Check prerequisites:**
1. Verify `WIX_API_KEY` and `WIX_SITE_ID` environment variables are set
2. Query existing items to check if slug already exists
3. If slug exists: confirm with user before updating

**Create the page:**

```bash
# Save JSON payload to temp file
Write(file_path="/tmp/landing-page-payload.json", content="[the JSON payload]")

# Push to Wix CMS
curl -X POST "https://www.wixapis.com/wix-data/v2/items" \
  -H "Authorization: $WIX_API_KEY" \
  -H "wix-site-id: $WIX_SITE_ID" \
  -H "Content-Type: application/json" \
  -d @/tmp/landing-page-payload.json
```

**If API key is not set**, output the JSON payload and curl command for the user to run manually.

### Step 8: Return Results

Output to the user:

```markdown
## Landing Page Generated

**Page:** [title]
**Template:** [template name]
**URL:** base44.com/landing/[slug]
**Status:** Draft (review in Wix Studio before publishing)

### CMS Push
- [Success/Failed/Manual — with details]

### Copy Preview
[Condensed preview of hero + CTA]

### Next Steps
1. Review the page in Wix Studio
2. Check mobile rendering
3. Update status to "published" when ready
4. [Nano-banana command for hero image if needed]
```

---

## Template Selection Details

### `feature-launch`

Best for: New features, product updates, just-shipped announcements.

**Layout emphasis:**
- Hero section: large, with product screenshot/demo area
- Social proof: prominent (builds trust for new features)
- Transformation: timeline showing adoption curve

**Copy focus:** What it does + why it matters + proof it works.

### `campaign`

Best for: Time-bound campaigns, events, contests, announcements.

**Layout emphasis:**
- Hero section: urgency-driven headline
- Problem-agitate: heightened (why act now)
- Secondary CTA: repeated, CTA-heavy

**Copy focus:** Why now + what you get + urgency.

### `signup`

Best for: Free trial, getting started, onboarding flows.

**Layout emphasis:**
- Hero: low-friction CTA (email-only signup)
- Value stack: prominent (justify the action)
- Secondary CTA: objection handling

**Copy focus:** Value + ease + objection handling.

### `case-study`

Best for: Builder success stories, ROI showcases.

**Layout emphasis:**
- Social proof: dominant (multiple testimonials, metrics)
- Transformation: detailed timeline with specific results
- Problem-agitate: tells the "before" story

**Copy focus:** Story + metrics + relatable builder journey.

### `enterprise`

Best for: Enterprise pages, security, compliance, SOC2.

**Layout emphasis:**
- Hero: trust signals prominent (certifications, logos)
- Social proof: enterprise client logos
- Footer: compliance badges, security details

**Copy focus:** Trust + security + scalability + support.

---

## Edge Cases

### No Wix API key set
Output the full CMS JSON and curl commands. The user can push manually or set up the API key later.

**NEVER output the actual API key value in content, logs, or responses.** Only reference it as `$WIX_API_KEY` environment variable.

### Slug already exists
Query first, then ask the user: update the existing page or create with a new slug?

### Template not built in Wix yet
Warn the user that the CMS data is ready but the template must be created in Wix Studio first. Link to the setup docs.

### Missing brand data
If testimonials, personas, or metrics files are empty, generate placeholder copy and flag it for human review.

---

## Quality Checklist

Before pushing to CMS:

**Content:**
- [ ] All 8 sections present and populated
- [ ] Hero headline 10-15 words max
- [ ] Specific numbers in every section
- [ ] Brand voice verified (no banned words)
- [ ] Brand-guardian score >= 7/10

**CMS:**
- [ ] All required fields populated
- [ ] Slug is URL-safe (lowercase, hyphens, no spaces)
- [ ] Template ID matches an existing template
- [ ] Meta title <= 60 chars
- [ ] Meta description <= 155 chars

**Technical:**
- [ ] Rich text fields use valid markdown
- [ ] Trust signals are pipe-separated
- [ ] CTA URL is a valid URL
- [ ] Status is "draft" (not auto-publishing)

---

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| `landing-page-architecture` | 8-Section Framework for copy structure |
| `direct-response-copy` | THE SLIDE framework for persuasion |
| `hook-rules` | Approved hook styles for headlines |
| `marketing-psychology` | Persuasion principles for copy |
| Brand context files | Voice, rules, testimonials, metrics |
| Wix CMS API | Content push (requires API key) |

---

## Integration

**Called by:** marketing-router (LANDING_GENERATE workflow), copywriter agent
**Depends on:** landing-page-architecture, direct-response-copy, brand files
**Outputs to:** Wix CMS → dynamic pages
