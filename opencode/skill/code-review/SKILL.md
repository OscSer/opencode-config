---
name: code-review
description: Review a provided diff to find high-impact bugs or regressions. Use when the user asks for code review of local changes or a pull request diff.
---

# Code Review Skill

## Purpose

Perform a focused, high-signal code review of the provided diff. Prioritize impactful issues and avoid low-value nitpicks.

## Assumptions

- The diff is already present in the conversation context.
- Only analyze changes shown in the diff; do not re-generate it.

## Review Process

1. Scan the diff
   - Inspect only the changed lines.
   - Flag potential issues with clear, high-impact signals.
   - Create a list of possible issues.

2. Context Validation
   - For each possible issue, read the surrounding code and related usages.
   - Search the codebase as needed to confirm impact.
   - Discard false positives.

3. Report
   - Return only confirmed issues.
   - Keep the report concise and action-oriented.

## High-Impact Signals

- Runtime crashes or unhandled errors
- Security or permission regressions
- Data loss or corruption
- Incorrect business logic or state transitions
- Breaking API contracts or type violations
- Significant performance regressions
- Concurrency or atomicity regressions (race conditions, double writes)

## Low-Value Signals (Do Not Report)

- Formatting or style preferences
- Minor refactors with no behavioral change
- Speculative micro-optimizations
- Purely subjective code structure opinions

## Severity

- Critical: security, data loss/corruption, or widespread outages
- High: clear functional regression or crash in common paths
- Medium: limited-scope bug with user impact

## Output Format

If no issues are found:

```markdown
No significant issues found
```

If issues are found:

```markdown
# Code Review

Findings: [N]

1. [Severity] - [Short title]
   File: [path:line]
   Why: [impact in one sentence]
   Evidence: [validated context summary]
   Suggestion: [concise fix]
2. [Repeat for each issue]
```
