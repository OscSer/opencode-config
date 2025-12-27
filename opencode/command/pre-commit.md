---
description: Run quality gate and detect AI-generated code slop
---

## Overview

Execute `git status --porcelain` to get changed files. If no changes, report and exit.

## Delegation

Launch BOTH tasks in a SINGLE message (parallel). Subagents are isolated—include ALL context in prompts.

```
Task(subagent_type="general", description="Quality Gate", prompt="[QUALITY GATE PROMPT]")
Task(subagent_type="general", description="Slop Detection", prompt="[SLOP DETECTION PROMPT]")
```

---

## Subagent Prompts

Replace `{FILES}` with actual file list in each template.

### Quality Gate Template

````markdown
## Quality Gate Analysis

Analyze: {FILES}

### Checks

Use available commands from project:

1. **Typecheck** - Type verification command
2. **Lint** - Linter/formatter command
3. **Tests** - Test runner command

Skip unavailable checks. Report which were skipped and why.

### Output Format

```
## Quality Gate Report

### Typecheck
- `file:line` - Error description
(or "No issues" / "Skipped: [reason]")

### Lint
- `file:line` - Rule: description
(or "No issues" / "Skipped: [reason]")

### Tests
- Test name - Failure reason
(or "All passing" / "Skipped: [reason]")
```

**Rules:** Run ALL available checks. Report exact paths/lines. Do NOT fix—report only.
````

### Slop Detection Template

````markdown
## Slop Detection Analysis

Analyze: {FILES}

### Criteria

#### Comments

| Context                               | Action   |
| ------------------------------------- | -------- |
| Doc comments (JSDoc, docstrings, etc) | Preserve |
| TODO/FIXME with reason                | Preserve |
| Explains "why" (intent/decision)      | Preserve |
| Describes "what" code does            | Flag     |
| Paraphrases function name             | Flag     |

```
// SLOP: // Function to get user
// VALID: // Using Map for O(1) deletion during cleanup
```

#### Emojis

| Location                   | Action   |
| -------------------------- | -------- |
| UI strings, CLI indicators | Preserve |
| Markdown, user messages    | Preserve |
| Variable/function names    | Flag     |
| Decorative comments        | Evaluate |

#### Excessive Validations

| Context                               | Action   |
| ------------------------------------- | -------- |
| External input (API, user data)       | Preserve |
| Critical path defense                 | Preserve |
| Type already guarantees (typed param) | Flag     |

```
// SLOP: function process(user: User) { if (!user) throw... }
// VALID: const data = parseInput(raw); if (!data.event) throw...
```

#### Type Escape Hatches

| Context                           | Action   |
| --------------------------------- | -------- |
| Library with incorrect types      | Preserve |
| Documented escape hatch with TODO | Preserve |
| Cast to silence compiler          | Flag     |

### Output Format

```
## Slop Detection Report

### Findings
**file.ext**
- Line N: [Category] Description

### Summary
- Files: N | Issues: M
- Categories: comments (X), validations (Y), type escapes (Z), emojis (W)
```

**Rules:** Read files—do NOT guess. Flag with justification. Ambiguous? Note for user review. Do NOT fix—report only.
````

---

## Consolidation

After BOTH subagents complete:

```
## Pre-Commit Analysis

### Quality Gate
[Insert report]

### Slop Detection
[Insert report]

### Action Plan

**Priority 1 - Blocking:** [Quality Gate errors]
**Priority 2 - Recommended:** [Slop findings]
**Priority 3 - Optional:** [Minor issues]

---
Proceed with corrections? (yes/no)
```

---

## Correction Phase

If user confirms:

1. Create TodoWrite with prioritized plan
2. Fix Priority 1 -> re-run Quality Gate
3. Fix Priority 2 -> re-run both phases

---

## Rules

- ALWAYS present consolidated report BEFORE fixes
- NEVER fix without user confirmation

**Anti-patterns:** Sequential task execution, fixing without report, incomplete subagent prompts.
