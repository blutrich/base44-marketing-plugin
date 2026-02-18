# Base44 Design System

> Extracted from Figma source files. Use this instead of Figma when building landing pages.

**Required read:** `brands/base44/brand.json` for exact token values.

---

## Font Setup (Copy into every page `<head>`)

```html
<!-- For standalone HTML: fonts are base64-embedded (see asset-strategy.md) -->
<!-- For React/file-based: use these paths -->
<style>
  @font-face {
    font-family: 'STK Miso';
    src: url('./fonts/STKMiso-Light.ttf') format('truetype');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'STK Miso';
    src: url('./fonts/STKMiso-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal; font-display: swap;
  }
</style>
```

**Canonical font files (git-tracked):** `assets/fonts/STKMiso-Light.ttf`, `assets/fonts/STKMiso-Regular.ttf`

**Font:** STK Miso Light (300) for body/code, STK Miso Regular (400) for headings/buttons. Single font family everywhere.

---

## CSS Reset (Copy into every page)

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'STK Miso', sans-serif;
  color: #232529;
  background: #fff;
  -webkit-font-smoothing: antialiased;
}
```

---

## Logo

The Base44 logo is an **orange half-circle mark** (sunrise motif) followed by **"Base44" in bold black text**.

**ALWAYS use inline SVG** — never use base64 PNG (it renders corrupted). Never recreate the logo as text.

```html
<!-- Header logo (30px height) -->
<a href="https://base44.com">
  <svg height="30" viewBox="0 0 995 238" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M191.288 212.878C191.603 212.878 191.742 213.279 191.49 213.471C171.439 228.855 146.348 238 119.121 238C91.8942 238 66.8029 228.857 46.7514 213.471C46.5002 213.279 46.639 212.878 46.9542 212.878H191.288ZM222.329 178.28C218.173 185.501 213.278 192.245 207.754 198.408C207.544 198.642 207.245 198.774 206.932 198.774H31.3123C30.9994 198.774 30.6997 198.642 30.4903 198.408C24.9634 192.245 20.0712 185.501 15.915 178.28C15.7454 177.987 15.9591 177.619 16.2985 177.619H221.945C222.285 177.619 222.499 177.987 222.329 178.28ZM235.767 142.668C234.352 149.674 232.323 156.456 229.738 162.96C229.603 163.295 229.277 163.515 228.916 163.515H9.32599C8.96459 163.515 8.63844 163.295 8.50401 162.96C5.91907 156.459 3.88947 149.676 2.47469 142.668C2.4196 142.395 2.62895 142.139 2.90882 142.139H235.333C235.611 142.139 235.822 142.395 235.767 142.668ZM118.317 0.00265287C184.408 -0.43368 238.121 53.0104 238.121 119C238.121 121.9 238.017 124.776 237.814 127.625C237.799 127.857 237.605 128.035 237.374 128.035H0.870397C0.639009 128.035 0.445084 127.857 0.429658 127.625C0.226917 124.814 0.123343 121.973 0.12114 119.108C0.0638435 54.3613 53.5719 0.432374 118.317 0.00265287Z" fill="#FF631F"/>
    <path d="M309.165 47.0674H374.508C405.556 47.0674 420.464 61.3951 420.464 84.1342C420.464 99.0797 412.287 109.938 400.863 115.047C414.965 119.134 426.389 130.206 426.389 148.407C426.389 174.401 408.424 189.157 374.508 189.157H309.165V47.0674ZM367.161 70.6143H338.364V105.828H367.161C382.874 105.828 390.648 101.123 390.648 88.221C390.648 75.3189 382.898 70.6143 367.161 70.6143ZM371.664 128.139H338.388V165.61H371.664C387.804 165.61 396.573 160.501 396.573 146.981C396.573 133.461 387.78 128.139 371.664 128.139Z" fill="black"/>
    <path d="M504.105 188.906V173.067C496.706 185.04 482.72 190.933 466.873 190.933C447.135 190.933 431.717 180.374 431.717 161.282C431.717 143.416 445.297 133.258 465.226 129.793L502.243 123.5V121.072C502.243 110.112 494.009 105.233 482.291 105.233C469.951 105.233 463.985 110.725 463.173 119.257H435.416C436.443 97.7382 453.722 86.1419 482.314 86.1419C513.771 86.1419 529.403 98.9403 529.403 125.739V188.906H504.105ZM502.267 147.07V142.403L474.51 147.282C463.412 149.12 458.257 152.349 458.257 160.08C458.257 166.774 464.223 171.04 474.51 171.04C487.875 171.04 502.267 162.508 502.267 147.07Z" fill="black"/>
    <path d="M584.748 86.1419C609.198 86.1419 630.195 96.4867 630.597 118.637H603.286C602.672 111.12 595.956 105.229 583.921 105.229C574.131 105.229 567.203 109.282 567.203 115.385C567.203 121.489 571.885 123.303 580.657 124.929L603.688 129.406C622.038 132.847 632.418 142.202 632.418 158.438C632.418 178.137 616.315 190.933 586.569 190.933C556.822 190.933 539.301 177.737 538.284 156.411H566.801C567.605 164.941 574.131 171.846 587.586 171.846C600.023 171.846 605.911 167.18 605.911 161.289C605.911 155.398 601.229 152.971 592.457 151.345L569.426 147.079C551.1 143.639 540.696 134.095 540.696 117.836C540.696 98.3483 558.43 86.1655 584.701 86.1655L584.748 86.1419Z" fill="black"/>
    <path d="M688.897 86.1419C721.451 86.1419 740.761 105.441 740.761 137.913V146.655H663.874C664.488 159.05 673.836 170.62 688.685 170.62C699.473 170.62 708.42 165.342 710.851 156.411H739.321C734.86 178.75 714.699 190.933 688.661 190.933C658.562 190.933 635.97 172.246 635.97 138.549C635.97 107.067 656.508 86.1655 688.85 86.1655L688.897 86.1419ZM712.882 127.969C712.268 114.985 702.093 105.63 689.487 105.63C675.654 105.63 665.691 115.974 664.063 127.969H712.882Z" fill="black"/>
    <path d="M841.036 189.157V159.67H770.955V135.909L835.534 47.0674H868.642V189.157H841.036ZM841.036 77.5762L798.94 136.55H841.036V77.5762Z" fill="black"/>
    <path d="M949.638 159.651H879.298V135.894L944.092 47.0674H977.322V136.535H994.746V159.675H977.322V189.157H949.638V159.651ZM949.638 77.5711L907.387 136.535H949.638V77.5711Z" fill="black"/>
  </svg>
</a>

<!-- Footer logo (18px height) — same SVG with height="18" -->
```

**Logo file:** `assets/images/logo.svg` (git-tracked, canonical)

**Rules:**
- Always use inline SVG — never base64 PNG (corrupts on encoding)
- Never render the logo as plain text
- Minimum height: 18px (footer), recommended: 28-30px (header)
- Do not add filters, tints, or opacity to the logo
- On dark backgrounds, the wordmark text won't be visible — use only on white/light backgrounds, or use the mark-only SVG (first path only, `fill="#FF631F"`)

---

## Header Variants

### Variant A: Pill Header (consumer pages)
Floating pill with rounded corners, logo + login + CTA.

```css
.header {
  position: fixed; top: 20px; left: 20px; right: 20px;
  height: 56px; background: #fff;
  border: 1px solid #e6e6e6; border-radius: 70px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 12px; z-index: 100;
}
```

```html
<header class="header">
  <!-- Inline SVG logo — see Logo section above -->
  <div style="display:flex;align-items:center;gap:8px">
    <button class="btn-login">Log in</button>
    <button class="btn-cta-green">Get Started</button>
  </div>
</header>
```

### Variant B: Full-Width Nav (technical/product pages)
Fixed bar with nav links, logo left, CTA right.

```css
.header {
  position: fixed; top: 0; left: 0; right: 0;
  height: 76px; background: #fff;
  border-bottom: 1px solid #e6e6e6; z-index: 100;
}
.nav-bar {
  max-width: 1920px; margin: 0 auto;
  height: 100%; padding: 0 40px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-links { display: flex; gap: 32px; }
.nav-links a { font-size: 16px; color: #232529; text-decoration: none; }
```

```html
<header class="header">
  <nav class="nav-bar">
    <a href="/"><!-- Inline SVG logo — see Logo section above --></a>
    <div class="nav-links">
      <a href="#">Product</a>
      <a href="#">Use Cases</a>
      <a href="#">Resources</a>
      <a href="#">Pricing</a>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <a href="#" style="font-size:16px;color:#232529;text-decoration:none;padding:10px 14px">Login</a>
      <button class="btn-primary-rect">Start Building</button>
    </div>
  </nav>
</header>
```

---

## Button Styles

### Primary Pill (dark, rounded)
```css
.btn-primary {
  padding: 20px 30px; border-radius: 300px;
  background: #0f0f0f; color: #fff;
  font-family: 'STK Miso', sans-serif; font-weight: 400; font-size: 18px;
  border: none; cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; justify-content: center;
}
```

### Secondary Pill (outline)
```css
.btn-secondary {
  padding: 20px 30px; border-radius: 300px;
  background: transparent; color: #0f0f0f;
  font-family: 'STK Miso', sans-serif; font-weight: 400; font-size: 18px;
  border: 1px solid rgba(15,15,15,0.4);
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; justify-content: center;
}
```

### Primary Rect (dark, square corners)
```css
.btn-primary-rect {
  padding: 10px 24px; border-radius: 8px;
  background: #0f0f0f; color: #fff;
  font-family: 'STK Miso', sans-serif; font-weight: 400; font-size: 16px;
  border: none; cursor: pointer;
}
```

### Green CTA (accent, used in headers)
```css
.btn-cta-green {
  padding: 10px 24px; border-radius: 70px;
  background: #ebffb1; border: 1px solid #ade900;
  font-family: 'STK Miso', sans-serif; font-weight: 400; font-size: 16px;
  color: #000; cursor: pointer;
}
```

### CLI Prompt Button (terminal-style)
```css
.cli-prompt {
  display: flex; align-items: center; justify-content: space-between;
  background: #0f0f0f; border-radius: 300px;
  padding: 17px 24px; min-width: 380px; cursor: pointer;
}
.cli-prompt-dollar {
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 18px; color: #696f7b;
}
.cli-prompt-cmd {
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 18px; color: #fff;
}
.cli-copy-btn {
  font-family: 'STK Miso', sans-serif; font-weight: 400; font-size: 14px;
  color: #fff; background: rgba(255,255,255,0.15);
  border: none; border-radius: 8px; padding: 4px 14px; cursor: pointer;
}
```

```html
<div class="cli-prompt">
  <div style="display:flex;gap:14px">
    <span class="cli-prompt-dollar">$</span>
    <span class="cli-prompt-cmd">npx base44 create</span>
  </div>
  <button class="cli-copy-btn">COPY</button>
</div>
```

---

## Hero Variants

### Variant A: Blue Gradient Hero (consumer/product pages)
Layered radial gradients creating a sky-to-warm transition.

```css
.hero {
  width: 100%; min-height: 940px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 176px 20px 80px;
  background:
    radial-gradient(ellipse 70% 40% at 50% 50%, rgba(250,249,247,0.7) 0%, rgba(250,249,247,0) 100%),
    radial-gradient(ellipse 150% 91% at 50% -17%, rgba(93,179,207,1) 22%, rgba(145,201,220,0.56) 58%, rgba(250,249,247,0) 86%),
    radial-gradient(ellipse 139% 75% at 50% 0%, rgba(143,198,217,1) 0%, rgba(151,216,238,0) 100%),
    linear-gradient(180deg, rgb(34,201,255) 26%, rgb(250,249,247) 24%);
}
```

### Variant B: Dot Grid Hero (technical pages)
Subtle dot pattern with white-to-warm gradient and bottom fade.

```css
.hero {
  padding: 180px 40px 80px;
  background-image: radial-gradient(circle, #ddd 1px, transparent 1px);
  background-size: 24px 24px;
  position: relative;
}
.hero::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 400px;
  background: linear-gradient(to top, #fff, transparent);
  pointer-events: none;
}
```

### Hero Title
```css
.hero-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 74px; line-height: 74px;
  color: #0f0f0f; text-align: center;
}
/* Technical variant: 80px/90px */
```

### Ticker Badge (above hero title)
```css
.ticker {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 24px; border-radius: 60px;
  background: linear-gradient(to left, #ebfad5 18%, #e6fc88 118%);
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 16px; line-height: 28px; color: #0f0f0f;
}
```

---

## Section Headers

### Centered Header (with eyebrow)
```css
.section-header {
  text-align: center; max-width: 869px;
  display: flex; flex-direction: column; gap: 30px; align-items: center;
}
.section-eyebrow {
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 32px; line-height: 34px; color: #232529;
}
.section-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 54px; line-height: 60px; color: #0f0f0f;
}
.section-description {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 20px; line-height: 28px; color: #232529; max-width: 796px;
}
```

### Split Header (title left, description right)
```css
.split-header {
  display: flex; gap: 80px; align-items: flex-start;
  margin-bottom: 80px; padding: 0 80px;
}
.split-header-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 36px; line-height: 34px; color: #0f0f0f; min-width: 365px;
}
.split-header-desc {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 54px; line-height: 60px; color: #0f0f0f;
}
```

---

## Card Patterns

### Numbered Feature Card
White card with number badge, title, description. Used in feature grids.

```css
.card {
  background: #fff; border-radius: 10px; overflow: hidden;
  padding: 24px; min-height: 300px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.card-number {
  width: 40px; height: 30px; border: 1px solid #696f7b;
  border-radius: 11px; display: flex; align-items: center; justify-content: center;
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 16px; color: #696f7b;
}
.card-title {
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 24px; line-height: 24px; color: #0f0f0f;
}
.card-description {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 16px; line-height: 20px; color: #232529;
}
```

### Feature Card (no number, bordered)
```css
.feature-card {
  background: #fff; border: 1px solid #e6e6e6;
  border-radius: 10px; padding: 36px;
  min-height: 250px; display: flex; flex-direction: column;
}
.feature-card-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 24px; line-height: 34px; color: #0f0f0f; margin-bottom: 14px;
}
.feature-card-desc {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 16px; line-height: 24px; color: #232529;
}
```

### Benefit Card (icon + text, horizontal)
```css
.benefit-card {
  background: #faf9f7; border-radius: 10px;
  padding: 20px; display: flex; gap: 33px; align-items: flex-start;
}
.benefit-icon {
  width: 54px; height: 54px; border-radius: 6px;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  /* Use gradient backgrounds from brand.json */
}
.benefit-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 18px; line-height: 24px; color: #0f0f0f;
}
.benefit-description {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 16px; line-height: 20px; color: #232529;
}
```

### Grid Layouts
```css
/* 3-column (features, cards) */
.grid-3 {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
/* 2-column (responsive fallback at 1200px) */
@media (max-width: 1200px) { .grid-3 { grid-template-columns: repeat(2, 1fr); } }
/* 1-column (mobile at 768px) */
@media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
```

---

## Terminal / Code Block

```css
.terminal {
  background: #1a1a1a; border-radius: 12px;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.terminal-dots {
  display: flex; gap: 8px; padding: 16px 20px;
  border-bottom: 1px solid #333;
}
.terminal-dot { width: 12px; height: 12px; border-radius: 50%; background: #3a3a3a; }
.terminal-body {
  padding: 24px 38px 40px;
  font-family: 'STK Miso', sans-serif;
  font-size: 14px; line-height: 20px;
}
```

### Syntax Highlighting Classes
```css
.code .comment  { color: #696f7b; }
.code .keyword  { color: #c792ea; }
.code .type     { color: #82aaff; }
.code .string   { color: #c3e88d; }
.code .accent   { color: #FF983B; }
```

---

## FAQ Accordion

```css
.faq-layout {
  max-width: 1680px; margin: 0 auto;
  display: flex; gap: 80px; align-items: flex-start;
  padding: 0 80px;
}
.faq-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 54px; line-height: 64px; color: #0f0f0f; min-width: 400px;
}
.faq-item { border-bottom: 1px solid #d1d1d1; padding: 46px 0; }
.faq-question {
  display: flex; justify-content: space-between; align-items: flex-start;
  cursor: pointer; gap: 40px;
}
.faq-question-text {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 28px; line-height: 30px; color: #0f0f0f;
}
.faq-toggle {
  width: 40px; height: 40px; flex-shrink: 0;
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s;
}
.faq-item.active .faq-toggle { transform: rotate(45deg); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item.active .faq-answer { max-height: 300px; padding-top: 24px; }
.faq-answer-text {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 18px; line-height: 28px; color: #232529; max-width: 740px;
}
```

```html
<!-- Toggle icon: plus sign that rotates to X -->
<button class="faq-toggle" aria-label="Toggle">
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
    <line x1="8" y1="0" x2="8" y2="16" stroke="#0f0f0f" stroke-width="1.5"/>
    <line x1="0" y1="8" x2="16" y2="8" stroke="#0f0f0f" stroke-width="1.5"/>
  </svg>
</button>
```

```js
function toggleFaq(el) {
  var item = el.closest('.faq-item');
  var wasActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('active'); });
  if (!wasActive) item.classList.add('active');
}
```

---

## CTA Banner

### Sunset Gradient CTA
Warm gradient background with dark card overlay.

```css
.cta-banner {
  max-width: 1460px; margin: 0 auto;
  border-radius: 16px; overflow: hidden;
  min-height: 600px; display: flex;
  align-items: center; justify-content: center;
  background:
    linear-gradient(180deg, rgba(242,237,225,0) 5%, rgba(255,240,222,0.2) 33%, rgba(255,174,83,0.5) 79%, rgb(255,116,56) 99%),
    linear-gradient(180deg, rgb(250,249,247) 4%, rgb(255,240,222) 70%, rgba(239,129,82,0.6) 94%);
}
.cta-card {
  background: rgba(0,0,0,0.85); border-radius: 16px;
  padding: 60px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 40px;
  width: 400px;
}
.cta-card-title {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 48px; line-height: 52px; color: #fff;
}
```

### Simple CTA Banner (centered text on gradient)
```css
.cta-banner-simple {
  max-width: 1460px; margin: 0 auto;
  border-radius: 10px; padding: 90px 0;
  display: flex; flex-direction: column; align-items: center; gap: 21px;
  background: /* use cta_sunset gradient from brand.json */;
}
```

---

## Footer Variants

### Simple Footer (one line)
```css
.footer { padding: 40px 20px; text-align: center; }
.footer-text { font-size: 16px; color: #000; }
```

### Full Footer (logo + columns + social)
```css
.footer { padding: 80px 40px 40px; max-width: 1920px; margin: 0 auto; }
.footer-top { display: flex; gap: 80px; padding: 0 80px; }
.footer-brand { max-width: 360px; }
.footer-menus { display: flex; gap: 60px; flex: 1; }
.footer-menu-title {
  font-weight: 400; font-size: 14px; color: #0f0f0f;
  margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;
}
.footer-menu-links a { font-size: 14px; color: #696f7b; text-decoration: none; }
.footer-divider { border: none; border-top: 1px solid #e6e6e6; margin: 60px 80px 20px; }
.footer-copyright { font-size: 14px; color: #696f7b; padding: 0 80px; }
```

Social icons: X (Twitter), Discord, LinkedIn. Use inline SVGs at 20x20px.

---

## Step/Process Section

Numbered steps with left label + right code block.

```css
.step {
  display: flex; border-top: 1px solid #e6e6e6; padding: 0 80px;
}
.step-left {
  width: 560px; flex-shrink: 0; padding: 60px 0;
  display: flex; flex-direction: column; justify-content: flex-end; gap: 20px;
}
.step-number {
  font-family: 'STK Miso', sans-serif; font-weight: 300;
  font-size: 16px; line-height: 30px; color: #696f7b;
  width: 40px; height: 30px; border: 1px solid #696f7b;
  border-radius: 11px; display: flex; align-items: center; justify-content: center;
}
.step-label {
  font-family: 'STK Miso', sans-serif; font-weight: 400;
  font-size: 28px; line-height: 34px; color: #0f0f0f;
}
.step-code-area {
  width: 520px; flex-shrink: 0;
  background: #1a1a1a; min-height: 160px;
}
```

---

## Checklist

Orange check marks with item text.

```css
.checklist-item { display: flex; align-items: center; gap: 14px; }
.checklist-check { width: 36px; height: 30px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.checklist-text { font-size: 16px; line-height: 24px; color: #232529; }
```

```html
<!-- Orange checkmark SVG -->
<svg viewBox="0 0 11 10" fill="none" width="11" height="10">
  <path d="M1 5.5L4 8.5L10 1.5" stroke="#FF983B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

---

## Responsive Breakpoints

| Breakpoint | Grid | Hero Title | Section Title | Notes |
|------------|------|------------|---------------|-------|
| > 1200px | 3 columns | 74-80px | 54px | Full layout |
| 768-1200px | 2 columns | 74-80px | 40px | Stack split headers |
| < 768px | 1 column | 44px | 32-36px | Stack buttons, hide nav links |

```css
@media (max-width: 1200px) {
  /* Grid: 3col → 2col */
  /* Split headers: stack vertically */
  /* Steps: stack vertically */
  /* Footer: stack vertically */
  /* Side padding: 80px → 20px */
}
@media (max-width: 768px) {
  /* Grid: 2col → 1col */
  /* Hero title: 74px → 44px */
  /* Buttons: full width, stacked */
  /* Nav links: hidden */
  /* CTA card: 90% width */
}
```

---

## Page Templates

### Consumer Landing Page
Header (pill) → Hero (blue gradient + ticker) → Features (numbered cards, warm bg) → Benefits (icon cards + checklist) → CTA (sunset gradient) → Footer (simple)

### Technical Product Page
Header (full nav) → Hero (dot grid + terminal) → Features (bordered cards, split header) → Steps (code walkthrough) → FAQ (accordion) → CTA (sunset + dark card) → Footer (full columns)

---

## React Implementation Notes

Base44 apps are React-based. When generating landing pages for Base44 projects:

### Component Structure
```
src/pages/LandingPage.jsx (or .tsx)
├── components/Header.jsx
├── components/Hero.jsx
├── components/FeatureGrid.jsx
├── components/FeatureCard.jsx
├── components/StepSection.jsx
├── components/FaqAccordion.jsx
├── components/CtaBanner.jsx
└── components/Footer.jsx
```

### Font Loading in React
```jsx
// In index.html or App.jsx global styles
import './fonts.css';

// fonts.css
@font-face {
  font-family: 'STK Miso';
  src: url('/fonts/STKMiso-Light.ttf') format('truetype');
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'STK Miso';
  src: url('/fonts/STKMiso-Regular.ttf') format('truetype');
  font-weight: 400; font-style: normal; font-display: swap;
}
```

### Design Tokens as JS Object
```js
export const tokens = {
  colors: {
    textPrimary: '#0f0f0f',
    textBody: '#232529',
    textSecondary: '#696f7b',
    accent: '#FF983B',
    greenBg: '#ebffb1',
    greenBorder: '#ade900',
    cardBorder: '#e6e6e6',
    terminalBg: '#1a1a1a',
    warmBg: '#faf9f7',
  },
  fonts: {
    primary: "'STK Miso', sans-serif",
  },
  radii: {
    card: '10px',
    pill: '300px',
    rect: '8px',
    ticker: '60px',
    terminal: '12px',
  },
};
```

### FAQ with useState
```jsx
function FaqAccordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${activeIndex === i ? 'active' : ''}`}>
          <div className="faq-question" onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}>
            <span className="faq-question-text">{item.question}</span>
            <button className="faq-toggle" aria-label="Toggle">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <line x1="8" y1="0" x2="8" y2="16" stroke="#0f0f0f" strokeWidth="1.5"/>
                <line x1="0" y1="8" x2="16" y2="8" stroke="#0f0f0f" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
          <div className="faq-answer">
            <p className="faq-answer-text">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### CLI Copy Button with React
```jsx
function CliPrompt({ command = 'npx base44 create' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="cli-prompt" onClick={handleCopy}>
      <div style={{ display: 'flex', gap: '14px' }}>
        <span className="cli-prompt-dollar">$</span>
        <span className="cli-prompt-cmd">{command}</span>
      </div>
      <button className="cli-copy-btn" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
        {copied ? 'COPIED!' : 'COPY'}
      </button>
    </div>
  );
}
```

### Standalone HTML (non-React)
When generating standalone HTML files (not inside a Base44 React app), use the raw HTML/CSS patterns above. Standalone pages are useful for quick prototypes, email-hosted pages, or external platforms.

---

## Usage Notes

- Always load `brand.json` first for exact hex values
- STK Miso font files must be accessible relative to the HTML output
- Logo is always inline SVG (orange half-circle mark + "Base44" wordmark) — never base64 PNG
- Use `#0f0f0f` (not pure `#000`) for text and dark backgrounds
- Card gaps are `10px` (tight), not the typical 16-24px
- Section backgrounds alternate: `#fff` → `#faf9f7` → `#fff`
- The CTA sunset gradient is used on both page types
- Base44 apps are React-based: prefer React components when building inside a Base44 project
