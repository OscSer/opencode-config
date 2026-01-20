---
name: code-review
description: Review changes to find high-impact bugs or regressions. Use for code review of local changes or pull requests.
---

# Code Review Skill

## Purpose

- Perform a focused, high-signal code review. **Report only issues that would actually cause problems in production or significantly impact code quality.**
- Prioritize impactful issues and avoid low-value nitpicks, theoretical concerns, or stylistic preferences.
- **Core principle: Better to miss minor issues than to flood with false positives.**

## Review Process

1. Initial scan:
   - Read the changed lines (the diff)
   - Flag ONLY potential issues
   - Skip anything that doesn't add value
   - Create a focused list requiring validation

2. For each potential issue:
   1. Validate Context:
      - Read the related code
      - Find in codebase as needed
      - Identify High-Impact Signals
   2. Self-Check:
      Discard unless you answer YES to all questions
      - **Would this cause an actual problem?** (crash, bug, security issue, data loss)
      - **Is this based on facts over opinion?** (theoretical concerns, style preferences)
      - **Is this issue within scope of the changes made?** (relates to modified code, not pre-existing issues)

3. Report:
   - Return only issues that passed self-check
   - Keep the report concise and action-oriented

## High-Impact Signals

### Security & Configuration

- Security or permission regressions
- Hardcoded secrets or credentials
- Required environment variables without documentation
- Configuration changes affecting multiple environments

### Correctness & Stability

- Runtime crashes or unhandled errors
- Error handling gaps (removed handlers, swallowed exceptions, unhandled promises)
- Data loss or corruption
- Incorrect business logic or state transitions
- Breaking API contracts or type violations

### Resource Management

- Resource leaks (unclosed connections, event listeners, timers/intervals)
- Concurrency or atomicity regressions (race conditions, double writes)

### Quality & Maintainability

- Test coverage regressions (removed tests, critical logic untested)
- Dead code introduction (commented blocks, unused imports/functions)
- Significant performance regressions

## Low-Value Signals (Do Not Report)

**NEVER report these:**

- Formatting or style preferences
- Minor refactors with no behavioral change
- Speculative micro-optimizations
- Purely subjective code structure opinions
- "Could be clearer" naming suggestions without actual confusion
- Pattern suggestions (e.g., "should use factory pattern") without demonstrated need
- Theoretical edge cases that don't apply to the domain
- Performance concerns without measurement or clear impact
- "Best practice" violations that don't cause actual problems

**Remember: The goal is NOT perfection. The goal is preventing real problems.**

## Severity

- CRITICAL: hardcoded secrets, security vulnerabilities, data loss/corruption, or widespread outages
- HIGH: clear functional regression, crash in common paths, resource leaks, or removed error handling
- MEDIUM: limited-scope bug with user impact, test coverage gaps, or dead code introduction

## Output Format

If no findings, return:

```markdown
# Code Review

{1-3 sentences: what files changed, what functionality was added/modified/removed}

## Findings

Looks good to me!
```

If findings, return:

```markdown
# Code Review

{1-3 sentences: what files changed, what functionality was added/modified/removed}

## Findings

**{SEVERITY}** - {path:line}
**Description:** {1-2 sentences explaining the problem and its impact}
**Suggestion:** {Concrete fix - code snippet or specific action to take}

---

{repeat for each finding}
```
