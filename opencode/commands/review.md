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

- Execute `gh pr checkout <number>` (MANDATORY)
- Execute `gh pr view <number> --json title,body`
- Execute `DIFF_FILE=$(mktemp) && gh pr diff <number> > "$DIFF_FILE"`

If no input is provided, this involves local changes:

- Execute `DIFF_FILE=$(mktemp) && git diff HEAD > "$DIFF_FILE"`

In both cases, you must:

- Read the diff file using the `Read` tool's offset/limit options to read in batches
- If the diff is EMPTY, output `No changes to review` and STOP

## Review Process

### Core Principles

- Focus on real, actionable bugs. Ignore trivial style and preference-only feedback.
- Use clear, neutral language. Avoid speculation and vague risk statements.
- Gather sufficient context before flagging any issue.

### Step 1: Analyze Changes

**Objective:** Build a candidate list of possible issues from the diff.

1. Read the diff file in batches using the `Read` tool.
2. Identify possible issues in changed code only.
3. For each candidate, capture:
   - `file:line`
   - One-sentence bug hypothesis
   - Expected failure scenario/impact

Do not report findings yet. This step is hypothesis generation only.

### Step 2: Delegate Verification to General Agent

**Objective:** Validate each candidate issue using deeper context.

- For each candidate from Step 1, run one `general` agent invocation per issue.
- In each invocation, ask `general` to verify or reject the candidate by:
  - Reading the full source file (not only the diff)
  - Reading related tests, imports/exports, interfaces, and config as needed
  - Checking whether the issue is introduced by the changed code
  - Producing concrete evidence and a realistic failure scenario

For each candidate, require a verdict with this structure:

- Verdict: `CONFIRMED` or `DISCARDED`
- Title: short and specific
- Evidence: concrete proof from code/context
- Impact: specific scenario and consequence
- Scope: changed code vs pre-existing code
- Fix: exact action or minimal snippet

If evidence is weak, speculative, or not clearly tied to changed code, mark it `DISCARDED`.

### Step 3: Consolidate and Report Important Findings

Include only `CONFIRMED` issues with concrete evidence.

Report only issues that are important and actionable. Exclude weak or low-value findings unless there is clear evidence of meaningful risk.

Never report:

- Pure style feedback
- Theoretical concerns without evidence
- Pre-existing issues not introduced (or worsened) by the current changes

## Output Format

Always return this format:

```markdown
# Code Review

<1-3 sentences describing what functionality was added/modified/removed>

## Findings

[If there are no reportable findings: `Looks good to me!`]
[Otherwise, list only reportable findings as an enumerated list]

1. **<path/to/file:line - Short title>**
   Issue: <description>
   Fix: <action or snippet>

2. **<path/to/file:line - Short title>**
   Issue: ...
   Fix: ...
```
