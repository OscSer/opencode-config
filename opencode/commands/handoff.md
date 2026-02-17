---
description: Save session context
agent: build
---

## Your Task

Create or update a `SESSION.md` file in the current project root with a concise but complete session handoff in **Spanish**.

The document must preserve cumulative history across sessions and include only essential information:

- What we are trying to achieve
- Key references
- Decisions made
- Work completed so far
- Current status and next steps

## Required Behavior

1. Target file is always `SESSION.md` in the current working directory.
2. If `SESSION.md` does not exist, create it with the template from this command.
3. If it exists, update the snapshot section and append a new session entry.
4. Keep content concise, factual, and actionable.
5. Avoid repeating unchanged historical content.

## Data Collection

Before writing, collect context from:

- Conversation context from this session
- Current repository state
- Local git metadata:
  - `git status --short`
  - `git log --oneline -n 5`
  - `git diff --stat`

## File Format

Use exactly these top-level sections and keep the marker blocks intact for future updates.

```markdown
# Session Handoff

<!-- HANDOFF-SNAPSHOT:START -->

## Estado actual

**Objetivo:**

- <...>

**Proximos pasos:**

- <...>

**Referencias clave:**

- `<ruta/o/recurso>`: <descripción>

<!-- HANDOFF-SNAPSHOT:END -->

## Bitacora de sesiones

<!-- HANDOFF-LOG:START -->

### YYYY-MM-DD HH:mm

**Decisiones tomadas:**

- <...>

**Trabajo realizado:**

- <...>

<!-- HANDOFF-LOG:END -->
```

## Update Rules

- `Estado actual` must reflect the latest reality after this session.
- Add exactly one new log entry per execution.
- New entry goes immediately after `<!-- HANDOFF-LOG:START -->` (newest first).
- Keep each bullet short.

## Output

After writing the file, print a bullet summary of what was recorded.
