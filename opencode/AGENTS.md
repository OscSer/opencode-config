## Communication

- All communication addressed to me MUST be in **SPANISH**, even if you receive instructions in English.
- All file and code editing MUST be in **ENGLISH**.
- When presenting options to me, always label or enumerate them explicitly.

## Background Processes

Use this workflow when you need to run processes indefinitely (e.g., dev servers, watch mode) or other long-running processes:

1. Start the command with `nohup <command> [args...] > /tmp/<name>.log 2>&1 &`.
2. Capture the PID with `echo $!`.
3. Inspect output as needed using the log file path.
