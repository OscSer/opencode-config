---
description: Generate commit for staged changes
agent: general
model: github-copilot/claude-haiku-4.5
---

## Constraints

- No staged changes? Inform user, do NOT stage
- MUST execute commit with Bash, NOT just print
- ONLY command allowed: `git commit`
- Complements the commit with the user's arguments (if any)

## Context

**User args:** `$ARGUMENTS`

**Staged changes (ONLY input, do NOT run git diff):**
!`git diff --cached`

## Step 1: Analyze Observable Changes

**CRITICAL: Only state DIRECTLY observable facts. Never speculate.**

Identify:

1. What changed? (files, functions, values)
2. Observable effect? (only if evident from code)
3. User args context? (use if provided)

**Anti-speculation:**

- Diff: `port: 3000 → 4000` → port changed, you don't know why
- Clear bug fix → describe the fix
- Purpose unclear → describe change factually, don't invent benefits

Commit message = OBSERVABLE FACTS, not assumed intentions

## Step 2: Determine Commit Type

| Type       | When to use                                                      |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | ADD new capability                                               |
| `fix`      | FIX broken behavior                                              |
| `refactor` | IMPROVE code, no behavior change                                 |
| `docs`     | ONLY human-readable docs (READMEs, guides, wikis)                |
| `style`    | Formatting (whitespace, quotes, semicolons)                      |
| `test`     | Add/modify tests                                                 |
| `ci`       | Change CI/CD pipelines                                           |
| `build`    | Build system, dependencies                                       |
| `chore`    | Changes that do not affect the source code (.gitignore, scripts) |
| `perf`     | Improve performance                                              |

**LLM prompt/instructions files are not treated as docs:** `AGENTS.md`, `SKILL.md`, `command/*.md`, `agent/*.md`, or similar → use `feat`/`fix`/`refactor`

## Step 3: Generate Message

**Format:**

```
<type>[optional scope]: <description>

[optional body]
```

**Rules:**

- Lowercase type
- Description: concise, imperative ("add" not "added")
- MUST be factual — only what diff shows
- NEVER assume benefits/reasons not evident in code
- English only

**Body rules:**

- Add ONLY when "why" doesn't fit in description
- Explain context/motivation — don't repeat description
- Separate with blank line

### Message Quality

**Bad (vague) → Good (specific + factual):**

- `chore: change model` → `chore: switch default model to claude`
- `fix: update handler` → `fix: add null check in auth handler`
- `feat: add service` → `feat: add job queue processor`
- `refactor: cleanup code` → `refactor: extract validation logic to utils`
- `test: add tests` → `test: add error cases for payment service`

**NEVER speculate:**

- `chore: switch model for better performance` ← you don't know this
- `refactor: simplify code for maintainability` ← guessing
- `fix: prevent security vulnerability` ← unless explicitly security fix

## Step 4: Execute Commit

Execute: `git commit -m "<message>"`
