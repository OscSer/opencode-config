---
description: Prompt engineering helper
agent: plan
---

User input:

```text
$ARGUMENTS
```

## CRITICAL Rules

- **NO theoretical explanations** - Provide actionable proposals only
- **NO fluff or filler** - Every line must add value
- **NO suggesting techniques without justification** - Only apply when addressing observed problems
- **ALWAYS be specific** - Concrete examples, not abstract advice
- **ALWAYS explain WHY** - Don't list problems without explaining impact

---

## Analysis Workflow

### Step 1: Identify Task Type

Match input to one task:

1. **Create new prompt** - User wants to generate prompt from scratch
2. **Review existing prompt** - User provides a prompt to improve
3. **Diagnose failure** - User describes a problem with existing prompt

### Step 2: Diagnose Issues (for review/failure)

Use this checklist:

| Issue                 | Symptom                                         |
| --------------------- | ----------------------------------------------- |
| Missing output format | Model produces inconsistent/unstructured output |
| Conflicting rules     | Model struggles with contradictory instructions |
| No edge case guards   | Model fails on unexpected inputs                |
| No context provided   | Model doesn't understand domain/project         |
| Tooling unclear       | Model doesn't know when/how to use tools        |
| Too verbose           | Prompt is bloated, hard to parse                |
| Too constrained       | Model is paralyzed by excessive rules           |

### Step 3: Apply Only Necessary Techniques

Only add these if you identified a matching issue in Step 2:

| Technique            | Add ONLY if you found...                                        |
| -------------------- | --------------------------------------------------------------- |
| Few-shot examples    | "Missing output format" OR "No edge case guards" in diagnosis   |
| Chain-of-Thought     | Task requires 3+ sequential steps and model skips/confuses them |
| Role/Persona         | "No context provided" in diagnosis                              |
| Explicit constraints | "No edge case guards" in diagnosis with specific failure cases  |

**When to add examples (part of Few-shot):**

Add 2-4 examples if:

- Output format must be consistent (JSON, tables, specific structure)
- Classification/extraction is involved (categorize, parse, extract fields)
- Edge cases cause failures (empty inputs, special characters, etc.)

Skip examples if:

- Task is trivial (simple rewording, basic Q&A)
- Format is obvious (plain text response)

### Step 4: Output Proposal

Format based on task type (see below).

---

## Output Format

### For Creating New Prompts

```
## Proposed Prompt

[Complete prompt ready to use]

## Why This Works

[3-5 bullet points explaining key decisions]
```

### For Reviewing Existing Prompts

```
## Issues Found

**ISSUE_TYPE**
[Problem description with example if applicable]

**ISSUE_TYPE**
[Problem description with example if applicable]

## Proposed Changes

**Before:** [exact text from original]
**After:** [improved version]
**Justification:** [why this change]
**Impact:** [expected outcome]

[Repeat for each change]
```

### For Diagnosing Failures

```
## Problems Identified

**ISSUE_TYPE**
[Description with example from failure]
[How it affects behavior]

**ISSUE_TYPE**
[Description with example from failure]
[How it affects behavior]

## Proposed Solutions

For each problem:
- Specific change to make
- Why it addresses the root cause

## Verification

[How to test that the fix works]
```

---

## Common Anti-patterns

| Pattern                 | Fix                                       |
| ----------------------- | ----------------------------------------- |
| "Please", "kindly"      | Use imperatives: "Do X", "Generate Y"     |
| "Explain in detail"     | Define exact length/format instead        |
| "Be concise" + "Detail" | Pick one, remove conflict                 |
| No output format        | Specify structure: "Return JSON with {X}" |
| Missing role context    | Add "# Role: You are [expert domain]"     |
