# opencode-config

Configuration repository for opencode using Bun.

## Commands

- Install: `bun install`
- Setup: `bun run setup`
- Tests: `bun test`

## Injecting Bash Output

Patterns in custom commands that are auto-injected as context. The agent receives the resolved content, not the raw patterns:

- `$ARGUMENTS`: Command arguments.
- `!command`: Bash execution output.
- `@path/to/file`: File content.

## Important

If you make changes to the installer (`src/installer.ts`), you must run the tests (`bun test`) to verify the integrity of the process.
