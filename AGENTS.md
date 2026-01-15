# Agent Instructions for opencode-config

## Scope

- Applies to the repository root and all subdirectories.
- The `opencode/AGENTS.md` are global rules for opencode config.

## Repository Purpose

- This repo installs config files for opencode using Bun scripts.
- It is a configuration repo, not an app with a build step.
- Primary code lives under `src/` and is TypeScript.

## Setup

- Requires Bun and Node.js installed.
- Install dependencies: `bun install`.
- Install opencode config: `bun run setup`.

## Build / Lint / Test Commands

- Build: no build script (config repo).
- Lint + format check: `bun run check`.
- Type check: `bun run typecheck`.
- Tests: `bun test`.
- Format (writes files): `bun run format`.
- Single test file: `bun test src/installer.test.ts`.
- Single test by name: `bun test -t "should create symlinks"`.
- Watch tests: `bun test --watch`.

## Quality Gates (after code changes)

- Run `bun run check`, `bun run typecheck`, and `bun test`.
- Use `bun run format` only when formatting is required.

## Tooling Notes

- Linting and import sorting use Biome (`biome.json`).
- Formatting uses Prettier (formatter is disabled in Biome).
- TS config is strict and enforces unused checks.

## Code Style Guidelines

- Use TypeScript for all source code in `src/`.
- Keep modules small and single-purpose.
- Prefer direct code over configuration-heavy abstractions.
- Use guard clauses and avoid nested conditionals.
- Avoid `else` after a `return`.
- Avoid magic strings and numbers; use named constants.
- Avoid premature abstraction until a pattern repeats.
- Keep functions under ~50 lines when possible.
- Favor immutable updates (`{ ...state }`, `array.map`).

## Tests

- Tests use Bun’s test runner (`bun:test`).
- Favor descriptive test names that explain behavior.
- Use `beforeEach`/`afterEach` for temp fixtures.
- Keep tests deterministic and filesystem-safe.

## Repository Conventions

- Do not add documentation unless explicitly requested.
- Keep edits focused on the requested change.
- Do not add or change files under `node_modules`.
- Follow local AGENTS.md files for specific scopes.

## Notes for Agentic Tools

- Use the provided scripts instead of ad-hoc commands.
- Keep shell commands safe and reproducible.
- Prefer editing existing files over adding new ones.
