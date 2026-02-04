# Global Instructions

## Communication (CRITICAL)

- All responses to user MUST be in **SPANISH**
- File and code editing MUST be in **ENGLISH**

## Planning

When planning:

- Make the plan concise, focused, and checklist-like
- Ask for relevant questions before implementing (`question` tool)

## Quality and Validation

- Prefer minimal changes; avoid unrequested refactors
- Don't create docs, summaries, or READMEs without explicit user approval
- Check quality gates after changing code (e.g., linting, tests, type checks)

## PTY Management

**Use when:** Processes that require background execution or that may take more than 30 seconds

**Workflow for finite processes (e.g., builds, tests):**

1. **Use `pty_spawn` with `notifyOnExit=true`** - Wait for the process to complete
2. **When notified of exit**, use `pty_read` to get all output or serach by `pattern`
3. **Use `pty_kill` with `cleanup=true`** - Free resources when done

**Workflow for indefinite processes (e.g., dev servers, watch modes):**

1. **Use `pty_spawn`** - Start the process
2. **Use `pty_read` with `pattern`** - Read output as needed
3. **Use `pty_kill` with `cleanup=true`** - Free resources when done

## Parallel Agents

**Use when:** 2+ independent tasks without shared state or sequential dependencies.

**Workflow:**

1. **Identify domains** - Group by subsystem (e.g., auth module, database layer, API endpoints)
2. **Create focused tasks** - Each agent gets: specific scope, clear goal, constraints, expected output
3. **Dispatch in parallel** - Use appropriate subagents for each domain
4. **Review & integrate** - Check outputs, verify no conflicts, run full suite

**Prompt structure:**

- Focused scope (one module/subsystem/feature)
- Self-contained context (error messages, relevant code)
- Specific constraints ("don't change production code")
- Clear output expectation ("return summary of root cause and fixes")

## Bug Handling

When I report a bug, don't start by trying to fix it. Instead:

1. **Write a test that reproduces the bug** - Create a failing test case that demonstrates the issue
2. **Use subagents to analyze the bug** - Dispatch parallel agents to investigate and propose fixes
3. **Prove the fix with a passing test** - Verify the solution by ensuring the test now passes

This approach ensures bugs are properly understood, reproducible, and verified as fixed.
