# Asset Plan Template

Use this template for Phase 4 of the Launch Waterfall. Every asset must have an owner, deadline, and dependency chain.

---

# Asset Plan: {Feature Name}

## Launch Date: {YYYY-MM-DD}
## Messaging Framework: {link to phase-3 file}

## Assets Required

| # | Asset | Channel | Owner Agent | Depends On | Deadline | Status |
|---|-------|---------|-------------|-----------|----------|--------|
| 1 | Landing page | Web | copywriter + base44-landing-page | Messaging Framework | D-3 | pending |
| 2 | Demo video | Video | video-specialist | Product ready | D-1 | pending |
| 3 | LinkedIn announcement | LinkedIn | linkedin-specialist | LP URL | D-0 | pending |
| 4 | Maor personal post | LinkedIn | linkedin-specialist (Maor voice) | Messaging Framework | D-0 | pending |
| 5 | X announcement + thread | X | x-specialist | LP URL | D-0 | pending |
| 6 | Email to builders | Email | copywriter | LP URL | D-0 | pending |
| 7 | What's New entry | Product | copywriter | Messaging Framework | D-0 | pending |
| 8 | Discord announcement | Discord | copywriter | LP URL | D-0 | pending |
| 9 | Reddit post | Reddit | copywriter | LP URL | D+1 | pending |
| 10 | Blog post | Blog | seo-specialist | Messaging Framework | D+3 | pending |

## Community Activation

| Channel | Action | Timing | Owner |
|---------|--------|--------|-------|
| Discord | Teaser / early access | D-3 | community |
| Discord | Repost incentive (credits) | D+1 | community |
| Reddit | r/base44 announcement | D+1 | community |
| Influencers | Pre-briefing with talking points | D-2 | marketing |

## Teaser Cadence

| Day | Channel | Content | Purpose |
|-----|---------|---------|---------|
| D-7 | X (Maor) | Cryptic teaser | Anticipation |
| D-3 | Discord | Early access | Waitlist |
| D-1 | LinkedIn (Maor) | "Working on something" | Warm audience |
| D-0 | All | Full launch | Maximum reach |

## Dependency Graph

```
Messaging Framework (Phase 3)
    |
    +---> Landing Page (D-3)
    |         |
    |         +---> LinkedIn post (D-0, needs LP URL)
    |         +---> X post (D-0, needs LP URL)
    |         +---> Email (D-0, needs LP URL)
    |         +---> Discord (D-0, needs LP URL)
    |         +---> Reddit (D+1, needs LP URL)
    |
    +---> What's New (D-0, text only)
    +---> Maor post (D-0, personal voice)
    +---> Blog (D+3, deep dive)
    +---> Demo video (D-1, needs product)
```

## Sign-Off Required

- [ ] Product team (feature accuracy)
- [ ] Design (visual assets ready)
- [ ] CEO/Maor (personal posts approved)
- [ ] Community lead (activation plan confirmed)

---

*Status values: pending | in-progress | review | approved | shipped*
