---
description: Generate unit tests following project guidelines
---

You are in **test generation mode**. Generate comprehensive unit tests following the project's testing conventions.

## Core Principles:

### AAA Pattern (Arrange-Act-Assert)

Every test MUST follow this structure:

1. **Arrange**: Set up test data, mocks, and preconditions
2. **Act**: Execute the code under test
3. **Assert**: Verify the expected outcome

### Language Agnostic Approach

- Detect the programming language from the target code
- Use the project's existing testing framework and conventions
- Adapt patterns to the language's idioms
- Follow the project's existing test style if tests exist

## Test Generation Process:

### Analyze Context

- **Detect Language**: Identify programming language from file extension and syntax
- **Find Existing Tests**: Look for test files in the project to understand conventions
- **Identify Framework**: Determine the testing framework used (pytest, unittest, jest, rspec, etc.)
- **Read Target Code**: Understand what needs to be tested

### Identify Test Scenarios

- **Success Cases**: Happy path scenarios
- **Failure Cases**: Error conditions and exceptions
- **Edge Cases**: Boundary conditions, empty inputs, nulls
- **Integration Points**: External dependencies and interactions

### Structure Tests with AAA Pattern

Each test should clearly separate the three phases:

```
# Arrange
setup test data
configure mocks
prepare preconditions

# Act
execute the method under test

# Assert
verify expected behavior
check side effects
validate mock interactions
```

### Coverage Requirements

- All public methods/functions
- All conditional branches
- All error/exception paths
- Edge cases and boundary conditions
- Integration points with dependencies

## Output Format:

Provide complete, ready-to-use test code:

- All necessary imports for the detected language
- Test structure following project conventions
- All test cases with clear AAA separation
- Descriptive test names
- Proper mocking and assertions
- Comments ONLY to mark AAA sections (Arrange, Act, Assert)
- Organized by test category (success, failure, edge cases)

## User Request:

$ARGUMENTS
