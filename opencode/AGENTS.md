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
2. **Use `notifyOnExit=true`** - For commands that must complete
3. **Monitor** - Check output with `pty_read`, filter with `pattern` parameter
4. **Send input when needed** - Use `pty_write` for Ctrl+C, confirmations, etc.
5. **Cleanup properly** - Always use `cleanup=true` when killing PTYs to free resources

**Don't use when:** Quick commands (<30 seconds), one-off commands without monitoring needs, or when bash suffices.

**Key parameters:**

- `notifyOnExit` - Get notified when process completes
- `pattern` - Filter errors/warnings without reading full output
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
| **Immutability**                   | Create new structures, don't mutate                   | `{...cart, items: [...cart.items, item]}`            |
| **Named constants**                | No magic numbers/strings                              | `MAX_RETRY_ATTEMPTS` not `3`                         |
| **KISS / No overengineering**      | Simplest solution first, no patterns without need     | Direct code over factories/layers without clear case |
| **Avoid premature abstraction**    | Need 2-3 real uses before creating generics           | Prefer small duplication over confusing abstraction  |
| **Interfaces first in boundaries** | Define contracts at I/O edges, decouple domain logic  | `interface UserRepo` not direct DB calls in service  |
| **Testability by design**          | Separate pure logic from effects, inject dependencies | Pass deps as params not globals/singletons           |

## Specialized Tools

### Playwriter

**Description:** Use to control a browser, automate web interactions, take screenshots, inspect accessibility, debug applications, intercept network requests, and more.

**How to use:** Run `playwriter skill` command

### Mermaid Diagramming

**Description:** Use when you need to create professional diagrams using Mermaid's text-based syntax.

**How to use:** Check `https://raw.githubusercontent.com/softaworks/agent-toolkit/refs/heads/main/skills/mermaid-diagrams/SKILL.md`

### Markdown Converter

**Description:** Use when you need to analyze or convert to markdown files like PDF, Word, PowerPoint, Excel, HTML, CSV, JSON, XML, or EPubs.

**How to use:** Check `https://raw.githubusercontent.com/intellectronica/agent-skills/refs/heads/main/skills/markdown-converter/SKILL.md`

### TypeScript Advanced Types

**Description:** Use for advanced type system including generics, conditional types, mapped types, template literal types, and utility types for building robust, type-safe applications.

**How to use:** Check `https://raw.githubusercontent.com/wshobson/agents/refs/heads/main/plugins/javascript-typescript/skills/typescript-advanced-types/SKILL.md`
