---
description: Generate commit for staged changes
agent: build
---

## Constraints

- If there are no staged changes: inform the user and STOP.
- MUST execute the commit via Bash (do not only print the message).
- Only git write action allowed: `git commit` (no staging, no reset, no amend).
- Use the user's arguments to constrain the message (if any).
- Subject line ≤72 chars. If longer, move detail to body.
- If commit fails: report error, do not retry.
- Commit message MUST NOT exceed 500 chars total.

## Edge Cases

| Scenario                  | Action                                                 |
| ------------------------- | ------------------------------------------------------ |
| Merge commit detected     | Use type `merge`, describe branches                    |
| Binary files in diff      | Mention "binary changes" in body if relevant           |
| >15 files OR >3 modules   | Group by module: "refactor(api,auth,db): <summary>"    |
| User args contradict diff | Prioritize diff facts, ignore conflicting args         |
| Pre-commit hook fails     | Report hook error, do not retry or modify              |
| Commit message >500 chars | Invalid - rework to be more concise, focus on key info |

## Context

**User args:**

```text
`$ARGUMENTS`
```

**User args format:** Free-text string that may contain:

- Commit type hint (e.g., "fix", "feat")
- Scope hint (e.g., "auth module")
- Description constraint (e.g., "typo correction")

**Processing:**

1. Extract hints if present
2. Validate against diff (if args say "fix typo" but diff adds features, IGNORE args)
3. If args contain git flags (--amend, --no-verify): REJECT and inform user

**Staged diff:** Available via system injection (pre-executed).

```diff
!`git diff --cached`
```

CRITICAL: Do NOT execute `git diff` yourself. The diff content is the above.

If diff is empty: STOP and inform user "No staged changes to commit".

## Step 1: Analyze Observable Changes

CRITICAL: Only state directly observable facts from the diff. Never speculate.

**If small diff (few lines):**

- Quick scan: file path + primary change (e.g., "config value updated")

**If complex (multiple files OR >30 lines):**

1. Where changed? (files/modules)
2. What changed? (function/behavior/config/value)
3. Any clear effect visible in code? (only if evident)
4. Any constraints from user args?

**Never speculate on intent/benefits.**

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

Rules:

- Lowercase type
- English only
- Description is concise and imperative ("add", "fix", "remove")
- MUST be factual (diff-backed)
- MUST include WHERE the change is (component/module/path)
- Scope Rules (priority order):
  1. **All files in same subfolder (depth=2+)**: use folder name
     Example: `src/auth/login.ts` + `src/auth/logout.ts` → `(auth)`

  2. **Single file**: use parent folder
     Example: `src/pages/dashboard.tsx` → `(pages)`

  3. **Multiple top-level folders**: omit scope
     Example: `src/auth/` + `src/api/` → no scope

  4. **Root-level files**: omit scope
     Example: `package.json` + `tsconfig.json` → no scope

- Body: Use ONLY if one of these is true:
  1. Breaking change details (BREAKING CHANGE: ...)
  2. Multiple logical changes in same commit (list each)
  3. Non-obvious diff context (e.g., "fixes #123", "reverts abc123")

  NEVER include speculative reasons. If unsure, omit body.

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

## Step 4: Execute and Report

1. Execute: `git commit -m "<message>"` via Bash
2. Display to user:

**Success format:**

```
✓ Commit created: <hash>
```

**Failure format:**

```
✗ Commit failed: <error message>
```

**Note:** Steps 1-3 are internal processing. Do NOT show analysis to user.
