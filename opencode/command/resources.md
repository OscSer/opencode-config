---
description: Load relevant resources (skills, agents, MCPs) for the request
---

## Request

```text
$ARGUMENTS
```

## Instructions

Analyze the request and load appropriate resources:

1. Skills: Load skills that match the task domain
2. Agents: Delegate to subagents when specialized expertise is needed
3. MCPs: Use MCP tools when relevant

Multiple resources can be combined. No matches? Proceed normally.
