---
description: Generate commit for staged changes
agent: build
---

## Input

**Staged diff:** Provided between `BEGIN STAGED DIFF` and `END STAGED DIFF`.

BEGIN STAGED DIFF
!`git --no-pager diff --cached`
END STAGED DIFF

CRITICAL: Use ONLY the provided diff block. Do not run `git diff`. If the block is missing or empty, output the "No staged changes format" and STOP.

**No staged changes format:**

```
✗ No staged changes to commit
```

## Edge Cases

| Scenario              | Action                                       |
| --------------------- | -------------------------------------------- |
| Merge commit detected | Use type `merge`, describe branches          |
| Binary files in diff  | Mention "binary changes" in body if relevant |
| Pre-commit hook fails | Report hook error, do not retry or modify    |

## Step 1: Analyze Observable Changes

CRITICAL: Only state observable facts from the diff. Never infer intent, benefits, or causality.

**If small diff (few lines):**

- Quick scan: file path + primary change (e.g., "config value updated")

**If complex (multiple files OR >30 lines):**

1. Where changed? (files/modules)
2. What changed? (function/behavior/config/value)
3. Any clear effect visible in code? (only if evident)

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

CRITICAL: LLM instruction files are not treated as docs:
`AGENTS.md`, `SKILL.md`, `command/*.md`, `agent/*.md` → classify as `feat`/`fix`/`refactor`.

## Step 3: Generate Message

Format:

```
<type>[optional scope]: <description>

[optional body]
```

Constraints:

- Subject line: ≤72 chars (type + scope + description combined)
- Body: Optional, max 5 lines, each line ≤80 chars
- Separator: ONE blank line between subject and body
- No trailing whitespace or periods in subject
- Commit message MUST NOT exceed 500 chars total

Rules:

- Lowercase type
- English only
- Description is concise and imperative ("add", "fix", "remove")
- MUST be factual (diff-backed)
- MUST include WHERE the change is (component/module/path)
- Scope Rules (priority order):
  1. **All files in same subfolder (depth=2+)**: use folder name
     Example: `src/auth/login.ts` + `src/auth/logout.ts` → `(auth)`

  2. **Single file**: use parent folder, unless parent is repo root
     Example: `src/pages/dashboard.tsx` → `(pages)`

  3. **Multiple top-level folders**: omit scope
     Example: `src/auth/` + `src/api/` → no scope

  4. **Root-level files**: omit scope
     Example: `package.json` + `tsconfig.json` → no scope

- Body: Use ONLY if one of these is true:
  1. Breaking change details (BREAKING CHANGE: ...)
  2. Multiple logical changes in same commit (list each)
  3. Non-obvious diff context (e.g., "fixes #123", "reverts abc123")

  If used: format as '-' bullets, one change per line.
  NEVER include speculative reasons. If unsure, omit body.

Message Quality (Bad → Good):

- `chore: update config` → `chore(api): increase timeout from 30s to 60s`
- `fix: update handler` → `fix(auth): add null check in login handler`
- `feat: add service` → `feat(queue): add job queue processor`
- `refactor: cleanup code` → `refactor(validation): extract logic to utils`
- `test: add tests` → `test(payment): add error cases for transaction flow`

Speculation examples to avoid:

- `chore: switch model for better performance` ← you don't know this
- `refactor: simplify code for maintainability` ← guessing
- `fix: prevent security vulnerability` ← unless explicitly security fix

## Step 4: Execute Commit (MANDATORY)

CRITICAL: You must execute the commit immediately after generating the message. This is NOT optional.

Execution sequence:

1. Generate commit message from Steps 1-3
2. Run command: `git commit -m "<message>"` (ONLY this command)
3. Capture result:
   - If exit code 0 → report success
   - If exit code ≠ 0 → report failure with error message
4. Report result to user ONLY (no intermediate messages)

**Success format:**

```
✓ Commit created: <hash>
```

**Failure format:**

```
✗ Commit failed: <error message>
```

**CRITICAL:** Do not show internal reasoning or the generated message to the user.
