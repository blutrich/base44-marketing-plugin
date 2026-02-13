# Team Memory Protocol

## What Teammates Share (via filesystem)
- Brand context: `brands/base44/` (read-only for all)
- Campaign brief: `output/campaign-brief.md` (read-only, lead writes)
- Marketing memory: `.claude/marketing/` (read-only during team work)

## What Teammates Own (exclusive write)
- Their output directory: `output/{channel}/`
- Their review responses: within their output directory

## Post-Team Memory Update
After the team completes:
1. Lead updates `.claude/marketing/activeContext.md` with campaign results
2. Lead updates `.claude/marketing/patterns.md` with what worked
3. Guardian findings get appended to `brands/base44/learning-log.md`

## Memory Isolation Rule
Teammates MUST NOT write to:
- `.claude/marketing/` (lead's responsibility)
- `brands/base44/` (permanent brand assets)
- Other teammates' `output/{channel}/` directories
- Any plugin source files (`agents/`, `skills/`)
