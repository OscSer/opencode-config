---
name: code-review
description: Review changes to find high-impact issues. Use for code review changes or pull requests.
---

# Code Review Skill

## Purpose

- Perform a focused, high-signal code review. **Report only issues that would actually cause problems in production or significantly impact code quality.**
- Prioritize impactful issues and avoid low-value nitpicks, theoretical concerns, or stylistic preferences.
- **Core principle: Better to miss minor issues than to flood with false positives.**

## Review Process

### Pass 1: Discovery Mode

**Objective:** Find and list ALL potential issues. Be inclusive and comprehensive.

**CRITICAL RULES for Pass 1:**

- **NO ANALYSIS ALLOWED** - Do not evaluate, judge, or reason about issues yet
- **NO CONCLUSIONS** - Do not decide if something is good or bad
- **CAST A WIDE NET** - When in doubt, include it. Better to list and discard later than miss it now

**What to look for:**

- Error handling changes
- Logic changes
- New dependencies
- Resource management (files, connections, memory)
- Security-related code
- API changes
- Data transformations
- State mutations
- Boundary conditions
- Async/await patterns

**OUTPUT - Print this exact format:**

```
PASS 1 COMPLETE - Potential Issues Found:
1. [Brief description] in [file:line]
2. [Brief description] in [file:line]
3. [Brief description] in [file:line]
...
```

**STOP: Pass 1 must be complete before proceeding. Do not continue until the numbered list above is printed.**

---

### Pass 2: Evaluation Mode

**Prerequisite Check:**
Before starting Pass 2, verify you have:

- [ ] Completed Pass 1 with a numbered list of ALL potential issues
- [ ] Printed the "PASS 1 COMPLETE" output with the list

If NO to any above, **GO BACK and complete Pass 1 first.**

**Objective:** Evaluate ONLY the items from Pass 1. Do NOT find new issues.

**Phase A: Context Collection (MANDATORY)**

Before evaluating ANY issue, you MUST gather context by reading files:

For each issue in the Pass 1 list:
1. **Read the source file** at the issue location (not just the diff)
2. **Read related files:**
   - Files that import/export the changed code
   - Test files
   - Configuration files
   - API contracts/interfaces
3. **Search codebase** for usage patterns if needed

**STOP: Do not proceed to Phase B until you have read the relevant files for ALL issues.**

**Phase B: Evaluation**

For each issue in the Pass 1 list, apply the 4-check framework using the context gathered in Phase A:

**1. Impact Analysis**

- "This would cause [SPECIFIC PROBLEM] when [SCENARIO]"
- If you can't fill in these blanks concretely → DISCARD
- Examples: crash, data loss, security breach, resource leak, API contract violation

**2. Evidence Check**

- "I know this is a problem because [EVIDENCE]"
- Evidence = observable behavior, error pattern, resource leak pattern, security risk, breaking change
- NOT evidence = "typically," "best practice," "cleaner," "might," "could," style preferences

**3. Scope Verification**

- "This issue exists in [CHANGED CODE / PRE-EXISTING CODE]"
- Only report if introduced in changed code
- Ignore pre-existing issues unless made worse by changes

**4. Value Test**

- "Reporting this prevents [CONCRETE NEGATIVE OUTCOME]"
- If outcome is vague, theoretical, or stylistic → DISCARD
- Ask: Would this prevent a real problem or just align with preference?

**CRITICAL: Only report if ALL 4 checks pass with concrete, factual answers.**

**OUTPUT - Print this exact format:**

```
PASS 2 EVALUATION:

Phase A - Context Collection:
- Issue #1: Read [file1.ts, file2.ts], Found [key context about the issue]
- Issue #2: Read [file3.ts], Found [key context about the issue]
...

Phase B - Evaluation:
- Issue #1: [REPORT/DISCARD] - [brief reason with evidence from Phase A]
- Issue #2: [REPORT/DISCARD] - [brief reason with evidence from Phase A]
...
```

**Remember: The goal is NOT perfection. The goal is preventing real problems.**

## Example Workflow

### After Pass 1 (Discovery Mode):

```
PASS 1 COMPLETE - Potential Issues Found:
1. Removed error handler in api/users.ts:23
2. Possible resource leak in db/connection.ts:67
3. Variable naming could be clearer in utils/format.ts:12
4. New API endpoint without rate limiting in api/routes.ts:45
```

### After Pass 2 (Evaluation Mode):

```
PASS 2 EVALUATION:

Phase A - Context Collection:
- Issue #1: Read [api/users.ts, db/connection.ts], Found error handler removed, no fallback in callers
- Issue #2: Read [db/connection.ts, tests/connection.test.ts], Found connection.close() missing in catch block
- Issue #3: Read [utils/format.ts], Variable name is clear in context
- Issue #4: Read [api/routes.ts, middleware/auth.ts], Endpoint is internal-only, auth enforced

Phase B - Evaluation:
- Issue #1: REPORT - Removes error handling for database failures (fails Impact Analysis)
- Issue #2: REPORT - Connection not closed in error path (fails Evidence Check)
- Issue #3: DISCARD - Stylistic preference, no actual problem (fails Value Test)
- Issue #4: DISCARD - Internal API, not exposed publicly (fails Impact Analysis)
```

## Final Output

- Include ONLY the issues marked as REPORT from Pass 2. Do not include DISCARDED issues.
- **Language:** Respond in the language preferred by the user.

If no findings, return:

```markdown
# Code Review

{1-3 sentences: what functionality was added/modified/removed}

## Findings

Looks good to me!
```

If findings, return:

```markdown
# Code Review

{1-3 sentences: what functionality was added/modified/removed}

## Findings

**{path:line}**
{1-2 sentences explaining the problem and its impact}
{Concrete fix - code snippet or specific action to take}

---

{repeat for each finding}

---
```
