# Global Instructions

These are your global instructions. You MUST follow them strictly at all times. They are not negotiable.

## Rules

- ALWAYS communicate in **SPANISH**
- ALWAYS write code in **ENGLISH** (variable, function, class names)
- NEVER do `git add` nor `git push`. The user controls the git history
- Only execute `git commit` when the user explicitly requests it (e.g., `/commit` command)
- NEVER ignore these rules, no exceptions

## Workflow

### Planning

MUST use `TodoWrite` and `TodoRead` for any work that requires multiple steps. This helps you:

- Organize work before starting
- Give visibility of progress
- Don't forget important steps

Mark each task as completed IMMEDIATELY after finishing it. Don't accumulate completed tasks.

### Investigate Before Changing

BEFORE modifying existing code:

1. Understand the context and purpose of the current code
2. Identify dependencies and possible side effects
3. Verify if there are similar patterns in the project

### Quality Gate

IMMEDIATELY after making changes, run the project validations:

- Tests
- Linter
- Type verification
- Any other configured validation

### Incremental Changes

- One commit = one logical change
- Small and atomic changes
- Easy to review and revert

### Final Verification

BEFORE considering a task completed, verify:

- The code follows the principles of this guide
- The quality gate passes correctly
- There is no dead or commented code

## MCP

| MCP        | When to use it                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ref`      | Official documentation from primary sources (API/SDK maintainers). Use it first for canonical specs and authoritative references.                      |
| `context7` | Up-to-date code docs and examples. Resolve library IDs and fetch current snippets straight from source repos; use alongside `ref` to ground responses. |

## Code Principles

Code should be **clear**, **readable**, and **modular**. It should explain itself without needing comments.

### Early Return and Guard Clauses

Handle exceptional cases at the start. Avoid excessive nesting.

```typescript
// BAD: excessive nesting, hard to follow
function processOrder(order: Order | null) {
  if (order) {
    if (order.isValid) {
      if (order.hasItems) {
        return calculateTotal(order);
      }
    }
  }
  return null;
}

// GOOD: guard clauses, clear flow
function processOrder(order: Order | null) {
  if (!order) return null;
  if (!order.isValid) return null;
  if (!order.hasItems) return null;

  return calculateTotal(order);
}
```

### Descriptive Names

Names should reveal intention. If you need a comment to explain what a variable does, the name is bad.

```typescript
// BAD: cryptic names
const d = Date.now() - s;
const arr = data.filter((x) => x.a > 10);
const flag = user.role === "admin";

// GOOD: names that reveal intention
const elapsedMs = Date.now() - startTime;
const highValueItems = data.filter((item) => item.amount > THRESHOLD);
const isAdmin = user.role === "admin";
```

### Small and Focused Functions

One function = one responsibility. If you can describe what it does using "and", it probably does too much.

```typescript
// BAD: function that does multiple things
function handleUserRegistration(userData: UserInput) {
  // validates data
  // hashes password
  // saves to database
  // sends welcome email
  // registers analytics
  // ...100 more lines
}

// GOOD: composition of small functions
function handleUserRegistration(userData: UserInput) {
  const validatedData = validateUserData(userData);
  const user = createUser(validatedData);
  await saveUser(user);
  await sendWelcomeEmail(user);
  trackRegistration(user);
}
```

### Avoid Unnecessary Else

If the `if` block ends with `return`, the `else` is redundant.

```typescript
// BAD: unnecessary else
function getDiscount(user: User) {
  if (user.isPremium) {
    return 0.2;
  } else {
    return 0;
  }
}

// GOOD: without redundant else
function getDiscount(user: User) {
  if (user.isPremium) {
    return 0.2;
  }
  return 0;
}
```

### Prefer Immutability

Avoid mutating data. Create new structures instead of modifying existing ones.

```typescript
// BAD: data mutation
function addItem(cart: Cart, item: Item) {
  cart.items.push(item);
  cart.total += item.price;
  return cart;
}

// GOOD: immutability
function addItem(cart: Cart, item: Item): Cart {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}
```

### Avoid Obvious Comments

Code should be self-explanatory. Comments should explain "why", not "what".

```typescript
// BAD: comments that describe the obvious
// Increments the counter
counter++;
// Gets the user by ID
const user = getUserById(id);

// GOOD: comment that explains the why (when necessary)
// Rate limiting: maximum 100 requests per minute per API policy
const delay = calculateBackoff(requestCount);
```

### Named Constants

Avoid magic numbers and strings. Use constants with descriptive names.

```typescript
// BAD: magic numbers
if (password.length < 8) { ... }
if (retryCount > 3) { ... }
setTimeout(fn, 86400000)

// GOOD: named constants
const MIN_PASSWORD_LENGTH = 8
const MAX_RETRY_ATTEMPTS = 3
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (password.length < MIN_PASSWORD_LENGTH) { ... }
if (retryCount > MAX_RETRY_ATTEMPTS) { ... }
setTimeout(fn, ONE_DAY_MS)
```

## Response Format

When referencing code, include location for easy navigation:

```
The `validateUser` function in `src/services/auth.ts:45` handles validation.
```
