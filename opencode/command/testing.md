---
description: Apply testing best practices
---

# Testing

Respond to the user's request applying these testing principles:

User request:

```text
$ARGUMENTS
```

---

## Testing Principles

| Principle                | Rule                                           | Example                                                                       |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| **Test behavior**        | Test what it does, not how                     | Test `calculateTotal()` returns correct value, not that it calls `multiply()` |
| **AAA Pattern**          | Arrange → Act → Assert                         | Setup data, execute action, verify result                                     |
| **One concept per test** | Each test verifies one behavior                | Split "creates user and sends email" into two tests                           |
| **Descriptive names**    | Name describes scenario and expected result    | `returnsEmptyArray_whenNoItemsMatch`                                          |
| **Isolated tests**       | No shared state, no execution order dependency | Each test sets up its own data                                                |
| **Mock boundaries only** | Mock external systems, not internal modules    | Mock HTTP client, not your own services                                       |

## Coverage Philosophy

- **DO**: Cover critical paths, edge cases, error handling
- **DON'T**: Chase percentage metrics
- **Priority**: Business logic > Integration points > Edge cases > Happy paths

---

## Anti-patterns: REJECT immediately

| Anti-pattern                | Problem                                              | Fix                                      |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| **Testing internals**       | Breaks when refactoring                              | Test public API only                     |
| **Over-mocking**            | Tests pass but code fails                            | Mock only external boundaries            |
| **Snapshot abuse**          | Large snapshots nobody reviews                       | Use targeted assertions                  |
| **Type casting in tests**   | Hides real type errors                               | `as unknown as X` = red flag             |
| **Disabling linters**       | `@ts-ignore`, `eslint-disable` mask issues           | Fix the underlying problem               |
| **Magic values**            | `expect(result).toBe(42)` - why 42?                  | Use named constants or derive from input |
| **Test interdependence**    | Test B fails because Test A didn't run               | Isolate setup per test                   |
| **Implementation coupling** | `expect(spy).toHaveBeenCalledWith(...)` on internals | Verify outputs, not call sequences       |

---

## Test Structure Template

```typescript
describe("[Unit/Feature being tested]", () => {
  describe("[method or scenario]", () => {
    it("[expected behavior] when [condition]", () => {
      // Arrange - Setup test data and dependencies
      // Act - Execute the behavior being tested
      // Assert - Verify the expected outcome
    });
  });
});
```

---

## Quality Criteria

When writing or evaluating tests, ensure:

- ✅ **Tests behavior**: Verifies outputs, not internal implementation
- ✅ **AAA pattern**: Clearly separates Arrange/Act/Assert
- ✅ **Descriptive names**: Test name explains scenario and expected result
- ✅ **One concept**: Each test verifies a single behavior
- ✅ **Isolated**: No shared state between tests
- ✅ **Proper mocking**: Only mocks external boundaries
- ✅ **Clear assertions**: Specific expectations, no magic values
- ✅ **Edge cases**: Covers errors, boundaries, empty/null
- ✅ **No anti-patterns**: Free from testing smells
- ✅ **Maintainable**: Easy to understand and update
