# Asset Embedding Strategy

> How to handle fonts, logo, and images in self-contained HTML landing pages.

## Logo (MANDATORY -- RULES.md ALWAYS #10)

**Source:** `output/logo.png` (repo root)

**Strategy:** Read the file and convert to base64, then embed as a data URI.

```bash
# Generate base64 string
base64 -i output/logo.png
```

**Usage in HTML:**
```html
<!-- Header logo (30px height) -->
<img src="data:image/png;base64,{ENCODED_LOGO}" alt="Base44" style="height:30px" />

<!-- Footer logo (24px height) -->
<img src="data:image/png;base64,{ENCODED_LOGO}" alt="Base44" style="height:24px" />
```

**NEVER render the logo as plain text.** This is a hard rule (RULES.md ALWAYS #10).

---

## Fonts (STK Miso)

**Source files:**
- `STKMiso-Light.ttf` (weight 300 -- body text)
- `STKMiso-Regular.ttf` (weight 400 -- headings, buttons)

**Strategy:** Convert TTF files to base64 and embed in `@font-face` declarations.

```bash
# Generate base64 for each font file
base64 -i STKMiso-Light.ttf | tr -d '\n'
base64 -i STKMiso-Regular.ttf | tr -d '\n'
```

**Embed in CSS:**
```css
@font-face {
  font-family: 'STK Miso';
  src: url('data:font/truetype;base64,{ENCODED_LIGHT}') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'STK Miso';
  src: url('data:font/truetype;base64,{ENCODED_REGULAR}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**Expected sizes:** ~50-80KB per font file. Total base64 overhead: ~140-220KB. Acceptable for landing pages (single load, no navigation).

---

## Alternative: Copy Assets to Dist

If base64 makes the HTML too large (over 500KB total), use file references instead:

```bash
# Copy assets alongside index.html
cp output/logo.png dist/logo.png
cp STKMiso-Light.ttf dist/fonts/STKMiso-Light.ttf
cp STKMiso-Regular.ttf dist/fonts/STKMiso-Regular.ttf
```

**Use relative paths in HTML/CSS:**
```html
<img src="logo.png" alt="Base44" style="height:30px" />
```

```css
@font-face {
  font-family: 'STK Miso';
  src: url('./fonts/STKMiso-Light.ttf') format('truetype');
  font-weight: 300; font-style: normal; font-display: swap;
}
```

This still works with `npx base44 site deploy` -- all files in `dist/` are uploaded.

---

## Hero Images

- **If the user provides an image:** copy to `dist/` and reference with `<img src="{filename}">`
- **If no image provided:** use CSS gradient backgrounds from design-system.md (blue gradient or dot grid)
- **NEVER auto-generate images.** Suggest the nano-banana skill if the user wants AI-generated visuals

---

## SVG Icons

Inline SVGs directly in the HTML. Key icons from design-system.md:

**Orange checkmark:**
```html
<svg viewBox="0 0 11 10" fill="none" width="11" height="10">
  <path d="M1 5.5L4 8.5L10 1.5" stroke="#FF983B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**FAQ toggle (plus sign):**
```html
<svg viewBox="0 0 16 16" fill="none" width="16" height="16">
  <line x1="8" y1="0" x2="8" y2="16" stroke="#0f0f0f" stroke-width="1.5"/>
  <line x1="0" y1="8" x2="16" y2="8" stroke="#0f0f0f" stroke-width="1.5"/>
</svg>
```

**Social icons (X, Discord, LinkedIn):** Use inline SVGs at 20x20px from design-system.md.

---

## Decision Matrix

| Asset | Size | Embed Strategy |
|-------|------|----------------|
| Logo (PNG) | ~5-15KB | Base64 data URI (always) |
| STK Miso Light (TTF) | ~50-80KB | Base64 @font-face |
| STK Miso Regular (TTF) | ~50-80KB | Base64 @font-face |
| SVG icons | <1KB each | Inline in HTML |
| Hero image (if provided) | Varies | Copy to dist/, relative path |
| Total inline budget | ~300KB max | Switch to file refs if exceeded |

---

## Finding Font Files

Check these locations in order:
1. Repo root: `STKMiso-Light.ttf`, `STKMiso-Regular.ttf`
2. Assets dir: `assets/fonts/STKMiso-Light.ttf`
3. Output dir: `output/fonts/`

If font files are not found, fall back to system fonts:
```css
font-family: 'STK Miso', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
