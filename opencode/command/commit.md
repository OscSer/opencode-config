---
description: Generate commit for staged changes
agent: general
model: opencode/big-pickle
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

1. **Where** changed? (file, component, module, command, agent)
2. **What** changed? (specific property, function, value)
3. Observable effect? (only if evident from code)
4. User args context? (use if provided)

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
- MUST specify WHERE the change occurred (affected entity/component/module)
- NEVER assume benefits/reasons not evident in code
- Add body ONLY when "why" doesn't fit in description
- English only

### Message Quality

**Bad (vague) → Good (specific + contextual):**

- `chore: update config` → `chore(api): increase timeout from 30s to 60s`
- `fix: update handler` → `fix(auth): add null check in login handler`
- `feat: add service` → `feat(queue): add job queue processor`
- `refactor: cleanup code` → `refactor(validation): extract logic to utils`
- `test: add tests` → `test(payment): add error cases for transaction flow`

**NEVER speculate:**

- `chore: switch model for better performance` ← you don't know this
- `refactor: simplify code for maintainability` ← guessing
- `fix: prevent security vulnerability` ← unless explicitly security fix

## Step 4: Execute Commit

Execute: `git commit -m "<message>"`
