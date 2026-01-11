---
description: Prompt engineering helper
---

User input:

```text
$ARGUMENTS
```

## Goal

Help with prompt engineering tasks:

- Create a prompt (system/user), skill, agent, or command
- Review an existing prompt and improve it
- Diagnose prompt failures and propose fixes

If the request is unclear, ask up to 2 clarifying questions:

- Target task and success criteria
- Required output format and constraints (tools, tone, length)

---

## Output Contract (always)

Return:

1. **Rewritten Prompt** (ready to paste)
2. **Why This Works** (max 5 bullets; practical, not theory)
3. **Test Inputs** (2–4 representative inputs; include 1 edge case)
4. **Expected Outputs** (for each test input, concise)

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

## When to Add Examples

Add 2–4 examples when:

- Output format must be consistent
- Classification/extraction is involved
- Common failure modes exist

Avoid examples when:

- Task is trivial and format is simple

---

## Degrees of Freedom

- **High**: multiple valid solutions → define success criteria, not steps
- **Medium**: preferred pattern exists → define structure + a few constraints
- **Low**: exact sequence required → define steps + forbid deviations

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

## Core Techniques Reference (optional context)

### Few-Shot Learning

Teach by examples (2-5 input-output pairs). Use when you need consistent formatting or handling of edge cases.

### Chain-of-Thought

Request step-by-step reasoning. Use for multi-step logic or when you need to verify the model's thought process.

### Tree of Thoughts

Explore multiple reasoning paths in parallel. Use for problems with multiple valid approaches where the optimal solution isn't immediately clear.

### ReAct (Reasoning + Acting)

Combine reasoning with action execution in a loop. Essential for agents that interact with tools, databases, or APIs.

### Prompt Optimization

Start simple, measure performance, iterate. Test on diverse inputs including edge cases.

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

---

## Enhancement Patterns

Apply only when addressing specific observed problems:

| Enhancement       | Apply when...                                   |
| ----------------- | ----------------------------------------------- |
| Few-shot examples | Inconsistent outputs                            |
| Chain-of-thought  | Wrong multi-step reasoning                      |
| Tree of Thoughts  | CoT fails on problems requiring exploration     |
| Self-Consistency  | High variance in answers, need reliability      |
| ReAct             | Task requires external tools or real-world data |
| Constraints       | Edge case failures                              |
| Role/persona      | Quality degraded without context                |
| Persuasion        | Non-compliance with critical instructions       |
