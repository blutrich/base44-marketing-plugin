# Base44 CLI Landing Page Skill Plan

> **Goal:** Create a new marketing plugin skill that generates self-contained HTML landing pages and deploys them to Base44 hosting via the Base44 CLI.
> **Status:** PLAN
> **Created:** 2026-02-12
> **Depends on:** Base44 CLI skill, design-system.md, brand.json, landing-page-architecture skill

---

## Executive Summary

Today, the marketing plugin generates landing page copy (via the 8-Section Framework) and pushes it as structured JSON to Wix CMS. This requires a separate Wix template, API key, and manual page building in Wix Studio.

This plan adds a **parallel deployment path**: generate a complete, self-contained HTML landing page and deploy it directly to Base44 hosting via `npx base44 site deploy`. The result is a live URL at `https://{app-name}.base44.app` with zero external dependencies.

**Key insight:** Base44 hosting serves SPAs with a single `index.html`. Landing pages are single-page by nature. This is a perfect fit -- generate one HTML file with inline CSS, put it in a `dist/` directory, and deploy.

**What changes:**
- New skill: `base44-landing-page/SKILL.md` (instructions for Claude Code to generate HTML + deploy)
- New workflow: `LANDING_DEPLOY` in the router (distinct from `LANDING_GENERATE` for Wix)
- New reference files: HTML templates, deployment checklist
- Edits to: marketing-router, workflows.md, copywriter agent, CLAUDE.md

**What stays the same:**
- Copy generation (8-Section Framework) -- reused as-is
- Brand validation (brand-guardian >= 7/10) -- same gate
- Wix CMS pipeline (`LANDING_GENERATE`) -- untouched, remains as alternative
- All existing agents and skills -- no breaking changes

---

## Architecture

```
User Request: "Build a landing page for Debug Mode on Base44"
          |
          v
    [marketing-router]
    Intent: LANDING_DEPLOY
          |
          v
    [base44-landing-page SKILL]
          |
          +-- Step 1: Gather input (goal, persona, message, slug)
          |
          +-- Step 2: Select template (5 types)
          |
          +-- Step 3: Load brand context
          |       Read: RULES.md, tone-of-voice.md, testimonials, etc.
          |
          +-- Step 4: Generate copy (8-Section Framework)
          |       Reuse: landing-page-architecture skill
          |
          +-- Step 5: Brand validation (brand-guardian >= 7/10)
          |
          +-- Step 6: Generate HTML
          |       Read: design-system.md + brand.json
          |       Output: self-contained index.html with inline CSS
          |       Copy: logo.png, font files into output dir
          |
          +-- Step 7: Deploy via Base44 CLI
          |       Auth check: npx base44 whoami
          |       Scaffold: base44/ config if needed
          |       Build: (no build step -- static HTML)
          |       Deploy: npx base44 site deploy -y
          |
          +-- Step 8: Return live URL + preview
          |
          v
    Live at: https://{slug}.base44.app
```

### Decision Tree: Which Landing Workflow?

```
User says "landing page"
    |
    +-- Contains "deploy", "host", "base44", "live site", "ship it" ?
    |       YES --> LANDING_DEPLOY (this skill -- generates HTML, deploys to Base44)
    |
    +-- Contains "generate", "push", "wix", "cms" ?
    |       YES --> LANDING_GENERATE (existing skill -- generates CMS JSON, pushes to Wix)
    |
    +-- Contains "copy", "write", "draft" ?
    |       YES --> LANDING (existing -- copy only via copywriter agent)
    |
    +-- Ambiguous?
            ASK: "Do you want a live page hosted on Base44, CMS content for Wix, or just the copy?"
```

---

## Phase 1: Core Skill Definition (4 files)

### 1.1 Create `skills/base44-landing-page/SKILL.md`

The main skill file. Tells Claude Code exactly what to do when the `LANDING_DEPLOY` workflow triggers.

**Structure:**
```
---
name: base44-landing-page
description: |
  Generates self-contained HTML landing pages and deploys them to Base44 hosting.
  Triggers on: deploy landing page, base44 landing page, ship landing page,
  build landing page, host landing page, live landing page.
---

# Base44 Landing Page

## When to Use
- User wants a LIVE landing page hosted on Base44
- User mentions "deploy", "host", "base44 landing", "ship a page"
- NOT for Wix CMS (use landing-page-generator) or copy-only (use copywriter)

## Workflow (8 Steps)

### Step 1: Gather Input
[AskUserQuestion for: page goal, target persona, key message, slug]
[Default CTA URL: https://base44.com]

### Step 2: Select Template
[Same 5 templates as existing: feature-launch, campaign, signup, case-study, enterprise]

### Step 3: Load Brand Context
[Read: RULES.md, tone-of-voice.md, testimonials, personas, value-props, hooks, CTAs]

### Step 4: Generate Copy (8-Section Framework)
[Read: landing-page-architecture SKILL.md]
[Generate all 8 sections with brand voice applied]

### Step 5: Brand Validation
[Score >= 7/10 via brand-guardian patterns]
[If < 7, revise and re-validate]

### Step 6: Generate HTML
[Read: design-system.md + brand.json]
[Read: reference/html-template.md for the base HTML skeleton]
[Map 8-Section Framework content into HTML sections]
[Apply brand.json tokens as CSS custom properties]
[Embed logo.png as base64 data URI]
[Embed font files as base64 @font-face]
[Output: single self-contained index.html]

### Step 7: Deploy via Base44 CLI
[Read: reference/deployment.md for exact CLI steps]
[Auth check -> scaffold project -> write HTML -> deploy -> return URL]

### Step 8: Return Results
[Live URL, copy preview, next steps]
```

### 1.2 Create `skills/base44-landing-page/reference/html-template.md`

Contains the base HTML skeleton that Claude Code fills with content. Not an actual HTML file -- it's markdown instructions with HTML code blocks.

**Key decisions:**
- **Single file, inline everything.** No external CSS/JS dependencies. The HTML file must work if opened locally in a browser.
- **CSS custom properties from brand.json.** Map all design tokens to `--` variables in a `:root` block.
- **Base64-embedded assets.** Logo and fonts embedded as data URIs so the HTML is truly self-contained. This avoids font hosting issues.
- **Responsive by default.** Include the breakpoint media queries from design-system.md.
- **Minimal JS.** Only for FAQ accordion toggle and CLI copy button (if present). Vanilla JS, no frameworks.

**Template sections mapped to design-system.md components:**

| 8-Section Framework | HTML Component | Design System Source |
|---------------------|----------------|---------------------|
| HERO | Header (Variant A: Pill) + Hero (Variant A or B) | `.header` pill + `.hero` blue gradient or dot grid |
| SUCCESS | Checklist section with orange checkmarks | `.checklist-item` + `.checklist-check` SVG |
| PROBLEM-AGITATE | Split header + feature cards | `.split-header` + `.feature-card` |
| VALUE STACK | Numbered feature cards in grid | `.card` + `.grid-3` + `.card-number` |
| SOCIAL PROOF | Benefit cards with testimonial quotes | `.benefit-card` or custom testimonial cards |
| TRANSFORMATION | Step/process section | `.step` + `.step-number` + `.step-label` |
| SECONDARY CTA | CTA banner (sunset gradient) | `.cta-banner` + `.cta-card` |
| FOOTER | Full footer with columns | `.footer` + `.footer-top` + `.footer-menus` |

**5 template variations** (same as existing, but mapped to HTML):

| Template | Hero Variant | Layout Emphasis | Special Component |
|----------|-------------|-----------------|-------------------|
| `feature-launch` | Blue gradient | Hero + demo area + social proof | Terminal/code block |
| `campaign` | Blue gradient | Urgency headline + CTA-heavy | Ticker badge |
| `signup` | Dot grid | Low-friction CTA + value stack | CLI prompt button |
| `case-study` | Dot grid | Testimonials dominant + transformation | Benefit cards |
| `enterprise` | Full-width nav + dot grid | Trust signals + compliance | Checklist items |

### 1.3 Create `skills/base44-landing-page/reference/deployment.md`

Step-by-step deployment instructions for Claude Code to follow.

```
## Deployment Pipeline

### Pre-flight Check
1. Run: npx base44 whoami
   - If authenticated: continue
   - If NOT authenticated: tell user to run `npx base44 login` and STOP

### Option A: New Project (no base44/ directory exists)
1. Create project directory: mkdir -p {slug}-landing
2. cd into it
3. npm init -y
4. npm install --save-dev base44
5. npx base44 create {slug}-landing -p . (backend-only template)
6. Edit base44/config.jsonc: set site.outputDirectory to "./dist"
7. mkdir dist
8. Write index.html to dist/index.html
9. npx base44 site deploy -y

### Option B: Existing Base44 Project
1. Verify base44/config.jsonc exists
2. Check site.outputDirectory setting
3. Write index.html to the output directory
4. npx base44 site deploy -y

### Fallback: No Auth Available
1. Write index.html to ./landing-pages/{slug}/index.html
2. Tell user: "HTML saved locally. To deploy: cd {dir} && npx base44 login && npx base44 site deploy -y"
3. Return local file path instead of URL
```

### 1.4 Create `skills/base44-landing-page/reference/asset-strategy.md`

How to handle fonts, logo, and images.

```
## Asset Embedding Strategy

### Logo (MANDATORY)
- Source: output/logo.png (repo root)
- Strategy: Read file, convert to base64, embed as data URI in <img> tag
- Command: base64 -i output/logo.png
- Usage: <img src="data:image/png;base64,{encoded}" alt="Base44" style="height:30px" />
- NEVER render logo as text (RULES.md ALWAYS #10)

### Fonts (STK Miso)
- Source: STKMiso-Light.ttf and STKMiso-Regular.ttf (repo root)
- Strategy: Convert to base64, embed in @font-face as data URIs
- Command: base64 -i STKMiso-Light.ttf | tr -d '\n'
- This makes the HTML work offline and avoids CDN/hosting issues
- File sizes: ~50-80KB each, acceptable for inline embedding

### Alternative: Copy Assets to Dist
If base64 makes the HTML too large (>500KB total):
- Copy logo.png to dist/logo.png
- Copy font files to dist/fonts/
- Reference with relative paths: src="logo.png", url('./fonts/STKMiso-Light.ttf')
- This still works with base44 site deploy (all files in dist/ are uploaded)

### Hero Images
- If the user provides an image: copy to dist/
- If no image: use CSS gradient backgrounds from design-system.md
- NEVER generate images automatically -- suggest nano-banana if needed
```

---

## Phase 2: Router Integration (2 file edits)

### 2.1 Edit `skills/marketing-router/SKILL.md`

Add `LANDING_DEPLOY` to the intent classification table:

```
| 8.3 | LANDING_DEPLOY | deploy landing page, base44 landing, host landing, ship landing page, live landing page, build landing page on base44 | **LANDING_DEPLOY** |
```

Priority 8.3 places it between LANDING (8) and LANDING_GENERATE (8.5).

Add to Agent Chains table:
```
| LANDING_DEPLOY | base44-landing-page skill → brand-guardian → Base44 CLI deploy |
```

Add to Supporting Skills table:
```
| `base44-landing-page` | HTML landing page generation + Base44 hosting |
```

### 2.2 Edit `skills/marketing-router/reference/workflows.md`

Add new workflow section:

```markdown
## LANDING_DEPLOY (Base44-Hosted Landing Page)

Generate a self-contained HTML landing page and deploy to Base44 hosting.

1. Load brand context + memory
2. **Load design system** (MANDATORY):
   Read(file_path="brands/base44/design-system.md")
   Read(file_path="brands/base44/brand.json")
3. Load landing page skill:
   Read(file_path="skills/base44-landing-page/SKILL.md")
4. **GATHER INPUT** (use AskUserQuestion for missing items):
   - Page goal (feature launch, campaign, signup, etc.)
   - Target persona
   - Key message / product / feature
   - URL slug (used for project name and URL)
5. **SELECT TEMPLATE** (same 5 as LANDING_GENERATE)
6. **GENERATE COPY** using 8-Section Framework
7. **VALIDATE** with brand-guardian (score >= 7/10)
8. **GENERATE HTML** using design-system.md components
   - Read reference/html-template.md for structure
   - Read reference/asset-strategy.md for logo/font handling
9. **DEPLOY** via Base44 CLI
   - Read reference/deployment.md for exact steps
   - Auth check first, scaffold if needed
   - npx base44 site deploy -y
10. **RETURN** live URL, copy preview, next steps

**LANDING_DEPLOY produces a live HTML page on Base44 hosting.**
**LANDING_GENERATE produces CMS data for Wix.**
**LANDING produces copy only.**
```

---

## Phase 3: Agent and Plugin Updates (3 file edits)

### 3.1 Edit `agents/copywriter.md`

Add `base44-landing-page` to the skills list in the frontmatter:
```yaml
skills:
  - direct-response-copy
  - landing-page-architecture
  - landing-page-generator
  - base44-landing-page      # NEW
  - marketing-psychology
  - hook-rules
```

Add a subsection under "2. Landing Page Copy":
```markdown
**For Base44-hosted pages:** Use `base44-landing-page` skill to generate HTML and deploy via CLI. See `skills/base44-landing-page/SKILL.md`.
```

### 3.2 Edit `CLAUDE.md` (plugin index)

Add to Architecture diagram:
```
        ├── LANDING_DEPLOY → base44-landing-page → brand-guardian → Base44 CLI
```

Add to Skills table:
```
| `base44-landing-page` | HTML generation + Base44 hosting deployment |
```

### 3.3 Edit `plugin.json` (version bump)

Bump version to 1.9.0 to reflect the new skill addition.

---

## Phase 4: Quality and Testing (no new files)

### 4.1 Manual Testing Checklist

Test each template type with a real deployment:

| Test | Command | Expected Result |
|------|---------|-----------------|
| Feature launch LP | "Deploy a landing page for Debug Mode on Base44" | HTML generated, deployed, live URL returned |
| Campaign LP | "Ship a campaign page for AI Week on Base44" | Urgency-focused LP with ticker badge |
| Signup LP | "Build a free trial landing page on Base44" | Low-friction CTA, value stack prominent |
| No auth fallback | (logout first) "Deploy a landing page for X" | HTML saved locally, instructions printed |
| Router detection | "I need a landing page" | Router asks: Base44, Wix, or copy-only? |
| Brand validation | Generate LP with banned words | brand-guardian catches, forces revision |
| Mobile responsive | Open deployed page on mobile | Layout adapts at 768px and 1200px breakpoints |
| Logo rendering | Inspect deployed page | Logo is an image (not text), height 30px in header |

### 4.2 HTML Validation

Before deploying, the skill should instruct Claude Code to verify:
- [ ] HTML is valid (no unclosed tags)
- [ ] All brand.json colors used correctly (#0f0f0f, not #000000)
- [ ] Logo is image, never text
- [ ] Font-face declarations present for STK Miso Light (300) and Regular (400)
- [ ] Responsive breakpoints at 768px and 1200px
- [ ] CTA links point to valid URLs
- [ ] Page title and meta description present
- [ ] OG meta tags for social sharing

---

## File Inventory

### New Files (4)

| # | File Path | Description |
|---|-----------|-------------|
| 1 | `plugins/base44-marketing/skills/base44-landing-page/SKILL.md` | Main skill definition (workflow, steps, triggers) |
| 2 | `plugins/base44-marketing/skills/base44-landing-page/reference/html-template.md` | HTML skeleton + section-to-component mapping |
| 3 | `plugins/base44-marketing/skills/base44-landing-page/reference/deployment.md` | Base44 CLI deployment pipeline steps |
| 4 | `plugins/base44-marketing/skills/base44-landing-page/reference/asset-strategy.md` | Font/logo/image embedding strategy |

### Edited Files (5)

| # | File Path | Change |
|---|-----------|--------|
| 1 | `plugins/base44-marketing/skills/marketing-router/SKILL.md` | Add LANDING_DEPLOY to intent table + agent chains + skills list |
| 2 | `plugins/base44-marketing/skills/marketing-router/reference/workflows.md` | Add LANDING_DEPLOY workflow section |
| 3 | `plugins/base44-marketing/agents/copywriter.md` | Add base44-landing-page to skills list + subsection |
| 4 | `plugins/base44-marketing/CLAUDE.md` | Add LANDING_DEPLOY to architecture + skills table |
| 5 | `plugins/base44-marketing/.claude-plugin/plugin.json` | Version bump to 1.9.0 |

### Unchanged Files (referenced but not modified)

| File Path | Role |
|-----------|------|
| `plugins/base44-marketing/skills/landing-page-architecture/SKILL.md` | Reused for copy generation (8-Section Framework) |
| `plugins/base44-marketing/skills/landing-page-generator/SKILL.md` | Wix pipeline -- untouched, remains as alternative |
| `plugins/base44-marketing/brands/base44/design-system.md` | Source of truth for HTML/CSS components |
| `plugins/base44-marketing/brands/base44/brand.json` | Source of truth for design tokens |
| `plugins/base44-marketing/brands/base44/RULES.md` | Brand rules (logo.png mandate lives here) |
| `plugins/base44-marketing/agents/brand-guardian.md` | Validation gate -- unchanged |

---

## Dependencies

| Dependency | Status | Required For |
|------------|--------|-------------|
| Base44 CLI (`base44` npm package) | Available globally | Project scaffolding + deployment |
| `base44-cli` Claude skill | Installed at `~/.claude/skills/base44-cli/` | CLI operation patterns |
| design-system.md | Exists in `brands/base44/` | HTML/CSS component library |
| brand.json | Exists in `brands/base44/` | Design token values |
| landing-page-architecture skill | Exists in `skills/` | 8-Section Framework copy generation |
| STK Miso font files | At repo root (`STKMiso-Light.ttf`, `STKMiso-Regular.ttf`) | Font embedding |
| logo.png | At `output/logo.png` | Logo embedding |
| Base44 auth (user-side) | User must `npx base44 login` | Deployment (graceful fallback if missing) |

---

## Open Questions

1. **App naming convention:** Should each landing page be its own Base44 app (e.g., `debug-mode-lp.base44.app`) or should there be a single "marketing-pages" app with multiple pages? Single-app is simpler for v1. One app per LP gives cleaner URLs.
   - **Recommendation:** One app per LP for v1. Keeps deploys isolated and URLs clean.

2. **Custom domains:** Base44 may support custom domains (e.g., `base44.com/debug-mode`). This is out of scope for v1 but should be considered for v2.

3. **Font file size:** Base64-embedding two TTF files adds ~100-160KB to the HTML. This is acceptable for landing pages (single load, no navigation). If it becomes an issue, the fallback is to copy files to `dist/` alongside the HTML.

4. **Existing landing-pages directory:** There's already a `landing-pages/` directory in the repo root with a `logo.png`. Should new HTML output go there (local dev) or to a temp directory per-deployment?
   - **Recommendation:** Use a dedicated temp directory per deployment (`/tmp/{slug}-landing/dist/`). The `landing-pages/` dir can be a local preview location.

5. **Analytics/tracking:** Should the generated HTML include Google Analytics or similar? Out of scope for v1 but easy to add as a config option later.

---

## Scope Estimate

| Phase | New Files | Edited Files | Complexity |
|-------|-----------|-------------|------------|
| Phase 1: Core Skill | 4 new | 0 | Medium -- HTML template design is the main work |
| Phase 2: Router Integration | 0 | 2 | Low -- adding rows to tables and a workflow section |
| Phase 3: Agent/Plugin Updates | 0 | 3 | Low -- small additions to existing files |
| Phase 4: Testing | 0 | 0 | Medium -- manual testing across 5 templates |

**Total: 4 new files, 5 edited files.**

All files are markdown. No JavaScript, no package.json, no build tools within the plugin itself.

---

## Relationship to Existing Plans

### Figma-to-Landing-Page Plan (`2026-02-12-figma-landing-page-plan.md`)

Phase 3 of the Figma plan mentions "Base44 CLI Integration" at a high level. This plan is the detailed implementation of that integration. Once this skill exists, the Figma plan's Phase 3 becomes: "Figma extraction -> this skill's HTML generation -> Base44 deploy."

### Wix CMS Pipeline (`landing-page-generator`)

Not replaced. The two pipelines serve different needs:

| Dimension | LANDING_DEPLOY (new) | LANDING_GENERATE (existing) |
|-----------|---------------------|----------------------------|
| Output | Self-contained HTML on Base44 hosting | CMS JSON on Wix |
| URL | `{slug}.base44.app` | `base44.com/landing/{slug}` |
| Dependencies | Base44 CLI + auth | Wix API key + Wix Studio template |
| Best for | Quick standalone pages, campaigns, experiments | Pages integrated into base44.com site |
| Build step | None (static HTML) | Requires Wix template in Studio |

---

### Memory Notes (For Workflow-Final Persistence)

**Key learnings to remember:**
- Base44 hosting is SPA-only (`index.html` + client-side routing) -- perfect for landing pages
- `npx base44 site deploy -y` deploys whatever is in the `site.outputDirectory` from `config.jsonc`
- The `-y` flag is required for non-interactive mode (agents can't confirm prompts)
- `npx base44 create {name} -p .` with backend-only template adds Base44 config to existing directory
- MUST provide both name AND `--path` flag to avoid interactive TUI
- Font files (STK Miso) are at repo root, not in a fonts/ subdirectory
- Logo source is `output/logo.png` -- ALWAYS embed as image, never as text (RULES.md ALWAYS #10)
- design-system.md contains copy-paste-ready HTML/CSS for all components
- The marketing plugin is markdown-only -- skills instruct Claude Code, they don't execute code themselves
- Priority ordering for landing workflows: LANDING (8) < LANDING_DEPLOY (8.3) < LANDING_GENERATE (8.5)
- Graceful fallback when no Base44 auth: save HTML locally and print deploy instructions

---

*Plan created: 2026-02-12*
*Author: planner agent*
*Version: 1.0*
