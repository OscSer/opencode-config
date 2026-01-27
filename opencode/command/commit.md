---
description: Generate commit for staged changes
agent: build
---

# Commit Command

## Purpose

Generate a concise, factual commit message from the staged diff and execute the commit.

## User Context

$ARGUMENTS

## Assumptions

- Check staged changes yourself using `git diff --cached`. Do not stage files.
- The ONLY command you need to run is `git commit -m "<message>"`.
- If there are no staged changes, output the no-staged-changes format and stop.

## No Staged Changes

```
✗ No staged changes to commit
```

## Process

1. Analyze observable changes.
2. Determine commit type.
3. Generate commit message.
4. Execute commit and report result.

## Check Staged Changes

1. Run `git diff --cached` to see staged changes
2. If no output, stop with "No staged changes to commit" message
3. Analyze the diff to generate commit message

## Analyze Observable Changes

Only state facts visible in the diff. Never infer intent, benefits, or causality.

- Small diff: list file path and primary change.
- Complex diff: list where changed, what changed, and any clear visible effect.

Examples:

- `port: 3000 -> 4000` means the port changed, not why.
- If purpose is unclear, describe facts only.

## Commit Types

| Type       | When to use                                |
| ---------- | ------------------------------------------ |
| `feat`     | Adds new capability                        |
| `fix`      | Fixes broken behavior                      |
| `refactor` | Improves code without behavior change      |
| `docs`     | Human-readable docs only (READMEs, guides) |
| `style`    | Formatting only (whitespace, quotes)       |
| `test`     | Adds/modifies tests                        |
| `ci`       | CI/CD changes                              |
| `build`    | Build system, dependencies                 |
| `chore`    | Non-source changes (.gitignore, scripts)   |
| `perf`     | Performance improvements                   |

CRITICAL: LLM instruction files are not treated as docs:
`AGENTS.md`, `SKILL.md`, `command/*.md`, `agent/*.md` -> classify as `feat`/`fix`/`refactor`.

## Commit Message Rules

Format:

```
<type>[optional scope]: <description>

[optional body]
```

Constraints:

- Subject line <=72 chars (type + scope + description combined)
- Body optional, max 5 lines, each line <=80 chars
- ONE blank line between subject and body
- No trailing whitespace or periods in subject
- Total message <=500 chars
- Lowercase type, English only
- Description is concise and imperative
- MUST be factual and diff-backed
- MUST include WHERE the change is (component/module/path)

Scope rules (priority order):

1. All files in same subfolder (depth=2+) -> use folder name
2. Single file -> use parent folder unless repo root
3. Multiple top-level folders -> omit scope
4. Root-level files -> omit scope

Body rules: use ONLY if one of these is true:

1. Breaking change details (BREAKING CHANGE: ...)
2. Multiple logical changes in same commit (list each)

If used: format as '-' bullets, one change per line. Never speculate.

## Edge Cases

| Scenario              | Action                                       |
| --------------------- | -------------------------------------------- |
| Merge commit detected | Use type `merge`, describe branches          |
| Binary files in diff  | Mention "binary changes" in body if relevant |
| Pre-commit hook fails | Report hook error, do not retry or modify    |

## Execute Commit (Mandatory)

You must execute the commit immediately after generating the message.

Execution sequence:

1. Generate commit message
2. Run `git commit -m "<message>"`
3. Capture result and report success or failure
4. Report result only, no intermediate messages

Success format:

```
✓ Commit created: <hash>
```

Failure format:

```
✗ Commit failed: <error message>
```
