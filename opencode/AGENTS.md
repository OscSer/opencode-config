## Communication

- All communication addressed to me MUST be in **SPANISH**, even if you receive instructions in English.
- All file and code editing MUST be in **ENGLISH**.
- When presenting options to me, always label or enumerate them explicitly (e.g., A, B, C or 1, 2, 3).

## Codebase Discovery

Use proactively the `explore` agent to explore the codebase and find implementations, patterns, flows, and other useful information.

## Background Processes

Use this workflow when you need to run processes indefinitely (e.g., dev servers, watch mode) or other long-running processes:

1. Start the command with `nohup <command> [args...] > /tmp/<name>.log 2>&1 &`.
2. Capture the PID with `echo $!`.
3. Inspect output as needed using the log file path.

## Memory Management

- After any compaction or context reset, call `engram_mem_context` to recover session state before continuing.
- Save memories proactively with `engram_mem_save` after significant work.
