---
description: Update the session log from conversation history
---

## Your Task

- Maintain a single global markdown file named `SESSION.md` at the project root.
- Build updates only from the current conversation history available in context.
- Write content in the same language used for user-facing communication in the current session.
- Extract and record three categories only:
  - key files
  - key definitions (existing project definitions and new definitions decided in the conversation)
  - changes

## File Format Rules

- Ensure `SESSION.md` always has this structure.
- Keep entries in bullet-point format.

```markdown
# Session Log

## Key Files

- `path/to/directory` - short description
- `path/to/file` - short description

## Key Definitions

- definition and explanation

## Changes

- relevant changes and any impact explicitly stated in the conversation
```

## Extraction Rules

- Add a key file bullet when a path was identified as important during the conversation.
- Add a key definition bullet when an existing project definition was identified or a new definition was explicitly decided in the conversation, and it is useful for future context.
- Add a change bullet only when a change is explicitly made or confirmed in the conversation.
- Do not invent or infer uncertain items.
- Do not add duplicate information.

## Update Process

1. Read `SESSION.md` if it exists.
2. If it does not exist, create it with the required structure.
3. Collect new items from conversation history.
4. Append new bullets under the correct section.
5. Preserve existing content and section order.
