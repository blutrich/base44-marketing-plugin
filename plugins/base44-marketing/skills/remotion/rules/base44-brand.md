# Base44 Brand System for Remotion Videos

> Apply Base44's complete brand identity to all video content. This ensures visual consistency, voice alignment, and on-brand messaging.

---

## Brand Files Reference

**Primary brand sources (located in `brands/base44/`):**
- `brand.json` - Colors, fonts, gradients, shadows
- `tone-of-voice.md` - Voice guidelines, vocabulary, anti-patterns
- `brand-system.md` - Mission, positioning, personality
- `AGENTS.md` - Compressed brand reference for quick context

**ALWAYS read these files before creating Base44 video content.**

---

## Color Palette

### Primary Colors

```css
/* Background gradients */
--background: #E8F4F8;           /* Light blue */
--background-alt: #FDF5F0;       /* Cream */

/* Text colors */
--text: #000000;                 /* Black */
--text-secondary: #666666;       /* Gray */

/* Accent colors (warm orange) */
--accent: #FF983B;               /* Primary orange */
--accent-light: #FFE9DF;         /* Light orange */
--accent-medium: #FFBFA1;        /* Medium orange */
--accent-dark: #EA6020;          /* Dark orange */
--accent-darkest: #C94001;       /* Darkest orange */

/* UI elements */
--card-bg: #FFFFFF;              /* White cards */
--card-bg-alt: #f9f9f9;          /* Alt card background */
--code-bg: #f5f5f5;              /* Code blocks */
--button-bg: #000000;            /* Black buttons */
--button-text: #FFFFFF;          /* White button text */
```

### Gradient (Primary Background)

```typescript
// Linear gradient for backgrounds
const brandGradient = {
  type: "linear-gradient",
  direction: "180deg",
  stops: ["#E8F4F8", "#FDF5F0"]
};

// CSS implementation
background: linear-gradient(180deg, #E8F4F8 0%, #FDF5F0 100%);
```

### Color Usage Guidelines

| Element | Color | When to Use |
|---------|-------|-------------|
| **Background** | Light gradient (#E8F4F8 to #FDF5F0) | Full-screen backgrounds, main canvas |
| **Accent/CTA** | Orange (#FF983B) | Buttons, key highlights, calls-to-action |
| **Text (primary)** | Black (#000000) | Headings, body text, most text content |
| **Text (secondary)** | Gray (#666666) | Supporting text, captions, metadata |
| **Cards** | White (#FFFFFF) | Content cards, overlays, callouts |

---

## Typography

### Font Families

**STKMiso is the primary heading font.** Font files are available in the project:
- `STKMiso-Light.ttf` (weight: 300)
- `STKMiso-Regular.ttf` (weight: 400) - **RECOMMENDED**

```typescript
// Remotion font loading - CORRECT PATTERN
import { loadFont } from "@remotion/fonts";
import { loadFont as loadGoogleFont } from "@remotion/google-fonts/Inter";
import { staticFile, delayRender, continueRender } from "remotion";

// Load Google Font (Inter for body text)
const { fontFamily: interFont } = loadGoogleFont();

// Load local STKMiso font (RECOMMENDED for headings)
const waitForFont = delayRender();
loadFont({
  family: "STKMiso",
  url: staticFile("STKMiso-Regular.ttf"),
  weight: "400",
}).then(() => {
  continueRender(waitForFont);
});

// Font stacks
const headingFont = "STKMiso, Inter, sans-serif";  // Use for headings
const bodyFont = "Inter, Arial, sans-serif";       // Use for body text
const codeFont = "Courier New, monospace";         // Use for code
```

### Font Usage Guidelines

| Element | Font Stack | Weight | Notes |
|---------|------------|--------|-------|
| **Headings** | `STKMiso, Inter, sans-serif` | 400 | STKMiso works best at normal weight |
| **Body text** | `Inter, Arial, sans-serif` | 400-700 | Google Font, auto-loaded |
| **Code/mono** | `Courier New, monospace` | 400 | System font, no loading needed |

### Font Loading Example

```typescript
// Complete font loading setup for Remotion
import { loadFont } from "@remotion/fonts";
import { loadFont as loadGoogleFont } from "@remotion/google-fonts/Inter";

// Call at composition start (e.g., in Root.tsx)
export const loadFonts = async () => {
  // Load Inter (body text)
  loadInter();

  // Load STKMiso (headings) - font files in public folder
  const waitForFont = delayRender();
  await loadFont({
    family: "STKMiso",
    url: staticFile("STKMiso-Regular.ttf"),
    weight: "400",
  });
  continueRender(waitForFont);
};
```

### Font Usage Guidelines

| Element | Font | Size Range | Weight | When to Use |
|---------|------|------------|--------|-------------|
| **Hero headlines** | STKMiso | 48-72px | 400 | Opening titles, key messages |
| **Section headers** | STKMiso | 32-48px | 400 | Section dividers |
| **Body text** | Inter | 18-24px | 400-600 | Main content, descriptions |
| **Captions** | Inter | 14-18px | 400 | Subtitles, small text |
| **Code snippets** | Courier New | 16-20px | 400 | Code examples, technical content |

### Text Hierarchy Example

```typescript
const textStyles = {
  hero: {
    fontFamily: 'STKMiso, Inter, sans-serif',
    fontSize: 64,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.2,
  },
  heading: {
    fontFamily: 'STKMiso, Inter, sans-serif',
    fontSize: 40,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.3,
  },
  body: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 20,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.5,
  },
  caption: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    color: '#666666',
    lineHeight: 1.4,
  },
  code: {
    fontFamily: 'Courier New, monospace',
    fontSize: 18,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.4,
  },
};
```

---

## Voice Guidelines for Video Text

### Core Voice Attributes

| Attribute | What It Means | Video Application |
|-----------|---------------|-------------------|
| **Builder-first** | Speak to "builders" not "users" | Text: "400K builders ship on Base44" |
| **Fast-paced** | Action verbs, present tense | Text: "Ship faster. Build today." |
| **Results-focused** | Specific numbers, outcomes | Text: "$1M ARR in 3 months" |
| **Confident** | Direct statements, no hedging | Text: "Build it now" NOT "Maybe build it" |

### Vocabulary Rules

#### ALWAYS Use
- "Builders" (never "users" or "customers")
- "Ship" / "Go live" (never "deploy" or "launch")
- "Just shipped" (for announcements)
- "Vibe coding" (our category)
- Action verbs in present tense
- Specific numbers (e.g., "$1M ARR", "140K users", "3 weeks")

#### NEVER Use
- "Users" or "customers" (say "builders")
- "Deploy" or "launch" (say "ship" or "go live")
- Corporate speak ("leveraging synergies", "best-in-class")
- Passive voice ("it was built" → "we built")
- Vague claims ("fast", "easy" without specifics)
- Hedging ("might", "perhaps", "we think")

### Text Length Guidelines

**Keep video text SHORT and PUNCHY:**

| Text Type | Max Characters | Example |
|-----------|----------------|---------|
| **Hero headline** | 30-40 chars | "Ship Your App Today" |
| **Section header** | 40-60 chars | "From Idea to $1M ARR" |
| **Body text** | 60-100 chars | "Sarah built her SaaS in 3 weeks. Here's what happened." |
| **Caption/subtitle** | 100-150 chars | "Powered by AI. Built for builders. Acquired by Wix for $80M." |

**Readability rules:**
- Break long sentences into multiple cards/frames
- Use line breaks for rhythm
- Keep on-screen for at least 2 seconds per line
- Avoid walls of text

---

## Anti-Patterns (CRITICAL)

### Visual Anti-Patterns (DO NOT USE)

| Pattern | Why It's Wrong | Alternative |
|---------|----------------|-------------|
| **Arrow bullets** | Feels AI-generated, outdated | Use: bullets, numbered lists, or natural flow |
| **Too many bullet points** | Every frame looks like a list | Use: Varied structure, mix text styles |
| **Overly choppy text** | "This. Is. Not. Natural." | Use: Natural sentence flow, mix lengths |
| **Generic AI aesthetics** | Purple gradients, default fonts | Use: Base44 brand colors and fonts |
| **Emoji as bullets** | Spammy, AI-tell | Use: Sparingly, only when adding meaning |

### Content Anti-Patterns (DO NOT USE)

| Pattern | Why It's Wrong | Alternative |
|---------|----------------|-------------|
| **Repeated phrases** | "For real" in every video | Use: Signature phrases sparingly |
| **Perfect parallel structure** | Too predictable | Use: Varied sentence structure |
| **Corporate speak** | Not our voice | Use: Direct, builder-to-builder tone |
| **Vague claims** | "Fast" without proof | Use: Specific numbers, real outcomes |

---

## Video Text Examples

### Hero Frames (Opening Titles)

**GOOD:**
```
Ship Your App Idea. Today.
```
```
$1M ARR. 3 Months. One Founder.
```
```
What Will You Build?
```

**BAD:**
```
Deploy Your Application Using Our Platform → (uses "deploy", has arrow)
```
```
We're excited to announce our new features! (corporate speak)
```

### Builder Spotlight (Case Study)

**GOOD:**
```
Sarah launched her SaaS yesterday.

$12K MRR. 140 users. Zero code.

Here's what happened.
```

**BAD:**
```
Meet Sarah, a successful user who leveraged our platform to deploy her application. (corporate, passive voice)
```

### Feature Announcements

**GOOD:**
```
Just shipped: Gmail integration

Send. Receive. Read.

All from your app.
```

**BAD:**
```
We're excited to announce that we've deployed Gmail integration:
→ Send emails
→ Receive messages
→ Read inbox
(corporate, arrows, list format)
```

### CTAs (Call-to-Action)

**GOOD:**
```
Start building
```
```
Ship your first app
```
```
Join the builders
```

**BAD:**
```
Try our platform today → (arrow)
```
```
Perhaps you'd like to consider building with us (hedging)
```

---

## Composition Templates

### Standard Video Structure

```typescript
// Recommended frame sequence for Base44 videos

1. Hero Frame (2-3s)
   - Large headline (STKMiso)
   - Brand gradient background
   - Optional: subtle animation (fade/slide)

2. Setup/Problem (3-4s)
   - Establish context
   - Use body text (Inter)
   - Gray text for supporting info

3. Solution/Feature (4-6s)
   - Show the key benefit
   - Use orange accent for highlights
   - Action-oriented text

4. Proof/Result (3-4s)
   - Specific numbers or outcomes
   - Bold, large text
   - White card on gradient background

5. CTA Frame (2-3s)
   - Clear call-to-action
   - Button style: black bg, white text
   - Orange accent elements
```

### Color Palette Per Frame Type

| Frame Type | Background | Text | Accent |
|------------|------------|------|--------|
| **Hero** | Gradient (#E8F4F8 to #FDF5F0) | Black (#000000) | Orange (#FF983B) |
| **Content** | White card (#FFFFFF) on gradient | Black (#000000) | Orange highlights |
| **Highlight** | Orange (#FF983B) | White (#FFFFFF) | Dark orange (#EA6020) |
| **CTA** | Black (#000000) or Orange (#FF983B) | White (#FFFFFF) | - |

---

## Animation Guidelines

### Brand-Appropriate Animations

**DO USE:**
- Smooth fades (ease-in-out)
- Subtle slides (natural flow)
- Scale animations (zoom in/out)
- Spring animations (organic feel)

**DON'T USE:**
- Jarring cuts
- Over-the-top effects
- Spinning/rotating text excessively
- Distracting background animations

### Timing Guidelines

```typescript
// Recommended animation durations
const timing = {
  fade: 0.3,           // seconds (quick, smooth)
  slide: 0.5,          // seconds (natural)
  textAppear: 0.4,     // seconds per line
  holdFrame: 2.0,      // minimum seconds to read text
};
```

---

## Accessibility

### Contrast Requirements

All text must meet WCAG AA standards:
- **Normal text:** 4.5:1 contrast ratio
- **Large text (18px+):** 3:1 contrast ratio

**Pre-approved combinations:**
| Background | Text | Contrast | Status |
|------------|------|----------|--------|
| #E8F4F8 (light blue) | #000000 (black) | 18.5:1 | Excellent |
| #FFFFFF (white) | #000000 (black) | 21:1 | Excellent |
| #FF983B (orange) | #000000 (black) | 2.9:1 | Large text only |
| #FF983B (orange) | #FFFFFF (white) | 7.2:1 | Excellent |

### Subtitles/Captions

- Use Inter 16-18px minimum
- Black text on semi-transparent white background
- Position: bottom center, 10% from edge
- Duration: minimum 2s per line

---

## Brand Assets Location

All brand files are located at:
```
plugins/base44-marketing/brands/base44/
├── brand.json               (colors, fonts, specs)
├── tone-of-voice.md         (full voice guide)
├── brand-system.md          (mission, positioning)
└── AGENTS.md                (compressed reference)
```

**Note:** Logo assets are defined in `brand.json` under the `assets` key but may not be present in all deployments. Check for logo availability before referencing.

**Logo usage (when available):**
- Place in bottom-right or top-left corner
- Size: 80-120px width
- Padding: 20-30px from edges
- Optional: fade in/out with frames

---

## Checklist Before Rendering

Before rendering any Base44 video, verify:

### Visual Brand
- [ ] Uses Base44 gradient background or white cards
- [ ] Orange accent color for highlights/CTAs
- [ ] STKMiso for headings (with Inter fallback)
- [ ] Inter for body text
- [ ] No arrows in text
- [ ] Logo included (if available and appropriate)

### Voice & Content
- [ ] Uses "builders" not "users"
- [ ] Uses "ship" not "deploy"
- [ ] Action verbs in present tense
- [ ] Specific numbers where applicable
- [ ] No corporate speak
- [ ] Text is short and punchy

### Technical
- [ ] All text readable for 2+ seconds
- [ ] Contrast ratios meet WCAG AA
- [ ] Animations are smooth and brand-appropriate
- [ ] Total duration fits platform (e.g., 15-60s for social)

---

## Quick Reference Card

```
COLORS:         #E8F4F8 to #FDF5F0 (gradient), #FF983B (orange), #000000 (black)
FONTS:          STKMiso (headings), Inter (body), Courier New (code)
VOICE:          Builders > Users | Ship > Deploy | Specific numbers | Action verbs
ANTI-PATTERNS:  No arrows, No corporate speak, No vague claims
TEXT LENGTH:    30-40 chars (hero), 60-100 chars (body), 2s minimum on-screen
```

---

**Last updated: 2026-02-05**
**Brand files version: 2026-01-23**
