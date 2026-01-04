# Global Instructions

These are your global instructions. You MUST follow them strictly at all times.

## General Rules

- ALWAYS communicate with the user in **SPANISH**
- ALWAYS write code in **ENGLISH**
- ALWAYS respect the language of the file content (for non-code files)
- ALWAYS check quality gates after changing code (e.g., linting, tests, type checks)
- NEVER do `git add` or `git push`. ONLY execute `git commit` when the user explicitly requests it
- NEVER create `.md`, `.txt`, or any documentation files. NOT EVEN task summaries, explanations, or "helpful" READMEs.

## Code Principles

Code should be **clear**, **readable**, and **modular**. It should explain itself without needing comments.

| Principle                 | Rule                                       | Example                                              |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Guard clauses**         | Handle exceptions early, avoid nesting     | `if (!order) return null;` at the start              |
| **Descriptive names**     | Names reveal intention, no comments needed | `elapsedMs` not `d`, `isAdmin` not `flag`            |
| **Single responsibility** | One function = one task                    | Split `handleRegistration` into validate/save/notify |
| **No unnecessary else**   | If `if` ends with `return`, skip `else`    | `if (x) return a; return b;`                         |
| **Immutability**          | Create new structures, don't mutate        | `{...cart, items: [...cart.items, item]}`            |
| **Comments explain why**  | Code explains what, comments explain why   | `// Rate limit: 100 req/min per API policy`          |
| **Named constants**       | No magic numbers/strings                   | `MAX_RETRY_ATTEMPTS` not `3`                         |

## Tool Usage

ALWAYS use native tools instead of bash equivalents.

### File Operations

| Operation       | USE Native Tool | NEVER USE Bash                 |
| --------------- | --------------- | ------------------------------ |
| Read file       | **Read** tool   | `cat`, `head`, `tail`, `less`  |
| Write file      | **Write** tool  | `echo >`, `cat <<EOF >`, `tee` |
| Edit file       | **Edit** tool   | `sed`, `awk`, `perl -i`        |
| Find files      | **Glob** tool   | `find`, `ls -R`                |
| Search in files | **Grep** tool   | `grep`, `rg`, `ag`             |
| List directory  | **List** tool   | `ls`, `tree`                   |

### Research & External Data

| Operation        | USE Native Tool    | NEVER USE Bash |
| ---------------- | ------------------ | -------------- |
| Web search       | **WebSearch** tool | `curl`, `wget` |
| Fetch URL        | **WebFetch** tool  | `curl`, `wget` |
| Search code/docs | **Context7** MCP   | `curl`, `wget` |

### When to Use Bash

Use **Bash** tool ONLY when are NO native tools available for the task.

### Why Native Tools?

1. **Optimized**: Built for AI workflows with automatic limits and formatting
2. **Safe**: Built-in validation, security checks, prevents common errors
3. **Intelligent**: Context-aware (LSP diagnostics, multi-strategy matching)
4. **Consistent**: Standardized output format, predictable behavior
5. **Integrated**: Triggers system events, updates IDE, runs diagnostics
