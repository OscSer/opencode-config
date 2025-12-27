---
name: prompt-engineering
description: Provides advanced prompt engineering techniques and system prompt design. Use when analyzing, writing, or improving prompts, system instructions, agent configurations, or LLM interaction patterns.
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

---

## Agent Prompting

### Principles

#### Context Window

The model's "working memory". Tokens accumulate linearly—every token has a cost.

**Default assumption**: The model is already capable. Only add context it doesn't have.

```markdown
# Good (~50 tokens)

Use pdfplumber: `pdf.pages[0].extract_text()`

# Bad (~150 tokens)

PDF files are a common format... there are many libraries... we recommend pdfplumber because...
```

#### Degrees of Freedom

Match specificity to task fragility:

| Freedom    | When to use               | Example                                            |
| ---------- | ------------------------- | -------------------------------------------------- |
| **High**   | Multiple valid approaches | "Review code for bugs"                             |
| **Medium** | Preferred pattern exists  | `generate_report(data, format="markdown")`         |
| **Low**    | Exact sequence required   | `python migrate.py --verify --backup` (no changes) |

---

## Persuasion Principles

LLMs respond to persuasion principles. Research shows these techniques double compliance (33% → 72%).

### Primary (Most Effective)

#### 1. Authority

Imperative language for critical practices.

```markdown
✅ Write code before test? Delete it. No exceptions.
❌ Consider writing tests first when feasible.
```

#### 2. Commitment

Require explicit declarations.

```markdown
✅ You MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

#### 3. Social Proof

Reference universal patterns.

```markdown
✅ Checklists without tracking = steps get skipped. Every time.
❌ Some people find tracking helpful for checklists.
```

### Secondary

| Principle    | Example                                                   |
| ------------ | --------------------------------------------------------- |
| **Scarcity** | "IMMEDIATELY request review before proceeding"            |
| **Unity**    | "We're colleagues. I need your honest technical judgment" |

**Avoid:** Reciprocity and Liking—can create sycophancy.

---

## Validation Checklist

| #   | Criterion             | Description                                       |
| --- | --------------------- | ------------------------------------------------- |
| 1   | **Clear task**        | ONE unambiguous primary objective                 |
| 2   | **Actionable**        | Executable without clarifying questions           |
| 3   | **Output format**     | Expected response structure specified or obvious  |
| 4   | **No ambiguity**      | Key terms defined, no room for interpretation     |
| 5   | **Appropriate scope** | Not too broad, not unnecessarily narrow           |
| 6   | **Token efficient**   | No redundant content, each section earns its cost |
| 7   | **Type-specific**     | Meets requirements for its prompt type            |

**Scoring:** 0 = Fails, 1 = Weak, 2 = Pass

### Type-Specific Requirements

| Prompt Type       | Requirement                                         |
| ----------------- | --------------------------------------------------- |
| **System prompt** | Defines persistent role, expertise, and constraints |
| **Command**       | Specifies trigger, parameters, and behavior         |
| **Agent**         | Defines scope of autonomy and decision boundaries   |
| **Skill**         | Actionable guidance, not just reference material    |

### Verdict

| Score | Verdict    |
| ----- | ---------- |
| 0-5   | INCOMPLETE |
| 6-9   | IMPROVE    |
| 10-12 | COMPLETE   |
| 13-14 | EXEMPLARY  |

### Enhancements (Only if Observed)

| Enhancement       | Only if you observed...                   |
| ----------------- | ----------------------------------------- |
| Few-shot examples | Inconsistent outputs                      |
| Chain-of-thought  | Wrong multi-step reasoning                |
| Constraints       | Edge case failures                        |
| Role/persona      | Quality degraded without context          |
| Persuasion        | Non-compliance with critical instructions |

### Output Format

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
