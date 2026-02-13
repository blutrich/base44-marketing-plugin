# Figma-to-Landing-Page Pipeline Plan

> **Goal:** Design in Figma → extract with MCP tools → apply Base44 design system → generate landing page → deploy via Base44 CLI.
> **Status:** PLAN (pending build after Agent Teams integration completes)

---

## Current State

### What Works Today
- **Copy pipeline:** 8-Section Framework generates landing page copy with brand voice
- **Brand validation:** Brand-guardian scores content (>= 7/10 to pass)
- **CMS push:** Wix CMS API integration for `base44.com/landing/{slug}`
- **Templates:** 5 templates (feature-launch, campaign, signup, case-study, enterprise)
- **Design system:** `brand.json` has colors (#FF983B orange, #E8F4F8 blue), fonts (BC Novatica Cyr, STK Miso Light, Inter), gradients, shadows

### What's Missing
- Figma design reading/extraction
- Design-to-landing-page mapping
- Visual asset extraction from Figma
- Base44 CLI deployment (currently Wix API only)
- Design token sync (Figma variables → brand.json)

---

## Architecture

```
FIGMA DESIGN (URL or selection)
    |
    v
[Figma MCP Tools]  →  Extract: layout, components, text, images, variables
    |
    v
[Design System Mapper]  →  Map Figma components to Base44 design tokens
    |                       (brand.json fonts, colors, gradients)
    v
[Landing Page Generator]  →  Generate HTML/code using:
    |                         - Extracted layout structure
    |                         - Brand-enforced copy (8-Section Framework)
    |                         - Design system tokens
    v
[Brand Guardian]  →  Validate voice + visual consistency
    |
    v
[Base44 CLI]  →  `base44 site deploy` → Live page
```

---

## Available Tools

### Figma MCP Tools (Already Installed)

| Tool | Purpose | Use In Pipeline |
|------|---------|----------------|
| `get_design_context` | Extract design structure, layout, components | Read Figma design structure |
| `get_variable_defs` | Extract design variables (colors, spacing, typography) | Map to brand.json tokens |
| `get_screenshot` | Capture visual reference of design | Visual reference for code gen |
| `get_metadata` | File/node metadata | Identify design file info |
| `get_code_connect_map` | Existing component-to-code mappings | Reuse mapped components |
| `get_code_connect_suggestions` | Suggest component mappings | Auto-map new components |
| `create_design_system_rules` | Generate design system rules for repo | Create Base44 design rules |

### Figma Skills (Available)

| Skill | Purpose |
|-------|---------|
| `figma:implement-design` | Translates Figma designs into production-ready code with 1:1 visual fidelity |
| `figma:code-connect-components` | Connects Figma components to code components |
| `figma:create-design-system-rules` | Generates custom design system rules |

### Existing Plugin Skills

| Skill | Purpose | Integration Point |
|-------|---------|-------------------|
| `landing-page-architecture` | 8-Section Framework copy generation | Provides copy for each section |
| `landing-page-generator` | Full pipeline to Wix CMS | Existing deployment target |
| `direct-response-copy` | THE SLIDE framework | Copy quality |
| `nano-banana` | Image generation (Imagen 3) | Hero images, OG images |

---

## Deliverables

### Phase 1: Design System Rules

**Goal:** Connect Figma design system to Base44's brand.json.

| # | Deliverable | Description |
|---|-------------|-------------|
| 1.1 | Run `figma:create-design-system-rules` | Generate rules file mapping Figma variables to code tokens |
| 1.2 | Create `.claude/design-system-rules.md` | Design system rules for the project (fonts, colors, spacing) |
| 1.3 | Validate against `brand.json` | Ensure Figma tokens match existing brand definitions |

### Phase 2: Figma-to-Landing-Page Skill

**Goal:** New skill that bridges Figma designs to the existing landing page pipeline.

| # | Deliverable | Description |
|---|-------------|-------------|
| 2.1 | Create `skills/figma-landing-page/SKILL.md` | New skill definition |
| 2.2 | Create `skills/figma-landing-page/reference/component-map.md` | Maps Figma components to 8-Section Framework sections |
| 2.3 | Create `skills/figma-landing-page/reference/asset-extraction.md` | How to extract images, icons from Figma |
| 2.4 | Update `skills/marketing-router/SKILL.md` | Add FIGMA_LANDING workflow to router |
| 2.5 | Update `skills/marketing-router/reference/workflows.md` | Add FIGMA_LANDING workflow details |

### Phase 3: Base44 CLI Integration

**Goal:** Replace/complement Wix CMS push with Base44 CLI deployment.

| # | Deliverable | Description |
|---|-------------|-------------|
| 3.1 | Document Base44 CLI patterns | How `base44 site deploy` works, entity creation, function deployment |
| 3.2 | Update `landing-page-generator/SKILL.md` | Add Base44 CLI as deployment option alongside Wix CMS |
| 3.3 | Create deployment template | Base44 entity schema for landing pages |

---

## Skill Definition: figma-landing-page

```markdown
---
name: figma-landing-page
description: |
  Converts Figma designs into Base44 landing pages with brand-enforced copy and design system tokens.

  Triggers on: figma landing page, design to page, implement figma, figma to base44,
  convert design, design to code landing page.

  CHAIN: figma-landing-page → landing-page-architecture (copy) → brand-guardian (review) → base44 deploy
---

# Figma Landing Page Pipeline

## Step 1: Extract Design from Figma

Use Figma MCP tools to read the design:

1. `get_design_context` - Get layout structure, component hierarchy
2. `get_variable_defs` - Get design tokens (colors, fonts, spacing)
3. `get_screenshot` - Get visual reference

## Step 2: Map to 8-Section Framework

Map Figma sections to landing page framework:

| Figma Section Pattern | Maps To | How to Identify |
|----------------------|---------|-----------------|
| Top hero area with headline + CTA | HERO | First section, largest text, button present |
| Pain points / problem area | PROBLEM-AGITATE | Negative framing, problem icons |
| Feature grid / value cards | VALUE STACK | Card layout, pricing elements |
| Testimonial section | SOCIAL PROOF | Quote marks, headshots, company logos |
| Pricing / comparison table | VALUE STACK | Price numbers, plan columns |
| Timeline / roadmap | TRANSFORMATION | Sequential steps, timeline visual |
| Bottom CTA section | SECONDARY CTA | Below-fold CTA button |
| Footer | FOOTER | Navigation links, legal text |

## Step 3: Apply Design System

Map Figma variables to brand.json tokens:

| Figma Variable | brand.json Token | Value |
|---------------|-----------------|-------|
| Primary/accent | colors.primary_accent | #FF983B |
| Background/main | colors.background | #E8F4F8 |
| Background/alt | colors.alt_background | #FDF5F0 |
| Text/primary | colors.text | #000000 |
| Font/heading | fonts.heading | BC Novatica Cyr |
| Font/alt-heading | fonts.alt_heading | STK Miso Light |
| Font/body | fonts.body | Inter |

## Step 4: Generate Landing Page

Combine:
- Layout structure from Figma extraction
- Copy from landing-page-architecture (8-Section Framework)
- Design tokens from brand.json
- Assets from Figma (images, icons)

## Step 5: Brand Guardian Review

Pass generated page through brand-guardian:
- Voice check (no TV-ad cadence, Maor Test)
- Visual consistency (brand.json colors, fonts)
- Score >= 7/10 to proceed

## Step 6: Deploy

Option A: Wix CMS (existing pipeline)
- Format as CMS JSON per cms-schema.md
- Push via Wix API

Option B: Base44 CLI (new)
- Create landing page entity
- Deploy via `base44 site deploy`
```

---

## Router Integration

Add to marketing-router intent classification:

| Priority | Signal | Keywords | Workflow |
|----------|--------|----------|----------|
| 7.5 | FIGMA_LANDING | figma landing, figma to page, implement design, design to landing, convert figma | **FIGMA_LANDING** |

Workflow chain:
```
FIGMA_LANDING → figma-landing-page skill → landing-page-architecture (copy) → brand-guardian → deploy
```

---

## Component Mapping Reference

### Figma → 8-Section Framework

```
Figma Frame: "Hero"
├── Text (largest): hero_headline
├── Text (medium): hero_subheadline
├── Text (small, above headline): hero_eyebrow
├── Button (primary): hero_cta_text + hero_cta_url
└── Logos/badges: hero_trust_signals

Figma Frame: "Pain Points"
├── Icon + Text cards (3x): problem_points[]
├── Headline: problem_headline
└── Transition text: problem_agitation

Figma Frame: "Features" / "Value"
├── Cards with prices: value_stack_tiers[]
├── Total value text: total_value
└── CTA: value_cta

Figma Frame: "Testimonials"
├── Quote + photo + name: testimonials[]
├── Company logos: social_proof_logos
└── Metric callouts: social_proof_numbers

Figma Frame: "Footer"
├── Logo: footer_logo
├── Nav links: footer_navigation[]
└── Legal text: footer_legal
```

---

## Open Questions

1. **Base44 CLI specifics:** What is the exact CLI command and entity structure for deploying landing pages? Need to verify `base44 site deploy` workflow.
2. **Font hosting:** Are BC Novatica Cyr and STK Miso Light hosted on Base44's CDN or need to be bundled?
3. **Image handling:** Should Figma images be exported and uploaded to Base44, or referenced via Figma URLs?
4. **Template scope:** Is this for marketing landing pages only, or also product pages within the Base44 app?

---

## Dependencies

| Dependency | Status | Blocker? |
|------------|--------|----------|
| Figma MCP tools installed | Available (deferred tools) | No |
| `figma:implement-design` skill | Available | No |
| `brand.json` design system | Exists | No |
| Landing page architecture skill | Exists | No |
| Base44 CLI access | **UNKNOWN** | **Potential** |
| Font files (BC Novatica Cyr, STK Miso Light) | **UNKNOWN** | **Potential** |

---

## Estimated Scope

- Phase 1 (Design System Rules): 1 session
- Phase 2 (Figma Landing Page Skill): 1-2 sessions
- Phase 3 (Base44 CLI Integration): 1 session (depends on CLI access)

---

*Created: 2026-02-12*
*Blocked by: Agent Teams integration build (current)*
*Depends on: Base44 CLI documentation, font file locations*
