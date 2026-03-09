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
PHASE 0: Research (BEFORE writing anything)
  Audit 5-6 competitor LPs → Extract H1 patterns, hero layout,
  social proof style, CTAs → Define what makes us different
        |
        v
PHASE 1: Copy Brief (landing-page-architecture skill)
  Audience Lock → Competitor Wedge → Proof Points → Hormozi Hook → Section Brief
        |
        v
PHASE 2: Section Copy (landing-page-architecture skill)
  Write 8 sections from brief → Brand Guardian >= 7/10
        |
        v
PHASE 3: Figma Handoff (if designer provides Figma)
  Implement Figma designs → Convert assets to inline SVGs →
  Commit to mobile OR desktop mockup (never in-between)
        |
        v
PHASE 4: HTML Generation (THIS skill)
  Template Selection → Load Design System → Generate HTML
        |
        v
PHASE 5: Deploy + Iterate
  npx base44 site deploy -y → Share live URL (not screenshots) →
  Iterate based on feedback → Redeploy
        |
        v
PHASE 6: Team Review
  Present live page to stakeholders → Capture feedback as patterns →
  Ask: "What drives shares/reposts?" → Update plugin with learnings
```

**KEY RULES from Super Agents LP session:**
- Always do competitive research FIRST (Phase 0). Look at what others do before writing.
- Deploy early, iterate live. A URL beats a screenshot in every review.
- After team review, save learnings to learning-log.md and this skill file.
- H1+H2 must flow as one connected thought. If H2 doesn't continue H1, rewrite.
- Don't claim "no X" when there IS X. Speed claims ("under 3 min") beat absence claims ("no setup").
- For chat-based products, the conversation IS the hero. Show a realistic chat, not a dashboard.
- Figma asset URLs expire. Always convert to inline SVGs for production.

**PREREQUISITE:** Phase 1 and 2 (Copy Brief + Section Copy) must be complete before Phase 4 runs. If copy hasn't been generated yet, run `landing-page-architecture` first.

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

**Voice on landing pages (from Maor voice analysis):**
- Headlines should use Maor's patterns: "We just...", "Introducing:", understatement ("a little update with a major impact")
- Product-first, always. Center on what Base44 DOES, not what it MEANS
- Casual but specific. Not corporate, not bro-y. Matter-of-fact with casual touches
- No thought leadership or motivational fluff. Features, releases, numbers
- "batteries included" is a signature phrase for feature completeness
- Emotional restraint: only for genuine milestones, one paragraph max, then forward motion

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
2. Logo is inline SVG (no file copy needed — see asset-strategy.md)
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

## Lessons Learned (Super Agents LP, 2026-03-08)

Hard-won patterns from building + reviewing with stakeholders:

### Copy Structure
- **H1 and H2 must flow as ONE connected thought.** If H2 doesn't continue H1, rewrite. Two separate clever ideas stacked vertically reads as disconnected, not punchy.
- **Don't claim "no X" when there IS X.** "No setup" when there's simpler setup is a lie. Say "under 3 min" or "without the technical setup." Speed claims beat absence claims.
- **"Is live" only works for expected launches.** For new products nobody's heard of, use "Introducing" or "New from Base44."
- **Each sentence in announcement copy must connect to the previous one.** If you can shuffle the sentence order without noticing, the copy has no flow.

### Design & Layout
- **Product mockups must commit to mobile OR desktop.** An in-between size (not phone, not laptop) looks awkward and unfinished. Use a phone frame for chat-based products.
- **Figma asset URLs are temporary (7-day expiry).** Always convert to inline SVGs for production. Never use `figma.com/api/mcp/asset/` URLs in deployed HTML.
- **Competitive research before design.** Look at 5-6 competitor landing pages first. Extract what works (outcome-first H1s, speed claims, comparison tables) before writing copy.

### What Converts for Chat-Based Products
- **The chat conversation IS the hero.** For WhatsApp/Telegram/Slack products, show a realistic conversation, not a dashboard screenshot.
- **Make conversations realistic.** Include specific numbers ("over $500"), tool names ("Stripe", "HubSpot"), and short, natural replies. Not marketing-speak.
- **Channel badges (WhatsApp/Telegram/Slack) belong in the hero.** These are the differentiator, not just integrations. Make them prominent.
- **Comparison tables work.** "You shouldn't need a 37 min tutorial" with competitor complexity vs your simplicity drives the point home.

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
