# Base44 Marketing Playbook
## Proposed Structure

---

## Overview

This playbook solves the core problems identified in team interviews:
- Content quality inconsistent (no brand guidelines)
- Reactive "panic mode" operations (no process)
- Info scattered in DMs (no single source of truth)
- Feature releases surprise marketing (no coordination)

---

## Key Findings from Research

**Pain points (from interviews):**
| Person | Pain Point | Quote/Evidence |
|--------|------------|----------------|
| Shay | Content quality "very bad" | Foundation work never done |
| Tiffany | No brand guidelines | "We don't have a brand book" |
| Tiffany | Panic mode operations | Same-day feature requests common |
| Laura | Created own brand voice doc | No official guidelines existed |
| Amanda | Info scattered in DMs | Built own task app to track work |
| Shay | Approval bottleneck | Wants to remove himself once quality consistent |

**What already exists (leverage these):**
- Laura's Social Strategy deck (brand voice, content pillars, audiences)
- Plan Mode launch brief (good template structure)
- Tiffany's ChatGPT tone analysis (need to collect)
- Amanda's Mintify docs workflow

---

## Playbook Structure

```
Marketing Playbook/
├── 1. Foundation/
│   ├── Brand Guidelines.md
│   ├── Tone of Voice.md
│   └── Audience Profiles.md
│
├── 2. Processes/
│   ├── Feature Launch Flow.md
│   ├── Content Creation Workflow.md
│   ├── Approval Process.md
│   └── Release Calendar Management.md
│
├── 3. Templates/
│   ├── Feature Brief Template.md
│   ├── Social Post Templates/
│   │   ├── LinkedIn.md
│   │   ├── X (Twitter).md
│   │   └── Discord.md
│   ├── Email Templates/
│   └── What's New Template.md
│
├── 4. Team/
│   ├── RACI Matrix.md
│   ├── Team Directory.md
│   └── Communication Channels.md
│
└── 5. Resources/
    ├── Approved Assets Library.md
    ├── Competitor Reference.md
    └── Tools & Access.md
```

---

## Section Details

### 1. Foundation (Build First)

#### Brand Guidelines.md
- Who we are (mission, values)
- Brand personality (the "cool big brother")
- Visual identity basics (logo usage, colors — link to Vered's design system)
- What we're NOT

#### Tone of Voice.md
- 3-5 brand voice attributes with examples
- Do's and Don'ts table
- Before/After examples
- Platform-specific adjustments (LinkedIn = more professional, X = more casual)
- Phrases to use / Phrases to avoid

#### Audience Profiles.md
**From Laura's Social Strategy:**

| Segment | Who They Are | Where They Are | Content Focus |
|---------|--------------|----------------|---------------|
| **Prototypers** | Vibe coders, students, experimenting with AI app building | X, Instagram, Reddit | Educational, Community, tips |
| **Pro Builders** | Freelancers building client apps, startups building MVPs | LinkedIn, X, Discord | Product features, Use cases, ROI |
| **Enterprise** | Large companies building internal tools, multiple teams | LinkedIn | Thought leadership, Case studies, Security |

**6 Content Pillars (Laura):**
1. **Educational** — Tips, how-tos, tutorials (Primary: Prototypers)
2. **Product Features & Updates** — Announcements, deep-dives (Primary: Pro Builders)
3. **Use Cases & Success Stories** — Builder spotlights, case studies (Primary: Pro Builders, Enterprise)
4. **Data/ROI Proof Points** — Stats, savings, growth metrics (Primary: Enterprise)
5. **Community** — Challenges, polls, builder spotlights (Primary: Prototypers)
6. **Thought Leadership** — Maor's insights, industry perspectives (Primary: Enterprise)

---

### 2. Processes (Build Second)

#### Feature Launch Flow.md
**The core workflow Shay wants automated**

```
PRODUCT                          MARKETING
   │                                │
   ├─ Feature in development        │
   │                                │
   ├─ T-14 days: Brief to marketing─┼─► Receive brief
   │                                ├─► Ask clarifying questions
   │                                │
   ├─ T-7 days: Feature complete ───┼─► Draft content
   │                                ├─► Submit for approval
   │                                │
   ├─ T-3 days: QA complete ────────┼─► Revisions
   │                                ├─► Final approval
   │                                │
   └─ Launch day ───────────────────┼─► Publish all channels
                                    └─► Monitor & engage
```

**Tier System (from Shay):**

| Tier | Description | Assets Required |
|------|-------------|-----------------|
| **Tier 1** | Major feature, competitive advantage, "moves Base44 to next level" | Video, all socials, dedicated email, blog post, Discord announcement, landing page |
| **Tier 2** | Significant feature, user value | Social posts, email mention, What's New, Discord |
| **Tier 3** | Small update, notice-level | What's New, newsletter paragraph |

**Includes:**
- Required assets per tier (see above)
- Deadlines and owners
- Escalation path
- Real-world example: Gmail connector announcement (same-day request → "this happens all the time")

#### Content Creation Workflow.md
1. Idea/request comes in
2. Check brand guidelines
3. Draft using templates
4. Self-review checklist
5. Submit for approval (who, where, how)
6. Revision cycle
7. Final approval
8. Schedule/publish
9. Engage with responses

#### Approval Process.md
- Who approves what
- Turnaround time expectations
- How to submit (Slack channel? Tool?)
- What to include in submission
- Revision protocol

#### Release Calendar Management.md
- Where the calendar lives
- Who updates it
- Required fields
- How marketing gets notified of changes
- Weekly sync process with product

---

### 3. Templates (Build Third)

#### Feature Brief Template.md
Based on the Plan Mode example:

```markdown
# [Feature Name]
**Release Tier:** 1 / 2 / 3
**Launch Date:** [Date]
**Product Owner:** [Name]
**Marketing Owner:** [Name]

## What It Is
[One paragraph description]

## The Problem It Solves
[User pain point]

## How It Works
[Step by step]

## Key Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Target Audience
[Which segment(s)]

## Assets Needed
| Asset | Owner | Due Date | Status |
|-------|-------|----------|--------|
| Demo video | | | |
| Screenshots | | | |
| LinkedIn copy | | | |
| X copy | | | |
| Email blurb | | | |
| What's New text | | | |

## Positioning / Key Messages
[Main angles for messaging]

## Screenshots
[Links/embedded images]
```

#### Social Post Templates
Platform-specific templates with:
- Character limits
- Formatting guidelines
- CTA options
- Hashtag strategy
- Example posts (approved by Shay)

---

### 4. Team

#### RACI Matrix.md
| Task | Shay | Tiffany | Laura | Amanda | Vered | Product |
|------|-----|---------|-------|--------|-------|---------|
| Feature brief | I | R | I | I | I | A |
| Social copy | A | C | R | I | I | I |
| Email copy | A | R | I | I | I | I |
| Docs/What's New | I | I | I | R | I | C |
| Design assets | A | C | C | I | R | I |
| Final approval | A | - | - | - | - | I |

R = Responsible, A = Accountable, C = Consulted, I = Informed

#### Team Directory.md
**From interviews — current team:**

| Name | Role | Location | Owns |
|------|------|----------|------|
| **Shay** | Head of Marketing | Israel | Final approval, strategy |
| **Shiri** | Ops | Israel | Operations, product-marketing coordination |
| **Tiffany** | Marketing Manager | New York | Feature releases, email, copy |
| **Laura** | Social Media Manager | Israel | LinkedIn, X, Instagram, content calendar |
| **Sam** | Community Manager | New York | Discord, community engagement |
| **Vered** | Design Lead | Israel | Visual assets, design system |
| **Amanda** | Technical Writer | — | Docs, What's New, help center |
| **Yoav Orlev** | Product | Amsterdam | Product liaison, technical context |
| **Ron** | Release Manager | — | Release calendar, product coordination |

#### Communication Channels.md
- #marketing-team — daily ops
- #feature-launches — launch coordination
- #content-review — approval requests
- DMs — avoid for work requests (creates silos)

---

### 5. Resources

#### Approved Assets Library.md
- Link to Google Drive / Figma
- How to request new assets
- Naming conventions

#### Competitor Reference.md
- What competitors do well (steal these ideas)
- What competitors do poorly (avoid these mistakes)
- Positioning differentiation

#### Tools & Access.md
**Current tools (from interviews):**

| Tool | Used By | Purpose |
|------|---------|---------|
| **Slack** | Everyone | Primary communication (avoid DMs for work) |
| **Figma** | Vered, designers | Design assets, brand system |
| **Mintify** | Amanda | Docs CMS |
| **ChatGPT** | Tiffany | Copy drafting |
| **Gemini** | Laura | Social copy drafting |
| **Claude Code** | Future automation | Brand-compliant content generation |
| **Native scheduling** | Laura | Social post scheduling |
| **Base44 app** | Amanda | Personal task management |

**Gaps identified:**
- No centralized publishing platform (Laura requested)
- No shared content calendar tool
- No brand-aware AI prompts set up

---

## Build Order

| Phase | What to Build | Why | Dependency |
|-------|---------------|-----|------------|
| **Phase 1** | Brand Guidelines + Tone of Voice | Everything else depends on this | Shay interview |
| **Phase 2** | Feature Launch Flow | Shay's #1 priority | Brand Guidelines |
| **Phase 3** | Feature Brief Template | Enables the launch flow | Launch Flow |
| **Phase 4** | Social Templates | Team can start using immediately | Tone of Voice |
| **Phase 5** | RACI + Processes | Formalizes who does what | Launch Flow |
| **Phase 6** | Everything else | Polish and completeness | Phases 1-5 |

---

## Automation Vision (Phase 2+)

Once foundation is built, Shay's automation goal:

```
Slack command: /announce [feature-name]
        │
        ▼
Claude Code reads Feature Brief
        │
        ▼
Claude Code applies Brand Guidelines + Tone of Voice
        │
        ▼
Generates draft announcements for all channels
        │
        ▼
Human reviews and approves
        │
        ▼
Auto-posts to LinkedIn, X, Discord, Email
```

**Prerequisites:**
1. Brand Guidelines in machine-readable format
2. Tone of Voice with clear rules
3. Templates structured for AI generation
4. Feature Brief standardized

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Content approval rate (first submission) | ~30%? | 80% |
| Time from feature complete to announcement | Variable | 48 hours |
| Content pieces using brand guidelines | 0% | 100% |
| Team knows where to find info | DMs | Playbook |

---

## Next Steps

1. **Complete Shay interview** → Extract brand vision
2. **Draft Brand Guidelines v1** → Get Shay approval
3. **Draft Tone of Voice v1** → Get Shay approval
4. **Document Feature Launch Flow** → Align with Ron/Product
5. **Create Feature Brief Template** → Test with next launch
6. **Build remaining sections** → Iterate based on usage
