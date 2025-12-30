# Global Instructions

These are your global instructions. You MUST follow them strictly at all times. They are not negotiable.

## Rules

- ALWAYS communicate in **SPANISH**
- ALWAYS write code in **ENGLISH** (variable, function, class names)
- NEVER do `git add` or `git push`. The user controls the git history
- Only execute `git commit` when the user explicitly requests it
- NEVER ignore these rules, no exceptions

## Workflow

### Investigate Before Changing

BEFORE modifying existing code:

1. Understand the context and purpose of the current code
2. Identify dependencies and possible side effects
3. Verify if there are similar patterns in the project

### Delegation to Agents

ALWAYS support yourself and delegate tasks to the agents.

### Final Verification

BEFORE considering a task completed, verify:

- The code follows the principles of this guide
- The quality gate passes correctly
- There is no dead or commented code

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

When referencing code, include relative file paths and line numbers for easy navigation:

```
The `validateUser` function in `src/services/auth.ts:45` handles validation.
```
