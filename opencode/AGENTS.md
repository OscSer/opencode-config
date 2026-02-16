## Communication

- All user-facing communication MUST be in **SPANISH**, even if you receive instructions in English.
- All file and code editing MUST be in **ENGLISH**.
- When presenting options to the user, always label or enumerate them explicitly (e.g., A, B, C or 1, 2, 3).

## Finder Subagent

Use `finder` when you determine a task requires extensive codebase discovery (multiple modules, indirect references, unclear ownership, or broad impact).

- Do not use `finder` for trivial lookups (one or two obvious files).
- Use `finder` for read-only discovery to reduce unnecessary file reads.
- The expected response format is a list of relevant files.

## Background Processes

Use when you need to run indefinite processes (e.g., dev servers, watch mode) or long-running finite processes expected to take more than 1 minute:

1. Start the command with `nohup <command> [args...] > /tmp/<name>.log 2>&1 &`.
2. Capture the PID: `echo $!`.
3. Inspect output as needed using the log file path.

## Test Driven Development

Use the `tdd` skill when user wants to build features or fix bugs.
