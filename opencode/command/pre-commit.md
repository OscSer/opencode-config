---
description: Run quality gate and detect AI-generated code slop
---

Files with uncommitted changes:

!`git status --porcelain`

If no changes, report "No pending changes" and exit.

## Phases (in parallel)

1. **Quality Gate** - Technical errors
2. **Slop Detection** - AI-generated code slop

## Process

### 1. Parallel Analysis

Run simultaneously both phases:

**Quality Gate:**

- Typecheck
- Lint
- Tests

**Slop Detection:**

- Redundant comments
- Excessive validations
- Casts to `any`
- Emojis
- Style inconsistencies

### 2. Detailed Report

Present consolidated findings:

```
## Findings

### Quality Gate

**Typecheck**
- `src/file.ts:12` - Property 'x' does not exist on type 'Y'

**Lint**
- `src/file.ts:8` - Unexpected console statement

**Tests**
✅ Passing

### Slop Detection

⚠️ **src/installer.ts**
- Line 23: Redundant comment "// Get the user"
- Line 45: Unnecessary cast to `any`

**src/file-ops.ts**
✅ No issues
```

### 3. Confirmation

```
Proceed with corrections? (yes/no)
```

### 4. Iterative Correction

If user confirms:

1. Create TodoWrite with correction plan
2. Perform corrections
3. Re-run both phases

## Slop Detection Criteria

### Comments

**Context determines validity.** Evaluate BEFORE flagging:

| Context                          | Action                 |
| -------------------------------- | ---------------------- |
| JSDoc/TSDoc documenting API      | ✅ Preserve            |
| TODO/FIXME with ticket or reason | ✅ Preserve            |
| Explains "why" (decision/intent) | ✅ Preserve            |
| Legal/license headers            | ✅ Preserve            |
| Describes "what" code does       | ⚠️ Likely slop         |
| Paraphrases function name        | ❌ Remove              |
| Section dividers (`// ===`)      | ⚠️ Check project style |

**Ambiguous? Ask user before flagging.**

### Emojis

**Location determines validity:**

| Location                        | Action      |
| ------------------------------- | ----------- |
| UI strings / user messages      | ✅ Preserve |
| CLI logs (✅❌⚠️ as indicators) | ✅ Preserve |
| Markdown / documentation        | ✅ Preserve |
| Config files (existing pattern) | ✅ Preserve |
| Variable / function names       | ❌ Remove   |
| Decorative comments             | ⚠️ Evaluate |

**Ambiguous? Check if project already uses emojis in similar contexts.**

### Validations

**Remove if:**

- Validation duplicates what type system already guarantees
- Check is unreachable due to TypeScript narrowing

**Preserve if:**

- Protects against external input (APIs, user data, files)
- Runtime boundary (data from JSON.parse, fetch, etc.)
- Explicit defensive programming for critical paths

### Casts to `any`

**Remove if:**

- Cast exists only to silence compiler errors
- Proper typing is feasible with minimal effort

**Preserve if:**

- External library has incorrect/missing types
- Intentional escape hatch with explanatory comment
- Migration in progress (documented TODO)

## Slop Examples

### Redundant Comment

```typescript
// ❌ SLOP: Describes the obvious
// Function to get the current user
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}

// ✅ Clean: Without unnecessary comment
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}
```

### Valid Comments (NOT slop)

```typescript
// ✅ JSDoc for public API - VALID
/**
 * Retrieves user by ID.
 * @throws {NotFoundError} When user doesn't exist
 */
async function getUser(id: string): Promise<User> {
  return db.users.findUniqueOrThrow({ where: { id } });
}

// ✅ Explains "why", not "what" - VALID
// Using Map instead of Object for O(1) deletion during cleanup
const cache = new Map<string, CacheEntry>();

// ✅ TODO with context - VALID
// TODO(#123): Replace with Redis when we scale beyond single instance
const sessionStore = new MemoryStore();
```

### Valid Emojis (NOT slop)

```typescript
// ✅ CLI output indicators - VALID
console.log("✅ Build completed successfully");
console.log("❌ Tests failed");
console.log("⚠️ Deprecated API detected");

// ✅ User-facing messages - VALID
throw new UserError("⚠️ Your session has expired. Please log in again.");

// ✅ Markdown documentation - VALID
const HELP_TEXT = `
## Status Icons
- ✅ Passing
- ❌ Failing
- ⏳ In progress
`;
```

### Excessive Validation

```typescript
// ❌ SLOP: Redundant when type already guarantees existence
function processUser(user: User) {
  if (!user) throw new Error("User is required");
  if (!user.id) throw new Error("User ID is required");
  // ...
}

// ✅ Trust the type system
function processUser(user: User) {
  // ...
}
```

### Valid Validation (NOT slop)

```typescript
// ✅ External input boundary - VALID
async function handleWebhook(req: Request) {
  const body = await req.json();

  // Runtime validation required: body is unknown at compile time
  if (!body || typeof body.event !== "string") {
    throw new BadRequestError("Invalid webhook payload");
  }

  return processEvent(body as WebhookEvent);
}

// ✅ Critical path defensive check - VALID
function processPayment(amount: number) {
  // Defense against floating point issues in financial calculations
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ValidationError("Invalid payment amount");
  }
  // ...
}
```

### Cast to any

```typescript
// ❌ SLOP: Cast to silence compiler
const data = response.body as any;
const name = data.user.name;

// ✅ Explicit type
interface ApiResponse {
  user: { name: string };
}
const data: ApiResponse = response.body;
const name = data.user.name;
```

### Valid Cast (NOT slop)

```typescript
// ✅ Library with incorrect types - VALID
// @ts-expect-error: library types missing optional callback parameter
externalLib.init(config, onReady);

// ✅ Intentional escape hatch with documentation - VALID
// Using any here because thirdPartySDK returns untyped legacy format
// TODO(#456): Remove when SDK v3 migration is complete
const legacyData = sdk.getData() as any;
```

## Rules

**Failure modes:**

- Fix without reporting → user loses visibility
- Fix multiple errors before re-validating → risk of new errors

**Mandatory:**

- ALWAYS report findings BEFORE fixing
- ALWAYS wait for user confirmation
- NEVER remove functional code just because it "looks like AI"
- PRESERVE existing file style
- Report BOTH phases even if only one has findings
- Prioritize quality gate over code review in conflicts
