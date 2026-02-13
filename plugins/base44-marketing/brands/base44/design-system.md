# Base44 Design System

> Extracted from Figma source files. Use this instead of Figma when building landing pages.

**Required read:** `brands/base44/brand.json` for exact token values.

---

## Font Setup (Copy into every page `<head>`)

```html
<style>
  @font-face {
    font-family: 'STK Miso';
    src: url('../STKMiso-Light.ttf') format('truetype');
    font-weight: 300; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'STK Miso';
    src: url('../STKMiso-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal; font-display: swap;
  }
</style>
```

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

The Base44 logo is an **orange circle with white horizontal lines** (sunrise/sunset motif) followed by **"Base 44" in bold black text**.

**ALWAYS use `logo.png`** — never recreate the logo as text. When generating landing pages, copy `logo.png` into the output directory.

```html
<!-- Header logo (28-30px height) -->
<a href="https://base44.com"><img src="logo.png" alt="Base44" style="height:30px" /></a>

<!-- Footer logo (18px height, inline) -->
<img src="logo.png" alt="Base44" style="height:18px;vertical-align:middle" />
```

**Logo file locations:**
- Source: `output/logo.png` (repo root)
- Videos: `videos/external-api-video/public/logo.png`

**Rules:**
- Never render the logo as plain text — always use the image file
- Minimum height: 18px (footer), recommended: 28-30px (header)
- Do not add filters, tints, or opacity to the logo
- On dark backgrounds, the logo text won't be visible — use only on white/light backgrounds

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
  <img class="header-logo" src="logo.png" alt="Base44" style="height:30px" />
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
    <a href="/"><img src="logo.png" alt="Base44" style="height:30px" /></a>
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
- Logo is always `logo.png` (orange circle + white lines + "Base 44" text)
- Use `#0f0f0f` (not pure `#000`) for text and dark backgrounds
- Card gaps are `10px` (tight), not the typical 16-24px
- Section backgrounds alternate: `#fff` → `#faf9f7` → `#fff`
- The CTA sunset gradient is used on both page types
- Base44 apps are React-based: prefer React components when building inside a Base44 project
