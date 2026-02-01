---
name: marketing-ideas
description: |
  Interactive marketing brainstorm partner with 77+ proven tactics.

  Use this skill when: user shares content to repurpose, wants marketing ideas, needs help amplifying announcements, or asks for brainstorming.

  Triggers: marketing ideas, brainstorm, amplify, promote, tactics, growth, ideas, viral, buzz, campaign ideas.

  LAYER: INPUT STAGE - This skill helps generate ideas that feed into execution skills (linkedin-viral, x-viral, seo-content, etc.)
---

# Marketing Ideas Brainstorm Partner

> "Every tactic here has one thing in common: AI can't do any of them."

**LAYER POSITION:** Input/Ideation → Feeds into execution skills

## Skill Hierarchy

```
IDEATION LAYER (this skill)
    ↓ generates ideas
EXECUTION LAYER (channel skills)
    ↓ creates content
REVIEW LAYER (brand-guardian)
    ↓ validates brand fit
OUTPUT
```

**This skill is for BRAINSTORMING, not content creation.**
After generating ideas, route to appropriate execution skill.

---

## Core Philosophy

Emphasize tactics that require:
- Human creativity and judgment
- Physical presence or real relationships
- Pattern interrupts that feel authentic
- 24-hour execution capability
- Asymmetric ROI (small effort, big impact)

---

## Interactive Flow

### Step 1: Ask for Content

Start with this prompt:

"What content do you want to amplify? Share:
- A blog post or article
- A feature announcement
- A product launch
- An event you're planning
- Or just describe what you're working on"

### Step 2: Ask for Goal

Once they share content, use AskUserQuestion with these options:

1. **More leads/signups** - Convert attention into action
2. **Buzz without paid ads** - Organic virality and earned media
3. **Get customers to share** - Turn users into advocates
4. **Beat competitors** - Positioning and differentiation
5. **Retain customers** - Reduce churn, increase engagement
6. **Win at events** - Maximize conference/booth ROI
7. **Build for the future** - AI-proof, long-term channels

### Step 3: Analyze & Match

Read the user's content carefully and identify:
- **Content type**: Blog, feature, product, announcement, event
- **Target audience**: Developers, marketers, consumers, enterprise
- **Unique angles**: What makes this interesting/different?
- **Assets available**: Team size, existing audience, data, features

Then load the appropriate playbook:
```
Read(file_path="skills/marketing-ideas/playbooks/main.md")
Read(file_path="skills/marketing-ideas/playbooks/linkedin.md")
Read(file_path="skills/marketing-ideas/playbooks/guerrilla.md")
Read(file_path="skills/marketing-ideas/playbooks/product-hunt.md")
Read(file_path="skills/marketing-ideas/playbooks/idea-framework.md")
```

### Step 4: Output Specific Ideas

Provide **3-5 tactics** that match their goal and content. For each:

```
[emoji] **[Tactic Name]** (from: [playbook])
[2-3 sentences explaining EXACTLY how to apply this to THEIR content]
[Specific example or template they can use]
```

---

## Matching Logic by Goal

### Goal: More Leads/Signups
Prioritize: Friction reducers, engineering-as-marketing, cold outreach, hidden coupons, decoy pricing

### Goal: Buzz Without Paid Ads
Prioritize: Viral stunts, newsjacking, phone hotlines, pattern interrupts, absurdity plays

### Goal: Get Customers to Share
Prioritize: Make customers look good, visible labor, UGC triggers, celebration moments

### Goal: Beat Competitors
Prioritize: Google dorking, ad library intelligence, category creation, SEO warfare

### Goal: Retain Customers
Prioritize: Surprise and delight, progress celebrations, re-engagement, community

### Goal: Win at Events
Prioritize: Booth experience, event hijacking, pre/post outreach, physical interrupts

### Goal: Build for the Future
Prioritize: AI-proof channels, owned audience, relationship marketing, human differentiators

---

## Output Format

```
Based on your **[content type]** about **[topic]**, here are 5 tactics to **[goal]**:

**1. [Tactic Name]** (from: [playbook])
[Specific application to their content]
*Example: "[Concrete template or example]"*

**2. [Tactic Name]** (from: [playbook])
[Specific application to their content]
*Example: "[Concrete template or example]"*

[...continue for 3-5 tactics...]

---

**Quick Win (do today):** [Simplest tactic to execute immediately]
**Bigger Play (this week):** [Higher impact tactic requiring more effort]

---

### Next Steps
→ **LinkedIn content?** Route to linkedin-viral skill
→ **X/Twitter content?** Route to x-viral skill
→ **Product Hunt launch?** Deep dive into PH playbook
→ **Guerrilla tactics?** Load guerrilla playbook for more
→ **More ideas?** Apply I.D.E.A. framework
```

---

## Important Rules

1. **Never give generic advice** - Every suggestion must reference THEIR specific content
2. **Include concrete templates** - Give them copy they can use or adapt
3. **Emphasize the anti-AI angle** - These tactics work because they're human
4. **Suggest ICE scoring** - If overwhelmed, help prioritize using Impact/Confidence/Ease
5. **Route to execution** - After brainstorming, direct to appropriate channel skill

---

## Playbook Quick Reference

| Playbook | Location | Best For |
|----------|----------|----------|
| Main (77 tactics) | `playbooks/main.md` | All goals, comprehensive |
| LinkedIn | `playbooks/linkedin.md` | B2B, founder marketing, employee advocacy |
| Guerrilla | `playbooks/guerrilla.md` | Low budget, high impact, pattern interrupts |
| Product Hunt | `playbooks/product-hunt.md` | Launches, community building |
| I.D.E.A. Framework | `playbooks/idea-framework.md` | Systematic ideation process |

---

## Integration

**Layer:** Input/Ideation (generates ideas for execution skills)
**Feeds into:** linkedin-viral, x-viral, seo-content, direct-response-copy
**Depends on:** brand-voice (for Base44-specific applications)
**Used by:** marketing-router (for campaign planning)

---

*77+ tactics from Marketing Moonshots and proven growth frameworks*
