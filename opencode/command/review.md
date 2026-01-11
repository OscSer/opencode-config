---
description: Code review PR, branch, or uncommitted changes
---

# Code Review

User input:

```text
$ARGUMENTS
```

## Determine What to Review

IMPORTANT: Batch diffs to avoid output truncation. Skip lockfiles and binaries.

Priority order:

### Priority 1: PR Provided

If input matches a PR number format, use GitHub CLI and compare base...head:

```bash
gh pr view <PR_NUMBER> --json baseRefName,headRefName
git fetch origin <base_branch> <head_branch>
git diff --name-only origin/<base_branch>...origin/<head_branch>
git diff origin/<base_branch>...origin/<head_branch> -- <file1> <file2> ... <fileN>
```

Input examples: `123`, `PR 123`, `pr/123`

### Priority 2: Target Branch Provided

If input looks like a branch name:

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

- You may read full files for context, but you MUST NOT report issues outside changed lines.
- Do NOT suggest changes to unrelated files or functions.
- When reporting a finding, the line reference MUST point to a changed line in the diff.

Verify before reporting:

- If you are unsure, investigate (read file/search) or explicitly say "I'm not sure about X".
- Do not invent hypothetical problems without a concrete scenario.

Style guidance:

- Don't be a style zealot; report style only if it clearly violates project conventions or harms readability.
- Excessive nesting and missing guards are legitimate concerns regardless of style preferences.

---

## What to Look For

### Primary: Bugs

- Logic errors, incorrect conditions, missing guards
- Null/empty inputs, error handling, race conditions
- Security: injection, auth bypass, data exposure
- Swallowed failures, unexpected throws, wrong error types

### Secondary: Structure

- Fits existing patterns and conventions
- Excessive nesting that could be flattened by guards/extraction

### Performance: Only if obvious

- O(n^2) on unbounded data, N+1 queries, blocking I/O on hot paths

### Slop (AI noise)

| Category                 | Flag                                         | Preserve                                  |
| ------------------------ | -------------------------------------------- | ----------------------------------------- |
| **Comments**             | Describes "what" code does, paraphrases name | JSDoc/docstrings, TODO with reason, "why" |
| **Emojis**               | In variable/function names, decorative       | UI strings, CLI output, user messages     |
| **Excessive validation** | Type already guarantees safety               | External input, API boundaries            |
| **Type escapes**         | Cast to silence compiler                     | Library workaround with documented TODO   |

---

## Output

**Tone:** Matter-of-fact, not accusatory or overly positive. AVOID flattery—no "Great job...", "Thanks for...".

**Severity levels:**

- **BUG**: Breaks functionality, causes errors, security vulnerability
- **CONCERN**: Potential issue depending on context or edge cases
- **STYLE**: Convention violation, readability issue
- **SLOP**: AI-generated cruft that adds noise without value

**Format:**

```
## Summary

<BUG_COUNT> bug | <CONCERN_COUNT> concern | <SLOP_COUNT> slop | <STYLE_COUNT> style

<Brief summary of the changes>

## Findings

<SEVERITY>
`<relative-path:line>`
<actionable detail; include suggested fix when clear>

<SEVERITY>
`<relative-path:line>`
<actionable detail>

...
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

BUG
`src/users.ts:3`
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

## Summary

0 bug | 0 concern | 2 slop | 0 style

Adds a function to process and transform user data.

## Findings

SLOP
`src/users.ts:1`
Comment paraphrases function name. The name `processUserData` already conveys this. Remove the comment or explain _why_ this transformation is needed.

SLOP
`src/users.ts:3`
Redundant null check. `User` type is not nullable—TypeScript already guarantees `user` exists. Remove the guard clause. If `User | null` is possible, fix the type instead.
