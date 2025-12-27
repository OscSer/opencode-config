---
name: prompt-engineering
description: Provides advanced prompt engineering techniques including few-shot learning, chain-of-thought prompting, template systems, and system prompt design. Use when analyzing, writing, or improving prompts, system instructions, agent configurations, or LLM interaction patterns.
---

# Prompt Engineering Patterns

Advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability.

## Core Capabilities

### 1. Few-Shot Learning

Teach the model by showing examples instead of explaining rules. Include 2-5 input-output pairs that demonstrate the desired behavior. Use when you need consistent formatting, specific reasoning patterns, or handling of edge cases. More examples improve accuracy but consume tokens—balance based on task complexity.

**Example:**

```markdown
Extract key information from support tickets:

Input: "My login doesn't work and I keep getting error 403"
Output: {"issue": "authentication", "error_code": "403", "priority": "high"}

Input: "Feature request: add dark mode to settings"
Output: {"issue": "feature_request", "error_code": null, "priority": "low"}

Now process: "Can't upload files larger than 10MB, getting timeout"
```

### 2. Chain-of-Thought Prompting

Request step-by-step reasoning before the final answer. Add "Let's think step by step" (zero-shot) or include example reasoning traces (few-shot). Use for complex problems requiring multi-step logic, mathematical reasoning, or when you need to verify the model's thought process. Improves accuracy on analytical tasks by 30-50%.

**Example:**

```markdown
Analyze this bug report and determine root cause.

Think step by step:

1. What is the expected behavior?
2. What is the actual behavior?
3. What changed recently that could cause this?
4. What components are involved?
5. What is the most likely root cause?

Bug: "Users can't save drafts after the cache update deployed yesterday"
```

### 3. Prompt Optimization

Start simple, measure performance, iterate. Test on diverse inputs including edge cases.

```markdown
V1: "Summarize this article" → Inconsistent
V2: "Summarize in 3 bullet points" → Better structure
V3: "Identify 3 main findings, then summarize each" → Consistent, accurate
```

### 4. Template Systems

Build reusable prompt structures with variables. Reduces duplication, ensures consistency.

```python
template = "Review this {language} code for {focus_area}. Code: {code_block}"
prompt = template.format(language="Python", focus_area="security", code_block=user_code)
```

### 5. System Prompt Design

Set global behavior and constraints that persist across the conversation. Define the model's role, expertise level, output format, and safety guidelines. Use system prompts for stable instructions that shouldn't change turn-to-turn, freeing up user message tokens for variable content.

**Example:**

```markdown
System: You are a senior backend engineer specializing in API design.

Rules:

- Always consider scalability and performance
- Suggest RESTful patterns by default
- Flag security concerns immediately
- Provide code examples in Python
- Use early return pattern

Format responses as:

1. Analysis
2. Recommendation
3. Code example
4. Trade-offs
```

## Key Patterns

### Progressive Disclosure

Start simple, add complexity only when needed:

1. **Level 1**: Direct instruction → "Summarize this article"
2. **Level 2**: Add constraints → "Summarize in 3 bullet points"
3. **Level 3**: Add reasoning → "Identify findings, then summarize each"
4. **Level 4**: Add examples → Include 2-3 input-output pairs

### Instruction Hierarchy

```
[System Context] → [Task Instruction] → [Examples] → [Input Data] → [Output Format]
```

### Error Recovery

Include fallback instructions, request confidence scores, specify how to indicate missing information.

## Best Practices

1. **Start simple** — Try the minimal prompt first; add complexity only when needed
2. **Show, don't tell** — Examples beat descriptions; 2-3 good examples > long explanations
3. **Be unambiguous** — Vague instructions → inconsistent results; leave no room for interpretation
4. **Test on edge cases** — Diverse inputs reveal failure modes before production
5. **Version control prompts** — Treat them as code; small changes → large impacts

---

## Agent Prompting Best Practices

### Core principles

#### Context Window

The context window is the model's "working memory". Key implications:

- Tokens accumulate linearly with each turn
- Your prompt shares space with system prompt, history, and other skills
- Every token has a cost—make them count

#### Concise is key

**Default assumption**: The model is already very capable. Only add context the model doesn't already have.

Challenge each piece: "Does this paragraph justify its token cost?"

```markdown
# Good (~50 tokens)

Use pdfplumber: `pdf.pages[0].extract_text()`

# Bad (~150 tokens)

PDF files are a common format... there are many libraries... we recommend pdfplumber because...
```

#### Set appropriate degrees of freedom

Match specificity to task fragility:

| Freedom    | When to use                                  | Example                                                          |
| ---------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **High**   | Multiple valid approaches, context-dependent | "Review code for bugs and readability"                           |
| **Medium** | Preferred pattern exists, some variation OK  | `generate_report(data, format="markdown")`                       |
| **Low**    | Fragile operations, exact sequence required  | `python scripts/migrate.py --verify --backup` (no modifications) |

**Analogy**: Narrow bridge (one safe path) → low freedom. Open field (many paths) → high freedom.

---

## Persuasion Principles for Agent Communication

LLMs respond to the same persuasion principles as humans. Use these to ensure critical practices are followed.

**Research:** Meincke et al. (2025) found persuasion techniques doubled compliance (33% → 72%).

### Primary Principles (Most Effective)

#### 1. Authority

Deference to expertise and imperative language.

```markdown
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

**Use for:** Discipline-enforcing skills, safety-critical practices, established best practices.

#### 2. Commitment

Consistency with prior statements or public declarations.

```markdown
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

**Use for:** Multi-step processes, accountability mechanisms.

#### 3. Social Proof

Conformity to universal patterns and norms.

```markdown
✅ Checklists without TodoWrite tracking = steps get skipped. Every time.
❌ Some people find TodoWrite helpful for checklists.
```

**Use for:** Documenting universal practices, warning about common failures.

### Secondary Principles

| Principle    | Use case                        | Example                                                   |
| ------------ | ------------------------------- | --------------------------------------------------------- |
| **Scarcity** | Time-sensitive workflows        | "IMMEDIATELY request review before proceeding"            |
| **Unity**    | Collaborative, non-hierarchical | "We're colleagues. I need your honest technical judgment" |

**Avoid:** Reciprocity and Liking — rarely effective, can create sycophancy.

### Quick Reference

| Prompt Type          | Use                                   | Avoid               |
| -------------------- | ------------------------------------- | ------------------- |
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique   | Moderate Authority + Unity            | Heavy authority     |
| Collaborative        | Unity + Commitment                    | Authority, Liking   |

**Ethics test:** Would this serve the user's genuine interests if they fully understood it?

---

## Validation Checklist

Use this checklist to evaluate prompts. Score each criterion, sum the points, and determine the verdict.

### Required Criteria

| #   | Criterion             | Description                                              | 0 pts | 1 pt | 2 pts |
| --- | --------------------- | -------------------------------------------------------- | ----- | ---- | ----- |
| 1   | **Clear task**        | ONE unambiguous primary objective                        | Fails | Weak | Pass  |
| 2   | **Actionable**        | Executable without clarifying questions                  | Fails | Weak | Pass  |
| 3   | **Output format**     | Expected response structure specified or obvious         | Fails | Weak | Pass  |
| 4   | **No ambiguity**      | Key terms defined, no room for interpretation            | Fails | Weak | Pass  |
| 5   | **Appropriate scope** | Not too broad, not unnecessarily narrow                  | Fails | Weak | Pass  |
| 6   | **Token efficient**   | No redundant content, each section justifies its cost    | Fails | Weak | Pass  |
| 7   | **Type-specific**     | Meets requirements for its prompt type (see table below) | Fails | Weak | Pass  |

### Type-Specific Requirements (Criterion #7)

| Prompt Type       | Requirement                                               |
| ----------------- | --------------------------------------------------------- |
| **System prompt** | Defines persistent role, expertise, and constraints       |
| **Command**       | Specifies trigger, parameters, and expected behavior      |
| **Agent**         | Defines scope of autonomy and decision boundaries         |
| **Skill**         | Provides actionable guidance, not just reference material |

### Verdict

| Score | Verdict           | Description               |
| ----- | ----------------- | ------------------------- |
| 0-5   | **❌ INCOMPLETE** | Fundamental criteria fail |
| 6-9   | **⚠️ IMPROVE**    | Functional but weak       |
| 10-12 | **✅ COMPLETE**   | Production-ready          |
| 13-14 | **⭐ EXEMPLARY**  | Reference-quality         |

### Quality Enhancements (Conditional)

Only suggest enhancements if these conditions are met:

1. You observed a SPECIFIC failure (not hypothetical)
2. The enhancement directly addresses that observed failure

| Enhancement              | ONLY suggest if you observed...                |
| ------------------------ | ---------------------------------------------- |
| Few-shot examples        | Actual inconsistent outputs in testing         |
| Chain-of-thought         | Wrong answers on multi-step reasoning problems |
| Constraints / guardrails | Actual edge case failures                      |
| System context / role    | Output quality degraded without persona        |
| Persuasion principles    | Non-compliance with critical instructions      |

### Evaluation Output Format

```
## Prompt Evaluation

| Criterion         | Score | Notes |
| ----------------- | ----- | ----- |
| Clear task        | X/2   | ...   |
| Actionable        | X/2   | ...   |
| Output format     | X/2   | ...   |
| No ambiguity      | X/2   | ...   |
| Appropriate scope | X/2   | ...   |
| Token efficient   | X/2   | ...   |
| Type-specific     | X/2   | ...   |

**Total: X/14**
**Verdict: [INCOMPLETE|IMPROVE|COMPLETE|EXEMPLARY]**

```
