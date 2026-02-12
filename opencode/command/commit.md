---
description: Generate commit for staged changes
agent: general
model: opencode/kimi-k2.5-free
---

## Input

```text
$ARGUMENTS
```

## Your Task

- Generate a concise, factual commit message from the staged diff and execute the commit.
- If there are no staged changes, output `No staged changes to commit` and stop.
- Use input to complement the commit message when provided.

## Commit Process

### Pass 1: Check Staged Changes

1. Run `git diff --cached` to see staged changes
2. If no diff, stop with `No staged changes to commit` message. DO NOT stage files.

### Pass 2: Analyze Observable Changes

- Only state facts visible in the diff. Never infer intent, benefits, or causality.
- If purpose is unclear, describe facts only.

**Commit Types:**

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

Special Case:

- Markdown files for LLM instruction are not treated as docs (e.g.,`AGENTS.md`, `skill/*.md`, `command/*.md`) -> classify as `feat`/`fix`/`refactor`

**Commit Format:**

```
<type>[optional scope]: <description>

[optional body as bullet list]
```

**Commit Constraints:**

- Lowercase type, English only
- Subject line <=70 chars (type + scope + description combined)
- Scope optional, only if applicable
- Body optional, only if applicable
- Body must be a bullet list (`- item`)
- One blank line between subject and body
- No trailing whitespace or periods in subject
- Description is concise and imperative

**Examples:**

Without body:

```text
feat(auth): add session refresh endpoint
```

With body:

```text
fix(parser): handle empty yaml frontmatter

- Return a clear error for missing closing delimiter
- Keep existing parsing behavior for valid files
```

### Pass 3: Execute Commit

Execute the commit and report the result.

**Success format:**

```text
✓ Commit created: <hash>
```

**Failure format:**

```text
✗ Commit failed: <error description>
```
