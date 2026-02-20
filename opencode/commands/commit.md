---
description: Generate commit for staged changes
agent: general
---

## Your Task

- Generate a concise, factual commit message from the staged diff and execute the commit.
- If there are no staged changes, output `No staged changes to commit` and stop. DO NOT stage any changes.

## Commit Process

### Pass 1: Check Staged Changes

1. Execute `git status --short` to see the current status
2. Execute `git log --oneline -n 10` to see recent commits
3. Execute `git diff --cached` to see staged changes

### Pass 2: Analyze Changes

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

**Rules:**

- Lowercase type, English only
- Subject line <=50 chars recommended (type + scope + description combined)
- Scope optional, only if applicable
- Body optional, only if applicable
- One blank line between subject and body
- No trailing whitespace or periods in subject
- Description is concise and imperative

**Examples:**

```text
feat: add session refresh endpoint
```

```text
fix(parser): handle empty yaml frontmatter

- Return a clear error for missing closing delimiter
- Keep existing parsing behavior for valid files
```

```text
refactor(api): simplify error handling middleware

Consolidate duplicate error response logic into a single helper
function. This reduces code duplication across route handlers and
makes future modifications easier by centralizing error formatting.
```

### Pass 3: Execute Commit

Execute the commit and report the generated message:

```text
<type>[scope]: <description>

[body]
```
