# OpenCode Config

Centralized configuration for OpenCode.

## Structure

```
opencode-config/
├── opencode/
│   ├── opencode.jsonc              # Main OpenCode configuration
│   ├── AGENTS.md                   # Global rules for OpenCode
│   ├── command/                    # Custom commands
│   └── skill/                      # Custom skills
├── src/
│   ├── installer.ts                # Installer with auto-detection
│   ├── installer.test.ts           # Installer tests
│   ├── file-ops.ts                 # Path and symlink utilities
│   ├── file-ops.test.ts            # File operation tests
│   └── types-def.ts                # TypeScript types and interfaces
├── .husky/
│   └── pre-commit
├── package.json                    # Bun dependencies
├── tsconfig.json                   # TypeScript configuration
├── biome.json                      # Biome configuration (linter/formatter)
├── .gitignore
└── AGENTS.md                       # This file (repo documentation)
```

## Commands

```bash
bun run setup # Install OpenCode configuration
bun run check
bun run typecheck
bun test
```

## Extensibility

The installer uses **automatic asset detection**. When adding new directories or files in `opencode/`:

1. The installer will automatically detect them
2. Symlinks will be created in `~/.config/opencode/` with the same name
3. No need to modify installer code

Example: If you add `opencode/example/`, the installer will automatically link it to `~/.config/opencode/example/`.

## Prompt Engineering

When working with agent instruction files in the `opencode/` directory, you MUST load the `prompt-engineering` skill.

Files that require this skill:

- `opencode/AGENTS.md` - Global rules
- `opencode/agent/*.md` - Subagent definitions
- `opencode/command/*.md` - Custom commands
- `opencode/skill/*.md` - Custom skills

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Linter/Formatter:** Biome

## Documentation

OpenCode: https://opencode.ai/docs
AGENTS.md: https://agents.md
Skills: https://agentskills.io
