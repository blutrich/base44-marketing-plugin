# Paid Ads Design Guidelines

> Extracted from Figma Brand Guidelines (Paid Ads section) and Gift Cards file.

## Ad Layout Formula

Every Base44 ad follows the same vertical structure:

```
┌─────────────────────────┐
│     Base44 Logo          │  Top center, always white on color / orange on light
│     (icon + wordmark)    │
│                          │
│   HEADLINE TEXT          │  Large, centered, 2-4 words per line
│   (2 lines max)          │  White on gradient/blue, dark on light bg
│                          │
│                          │
│   ┌─────┐ ┌─────┐       │  Product screenshots in bottom 50%
│   │ App │ │ App │        │  Fanned layout, overlapping, with depth
│   │ Mock│ │ Mock│        │  Always show REAL app interfaces
│   └─────┘ └─────┘       │
│                          │
└─────────────────────────┘
```

**Key rule:** Logo top, headline upper third, product visuals bottom half. No exceptions.

## Color Themes (5 palettes)

### 1. Sunrise Gradient (primary)
- Background: Radial gradient from deep red-orange (#FF4500) bottom-left to warm peach (#F0A070) top-right
- Grainy texture overlay at 80% opacity, mix-blend-mode: overlay
- Text: White
- Logo: White
- Use for: "Turn your ideas into apps" messaging, general awareness

### 2. Ocean Blue (secondary)
- Background: Rich blue (#0077CC) to light sky blue (#87CEEB) gradient, top to bottom
- Subtle radial glow from top center
- Text: White
- Logo: Orange icon (#FF6B35) + white wordmark
- Use for: "Build apps for iOS and Android", "Build & publish on app store", "Turn your ideas into apps"

### 3. Sky Mist (websites)
- Background: Very light blue-green tint (#E8F4F8 to #F0F8FF), almost white
- Soft gradient, minimal texture
- Text: Dark (#1A1A1A)
- Logo: Orange icon + dark wordmark
- Use for: "Build websites in minutes" messaging

### 4. Warm Sand (neutral)
- Background: Light warm beige (#F5F0EB) to soft peach
- Subtle texture
- Text: Dark (#1A1A1A)
- Logo: Orange icon + dark wordmark
- Use for: "Vibe code your next app", developer-oriented messaging

### 5. Gift Card Orange
- Background: Radial gradient, warm orange (#FF7A1F) center to peach (#EDCBC2) edges
- Layered translucent ellipses creating depth (4 concentric shapes)
- Grainy texture overlay (mix-blend-overlay, 80% opacity)
- Text: White, large number with gradient fill (orange to white, -73deg)
- Use for: Gift cards, promotional credits

## Typography

**STK Miso is the ONLY brand font. Use it everywhere.**

- **Headline font:** STK Miso Regular (400)
- **Headline size:** Very large, fills ~30-40% of ad width
- **Line height:** Tight (0.95-1.0)
- **Max lines:** 2 (break naturally at 2-4 words per line)
- **Body / labels:** STK Miso Light (300)
- **Gift card numbers:** STK Miso Regular (400) with gradient text fill
- **Gift card labels / codes:** STK Miso Light (300)

> Note: The Figma source files use Wix Madefor Display, Wix Madefor Text, and Inter in some ad variants. These are NOT brand-approved. Always substitute STK Miso when generating ads.

## Approved Headlines

### App Building (Sunrise or Ocean)
- "Turn your ideas into apps"
- "Build apps for iOS and Android"
- "Build & publish on app store"

### Website Building (Sky Mist or Ocean)
- "Build websites in minutes"

### Developer / Vibe Coding (Warm Sand)
- "Vibe code your next app"

### Education (Sunrise)
- "AI websites builder" (with "Learning opportunities" sub-context)

## Product Screenshots

### Mobile App Showcase (5-fan layout)
- 4-5 phone mockups fanned horizontally
- Center phone is largest and frontmost
- Outer phones are slightly rotated and behind
- Show DIVERSE app types: real estate, finance, meditation, education, streaming
- Apps must look polished and real, not wireframes

### Desktop Dashboard (single laptop)
- Angled laptop mockup showing dark-themed Base44 dashboard
- Dashboard shows: sidebar nav, stats cards, charts, team data
- Laptop sits on a clean surface with subtle shadow
- Positioned in bottom half, slightly below center

### Chat/Builder UI (task management)
- Shows the Base44 chat interface with a prompt being typed
- "Build a task management app" visible in input
- Background shows the resulting app (task list with dates, statuses)
- Positioned bottom-center with slight overlap

### Website Stack (layered browsers)
- 4-5 browser windows stacked with slight offset
- Each shows a different website/app built with Base44
- Top window is largest and most visible
- Creates depth with subtle shadows between layers

### Card Collage (vibe coding)
- Scattered UI cards at various angles
- Shows diverse micro-apps: weather, maps, trip generator, altitude tracker
- More chaotic/creative layout suggesting variety
- Cards have rounded corners and subtle shadows

## Format Specs

| Platform | Ratio | Dimensions | Headlines per Ad |
|----------|-------|------------|------------------|
| Meta Feed | 4:5 | 1080 x 1350 | 1 headline, 2 lines max |
| Meta Story | 9:16 | 1080 x 1920 | 1 headline, 2 lines max |
| LinkedIn | 1:1 | 1200 x 1200 | 1 headline, 2 lines max |
| Reddit | 1:1 | 1200 x 1200 | 1 headline, 2 lines max |

## Gift Card Design

### Layout
```
┌──────────────────────────────────┐
│ [Base44 Logo]        [GIFT CARD] │  Logo left, badge top-right
│                                  │  Badge: white border, rounded, uppercase
│                                  │
│  165                             │  Large number, gradient text fill
│  message credits                 │  (orange > white, diagonal)
│                                  │
│                   Gift-XXXX-XXXX │  Code + domain bottom-right
│                   base44.com     │
└──────────────────────────────────┘
```

### Specs
- Size: 450 x 265 (credit card ratio ~1.7:1)
- Corner radius: 13px
- Background: Sunrise gradient with 4 concentric ellipses
- Texture: Grainy overlay, rotated 15deg, mix-blend-mode: overlay, opacity 80%
- Number font: STK Miso Regular (400), ~88px
- Number fill: Linear gradient -73deg, orange (#EF9A42) 24% to white (#FFFFFF) 64%
- Label font: STK Miso Light (300), ~14.5px, white
- Badge: Rounded rect, white 1.3px border, 8px radius, STK Miso Regular uppercase
- Code text: STK Miso Light (300), ~14.5px, white

## Visual DON'Ts

### Layout Violations
- Never place headline below product screenshots
- Never show more than 2 lines of headline text
- Never add CTAs or buttons inside the ad creative itself (platform handles CTAs)
- Never crop the Base44 logo
- **Never stack multiple sections.** No "hero area + info box + CTA + testimonial + footer URL." An ad has ONE visual surface with logo, headline, and product visual. That's it.
- **Never add dark panels (black/dark green boxes) on top of colored gradient backgrounds.** This creates a jarring "two designs glued together" look. One background, one surface.
- **Never put bullet-point feature lists inside the ad image.** Feature lists belong in the platform's primary text field, not the creative.
- **Never include a testimonial section inside the ad image.** Testimonials go in the primary text below the image.

### Content Violations
- **Max 15 words on the creative.** Headline (2 lines) + optional subtext (1 line). Everything else goes in the primary text field the platform provides.
- **Never use negative framing.** No "Stop checking 6 apps", "I used to waste 2 hours", "Don't get left behind." Lead with the positive outcome.
- **Never use "Before/After" as the main ad structure.** The "before" column adds negativity and doubles the text. Show only the "after" state.

### Visual Quality
- Never use generic stock photos instead of real app mockups (unless lifestyle photo per nano-banana prompt rules)
- Never use dark backgrounds with dark text
- Never use flat/boring single-color backgrounds. Always use gradients with depth.
- Never show wireframes or low-fidelity mockups. Apps must look production-ready.
- **Never use chat/app mockups smaller than 50% of the ad area.** If the mockup is a tiny inset surrounded by text, it's unreadable at feed size. Make the mockup the hero or cut it.
- **Never use abstract node/connection diagrams.** Circles connected by lines explaining "how it works" belong in documentation, not ads.
- **Never mix photography with UI mockups in the same ad.** Pick one: lifestyle photo OR product screenshot. Not both.

## Figma Source

- Paid Ads: `figma.com/design/c3im4ur1uIrW1ANNlvE2MM` node `2617:858`
- Gift Cards: `figma.com/design/i1EJkgLfj6qaeVOlWDUq6g` node `5870:3384`
