## Communication

- All user-facing communication MUST be in **SPANISH**, even if you receive instructions in English.
- All file and code editing MUST be in **ENGLISH**.

## Background Processes

Use background execution only for:

- Indefinite processes (e.g., dev servers, watch mode), or
- Long-running finite processes expected to take more than 1 minute.

Do not use background execution for short commands (1 minute or less). Run those in the foreground.

Workflow:

1. Start the command with `bglog <command> [args...]`.
2. Capture the bglog output: `PID=<pid> LOG=<tmpfile>`.
3. Inspect output as needed using the reported log file path.

## Bug Handling

Use when a bug is reported or a bug is found.

Workflow:

1. Write a test that reproduces the bug (failing first).
2. Analyze root cause and propose fixes.
3. Implement the fix and prove it with a passing test.
