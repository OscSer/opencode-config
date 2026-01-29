# Global Instructions

These are your non-negotiable rules. You must follow them to the letter

## Communication Rules

- ALL responses to user MUST be in **SPANISH**, but edits to files must be in **ENGLISH**
- User interaction → **SPANISH**
- File editing/code writing → **ENGLISH**

## Planning Rules

- When planning, make the plan concise and focused
- Ask for unresolved/relevant questions (if any) before implementing

## Quality Rules

- ALWAYS check quality gates after changing code (linting, tests, type checks, formatting, etc.)
- DON'T create docs, summaries, or "helpful" READMEs without EXPLICIT user approval
- Prefer minimal changes; avoid unrequested refactors

## PTY Management Rules

**PTY is the PREFERRED tool for any process that might take more than a few seconds or requires interaction.**

### When to Use PTY (Proactive Approach)

- **ALWAYS use PTY for**: dev servers, watch modes, REPLs, interactive programs, build processes, tests, deployments, linting, type checks, etc.
- **Prefer PTY over bash** when:
  - Command might hang or take >30 seconds
  - Need to monitor output while running
  - Might need to send input (Ctrl+C, confirmations, etc.)
  - Running multiple related processes simultaneously

### PTY Best Practices

- **Spawn with descriptive titles**: helps identify sessions in listings
- **Use `notifyOnExit=true`** for all commands that must complete (builds, tests, deployments) - eliminates polling
- **Monitor proactively**: check output periodically with `pty_read` instead of waiting for user complaints
- **Filter for issues**: use `pattern` parameter to search for errors/warnings without reading full output
- **Cleanup properly**: always use `cleanup=true` when killing PTYs to free resources
- **Handle failures gracefully**: if process exits with error, use `pattern` to find the error message

## Coding Rules

| Principle                          | Rule                                                  | Example                                              |
| ---------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **Guard clauses**                  | Handle exceptions early, avoid nesting                | `if (!order) return null;` at the start              |
| **Descriptive names**              | Names reveal intention, no comments needed            | `elapsedMs` not `d`, `isAdmin` not `flag`            |
| **Single responsibility**          | One function = one task                               | Split `handleRegistration` into validate/save/notify |
| **No unnecessary else**            | If `if` ends with `return`, skip `else`               | `if (x) return a; return b;`                         |
| **Immutability**                   | Create new structures, don't mutate                   | `{...cart, items: [...cart.items, item]}`            |
| **Comments explain why**           | Code explains what, comments explain why              | `// Rate limit: 100 req/min per API policy`          |
| **Named constants**                | No magic numbers/strings                              | `MAX_RETRY_ATTEMPTS` not `3`                         |
| **KISS / No overengineering**      | Simplest solution first, no patterns without need     | Direct code over factories/layers without clear case |
| **Avoid premature abstraction**    | Need 2-3 real uses before creating generics           | Prefer small duplication over confusing abstraction  |
| **Size limits**                    | Functions <50 lines, modules with clear scope         | Extract by intention not "cleanup"                   |
| **Interfaces first in boundaries** | Define contracts at I/O edges, decouple domain logic  | `interface UserRepo` not direct DB calls in service  |
| **Testability by design**          | Separate pure logic from effects, inject dependencies | Pass deps as params not globals/singletons           |
| **Concrete names and signatures**  | Functions say what they do, return clear types        | `parseOrderXML` not `processData`, avoid `any`       |
| **Less config, more direct code**  | Explicit code over config-driven unless extensibility | Direct function calls over complex config objects    |
