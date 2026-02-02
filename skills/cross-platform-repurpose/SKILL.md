---
name: cross-platform-repurpose
description: |
  Transform content from one platform to another. LinkedIn to X, X to Email, etc.

  Use when: user has existing content and wants it adapted for a different channel.
  Triggers: repurpose, transform, convert, adapt, rewrite for [platform]
---

# Cross-Platform Repurpose

> One great post → Every platform in one click

## The Problem

You write a killer LinkedIn post. Now you need it for X. And Email. And Discord.
Manually rewriting = time wasted + inconsistent quality.

## Platform Characteristics

| Platform | Max Length | Tone | Emoji | Structure |
|----------|------------|------|-------|-----------|
| LinkedIn | 1,300 chars | Professional but warm | 1-3 | Paragraphs, hooks |
| X (Tweet) | 280 chars | Punchy, casual | 2-4 | One tight statement |
| X (Thread) | 5-7 tweets | Engaging, numbered | 2-4 per tweet | 1/ Hook → Points → CTA |
| Email | Varies | Personal, direct | Minimal | Subject + Preview + Body |
| Discord | Varies | Casual, community | Heavy | Scannable, conversational |

## Transformation Rules

### LinkedIn → X (Single Tweet)

| LinkedIn | X |
|----------|---|
| 1,300 chars max | 280 chars max |
| Professional tone | Punchier, more casual |
| 1-3 emoji | 2-4 emoji |
| Paragraphs | One tight statement |
| "Builders" | "Builders" (keep) |

**Transformation Prompt:**
```
Transform this LinkedIn post into a single tweet (280 chars max).
Keep the core insight. Make it punchier.
Add 1-2 relevant emoji.
End with engagement hook if space allows.
```

### LinkedIn → X Thread

| LinkedIn | X Thread |
|----------|----------|
| 1,300 chars | 5-7 tweets |
| One narrative | Tweet 1 = Hook, 2-5 = Points, Last = CTA |
| Flowing paragraphs | Numbered format (1/, 2/, etc.) |

**Transformation Prompt:**
```
Transform this LinkedIn post into an X thread (5-7 tweets).
Tweet 1: Strong hook (no "Thread:" prefix)
Tweets 2-5: One key point each
Final tweet: CTA or takeaway
Number format: 1/, 2/, etc.
Each tweet under 280 chars.
```

### LinkedIn → Email

| LinkedIn | Email |
|----------|-------|
| Public post | Personal message |
| Hook-first | Subject line + preview |
| "Everyone" | "You" (direct) |

**Transformation Prompt:**
```
Transform this LinkedIn post into a marketing email.
Subject line: Under 50 chars, curiosity-driven
Preview text: 90 chars that compel opening
Body: Personal, direct, "you" focused
CTA: Single clear action
Keep the core message but make it feel 1:1.
```

### LinkedIn → Discord

| LinkedIn | Discord |
|----------|---------|
| Professional | Community casual |
| Formal structure | Relaxed, conversational |
| Limited emoji | More emoji welcome |

**Transformation Prompt:**
```
Transform this LinkedIn post into a Discord announcement.
Tone: Casual, community-friendly
Use emoji for visual breaks
Keep it scannable
Add a question or reaction prompt at the end
```

### X → LinkedIn (Expand)

| X | LinkedIn |
|---|----------|
| 280 chars | Expand to 800-1,200 |
| Punchy | Add context, story, examples |
| Minimal | Add professional framing |

**Transformation Prompt:**
```
Expand this tweet into a LinkedIn post.
Add context and backstory.
Include a specific example or result.
Keep the core insight but give it room to breathe.
Target: 800-1,200 characters.
```

### X Thread → LinkedIn

**Transformation Prompt:**
```
Combine this X thread into a LinkedIn post.
Merge the key points into flowing paragraphs.
Keep the narrative arc.
Target: 800-1,200 characters.
Remove numbering, make it conversational.
```

### Email → LinkedIn

**Transformation Prompt:**
```
Transform this email into a LinkedIn post.
Make it public-facing (remove personal "you" focus).
Add a hook that stops the scroll.
Keep the core value proposition.
Target: 800-1,200 characters.
```

## Repurpose Workflow

1. **Identify source platform and content**
2. **Select target platform(s)**
3. **Apply transformation rules**
4. **Maintain brand voice throughout**
5. **Run through brand-guardian for validation**

## Output Format

When repurposing content, output:

```markdown
## Original ([Source Platform])
[Original content]

## Repurposed for [Target Platform]
[Transformed content]

### Transformation Notes
- Key changes made
- Elements preserved
- Brand voice maintained: Yes/No
```

## Multi-Platform Repurpose

For repurposing to multiple platforms at once:

```markdown
## Original (LinkedIn)
[Content]

---

## X (Tweet)
[280 char version]

## X (Thread)
1/ [Hook]
2/ [Point 1]
...

## Email
**Subject:** [Subject line]
**Preview:** [Preview text]

[Body]

## Discord
[Casual version]
```

## Quality Checks

Before delivering repurposed content:

1. [ ] Core message preserved
2. [ ] Platform constraints met (char limits, format)
3. [ ] Tone appropriate for platform
4. [ ] Brand voice maintained
5. [ ] No AI-detection flags (arrows, generic phrases)
6. [ ] Hook optimized for platform
7. [ ] CTA appropriate for platform

## Repurpose Chain Tracking

Track the content family:

```
📄 Original: LinkedIn Post (Jan 15)
└── 𝕏 Tweet (Jan 15)
└── 🧵 Thread (Jan 16)
└── 📧 Email (Jan 17)
└── 💬 Discord (Jan 17)
```

## Common Repurpose Scenarios

| I have... | I need... | Use... |
|-----------|-----------|--------|
| LinkedIn announcement | Quick tweet | LinkedIn → X (Tweet) |
| LinkedIn deep dive | Twitter engagement | LinkedIn → X (Thread) |
| Tweet that went viral | LinkedIn reach | X → LinkedIn (Expand) |
| LinkedIn post | Email to list | LinkedIn → Email |
| Any content | Community announcement | [Any] → Discord |
