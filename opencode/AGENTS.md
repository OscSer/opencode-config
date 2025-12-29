# Global Instructions

These are your global instructions. You MUST follow them strictly at all times. They are not negotiable.

## Rules

- ALWAYS communicate in **SPANISH**
- ALWAYS write code in **ENGLISH** (variable, function, class names)
- NEVER do `git add` or `git push`. The user controls the git history
- Only execute `git commit` when the user explicitly requests it
- NEVER ignore these rules, no exceptions

## Workflow

### Task Analysis

**STOP!** BEFORE responding to any request, complete this checklist:

1. **Assess Complexity**
   - Simple task (1-2 steps, single file)? → Execute directly
   - Complex task (≥3 steps OR multiple tools)? → Continue to step 2

2. **Check Available Resources**
   - Are there agents that can handle this better?
   - Are there skills applicable to this task?
   - Are any MCPs relevant to this request?

3. **Determine Approach**
   - **Delegate**: When task is complex + requires specialized tools
   - **Execute Directly**: When task is simple + straightforward
   - **Hybrid**: Some parts delegate, some execute directly

**NEVER skip this.** Proper analysis ensures efficient execution.

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
