---
description: Code review PR or local changes
agent: plan
---

## Input

```text
$ARGUMENTS
```

## Determine What to Review

CRITICAL:

- If total files > 10: Collect diffs in batches of 10 (run separate `git diff` per batch), then analyze ALL collected diffs together
- If git diff fails: Output `Error retrieving diff: [error message]` and stop
- Skip lockfiles, binaries, and generated files (_.lock, _.bin, dist/, build/)
- NEVER truncate diffs manually, use batching instead.

Follow this workflow:

### Workflow

**Step 1: Parse Input**

- Input: `$ARGUMENTS`
- Action: Determine input type (empty | PR number/URL | other)
- Output: Input type classification

**Step 2: Fetch Diffs** (based on Step 1 classification)

- Action: Run appropriate git commands
- Output: List of changed files + diff content
- If error or no changes: Output error/no-changes message and STOP

**Step 3: Review** (proceed only if Step 2 succeeded)

- Input: Diff content from Step 2
- Action: Apply review criteria below
- Output: Formatted review

### Implementation Details

#### Case A: Empty Input

If no input provided:

1. Check for uncommitted changes: `git status --porcelain`
2. If no changes, output: `No changes to review.`
3. If changes exist, proceed to review them

**Review Local Changes**

```bash
git diff -- <file1> <file2> ... <fileN>
git diff --cached -- <file1> <file2> ... <fileN>
```

#### Case B: PR Provided

If input matches a pull request:

**Supported formats:**

- Number: e.g., `123`, `PR 123`, `#123`
- URL: e.g., `github.com/org/repo/pull/123`

**Processing:**

1. Detect the PR number

2. Fetch PR metadata: Run `gh pr view <number> --json baseRefName,headRefName`

3. On error (PR not found, command failed, etc.), output `Cannot review PR: [error]`. Do NOT fall back to local changes.

```bash
git fetch origin <base_branch> <head_branch>
git checkout origin/<head_branch>
git diff --name-only origin/<base_branch>...origin/<head_branch>
git diff origin/<base_branch>...origin/<head_branch> -- <file1> <file2> ... <fileN>
```

#### Case C: None of the above

Output: `No local changes or PR to review.`

---

## Scope Rules (Non-negotiable)

**CRITICAL: You MUST ONLY report findings on changed lines.**

Enforcement rules:

1. Read full files containing changes for context (to understand intent)
2. Every line reference in a finding → MUST point to a changed line in the diff
3. When diagnosing severity, you MAY mention patterns in unchanged code for context (e.g., "This pattern exists in 5 other files"), but the finding itself MUST be about changed lines only
4. If the issue doesn't exist in changed lines, do NOT report it
5. Uncertain about an issue → INVESTIGATE or do not report
6. No concrete scenario → Do NOT report

**Verification before reporting:**

- ✅ Issue exists in changed lines
- ✅ Line reference points to diff
- ✅ Real impact identified (not theoretical or hypothetical)

Style guidance:

- Report style only if it clearly violates project conventions OR severely harms readability.
- Excessive nesting and missing guards are legitimate concerns regardless of style preferences.

---

## What to Look For

**CRITICAL: Focus on bugs and issues. Report style ONLY when specified below.**

Reporting threshold (in priority order):

1. **BUG**: Always report (logic errors, null safety, security)
2. **CONCERN**: Report if likely to cause production issues or maintenance burden
3. **STYLE**: Report when code violates established project pattern (observable in 3+ similar files) OR creates severe readability issues (nesting >3 levels, incomprehensible names)
4. **SLOP**: Report ONLY if obvious AI-generated noise (e.g., comment duplicates function name) AND fixing improves clarity

When uncertain, skip the finding.

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

Report when changed code duplicates other changed code in the same diff:

| Duplication Type                      | When to Report                                     | Severity | Suggested Fix                            |
| ------------------------------------- | -------------------------------------------------- | -------- | ---------------------------------------- |
| **Exact function duplication**        | Same implementation in changed lines               | BUG      | Extract to shared utility/function       |
| **Utility function replacement**      | New code matches existing util (observable in PR)  | CONCERN  | Use existing utility instead             |
| **Similar logic with minor variance** | Same control flow + variable names differ in diffs | CONCERN  | Extract shared logic, parameterize diffs |
| **Configuration duplication**         | Same config patterns in changed lines              | STYLE    | Create shared config/constants           |

**Do NOT report:**

- Duplication between changed code and unchanged code (out of scope)
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

### Testing Review: Anti-patterns & Severity

| Anti-pattern                                                        | Severity | When to Report                     |
| ------------------------------------------------------------------- | -------- | ---------------------------------- |
| **Testing internals** (tests refactoring internals, not public API) | BUG      | Always                             |
| **Type casting** (`as unknown as X` hides real errors)              | BUG      | Always                             |
| **Test interdependence** (shared state, order dependency)           | BUG      | Always                             |
| **Over-mocking** (mocks hide critical business logic)               | CONCERN  | When logic being tested is mocked  |
| **Implementation coupling** (spies on internal calls)               | CONCERN  | On internal calls only             |
| **Snapshot abuse** (obviously excessive or obscures intent)         | SLOP     | Makes intent unclear               |
| **Disabling linters** (no clear reason)                             | SLOP     | Without documented reason          |
| **Magic values** (`expect(result).toBe(42)` - why 42?)              | SLOP     | Makes test incomprehensible        |
| **Unintelligible test names** (single letters, no context)          | STYLE    | When unambiguously obscures intent |

---

## Assumption Handling

When inferring types or behavior from code (e.g., "getProfile() may return undefined"):

1. **Use explicit type annotations** in the diff (preferred)
2. **Use pattern evidence** in the same file (null checks, guards, return statements visible in diff)
3. **If neither exists** → Skip the finding. Base reports only on observable facts in changed code.

This ensures findings are grounded in visible evidence, not speculation.

---

## Output

**Tone:** Matter-of-fact.

- Lead with: [severity + file:line]
- Describe: Concrete problem only (what broke, what failed, what violates spec)
- Fix: Actionable suggestion (how to fix, what to do)
- Omit: Flattery, reassurance, narrative filler, explanations of why the problem matters

**Severity levels:**

- **BUG**: Breaks functionality, causes errors, vulnerability, exact code duplication
- **CONCERN**: Potential issue depending on context or edge cases, utility function replacement, similar logic (>70%)
- **STYLE**: Convention violation, readability issue, configuration duplication
- **SLOP**: AI-generated cruft that adds noise without value

**Format:**

```
# Code Review

| BUG         | CONCERN         | SLOP         | STYLE         |
| ----------- | --------------- | ------------ | ------------- |
| [BUG_COUNT] | [CONCERN_COUNT] | [SLOP_COUNT] | [STYLE_COUNT] |

Brief summary (1-2 sentences): Describe ONLY what changed (new feature, refactor, fix). Examples: "Adds user authentication middleware", "Fixes race condition in queue".

## Findings

**Rules:**
- If ALL counts are 0: Output "No issues found."
- If ANY count > 0: List findings ordered by severity (BUG → CONCERN → STYLE → SLOP)

**Format per finding:**

**[SEVERITY]** ([file-path:line])
[Problem description]
[Suggested fix]

[Repeat per issue]
```

---

## Examples

### Example 1: Simple Case (BUG + SLOP)

<input>
```diff
+ // Function to process user data
+ function getUser(id: string) {
+   const user = users.find(u => u.id === id);
+   if (!user) throw new Error("User is required");
+   const profile = getProfile(user.id);
+   return { ...user, profile };
+ }
```
</input>

<output>
# Code Review

| BUG | CONCERN | SLOP | STYLE |
| --- | ------- | ---- | ----- |
| 1   | 0       | 1    | 0     |

Adds function to retrieve user by ID with associated profile data.

## Findings

**BUG** (src/users.ts:4)
Missing null check on `profile`. `getProfile()` may return `undefined`, but it's directly spread into the return object. Add guard: `if (!profile) throw new Error("Profile not found");` or return a default.

**SLOP** (src/users.ts:1)
Comment paraphrases function name. The name `getUser` already conveys this. Remove the comment or explain _why_ this retrieval pattern is needed.
</output>

<reasoning>
BUG severity: Real null safety issue with concrete impact (runtime error)
SLOP: Comment adds no value, paraphrases obvious function intent
</reasoning>

---

### Example 2: No Issues Found

<input>
```diff
+ function calculateTotal(items: Item[]): number {
+   return items.reduce((sum, item) => sum + item.price, 0);
+ }
```
</input>

<output>
# Code Review

| BUG | CONCERN | SLOP | STYLE |
| --- | ------- | ---- | ----- |
| 0   | 0       | 0    | 0     |

Adds function to calculate total price from items array.

## Findings

No issues found.
</output>

<reasoning>
Clean implementation: null-safe reduce, clear naming, no edge cases
No findings warranted - resist temptation to nitpick
</reasoning>
