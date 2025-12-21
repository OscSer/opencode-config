import { tool } from "@opencode-ai/plugin";

const SKILL = `
# Systematic Debugging

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

\`\`\`
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
\`\`\`

If you haven't completed Phase 1, you cannot propose fixes.

## Activation

When you encounter an error, test failure, or unexpected behavior:
1. STOP
2. Announce: "Using systematic debugging methodology"
3. Begin Phase 1

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Read stack traces completely
   - Note line numbers, file paths, error codes
   - They often contain the exact solution

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - Git diff, recent commits
   - New dependencies, config changes

4. **Gather Evidence in Multi-Component Systems**
   - Log what data enters/exits each component boundary
   - Run once to gather evidence showing WHERE it breaks
   - THEN investigate that specific component

5. **Trace Data Flow**
   - Where does bad value originate?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

1. **Find Working Examples** - Locate similar working code in same codebase
2. **Compare Against References** - Read reference implementation COMPLETELY, don't skim
3. **Identify Differences** - List every difference, however small
4. **Understand Dependencies** - What settings, config, environment does it need?

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

### Phase 4: Implementation

1. **Create Failing Test Case**
   - Simplest possible reproduction
   - MUST have before fixing

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements

3. **Verify Fix**
   - Test passes now?
   - No other tests broken?

4. **If Fix Doesn't Work**
   - If < 3 attempts: Return to Phase 1, re-analyze
   - **If ≥ 3 attempts: STOP and question the architecture**

5. **If 3+ Fixes Failed: Question Architecture**
   - Is this pattern fundamentally sound?
   - Should we refactor architecture vs. continue fixing symptoms?
   - Discuss with your human partner before attempting more fixes

## Red Flags - STOP and Return to Phase 1

If you catch yourself:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

**ALL of these mean: STOP. Return to Phase 1.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple" | Simple issues have root causes too |
| "Emergency, no time" | Systematic is FASTER than thrashing |
| "Just try this first" | First fix sets the pattern. Do it right. |
| "I'll write test after" | Untested fixes don't stick |
| "Multiple fixes saves time" | Can't isolate what worked |
| "One more attempt" (after 2+) | 3+ failures = architectural problem |

## Output Format

When using this skill, structure your response as:

\`\`\`
## Debugging: [Brief issue description]

### Phase 1: Root Cause Investigation
- Error message: [key details]
- Reproduction: [steps or "not yet reproducible"]
- Recent changes: [relevant changes]
- Evidence gathered: [what you found]

### Phase 2: Pattern Analysis
- Working example: [similar code that works]
- Key differences: [what's different]

### Phase 3: Hypothesis
"I believe [X] is the root cause because [Y]"

Minimal test: [smallest change to verify]

### Phase 4: Implementation
- Test case: [the failing test]
- Fix: [the actual fix]
- Verification: [test results]
\`\`\`

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## Real-World Impact

- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common
`;

export default tool({
  description:
    "Use when: encountering bugs, test failures, or unexpected behavior. Enforces 4-phase methodology: Root Cause Investigation → Pattern Analysis → Hypothesis → Implementation",
  args: {},
  async execute() {
    return SKILL;
  },
});
