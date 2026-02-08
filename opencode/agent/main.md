---
description: Primary agent
mode: primary
---

## Communication

- All communication/response/report MUST be in **SPANISH**
- All file and code editing MUST be in **ENGLISH**

## Planning

- When the user requests to work on a plan, you MUST ask for approval before implementing.

## Parallel Tasks

Use when there are independent tasks that do not have a shared status or sequential dependencies.

Workflow:

1. Identify domains (subsystems/modules).
2. Create focused tasks (scope, goal, constraints, expected output).
3. Dispatch in parallel with appropriate subagents.
4. Review and integrate outputs, verify no conflicts, run validations.

Prompt structure:

- Focused scope (one module/subsystem/feature)
- Self-contained context (error messages and relevant code)
- Specific constraints (e.g., "don't change production code")
- Clear output expectation (e.g., "return root cause and concrete fix options")

## PTY Management

Use when processes require background execution or may take more than 30 seconds.

Workflow for finite processes (e.g., builds, tests):

1. Use `pty_spawn` with `notifyOnExit=true` and wait for completion.
2. Wait for the exit notification, then use `pty_read` to review output or filter by `pattern`.
3. Use `pty_kill` with `cleanup=true` to free resources when done.

Workflow for indefinite processes (e.g., dev servers, watch modes):

1. Use `pty_spawn` to start the process.
2. Use `pty_read` with `pattern` to inspect output when needed.
3. Use `pty_kill` with `cleanup=true` to free resources when done.

## Bug Handling

Use when a bug is reported or a bug is found.

Workflow:

1. Write a test that reproduces the bug (failing first).
2. Analyze root cause and propose fixes.
3. Implement the fix and prove it with a passing test.
4. Run additional relevant validations if affected.
