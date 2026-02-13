# Campaign: Secure Before You Ship

> **Type:** Awareness + Education
> **Goal:** Reduce the number of Base44 apps going live with exposed user data
> **Status:** Ready to execute

---

## The Insight

A Base44 builder built a booking system for a barber shop. The app was live, serving real customers. One day, a client messaged her: "I can see other people's email addresses and phone numbers."

She didn't know what Row-Level Security was. She tried to fix it through the AI chat. The fix broke her booking logic. To keep her business running, she reverted the security changes.

**Her app is still live with user data exposed.**

She also didn't know Base44 has a built-in Security Scan feature.

This is not one user. Research across 34 interviews and 8,400+ WhatsApp messages shows:
- Non-technical builders don't know RLS exists until something breaks
- Even users who know about security can't configure it reliably (one user filed 50 support tickets)
- An agency owner hired a dedicated coder because he can't trust AI-generated security configurations
- Users see security concerns about Base44 on social media, eroding trust

---

## Campaign Components

### 1. Email Sequence: "Is Your App Ready to Go Live?"

**Trigger:** Builder has been building for 7+ days OR has connected a custom domain

**Email 1 — "The thing most builders forget"**
- Hook: A builder's client discovered their data was visible to other users
- Core message: Before you publish, run the Security Scan
- CTA: "Run Security Scan Now" (deep link into Base44)
- Include: 30-second video showing where to find Security Scan

**Email 2 — "Row-Level Security in 5 minutes"**
- Hook: "Your app's database might be returning all records to every user"
- Core message: What RLS is, why you need it, how to set it up
- CTA: "Watch the RLS Setup Guide" (link to video tutorial)
- Include: Before/after screenshot — data visible vs. data filtered

**Email 3 — "Your pre-launch checklist"**
- Hook: "7 things to check before your first real user signs up"
- Core message: Security Scan + RLS + custom domain + email sender + auth setup + mobile test + backup
- CTA: "Download the Launch Checklist" (PDF)
- Include: Badge — "Secured by Wix Infrastructure — SOC 2 Type II"

### 2. In-App Prompt (Product Collaboration)

**Trigger:** Builder clicks "Publish" for the first time

> **Before you go live, have you secured your app?**
>
> Base44 includes a built-in Security Scan that checks for data exposure.
> Most builders don't know about it — running it takes 30 seconds.
>
> [Run Security Scan] [Skip for now]

**If user skips:** Show yellow banner on dashboard:
> "Security Scan has not been run on this app. [Run now]"

### 3. Blog Post: "Your Base44 App Might Be Leaking Data"

Structure:
1. Open with Katy's story (anonymized: "A builder's client messaged her...")
2. What RLS is (30-second explanation)
3. How to run Security Scan (screenshots)
4. How to set up RLS (step-by-step)
5. Pre-launch checklist (7 items)
6. Close with "Secured by Wix Infrastructure" trust signal

### 4. WhatsApp Community Actions

- Pin message in all 3 Base44 groups: Security Checklist + link to Security Scan docs
- Weekly "Security Tip of the Week" for 4 weeks
- When users share apps for feedback, respond with "Have you run Security Scan?"

### 5. Social Content (3 posts)

**Post 1:** "We interviewed 15 Base44 builders. The #1 thing they wished they'd done earlier? Run a security check before publishing."

**Post 2:** "A builder's client messaged her: 'I can see other people's phone numbers.' She didn't know about Row-Level Security. Most builders don't. Here's what it is and how to set it up:" [thread/carousel]

**Post 3:** "Base44 runs on Wix infrastructure. SOC 2 Type II. ISO 27001. But none of that matters if you don't configure your app's security. Here's the checklist:"

---

## Supporting Content: Security & Enterprise Marketing Plan

### RLS Deep-Dive Video Course (30 min)
- Lesson 1: What is RLS and why you need it
- Lesson 2: Simple setup (admin vs. user)
- Lesson 3: Complex hierarchies (Regional Manager, CFO, Staff)
- Lesson 4: Testing your security configuration
- Lesson 5: What to do when it breaks (safe recovery)

Format: Screencast with real Base44 app, NOT documentation.

### Enterprise Trust Page (/enterprise or /security)
- SOC 2 Type II + ISO 27001 badges
- Data residency information
- Encryption details (at rest + in transit)
- "Backed by Wix" trust signal
- Enterprise comparison table (vs. Power Platform, Retool, internal dev)
- Contact form for enterprise team

### Monthly Security Office Hours
- "Security Clinic" — bring your app, get help configuring RLS
- Record and publish as content library

### Case Studies
- Paul Dean: "How an Australian agency runs client operations on Base44"
- Chuck Clark: "Multi-tenant SaaS for 20+ salons"
- Microsoft hackathon: "Won first place at Microsoft with a Base44 app"

---

## Assets Needed

- [ ] Blog post
- [ ] 3 emails (copywriting)
- [ ] 30-second Security Scan walkthrough video
- [ ] RLS setup tutorial video (5-10 min)
- [ ] Pre-launch checklist PDF
- [ ] In-app prompt copy + design (product collaboration)
- [ ] 3 social posts (X + LinkedIn)
- [ ] WhatsApp pinned message copy

---

## Success Metrics

| Metric | Target (30 days) |
|--------|-----------------|
| Security Scan usage (% of published apps) | 50% |
| Email open rate (sequence) | 40%+ |
| Blog post views | 2,000+ |
| Support tickets about data exposure | -50% |
| "I didn't know about Security Scan" mentions | Near zero |

---

## Timeline

| Week | Action |
|------|--------|
| Week 1 | Publish blog post. Pin WhatsApp message. First social post. Set up email sequence |
| Week 2 | Request in-app prompt from product. Publish RLS video tutorial |
| Week 3 | Launch checklist PDF. Second social post |
| Week 4 | Measure Security Scan adoption. First Security Office Hours session |

---

*Campaign ready to execute. All evidence backed by 34 real interviews.*
