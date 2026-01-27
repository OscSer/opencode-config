---
description: Code review pull request
agent: plan
---

## Input

- PR number/url: $ARGUMENTS

## Your Task

CRITICAL: Follow these steps sequentially:

1. Extract PR number from the input
2. If it is not possible to determine the PR number, output `No changes to review` and STOP
3. Execute `gh pr checkout <number>`
4. Execute `DIFF_FILE=$(mktemp) && gh pr diff <number> > "$DIFF_FILE"`
5. Read the file, if it is large, use `Read` tool's offset/limit options to read in batches
6. LOAD the `code-review` skill
7. PERFORM the review following the skill's instructions
