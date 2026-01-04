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

1. What changed? (files, functions, values)
2. Observable effect? (only if evident from code)
3. User args context? (use if provided)

**Anti-speculation:**

- Diff: `port: 3000 → 4000` → port changed, you don't know why
- Clear bug fix → describe the fix
- Purpose unclear → describe change factually, don't invent benefits

Commit message = OBSERVABLE FACTS, not assumed intentions

## Step 2: Determine Commit Type

| Type       | When to use                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | ADD new capability (includes prompts)               |
| `fix`      | FIX broken behavior (includes prompts)              |
| `refactor` | IMPROVE code, no behavior change (includes prompts) |
| `docs`     | ONLY human-readable docs (READMEs, guides, wikis)   |
| `style`    | Formatting                                          |
| `test`     | Add/modify tests                                    |
| `ci`       | Change CI/CD pipelines                              |
| `build`    | Change build system/dependencies                    |
| `chore`    | Maintenance/tooling, config files                   |
| `perf`     | Improve performance                                 |

**LLM prompt files are treated as code (not docs):** AGENTS.md, SKILL.md, commands/, agents/, etc. → use `feat`/`fix`/`refactor`

## Step 3: Generate Message

**Format:**

```
<type>[scope]: <description>

<body>  ← optional, only when needed
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

**Without body:** `git commit -m "<type>[scope]: <description>"`

**With body:** `git commit -m "<type>[scope]: <description>" -m "<body>"`
