---
name: base44-landing-page
description: |
  Generates self-contained HTML landing pages and deploys them to Base44 hosting via the Base44 CLI.

  Triggers on: deploy landing page, base44 landing page, ship landing page,
  build landing page, host landing page, live landing page, base44 page.

  CHAIN: base44-landing-page → landing-page-architecture (copy) → brand-guardian (review) → Base44 CLI deploy
---

# Base44 Landing Page

> One prompt = live page. Generates HTML from the design system and deploys to Base44 hosting.

## When to Use

- User wants a **live landing page hosted on Base44**
- User mentions "deploy", "host", "base44 landing", "ship a page", "live page"
- **NOT** for copy-only (use `landing-page-architecture` via copywriter)

## Architecture

```
Input (goal, persona, message, slug)
        |
        v
  Template Selection (5 layouts)
        |
        v
  Copy Generation (8-Section Framework)
        |
        v
  Brand Validation (brand-guardian >= 7/10)
        |
        v
  HTML Generation (design-system.md + brand.json)
        |
        v
  Base44 CLI Deploy (npx base44 site deploy -y)
        |
        v
  Live at: https://{slug}.base44.app
```

---

## Workflow (8 Steps)

### Step 1: Gather Input

Collect from user (use AskUserQuestion if not provided):

| Input | Required | Example |
|-------|----------|---------|
| Page goal | Yes | "Feature launch page for Debug Mode" |
| Target persona | Yes | "Technical builders who ship weekly" |
| Key message | Yes | "Find bugs 10x faster with visual debugging" |
| Product/feature | Yes | "Debug Mode" |
| URL slug | Yes | "debug-mode" (used as Base44 app name) |
| CTA URL | No | Default: `https://base44.com` |

### Step 2: Select Template

Pick template based on page goal. If user didn't specify, auto-select:

| Goal Pattern | Template | Why |
|-------------|----------|-----|
| Feature launch, new feature, just shipped | `feature-launch` | Hero + demo + social proof emphasis |
| Campaign, event, contest, announcement | `campaign` | Urgency + CTA-heavy layout |
| Sign-up, free trial, get started, onboarding | `signup` | Value stack + objection handling |
| Case study, success story, builder spotlight | `case-study` | Story + metrics + testimonial-heavy |
| Security, enterprise, compliance, trust | `enterprise` | Trust signals + compliance + CTA |

**Default:** `feature-launch`

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
```

### Step 4: Generate Copy (8-Section Framework)

Load the architecture skill:
```
Read(file_path="skills/landing-page-architecture/SKILL.md")
```

Generate all 8 sections with brand voice applied:
1. HERO: Eyebrow + Headline + Subheadline + CTA + Trust Signals
2. SUCCESS: Confirmation + Deliverables
3. PROBLEM-AGITATE: 3 pain points + Agitation + Transition
4. VALUE STACK: 3-4 tiers + Total value + Price + CTA
5. SOCIAL PROOF: 3 testimonials with specific results
6. TRANSFORMATION: Week 1 → Month 1 → Month 3 → Year 1
7. SECONDARY CTA: Question headline + Yes button + Objection handler
8. FOOTER: Logo + Navigation + Legal

**Rules during generation:** See `agents/shared-instructions.md` for full voice rules.

### Step 5: Brand Validation

Self-validate copy against RULES.md:
- Check all 21 NEVER rules
- Check all 10 ALWAYS rules
- Score must be >= 7/10
- If < 7, revise and re-validate before proceeding to HTML

### Step 6: Generate HTML

**Load design system (MANDATORY):**
```
Read(file_path="brands/base44/design-system.md")
Read(file_path="brands/base44/brand.json")
Read(file_path="skills/base44-landing-page/reference/html-template.md")
Read(file_path="skills/base44-landing-page/reference/asset-strategy.md")
```

**Generate a single self-contained `index.html`:**

1. Start with the HTML skeleton from `reference/html-template.md`
2. Apply brand.json tokens as CSS custom properties in `:root`
3. Map each 8-Section Framework section to the design-system.md HTML components
4. Use the template variation (feature-launch, campaign, etc.) to choose hero variant and component emphasis
5. Embed logo as base64 data URI (see `reference/asset-strategy.md`)
6. Embed STK Miso font files as base64 `@font-face` declarations
7. Include responsive breakpoints (1200px, 768px)
8. Add FAQ accordion JS (vanilla, from design-system.md)
9. Add meta tags: title, description, og:image, viewport
10. Validate: all tags closed, logo is image not text, fonts declared

**The HTML must work when opened directly in a browser (no server needed).**

### Step 7: Deploy via Base44 CLI

**Load deployment instructions:**
```
Read(file_path="skills/base44-landing-page/reference/deployment.md")
```

**Follow the deployment pipeline:**

1. **Auth check:** `npx base44 whoami`
   - If authenticated: continue
   - If NOT: tell user to run `npx base44 login`, save HTML locally as fallback

2. **Scaffold project (if no `base44/` directory):**
   ```bash
   mkdir -p {slug}-landing && cd {slug}-landing
   npm init -y
   npm install --save-dev base44
   npx base44 create {slug}-landing -p .
   ```
   Then edit `base44/config.jsonc` to set `site.outputDirectory` to `"./dist"`.

3. **Write HTML:**
   ```bash
   mkdir -p dist
   Write(file_path="{project-dir}/dist/index.html", content="[the generated HTML]")
   ```

4. **Deploy:**
   ```bash
   npx base44 site deploy -y
   ```

5. **Capture URL** from CLI output: `https://{slug}-landing.base44.app`

### Step 8: Return Results

Output to user:

```markdown
## Landing Page Deployed

**Live URL:** https://{slug}-landing.base44.app
**Template:** {template name}
**Status:** Live

### Copy Preview
**Hero:** {headline}
**CTA:** {cta_text}

### Next Steps
1. Open the URL to preview
2. Share with the team for feedback
3. Connect a custom domain if needed (Base44 dashboard)
```

---

## Fallback: No Auth

If Base44 CLI is not authenticated:

1. Write HTML to `./landing-pages/{slug}/index.html`
2. Copy logo to `./landing-pages/{slug}/logo.png`
3. Tell user:
```
HTML saved locally at landing-pages/{slug}/index.html
Open in browser to preview.

To deploy to Base44:
  cd landing-pages/{slug}
  npm init -y && npm install --save-dev base44
  npx base44 login
  npx base44 create {slug} -p .
  mkdir dist && cp index.html dist/
  npx base44 site deploy -y
```

---

## Quality Checklist

Before deploying, verify:

**Content:**
- [ ] All 8 sections present and populated
- [ ] Hero headline 10-15 words max
- [ ] Specific numbers in every section
- [ ] Brand voice verified (no banned words from RULES.md)

**HTML:**
- [ ] Valid HTML (no unclosed tags)
- [ ] All brand.json colors used correctly (#0f0f0f, not #000)
- [ ] Logo is an `<img>` tag, never text (RULES.md ALWAYS #10)
- [ ] @font-face declarations for STK Miso Light (300) and Regular (400)
- [ ] Responsive breakpoints at 768px and 1200px
- [ ] CTA links point to valid URLs
- [ ] `<title>` and meta description present
- [ ] OG meta tags for social sharing
- [ ] Page works when opened directly in browser (no server)

**Deploy:**
- [ ] Base44 auth verified
- [ ] site.outputDirectory set in config.jsonc
- [ ] index.html in the output directory
- [ ] `npx base44 site deploy -y` ran successfully

---

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| `landing-page-architecture` | 8-Section Framework for copy structure |
| `direct-response-copy` | THE SLIDE framework for persuasion |
| `hook-rules` | Approved hook styles for headlines |
| `design-system.md` | HTML/CSS component library |
| `brand.json` | Design token values |
| Base44 CLI | Project scaffolding + deployment |

---

## Integration

**Called by:** marketing-router (LANDING_DEPLOY workflow), copywriter agent
**Depends on:** landing-page-architecture, design-system.md, brand.json, Base44 CLI
**Outputs to:** Base44 hosting → live URL
