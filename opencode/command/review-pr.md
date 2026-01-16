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
4. Execute `gh pr diff <number> > /tmp/pr-diff-<number>.txt`
5. Read the file, if it is large, use `Read` tool's offset/limit options to read in batches
6. LOAD the `code-review` skill
7. PERFORM the review following the OUTPUT FORMAT of the skill
