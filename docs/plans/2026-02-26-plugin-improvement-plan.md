# Base44 Marketing Plugin v2.0 Improvement Plan
Created: 2026-02-26 | Current Version: 1.9.0

## Executive Summary

This plan covers three things: (1) integrating Orbach's 13 anti-AI writing patterns into the plugin's rule system, filling gaps where the plugin currently has no enforcement, (2) fixing known architecture problems that waste tokens and leave dead code around, and (3) restructuring the brand-guardian agent from an empty file into a structured checklist-based quality gate. If executed fully, the plugin will catch more AI-sounding copy before it leaves the system, burn fewer tokens per workflow, and have a brand-guardian that actually works.

## 1. Current State Assessment

### What Works Well

1. **Shared-instructions.md as single source of truth.** Five content agents (`linkedin-specialist`, `x-specialist`, `copywriter`, `seo-specialist`, `ad-specialist`, `video-specialist`) all point to one file for voice rules (line 21 of linkedin-specialist.md: `Read agents/shared-instructions.md first`). This avoids the 6x duplication problem the plugin had before.

2. **RULES.md is well-organized with clear provenance.** Each rule has the name and date of who requested it (e.g., "Asaf 2026-02-06, Ofer 2026-02-08" on rule #14). 22 NEVER + 10 ALWAYS rules, sequential numbering, hard enforcement. The rule lifecycle (1x feedback = log, 2x = promote) in learning-log.md is a real system, not just a wish.

3. **Learning-log.md pattern tracking with counts.** Active patterns have explicit `[COUNT: N]` with promotion thresholds. "Arrow bullets" at COUNT 3 = RULE. "Specific numbers" at COUNT 7 = TOV. This is genuinely useful institutional memory.

4. **Anti-advertising patterns (Shay directive) in tone-of-voice.md.** The TV-Ad Test, the Maor Test, stacked declarative fragment examples, and "advertising melody" detection are all concrete and testable (tone-of-voice.md lines 163-191).

5. **Verification-before-delivery skill is strong.** Self-critique gate (4 questions), stub detection, evidence capture template, debug attempt tracking, and memory integration. This is the most cc10x-aligned skill in the plugin.

6. **Router intent detection is open-ended first.** Phase 1 defaults to conversation, not menu. Phase 2 keyword classification is a fallback. This matches how real users talk (marketing-router SKILL.md lines 29-66).

7. **GTM strategist resists idea dumps.** Lines 119-125 of gtm-strategist.md explicitly ban bulleted idea lists, skipping discovery, producing content, and single-channel thinking. This agent has the strongest anti-pattern enforcement.

8. **Hook-rules skill has concrete banned/approved patterns.** 7 banned hook patterns, 5 approved styles, channel-specific rules, and a validation checklist with 9 items (hook-rules SKILL.md lines 110-123).

### Known Issues

- **brand-guardian.md is EMPTY.** The file is 1 byte. The agent that runs quality gate on ALL content output has zero instructions. This is the single biggest gap in the system -- every content workflow chains to brand-guardian, and it's a blank file. (CLAUDE.md line 66 says it uses Haiku model.)
- **Ghost skill: `landing-page-generator`.** MEMORY.md says 5 broken refs. A grep of the plugin directory finds zero references now (refs may have been in cached files), but the skill was never created. The `base44-landing-page` skill exists and handles this workflow.
- **Voice rules still partially duplicated.** shared-instructions.md (lines 28-44) duplicates RULES.md (rules 1-7). When RULES.md is updated, shared-instructions.md must be manually kept in sync. There's no single-source enforcement between these two files.
- **Router pre-loads ~47KB before routing.** Memory initialization (3 files) + brand context (3 files) happens before intent detection. For a simple "write a tweet" request, the router loads strategy context, learning logs, and campaign history it will never use.
- **8 skills missing from CLAUDE.md documentation.** 20 skills exist on disk; 12 are listed in CLAUDE.md. Missing: `cross-platform-repurpose`, `hook-rules`, `marketing-ideas`, `marketing-psychology`, `nano-banana`, `remotion`, `verification-before-delivery`, `x-viral`.
- **case-studies/index.md has PII.** The file uses descriptive titles ("Founder (ex-Fiverr, 8 years)", "35-year programmer, 20-year business owner", "Calgary-based designer and Wix partner", "College professor (Canada)", "Professor of industrial design (Iowa, USA)") instead of real names, but lines 101-103 list enterprise partnerships by company name (eToro, Similarweb, Deloitte) which may need a sensitivity check.
- **hooks.json references `teammate-idle.sh`.** The file exists in `plugins/base44-marketing/hooks/`, so this is not broken, but the hook script should be audited for correctness.
- **x-specialist.md line 73 uses "Nobody's talking about this but--"** which directly contradicts Orbach Pattern 7 (the "Nobody tells you this" manipulation pattern). This is in the "Phrases That Work" section.
- **tone-of-voice.md line 103-107 uses arrows (-->).** The "Transitions" section example uses `>` blockquotes, which is fine, but the flow pattern "Send. Receive. Read." on line 105 is stacked declarative fragments -- the exact pattern banned by RULES.md rule #19.
- **tone-of-voice.md line 113-118 example headlines violate rules.** "Ship Your App Idea. Today." is choppy cadence (rule #15). "10 Million Apps. One Platform." is TV-ad cadence (rule #19). "What Will You Build?" is a question CTA (rule #6). These are in the "Example Phrases" section that agents read as guidance.
- **Banned words list is shallow.** shared-instructions.md bans ~12 phrases. RULES.md bans ~8 patterns. Orbach's research identifies 100+ banned phrases, 40+ banned adjectives, 30+ banned verbs, and 13 structural patterns. The plugin covers maybe 15% of Orbach's list.
- **Em dash usage is inconsistent.** tone-of-voice.md "Connectors & Transitions" section (lines 56-60) actively recommends em dashes: "And here's the thing--", "What's wild is--". Orbach Pattern 4 flags em dash overuse as an AI tell.
- **Rule-of-three is unaddressed.** No rule in RULES.md or shared-instructions.md flags the AI tendency to group things in threes. Ad-specialist.md generates "3 headline variations" and "3 primary text variations" by default (lines 33-34).
- **"It's not X, it's Y" contrast framing is unaddressed.** No rule bans this pattern anywhere in the plugin.
- **Fake naming / capitalization is unaddressed.** No rule prevents agents from inventing "The Growth Paradox" or "The 5-Step Framework" style capitalizations.
- **Transition word enforcement is missing.** No banned list for "However", "Moreover", "Furthermore", "Additionally" etc. These are classic AI openers that appear in long-form content (SEO, emails).
- **planner.md and gtm-strategist.md don't reference shared-instructions.md.** planner.md (line 19) reads RULES.md directly. gtm-strategist.md (line 23) reads RULES.md directly. Both skip shared-instructions.md, which means they miss anti-AI patterns and anti-TV-ad cadence rules that only exist there.

## 2. Anti-AI Writing Rules Gap Analysis

### Already Covered in Plugin

| Orbach Pattern | Plugin Coverage | Where |
|----------------|----------------|-------|
| Pattern 1 (same words) | PARTIAL. Bans ~12 phrases ("users", "customers", "deploy", "launch", "we're excited to announce", "revolutionary", "game-changing") | RULES.md rules 2-4, shared-instructions.md lines 39-44 |
| Pattern 5 (dramatic short sentences) | YES. Rules 9, 15, 19 ban choppy sentences, "X. Y. Z." structure, TV-ad tagline cadence | RULES.md lines 22, 27, 31 |
| Pattern 9 (emoji spray) | PARTIAL. Rule 11 bans emoji-as-bullets. Each agent has approved emoji lists | RULES.md line 23, linkedin-specialist.md line 29, x-specialist.md line 34 |
| Pattern 10 (transition words) | NO explicit ban, but "passive voice" and "corporate hedging" are banned | shared-instructions.md lines 42-43 |

### Missing from Plugin (Gaps to Fill)

**Pattern 1 - Banned word list is tiny.** The plugin bans about 12 words/phrases. Orbach identifies 33+ banned verbs (leverage, utilize, delve, craft, garner, elevate, amplify, spearhead, streamline, curate, harness, cultivate, navigate, facilitate, embark, empower, bolster, catalyze, augment, maximize, reimagine, resonate, revolutionize, showcase, underscore, unlock, unpack, demystify, foster, enhance, align, cultivate), 39+ banned adjectives (groundbreaking, cutting-edge, innovative, robust, seamless, scalable, transformative, unprecedented, dynamic, holistic, comprehensive, compelling, remarkable, pivotal, crucial, meticulous, multifaceted, profound, vibrant, vital, etc.), 10 banned adverbs (drastically, genuinely, remarkably, significantly, strategically, substantially, profoundly, meticulously, notably, truly), and 15+ banned abstract nouns (paradigm, ecosystem, landscape, synergy, framework, catalyst, cornerstone, deep dive, game-changer, optimization, transformation, intersection, tapestry, interplay, intricacies). None of these are in the plugin's banned lists.

**Pattern 2 - Rule of three.** Not mentioned anywhere in the plugin. The ad-specialist actively encourages it ("3 headline variations", "3 primary text variations"). The hook-rules skill examples use groups of three ("$350K saved. / One app. / Built in a weekend." on line 40). No rule flags trios.

**Pattern 3 - "It's not X, it's Y" contrast framing.** Not mentioned in RULES.md, shared-instructions.md, or tone-of-voice.md. This is a very common AI pattern that agents will produce without a rule against it.

**Pattern 4 - Em dash overuse.** The plugin ACTIVELY ENCOURAGES em dashes. tone-of-voice.md lines 56-60 list em-dash connectors as approved: "And here's the thing--", "What's wild is--", "Speaking of--". These need to be reframed as "use sparingly" rather than default connectors.

**Pattern 6 - Self-narration.** No rule against "Here's why this matters", "The key takeaway is", "The kicker?", "The bottom line?", "This highlights...", "This underscores...", "Let me explain...", etc. These are extremely common in AI-generated marketing copy. The plugin's hook-rules skill actually uses "Here's what we learned" and "Here's what happened:" as approved patterns (x-specialist.md lines 73-75).

**Pattern 7 - "Nobody tells you this."** The x-specialist.md line 73 lists "Nobody's talking about this but--" as a phrase that WORKS. This is exactly what Orbach identifies as manipulative AI rhetoric.

**Pattern 8 - Fake naming / capitalization.** No rule prevents agents from creating "The 5-Step Framework" or "The Growth Paradox" style capitalizations. The copywriter's "THE SLIDE framework" reference (CLAUDE.md line 75) may trigger this pattern in output.

**Pattern 10 - Transition words.** No banned list for sentence-opening transition words: However, Moreover, Furthermore, Additionally, Nevertheless, Notably, Indeed, Consequently, Accordingly, Fundamentally, Essentially, Inherently, Particularly. SEO content and long-form emails will use these heavily.

**Pattern 11 - Significance inflation.** No rule against "marking a pivotal moment", "setting the stage for", "a testament to", "paving the way for". These phrases appear in AI-generated press releases and milestone announcements.

**Pattern 12 - "-ing phrase padding."** No rule against trailing participial phrases: "...highlighting the importance of innovation", "...underscoring the need for data-driven strategies". These add no meaning.

**Pattern 13 - "Is" avoidance / copula substitution.** No rule against "serves as a powerful solution" (instead of "is useful"), "boasts a comprehensive analytics suite" (instead of "has a dashboard"), "stands as" / "functions as" / "acts as" substitutions.

### Proposed New Rules (for RULES.md)

**NEVER DO (Quality Issues) -- add after rule #22:**

23. **No AI filler verbs** - Never use: leverage, utilize, delve, craft (figurative), garner, elevate, amplify, spearhead, streamline, curate, harness, cultivate, navigate (figurative), facilitate, embark, empower, bolster, catalyze, augment, maximize, reimagine, resonate, revolutionize, showcase, underscore, unlock (figurative), unpack (figurative), demystify, foster, enhance. Use the plain word instead: leverage/harness/utilize = use, facilitate = help, craft = write/make, navigate = handle, empower = let/enable, elevate = raise, streamline = simplify, curate = pick. (Orbach, 2026-02-26)

24. **No AI filler adjectives** - Never use: groundbreaking, cutting-edge, innovative, robust, seamless, scalable, transformative, unprecedented, dynamic, holistic, comprehensive, compelling, remarkable, pivotal, crucial, meticulous, multifaceted, profound, vibrant, vital, state-of-the-art, synergistic, tailored, thought-provoking, game-changing, noteworthy, nuanced, paramount. Say what you actually mean. (Orbach, 2026-02-26)

25. **No "it's not X, it's Y" contrast framing** - All variants banned: "It's not about X. It's about Y." / "It's not A. It's not even B. It's actually C." Just say what you mean directly. (Orbach, 2026-02-26)

26. **No self-narration** - Never announce what you're about to say or what you just said. Delete: "Here's why this matters", "The key takeaway is", "The kicker?", "The bottom line?", "This highlights/underscores/speaks to/illustrates/demonstrates/signals/points to/reflects/suggests...", "Now for the interesting part", "What does this mean?", "Why does this matter?", "Why should you care?" Say the thing. Don't narrate around it. (Orbach, 2026-02-26)

27. **No significance inflation** - Never announce importance instead of showing it. Delete: "marking a pivotal moment", "setting the stage for", "a testament to", "paving the way for", "raising the bar", "pushing the envelope", "bridges the gap". If it matters, explain why with a specific fact. (Orbach, 2026-02-26)

28. **No rule-of-three groupings** - If you spot three adjectives, three bullet points, or three parallel phrases, cut to two or expand to four+. Two is almost always enough. Trios are an AI fingerprint. (Orbach, 2026-02-26)

29. **No transition word openers** - Never open a sentence with: However, Moreover, Furthermore, Additionally, Nevertheless, Notably, Indeed, Consequently, Accordingly, Fundamentally, Essentially, Inherently, Particularly. Just start the sentence. (Orbach, 2026-02-26)

30. **No "-ing phrase" padding** - Never end a sentence with a trailing participial phrase that adds no information: "...highlighting the importance of...", "...underscoring the need for...". If the analysis matters, make it a new sentence with specific facts. (Orbach, 2026-02-26)

31. **No copula avoidance** - Use "is" and "has" instead of fancy substitutes. "Serves as a powerful solution" = "is useful". "Boasts a comprehensive analytics suite" = "has a dashboard". "Stands as" / "functions as" / "acts as" = "is". (Orbach, 2026-02-26)

32. **No fake naming** - Don't capitalize ordinary ideas or give them a "The" prefix. "The Growth Paradox", "The 5-Step Framework", "The SMART Method" = just describe what you mean without the branding. If it doesn't have a real established name, don't invent one. (Orbach, 2026-02-26)

**ALWAYS DO -- add after rule #10:**

11. **Use plain words** - Replace: leverage/utilize/harness = use, facilitate = help, implement = start/build, optimize = improve, expedite = speed up, augment = add to, amplify = increase, elevate = raise/improve, empower = let/enable, navigate = handle, spearhead = lead, streamline = simplify, curate = pick, craft = write/make. (Orbach, 2026-02-26)

12. **Vary groupings** - When you find yourself writing three of anything (adjectives, bullets, parallel phrases), change it to two or four+. (Orbach, 2026-02-26)

### Proposed Banned Words List

Create a new file `brands/base44/banned-words.md` that the brand-guardian checks against. Categories:

**Banned verbs (33):** leverage, utilize, delve, craft (figurative), garner, elevate, amplify, spearhead, streamline, curate, harness, cultivate, navigate (figurative), facilitate, embark, empower, bolster, catalyze, augment, maximize, reimagine, resonate, revolutionize, showcase, underscore, unlock (figurative), unpack (figurative), demystify, foster, enhance, align (figurative), double down, dive in

**Banned adjectives (39):** adept, commendable, compelling, comprehensive, crucial, cutting-edge, dynamic, efficient, ever-evolving, exciting, exemplary, game-changing, genuine, groundbreaking, holistic, innovative, invaluable, meticulous, multifaceted, noteworthy, nuanced, paramount, pivotal, profound, remarkable, robust, scalable, seamless, significant, state-of-the-art, streamlined, substantial, synergistic, tailored, thought-provoking, transformative, unprecedented, vibrant, vital

**Banned adverbs (10):** drastically, genuinely, meticulously, notably, profoundly, remarkably, significantly, strategically, substantially, truly

**Banned abstract nouns (30):** bandwidth (figurative), bedrock, cadence (figurative), catalyst, cornerstone, deep dive, ecosystem (figurative), efficiency, framework (when vague), game-changer, guardrails (figurative), headwinds/tailwinds, implementation, innovation, integration, interplay, intersection (figurative), intricacies, juxtaposition, landscape (figurative), linchpin, north star (figurative), optimization, pain point, paradigm, realm, synergy, takeaway, tapestry (figurative), transformation

**Banned transition openers (20):** Arguably, Certainly, Consequently, Hence, However (sentence opener), Indeed, Moreover, Nevertheless, Nonetheless, Thus, Undoubtedly, Accordingly, Additionally, On the contrary, Furthermore, Notably, Essentially, Fundamentally, Inherently, Particularly (sentence opener)

**Banned phrases (50+ most common):** "A testament to...", "In conclusion/summary...", "It's important to note...", "It's worth noting...", "At its core...", "In today's [rapidly evolving] landscape...", "At the end of the day...", "Moving forward...", "That said/being said...", "When it comes to...", "At the intersection of...", "Here's the thing...", "Make no mistake...", "Simply put...", "The reality is...", "Let that sink in", "Read that again", "Full stop/Period.", "Think about that for a second", "This can't be overstated", "Here's why that matters", "And that's okay", "Spoiler alert/Hot take/Pro tip:", "The takeaway/bottom line?", "Level up", "Move the needle", "Low-hanging fruit", "Circle back", "It's a marathon not a sprint", "The elephant in the room", "Only time will tell", "Serves as a reminder", "Paves the way for", "Sheds light on", "Bridges the gap", "Strikes a balance", "Pushes the envelope", "Raises the bar", "Why does this matter?", "Why should you care?", "And here's where it gets interesting"

## 3. CC10x Architecture Comparison

### What CC10x Does Well (That the Plugin Should Adopt)

1. **Contract-based validation.** CC10x routes include a "contract" that defines what the output must contain, structurally. The plugin's brand-guardian is supposed to score 1-10, but it has no instructions (empty file), so it can't enforce anything.

2. **Deferred/lazy loading.** CC10x only loads skill files when a specific workflow triggers. The marketing-router loads memory (3 files) + brand context (3 files) before it even knows what the user wants. That's ~47KB of context for a request that might only need the x-specialist.

3. **Memory persistence protocol.** CC10x auto-updates patterns.md and activeContext.md after every workflow. The plugin's brand-memory skill describes this flow but it depends on manual invocation. No hook auto-triggers memory updates.

4. **Phase-scoped activation.** CC10x loads tools and context per-phase (discovery, implementation, verification). The plugin loads everything upfront in the router.

5. **Quality gates with evidence.** The verification-before-delivery skill (lines 109-151) is already cc10x-aligned with evidence capture, but it's not wired into brand-guardian (which is empty). The evidence template exists but has no enforcer.

### Gap Analysis

| Feature | CC10x Approach | Plugin Current State | Gap |
|---------|---------------|---------------------|-----|
| Output validation | Router contracts define required output structure | Brand-guardian file is empty (0 instructions) | No structured checklist, no scoring criteria, no enforcement |
| Token efficiency | Deferred loading: only load what's needed per workflow | Router pre-loads 6 files (~47KB) before intent detection | Every request pays the full context cost regardless of complexity |
| Voice rules | Single source, referenced once per workflow | shared-instructions.md is the single source, but RULES.md + tone-of-voice.md also loaded separately, creating overlap | 3 files loaded where a unified reference could work |
| Memory | Automated persistence after every workflow | brand-memory skill requires manual invocation, no auto-trigger | Learning only happens when someone remembers to invoke it |
| Quality gates | Evidence-based: checklist with pass/fail, specific criteria | verification-before-delivery has the template, but brand-guardian has no instructions to use it | Strong skill, zero enforcement in the quality gate agent |
| Banned word enforcement | Grep-based automated scan | Manual human review against remembered rules | No automated detection, relies on LLM memory of 100+ banned items |

## 4. Architecture Improvements

### 4.1 Token Efficiency

**Problem:** The router loads 6 files before routing. For simple requests ("write a tweet"), most of this context is wasted.

**Fix:** Split router initialization into two phases.

**Phase 1 (always load, ~5KB):**
- Intent detection keywords only (already in SKILL.md)
- Quick voice reminders (4-line summary already at line 199)

**Phase 2 (load after routing, per-workflow):**
- Brand context files (RULES.md, tone-of-voice.md, learning-log.md) -- loaded by the specialist agent, not the router
- Memory files (activeContext.md, patterns.md, feedback.md) -- loaded only for GTM_STRATEGY, CAMPAIGN, and BRAINSTORM workflows

**Files to edit:**
- `skills/marketing-router/SKILL.md` -- move memory init from mandatory to conditional
- `agents/shared-instructions.md` -- already tells agents to load brand files; make this the ONLY place brand loading happens (remove from router)

**Estimated savings:** ~30KB per simple request (tweet, single post, ad copy)

### 4.2 Deferred Loading

**Problem:** The router's "Reference Files" section (lines 247-250) points to 3 reference files that are loaded every time. The "Supporting Skills" section (lines 228-240) lists 10 skills.

**Fix:** Add a `## Lazy-Load Map` to the router that tells it which reference files to load per workflow, instead of loading all of them:

```
| Workflow | Load These | Skip These |
|----------|-----------|------------|
| X, LINKEDIN | hook-rules, channel template | memory files, strategy context |
| EMAIL | direct-response-copy | hook-rules, memory files |
| SEO | seo-content, geo-content | hook-rules, memory files |
| GTM_STRATEGY | memory files, all brand context | hook-rules |
| CAMPAIGN | everything (justified: multi-channel) | nothing |
```

**File to edit:** `skills/marketing-router/SKILL.md`

### 4.3 Brand Guardian Structured Checklist

**Problem:** `agents/brand-guardian.md` is empty (1 byte). This agent is called by every content workflow.

**Fix:** Write a full brand-guardian agent file with a structured checklist that produces a pass/fail score. The checklist should cover:

1. **Vocabulary check** (5 items): No banned words (users/customers/deploy/launch + Orbach list), correct brand terms (builders, ship, go live)
2. **Structure check** (4 items): No TV-ad cadence, no stacked declaratives, no rule-of-three, varied sentence lengths
3. **Anti-AI check** (5 items): No arrows, no self-narration, no contrast framing, no significance inflation, no transition word openers
4. **Channel fit check** (3 items): Correct format, character limits met, platform-specific rules followed
5. **Maor Test** (1 item): Would Maor post this exactly as written?

**Scoring:**
- Each item: PASS (1 point) or FAIL (0 points)
- 18 items total
- Score = points / 18, mapped to 1-10 scale
- Threshold: 7/10 (= 13/18 checks passing)

**Files to create/edit:**
- `agents/brand-guardian.md` -- write full agent instructions
- `brands/base44/banned-words.md` -- new file, banned word reference for the guardian

### 4.4 Automated Learning Loop

**Problem:** The learning loop (generate -> review -> feedback -> pattern detect -> rules update) described in brand-memory SKILL.md line 87 is manual. Nobody invokes brand-memory after each workflow.

**Fix (two-part):**

**Part 1: Post-review auto-log.** After brand-guardian scores content, if score < 7, auto-append the failure reason to `.claude/marketing/feedback.md`. This can be done by adding explicit instructions in brand-guardian.md:

```
If score < 7:
  Append to .claude/marketing/feedback.md:
  "## [DATE] - [CHANNEL] - Score [X/10]
  **Issue:** [what failed]
  **Rule violated:** [RULES.md rule number]"
```

**Part 2: Session-end pattern check.** At end of session (before session-log), check `.claude/marketing/feedback.md` for patterns appearing 2+ times. If found, prompt user: "Pattern X has appeared N times. Promote to RULES.md?"

**Files to edit:**
- `agents/brand-guardian.md` -- add auto-logging behavior
- `skills/session-log/SKILL.md` -- add pattern promotion check at session end

## 5. Content Quality Improvements

### 5.1 RULES.md Expansion

Add rules 23-32 as detailed in Section 2 "Proposed New Rules" above. This expands RULES.md from 22 NEVER + 10 ALWAYS to 32 NEVER + 12 ALWAYS.

Also fix the rule count in the footer. Current (line 62): "Rules: 22 NEVER + 10 ALWAYS". Update to match actual count.

**File:** `plugins/base44-marketing/brands/base44/RULES.md`

### 5.2 Tone-of-Voice Updates

**Fix contradictory examples.** The following sections of tone-of-voice.md contain patterns that violate RULES.md:

1. **Lines 103-107 (Transitions section):** "Send. Receive. Read. All from your app." is stacked declarative fragments (rule #19). Replace with a flowing example: "Your app can now send and receive emails -- and yes, read them too. Took us 3 days to build."

2. **Lines 113-118 (Example Headlines):** Four of five headlines violate rules:
   - "Ship Your App Idea. Today." -- choppy cadence (rule #15)
   - "10 Million Apps. One Platform." -- TV-ad cadence (rule #19)
   - "What Will You Build?" -- question CTA (rule #6)
   - "Base44: Where Builders Build" -- tagline cadence
   Replace with headlines that sound like Maor: "400K+ builders shipped something this month", "We just crossed $1M ARR. Here's how.", "From side project to SaaS in a weekend."

3. **Lines 56-60 (Connectors):** Em dashes are encouraged here. Add a note: "Use sparingly (1-2 per post max). Too many em dashes is an AI tell."

4. **Lines 123-125 (CTAs):** "See what's possible" violates rule #17 ("see for yourself" CTAs). Replace with "Ship your first app" or "Try it -- takes 5 minutes."

**Add new section: "Banned Words Quick Reference"** pointing to `banned-words.md` for the full list.

**File:** `plugins/base44-marketing/brands/base44/tone-of-voice.md`

### 5.3 Shared-Instructions Updates

1. **Add Orbach pattern references.** After the "Anti-AI Patterns" section (line 55), add:

```markdown
## Banned Words (MANDATORY)

Read `brands/base44/banned-words.md` for the full list. Key categories:
- AI verbs: leverage, utilize, delve, craft, streamline, curate, harness, empower, etc.
- AI adjectives: groundbreaking, robust, seamless, transformative, unprecedented, etc.
- AI transitions: However, Moreover, Furthermore, Additionally, Nevertheless, etc.
- AI phrases: "It's important to note", "At the end of the day", "A testament to", etc.

When you catch yourself using any of these, replace with the plain English alternative.
```

2. **Add rule-of-three warning.** After the Anti-AI Patterns section:

```markdown
## Rule of Three (WATCH FOR THIS)

AI groups everything in threes. If you write three adjectives, three bullets, or three parallel phrases, change it to two or four+. Two is almost always enough.
```

3. **Remove overlap with RULES.md.** Lines 28-44 of shared-instructions.md repeat the "Words to ALWAYS Use" and "Words to NEVER Use" tables that are already in RULES.md rules 1-7. Since shared-instructions.md tells agents to read RULES.md first (line 8), these tables are redundant. Replace with: "See RULES.md for the full banned/required word list. Key reminder: builders (not users), ship (not deploy), no arrows."

**File:** `plugins/base44-marketing/agents/shared-instructions.md`

### 5.4 Agent-Specific Improvements

**x-specialist.md:**
- Line 73: Remove "Nobody's talking about this but--" from "Phrases That Work." This is Orbach Pattern 7. Replace with a specific alternative: "We've been using this for a week and here's what changed."
- Line 34: Approved emoji list includes several Orbach Pattern 9 emojis (rocket, fire, brain, sparkles). Flag these as "use 1 max per post, never as bullets."

**linkedin-specialist.md:**
- Line 29: Approved emoji list includes rocket and sparkles. Add Orbach warning.
- Line 36-58: Structure patterns are fine but all use the rule-of-three (3-section structures). Note in the file: "These are starting points. Vary the section count."

**copywriter.md:**
- Line 75-78: "Hook Patterns" section lists 3 patterns. Add: "Pick one. Don't cycle through all three."
- Lines 53-68: 8-Section Framework is good but inherently formulaic. Add note: "Vary section count per page. Not every page needs all 8."

**ad-specialist.md:**
- Lines 33-34: "3 headline variations" and "3 primary text variations" bake in the rule-of-three. Change to "2-4 headline variations" and "2-4 primary text variations."
- No reference to Orbach banned words. Ads are short, so banned adjectives (innovative, groundbreaking, seamless) are high risk. Add a "Never use in ad copy" mini-list.

**seo-specialist.md:**
- Long-form content is where transition words (However, Moreover, Furthermore) are most likely. Add a "Transition Words" warning section specific to blog posts.
- Line 40-49: Blog structure template uses exactly 4 H2s, which is fine, but the "How to X" section defaults to 3 steps. Note: "Vary step count."

**planner.md:**
- Line 19: Reads RULES.md but not shared-instructions.md. Add shared-instructions.md to the mandatory reading list.
- Lines 81-83: "Key Messages" section defaults to 3 messages. Change to "2-4 key messages."

**gtm-strategist.md:**
- Line 23: Reads RULES.md but not shared-instructions.md. This agent doesn't produce content, but its plans set the brief for specialists. It should know the anti-AI rules. Add shared-instructions.md to reading list.

**video-specialist.md:**
- No issues found. Well-structured, references shared-instructions.md, brand colors are correct.

**brand-guardian.md:**
- MUST BE WRITTEN FROM SCRATCH. See Section 4.3 for full specification.

**Files to edit:** All 9 agent files listed above.

## 6. Actionable Roadmap

### Phase A: Quick Wins (1-2 sessions, high impact)

| # | Task | Files Affected | Effort | Depends On |
|---|------|---------------|--------|------------|
| A1 | Write brand-guardian.md from scratch with structured 18-item checklist, scoring criteria, auto-logging behavior | `agents/brand-guardian.md` | M | - |
| A2 | Create banned-words.md with full Orbach banned word lists (verbs, adjectives, adverbs, nouns, transitions, phrases) | `brands/base44/banned-words.md` (new) | S |  - |
| A3 | Update CLAUDE.md skills table to include all 20 skills (add the 8 missing: cross-platform-repurpose, hook-rules, marketing-ideas, marketing-psychology, nano-banana, remotion, verification-before-delivery, x-viral) | `CLAUDE.md` | S | - |
| A4 | Fix contradictory examples in tone-of-voice.md (headlines, transitions, CTAs that violate RULES.md) | `brands/base44/tone-of-voice.md` | S | - |
| A5 | Remove "Nobody's talking about this but--" from x-specialist.md Phrases That Work, replace with non-manipulative alternative | `agents/x-specialist.md` | S | - |
| A6 | Add shared-instructions.md to planner.md and gtm-strategist.md mandatory reading lists | `agents/planner.md`, `agents/gtm-strategist.md` | S | - |

### Phase B: Anti-AI Rules Integration (2-3 sessions)

| # | Task | Files Affected | Effort | Depends On |
|---|------|---------------|--------|------------|
| B1 | Add NEVER rules 23-32 to RULES.md (Orbach patterns: banned verbs/adjectives, contrast framing, self-narration, significance inflation, rule-of-three, transition openers, -ing padding, copula avoidance, fake naming) | `brands/base44/RULES.md` | M | A2 |
| B2 | Add ALWAYS rules 11-12 to RULES.md (plain words, vary groupings) | `brands/base44/RULES.md` | S | B1 |
| B3 | Update shared-instructions.md: add banned-words reference, rule-of-three warning, remove RULES.md overlap (lines 28-44) | `agents/shared-instructions.md` | M | A2, B1 |
| B4 | Update ad-specialist.md: change "3 variations" to "2-4 variations", add banned adjective mini-list for ad copy | `agents/ad-specialist.md` | S | B1 |
| B5 | Update seo-specialist.md: add transition word warning for long-form content, vary step counts | `agents/seo-specialist.md` | S | B1 |
| B6 | Update linkedin-specialist.md and copywriter.md: add rule-of-three notes, emoji warnings | `agents/linkedin-specialist.md`, `agents/copywriter.md` | S | B1 |
| B7 | Update hook-rules SKILL.md: add Orbach patterns to banned list, flag rule-of-three in examples | `skills/hook-rules/SKILL.md` | S | B1 |
| B8 | Update tone-of-voice.md: add em-dash usage warning, add "Banned Words Quick Reference" section pointing to banned-words.md | `brands/base44/tone-of-voice.md` | S | A2, A4 |
| B9 | Update learning-log.md pattern tracking: add new Orbach-derived patterns as [COUNT: 1] entries in "watching" status | `brands/base44/learning-log.md` | S | B1 |

### Phase C: Architecture Overhaul (3-5 sessions)

| # | Task | Files Affected | Effort | Depends On |
|---|------|---------------|--------|------------|
| C1 | Split router initialization: Phase 1 (intent detect only, ~5KB) vs Phase 2 (brand context loaded by specialist, ~30KB savings per simple request) | `skills/marketing-router/SKILL.md` | L | B complete |
| C2 | Add lazy-load map to router: which reference files load per workflow | `skills/marketing-router/SKILL.md` | M | C1 |
| C3 | Wire verification-before-delivery into brand-guardian: guardian must produce the evidence template from the verification skill | `agents/brand-guardian.md`, `skills/verification-before-delivery/SKILL.md` | M | A1 |
| C4 | Add auto-logging to brand-guardian: failed reviews auto-append to feedback.md with rule number | `agents/brand-guardian.md` | S | A1, C3 |
| C5 | Add pattern promotion check to session-log: at session end, scan feedback.md for patterns appearing 2+ times, prompt user to promote | `skills/session-log/SKILL.md` | M | C4 |
| C6 | Audit and fix hooks.json: verify teammate-idle.sh works, remove any dead references | `.claude-plugin/hooks.json`, `hooks/teammate-idle.sh` | S | - |
| C7 | Scrub case-studies/index.md for remaining PII sensitivity (enterprise partnership names, location details that identify individuals) | `brands/base44/case-studies/index.md` | S | - |
| C8 | Remove all voice rule duplication: shared-instructions.md should reference RULES.md rather than repeating word tables | `agents/shared-instructions.md` | S | B3 |

### Phase D: Advanced Features (future)

| # | Task | Files Affected | Effort | Depends On |
|---|------|---------------|--------|------------|
| D1 | Automated banned-word grep: brand-guardian runs a grep against banned-words.md before scoring, catches violations mechanically instead of relying on LLM memory | `agents/brand-guardian.md`, `brands/base44/banned-words.md` | L | A1, A2, C3 |
| D2 | Rule-of-three detector: brand-guardian scans output for triple patterns (3 adjectives, 3 bullets, 3 parallel phrases) and flags them | `agents/brand-guardian.md` | M | A1, B1 |
| D3 | Version the banned-words list: add a `## Changelog` section so RULES.md and banned-words.md changes are tracked over time | `brands/base44/banned-words.md` | S | A2 |
| D4 | Build a "voice drift" detector: compare recent content scores against historical averages in patterns.md, flag when quality trends downward | `skills/brand-memory/SKILL.md` | L | C4, C5 |
| D5 | Create agent-specific banned-word subsets: ad copy has different risk words than blog posts; create channel-scoped lists | `brands/base44/banned-words.md` | M | A2, D1 |
| D6 | Integrate Orbach "how to add voice back" guidelines: first-person opinions, specific feelings, leaving mess, varied rhythm | `brands/base44/tone-of-voice.md`, `agents/shared-instructions.md` | M | B3 |

## Appendix: Orbach Rules Quick Reference

Condensed version for use during BUILD sessions.

### The 13 Patterns (Detection)

| # | Pattern | What to Look For | Fix |
|---|---------|-----------------|-----|
| 1 | Same words | leverage, utilize, delve, robust, seamless, transformative | Use plain English (see banned-words.md) |
| 2 | Rule of three | Three adjectives, three bullets, three parallel phrases | Cut to two or expand to four+ |
| 3 | "It's not X, it's Y" | Any contrast framing with negation setup | Just say Y directly |
| 4 | Em dash abuse | Multiple em dashes in one piece | Replace most with commas or periods, keep 1-2 max |
| 5 | Dramatic short stacks | "They launched. They failed. They learned." | Vary rhythm, break up with longer sentences |
| 6 | Self-narration | "Here's why this matters", "The key takeaway", "The kicker?" | Delete the narration, just state the fact |
| 7 | "Nobody tells you" | "Nobody talks about this", any "nobody" as dramatic opener | Remove. If nobody talks about it, just explain it. |
| 8 | Fake naming | "The Growth Paradox", "The 5-Step Framework" | Lowercase, no "The" prefix, describe instead |
| 9 | Emoji spray | Rockets, sparkles, targets, brains as decoration | Max 1-3 per piece, never as bullet points |
| 10 | Same transitions | However, Moreover, Furthermore, Additionally, Nevertheless | Delete the transition word, just start the sentence |
| 11 | Significance inflation | "A pivotal moment", "setting the stage", "a testament to" | Replace with a specific fact |
| 12 | -ing padding | "...highlighting the importance of innovation" | Cut the -ing phrase or make it a new sentence with specifics |
| 13 | "Is" avoidance | "serves as", "stands as", "functions as", "boasts" | Replace with "is" or "has" |

### Banned Word Categories (Counts)

| Category | Count | Examples |
|----------|-------|---------|
| Verbs | 33 | leverage, utilize, delve, craft, garner, streamline, curate |
| Adjectives | 39 | groundbreaking, robust, seamless, transformative, unprecedented |
| Adverbs | 10 | drastically, genuinely, remarkably, significantly, truly |
| Abstract nouns | 30 | paradigm, ecosystem, synergy, framework, landscape, catalyst |
| Transition openers | 20 | However, Moreover, Furthermore, Additionally, Nevertheless |
| Phrases | 50+ | "A testament to", "At the end of the day", "Here's why that matters" |

### Plain Word Replacements (Top 15)

| AI Word | Plain Replacement |
|---------|------------------|
| leverage | use |
| utilize | use |
| facilitate | help |
| implement | start, build |
| optimize | improve |
| expedite | speed up |
| augment | add to |
| amplify | increase |
| elevate | raise, improve |
| empower | let, enable |
| navigate | handle, deal with |
| spearhead | lead |
| streamline | simplify |
| curate | pick, choose |
| craft | write, make |

### How to Add Human Voice (After Removing AI Patterns)

1. Have actual opinions: "I don't love this approach" beats balanced analysis
2. Write in first person: "I've tested this" beats "Studies show"
3. Be specific about feelings: not "concerning" but describe what's off
4. Leave some mess: half-formed thoughts, asides, "I'm not sure" are fine
5. Vary rhythm: short then long then short. Same-length sentences = generated

---

*Plan created: 2026-02-26 | Target version: 2.0.0 | Estimated total effort: 4 phases, ~10-15 sessions*
