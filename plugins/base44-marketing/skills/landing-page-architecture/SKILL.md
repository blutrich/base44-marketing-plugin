---
name: landing-page-architecture
description: |
  COPY PHASE: Builds the copy brief and 8-section content structure for landing pages. Always runs before base44-landing-page. The Copy Brief is MANDATORY before any HTML generation. It ensures every claim is grounded in real evidence, every hook is tested against the Hormozi formula, and every section has a clear audience and wedge.

  Triggers on: landing page copy, page architecture, copy brief, section framework, lp copy.
---

# Landing Page Architecture Skill

> Copy Brief (grounded) then Structure (8 sections) then HTML (design system).

## When to Use This Skill

Apply when creating:
- Landing pages
- Lead magnet pages
- Product launch pages
- Sales pages
- Feature announcement pages
- Pricing pages

## Core Philosophy

**Copy comes before design.** The #1 mistake is jumping to HTML before the copy is locked. Every landing page needs:

1. **Copy Brief** (Phase 1) - WHO are we talking to, WHAT's the wedge, WHERE's the proof
2. **8-Section Framework** (Phase 2) - WHERE elements go and WHY
3. **HTML Generation** (Phase 3) - Handled by `base44-landing-page` skill

**Never skip Phase 1.** A beautiful page with weak copy converts at 0%.

---

## Phase 1: Copy Brief (MANDATORY)

5 steps that ground every claim in real evidence before writing copy.

**Read the full process:** [references/copy-brief.md](references/copy-brief.md)

| Step | What | Output |
|------|------|--------|
| 1. Audience Lock | Define 2-4 segments with evidence | Segment profiles + primary segment |
| 2. Competitor Wedge | Research alternatives, find the gap | Wedge statement + proof |
| 3. Proof Points | Gather real numbers, quotes, data | Evidence inventory |
| 4. Hook Generation | Hormozi formula H1 candidates | Top 2 hooks for user selection |
| 5. Section Copy Brief | 1-2 sentence brief per section | The contract all copy traces to |

**Key rules:**
- Segments need real evidence (Slack quotes, data points), not assumptions
- Hook must pass Hormozi validation: specific result + surprising context + implied how
- Section brief is the contract. All copy must trace back to it.

---

## Phase 2: 8-Section Framework

Write actual copy section by section, every claim referencing the Copy Brief.

**Read the full framework + example:** [references/8-section-framework.md](references/8-section-framework.md)

| Section | Job | Key Components |
|---------|-----|----------------|
| 1. HERO | Get email or scroll | Eyebrow, H1, H2, CTA, Trust |
| 2. SUCCESS | Kill buyer's remorse | Confirmation, Deliverables |
| 3. PROBLEM-AGITATE | Make status quo painful | 2-4 problems, Agitation, Transition |
| 4. VALUE STACK | Make "no" feel stupid | 4 tiers, Total value, Price |
| 5. SOCIAL PROOF | Let others convince | 2-4 testimonials + specific results |
| 6. TRANSFORMATION | Make outcome tangible | Quick win to 10x timeline |
| 7. SECONDARY CTA | Catch scroll-to-bottom | Avatar stack, Question, "Yes" button |
| 8. FOOTER | Professional legitimacy | Logo, Nav, Legal, Social |

**SLIDE alignment:** Hero=Situation, Problem=Limitation+Implication, Transformation=Destination, Proof+Stack=Evidence

---

## Phase 3: HTML Generation

Handled by `base44-landing-page` skill. Phase 3 cannot start until Phase 1 and 2 are complete.

---

## Quality Checklist

**Copy Brief (Phase 1):**
- [ ] Audience Lock complete (2-4 segments with evidence)
- [ ] Competitor Wedge researched (or explicitly marked "no competitor")
- [ ] Proof Points gathered (numbers, quotes, external)
- [ ] H1 generated with Hormozi formula and user-approved
- [ ] Section Copy Brief written for all 8 sections

**Structure (Phase 2):**
- [ ] All 8 sections present in order
- [ ] Each section does ONE job
- [ ] Every claim traces to a Copy Brief proof point

**Copy:**
- [ ] Applied SO WHAT chain to features
- [ ] Zero brand-voice kill list words (check RULES.md)
- [ ] No em dashes, no arrows, no AI filler
- [ ] Specific numbers from real data, not invented
- [ ] H1 passes Hormozi formula validation
- [ ] Passes Maor Test

**Conversion:**
- [ ] Trust signals use real proof points
- [ ] Secondary CTA handles biggest objection
- [ ] Comparison table attacks competitor wedge (if applicable)
- [ ] FAQ uses real questions from Slack/support

---

## Brand Data Loading (Base44)

Load brand context per `brands/base44/context-loading.md`

---

## Pipeline

```
PHASE 1: Copy Brief (this skill)
  Steps 1-5 > see references/copy-brief.md
     ↓
PHASE 2: Section Copy (this skill)
  8 sections > see references/8-section-framework.md
  Run brand-guardian (score >= 7/10)
     ↓
PHASE 3: HTML Generation (base44-landing-page skill)
  Load design-system.md + brand.json
  Generate self-contained HTML
  Deploy via Base44 CLI
```

## Integration

**Depends on:** brand-voice (tone), direct-response-copy (THE SLIDE), hook-rules (Hormozi formula)
**Used by:** `base44-landing-page` (HTML generation), campaign launches, product launches
**Layer:** Copy strategy + page architecture. Runs BEFORE design/HTML.
**Data sources:** Slack MCP (channels, threads), Tavily (competitor research), Product App API (metrics)

---

*Copy Brief System based on real-session patterns. 8-Section Framework based on James Dickerson / The Boring Marketer.*
