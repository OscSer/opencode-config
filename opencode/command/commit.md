---
description: Generate conventional commit messages
---

Diff of staged changes:

!`git diff --cached`

Recent commits:

!`git log --oneline -5`

Analyze changes and generate a commit message following **Conventional Commits** format:

**Message format:**

```
<type>[optional scope]: <description>
```

**Commit types (select the most appropriate):**

- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code changes without adding features or fixing bugs
- `docs`: Documentation changes only
- `style`: Formatting, spacing, no functional impact
- `test`: Add or modify tests
- `ci`: CI/CD changes
- `build`: Build system or dependency changes
- `chore`: Maintenance tasks, configuration
- `perf`: Performance improvements

**Message rules:**

- Use **lowercase** for type
- Scope is optional: identify affected module/library (e.g., `auth`, `products-api`, `db`, `ui`)
- Description must be **concise**, in **imperative** (e.g., "add" not "added")
- **ONLY one line** — NEVER include body or footer
- Message MUST be in **English** (industry standard)
- ONLY execute `git commit`, **NEVER** execute `git push`

If user provided arguments ($ARGUMENTS), use that info to guide analysis:

- Ex: `/commit refactor authentication` → prioritize `refactor(auth):`
- Ex: `/commit fix utilities` → prioritize `fix(utils):`

Generate message based on diff analysis.

Execute commit with generated message.

If commit **fails for any reason**, explain error clearly

If commit is **successful**, report:

```
Commit successful: <short hash> - <message>
```
