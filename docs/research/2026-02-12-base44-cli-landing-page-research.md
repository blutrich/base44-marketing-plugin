# Base44 CLI Landing Page Skill - Research

> Research for creating a marketing plugin skill that builds real landing pages hosted on Base44.
> Date: 2026-02-12

---

## Base44 CLI Capabilities

### Installation & Auth
```bash
npm install --save-dev base44
npx base44 login        # Device code flow auth
npx base44 whoami       # Check auth status
```

### Project Creation
```bash
# Full-stack (Vite + React + Tailwind + shadcn/ui)
npx base44 create my-app -p ./my-app -t backend-and-client

# Backend-only (add to existing project)
npx base44 create my-app -p .

# Create + deploy in one step
npx base44 create my-app -p ./my-app -t backend-and-client --deploy
```

CRITICAL: Always provide name AND `--path` flag (non-interactive mode).

### Project Structure
```
my-app/
├── base44/
│   ├── .app.jsonc          # App ID (gitignored)
│   ├── config.jsonc        # Project settings
│   ├── entities/           # Data schemas (.jsonc)
│   └── functions/          # Serverless functions
├── src/                    # Frontend code
│   ├── api/base44Client.js # SDK client
│   ├── pages/
│   └── components/
├── index.html              # SPA entry point
├── package.json
└── vite.config.js
```

### config.jsonc
```jsonc
{
  "name": "My App",
  "description": "App description",
  "entitiesDir": "./entities",
  "functionsDir": "./functions",
  "site": {
    "installCommand": "npm install",
    "buildCommand": "npm run build",
    "serveCommand": "npm run dev",
    "outputDirectory": "./dist"
  }
}
```

### Deployment
```bash
npx base44 deploy -y              # Deploy everything (entities + functions + site)
npx base44 entities push          # Push entities only
npx base44 functions deploy       # Deploy functions only
npx base44 site deploy -y         # Deploy site only
```

Site deploy:
- Reads `site.outputDirectory` from config.jsonc
- Archives and uploads built files
- Returns live URL: `https://{app-name}.base44.app`
- SPA only (single index.html, client-side routing)
- Previous deployments versioned

### Entity Schema
```jsonc
{
  "name": "LandingPage",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Page title" },
    "slug": { "type": "string", "description": "URL slug" },
    "status": {
      "type": "string",
      "enum": ["draft", "published"],
      "default": "draft"
    }
  },
  "required": ["title", "slug"]
}
```

File naming: kebab-case (`landing-page.jsonc` for `LandingPage`).
Field types: string, number, boolean, array.
String formats: date, date-time, email, uri, richtext.
RLS supported for access control.

---

## Current Landing Page System (Plugin)

### Existing Skills
1. **landing-page-architecture** - 8-Section Framework for copy generation
2. **landing-page-generator** - Full pipeline: copy → CMS JSON → Wix API push
3. **direct-response-copy** - THE SLIDE framework for persuasion
4. **hook-rules** - Approved hook styles, banned patterns

### Current Pipeline (Wix CMS)
```
Input (goal, persona, message)
  → Template Selection (5 layouts)
  → Copy Generation (8-Section Framework)
  → Brand Validation (brand-guardian >= 7/10)
  → CMS JSON Formatting
  → Wix CMS API Push (requires WIX_API_KEY + WIX_SITE_ID)
  → Live at base44.com/landing/{slug}
```

### 5 Templates
| Template | Best For |
|----------|----------|
| feature-launch | New features, product updates |
| campaign | Time-bound campaigns, events |
| signup | Free trial, getting started |
| case-study | Builder success stories |
| enterprise | Security, compliance, trust |

### CMS Schema Fields (8-Section Framework)
- Hero: eyebrow, headline, subheadline, cta_text, cta_url, trust_signals
- Success: confirmation, deliverables
- Problem-Agitate: points, agitation, transition
- Value Stack: stack, total, price, cta_text
- Social Proof: testimonials
- Transformation: time-based progression
- Secondary CTA: headline, cta_text, objection
- SEO: meta_title, meta_description, og_image_url

---

## Gap Analysis: Current vs Desired

### What Works (Keep)
- 8-Section Framework copy generation
- Brand-guardian validation
- 5 template types
- Design system (brand.json, design-system.md)
- Logo handling (logo.png, never text)

### What's Missing (Build)
1. **HTML generation** - Currently generates CMS JSON, need actual HTML/CSS
2. **Base44 project scaffolding** - Create Base44 project structure for each LP
3. **Base44 CLI deployment** - Use `site deploy` instead of/alongside Wix CMS API
4. **Self-contained SPA** - Single index.html with all styles inline
5. **Design system application** - brand.json tokens → actual CSS
6. **Asset bundling** - Logo, fonts, images in output directory

### Key Insight: Base44 Hosting = SPA
Base44 hosting serves SPAs with a single `index.html`. Landing pages are already single-page by nature. This is a perfect fit:
- Generate `index.html` with inline CSS/JS
- Put in `dist/` directory
- Run `npx base44 site deploy -y`
- Live at `https://{slug}.base44.app`

---

## Existing Plans & Context

### Figma-to-Landing-Page Plan (2026-02-12)
Already exists at `docs/plans/2026-02-12-figma-landing-page-plan.md`.
Phase 3 of that plan covers Base44 CLI integration but at a high level.
This new skill should be the detailed implementation of that integration.

### Design System Assets
- `brands/base44/brand.json` - Colors, fonts, gradients, shadows
- `brands/base44/design-system.md` - Full HTML/CSS component library
- `output/logo.png` - Base44 logo (MUST use image, never text)
- Font: STK Miso (Light 300 body, Regular 400 headings)

---

## Sources
- [Base44 CLI GitHub](https://github.com/base44/cli)
- [site deploy docs](https://docs.base44.com/developers/references/cli/commands/site-deploy)
- [Project Structure docs](https://docs.base44.com/developers/backend/overview/project-structure)
- [React Quickstart](https://docs.base44.com/developers/backend/quickstart/frameworks/quickstart-with-react)
- [Base44 Landing Page Templates](https://base44.com/templates/view/landing-page-bricks)
- Local skill: `/Users/oferbl/.claude/skills/base44-cli/`
