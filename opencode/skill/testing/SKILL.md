---
name: testing
description: Write reliable tests that catch bugs without slowing you down. Use when creating, reviewing, or fixing tests.
---

# Testing

Framework for writing and reviewing tests. Focus: actionable decisions, not perfection.

**Core principle:** Tests verify behavior, not implementation. If a test breaks on refactor without behavior change, it's wrong.

---

## Decision Framework

### Should I Test This?

| Priority | Scenario                       | Test Level         |
| -------- | ------------------------------ | ------------------ |
| **HIGH** | Bug fix                        | Unit (reproduces)  |
| **HIGH** | Business logic / complex rules | Unit               |
| **HIGH** | Critical path (auth, payments) | Unit + Integration |
| **HIGH** | Public API / breaking = bad    | Unit + Integration |
| MEDIUM   | Integration points             | Integration        |
| MEDIUM   | Error handling / edge cases    | Unit               |
| LOW      | UI presentation                | E2E selectively    |
| LOW      | Config / low complexity        | Skip               |
| **SKIP** | Spike / throwaway code         | —                  |

**Decision rule:** `HIGH risk OR HIGH complexity` → test. `LOW risk AND LOW complexity` → skip.

### What Type of Test?

```
Is it pure logic with no dependencies?
  YES → Unit test
  NO  → Does it cross module/service boundaries?
          YES → Integration test
          NO  → Is it a critical user journey?
                  YES → E2E test
                  NO  → Unit test with mocks at edges
```

---

## Writing Tests

### Pre-Write (3 Questions)

1. **What behavior am I testing?** (One sentence, no "and")
2. **What's the expected outcome?** (Specific value/state)
3. **What inputs trigger this?** (Including edge cases)

If you can't answer these clearly, you don't understand the requirement yet.

### Write (AAA Structure)

Every test follows Arrange-Act-Assert. No exceptions.

```
// ARRANGE: Setup state and dependencies
validator = EmailValidator()
email = 'user@example.com'

// ACT: Execute ONE behavior
result = validator.validate(email)

// ASSERT: Verify specific outcome
assert(result.isValid == true)
assert(result.errors == [])
```

### Naming Convention

**Core pattern:** `{action}` → `{condition}` → `{expected_result}`

This structure must be respected regardless of syntax. Adapt to:

1. **Existing project conventions** — match the style already in use
2. **Language/framework idioms** — if no existing tests, follow ecosystem norms

**Valid examples (same semantic structure):**

```
returns_null_when_user_not_found        # snake_case
"returns null when user not found"      # string description
returnsNullWhenUserNotFound             # camelCase
ReturnsNull_WhenUserNotFound            # PascalCase with separator
```

**Anti-patterns (violate the structure):**

```
❌ test_user                 # missing condition + result
❌ validation                # not a behavior
❌ handles_edge_cases        # which ones?
❌ should_work_correctly     # vague result
```

**Rule:** If the name has "and", split the test.

### Mocking Rules

| Mock                       | Don't Mock                |
| -------------------------- | ------------------------- |
| External APIs              | Business logic            |
| Databases (for unit tests) | Pure functions            |
| Network calls              | Internal collaborators    |
| Timers / randomness        | Everything (over-mocking) |

**Test real code paths. Mock only at system boundaries.**

### Edge Cases Checklist

For any function, consider:

- [ ] Empty input (`""`, `[]`, `{}`, `null`, `undefined`)
- [ ] Boundary values (0, -1, MAX_INT, empty string vs whitespace)
- [ ] Invalid types (if dynamically typed)
- [ ] Error conditions (network fail, timeout, permission denied)

---

## Reviewing Tests

### Red Flags → Quick Fixes

| Red Flag                               | Fix                                                 |
| -------------------------------------- | --------------------------------------------------- |
| Test name has "and"                    | Split into separate tests                           |
| Mocking internal classes               | Remove mock, use real implementation                |
| `assert(result)` / truthy check        | Assert specific value: `assert(result == expected)` |
| Tests fail when run in different order | Remove shared state, each test owns its setup       |
| Testing private methods                | Test through public interface                       |
| No edge case tests                     | Add empty/null/boundary tests                       |
| `sleep()` / timing assumptions         | Use callbacks, promises, or mock timers             |
| Commented-out tests                    | Delete or fix them                                  |

### Anti-Pattern Detection

```
Over-mocking?
  → Are you testing mock behavior or real code?
  → Fix: Use real implementations, mock only edges

Implementation coupling?
  → Does test break on refactor without behavior change?
  → Fix: Test public interface, not internals

Flaky test?
  → Does it pass/fail inconsistently?
  → Fix: Check for timing, shared state, or non-determinism
```

---

## Validation Framework

### Criteria (Binary Pass/Fail)

| #   | Criterion               | ✅/❌ |
| --- | ----------------------- | ----- |
| 1   | Tests pass consistently |       |
| 2   | One behavior per test   |       |
| 3   | Names describe behavior |       |
| 4   | Tests are independent   |       |
| 5   | Critical paths covered  |       |
| 6   | Assertions are specific |       |

### Verdict

| Result         | Action                          |
| -------------- | ------------------------------- |
| **GOOD**       | All ✅ → Ready to merge         |
| **NEEDS_WORK** | Any ❌ → Fix only failing items |

**Anti-perfeccionism rule:** Don't optimize what already passes. Fix failures, move on.

---

## Output Formats

### When Writing New Tests

```markdown
## Test Plan: [function/module name]

**Behavior:** [one sentence]
**Type:** Unit | Integration | E2E

### Cases

1. [happy path]
2. [edge case 1]
3. [edge case 2]
4. [error condition]
```

### When Reviewing Tests

```markdown
## Test Review: [file/module]

### Validation

| Criterion               | Status |
| ----------------------- | ------ |
| Tests pass consistently | ✅/❌  |
| One behavior per test   | ✅/❌  |
| Names describe behavior | ✅/❌  |
| Tests are independent   | ✅/❌  |
| Critical paths covered  | ✅/❌  |
| Assertions are specific | ✅/❌  |

**Verdict:** GOOD | NEEDS_WORK

### Issues (if NEEDS_WORK)

- [Issue]: [Location] → [Fix]
```

---

## Quick Reference

### Test Pyramid

```
     /\      E2E (5%) - Critical journeys only
    /--\     Integration (25%) - Module boundaries
   /----\    Unit (70%) - Fast, isolated, logic
```

### Flaky Test Causes

| Cause              | Solution                         |
| ------------------ | -------------------------------- |
| Timing assumptions | Callbacks/promises, not `sleep`  |
| Shared state       | Isolate setup per test           |
| Random values      | Mock randomness, seed generators |
| Async race         | Proper awaits, controlled order  |

### Final Principle

```
GOOD with good-enough tests > Blocked by perfect tests
```

Tests that exist and pass > tests planned but not written.
