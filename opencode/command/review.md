---
description: Code review pending changes
agent: plan
---

## Your Task

CRITICAL: Follow these steps sequentially:

1. Execute `DIFF_FILE=$(mktemp) && git --no-pager diff HEAD > "$DIFF_FILE"`
2. Read the file, if it is large, use `Read` tool's offset/limit options to read in batches
3. If the diff is EMPTY, output `No changes to review` and STOP
4. LOAD the `code-review` skill
5. PERFORM the review following the skill's instructions
