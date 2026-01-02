---
description: Evaluate or generate prompts
---

User input:

```text
$ARGUMENTS
```

## Determining the Task

Analyze the user input to determine the action:

**Evaluation Mode**: Input contains an existing prompt to analyze

- User provides prompt text directly
- User references a file path containing a prompt
- User asks to "review", "evaluate", "check", "improve" an existing prompt

**Generation Mode**: Input describes a new prompt to create

- User describes desired behavior or task
- User asks to "create", "generate", "design", "write" a new prompt
- User provides requirements without existing prompt text

**If ambiguous**: Ask the user to clarify.

---

## Core Capabilities Reference

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

### 3. Tree of Thoughts (ToT)

Extends Chain-of-Thought by exploring multiple reasoning paths in parallel, like a decision tree. The model generates several candidate solutions, evaluates each branch, and can backtrack when a path leads to a dead end. Use for problems with multiple valid approaches where the optimal solution isn't immediately clear—puzzles, planning tasks, or complex architectural decisions. Outperforms CoT on tasks requiring exploration and deliberation.

**Example:**

```markdown
Design a caching strategy for our API. Explore 3 different approaches:

For each approach:

1. Describe the strategy
2. List pros and cons
3. Identify potential failure modes
4. Rate feasibility (1-10)

After exploring all paths:

- Compare the approaches
- Select the best option with justification
- If none are satisfactory, backtrack and consider hybrid solutions
```

### 4. Self-Consistency

Sample multiple reasoning paths for the same problem and select the most frequent answer through "voting". Instead of relying on a single greedy response, generate 5-10 diverse solutions and aggregate results. Significantly improves accuracy on math (+17% on GSM8K), logic, and reasoning tasks. Trade-off: higher token cost for higher reliability.

**Example:**

```markdown
Solve this problem 5 times using different reasoning approaches.
After all attempts, report the most common answer.

Problem: "A store has 50 items. 30% are on sale. Of those on sale,
half are discounted by 20% and half by 40%. How many items have
a 40% discount?"

Attempt 1: [solve]
Attempt 2: [solve differently]
...
Final answer: [most frequent result]
```

### 5. ReAct (Reasoning + Acting)

Combines chain-of-thought reasoning with action execution in an iterative loop. The model: (1) Reasons about the current state, (2) Decides on an action (tool use, search, API call), (3) Observes the result, (4) Repeats until task completion. Essential for agents that interact with external tools, databases, or APIs. Grounds reasoning in real-world feedback.

**Example:**

```markdown
Task: Find the current stock price of Apple and calculate if it's
above its 52-week average.

Format your response as:
Thought: [reasoning about what to do next]
Action: [tool to use and parameters]
Observation: [result from the action]
... (repeat as needed)
Final Answer: [conclusion based on gathered information]
```

### 6. Prompt Optimization

Start simple, measure performance, iterate. Test on diverse inputs including edge cases.

```markdown
V1: "Summarize this article" → Inconsistent
V2: "Summarize in 3 bullet points" → Better structure
V3: "Identify 3 main findings, then summarize each" → Consistent, accurate
```

### 7. Template Systems

Build reusable prompt structures with variables. Reduces duplication, ensures consistency.

```python
template = "Review this {language} code for {focus_area}. Code: {code_block}"
prompt = template.format(language="Python", focus_area="security", code_block=user_code)
```

### 8. System Prompt Design

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

---

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

Use this checklist when evaluating prompts:

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

| Prompt Type       | Requirement                                                           |
| ----------------- | --------------------------------------------------------------------- |
| **System Prompt** | Defines persistent role, expertise, and constraints                   |
| **Command**       | Specifies trigger, parameters, and behavior                           |
| **Agent**         | Defines autonomy scope, decision boundaries, and ReAct loop if needed |

### Verdict

| Score | Verdict    |
| ----- | ---------- |
| 0-5   | INCOMPLETE |
| 6-9   | IMPROVE    |
| 10-12 | COMPLETE   |
| 13-14 | EXEMPLARY  |

### Enhancements (Only if Observed)

| Enhancement       | Only if you observed...                         |
| ----------------- | ----------------------------------------------- |
| Few-shot examples | Inconsistent outputs                            |
| Chain-of-thought  | Wrong multi-step reasoning                      |
| Tree of Thoughts  | CoT fails on problems requiring exploration     |
| Self-Consistency  | High variance in answers, need reliability      |
| ReAct             | Task requires external tools or real-world data |
| Constraints       | Edge case failures                              |
| Role/persona      | Quality degraded without context                |
| Persuasion        | Non-compliance with critical instructions       |

---

## Execution Instructions

### For Evaluation Mode

1. **Analyze the prompt** against the validation checklist
2. **Score each criterion** (0-2) with specific notes
3. **Calculate total** and assign verdict
4. **Identify specific issues** with concrete examples from the prompt
5. **Recommend enhancements** using the "Enhancements" table - only suggest patterns that address observed problems
6. **Provide revised version** if score < 12

**Output format:**

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

## Issues Found

[List specific problems with examples]

## Recommended Enhancements

[Only suggest patterns that address observed issues]

## Revised Prompt

[Only if score < 12, provide improved version]
```

### For Generation Mode

1. **Clarify requirements** if needed (task type, output format, constraints)
2. **Select appropriate patterns** from Core Capabilities (Few-Shot, CoT, ToT, etc.)
3. **Apply relevant principles** (Progressive Disclosure, Persuasion, etc.)
4. **Structure using Instruction Hierarchy**
5. **Generate the prompt** with clear task, format, and examples
6. **Validate against checklist** - aim for score ≥ 12

**Output format:**

```
## Generated Prompt

[Complete, ready-to-use prompt]

## Design Rationale

**Patterns applied:**
- [Pattern 1]: [Why it was chosen]
- [Pattern 2]: [Why it was chosen]

**Expected behavior:**
[What this prompt should accomplish]

## Evaluation

[Quick self-assessment against validation checklist]
```

---

## Operating Rules

- **Be systematic**: Follow the validation checklist rigorously
- **Be specific**: Point to exact issues, provide concrete examples
- **Be actionable**: Every recommendation must be implementable
- **Be efficient**: Don't add complexity unless it solves an observed problem
- **Stay focused**: Answer the question asked, nothing more
