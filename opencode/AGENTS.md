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

**Workflow:**

2. **ALWAYS use `notifyOnExit=true`** - To know when a command ends
3. **ALWAYS use `cleanup=true`** - When done with PTYs to free resources

## Parallel Agent Dispatch

**Use when:** 2+ independent tasks without shared state or sequential dependencies.

**Workflow:**

1. **Identify domains** - Group by subsystem (e.g., auth module, database layer, API endpoints)
2. **Create focused tasks** - Each agent gets: specific scope, clear goal, constraints, expected output
3. **Dispatch in parallel** - Use `Task()` tool with appropriate `subagent_type` for each domain
4. **Review & integrate** - Check outputs, verify no conflicts, run full suite

**Prompt structure:**

- Focused scope (one module/subsystem/feature)
- Self-contained context (error messages, relevant code)
- Specific constraints ("don't change production code")
- Clear output expectation ("return summary of root cause and fixes")
