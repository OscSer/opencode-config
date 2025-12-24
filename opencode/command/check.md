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

Run simultaneously using `general` agents:

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

**Remove if:**

- Comment describes what code already says
- Validation duplicates type system
- Cast to `any` exists only to silence errors

**Preserve if:**

- Comment explains "why", not "what"
- Validation protects against external input (APIs, users)
- Cast is necessary due to external library limitations

## Slop Examples

### Redundant Comment

```typescript
// ❌ Describes the obvious
// Function to get the current user
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}

// ✅ Without unnecessary comment
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}
```

### Excessive Validation

```typescript
// ❌ Redundant when type already guarantees existence
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

### Cast to any

```typescript
// ❌ Cast to silence compiler
const data = response.body as any;
const name = data.user.name;

// ✅ Explicit type
interface ApiResponse {
  user: { name: string };
}
const data: ApiResponse = response.body;
const name = data.user.name;
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
