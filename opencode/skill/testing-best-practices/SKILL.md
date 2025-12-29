---
name: testing-best-practices
description: Covers testing patterns and common anti-patterns. Use when writing tests, reviewing test quality, or fixing flaky tests.
---

# Testing Best Practices

Tests are insurance against bugs and regression. Quality tests give confidence to refactor, deploy, and evolve code safely.

**Core principle:** Tests MUST be clear, focused, and test behavior—not implementation details. Unclear tests = hidden bugs waiting to surface.

## When Tests Matter Most

Testing has a cost. Invest where ROI is highest.

| Priority | Scenario             | Why                                            | Test Level         |
| -------- | -------------------- | ---------------------------------------------- | ------------------ |
| **HIGH** | Bug fixes            | Reproduces bug + proves fix + prevents regress | Unit               |
| **HIGH** | Public APIs          | Breaking changes affect users                  | Unit + Integration |
| **HIGH** | Business logic       | Complex rules, bugs are costly                 | Unit               |
| **HIGH** | Critical paths       | Payment, auth, data integrity                  | All levels         |
| MEDIUM   | Integration points   | Module contracts must work                     | Integration        |
| MEDIUM   | Error handling       | Edge cases easy to miss                        | Unit               |
| LOW      | UI presentation      | Changes frequently, expensive to test          | E2E selectively    |
| LOW      | Configuration        | Low complexity, low risk                       | Skip or minimal    |
| LOW      | Throwaway/spike code | Test real implementation later                 | Skip               |

**Decision rule:** High risk OR high complexity = test thoroughly. Low risk AND low complexity = skip or defer.

## Test Structure Patterns

### Arrange-Act-Assert (AAA)

Every test MUST follow this structure. No exceptions.

```
// ARRANGE: Setup state and dependencies
validator = EmailValidator()
email = 'user@example.com'

// ACT: Execute the behavior (ONE action)
result = validator.validate(email)

// ASSERT: Verify the outcome
assert(result.isValid == true)
assert(result.errors == empty)
```

Tests without AAA structure = maintenance nightmare. Every time.

### Test Naming

Names MUST describe behavior, not mechanism. If the name doesn't tell you what's being tested, it's wrong.

**Good names** (behavior-focused):

- `retries_operation_up_to_3_times_before_throwing`
- `returns_null_when_user_does_not_exist`
- `throws_ValidationError_when_email_is_invalid`

**Bad names** (vague/implementation-focused):

- `retry_test`
- `getUser`
- `validation`

### One Behavior Per Test

If your test name contains "and", split it. Multiple behaviors in one test = debugging nightmare.

```
// BAD: Tests multiple behaviors
test_creates_user_sends_email_and_logs_event:
  user = createUser(email: 'test@example.com')
  assert(user.id is defined)
  assert(emailService.send was called)
  assert(logger.log was called)

// GOOD: Each behavior isolated
test_creates_user_with_generated_id:
  user = createUser(email: 'test@example.com')
  assert(user.id is defined)

test_sends_welcome_email_after_user_creation:
  createUser(email: 'test@example.com')
  assert(emailService.send was called with 'test@example.com')

test_logs_user_creation_event:
  createUser(email: 'test@example.com')
  assert(logger.log was called with 'user_created')
```

### Test Independence

Tests MUST NOT depend on other tests or shared mutable state. Order-dependent tests = flaky suite.

```
// BAD: Shared state, order-dependent
user = null  // Global state

test_creates_user:
  user = db.createUser(name: 'Alice')

test_finds_user_by_id:
  found = db.getUserById(user.id)  // Depends on previous test!

// GOOD: Self-contained
test_creates_user:
  user = db.createUser(name: 'Alice')
  assert(user.id is defined)

test_finds_user_by_id:
  user = db.createUser(name: 'Alice')  // Own setup
  found = db.getUserById(user.id)
  assert(found.name == 'Alice')
```

### Deterministic Tests

Tests MUST pass/fail consistently. Flaky tests destroy trust in the entire suite.

```
// BAD: Flaky—timing assumptions
test_processes_request_quickly:
  start = currentTime()
  processRequest()
  elapsed = currentTime() - start
  assert(elapsed < 100)  // Fails on slow CI

// GOOD: Behavior-focused, deterministic
test_notifies_on_completion:
  notified = false
  onComplete(() => { notified = true })
  processRequest()
  assert(notified == true)
```

## Anti-Patterns

### 1. Over-Mocking

Mock external boundaries only. Over-mocking = testing mock behavior, not real code.

```
// BAD: Everything mocked, tests nothing real
test_fetches_user_data:
  mockDb = { query: mockFunction() }
  mockCache = { get: mockFunction(), set: mockFunction() }
  mockLogger = { log: mockFunction() }

  result = getUserData(mockDb, mockCache, mockLogger)

  assert(mockDb.query was called with 'SELECT * FROM users')
  assert(mockCache.set was called)

// GOOD: Mock edges, use real internals
test_fetches_user_data:
  mockDb = { query: returns({ id: 1, name: 'Alice' }) }
  cache = RealCache()

  result = getUserData(mockDb, cache)

  assert(result == { id: 1, name: 'Alice' })
  assert(cache.has('user:1') == true)
```

**Rule:** Mock APIs, databases, network, timers. Use real code for business logic.

### 2. Implementation Coupling

Tests tied to internals break on every refactor—even when behavior is unchanged.

```
// BAD: Testing private method
test_calculates_discount:
  calculator = DiscountCalculator()
  result = calculator._applyMultiplier(0.5)  // Private!
  assert(result == 0.5)

// GOOD: Testing public behavior
test_applies_premium_discount_correctly:
  calculator = DiscountCalculator()
  price = calculator.calculate(100, 'premium')
  assert(price == 50)
```

**Rule:** Test public interface. If you can't test without accessing internals, the design is wrong.

### 3. Vague Assertions

Generic assertions make failures impossible to debug.

```
// BAD: What failed? No idea.
assert(user is truthy)
assert(result is not undefined)

// GOOD: Specific, debuggable
assert(user == { id: 1, email: 'test@example.com' })
assert(result.isValid == true)
assert(result.errors == [])
```

### 4. Missing Edge Cases

Happy path only = false confidence. Edge cases reveal real bugs.

```
// BAD: Only happy path
test_validates_password:
  assert(validatePassword('SecurePass123!') == true)

// GOOD: Comprehensive
test_validates_strong_password:
  assert(validatePassword('SecurePass123!') == true)

test_rejects_empty_password:
  assert(validatePassword('') == false)

test_rejects_short_password:
  assert(validatePassword('Short1!') == false)

test_rejects_password_without_uppercase:
  assert(validatePassword('weakpass123!') == false)

test_rejects_password_without_numbers:
  assert(validatePassword('WeakPassword!') == false)
```

### 5. Shared Mutable Test Data

Shared setup causes tests to interfere. Each test owns its data.

```
// BAD: Shared mutable state
testData = { userId: 1, email: 'test@example.com' }

test_creates_user:
  user = createUser(testData)
  testData.userId = user.id  // Mutates shared state!

test_finds_user:
  user = getUser(testData.userId)  // Depends on mutation

// GOOD: Isolated data per test
test_creates_user:
  data = { email: 'create@example.com' }
  user = createUser(data)
  assert(user.id is defined)

test_finds_user:
  data = { email: 'find@example.com' }
  user = createUser(data)
  found = getUser(user.id)
  assert(found.email == data.email)
```

## Testing Pyramid

Invest in the right level for maximum value.

```
       /\
      /  \  E2E (1-5%)
     /    \ Critical user journeys only
    /------\
   /        \  Integration (20-30%)
  /          \ Cross-module interactions
 /------------\
/              \  Unit (70%+)
  Fast, isolated, pure logic
```

### Unit Tests (70%+)

- **What:** Individual functions, classes, pure logic
- **Speed:** Milliseconds
- **Isolation:** No real dependencies
- **Goal:** Verify each piece works

```
test_calculates_total_with_tax:
  result = calculateTotal(100, 0.1)
  assert(result == 110)
```

### Integration Tests (20-30%)

- **What:** Multiple modules together
- **Speed:** Seconds
- **Dependencies:** Real databases, queues, services
- **Goal:** Verify interactions work

```
test_saves_and_retrieves_user:
  db = Database(':memory:')
  user = User(email: 'test@example.com')

  db.save(user)
  retrieved = db.find(user.id)

  assert(retrieved.email == 'test@example.com')
```

### E2E Tests (1-5%)

- **What:** Complete user workflows
- **Speed:** Tens of seconds to minutes
- **Dependencies:** Full system
- **Goal:** Verify critical journeys

```
test_user_signup_and_login:
  navigate('/signup')
  fill('email', 'user@example.com')
  fill('password', 'SecurePass123!')
  click('Sign Up')
  waitFor(url == '/dashboard')

  click('Log Out')
  navigate('/login')
  fill('email', 'user@example.com')
  fill('password', 'SecurePass123!')
  click('Log In')
  assert(url == '/dashboard')
```

### Coverage Strategy

Don't chase percentage. Chase risk coverage.

| Code Path          | Priority | Test Level         |
| ------------------ | -------- | ------------------ |
| Business logic     | HIGH     | Unit + Integration |
| Error handling     | HIGH     | Unit               |
| Critical workflows | HIGH     | E2E                |
| Edge cases         | HIGH     | Unit               |
| Nice-to-have       | LOW      | Unit or skip       |
| Presentation/UI    | LOW      | Manual or snapshot |

## Refactoring With Tests

Tests are your safety net for refactoring. No tests = fear of change.

### The Process

1. Ensure comprehensive tests exist for code you'll change
2. Refactor (change internals, NOT behavior)
3. Run tests immediately
4. Tests fail? Revert and re-analyze
5. Tests pass? Done

### Example

**Before refactoring:**

```
test_formats_phone_number:
  assert(formatPhone('5551234567') == '(555) 123-4567')

function formatPhone(phone):
  if phone.length != 10: throw Error('Invalid')
  area = phone[0:3]
  exchange = phone[3:6]
  subscriber = phone[6:10]
  return '(' + area + ') ' + exchange + '-' + subscriber
```

**After refactoring (extract helper):**

```
function formatPhone(phone):
  if phone.length != 10: throw Error('Invalid')
  return formatDigits(phone, [3, 3, 4], '({0}) {1}-{2}')

function formatDigits(digits, groups, template):
  parts = splitByGroups(digits, groups)
  return template.format(*parts)
```

Run tests. Still pass? Refactor succeeded. Behavior unchanged.

## Debugging Failing Tests

### Step 1: Read the Failure

```
Expected: 'email required'
Received: undefined
File: src/validation.test.ts:15
```

- What changed? Code or test?
- Is failure expected?
- Where exactly? (stack trace)

### Step 2: Isolate

Run the single failing test. Eliminates interference, faster feedback.

### Step 3: Add Debugging

```
test_validates_email:
  result = validate(email: '')
  print('Result:', result)
  print('Errors:', result.errors)
  assert('email required' in result.errors)
```

### Step 4: Bisect

Break down into smaller assertions to find exact failure point:

```
test_validates_email_step_by_step:
  validator = EmailValidator()
  assert(validator is defined)          // Constructs?

  result = validator.validate({ email: '' })
  assert(result is defined)             // Returns?
  assert(result.errors is defined)      // Has errors?
  assert(result.errors.length > 0)      // Errors exist?
  assert('email' in result.errors[0])   // Right error?
```

### Fixing Flaky Tests

Flaky = sometimes passes, sometimes fails. Destroy trust. Fix immediately.

| Cause                | Fix                                  |
| -------------------- | ------------------------------------ |
| Timing assumptions   | Use callbacks/promises, not `wait()` |
| Shared mutable state | Isolate tests, clean up after each   |
| Non-deterministic    | Mock randomness, control inputs      |
| Uncontrolled async   | Mock timers, use fake clocks         |
| Race conditions      | Proper awaits, don't assume order    |

## Output Format (For Test Reviews)

When reviewing existing tests, structure feedback as:

```
## Test Review: [file/module name]

### Issues Found
- [ANTI-PATTERN]: Description and location
- [MISSING]: Edge case or scenario not covered

### Recommendations
1. [Specific fix with example]
2. [Specific fix with example]

### Coverage Assessment
- Critical paths: [covered/missing]
- Edge cases: [covered/missing]
- Error handling: [covered/missing]
```

## Quick Reference Checklist

Before committing:

- [ ] All tests pass
- [ ] Tests are deterministic (run 10x, always same result)
- [ ] Each test is independent
- [ ] Test names describe behavior
- [ ] One behavior per test
- [ ] Edge cases covered (nulls, errors, boundaries)
- [ ] Mocks only at boundaries (APIs, DB, timers)
- [ ] Assertions are specific (not truthy checks)
- [ ] Critical paths have coverage

## Red Flags — STOP and Review

If you notice any of these, the tests need work:

- Test passes immediately without seeing it fail first
- Test name doesn't describe behavior
- "And" in test name (multiple behaviors)
- Tests depend on execution order
- Mocking everything, no real code paths
- Unclear what's being tested
- No tests for error handling
- Tests are flaky

**All mean:** Fix test quality before moving on.

## Final Principle

```
Good tests  = Confidence to change code
Bad tests   = False confidence or obstacles
No tests    = Fear of change
```

Write tests that give genuine confidence. Nothing less.
