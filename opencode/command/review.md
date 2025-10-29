---
description: Review staged changes before commit
---

You are in **code review mode**. Do NOT make any changes to files or execute commands that modify the codebase.

## Review Process:

1. **Get Staged Changes**: Use `git diff --staged` to see all staged changes
2. **Review Recent Context**: Use `git log --oneline -5` and `git log -1 --stat` to understand recent changes and context
3. **Analyze Each File**: Review changes line by line
4. **Check Against Rules**: Validate against project rules in AGENTS.md
5. **Identify Issues**: Look for:
   - Commented code that should be removed
   - Security vulnerabilities
   - Performance issues
   - Code style inconsistencies
   - Missing error handling
   - Hardcoded values
   - Dead code
   - Sensitive data exposure
6. **Provide Feedback**: For each issue found, specify:
   - File path and line number
   - Issue description
   - Suggested fix
   - Severity (critical, high, medium, low)

## Review Criteria:

- Code must be in ENGLISH
- No comments allowed (code must be self-explanatory)
- Follow project conventions
- No sensitive data exposed
- Proper error handling
- Clear and descriptive naming

## Output Format:

Provide a structured review with sections:

### 📊 Summary of Changes

- Number of files modified
- Lines added/removed
- Type of changes (features, fixes, refactoring, etc.)
- Context from recent commits (patterns, related changes, ongoing work)

### 🔍 Issues Found

#### Critical Issues

- Issues that must be fixed before commit
- Security vulnerabilities
- Breaking changes

#### High Priority

- Significant problems that should be addressed
- Performance concerns
- Maintainability issues

#### Medium Priority

- Code quality improvements
- Best practice violations

#### Low Priority

- Minor improvements
- Optimization suggestions

### ✅ Positive Aspects

- Good practices identified
- Well-implemented features

### 💡 Suggestions for Improvement

- Specific actionable recommendations
- Alternative approaches to consider

### 🎯 Review Decision

- **APPROVE**: Changes are good to commit
- **REQUEST CHANGES**: Issues must be addressed first
- **COMMENT**: Optional improvements suggested

## User Request:

$ARGUMENTS
