---
name: prompt-engineering
description: Use for analyzing and improving prompts, agents.md, slash commands, skills, subagents or LLM interactions
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

1. **Be Specific**: Vague → inconsistent results
2. **Show, Don't Tell**: Examples > descriptions
3. **Test Extensively**: Diverse inputs + edge cases
4. **Iterate Rapidly**: Small changes → large impacts
5. **Version Control**: Treat prompts as code

## Common Pitfalls

- **Over-engineering**: Try simple first
- **Example pollution**: Examples must match target task
- **Context overflow**: Balance examples vs. token limits
- **Ambiguity**: Leave no room for interpretation

## Integration Patterns

### With RAG + Validation

```python
prompt = f"""Context: {retrieved_context}

Question: {user_question}

Answer based solely on context. If insufficient, state what's missing.

Verify: 1) Answers directly 2) Uses only context 3) Cites sources 4) Acknowledges uncertainty"""
```

---

# Agent Prompting Best Practices

Based on Anthropic's official best practices for agent prompting.

## Core principles

### Context Window

The context window is the model's "working memory" (200K tokens). Key implications:

- Tokens accumulate linearly with each turn
- Your prompt shares space with system prompt, history, and other skills
- Every token has a cost—make them count

### Concise is key

**Default assumption**: Claude is already very smart. Only add context Claude doesn't already have.

Challenge each piece: "Does this paragraph justify its token cost?"

```markdown
# Good (~50 tokens)

Use pdfplumber: `pdf.pages[0].extract_text()`

# Bad (~150 tokens)

PDF files are a common format... there are many libraries... we recommend pdfplumber because...
```

### Set appropriate degrees of freedom

Match specificity to task fragility:

| Freedom    | When to use                                  | Example                                                          |
| ---------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **High**   | Multiple valid approaches, context-dependent | "Review code for bugs and readability"                           |
| **Medium** | Preferred pattern exists, some variation OK  | `generate_report(data, format="markdown")`                       |
| **Low**    | Fragile operations, exact sequence required  | `python scripts/migrate.py --verify --backup` (no modifications) |

**Analogy**: Narrow bridge (one safe path) → low freedom. Open field (many paths) → high freedom.

# Persuasion Principles for Agent Communication

Useful for writing prompts, including but not limited to: commands, hooks, skills, or prompts for sub agents and any other LLM interaction.

## Overview

LLMs respond to the same persuasion principles as humans. Understanding this psychology helps you design more effective skills - not to manipulate, but to ensure critical practices are followed even under pressure.

**Research foundation:** Meincke et al. (2025) tested 7 persuasion principles with N=28,000 AI conversations. Persuasion techniques more than doubled compliance rates (33% → 72%, p < .001).

## The Seven Principles

### 1. Authority

**What it is:** Deference to expertise, credentials, or official sources.

**How it works in prompts:**

- Imperative language: "YOU MUST", "Never", "Always"
- Non-negotiable framing: "No exceptions"
- Eliminates decision fatigue and rationalization

**When to use:**

- Discipline-enforcing skills (TDD, verification requirements)
- Safety-critical practices
- Established best practices

**Example:**

```markdown
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

### 2. Commitment

**What it is:** Consistency with prior actions, statements, or public declarations.

**How it works in prompts:**

- Require announcements: "Announce skill usage"
- Force explicit choices: "Choose A, B, or C"
- Use tracking: TodoWrite for checklists

**When to use:**

- Ensuring skills are actually followed
- Multi-step processes
- Accountability mechanisms

**Example:**

```markdown
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

### 3. Scarcity

**What it is:** Urgency from time limits or limited availability.

**How it works in prompts:**

- Time-bound requirements: "Before proceeding"
- Sequential dependencies: "Immediately after X"
- Prevents procrastination

**When to use:**

- Immediate verification requirements
- Time-sensitive workflows
- Preventing "I'll do it later"

**Example:**

```markdown
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ You can review code when convenient.
```

### 4. Social Proof

**What it is:** Conformity to what others do or what's considered normal.

**How it works in prompts:**

- Universal patterns: "Every time", "Always"
- Failure modes: "X without Y = failure"
- Establishes norms

**When to use:**

- Documenting universal practices
- Warning about common failures
- Reinforcing standards

**Example:**

```markdown
✅ Checklists without TodoWrite tracking = steps get skipped. Every time.
❌ Some people find TodoWrite helpful for checklists.
```

### 5. Unity

**What it is:** Shared identity, "we-ness", in-group belonging.

**How it works in prompts:**

- Collaborative language: "our codebase", "we're colleagues"
- Shared goals: "we both want quality"

**When to use:**

- Collaborative workflows
- Establishing team culture
- Non-hierarchical practices

**Example:**

```markdown
✅ We're colleagues working together. I need your honest technical judgment.
❌ You should probably tell me if I'm wrong.
```

### 6. Reciprocity & 7. Liking — Avoid These

- **Reciprocity**: Rarely effective, can feel manipulative
- **Liking**: Creates sycophancy, conflicts with honest feedback

**When to avoid:** Almost always. Other principles are more effective.

## Principle Combinations by Prompt Type

| Prompt Type          | Use                                   | Avoid               |
| -------------------- | ------------------------------------- | ------------------- |
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique   | Moderate Authority + Unity            | Heavy authority     |
| Collaborative        | Unity + Commitment                    | Authority, Liking   |
| Reference            | Clarity only                          | All persuasion      |

## Why This Works

- **Bright-line rules**: "YOU MUST" removes decision fatigue, eliminates "is this an exception?" questions
- **Implementation intentions**: "When X, do Y" → automatic execution
- **LLMs are parahuman**: Trained on human text containing these persuasion patterns

## Ethical Use

**The test:** Would this technique serve the user's genuine interests if they fully understood it?

Legitimate: Ensuring critical practices, preventing failures. Illegitimate: Manipulation, false urgency, guilt-based compliance.

## Quick Reference

When designing a prompt, ask:

1. **What type is it?** (Discipline vs. guidance vs. reference)
2. **What behavior am I trying to change?**
3. **Which principle(s) apply?** (Usually authority + commitment for discipline)
4. **Am I combining too many?** (Don't use all seven)
5. **Is this ethical?** (Serves user's genuine interests?)
