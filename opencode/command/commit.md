---
description: Generate conventional commit messages
agent: build
model: github-copilot/claude-haiku-4.5
---

Diff of staged changes:

!`git diff --cached`

Recent commits:

!`git log --oneline -10`

Analyze changes and generate a commit message following **Conventional Commits** format.

## Step 1: Analyze Changed Files

For each file, determine its nature:

| File Type           | Examples                                  | Nature          |
| ------------------- | ----------------------------------------- | --------------- |
| Human documentation | `README.md`, `docs/*.md`, `CHANGELOG.md`  | Documentation   |
| LLM prompts/config  | `AGENTS.md`, `command/*.md`, `skill/*.md` | Functional code |
| Source code         | `src/*.ts`, `*.py`, `*.go`                | Functional code |
| Config files        | `package.json`, `tsconfig.json`, `.env`   | Configuration   |
| CI/CD               | `.github/workflows/*`, `.gitlab-ci.yml`   | Pipeline        |

## Step 2: Determine Change Nature

Ask yourself:

1. **Does this ADD a new capability that didn't exist?** → `feat`
2. **Does this FIX broken behavior?** → `fix`
3. **Does this IMPROVE existing code without changing behavior?** → `refactor`
4. **Is this ONLY human-readable docs (README, guides)?** → `docs`
5. **Is this formatting/whitespace only?** → `style`
6. **Does this add/modify tests?** → `test`
7. **Does this change CI/CD pipelines?** → `ci`
8. **Does this change build system/dependencies?** → `build`
9. **Is this maintenance/tooling?** → `chore`
10. **Does this improve performance?** → `perf`

## Step 3: Select Type

**Commit types:**

| Type       | Use when                                                  |
| ---------- | --------------------------------------------------------- |
| `feat`     | New feature or capability                                 |
| `fix`      | Bug fix                                                   |
| `refactor` | Code restructuring, clarity improvements, NO new features |
| `docs`     | **ONLY** human documentation (README, guides, comments)   |
| `style`    | Formatting, whitespace, no logic changes                  |
| `test`     | Add or modify tests                                       |
| `ci`       | CI/CD pipeline changes                                    |
| `build`    | Build system, dependencies                                |
| `chore`    | Maintenance, tooling                                      |
| `perf`     | Performance improvements                                  |

**Critical rule:** Files in `opencode/`, `command/`, `skill/`, or `AGENTS.md` are **functional LLM configuration**, NOT documentation. Never use `docs` for these.

## Step 4: Generate Message

**Format:** `<type>[optional scope]: <description>`

**Rules:**

- Lowercase type
- Scope: affected module (e.g., `auth`, `api`, `ui`, `command`, `skill`)
- Description: concise, imperative ("add" not "added")
- Single line only — no body or footer
- English only

If user provided arguments ($ARGUMENTS), prioritize that guidance:

- `/commit refactor auth` → `refactor(auth): ...`
- `/commit fix utils` → `fix(utils): ...`

## Step 5: Execute Commit

Execute the commit `git commit -m "<generated message>"` and finishes without reporting anything else.
