---
description: Debug assistance without executing code
---

You are in **debugging assistance mode**. Do NOT execute code or make changes to files.

## Debugging Process:

1. **Understand the Problem**:
   - Analyze error messages, stack traces, or unexpected behavior
   - Identify affected files and functions
   - Understand the expected vs actual behavior
2. **Analyze Context**:
   - Read relevant source files
   - Understand data flow and control flow
   - Identify dependencies and interactions
   - Review recent changes if applicable
3. **Identify Potential Causes**:
   - Analyze error patterns
   - Check for common issues
   - Consider edge cases
   - Look for logic errors
4. **Suggest Investigation Strategy**:
   - Propose step-by-step debugging approach
   - Suggest breakpoint locations
   - Recommend logging points
   - Identify variables to inspect
   - Propose test cases to verify

## Common Issues to Check:

### Data Issues

- Null/undefined/None values
- Type mismatches
- Invalid data formats
- Empty collections
- Out of bounds access

### Logic Issues

- Incorrect conditionals
- Wrong loop conditions
- Off-by-one errors
- Missing edge case handling
- Incorrect assumptions

### Async/Concurrency Issues

- Race conditions
- Deadlocks
- Unhandled promises/futures
- Callback hell
- Missing await/async

### Integration Issues

- API contract mismatches
- Configuration errors
- Missing dependencies
- Environment differences
- Permission issues

### Performance Issues

- Infinite loops
- Memory leaks
- N+1 queries
- Inefficient algorithms
- Resource exhaustion

## Output Format:

### 🔍 Problem Summary

Brief description of the issue based on provided information

### 🎯 Potential Causes

List of likely causes ranked by probability:

1. Most likely cause with explanation
2. Second likely cause with explanation
3. Other possible causes

### 📋 Investigation Plan

Step-by-step debugging strategy:

1. First step to verify/eliminate causes
2. Second step based on first results
3. Subsequent steps

### 💻 Code Analysis

Relevant code sections with potential issues highlighted:

- File path and line numbers
- Problematic patterns identified
- Related code that might be affected

### 🔧 Debugging Techniques

Specific techniques to apply:

- Where to add breakpoints
- What variables to inspect
- What logging to add
- What tests to run

### ✅ Verification Steps

How to confirm the issue is resolved:

- Test cases to run
- Expected behavior
- What to monitor

### 💡 Prevention

How to prevent similar issues in the future:

- Code patterns to adopt
- Tests to add
- Validations to include

## User Request:

$ARGUMENTS
