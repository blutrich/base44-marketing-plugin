# Deployment Pipeline

> Step-by-step instructions for deploying a landing page to Base44 hosting.

## Pre-flight Check

```bash
npx base44 whoami
```

- **If authenticated** (shows email): continue to deployment
- **If NOT authenticated** (error): tell user to run `npx base44 login` manually, then save HTML locally as fallback

**NEVER proceed with CLI commands if not authenticated.**

---

## Option A: New Project (no `base44/` directory exists)

Run these steps sequentially:

```bash
# 1. Create project directory
mkdir -p {slug}-landing

# 2. Initialize npm project
cd {slug}-landing
npm init -y

# 3. Install Base44 CLI
npm install --save-dev base44

# 4. Create Base44 project (backend-only, non-interactive)
npx base44 create {slug}-landing -p .

# 5. Create output directory
mkdir -p dist
```

Then edit `base44/config.jsonc` to set the site output directory:

```jsonc
{
  "name": "{slug}-landing",
  "description": "Landing page for {feature/campaign}",
  "site": {
    "outputDirectory": "./dist"
  }
}
```

Then write the generated `index.html`:

```
Write(file_path="{slug}-landing/dist/index.html", content="[the generated HTML]")
```

Then deploy:

```bash
cd {slug}-landing
npx base44 site deploy -y
```

---

## Option B: Existing Base44 Project

If a `base44/config.jsonc` already exists:

```bash
# 1. Check site config exists
Read(file_path="base44/config.jsonc")
# Verify site.outputDirectory is set

# 2. Write HTML to the output directory
Write(file_path="{outputDirectory}/index.html", content="[the generated HTML]")

# 3. Deploy
npx base44 site deploy -y
```

---

## Option C: Fallback (No Auth)

If Base44 CLI is not authenticated:

```bash
# 1. Save HTML locally
mkdir -p landing-pages/{slug}
Write(file_path="landing-pages/{slug}/index.html", content="[the generated HTML]")
```

Tell the user:
```
HTML saved locally at landing-pages/{slug}/index.html
Open in browser to preview.

To deploy to Base44:
  cd landing-pages/{slug}
  npm init -y && npm install --save-dev base44
  npx base44 login
  npx base44 create {slug} -p .
  # Edit base44/config.jsonc: set site.outputDirectory to "./dist"
  mkdir dist && cp index.html dist/
  npx base44 site deploy -y
```

---

## Post-Deploy

After successful `site deploy`:

1. **Capture the URL** from CLI output: `https://{slug}-landing.base44.app`
2. **Verify** the page loads by telling the user to open the URL
3. **Report** the live URL to the user

---

## Error Handling

| Error | Solution |
|-------|----------|
| "Not authenticated" | Run `npx base44 login` |
| "No site configuration found" | Check `site.outputDirectory` in `base44/config.jsonc` |
| "Site deployment fails" | Ensure `dist/index.html` exists |
| CLI not installed | Run `npm install --save-dev base44` |
| Create fails (folder exists) | Use `-p .` flag to add Base44 to existing directory |

---

## Important Notes

- Always use `-y` flag with `site deploy` (skips interactive confirmation)
- Always provide name AND `--path` flag with `create` (avoids interactive TUI)
- Use `npx base44` (never `base44` directly -- it's a local dev dependency)
- One Base44 app per landing page gives clean URLs
- Previous deployments are versioned -- safe to redeploy
