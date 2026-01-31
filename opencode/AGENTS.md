# Global Instructions

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

**Use when:** Processes that require background execution or that may take more than 30 seconds (dev servers, watch modes, build processes, tests, etc.)

**The Workflow:**

1. **Spawn with descriptive titles** - Helps identify sessions in listings
2. **Use `notifyOnExit=true`** - To know when a command ends
3. **Use `cleanup=true`** - When done with PTYs to free resources

## Parallel Agent Dispatch

**Use when:** 2+ independent tasks without shared state or sequential dependencies.

**The Workflow:**

1. **Identify domains** - Group by subsystem (e.g., auth module, database layer, API endpoints)
2. **Create focused tasks** - Each agent gets: specific scope, clear goal, constraints, expected output
3. **Dispatch in parallel** - Use `Task()` tool with appropriate `subagent_type` for each domain
4. **Review & integrate** - Check summaries, verify no conflicts, run full suite

**Prompt structure:**

- Focused scope (one module/subsystem/feature)
- Self-contained context (error messages, relevant code)
- Specific constraints ("don't change production code")
- Clear output expectation ("return summary of root cause and fixes")

## Specialized Skills

### Playwriter

**Description:** Use to control a browser, automate web interactions, take screenshots, inspect accessibility, debug applications, intercept network requests, and more.

**How to use:** Run `playwriter skill` command

### Mermaid Diagramming

**Description:** Use when you need to create professional diagrams using Mermaid's text-based syntax.

**How to use:** Check `https://raw.githubusercontent.com/softaworks/agent-toolkit/refs/heads/main/skills/mermaid-diagrams/SKILL.md`

### Markdown Converter

**Description:** Use when you need to analyze or convert files to markdown formats (PDF, Word, PowerPoint, Excel, HTML, CSV, JSON, XML, or EPubs).

**How to use:** Check `https://raw.githubusercontent.com/intellectronica/agent-skills/refs/heads/main/skills/markdown-converter/SKILL.md`

### TypeScript Advanced Types

**Description:** Use for advanced type system including generics, conditional types, mapped types, template literal types, and utility types for building robust, type-safe applications.

**How to use:** Check `https://raw.githubusercontent.com/wshobson/agents/refs/heads/main/plugins/javascript-typescript/skills/typescript-advanced-types/SKILL.md`
