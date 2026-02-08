---
description: Simplifies and refines code for clarity, consistency, and maintainability
---

## Request

```text
$ARGUMENTS
```

## Your Task

- Start in analysis mode: produce a simplification report first, without modifying files.
- Only apply code changes after explicit approval.
- Simplify code for clarity and maintainability without changing behavior.
- Keep scope tight to provided files/input, or local modified code if no input is provided.
- Prefer explicit, readable code over compact or clever code.

## Scope Selection

First, determine the target scope.

If files, paths, or snippets are provided:

- Use only that scope unless broader cleanup is explicitly requested.

If no input is provided:

- Execute `git diff HEAD` to identify recently modified code and limit changes to those files.

If no applicable changes are found, output `No code to simplify` and stop.

## Approval Gate

Before editing any file, you must:

1. Generate a proposed simplification report.
2. Stop and ask for explicit approval.
3. Apply changes only after approval is given.

If approval is not given, do not modify files.

## Simplification Rules

### Preserve Behavior

- Do not change runtime behavior, side effects, API contracts, or outputs.
- Do not introduce refactors that require architectural migration unless explicitly requested.

### Apply Project Conventions

- Follow repository style and existing patterns.
- Keep naming consistent with surrounding code.
- Keep imports and module usage consistent with local conventions.

### Improve Clarity

- Reduce unnecessary nesting and indirection.
- Remove redundant abstractions when they add no value.
- Split dense expressions into understandable intermediate steps when helpful.
- Avoid nested ternary operators; use `if/else` or clearly structured branching.
- Remove comments that only restate obvious code.

### Keep Changes Focused

- Touch only code that materially benefits from simplification.
- Avoid broad formatting-only churn unrelated to readability improvements.

## Simplification Process

### Pass 1: Inspect

1. Identify candidate files from provided input or `git diff HEAD`.
2. Read current code and locate readability/maintainability pain points.
3. Skip areas where simplification would risk behavior changes.

### Pass 2: Simplify

1. Propose minimal, behavior-preserving refactors.
2. Prefer explicit control flow and clear naming.
3. Keep each proposed change easy to review and justify.
4. Do not modify files in this pass.

### Pass 3: Verify

1. Present the report and request approval.
2. After approval, apply the approved changes only.
3. Re-read updated sections to confirm no logic drift.
4. Ensure consistency with local project patterns.
5. Report what was simplified and why it is clearer.

## Output Format

First response (before approval):

```markdown
# Simplification Proposal

{1-2 sentences: what could be simplified and in which files}

## Proposed Changes

- {path}: {proposed readability/maintainability improvement}
- {path}: {proposed readability/maintainability improvement}

## Behavior Safety

No functional changes are intended.

## Approval

Reply with `approve` to apply these changes, or provide adjustments.
```

Second response (after approval and edits applied):

```markdown
# Simplification Result

{1-2 sentences: what was simplified and in which files}

## Changes Made

- {path}: {readability/maintainability improvement}
- {path}: {readability/maintainability improvement}

## Behavior Check

No functional changes introduced.
```
