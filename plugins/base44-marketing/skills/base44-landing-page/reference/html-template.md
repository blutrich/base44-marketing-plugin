# HTML Template Reference

> Maps the 8-Section Framework to design-system.md HTML/CSS components.

## Base HTML Skeleton

Every landing page starts with this structure. Claude Code fills in the `{PLACEHOLDERS}` with generated copy and design system components.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{META_TITLE}</title>
  <meta name="description" content="{META_DESCRIPTION}">
  <meta property="og:title" content="{META_TITLE}">
  <meta property="og:description" content="{META_DESCRIPTION}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://{SLUG}.base44.app">
  <style>
    {FONT_FACE_DECLARATIONS}
    {CSS_RESET}
    {CSS_CUSTOM_PROPERTIES}
    {COMPONENT_STYLES}
    {RESPONSIVE_BREAKPOINTS}
  </style>
</head>
<body>
  {HEADER}
  {HERO_SECTION}
  {SUCCESS_SECTION}
  {PROBLEM_SECTION}
  {VALUE_STACK_SECTION}
  {SOCIAL_PROOF_SECTION}
  {TRANSFORMATION_SECTION}
  {SECONDARY_CTA_SECTION}
  {FOOTER}
  {FAQ_SCRIPT}
</body>
</html>
```

---

## CSS Custom Properties (from brand.json)

Generate a `:root` block mapping brand.json tokens to CSS variables:

```css
:root {
  /* Colors */
  --color-bg: #E8F4F8;
  --color-bg-alt: #FDF5F0;
  --color-bg-warm: #faf9f7;
  --color-surface: #fff;
  --color-text: #0f0f0f;
  --color-text-body: #232529;
  --color-text-secondary: #696f7b;
  --color-accent: #FF983B;
  --color-accent-light: #FFE9DF;
  --color-green-bg: #ebffb1;
  --color-green-border: #ade900;
  --color-card-border: #e6e6e6;
  --color-divider: #d1d1d1;
  --color-terminal: #1a1a1a;

  /* Spacing */
  --max-width: 1460px;
  --section-padding: 120px 40px;
  --grid-gap: 10px;

  /* Borders */
  --radius-card: 10px;
  --radius-pill: 300px;
  --radius-rect: 8px;
  --radius-ticker: 60px;
  --radius-terminal: 12px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-terminal: 0 20px 60px rgba(0,0,0,0.3);
}
```

---

## Section-to-Component Mapping

### HERO Section

| Template | Hero Variant | Header Variant | Special Component |
|----------|-------------|----------------|-------------------|
| `feature-launch` | Blue gradient (Variant A) | Pill header | Terminal code block |
| `campaign` | Blue gradient (Variant A) | Pill header | Ticker badge |
| `signup` | Dot grid (Variant B) | Pill header | CLI prompt button |
| `case-study` | Dot grid (Variant B) | Pill header | Benefit cards |
| `enterprise` | Dot grid (Variant B) | Full-width nav | Checklist items |

**Hero HTML structure:**
```html
<header class="header">
  <img src="{LOGO_DATA_URI}" alt="Base44" style="height:30px" />
  <div style="display:flex;align-items:center;gap:8px">
    <button class="btn-login">Log in</button>
    <button class="btn-cta-green">{HEADER_CTA}</button>
  </div>
</header>

<section class="hero">
  <div class="ticker">{HERO_EYEBROW}</div>
  <h1 class="hero-title">{HERO_HEADLINE}</h1>
  <p class="hero-subtitle">{HERO_SUBHEADLINE}</p>
  <div class="hero-buttons">
    <a href="{CTA_URL}" class="btn-primary">{HERO_CTA_TEXT}</a>
    <a href="#features" class="btn-secondary">Learn More</a>
  </div>
  <p class="hero-trust">{TRUST_SIGNALS}</p>
</section>
```

### SUCCESS Section

Use checklist component from design-system.md:

```html
<section class="section" style="background:var(--color-bg-warm)">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title">{SUCCESS_TITLE}</h2>
    </div>
    <div class="checklist">
      <div class="checklist-item">
        <div class="checklist-check">{ORANGE_CHECK_SVG}</div>
        <span class="checklist-text">{DELIVERABLE_1}</span>
      </div>
      <!-- repeat for each deliverable -->
    </div>
  </div>
</section>
```

### PROBLEM-AGITATE Section

Use split header + feature cards:

```html
<section class="section">
  <div class="section-inner">
    <div class="split-header">
      <h2 class="split-header-title">{PROBLEM_EYEBROW}</h2>
      <p class="split-header-desc">{PROBLEM_HEADLINE}</p>
    </div>
    <div class="grid-3">
      <div class="feature-card">
        <h3 class="feature-card-title">{PAIN_POINT_1_TITLE}</h3>
        <p class="feature-card-desc">{PAIN_POINT_1_DESC}</p>
      </div>
      <!-- repeat for 3 pain points -->
    </div>
    <p class="agitation-text">{AGITATION}</p>
  </div>
</section>
```

### VALUE STACK Section

Use numbered feature cards in grid:

```html
<section class="section" style="background:var(--color-bg-warm)">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title">{VALUE_HEADLINE}</h2>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-number">01</div>
        <div>
          <h3 class="card-title">{TIER_1_NAME}</h3>
          <p class="card-description">{TIER_1_DESC}</p>
        </div>
      </div>
      <!-- repeat for each tier -->
    </div>
    <div class="value-summary">
      <p class="value-total">Total value: {TOTAL_VALUE}</p>
      <p class="value-price">{PRICE}</p>
      <a href="{CTA_URL}" class="btn-primary">{VALUE_CTA_TEXT}</a>
    </div>
  </div>
</section>
```

### SOCIAL PROOF Section

Use testimonial cards:

```html
<section class="section">
  <div class="section-inner">
    <div class="section-header">
      <p class="section-eyebrow">{PROOF_EYEBROW}</p>
      <h2 class="section-title">{PROOF_HEADLINE}</h2>
    </div>
    <div class="grid-3">
      <div class="testimonial-card">
        <blockquote class="testimonial-quote">"{QUOTE_1}"</blockquote>
        <div class="testimonial-author">
          <strong>{NAME_1}</strong>
          <span>{ROLE_1}</span>
        </div>
        <p class="testimonial-result">{RESULT_1}</p>
      </div>
      <!-- repeat for 3 testimonials -->
    </div>
  </div>
</section>
```

### TRANSFORMATION Section

Use step/process layout:

```html
<section class="section" style="background:var(--color-bg-warm)">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title">{TRANSFORMATION_HEADLINE}</h2>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-left">
          <div class="step-number">01</div>
          <h3 class="step-label">{STEP_1_TITLE}</h3>
          <p class="step-desc">{STEP_1_DESC}</p>
        </div>
      </div>
      <!-- repeat for 4 steps: Week 1, Month 1, Month 3, Year 1 -->
    </div>
  </div>
</section>
```

### SECONDARY CTA Section

Use sunset gradient CTA banner:

```html
<section class="cta-section">
  <div class="cta-banner">
    <div class="cta-card">
      <h2 class="cta-card-title">{SECONDARY_HEADLINE}</h2>
      <a href="{CTA_URL}" class="btn-primary" style="background:#fff;color:#0f0f0f">{SECONDARY_CTA_TEXT}</a>
      <p style="color:rgba(255,255,255,0.7);font-size:16px">{OBJECTION_HANDLER}</p>
    </div>
  </div>
</section>
```

### FOOTER

```html
<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <img src="{LOGO_DATA_URI}" alt="Base44" style="height:24px" />
      <p class="footer-tagline">{TAGLINE}</p>
    </div>
    <div class="footer-menus">
      <div class="footer-menu">
        <h4 class="footer-menu-title">Product</h4>
        <a href="https://base44.com" class="footer-menu-link">Platform</a>
        <a href="https://base44.com/templates" class="footer-menu-link">Templates</a>
        <a href="https://docs.base44.com" class="footer-menu-link">Docs</a>
      </div>
      <div class="footer-menu">
        <h4 class="footer-menu-title">Company</h4>
        <a href="https://base44.com/about" class="footer-menu-link">About</a>
        <a href="https://base44.com/blog" class="footer-menu-link">Blog</a>
      </div>
    </div>
  </div>
  <hr class="footer-divider" />
  <p class="footer-copyright">&copy; 2026 Base44. All rights reserved.</p>
</footer>
```

---

## Section Backgrounds (Alternating Pattern)

Sections alternate between white and warm backgrounds:

| Section | Background |
|---------|------------|
| HERO | Gradient (blue or dot grid) |
| SUCCESS | `#faf9f7` (warm) |
| PROBLEM-AGITATE | `#fff` (white) |
| VALUE STACK | `#faf9f7` (warm) |
| SOCIAL PROOF | `#fff` (white) |
| TRANSFORMATION | `#faf9f7` (warm) |
| SECONDARY CTA | Sunset gradient |
| FOOTER | `#fff` (white) |

---

## Common Styles (include in every page)

```css
.section {
  padding: var(--section-padding);
}
.section-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}
.hero-subtitle {
  font-family: 'STK Miso', sans-serif;
  font-weight: 300;
  font-size: 20px;
  line-height: 28px;
  color: var(--color-text-body);
  max-width: 600px;
  text-align: center;
  margin-top: 24px;
}
.hero-buttons {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-trust {
  font-family: 'STK Miso', sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-top: 32px;
  text-align: center;
}
.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-card);
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.testimonial-quote {
  font-family: 'STK Miso', sans-serif;
  font-weight: 300;
  font-size: 18px;
  line-height: 28px;
  color: var(--color-text-body);
  border: none;
  margin: 0;
  padding: 0;
}
.testimonial-author strong {
  font-weight: 400;
  font-size: 16px;
  color: var(--color-text);
}
.testimonial-author span {
  font-size: 14px;
  color: var(--color-text-secondary);
  display: block;
}
.testimonial-result {
  font-size: 14px;
  color: var(--color-accent);
  font-weight: 400;
}
.agitation-text {
  font-family: 'STK Miso', sans-serif;
  font-weight: 300;
  font-size: 20px;
  line-height: 28px;
  color: var(--color-text-body);
  max-width: 700px;
  margin: 40px auto 0;
  text-align: center;
}
.value-summary {
  text-align: center;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.value-total {
  font-size: 20px;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}
.value-price {
  font-size: 36px;
  font-weight: 400;
  color: var(--color-text);
}
.steps {
  display: flex;
  flex-direction: column;
}
.step { border-top: 1px solid var(--color-divider); padding: 40px 0; }
.step-desc {
  font-family: 'STK Miso', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-text-body);
  margin-top: 12px;
}
.cta-section { padding: 40px; }
```

---

## Responsive Breakpoints

```css
@media (max-width: 1200px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .split-header { flex-direction: column; gap: 24px; padding: 0 20px; }
  .step { padding: 40px 20px; }
  .faq-layout { flex-direction: column; gap: 40px; padding: 0 20px; }
  .footer-top { flex-direction: column; padding: 0 20px; }
  .section { padding: 80px 20px; }
}
@media (max-width: 768px) {
  .grid-3 { grid-template-columns: 1fr; }
  .hero-title { font-size: 44px; line-height: 48px; }
  .section-title { font-size: 36px; line-height: 40px; }
  .hero-buttons { flex-direction: column; align-items: center; }
  .btn-primary, .btn-secondary { width: 100%; max-width: 320px; text-align: center; }
  .header { left: 10px; right: 10px; top: 10px; }
  .cta-card { width: 90%; padding: 40px 24px; }
  .faq-question-text { font-size: 22px; }
}
```
