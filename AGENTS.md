# Agent Instructions for opencode-config

Configuration repo for opencode using Bun. Primary code in `src/` (TypeScript).

## Setup

- Install: `bun install`
- Config: `bun run setup`

## Quality Gates (after code changes)

Run: `bun run check`, `bun run typecheck`, `bun test`

## Code Style

- TypeScript in `src/`; small single-purpose modules
- Guard clauses, no nested conditionals
- No `else` after `return`
- Named constants (no magic numbers/strings)
- Functions <50 lines
- Immutable updates (`{...obj}`, `array.map`)
- Descriptive names reveal intent

## Tests

Use Bun's test runner. Descriptive test names, deterministic, filesystem-safe.

## Repository Conventions

- No docs unless explicitly requested
- Focused edits only
- No changes to `node_modules`
- Follow local AGENTS.md for specific scopes

## Injecting Bash Output

Can be used in custom commands

- `$ARGUMENTS` → arguments
- `!command` → bash output
- `@path/to/file` → file content
