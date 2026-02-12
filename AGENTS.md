# AGENTS.md

Agent operating guide for `opencode-config`.

## Scope

- Applies to the whole repository.
- Prefer minimal, targeted changes.
- Keep generated diffs small and easy to review.

## Project Summary

- Language: TypeScript (ESM) on Bun.
- Main script: `src/installer.ts`.
- Tests: `src/installer.test.ts` using `bun:test`.
- Purpose: symlink `opencode/` assets into `~/.config/opencode/`.

## Environment Expectations

- Node/Bun runtime: Bun (not npm/yarn/pnpm) for scripts.
- TypeScript is strict (`tsconfig.json` has `strict: true`).
- Formatting/linting is enforced with Biome.
- Pre-commit uses Husky + lint-staged.

## Install

- Install dependencies: `bun install`.
- Initialize hooks (usually automatic): `bun run prepare`.

## Build, Lint, Test Commands

- Setup config locally: `bun run setup`.
- Run all tests: `bun run test`.
- Run one test file: `bun test src/installer.test.ts`.
- Run one test by name regex: `bun test -t "should create symlinks for files"`.
- Run one test file and one name pattern: `bun test src/installer.test.ts -t "idempotent"`.
- Lint + format check: `bun run check`.
- Auto-format + safe fixes: `bun run format`.
- Type-check only: `bun run typecheck`.

## Recommended Validation Order

- `bun run format`
- `bun run check`
- `bun run typecheck`
- `bun run test`

## Fast Path For Small Changes

- For docs-only edits: run `bun run check`.
- For TS code edits: run `bun run check && bun run typecheck && bun run test`.
- For test-only edits: run `bun test src/installer.test.ts` first, then full `bun run test`.

## Source Layout

- `src/installer.ts`: installer implementation.
- `src/installer.test.ts`: behavior and regression tests.
- `opencode/`: config assets to be linked.
- `.husky/pre-commit`: runs `bunx lint-staged`.
- `biome.json`: formatter/linter config.

## Testing Guidelines

- Framework: `bun:test` (`describe`, `it`, `expect`, `beforeEach`, `afterEach`).
- Use isolated temp directories (`fs.mkdtemp`) per test.
- Cover both success and failure paths.
- Test idempotency for filesystem operations.
- Prefer behavioral assertions over implementation details.
- For bug fixes:
  - add a failing test first,
  - implement minimal fix,
  - confirm test passes,
  - run full suite.

## Change Management

- Keep PRs focused; avoid unrelated refactors.
- Preserve public behavior unless task explicitly changes it.
- Update docs when command or workflow changes.
- If adding scripts, wire them through `package.json`.

## Agent-Specific Notes

- Do not introduce new tooling when existing scripts cover the need.
- Prefer repository scripts over raw equivalent commands.
- If unsure, follow patterns already in `src/installer.ts` and tests.
