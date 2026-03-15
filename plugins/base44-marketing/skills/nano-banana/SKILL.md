---
name: nano-banana
description: Generate branded social creatives using Google's Imagen 3 + Base44 brand composite templates. Use when the user wants to create product mockups, social media visuals, blog hero images, carousel graphics, ad creatives, or any branded marketing imagery. Triggers on requests like "generate an image", "create a visual", "make a creative", "social graphic", "branded image", or any image generation request for marketing content.
---

# Nano Banana - Branded Social Creative System

Generate on-brand social creatives: AI photo generation + branded composite templates with correct colors, fonts, logo, and backgrounds.

## The Problem We Solve

AI-generated images ignore brand colors. Imagen 3 can't reliably render #FF631F orange or STK Miso font. So we split the work:

1. **Imagen 3** generates the base photo/illustration
2. **`composite_social.py`** composites it into a branded template with logo, typography, colors, and backgrounds

## Setup

```bash
export GOOGLE_API_KEY="your-api-key"
pip install google-genai Pillow cairosvg
```

## Quick Start

```bash
# Full branded social creative (photo + brand frame)
python3 scripts/generate_image.py "Person building app on phone, coffee shop" --style photo -o base-photo.png
python3 scripts/composite_social.py linkedin-post base-photo.png \
  --headline "She built her SaaS over lunch" \
  --subtext "No code. No investors. Just Base44." \
  -o creative-linkedin.png

# Branded background only (no photo, text on brand gradient)
python3 scripts/composite_social.py text-card \
  --headline "700 apps launched this week" \
  --subtext "Here's what they built" \
  --bg warm-grain \
  -o creative-stats.png
```

## Brand Reference (MANDATORY — Principle 6)

**ALWAYS read before generating any creative:**
- `references/brand-backgrounds.md` - 6 official background styles, full color palette, logo rules, typography
- `brands/base44/brand.json` - Design tokens (colors, fonts, spacing, gradients)
- `brands/base44/design-system.md` - Component library, CSS implementations

**USE THE DESIGN SYSTEM. NEVER INVENT.**
- Font: STK Miso only (Light 300 + Regular 400). No Arial, Inter, system fonts.
- Backgrounds: `bg_*` gradient tokens only. No black backgrounds (Principle 6). No invented gradients.
- Colors: brand palette from `brand.json` only. No random hex values.
- Logo: inline SVG from `design-system.md`. Never text, never PNG.
- Dimensions: 1080x1080 (social square), 1200x627 (LinkedIn), 1600x900 (X), 1080x1920 (story).
- If it's not in the design system, it doesn't exist. Don't create it.

### Brand Colors (from Figma Brand Guidelines)

| Name | Hex | Use |
|------|-----|-----|
| Primary Orange | #FF631F | Logo, strong accents |
| Accent Orange | #FF983B | Highlights, send icons |
| Peach | #FFBE8D | Soft accents |
| Green Accent | #E6FC88 | CTA buttons, badges |
| Light Green | #EBFAD5 | Soft backgrounds |
| Cream | #FAF3E9 | Warm backgrounds |
| Sky Blue | #7CBFD5 | Professional accents |
| Light Blue | #BFD7E0 | Subtle backgrounds |
| Black | #0F0F0F | Text, dark surfaces |

### Logo

The Base44 logo is an **orange half-circle mark** (sunrise) + **"Base44" wordmark**.
- Use the inline SVG from `brands/base44/design-system.md` (Logo section)
- Colored variant: orange mark (#FF631F) + black text
- White variant: all white (for dark/busy backgrounds)
- Render via `cairosvg` at target resolution

### Font

**STK Miso** only. Regular (400) for headlines, Light (300) for body.
- Font files: `assets/fonts/STKMiso-Light.ttf`, `assets/fonts/STKMiso-Regular.ttf`
- Fallback path: `~/Library/Fonts/STKMiso-*.ttf`

## Image Generation

```bash
python3 scripts/generate_image.py "prompt" [options]

Options:
  -o, --output    Output filename
  --size          square | portrait | landscape | wide
  --style         photo | illustration | minimal | 3d
  --brand         Brand name (e.g., "base44")
```

### Lifestyle Photo Prompts (proven to work)

```bash
# Train moment
"Young professional on train using smartphone, morning light, editorial photography"

# Coffee shop builder
"Creative professional in coffee shop building app on phone, ambient lighting"

# Couch builder
"Person relaxed on couch using phone, cozy living room, warm natural lighting"

# Late night
"Person in bed at night using smartphone, soft phone glow, intimate moment"
```

### Prompt Rules

1. Never mention brand names, logos, or UI elements in Imagen prompts (it can't render them)
2. Focus on the **scene** and **mood**, not the app screen
3. Always add: "ultra high resolution, 4K, sharp focus"
4. For lifestyle: "editorial photography, natural lighting"

## Social Creative Templates

### `composite_social.py` Templates

| Template | Size | Use Case |
|----------|------|----------|
| `linkedin-post` | 1200x627 | LinkedIn feed post image |
| `linkedin-square` | 1080x1080 | LinkedIn carousel slide / square post |
| `x-card` | 1200x675 | X/Twitter card image |
| `x-square` | 1080x1080 | X square image |
| `story` | 1080x1920 | Instagram/WhatsApp story |
| `ad-square` | 1080x1080 | Paid ad creative (Meta, LinkedIn) |
| `ad-landscape` | 1200x628 | Landscape ad creative |
| `text-card` | 1080x1080 | Text-only card (no photo, brand bg) |
| `discord-banner` | 960x540 | Discord announcement banner |
| `hero` | 1920x1080 | Blog/landing page hero |

### Template Anatomy

Every template composites these layers (bottom to top):

```
1. BACKGROUND     Brand gradient or solid color (from brand-backgrounds.md)
2. PHOTO          AI-generated image (positioned per template)
3. GRADIENT FADE  Soft gradient over photo for text readability
4. LOGO           Base44 logo (colored or white, positioned per template)
5. HEADLINE       Main text in STK Miso Regular
6. SUBTEXT        Supporting text in STK Miso Light
7. CTA            Optional call-to-action button or link
8. GRAIN          Optional grain texture overlay (mix-blend-overlay)
```

### Background Options (`--bg`)

| Name | Description | Best For |
|------|-------------|----------|
| `warm-grain` | Orange/yellow/green gradient blobs + grain | General social, default |
| `orange-sunset` | Rich orange gradient + grain | Feature launches |
| `plan-mode` | Peach to lavender smooth gradient | Thought leadership |
| `bold-orange` | Blurred deep orange abstract | High-energy announcements |
| `pastel` | Purple/pink/yellow soft abstract | Community, creative |
| `blue-waves` | Cool blue/teal abstract | Professional, data |
| `white` | Clean white | Minimal, product shots |
| `black` | Near-black (#0F0F0F) | Dark mode, bold text |
| `cream` | Warm cream (#FAF3E9) | Soft, approachable |

## Usage Examples

### LinkedIn Post (photo + branded frame)

```bash
# 1. Generate lifestyle photo
python3 scripts/generate_image.py \
  "Young woman on train building app on phone, morning golden light, editorial" \
  --style photo --size landscape -o train-photo.png

# 2. Composite into branded LinkedIn post
python3 scripts/composite_social.py linkedin-post train-photo.png \
  --headline "She built her SaaS on the morning commute" \
  --subtext "No code. No investors. Just Base44." \
  --logo colored --logo-position top-left \
  -o creative-linkedin-post.png
```

### Text Card (no photo, branded background)

```bash
python3 scripts/composite_social.py text-card \
  --headline "700 apps launched this week" \
  --subtext "Here's what builders are creating" \
  --bg warm-grain \
  --logo colored --logo-position top-left \
  -o creative-stats-card.png
```

### X Card

```bash
python3 scripts/composite_social.py x-card photo.png \
  --headline "What if your next idea was live by Friday?" \
  --logo white --logo-position bottom-right \
  --bg-tint orange \
  -o creative-x-card.png
```

### Ad Creative (square)

```bash
python3 scripts/composite_social.py ad-square photo.png \
  --headline "Build your app in minutes" \
  --cta "Start Building" \
  --bg cream \
  --logo colored --logo-position top-left \
  -o creative-ad-square.png
```

### Chat Overlay (prompt bar style)

```bash
python3 scripts/add_text_overlay.py chat photo.png \
  --headline "This year I will" \
  --input "Build my app from bed" \
  --logo top-left \
  -o creative-chat.png
```

> **Important:** The input box auto-sizes to fit the text. Long text is truncated with ellipsis. Keep input text short (5-7 words) for best visual results. Use Figma product screenshots or brand backgrounds as the base image — not generic stock photos (Principle 6).

## Full Workflow (Agent-Driven)

**Start with the brand system, not the design.** Every creative made before reading brand rules was wrong. Follow this order exactly.

### Step 1: Load Brand System (BEFORE anything else)

```
Read(file_path="brands/base44/brand.json")           # Colors, fonts, gradients, spacing
Read(file_path="references/brand-backgrounds.md")     # 6 official backgrounds, logo rules
Read(file_path="brands/base44/design-system.md")      # Components, logo SVG
```

Do not sketch, prompt, or generate until you've read all three. This is not optional.

### Step 2: Gather Real Assets (NEVER generate what already exists)

```
# Check for real Figma product screenshots first
ls output/launch/{slug}/figma-assets/

# If a launch waterfall exists, use its Figma assets
# If the user shares a Figma URL, use get_screenshot to capture real UI
# If there's a live product page, screenshot it
```

**Real product screenshots > AI-generated mockups. Always.** AI-generated UI looks like AI-generated UI. If Figma assets exist, use them. If the feature is live, screenshot it. Only use Imagen 3 for lifestyle photos (person on phone, coffee shop scene) where no real asset exists.

### Step 3: Choose Template + Background

Based on platform and content type, pick from `composite_social.py` templates and `--bg` options. Use the Background Selection Guide (see below).

### Step 4: Apply Approved Messaging

If this is a launch waterfall, text MUST come from the Messaging Framework:
```
Read(file_path="output/launch/{slug}/phase-3-messaging-framework.md")
```

**Positive framing only.** Lead with what the builder gets, never with what competitors lack. "Your apps now build your reputation" not "No app builder has public profiles."

### Step 5: Generate + Composite

```bash
# For lifestyle photos (where no real asset exists):
python3 scripts/generate_image.py "{prompt}" --style photo -o base-photo.png

# Composite into branded creative:
python3 scripts/composite_social.py {template} {base-image}.png \
  --headline "{from Messaging Framework}" \
  --subtext "{from Messaging Framework}" \
  --bg {brand background} \
  --logo colored --logo-position top-left \
  -o creative-{channel}.png
```

### Step 6: Review

- [ ] Logo visible and correctly positioned
- [ ] STK Miso font (no system fonts)
- [ ] Colors from brand palette only
- [ ] Background is official bg_* token
- [ ] Text readable, sufficient contrast
- [ ] Correct dimensions for platform
- [ ] No competitor names
- [ ] Messaging traces to framework (not invented)
- [ ] Product screenshot is real (not AI mockup) if showing UI

### Naming Convention

```
creative-{platform}-{format}.png
creative-linkedin-post.png
creative-x-card.png
creative-ad-square-v2.png
creative-story-profiles.png
```

## Brand Compliance Checklist

Before delivering any creative:

- [ ] Uses STK Miso font (not system fonts)
- [ ] Logo is present and correctly positioned
- [ ] Colors are from the brand palette (not random)
- [ ] Background uses an official brand style (not generic gradients)
- [ ] Text has sufficient contrast for readability
- [ ] No competitor logos, names, or brand elements
- [ ] Image is at correct dimensions for the target platform
- [ ] Grain texture applied if using gradient backgrounds

## Figma-to-Creative Workflow (Pixel-Perfect)

When a Figma URL is shared as a creative reference:

1. **Fetch the design**: Use `get_design_context` with the nodeId and fileKey
2. **Extract brand elements**: Colors, gradients, backgrounds, typography, layout
3. **Match the template**: Pick the closest `composite_social.py` template and `--bg` style
4. **Generate the photo**: Use `generate_image.py` if the Figma design includes a photo placeholder
5. **Composite**: Run `composite_social.py` matching the Figma layout as closely as possible
6. **Compare**: Screenshot the output and verify against the Figma screenshot

### Background Style Mapping (Figma to composite_social.py)

| Figma Frame | `--bg` Flag | Description |
|-------------|-------------|-------------|
| Frame 668:432 (warm grain) | `warm-grain` | Orange/yellow/green gradient + grain |
| Frame 1933:1820 (orange sunset) | `orange-sunset` | Rich orange gradient + grain |
| Frame 1395:13 (plan mode) | `plan-mode` | Peach to lavender smooth gradient |
| Frame 2703:6 (blurred orange) | `bold-orange` | Deep orange abstract blur |
| Frame 2722:1729 (pastel map) | `pastel` | Purple/pink/yellow soft abstract |
| Frame 2813:24 (blue waves) | `blue-waves` | Cool blue/teal waves |

### Pixel-Perfect Checklist

- [ ] Background gradient direction matches Figma
- [ ] Text position matches (top/center/bottom, left/center alignment)
- [ ] Logo variant matches (colored on light, white on dark)
- [ ] Logo position matches (usually top-left)
- [ ] Font size proportional to canvas size
- [ ] Color values are exact hex from brand palette (not approximations)
- [ ] Grain overlay present if Figma shows texture
- [ ] Corner radius matches (0 for full-bleed, 10-16px for cards, 46-58px for featured)

## Fallback

If GOOGLE_API_KEY is not set, inform the user and suggest:
1. Providing their API key
2. Using stock photos as the base image
3. Using text-card templates (no photo needed)

## API Reference

See `references/api_reference.md` for Gemini API docs.
See `references/brand-backgrounds.md` for full brand visual reference (colors, backgrounds, logo rules, typography).
