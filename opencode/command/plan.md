---
description: Create a concise implementation plan
---

## Request

```text
$ARGUMENTS
```

## Your Task

- Create a single, actionable implementation plan for the request.
- Ask follow-up questions only if truly blocking.
- Iterate on the plan as many times as needed.
- Require explicit confirmation before executing the plan.

## Workflow

1. Scan context.
   - Skim likely impacted files and identify constraints (language, framework, test commands, deployment shape).

2. Clarify only if blocked.
   - Prefer reasonable assumptions when not blocked.
   - If blocked, ask focused multiple-choice questions when possible.

3. Produce the plan using the template below.
   - Start with a short paragraph (1-3 sentences) covering intent, why, and high-level approach.
   - Add a short scope section with in/out items.
   - Provide an ordered, atomic checklist, using verb-first steps.
   - Include at least one validation/testing step.
   - Include edge cases or risk handling when applicable.
   - If unknowns remain, include an `## Questions` section.

4. Run an approval loop (mandatory).
   - Present the plan and ask for explicit approval to execute it.
   - If changes are requested, revise the plan and ask for approval again.
   - Repeat until explicit approval is provided.

5. Execute only after approval.
   - Do not execute any implementation step before explicit approval.
   - After approval, execute the plan and report what was completed.

6. Output constraints.
   - Do not include meta commentary about the process.
   - Do not create plan files.

## Output Template (follow exactly)

```markdown
# Plan

<1-3 sentences: what we're doing, why, and the high-level approach.>

## Scope

<1-3 sentences: in/out items and constraints.>

## Action items

[ ] <Step 1>
[ ] <Step 2>
[ ] <Step 3>
[ ] <Step 4>
[ ] <Step 5>

[Optional: include only if there are unknowns]

## Questions

1. <Question 1>
2. <Question 2>
3. <Question 3>
```

## Checklist Guidance

- Reference likely files/modules when useful (for example: `src/...`, `app/...`, `services/...`).
- Name concrete validation commands (for example: `bun test`, `npm test`, `pnpm test`).
- Keep items implementation-agnostic (no code snippets).
- Avoid vague checklist items such as "handle backend" or "do auth".
