---
description: Run quality gate and detect AI-generated code slop
---

## Overview

Execute `git status --porcelain` to get a list of changed files. If no changes, report and exit.

## Parallel Delegation

You MUST delegate both analysis phases to subagents using the Task tool. Launch both in a SINGLE message to run them in parallel.

**Critical:** Each subagent operates in isolation. Pass ALL required context in the prompt—they cannot access this document or conversation history.

### Task 1: Quality Gate

```
Task(
  subagent_type="general",
  description="Quality Gate analysis",
  prompt="[QUALITY GATE PROMPT WITH FILE LIST]"
)
```

### Task 2: Slop Detection

```
Task(
  subagent_type="general",
  description="Slop Detection analysis",
  prompt="[SLOP DETECTION PROMPT WITH FILE LIST AND CRITERIA]"
)
```

---

## Quality Gate Subagent Prompt

Use this template, replacing `{FILES}` with the actual file list:

````markdown
## Quality Gate Analysis

Analyze these files for technical errors:

{FILES}

### Checks to Run

1. **Typecheck** - Run `bun run typecheck` or equivalent
2. **Lint** - Run `bun run check` or equivalent
3. **Tests** - Run `bun test` or equivalent

### Report Format

Return findings in this EXACT format:

```
## Quality Gate Report

### Typecheck
- `file:line` - Error description
(or ✅ No issues)

### Lint
- `file:line` - Rule: description
(or ✅ No issues)

### Tests
- Test name - Failure reason
(or ✅ All passing)

```

### Rules

- Run ALL checks even if one fails
- Report exact file paths and line numbers
- Do NOT fix anything—report only
````

---

## Slop Detection Subagent Prompt

Use this template, replacing `{FILES}` with the actual file list:

````markdown
## Slop Detection Analysis

Analyze these files for AI-generated code patterns ("slop"):

{FILES}

### Detection Criteria

#### 1. Comments

**Context determines validity.** Evaluate BEFORE flagging:

| Context                          | Action                 |
| -------------------------------- | ---------------------- |
| JSDoc/TSDoc documenting API      | ✅ Preserve            |
| TODO/FIXME with ticket or reason | ✅ Preserve            |
| Explains "why" (decision/intent) | ✅ Preserve            |
| Legal/license headers            | ✅ Preserve            |
| Describes "what" code does       | ⚠️ Likely slop         |
| Paraphrases function name        | ❌ Flag                |
| Section dividers (`// ===`)      | ⚠️ Check project style |

**Ambiguous? Do NOT flag—note for user review.**

Examples:

```typescript
// ❌ SLOP: Describes the obvious
// Function to get the current user
async function getCurrentUser(id: string) { ... }

// ✅ VALID: Explains "why"
// Using Map instead of Object for O(1) deletion during cleanup
const cache = new Map<string, CacheEntry>();

// ✅ VALID: JSDoc for API
/**
 * Retrieves user by ID.
 * @throws {NotFoundError} When user doesn't exist
 */
async function getUser(id: string): Promise<User> { ... }
```

#### 2. Emojis

**Location determines validity:**

| Location                        | Action      |
| ------------------------------- | ----------- |
| UI strings / user messages      | ✅ Preserve |
| CLI logs (✅❌⚠️ as indicators) | ✅ Preserve |
| Markdown / documentation        | ✅ Preserve |
| Config files (existing pattern) | ✅ Preserve |
| Variable / function names       | ❌ Flag     |
| Decorative comments             | ⚠️ Evaluate |

Examples:

```typescript
// ✅ VALID: CLI output indicators
console.log("✅ Build completed successfully");

// ✅ VALID: User-facing messages
throw new UserError("⚠️ Your session has expired.");
```

#### 3. Excessive Validations

**Flag if:**

- Validation duplicates what type system already guarantees
- Check is unreachable due to TypeScript narrowing

**Preserve if:**

- Protects against external input (APIs, user data, files)
- Runtime boundary (data from JSON.parse, fetch, etc.)
- Explicit defensive programming for critical paths

Examples:

```typescript
// ❌ SLOP: Type already guarantees existence
function processUser(user: User) {
  if (!user) throw new Error("User is required");
  if (!user.id) throw new Error("User ID is required");
}

// ✅ VALID: External input boundary
async function handleWebhook(req: Request) {
  const body = await req.json();
  if (!body || typeof body.event !== "string") {
    throw new BadRequestError("Invalid webhook payload");
  }
}

// ✅ VALID: Critical path defense
function processPayment(amount: number) {
  // Defense against floating point issues
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ValidationError("Invalid payment amount");
  }
}
```

#### 4. Casts to `any`

**Flag if:**

- Cast exists only to silence compiler errors
- Proper typing is feasible with minimal effort

**Preserve if:**

- External library has incorrect/missing types
- Intentional escape hatch with explanatory comment
- Migration in progress (documented TODO)

Examples:

```typescript
// ❌ SLOP: Cast to silence compiler
const data = response.body as any;
const name = data.user.name;

// ✅ VALID: Library with incorrect types
// @ts-expect-error: library types missing optional callback
externalLib.init(config, onReady);

// ✅ VALID: Documented escape hatch
// Using any: thirdPartySDK returns untyped legacy format
// TODO(#456): Remove when SDK v3 migration complete
const legacyData = sdk.getData() as any;
```

### Report Format

Return findings in this EXACT format:

```
## Slop Detection Report

### Findings

**file.ts**
- Line N: [Category] Description
- Line M: [Category] Description

**other-file.ts**
✅ No issues

### Summary
- Files analyzed: N
- Issues found: M
- Categories: comments (X), validations (Y), casts (Z), emojis (W)
```

### Rules

- Read files to analyze content—do NOT guess
- Flag with justification
- Preserve existing file style
- Do NOT fix anything—report only
- When ambiguous, note for user review instead of flagging
````

---

## Consolidation

After BOTH subagents complete, consolidate their reports:

```
## Pre-Commit Analysis

### Quality Gate
[Insert Quality Gate subagent report]

### Slop Detection
[Insert Slop Detection subagent report]

### Action Plan

**Priority 1 - Blocking:**
1. [Error from Quality Gate]
2. ...

**Priority 2 - Recommended:**
1. [Slop finding]
2. ...

**Priority 3 - Optional:**
1. [Minor issues]
2. ...

---
Proceed with corrections? (yes/no)
```

---

## Correction Phase

If user confirms:

1. Create TodoWrite with prioritized correction plan
2. Fix Priority 1 items first
3. Re-run Quality Gate (delegate to subagent again)
4. If passing, fix Priority 2 items
5. Re-run both phases to verify

---

## Rules

**Failure modes:**

- Running phases sequentially → loses parallelism benefit
- Fixing without reporting → user loses visibility
- Incomplete subagent prompts → subagent lacks context

**Mandatory:**

- ALWAYS delegate using Task tool with `subagent_type="general"`
- ALWAYS launch BOTH tasks in a SINGLE message (parallel execution)
- ALWAYS include complete file list in each subagent prompt
- ALWAYS include ALL criteria in Slop Detection prompt
- ALWAYS wait for BOTH subagents before consolidating
- ALWAYS present consolidated report BEFORE any fixes
- NEVER fix without user confirmation
