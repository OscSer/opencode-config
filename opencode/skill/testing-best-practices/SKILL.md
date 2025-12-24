---
name: testing-best-practices
description: Use for testing, test cases, test quality, or flaky tests
---

# Test Best Practices

**Note:** Examples use pseudocode. Concepts apply to all languages and frameworks.

## Overview

Tests are insurance against bugs and regression. Quality tests give confidence to refactor, deploy, and evolve code safely.

**Core principle:** Tests should be clear, focused, and test behavior—not implementation details.

## When Tests Matter Most

Testing has a cost: time to write, maintain, update. Invest where ROI is highest.

### High ROI (Always Test)

| Scenario             | Why                                                          | Effort     |
| -------------------- | ------------------------------------------------------------ | ---------- |
| **Bug fixes**        | Test reproduces bug + proves fix + prevents regression       | Low-Medium |
| **Public APIs**      | Breaking changes affect users. Tests catch unintended breaks | Medium     |
| **Business logic**   | Complex rules need verification. Bugs are costly             | High       |
| **Shared utilities** | Used everywhere. Breaking change = system failure            | Medium     |
| **Critical paths**   | Payment, auth, data integrity. Risk is high                  | High       |

### Medium ROI (Usually Worth It)

| Scenario               | Why                                           | Effort     |
| ---------------------- | --------------------------------------------- | ---------- |
| **Integration points** | Modules interact. Tests verify contracts work | Medium     |
| **Error handling**     | Easy to miss edge cases manually              | Low-Medium |
| **State transitions**  | Complex workflows need validation             | Medium     |

### Low ROI (Test Selectively)

| Scenario            | Why                                             | Effort |
| ------------------- | ----------------------------------------------- | ------ |
| **UI presentation** | Changes frequently, expensive to test           | High   |
| **Configuration**   | Low complexity, low change risk                 | Low    |
| **Throwaway code**  | Discarded after spike. Test real implementation | Low    |
| **One-off scripts** | Single use, limited value in tests              | Low    |

### Decision Matrix

| Risk Level | Complexity | Decision                           |
| ---------- | ---------- | ---------------------------------- |
| High       | High       | Test thoroughly (critical)         |
| High       | Low        | Test (risk justifies it)           |
| Medium     | High       | Test (complexity warrants it)      |
| Medium     | Low        | Test selectively (core paths only) |
| Low        | Any        | Skip or test later                 |

**Key:** Don't test everything equally. Prioritize high-risk, high-complexity code.

## Test Structure Patterns

### The Arrange-Act-Assert Pattern

Every test follows this structure:

```
// ARRANGE: Setup state and dependencies
validator = EmailValidator()
email = 'user@example.com'

// ACT: Execute the behavior
result = validator.validate(email)

// ASSERT: Verify the outcome
assert(result.isValid == true)
assert(result.errors == empty)
```

**Benefits:**

- Clear structure: anyone reading understands the test
- Maintainable: easy to locate setup, action, and assertions
- Debuggable: failure points are obvious

### Test Naming

Names should describe the behavior, not the mechanism.

**Good names:**

- Reveal expected behavior
- Are complete sentences
- Could be requirements documentation

**Bad names:**

- Generic ("test1", "test works")
- Vague ("validates stuff")
- Implementation-focused ("calls getUser method")

Good examples:

- retries operation up to 3 times before throwing
- returns null when user does not exist
- throws ValidationError when email is invalid

Bad examples:

- retry test
- getUser
- validation

### One Thing Per Test

A test should verify one behavior. If your test name contains "and", split it.

Bad: Tests multiple behaviors

```
test_creates_user_sends_email_and_logs_event:
  user = createUser(email: 'test@example.com')
  assert(user.id is defined)
  assert(emailService.send was called)
  assert(logger.log was called)
```

Good: Each behavior has its own test

```
test_creates_user_with_generated_id:
  user = createUser(email: 'test@example.com')
  assert(user.id is defined)

test_sends_welcome_email_after_user_creation:
  user = createUser(email: 'test@example.com')
  assert(emailService.send was called)

test_logs_user_creation_event:
  user = createUser(email: 'test@example.com')
  assert(logger.log was called)
```

### Test Independence

Tests must not depend on other tests or shared state.

Bad: Shared state, order-dependent

```
user = null  // Global state

test_creates_user:
  user = db.createUser(name: 'Alice')

test_finds_user_by_id:
  found = db.getUserById(user.id)  // Depends on previous test
  assert(found.name == 'Alice')
```

Good: Each test is self-contained

```
test_creates_user:
  user = db.createUser(name: 'Alice')
  assert(user.id is defined)

test_finds_user_by_id:
  user = db.createUser(name: 'Alice')
  found = db.getUserById(user.id)
  assert(found.name == 'Alice')
```

### Deterministic Tests

Tests must pass/fail consistently. No flakiness from timing, randomness, or order.

Bad: Flaky—timing assumptions

```
test_processes_request_quickly:
  start = currentTime()
  processRequest()
  elapsed = currentTime() - start
  assert(elapsed < 100)  // Too strict, may fail on slow systems
```

Good: Deterministic—behavior-focused

```
test_notifies_on_completion:
  notified = false
  onComplete(() => { notified = true })
  processRequest()
  assert(notified == true)
```

## Common Anti-Patterns

### 1. Over-Mocking

Mocking everything disconnects tests from reality. You end up testing mock behavior, not code.

Bad: Over-mocked, tests implementation not behavior

```
test_fetches_user_data:
  mockDb = { query: mockFunction() }
  mockCache = { get: mockFunction(), set: mockFunction() }
  mockLogger = { log: mockFunction() }

  result = getUserData(mockDb, mockCache, mockLogger)

  assert(mockDb.query was called with 'SELECT * FROM users')
  assert(mockCache.set was called)
  assert(mockLogger.log was called)
```

Good: Real code where possible, mock edges only

```
test_fetches_user_data:
  mockDb = { query: mockFunction().returns({ id: 1, name: 'Alice' }) }
  cache = Cache()  // Real cache

  result = getUserData(mockDb, cache)

  assert(result == { id: 1, name: 'Alice' })
  assert(cache.has('user:1') == true)  // Test actual behavior
```

**Rule:** Mock external boundaries (APIs, databases, timers). Use real code for internal logic.

### 2. Implementation Coupling

Tests tied to implementation details break when you refactor (even if behavior doesn't change).

Bad: Coupled to internal implementation

```
test_calculates_discount:
  calculator = DiscountCalculator()
  result = calculator._applyMultiplier(0.5)  // Testing private/internal method
  assert(result == 0.5)
```

Good: Tests behavior, not implementation

```
test_applies_premium_discount_correctly:
  calculator = DiscountCalculator()
  price = calculator.calculate(100, 'premium')
  assert(price == 50)  // 50% discount
```

**Rule:** Test public interface. If you can't test without accessing internals, design is coupled.

### 3. Vague Test Assertions

Unclear assertions make failures hard to debug.

Bad: Vague, doesn't tell you what failed

```
assert(user is truthy)
assert(result is not undefined)
```

Good: Specific assertions, clear intent

```
assert(user == { id: 1, email: 'test@example.com' })
assert(result.isValid == true)
assert(result.errors == [])
```

### 4. Missing Edge Cases

Happy path tests give false confidence. Test boundaries and error conditions.

Bad: Only happy path

```
test_validates_password:
  assert(validatePassword('SecurePass123!') == true)
```

Good: Happy path + edge cases + errors

```
test_validates_strong_password:
  assert(validatePassword('SecurePass123!') == true)

test_rejects_empty_password:
  assert(validatePassword('') == false)

test_rejects_password_shorter_than_8_characters:
  assert(validatePassword('Short1!') == false)

test_rejects_password_without_uppercase:
  assert(validatePassword('weakpass123!') == false)

test_rejects_password_without_numbers:
  assert(validatePassword('WeakPass!') == false)
```

### 5. Shared Test Data

Shared setup causes tests to interfere with each other.

Bad: Shared state

```
testData = { userId: 1, email: 'test@example.com' }

test_creates_user:
  user = createUser(testData)
  testData.userId = user.id  // Modifies shared state

test_finds_user:
  user = getUser(testData.userId)  // Depends on previous test
```

Good: Each test has its own data

```
test_creates_user:
  data = { email: 'test@example.com' }
  user = createUser(data)
  assert(user.id is defined)

test_finds_user:
  data = { email: 'test@example.com' }
  user = createUser(data)
  found = getUser(user.id)
  assert(found.email == data.email)
```

## Test-First: Pragmatic Approach

Test-first (writing tests before implementation) has real benefits, but context matters.

### When Test-First Makes Sense

**Bug Fixes**

Bug: Empty email accepted when it shouldn't be

```
test_rejects_empty_email_on_form_submission:
  form = FormValidator()
  result = form.validate(email: '')
  assert('Email required' in result.errors)
```

Then implement the fix to make the test pass:

```
function validate(data):
  if not data.email or data.email.trim() is empty:
    return { errors: ['Email required'] }
  return { errors: [] }
```

**Why test-first here:** You verify the fix actually addresses the bug. You see it fail first.

**API Design**

```
test_creates_user_with_email_and_password:
  user = createUser(email: 'user@example.com', password: 'SecurePass123!')
  assert(user.id is defined)
  assert(user.email == 'user@example.com')
```

Implement the API to match the test interface.

**Why test-first here:** Forces you to think about API before implementation. Tests document desired behavior.

**Refactoring Safety**

```
test_calculates_total_correctly_with_tax:
  total = calculateTotal(100, 0.1)
  assert(total == 110)
```

Now refactor internals confidently. Tests verify you didn't break behavior.

### When Tests-After Is Fine

**Prototyping/Spikes**

- Goal is exploration, not production
- Discard the prototype after
- No need to test throwaway code

**Configuration Files**

- Low complexity, low risk
- Usually validated elsewhere
- Return on test effort is low

**Internal Utilities (Low Risk)**

- Simple helper functions
- Already covered by integration tests
- Tests-after can validate without overhead

### The Pragmatic Cycle

Choose your approach based on context:

**Cycle A: Test-First (High Risk/Complexity)**

1. Write failing test (RED)
2. Verify it fails for right reason (manual check)
3. Write minimal code to pass (GREEN)
4. Verify it passes (manual check)
5. Refactor/clean up (REFACTOR)

**Cycle B: Implementation-First (Low Risk/Complexity)**

1. Implement feature
2. Write tests to verify behavior
3. Refactor if needed
4. Verify tests pass

**Key Rule:** If you choose Cycle B, ensure tests are genuinely comprehensive. No half-measures.

## Testing Pyramid

Invest in the right level of tests for maximum value.

```
        E2E (1-5%)
       /          \
      /  Few       \
     /   critical   \
    /    workflows   \
   /_______________\
  /                 \
 /  Integration      \
 /   (20-30%)        \
 /  Cross-module      \
 /   interactions     \
 /___________________\
/                     \
  Unit Tests           \
  (70%+)               \
 Fast, isolated        \
 Pure logic            \
/______________________\
```

### Unit Tests (Bottom - 70%+)

- **What:** Individual functions, classes, pure logic
- **Speed:** Fast (milliseconds)
- **Isolation:** No dependencies (mocked or stubbed)
- **Goal:** Verify each piece works correctly

Unit test: Pure function, no side effects

```
test_calculates_total_with_tax:
  result = calculateTotal(100, 0.1)
  assert(result == 110)
```

### Integration Tests (Middle - 20-30%)

- **What:** Multiple modules working together
- **Speed:** Slower (seconds)
- **Dependencies:** Real databases, queues, third-party services
- **Goal:** Verify interactions work correctly

Integration test: Real database + business logic

```
test_saves_user_and_retrieves_it_correctly:
  db = Database(':memory:')
  user = User(email: 'test@example.com')

  db.save(user)
  retrieved = db.find(user.id)

  assert(retrieved.email == 'test@example.com')
```

### E2E Tests (Top - 1-5%)

- **What:** Complete workflows from user perspective
- **Speed:** Slowest (tens of seconds to minutes)
- **Dependencies:** Full system (UI, API, database, external services)
- **Goal:** Verify critical user journeys work end-to-end

E2E test: Full workflow from UI to database

```
test_user_can_sign_up_and_log_in:
  // Navigate to signup page
  navigate('/signup')

  // Fill form and submit
  fill('input[email]', 'user@example.com')
  fill('input[password]', 'SecurePass123!')
  click('button[text="Sign Up"]')

  // Verify success
  waitFor(url == '/dashboard')

  // Log out
  click('user menu')
  click('text=Log Out')

  // Log in again
  navigate('/login')
  fill('input[email]', 'user@example.com')
  fill('input[password]', 'SecurePass123!')
  click('button[text="Log In"]')

  // Verify logged in
  assert(url == '/dashboard')
```

### Coverage Strategy

**Don't chase percentage, chase risk:**

| Code Path                   | Priority | Test Level          | Example                     |
| --------------------------- | -------- | ------------------- | --------------------------- |
| **Critical business logic** | High     | Unit + Integration  | Payment calculation         |
| **Error handling**          | High     | Unit + Integration  | Network failure, validation |
| **User workflows**          | High     | E2E                 | Sign up, checkout           |
| **Edge cases**              | High     | Unit                | Null values, empty arrays   |
| **Nice-to-have features**   | Low      | Unit or Integration | Analytics, logging          |
| **Presentation**            | Low      | Manual or snapshot  | UI styling                  |

**Target:**

- Unit test coverage: 70-80%
- Integration tests for critical workflows
- E2E tests for customer-facing journeys
- Overall coverage goal: Confidence, not percentage

## Refactoring With Tests

Tests are your safety net. They enable confident refactoring.

### The Safe Refactoring Process

1. Have comprehensive tests for code you'll refactor
2. Refactor (change internals, not behavior)
3. Run tests immediately
4. If tests fail: revert and re-analyze
5. If tests pass: you're done

### Real Example: Extracting Duplication

**Before (with tests):**

```
test_formats_us_phone_number:
  assert(formatPhone('5551234567') == '(555) 123-4567')

test_formats_canadian_phone_number:
  assert(formatPhone('4165551234') == '(416) 555-1234')

function formatPhone(phone):
  if phone.length != 10:
    throw Error('Invalid')
  area = phone[0:3]
  exchange = phone[3:6]
  subscriber = phone[6:10]
  return '(' + area + ') ' + exchange + '-' + subscriber
```

**Refactor (Extract to helper):**

```
function formatPhone(phone):
  if phone.length != 10:
    throw Error('Invalid')
  return formatDigits(phone, [3, 3, 4])

function formatDigits(digits, groups):
  parts = []
  offset = 0
  for len in groups:
    parts.append(digits[offset : offset + len])
    offset += len
  return '(' + parts[0] + ') ' + parts[1] + '-' + parts[2]
```

**Verify:** Run tests. They still pass → refactor worked. No behavior changed.

### Benefits of Refactoring-With-Tests

| Benefit         | Impact                                  |
| --------------- | --------------------------------------- |
| Confidence      | You KNOW you didn't break anything      |
| Speed           | Refactor without manual verification    |
| Reliability     | Catch unintended side effects instantly |
| Maintainability | Improve code without risk               |

## Debugging Tests

### Test Fails: What Now?

**Step 1: Read the Failure**

Expected: 'email required'
Received: undefined

File: src/validation.test.ts:15

- **What changed?** Code or test?
- **Is failure expected?** Or accidental?
- **Where exactly?** Stack trace shows the line

**Step 2: Run Test in Isolation**

Run your test suite filtering for this specific test file or test name. This:

- Eliminates interference from other tests
- Faster feedback loop
- Easier to debug

**Step 3: Add Debugging**

```
test_validates_email:
  result = validate(email: '')

  print('Result:', result)
  print('Errors:', result.errors)

  assert('email required' in result.errors)
```

**Step 4: Bisect the Problem**

If unclear what's wrong, break the test down:

```
test_validates_email_step_by_step:
  validator = EmailValidator()
  assert(validator is defined)  // Does it construct?

  data = { email: '' }
  assert(data is defined)  // Is input set up right?

  result = validator.validate(data)
  assert(result is defined)  // Does it return something?

  assert(result.errors is defined)  // Are errors present?
  assert(result.errors.length > 0)  // Are there errors?
  assert('email' in result.errors[0])  // Is the error about email?
```

Each step isolates where it breaks.

### Flaky Tests

A test that sometimes passes, sometimes fails. Eliminate immediately.

**Common Causes:**

| Cause                      | Fix                                        |
| -------------------------- | ------------------------------------------ |
| **Timing assumptions**     | Don't assume time. Use callbacks/promises  |
| **Shared test state**      | Isolate tests, clean up after each         |
| **Non-deterministic code** | Deterministic behavior, or mock randomness |
| **Real async code**        | Mock timers, use fake clocks               |
| **Race conditions**        | Proper awaits, don't assume order          |

Flaky: Timing assumption

```
test_request_completes:
  processRequest()
  wait(100ms)  // Might timeout on slow systems
  assert(result is defined)
```

Not flaky: Proper async handling

```
test_request_completes:
  promise = processRequest()
  result = await promise
  assert(result is defined)
```

## Quick Reference: Checklist

Before committing code:

- All tests pass (run your test suite)
- Tests are deterministic (run 10x, always pass)
- Each test is independent
- Test names describe behavior clearly
- One behavior per test
- Edge cases covered (nulls, errors, boundaries)
- No over-mocking (real code where possible)
- Mocks only at boundaries (APIs, DB, timers)
- Assertions are specific (not generic truthy checks)
- Code coverage is on critical paths
- Refactoring confidence: would you refactor with these tests?

## Red Flags: Stop and Review

If you notice:

- Test passes immediately without seeing it fail
- Test name doesn't describe behavior
- "And" in test name (multiple behaviors)
- Tests depend on other tests or shared data
- Mocking everything, no real code paths
- Unclear what's being tested
- "I'll test this later" after implementation
- No tests for error handling
- Coverage at 10% (probably incomplete)
- Tests are flaky (sometimes pass, sometimes fail)

**All mean:** Review test quality before moving on.

## Final Principle

Good tests = Confidence to change code
Bad tests = False confidence or obstacles to change
No tests = Fear of change

Write tests that give genuine confidence.
