---
description: Update the session log from conversation history
agent: build
---

## Your Task

- Maintain a single global markdown file named `SESSION_LOG.md` at the project root.
- Build updates only from the current conversation history available in context.
- Write content in the same language used for user-facing communication in the current session.
- Extract and record two categories only:
  - key files or directories
  - decisions that were explicitly made and relevant changes

## File Format Rules

- Ensure `SESSION_LOG.md` always has this structure.
- Keep entries in bullet-point format.

```markdown
# Session Log

## Key Files/Directories

- `path/to/file/or/dir` - short description

## Decisions/Changes

- relevant decisions
- relevant changes
```

## Extraction Rules

- Add a key file bullet when a path was identified as important during the conversation.
- Add a decision bullet only when the conversation clearly confirms a choice, constraint, or agreed direction.
- Do not invent or infer uncertain items.
- Do not add duplicate information.

## Update Process

1. Read `SESSION_LOG.md` if it exists.
2. If it does not exist, create it with the required structure.
3. Collect new items from conversation history.
4. Append new bullets under the correct section.
5. Preserve existing content and section order.
