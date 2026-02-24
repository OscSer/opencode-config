## Communication

- All communication addressed to the user MUST be in SPANISH
- All file and code editing MUST be in ENGLISH

## Change Strategy

- Prefer minimal and incremental changes over broad refactors

## Background Processes

Use this workflow when you need to run processes indefinitely (e.g., dev servers, watch mode) or long-running processes (e.g., long-running tests):

1. Start the process and capture the PID: `nohup [command] [args...] > /tmp/[file].log 2>&1 & echo $!`
2. Inspect output as needed using the log file path
3. When done, kill the process: `kill [PID]`
