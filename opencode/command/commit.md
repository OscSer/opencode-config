---
description: Generate commit for staged changes
agent: general
model: opencode/big-pickle
---

## Constraints

- If there are no staged changes: inform the user and STOP.
- MUST execute the commit via Bash (do not only print the message).
- Only git write action allowed: `git commit` (no staging, no reset, no amend).
- Use the user's arguments to constrain the message (if any).

## Context

**User args:** `$ARGUMENTS`

**Staged diff (provided as input; DO NOT run git diff):**
!`git diff --cached`

## Step 1: Analyze Observable Changes

CRITICAL: Only state directly observable facts from the diff. Never speculate.

Identify:

1. Where changed? (files/modules)
2. What changed? (function/behavior/config/value)
3. Any clear effect visible in code? (only if evident)
4. Any constraints from user args?

Anti-speculation examples:

- Diff shows `port: 3000 → 4000` → say port changed, not why
- If purpose unclear → describe facts, do not invent benefits

## Step 2: Determine Commit Type

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

Note: LLM instruction files are not treated as docs:
`AGENTS.md`, `SKILL.md`, `command/*.md`, `agent/*.md` → classify as `feat`/`fix`/`refactor`.

## Step 3: Generate Message

Format:

```
<type>[optional scope]: <description>

[optional body]
```

Rules:

- Lowercase type
- English only
- Description is concise and imperative ("add", "fix", "remove")
- MUST be factual (diff-backed)
- MUST include WHERE the change is (component/module/path)
- Scope rule: use a scope only when the diff clearly maps to a single area (folder/module); otherwise omit.
- Body only if a necessary, observable "why" does not fit the header

Message Quality (Bad → Good):

- `chore: update config` → `chore(api): increase timeout from 30s to 60s`
- `fix: update handler` → `fix(auth): add null check in login handler`
- `feat: add service` → `feat(queue): add job queue processor`
- `refactor: cleanup code` → `refactor(validation): extract logic to utils`
- `test: add tests` → `test(payment): add error cases for transaction flow`

NEVER speculate:

- `chore: switch model for better performance` ← you don't know this
- `refactor: simplify code for maintainability` ← guessing
- `fix: prevent security vulnerability` ← unless explicitly security fix

## Step 4: Execute and Finish

EXECUTE `git commit -m "<message>"` and finish WITHOUT any further action.
