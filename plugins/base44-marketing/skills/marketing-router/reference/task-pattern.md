# CC10X Task Hierarchy Pattern

How to create and manage task hierarchies for marketing workflows.

---

## Task Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  PARENT TASK: MARKETING [WORKFLOW]: [topic]                      │
│  Status: in_progress                                             │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── CHILD: [specialist]-agent: Create content
         │         Status: pending → in_progress → completed
         │
         ├─── CHILD: brand-guardian: Review content
         │         Status: pending (blocked by specialist)
         │
         └─── CHILD: memory-update: Log learnings
                   Status: pending (blocked by guardian)
```

---

## Task Creation Protocol

```
# Step 1: Create parent task
TaskCreate({
  subject: "MARKETING [WORKFLOW]: [topic]",
  description: "Full workflow for [description]",
  activeForm: "Creating [content type]"
})
# → Returns parent_id

# Step 2: Create specialist task
TaskCreate({
  subject: "[agent-name]: [action]",
  description: "Create [content type] following brand guidelines",
  activeForm: "Writing [content type]"
})
# → Returns specialist_id

# Step 3: Create guardian task
TaskCreate({
  subject: "brand-guardian: Review [content type]",
  description: "Validate brand consistency, score content",
  activeForm: "Reviewing content"
})
# → Returns guardian_id

# Step 4: Create memory task
TaskCreate({
  subject: "memory-update: Log learnings",
  description: "Update patterns.md, feedback.md, learning-log.md",
  activeForm: "Updating memory"
})
# → Returns memory_id

# Step 5: Set dependencies
TaskUpdate({ taskId: guardian_id, addBlockedBy: [specialist_id] })
TaskUpdate({ taskId: memory_id, addBlockedBy: [guardian_id] })
```

---

## Task Completion Protocol

After each step:
```
TaskUpdate({
  taskId: "[task_id]",
  status: "completed",
  metadata: {
    output_summary: "[brief description]",
    score: [X/10 if applicable],
    evidence_captured: [true/false]
  }
})
```

---

## Workflow Tracking Table

At start of workflow, output:
```markdown
## Workflow: MARKETING [TYPE]

| Task | Agent | Status | Blocked By |
|------|-------|--------|------------|
| Parent | router | in_progress | - |
| Content | [specialist] | pending | - |
| Review | brand-guardian | pending | Content |
| Memory | memory-update | pending | Review |
```

Update as tasks complete.

---

## Validation Gates

| Agent | Required Output | Threshold |
|-------|-----------------|-----------|
| linkedin-specialist | Post + Metadata | Confidence ≥70 |
| x-specialist | Tweet/Thread + Metadata | Confidence ≥70 |
| copywriter | Copy + Framework used | Confidence ≥70 |
| seo-specialist | Content + SEO Metadata | Confidence ≥70 |
| brand-guardian | Score + Verdict | Score ≥7/10 |

---

## Validation Check (After EVERY agent)

```
### Agent Validation: {agent_name}
- Required Sections: [Present/Missing]
- Confidence Score: [X/100 or X/10]
- Threshold Met: [Yes/No]
- Proceeding: [Yes/No + reason]
```

---

## Failure Handling

If confidence < threshold OR required sections missing:
1. Create remediation task
2. Block downstream tasks
3. Do NOT proceed to brand-guardian with incomplete content

```
TaskCreate({
  subject: "REMEDIATE: {agent_name} output incomplete",
  description: "Missing: {what's missing}\nRequired: {what's needed}",
  activeForm: "Fixing content"
})
TaskUpdate({ taskId: guardian_id, addBlockedBy: [remediation_id] })
```

---

## Brand Guardian Verdicts

| Score | Verdict | Action |
|-------|---------|--------|
| 9-10 | APPROVED | Deliver to user |
| 7-8 | APPROVED WITH NOTES | Deliver + show suggestions |
| 5-6 | NEEDS REVISION | Return to specialist |
| 1-4 | REJECTED | Rewrite from scratch |

**CRITICAL:** Score < 7 = content does NOT leave the system
