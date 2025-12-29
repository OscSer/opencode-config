---
description: Generate conventional commit messages
agent: general
model: opencode/grok-code
---

## Constraints

- If user provided arguments, prioritize that context in the message.
- If there are no staged changes, inform the user. Do NOT attempt to stage files.
- The ONLY command you can execute is `git commit -m "<message>"`. No other commands. No `git add|push|status|etc`. No `&& <other command>`. No exceptions.

## Context

**User arguments:**

```text
$ARGUMENTS
```

**Staged changes (this is your ONLY input, do NOT run git diff yourself):**

!`git diff --cached`

**Recent commits (for style reference only):**

!`git log --oneline -5`

## Step 1: Classify Files and Determine Type

**File classification:**

| File Type           | Examples                                   | Nature          |
| ------------------- | ------------------------------------------ | --------------- |
| Human documentation | `README.md`, `docs/*.md`, `CHANGELOG.md`   | Documentation   |
| LLM prompts/config  | `AGENTS.md`,`agent/`, `command/`, `skill/` | Functional code |
| Source code         | `*.ts`, `*.py`, `*.go`                     | Functional code |
| Config files        | `package.json`, `tsconfig.json`, `.env`    | Configuration   |
| CI/CD               | `.github/workflows/*`, `.gitlab-ci.yml`    | Pipeline        |

**Critical rule:** Files like `SKILL.md` or `AGENTS.md` are **functional LLM configuration**, NOT documentation. Never use `docs` for these.

**Commit types:**

| Type       | Question to ask                                    |
| ---------- | -------------------------------------------------- |
| `feat`     | Does this ADD a new capability that didn't exist?  |
| `fix`      | Does this FIX broken behavior?                     |
| `refactor` | Does this IMPROVE code without changing behavior?  |
| `docs`     | Is this ONLY human-readable docs (README, guides)? |
| `style`    | Is this formatting/whitespace only?                |
| `test`     | Does this add/modify tests?                        |
| `ci`       | Does this change CI/CD pipelines?                  |
| `build`    | Does this change build system/dependencies?        |
| `chore`    | Is this maintenance/tooling?                       |
| `perf`     | Does this improve performance?                     |

## Step 2: Understand the WHY

Before selecting a type, answer:

1. **What problem does this solve?**
2. **What benefit does it provide?**
3. **What was the intention?** (the "why", not the "what")

The commit message must reflect PURPOSE/INTENTION, not just describe what changed.

## Step 3: Generate Message

**Format:**

```
<type>: <description>

<body>  ← optional, only when needed
```

**Rules:**

- Lowercase type
- Do NOT add the `[scope]` section
- Description: concise, imperative ("add" not "added")
- Description MUST include the purpose/intention (the "why")
- English only

**Body rules (conditional):**

- Add body ONLY when the "why" cannot fit in the description
- Maximum 3 lines
- Explain context, motivation, or consequences — not repeat the description
- Separate from description with a blank line

### Message Quality

**Bad vs Good:**

- `chore: change model provider` → `chore: switch model for efficient task handling`
- `fix: update handler` → `fix: correct user validation in auth handler`
- `feat: add service` → `feat: implement background job processing`
- `refactor: cleanup code` → `refactor: simplify authentication flow`
- `test: add tests` → `test: cover error cases in payment module`

**With body (only when "why" cannot fit in description):**

```
fix: prevent race condition in payment processing

Multiple concurrent requests could cause duplicate charges.
```

## Step 4: Execute Commit

**Without body:**

```bash
git commit -m "<type>: <description>"
```

**With body:**

```bash
git commit -m "<type>: <description>" -m "<body>"
```

## Error Handling

If the commit fails, report ONLY the cause of the error. Do NOT retry or suggest fixes.
