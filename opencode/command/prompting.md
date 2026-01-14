---
description: Prompt engineering helper
---

User input:

```text
$ARGUMENTS
```

## Goal

Analyze user input and determine the task:

- If input contains an existing prompt → review and improve it
- If input describes a problem or failure → diagnose and fix
- If input requests creating something new → generate a prompt

Help with prompt engineering tasks:

- Create a prompt (system/user), skill, agent, command, etc.
- Review an existing prompt and improve it
- Diagnose prompt failures and propose fixes

---

## Output Contract

Adapt format based on task type:

### When creating a new prompt:

1. **Proposal** (complete prompt ready to use)
2. **Why This Works** (max 5 points; practical, not theoretical)

### When reviewing/improving an existing prompt:

1. **Proposed Changes** (specific section → before/after)
2. **Justification** (what problem each change solves)
3. **Impact** (how it affects behavior)

Example:

- **Before:** "Explain the code"
- **After:** "Explain the code in 3 bullet points: purpose, key logic, edge cases"
- **Justification:** "Explain" is too open-ended → inconsistent outputs
- **Impact:** Responses become predictable and scannable

### When diagnosing problems:

1. **Problems Identified** (with examples of failure)
2. **Proposed Solutions** (specific changes for each problem)
3. **Verification** (how to verify the problem is resolved)

---

## Prompt Template (use unless user requests otherwise)

```
# Role

You are <role>.

# Task

Do <task>.

# Constraints

- <hard rules>
- <do not do list>
- <tool limits, if any>

# Inputs

<variable placeholders or provided context>

# Output Format

<exact structure the model must return>

# Examples (optional)

Input: ...
Output: ...
```

---

## When to Add Examples (in the prompt itself)

Include 2–4 examples in the prompt when:

- Output format must be consistent
- Classification/extraction is involved
- Common failure modes exist
- User explicitly requests examples

Avoid examples when:

- Task is trivial and format is simple
- The model already knows the pattern well

---

## Degrees of Freedom

- **High**: multiple valid solutions → define success criteria, not steps
  - Example: "Generate creative product names" (many valid outputs)
- **Medium**: preferred pattern exists → define structure + a few constraints
  - Example: "Write commit message following Conventional Commits"
- **Low**: exact sequence required → define steps + forbid deviations
  - Example: "Parse CSV: validate headers, check types, handle nulls, return errors"

---

## Failure Mode Checklist

Use this checklist to diagnose and fix:

- Missing/unclear output format
- Conflicting rules
- Too much context (bloated prompt)
- No guardrails for edge cases
- Tooling not specified (when needed)
- No acceptance criteria / tests

---

## Antipatterns to Avoid

- **Verbose Fluff**: "Please", "kindly", "if you could" → use imperatives
- **Overconstraining**: Too many rules → model paralysis
- **Underspecifying Output**: "Write a summary" → define length, format, style
- **Conflicting Rules**: "Be concise" + "Explain in detail" → pick one
- **Assuming Context**: Model doesn't know your codebase/project unless told

---

## Core Techniques & Enhancement Patterns

Apply only when addressing specific observed problems:

| Technique/Enhancement   | Description                                                                             | Apply when...                                   |
| ----------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Few-Shot Learning**   | Teach by examples (2-5 input-output pairs)                                              | Inconsistent outputs or edge case handling      |
| **Chain-of-Thought**    | Request step-by-step reasoning                                                          | Wrong multi-step reasoning, need verification   |
| **Tree of Thoughts**    | Explore multiple reasoning paths in parallel                                            | CoT fails, need exploration of alternatives     |
| **ReAct**               | Combine reasoning with action execution in a loop                                       | Task requires external tools or real-world data |
| **Self-Consistency**    | Generate multiple responses and select the most consistent answer                       | High variance in answers, need reliability      |
| **Constraints**         | Add explicit rules for edge cases and boundaries                                        | Edge case failures                              |
| **Role/Persona**        | Define explicit role and context for the model                                          | Quality degraded without proper context         |
| **Prompt Optimization** | Start simple, measure performance, iterate. Test on diverse inputs including edge cases | Continuous improvement process                  |

---

## Persuasion Principles (for critical instructions)

### Authority

Imperative language for non-negotiable practices.
Example: "Write code before test? Delete it. No exceptions."

### Commitment

Require explicit declarations.
Example: "You MUST announce: 'I'm using [Skill Name]'"

### Social Proof

Reference universal patterns.
Example: "Checklists without tracking = steps get skipped. Every time."

**Avoid:** Reciprocity and Liking—can create sycophancy.
