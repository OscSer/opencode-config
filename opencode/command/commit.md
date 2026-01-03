---
description: Generate commit for staged changes
agent: general
model: github-copilot/claude-haiku-4.5
---

## Constraints

- If user provided arguments, prioritize that context in the message.
- If there are no staged changes, inform the user. Do NOT attempt to stage files.
- You MUST execute the commit command using the Bash tool. Printing the message alone is NOT sufficient.
- The ONLY command you can execute is `git commit`. No other commands are allowed. No exceptions.

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

## Step 2: Analyze Observable Changes

**CRITICAL: Only state what you can DIRECTLY observe in the diff. Never speculate.**

Before selecting a type, identify:

1. **What exactly changed?** (files, functions, values)
2. **What is the observable effect?** (only if evident from code)
3. **Is there context from user arguments?** (use it if provided)

**Anti-speculation rule:**

- If the diff shows `model: "gpt-4" → "claude-3"`, you know the model changed. You do NOT know why.
- If the diff shows a bug fix with clear before/after behavior, describe the fix.
- If the purpose is unclear, describe the change factually. Do NOT invent benefits.

The commit message must reflect OBSERVABLE FACTS, not assumed intentions.

## Step 3: Generate Message

**Format:**

```
<type>[scope]: <description>

<body>  ← optional, only when needed
```

**Rules:**

- Lowercase type
- Description: concise, imperative ("add" not "added")
- Description MUST be factual — only what the diff shows
- NEVER assume benefits, reasons, or intentions not evident in the code
- English only

**Body rules (conditional):**

- Add body ONLY when the "why" cannot fit in the description
- Explain context, motivation, or consequences — not repeat the description
- Separate from description with a blank line

### Message Quality

**Bad (vague) vs Good (specific but factual):**

- `chore: change model` → `chore: switch default model to claude-3`
- `fix: update handler` → `fix: add null check in auth handler`
- `feat: add service` → `feat: add job queue processor`
- `refactor: cleanup code` → `refactor: extract validation logic to utils`
- `test: add tests` → `test: add error cases for payment service`

**Bad (speculation) — NEVER do this:**

- `chore: switch model for better performance` ← you don't know this
- `refactor: simplify code for maintainability` ← you're guessing
- `fix: prevent security vulnerability` ← unless explicitly a security fix

**With body (only when context is observable in code/comments):**

```
fix: add mutex lock to payment handler

Concurrent requests were causing duplicate charge entries.
```

## Step 4: Execute Commit

**CRITICAL: You MUST execute the git commit command using the Bash tool. DO NOT just print the message.**

**Execution rules:**

- Use the Bash tool to run the git commit command
- NEVER use placeholder values or skip execution
- Wait for the command to complete
- After execution, verify success with a brief confirmation message

**Without body:**

```bash
git commit -m "<type>: <description>"
```

**With body:**

```bash
git commit -m "<type>: <description>" -m "<body>"
```

**Post-execution:**

- If successful: Output "✓ Commit created successfully"
- If failed: Report the error to the user
