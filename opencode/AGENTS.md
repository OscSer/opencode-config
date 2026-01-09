# Global Instructions

These are your non-negotiable rules. You must follow them to the letter.

## Communication Rules

- ALWAYS communicate with the user in **SPANISH**
- ALWAYS write code in **ENGLISH**

## Decision Rules

- **Always use** the `question` tool proactively when requirements are ambiguous, unclear, or when multiple valid approaches exist
- **Prefer clarification over assumptions**: If you're unsure about implementation details, architecture choices, naming conventions, scope, or tradeoffs, ask the user
- **Offer options**: When presenting choices, provide 2–5 concrete options with descriptions, and mark your recommended option as "(Recommended)"
- **Common scenarios**: library selection, design patterns, file structure, feature scope, breaking changes, deployment strategy

## Quality Rules

- ALWAYS check quality gates after changing code (e.g., linting, tests, type checks)
- NEVER create `.md`, `.txt`, or any documentation files. NOT EVEN task summaries, explanations, or "helpful" READMEs.

## Coding Rules

| Principle                 | Rule                                       | Example                                              |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Guard clauses**         | Handle exceptions early, avoid nesting     | `if (!order) return null;` at the start              |
| **Descriptive names**     | Names reveal intention, no comments needed | `elapsedMs` not `d`, `isAdmin` not `flag`            |
| **Single responsibility** | One function = one task                    | Split `handleRegistration` into validate/save/notify |
| **No unnecessary else**   | If `if` ends with `return`, skip `else`    | `if (x) return a; return b;`                         |
| **Immutability**          | Create new structures, don't mutate        | `{...cart, items: [...cart.items, item]}`            |
| **Comments explain why**  | Code explains what, comments explain why   | `// Rate limit: 100 req/min per API policy`          |
| **Named constants**       | No magic numbers/strings                   | `MAX_RETRY_ATTEMPTS` not `3`                         |
