---
description: Update the session log
---

## Your Task

- Maintain a single global markdown file named `SESSION.md` at the project root.
- If it does not exist, create it with the required structure.
- Build updates only from the current conversation history available in context.
- Preserve existing content.
- Write content in the same language used for user-facing communication in the current session.

## File Format

`SESSION.md` must always use this structure:

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

## Extraction Rules

- Keep entries in bullet-point format.
- Add a definition bullet when an existing project definition was identified or a new definition was explicitly decided in the conversation.
- Add a change bullet only when a change is explicitly made or confirmed in the conversation.
- Add a file bullet only for high-signal, important paths that help future understanding of architecture, core workflows, or key decisions.
- Prefer a single directory over multiple file paths when files are related and under the same directory.
- Avoid low-signal or easily discoverable paths (test files, snapshots, build artifacts, etc.), unless they are central to a confirmed change.
- Do not invent or infer uncertain items.
- Do not add duplicate information.
