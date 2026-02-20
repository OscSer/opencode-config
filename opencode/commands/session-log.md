---
description: Update the session log
---

## Your Task

- Maintain a single global markdown file named `SESSION.md` at the project root.
- Build updates only from the current conversation history available in context.
- Write content in the same language used for user-facing communication in the current session.
- Extract and record three categories only:
  - definitions
  - changes
  - files

## File Format

`SESSION.md` must always use this structure:

```markdown
# Session Log

## Definitions

- definition and explanation

## Changes

- relevant changes and any impact explicitly stated in the conversation

## Files

- `path/to/directory` - short description
- `path/to/file` - short description
```

## Extraction Rules

- Keep entries in bullet-point format.
- Add a definition bullet when an existing project definition was identified or a new definition was explicitly decided in the conversation.
- Add a change bullet only when a change is explicitly made or confirmed in the conversation.
- Add a file bullet only for high-signal, important paths that help future understanding of architecture, core workflows, or key decisions.
- Prefer a single directory bullet over multiple file bullets when files are related and under the same directory.
- Avoid low-signal or easily discoverable paths (for example: test files, snapshots, fixtures, generated files, lockfiles, and build artifacts), unless they are central to a confirmed change.
- Do not invent or infer uncertain items.
- Do not add duplicate information.

## Update Process

1. Read `SESSION.md` if it exists.
2. If it does not exist, create it with the required structure.
3. Collect new items from conversation history.
4. Append new bullets under the correct section.
5. Preserve existing content.
