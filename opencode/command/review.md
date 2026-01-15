---
description: Code review PR, branch, or uncommitted changes
agent: plan
---

## Input

```text
$ARGUMENTS
```

## Determine What to Review

CRITICAL:

- Batch diffs to avoid output truncation
- Skip lockfiles, binaries, and generated files
- NEVER truncate diffs manually—use batching instead

Follow this priority order (stop at first match):

### Priority 1: PR Provided

If input matches a PR number format (e.g., `123`, `PR 123`, `pr/123`), use GitHub CLI and compare base...head:

```bash
gh pr view <PR_NUMBER> --json baseRefName,headRefName
git fetch origin <base_branch> <head_branch>
git diff --name-only origin/<base_branch>...origin/<head_branch>
git diff origin/<base_branch>...origin/<head_branch> -- <file1> <file2> ... <fileN>
```

### Priority 2: Target Branch Provided

If input looks like a branch name (e.g., `main`, `develop`, `feature/xyz`):

```bash
git fetch origin <branch>
git diff --name-only origin/<branch>...HEAD
git diff origin/<branch>...HEAD -- <file1> <file2> ... <fileN>
```

### Priority 3: Pending Local Changes

If no input:

```bash
git diff --name-only          # unstaged
git diff --name-only --cached # staged
git diff -- <file1> <file2> ... <fileN>
git diff --cached -- <fileM> <fileM+1> ...
```

### Priority 4: No Changes

If nothing to review, output exactly:

```
No changes to review.
```

---

## Scope Rules (Non-negotiable)

**CRITICAL: You MUST ONLY report findings on lines that appear in the diff.**

Enforcement rules:

1. Read full files for context → Report ONLY changed lines
2. Line reference in finding → MUST point to a changed line in the diff
3. Uncertain about an issue → Investigate OR explicitly state "Uncertain about X"
4. No concrete scenario → Do NOT report

**Verification before reporting:**

- ✅ Issue exists in changed lines
- ✅ Line reference points to diff
- ✅ Real impact identified (not theoretical)
- ❌ No hypothetical problems

Style guidance:

- Don't be a style zealot; report style only if it clearly violates project conventions or harms readability.
- Excessive nesting and missing guards are legitimate concerns regardless of style preferences.

---

## What to Look For

**CRITICAL: Focus on bugs and issues. Don't nitpick style or minor optimizations.**

Reporting threshold:

- **BUG**: Always report
- **CONCERN**: Report if likely to cause production issues
- **STYLE**: Only if severely harms readability (not preference)
- **SLOP**: Only if obvious and adds significant noise

### Bugs

- Logic errors, incorrect conditions, missing guards
- Null/empty inputs, error handling, race conditions
- Security: injection, auth bypass, data exposure
- Swallowed failures, unexpected throws, wrong error types

### Structure (only if severe)

- Violates clear project patterns (observable in 3+ similar files)
- Nesting >3 levels that obscures logic flow

### Performance (Only if obvious)

- O(n^2) on unbounded data, N+1 queries, blocking I/O on hot paths

### Code Duplication

Report when code duplicates existing functionality:

| Duplication Type                      | When to Report        | Severity | Suggested Fix                            |
| ------------------------------------- | --------------------- | -------- | ---------------------------------------- |
| **Exact function duplication**        | Same implementation   | BUG      | Extract to shared utility/function       |
| **Utility function replacement**      | Matches existing util | CONCERN  | Use existing utility instead             |
| **Similar logic with minor variance** | >70% similarity       | CONCERN  | Extract shared logic, parameterize diffs |
| **Configuration duplication**         | Same config patterns  | STYLE    | Create shared config/constants           |

**Do NOT report:**

- Domain-specific variations that serve different purposes
- Standard patterns (try/catch, validation loops, etc.)

### Slop (AI noise)

| Category                 | Flag                                            | Preserve                                  |
| ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| **Comments**             | Describes "what" code does, paraphrases name    | JSDoc/docstrings, TODO with reason, "why" |
| **Emojis**               | In variable/function names, decorative          | UI strings, CLI output, user messages     |
| **Excessive validation** | Obviously redundant checks (type guarantees it) | External input, API boundaries            |
| **Type escapes**         | Cast to silence compiler                        | Library workaround with documented TODO   |

---

## Testing Specific

**Apply when reviewing:** `*.test.*`, `*.spec.*`, `__tests__/*`, `__mocks__/*`, `/test/**`, `/tests/**`

When reviewing test files, apply these additional criteria:

### Testing Anti-patterns (REJECT)

| Anti-pattern                | Problem                                              | Severity | Fix                                      | Report When                            |
| --------------------------- | ---------------------------------------------------- | -------- | ---------------------------------------- | -------------------------------------- |
| **Testing internals**       | Breaks when refactoring                              | BUG      | Test public API only                     | Always                                 |
| **Over-mocking**            | Tests pass but code fails                            | CONCERN  | Mock only external boundaries            | Mocks hide critical business logic     |
| **Snapshot abuse**          | Large snapshots nobody reviews                       | SLOP     | Use targeted assertions                  | Obviously excessive or obscures intent |
| **Type casting in tests**   | Hides real type errors                               | BUG      | `as unknown as X` = red flag             | Always                                 |
| **Disabling linters**       | `@ts-ignore`, `eslint-disable` mask issues           | SLOP     | Fix the underlying problem               | Without clear reason                   |
| **Magic values**            | `expect(result).toBe(42)` - why 42?                  | SLOP     | Use named constants or derive from input | Makes test incomprehensible            |
| **Test interdependence**    | Test B fails because Test A didn't run               | BUG      | Isolate setup per test                   | Always                                 |
| **Implementation coupling** | `expect(spy).toHaveBeenCalledWith(...)` on internals | CONCERN  | Verify outputs, not call sequences       | On internal calls                      |

### Critical Issues Only

When reviewing tests, only report if:

- ❌ **Doesn't test behavior**: Tests internals instead of outputs → BUG
- ❌ **Test interdependence**: Shared state or order dependency → BUG
- ❌ **Type casting**: `as unknown as X` hides real errors → BUG
- ❌ **Over-mocking critical logic**: Mocks hide the actual logic being tested → CONCERN

---

## Output

**Tone:** Matter-of-fact, not accusatory or overly positive. AVOID flattery—no "Great job...", "Thanks for...".

**Severity levels:**

- **BUG**: Breaks functionality, causes errors, vulnerability, exact code duplication
- **CONCERN**: Potential issue depending on context or edge cases, utility function replacement, similar logic (>70%)
- **STYLE**: Convention violation, readability issue, configuration duplication
- **SLOP**: AI-generated cruft that adds noise without value

**Severity levels for test files:**

Apply same levels, but through testing lens:

| Severity    | Test-Specific Criteria                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **BUG**     | Test doesn't test behavior, false positives/negatives, testing internals, test interdependence, type casting |
| **CONCERN** | Over-mocking hides critical logic, implementation coupling                                                   |
| **STYLE**   | Completely unintelligible test names (single letters, no context)                                            |
| **SLOP**    | Snapshot abuse (obviously excessive or obscures intent), disabled linters without reason                     |

**Format:**

```
# Code Review

| BUG         | CONCERN         | SLOP         | STYLE         |
| ----------- | --------------- | ------------ | ------------- |
| [BUG_COUNT] | [CONCERN_COUNT] | [SLOP_COUNT] | [STYLE_COUNT] |

[Brief summary: 1-2 sentences describing the nature of the changes (e.g., "Adds authentication middleware" or "Refactors error handling in API layer")]

## Findings

[If no issues:]
No issues found.

[If issues exist:]
**[SEVERITY]** ([file-path:line])
[Actionable detail; include suggested fix when clear]

[Repeat per issue]
```

---

## Example

Input diff:

```diff
+ function getUser(id) {
+   const user = users.find(u => u.id === id);
+   return user.name;
+ }
```

Output:

# Code Review

| BUG | CONCERN | SLOP | STYLE |
| --- | ------- | ---- | ----- |
| 1   | 0       | 0    | 0     |

Adds a function to retrieve user by ID from a users array.

## Findings

**BUG** (src/users.ts:3)
Accessing `user.name` without null check. `find()` returns `undefined` if no match. Add guard clause: `if (!user) return null;` or throw an error.

---

Input diff:

```diff
+ // Function to process user data
+ function processUserData(user: User) {
+   if (!user) throw new Error("User is required");
+   return transform(user);
+ }
```

Output:

# Code Review

| BUG | CONCERN | SLOP | STYLE |
| --- | ------- | ---- | ----- |
| 0   | 0       | 2    | 0     |

Adds a function to process and transform user data.

## Findings

**SLOP** (src/users.ts:1)
Comment paraphrases function name. The name `processUserData` already conveys this. Remove the comment or explain _why_ this transformation is needed.

**SLOP** (src/users.ts:3)
Redundant null check. `User` type is not nullable—TypeScript already guarantees `user` exists. Remove the guard clause. If `User | null` is possible, fix the type instead.
