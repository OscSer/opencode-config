---
description: Review code changes (uncommitted / against a branch)
---

# Code Review

---

Input: $ARGUMENTS

---

## Determining What to Review

Follow this priority order:

### Priority 1: Target Branch Provided

If `Input` is provided, compare current branch against the target:

```bash
git diff <Input>...HEAD
```

Example: `/review feature-a` compares `HEAD` against `feature-a`.

### Priority 2: Pending Changes

If no `Input`, check for uncommitted changes:

```bash
git diff          # unstaged
git diff --cached # staged
```

If either returns output → review those changes.

### Priority 3: No Changes

If no `Input` and no pending changes → respond "No changes to review" and stop.

---

## Gathering Context

**Diffs alone are not enough.** After getting the diff, read the entire file(s) being modified to understand the full context. Code that looks wrong in isolation may be correct given surrounding logic—and vice versa.

- Use the diff to identify which files changed
- Read the full file to understand existing patterns, control flow, and error handling
- Check for existing style guide or conventions files (CONVENTIONS.md, AGENTS.md, .editorconfig, etc.)

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

---

## Before You Flag Something

**Verify before reporting.** If you're going to call something a bug, be confident it actually is one.

- Only review the changes—do not review pre-existing code that wasn't modified
- Don't flag something as a bug if you're unsure—investigate first
- Don't invent hypothetical problems—if an edge case matters, explain the realistic scenario where it breaks
- If you need more context to be sure, use the tools to get it

**Don't be a zealot about style.**

- Verify the code is _actually_ in violation. Don't complain about else statements if early returns are already being used correctly.
- Some "violations" are acceptable when they're the simplest option. A `let` statement is fine if the alternative is convoluted.
- Excessive nesting is a legitimate concern regardless of other style choices.
- Don't flag style preferences as issues unless they clearly violate established project conventions.

---

## Tools

Use these to inform your review:

- **search agent** - Find how existing code handles similar problems. Check patterns, conventions, and prior art before claiming something doesn't fit.
- **context7/codesearch** - Verify correct usage of libraries/APIs before flagging something as wrong.
- **websearch** - Research best practices if you're unsure about a pattern.

If you're uncertain about something and can't verify it with these tools, say "I'm not sure about X" rather than flagging it as a definite issue.

---

## Output

**Tone**: Matter-of-fact, not accusatory or overly positive. AVOID flattery—no "Great job...", "Thanks for...".

**Severity levels**:

- **BUG**: Breaks functionality, causes errors, security vulnerability
- **CONCERN**: Potential issue depending on context or edge cases
- **STYLE**: Convention violation, readability issue

**Format each issue as**:

```
### [file]:[line] - [SEVERITY]

**Issue**: [what's wrong]
**Suggestion**: [how to fix]
```

If no issues found, say so briefly. Do not pad with praise.

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

### src/users.ts:3 - BUG

**Issue**: Accessing `user.name` without null check. `find()` returns `undefined` if no match.
**Suggestion**: Add guard clause: `if (!user) return null;` or throw an error.
