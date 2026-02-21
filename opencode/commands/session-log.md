---
description: Update the session log
---

## Task

- Maintain a single global file `SESSION.md` at project root.
- If missing, create it using the required structure.
- Update it only from current conversation context.
- Preserve existing content.
- Write in the same language used for user-facing communication in this session.

## Required structure

`SESSION.md` must keep this shape:

```markdown
# Session Log

## Definitions

- definition and explanation
- concept and explanation

## Changes

- relevant changes and any impact explicitly stated in the conversation

## Files

- `path/to/directory` - short description
- `path/to/file` - short description
```

## Extraction rules

- Use bullet points only
- Add `Definitions` entries only for explicit definitions/decisions in conversation
- Add `Changes` entries only for explicit or confirmed changes
- Add `Files` entries only for high-signal paths relevant to architecture/workflows/decisions
- Prefer one directory path over many related file paths
- Skip low-signal/discoverable paths (tests, snapshots, build artifacts), unless central to a confirmed change
- Do not infer uncertain items
- Do not duplicate information
