---
description: Code review local changes or pull requests
---

## Input

```text
$ARGUMENTS
```

## Your Task

- Perform a focused, high-signal code review.
- Prioritize impactful issues and avoid low-value nitpicks, theoretical concerns, or stylistic preferences.

First, determine whether this involves local changes or a PR.

If input includes a PR number or URL:

- Execute `gh pr checkout <number>`
- Execute `DIFF_FILE=$(mktemp) && gh pr diff <number> > "$DIFF_FILE"`

If no input is provided, this involves local changes:

- Execute `DIFF_FILE=$(mktemp) && git diff HEAD > "$DIFF_FILE"`

In both cases, you must:

- Read the diff file using the `Read` tool's offset/limit options to read in batches
- If the diff is EMPTY, output `No changes to review` and STOP

## Review Process

### Pass 1: Discovery Mode

**Objective:** Find and list ALL potential issues. Be inclusive and comprehensive.

**CRITICAL RULES for Pass 1:**

- **NO ANALYSIS ALLOWED** - Do not evaluate, judge, or reason about issues yet
- **NO CONCLUSIONS** - Do not decide if something is good or bad
- **CAST A WIDE NET** - When in doubt, include it. Better to list and discard later than miss it now

**What to look for:**

- Error handling changes
- Logic changes
- New dependencies
- Resource management (files, connections, memory)
- Security-related code
- API changes
- Data transformations
- State mutations
- Boundary conditions
- Async/await patterns

**OUTPUT - Print this exact format:**

```
PASS 1 COMPLETE - Potential Issues Found:
1. [Brief description] in [file:line]
2. [Brief description] in [file:line]
3. [Brief description] in [file:line]
...
```

**STOP: Pass 1 must be complete before proceeding. Do not continue until the numbered list above is printed.**

---

### Pass 2: Evaluation Mode

**Prerequisite Check:**
Before starting Pass 2, verify you have:

- [ ] Completed Pass 1 with a numbered list of ALL potential issues
- [ ] Printed the "PASS 1 COMPLETE" output with the list

If NO to any above, **GO BACK and complete Pass 1 first.**

**Objective:** Evaluate ONLY the items from Pass 1. Do NOT find new issues.

Before evaluating ANY issue, you MUST gather context by reading files. For each issue in the Pass 1 list:

1. **Read the source file** at the issue location (not just the diff)
2. **Read related files:**
   - Files that import/export the changed code
   - Test files
   - Configuration files
   - API contracts/interfaces
3. **Search codebase** for usage patterns if needed
4. **Evaluation:** apply the 4-check framework using the context gathered:

**Impact Analysis**

- "This would cause [SPECIFIC PROBLEM] when [SCENARIO]"
- If you can't fill in these blanks concretely → DISCARD
- Examples: crash, data loss, security breach, resource leak, API contract violation

**Evidence Check**

- "I know this is a problem because [EVIDENCE]"
- Evidence = observable behavior, error pattern, resource leak pattern, security risk, breaking change
- NOT evidence = "typically," "best practice," "cleaner," "might," "could," style preferences

**Scope Verification**

- "This issue exists in [CHANGED CODE / PRE-EXISTING CODE]"
- Only report if introduced in changed code
- Ignore pre-existing issues unless made worse by changes

**Value Test**

- "Reporting this prevents [CONCRETE NEGATIVE OUTCOME]"
- If outcome is vague, theoretical, or stylistic → DISCARD
- Ask: Would this prevent a real problem or just align with preference?

**CRITICAL: Only report if ALL 4 checks pass with concrete, factual answers.**

**OUTPUT - Print this exact format:**

```
PASS 2 EVALUATION:
- Issue #1: [REPORT/DISCARD] - [brief reason with evidence from files]
- Issue #2: [REPORT/DISCARD] - [brief reason with evidence from files]
...
```

**Remember: The goal is NOT perfection. The goal is preventing real problems.**

### Pass 3: Final Report

Include ONLY the issues marked as REPORT from Pass 2. Do not include DISCARDED issues.

If no issues, return:

```markdown
# Code Review

{1-3 sentences: what functionality was added/modified/removed}

## Findings

Looks good to me!
```

If issues, return:

```markdown
# Code Review

{1-3 sentences: what functionality was added/modified/removed}

## Findings

**{path:line}**
{1-2 sentences explaining the problem and its impact}
{Concrete fix - code snippet or specific action to take}

{repeat for each issue}
```
