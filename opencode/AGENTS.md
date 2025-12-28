# Global Instructions

These are your global instructions. You MUST follow them strictly at all times. They are not negotiable.

## Rules

- ALWAYS communicate in **SPANISH**
- ALWAYS write code in **ENGLISH** (variable, function, class names)
- NEVER do `git add` nor `git push`. The user controls the git history
- Only execute `git commit` when the user explicitly requests it (e.g., `/commit` command)
- NEVER ignore these rules, no exceptions

## Workflow

### Planning

MUST use `TodoWrite` and `TodoRead` for any work that requires multiple steps. This helps you:

- Organize work before starting
- Give visibility of progress
- Don't forget important steps

Mark each task as completed IMMEDIATELY after finishing it. Don't accumulate completed tasks.

### Investigate Before Changing

BEFORE modifying existing code:

1. Understand the context and purpose of the current code
2. Identify dependencies and possible side effects
3. Verify if there are similar patterns in the project

### Quality Gate

IMMEDIATELY after making changes, run the project validations:

- Tests
- Linter
- Type verification
- Any other configured validation

### Incremental Changes

- One commit = one logical change
- Small and atomic changes
- Easy to review and revert

### Final Verification

BEFORE considering a task completed, verify:

- The code follows the principles of this guide
- The quality gate passes correctly
- There is no dead or commented code

## Subagents

| Subagent | When to use it                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search` | Codebase search. Use for finding files, patterns, or understanding how something is implemented.                                                 |
| `oracle` | Expert consultant for complex reasoning, code review, and second opinions. Use when facing difficult problems that benefit from deeper analysis. |

## MCP

| MCP        | When to use it                                                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref`      | Official documentation from primary sources (API/SDK maintainers). **Always use first** for canonical specs and authoritative references.      |
| `context7` | Up-to-date code docs and examples. Use **to complement `ref`** when you need additional code examples or more detailed implementation details. |

## Code Principles

Code should be **clear**, **readable**, and **modular**. It should explain itself without needing comments.

| Principle                 | Rule                                       | Example                                              |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Guard clauses**         | Handle exceptions early, avoid nesting     | `if (!order) return null;` at the start              |
| **Descriptive names**     | Names reveal intention, no comments needed | `elapsedMs` not `d`, `isAdmin` not `flag`            |
| **Single responsibility** | One function = one task                    | Split `handleRegistration` into validate/save/notify |
| **No unnecessary else**   | If `if` ends with `return`, skip `else`    | `if (x) return a; return b;`                         |
| **Immutability**          | Create new structures, don't mutate        | `{...cart, items: [...cart.items, item]}`            |
| **Comments explain why**  | Code explains what, comments explain why   | `// Rate limit: 100 req/min per API policy`          |
| **Named constants**       | No magic numbers/strings                   | `MAX_RETRY_ATTEMPTS` not `3`                         |

## Response Format

When referencing code, include location for easy navigation:

```
The `validateUser` function in `src/services/auth.ts:45` handles validation.
```
