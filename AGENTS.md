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

## Installation Script

Run the installer:

```bash
bun run setup
```

The installer automatically detects all files and directories in `opencode/` and links them to `~/.config/opencode/`.

## Quality Gate

```bash
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

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Linter/Formatter:** Biome

## Documentation

Visit the official OpenCode documentation: https://opencode.ai/docs
