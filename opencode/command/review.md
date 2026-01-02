---
description: Code review PR, branch, or uncommitted changes
---

# Code Review

User input:

```text
$ARGUMENTS
```

## Determining What to Review

**IMPORTANT: Group files into batches to avoid output truncation**

- Instead of getting diffs all at once or file by file, group files into reasonable batches.
- Skip irrelevant files like lock files or large binary files.

Follow this priority order:

### Priority 1: Pull Request Provided

If input matches PR format, use GitHub CLI to get PR info, then use git diff:

```bash
# Step 1: Get PR branch information
gh pr view <PR_NUMBER> --json baseRefName,headRefName

# Step 2: Fetch the branches
git fetch origin <base_branch> <head_branch>

# Step 3: Get list of changed files
git diff --name-only origin/<base_branch>...origin/<head_branch>

# Step 4: Get diff for files in batches
git diff origin/<base_branch>...origin/<head_branch> -- <file1> <file2> ... <fileN>
git diff origin/<base_branch>...origin/<head_branch> -- <fileN+1> <fileN+2> ...
...
```

Input examples:

- `123`
- `PR 123`
- `pr/123`

### Priority 2: Target Branch Provided

If input is a branch name, compare current branch against the provided branch:

```bash
# Step 1: Fetch the target branch
git fetch origin <branch>

# Step 2: Get list of files
git diff --name-only origin/<branch>...HEAD

# Step 3: Get diff for files in batches
git diff origin/<branch>...HEAD -- <file1> <file2> ... <fileN>
git diff origin/<branch>...HEAD -- <fileN+1> <fileN+2> ...
...
```

Input examples:

- `develop`
- `release/v1.2.3`
- `feature/new-feature`

### Priority 3: Pending Changes

If no input, check for uncommitted changes:

```bash
# Step 1: Get list of files
git diff --name-only          # unstaged
git diff --name-only --cached # staged

# Step 2: Get diff for files in batches
git diff -- <file1> <file2> ... <fileN>
git diff --cached -- <fileM> <fileM+1> ...
...
```

### Priority 4: No Changes

If no input and no pending changes → inform:

```
No changes to review.
```

---

## Scope and Verification

**CRITICAL: Stay within the changed lines.**

- Only review files and lines that appear in the diff
- Do NOT critique or comment on code that was not modified
- Do NOT suggest changes to unrelated files or functions
- Reading full files is for context only—to understand the changed code's purpose and impact

**Verify before reporting.**

- Don't flag something as a bug if you're unsure—investigate first
- Don't invent hypothetical problems—if an edge case matters, explain the realistic scenario where it breaks
- If you need more context to be sure, use the tools to get it
- If you're uncertain about something and can't verify it, say "I'm not sure about X" rather than flagging it as a definite issue

**Don't be a zealot about style.**

- Verify the code is _actually_ in violation. Don't complain about else statements if early returns are already being used correctly.
- Some "violations" are acceptable when they're the simplest option. A `let` statement is fine if the alternative is convoluted.
- Excessive nesting is a legitimate concern regardless of other style choices.
- Don't flag style preferences as issues unless they clearly violate established project conventions.

---

## Gathering Context

**Diffs alone are not enough.** After getting the diff, read the entire file(s) being modified to understand the full context. Code that looks wrong in isolation may be correct given surrounding logic—and vice versa.

- Read the full file to understand existing patterns, control flow, and error handling
- Check for existing style guide or conventions files (CONVENTIONS.md, AGENTS.md, .editorconfig, etc.)
- Search the codebase for similar implementations to confirm patterns and conventions before claiming something doesn't fit.
- Confirm correct usage by consulting authoritative documentation or reliable references before flagging something as wrong.
- If you're unsure about a pattern, cross-check with well-regarded guides and sources.

---

## What to Look For

**Bugs** - Your primary focus.

- Logic errors, off-by-one mistakes, incorrect conditionals
- If-else guards: missing guards, incorrect branching, unreachable code paths
- Edge cases: null/empty/undefined inputs, error conditions, race conditions
- Security issues: injection, auth bypass, data exposure
- Broken error handling that swallows failures, throws unexpectedly or returns error types that are not caught.

**Structure** - Does the code fit the codebase?

- Does it follow existing patterns and conventions?
- Are there established abstractions it should use but doesn't?
- Excessive nesting that could be flattened with early returns or extraction

**Performance** - Only flag if obviously problematic.

- O(n²) on unbounded data, N+1 queries, blocking I/O on hot paths

**Slop** - AI-generated noise that dilutes code quality.

| Category                 | Flag                                         | Preserve                                  |
| ------------------------ | -------------------------------------------- | ----------------------------------------- |
| **Comments**             | Describes "what" code does, paraphrases name | JSDoc/docstrings, TODO with reason, "why" |
| **Emojis**               | In variable/function names, decorative       | UI strings, CLI output, user messages     |
| **Excessive validation** | Type already guarantees safety               | External input, API boundaries            |
| **Type escapes**         | Cast to silence compiler                     | Library workaround with documented TODO   |

Examples:

```typescript
// SLOP: Comment describes what
// Function to get user by ID
function getUserById(id: string) { ... }

// SLOP: Redundant validation (type guarantees non-null)
function process(user: User) {
  if (!user) throw new Error("User required");  // User type is not nullable
}

// VALID: Explains why
// Using Map for O(1) deletion during batch cleanup
const pending = new Map<string, Task>();

// VALID: External input boundary
const data = parseInput(raw);
if (!data.event) throw new Error("Missing event");
```

---

## Output

**Tone**: Matter-of-fact, not accusatory or overly positive. AVOID flattery—no "Great job...", "Thanks for...".

**Severity levels**:

- **BUG**: Breaks functionality, causes errors, security vulnerability
- **CONCERN**: Potential issue depending on context or edge cases
- **STYLE**: Convention violation, readability issue
- **SLOP**: AI-generated cruft that adds noise without value

**Format**:

```
## Summary

[BUG_COUNT] bug | [CONCERN_COUNT] concern | [SLOP_COUNT] slop | [STYLE_COUNT] style

[Brief summary of the purpose of the changes]

## Findings

SEVERITY `[relative-path:line]`
[issue description]
[suggestion]

SEVERITY `[relative-path:line]`
[issue description]
[suggestion]

SEVERITY `[relative-path:line]`
[issue description]
[suggestion]
```

- Order findings by file.
- If no issues found: "No issues found." Do not pad with praise.

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

## Summary

1 bug | 0 concern | 0 slop | 0 style

Adds a function to retrieve user by ID from a users array.

## Findings

BUG `src/users.ts:3`
Accessing `user.name` without null check. `find()` returns `undefined` if no match.
Add guard clause: `if (!user) return null;` or throw an error.

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

## Summary

0 bug | 0 concern | 2 slop | 0 style

Adds a function to process and transform user data.

## Findings

SLOP `src/users.ts:1`
Comment paraphrases function name. The name `processUserData` already conveys this.
Remove the comment or explain _why_ this transformation is needed.

SLOP `src/users.ts:3`
Redundant null check. `User` type is not nullable—TypeScript already guarantees `user` exists.
Remove the guard clause. If `User | null` is possible, fix the type instead.
