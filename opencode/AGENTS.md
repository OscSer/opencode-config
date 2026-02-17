## Communication

- All user-facing communication MUST be in **SPANISH**, even if you receive instructions in English.
- All file and code editing MUST be in **ENGLISH**.
- When presenting options to the user, always label or enumerate them explicitly (e.g., A, B, C or 1, 2, 3).

## Subagents

Use subagents proactively whenever they can improve speed, coverage, or confidence.

- Prefer `explore` for codebase discovery tasks (finding files, patterns, references, and architecture hotspots).
- Prefer `general` for multi-step execution tasks (research + synthesis, parallelizable work, or complex workflows).
- Launch subagents early instead of doing extensive manual searching first.
- Run multiple subagents in parallel when tasks are independent.
- If a task is simple and localized (1-2 files, clear path), solve it directly without spawning subagents.

## Background Processes

Use when you need to run indefinite processes (e.g., dev servers, watch mode) or long-running processes:

1. Start the command with `nohup <command> [args...] > /tmp/<name>.log 2>&1 &`.
2. Capture the PID: `echo $!`.
3. Inspect output as needed using the log file path.
