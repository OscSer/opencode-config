# Global Instructions

These are your non-negotiable rules. You must follow them to the letter

## Communication

- ALL responses to user MUST be in **SPANISH**, but edits to files must be in **ENGLISH**
- User interaction → **SPANISH**
- File editing → **ENGLISH**

## Planning

- When planning, make the plan concise and focused
- Ask for unresolved/relevant questions before implementing (`Question()` tool)

## Quality Gates

- Prefer minimal changes; avoid unrequested refactors
- ALWAYS check quality gates after changing code (linting, tests, type checks, etc.)
- DON'T create docs, summaries, or "helpful" READMEs without EXPLICIT user approval

## PTY Management

**Use when:** Processes that might hang, take >30 seconds, or require interaction.

**Examples:** dev servers, watch modes, REPLs, interactive programs, build processes, tests, deployments, linting, type checks, etc.

**The Workflow:**

1. **Spawn with descriptive titles** - Helps identify sessions in listings
2. **Use `notifyOnExit=true`** - For commands that must complete (builds, tests, deployments)
3. **Monitor proactively** - Check output with `pty_read`, filter with `pattern` parameter
4. **Send input when needed** - Use `pty_write` for Ctrl+C, confirmations, etc.
5. **Cleanup properly** - Always use `cleanup=true` when killing PTYs to free resources

**Don't use when:** Quick commands (<30 seconds), one-off commands without monitoring needs, or when bash suffices.

**Key parameters:**

- `pattern` - Filter errors/warnings without reading full output
- `notifyOnExit` - Get notified when process completes
- `cleanup` - Free resources after use

## Parallel Agent Dispatch

**Use when:** 2+ independent tasks without shared state or sequential dependencies.

**The Workflow:**

1. **Identify domains** - Group by subsystem (e.g., auth module, database layer, API endpoints)
2. **Create focused tasks** - Each agent gets: specific scope, clear goal, constraints, expected output
3. **Dispatch in parallel** - Use `Task()` tool with apropriate `subagent_type` for each domain
4. **Review & integrate** - Check summaries, verify no conflicts, run full suite

**Prompt structure:**

- Focused scope (one module/subsystem/feature)
- Self-contained context (error messages, relevant code)
- Specific constraints ("don't change production code")
- Clear output expectation ("return summary of root cause and fixes")

**Don't use when:** Tasks are related, need full system context, exploratory debugging, or agents would interfere (editing same files).

## Coding Principles

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
