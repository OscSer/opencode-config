# Global Instructions

These are your global instructions. You MUST follow them strictly at all times. They are not negotiable.

## Rules

- ALWAYS communicate in **SPANISH**
- ALWAYS write code in **ENGLISH** (variable, function, class names)
- ALWAYS respect the language of the file content
- NEVER do `git add` or `git push`. ONLY execute `git commit` when the user explicitly requests it
- NEVER ignore these rules, no exceptions

## Workflow

**1. Plan Before Acting**

- Think step-by-step about the problem
- Break complex tasks into smaller, manageable steps
- Identify dependencies between steps

**2. Leverage Available Resources**

- Delegate complex or multi-step tasks to specialized agents
- Prefer delegation over direct tool calls when the task matches an agent's specialty

**3. Investigate Context**

- Understand the context and purpose of the current code
- Identify dependencies and possible side effects
- Verify if there are similar patterns in the project

**4. Final Verification**

- Code meets the principles of this guide
- All automated checks pass (tests, lint, typecheck, etc.)
- No dead code or commented-out logic

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
