# Base44 Brand Backgrounds

> Source: Figma Brand Guidelines (node 668:437, "New BGs" section)
> CSS implementations: `design-system.md` > Content Backgrounds section
> Gradient tokens: `brand.json` > gradients > `bg_*` entries

## 6 Official Background Styles

### 1. Warm Grain — `bg_warm_grain` (default for social posts)
- Warm orange/yellow/green gradient blobs with grain texture overlay
- Colors: orange (#FF631F), golden yellow (#FBB439), soft green (#AEFB39), pink (#F0C3EC)
- CSS: `linear-gradient(180deg, #e4e4e4 38%, #e4e4e4 49%, #f0c3ec 52%, #fbb439 59%, #aefb39 66%)`
- Grain: `mix-blend-overlay` noise texture on top, rotated 180deg base with `mix-blend-soft-light`
- Mood: energetic, creative, warm
- **Use for:** LinkedIn posts, X cards, general social content

### 2. Amber Glow — `bg_amber_glow` (feature announcements)
- Rich orange/amber gradient with grain texture
- Colors: deep orange (#FF5500), amber (#EEA247), golden (#F0B953), cream (#F6F6F6)
- CSS base: `#ff5500` with overlay `linear-gradient(180deg, #f6f6f6 11%, #dadee8 45%, #eea247 92%, #f0b953 108%)`
- Blend: `mix-blend-screen` gradient over solid orange
- Rounded corners (46px at full scale)
- **Use for:** Feature launches, product announcements, hero visuals

### 3. Peach Lavender — `bg_peach_lavender` (soft gradient)
- Smooth gradient: warm peach top, lavender/purple middle, orange bottom
- Colors: orange (#FF5500), peach (#FFC494), off-white (#F5F5F4), lavender undertones
- CSS: `linear-gradient(0deg, #FF5500 12%, #FFC494 8%, #F5F5F4 66%)`
- Subtle blurred texture underneath
- **Use for:** Strategic content, thought leadership, educational posts

### 4. Hot Orange — `bg_hot_orange` (bold energy)
- Heavily blurred abstract shapes in orange/red tones
- Background base: #EDE8E4 (warm gray)
- CSS: layered radial gradients with `filter: blur(200px)`
- Colors: red-orange (#E04010), orange (#F08040), amber (#FFB060)
- **Use for:** Bold announcements, high-energy content, ad backgrounds, CTAs

### 5. Pink Dream — `bg_pink_dream` (creative/playful)
- Soft pastel: purple, pink, yellow, light blue
- Background base: #EDE8E4 with abstract map-like base image
- CSS overlay: `linear-gradient(-90deg, rgba(251,180,57,0.3) 47%, rgba(242,255,124,0.3) 86%)`
- Blend: `mix-blend-saturation`
- Rounded corners (58px at full scale)
- **Use for:** Community content, creative showcases, casual posts, events

### 6. Ocean Wave — `bg_ocean_wave` (calm/professional)
- Cool blue and teal abstract waves
- Colors: deep blue (#2020FF), sky blue (#40A0D0), teal (#60C0D0), light (#C0E0F0)
- CSS: layered radial gradients creating wave-like motion
- **Use for:** Data insights, analytics visuals, professional content, trust-building posts

## Quick Selection Guide

| Content Type | Background | Why |
|-------------|-----------|-----|
| Feature launch social post | `bg_amber_glow` | Bold, on-brand, eye-catching |
| LinkedIn thought leadership | `bg_peach_lavender` | Professional, calm, editorial |
| X announcement | `bg_warm_grain` | Textured, unique, brand default |
| CTA / urgency | `bg_hot_orange` | High energy, grabs attention |
| Community / Discord | `bg_pink_dream` | Approachable, fun, inviting |
| Data / metrics visual | `bg_ocean_wave` | Cool contrast, readable |
| Video thumbnail | `bg_warm_grain` or `bg_amber_glow` | Thumbnail-friendly, bold |
| Ad creative | `bg_hot_orange` or `bg_amber_glow` | Conversion-optimized, bold |

## Brand Color Palette (for text overlays and frames)

| Name | Hex | RGB | Use |
|------|-----|-----|-----|
| Primary Orange | #FF631F | 255, 99, 31 | Logo, strong accents, CTA |
| Accent Orange | #FF983B | 255, 152, 59 | Buttons, highlights, send icons |
| Peach | #FFBE8D | 255, 190, 141 | Soft backgrounds, secondary accents |
| Green Accent | #E6FC88 | 230, 252, 136 | CTA buttons, badges, highlights |
| Light Green | #EBFAD5 | 235, 250, 213 | Soft backgrounds, cards |
| Cream | #FAF3E9 | 250, 243, 233 | Warm backgrounds, text areas |
| Sky Blue | #7CBFD5 | 124, 191, 213 | Professional accents, links |
| Light Blue | #BFD7E0 | 191, 215, 224 | Subtle backgrounds, borders |
| Black | #0F0F0F | 15, 15, 15 | Text, dark backgrounds |
| White | #FFFFFF | 255, 255, 255 | Text on dark, surfaces |

## Logo Placement Rules

- **Colored logo** (#FF631F orange mark + black text): Use on light/white backgrounds
- **Black logo**: Use on light backgrounds with no orange elements nearby
- **White logo**: Use on dark or busy backgrounds
- Minimum height: 18px (footer), recommended: 28-30px (header)
- Position: top-left or bottom-left for social creatives
- Margin: 40px from edges at 1080px scale

## Typography on Creatives

- Font: STK Miso (Regular 400 for headlines, Light 300 for body)
- Headline on dark bg: white (#FFFFFF)
- Headline on light bg: near-black (#0F0F0F)
- Subtext: #232529 (body) or #696F7B (secondary)
- No serif fonts, no system fonts on brand creatives
