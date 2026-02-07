# Global Instructions

## Communication (CRITICAL)

- All communication/response/report MUST be in **SPANISH**
- All file and code editing MUST be in **ENGLISH**

## Quality and Validation

- Prefer minimal changes; avoid unrequested refactors
- DON'T create docs, summaries, or READMEs without explicit user approval
- Check quality gates for affected files (e.g., linting, tests, type checks)

## PTY Management

**Use when:** Processes that require background execution or that may take more than 30 seconds

**Workflow for finite processes (e.g., builds, tests):**

1. **Use `pty_spawn` with `notifyOnExit=true`** - Wait for the process to complete
2. **Wait for notification** - Use `pty_read` to get all output or search by `pattern`
3. **Use `pty_kill` with `cleanup=true`** - Free resources when done

**Workflow for indefinite processes (e.g., dev servers, watch modes):**

1. **Use `pty_spawn`** - Start the process
2. **Use `pty_read` with `pattern`** - Read output as needed
3. **Use `pty_kill` with `cleanup=true`** - Free resources when done
