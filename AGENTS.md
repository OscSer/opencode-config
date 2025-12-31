# OpenCode Config

Centralized configuration for OpenCode.

## Structure

```
opencode-config/
├── opencode/
│   ├── opencode.jsonc  # Main configuration
│   ├── AGENTS.md       # Global rules
│   ├── agent/          # Subagent definitions
│   └── command/        # Custom commands
└── src/                # Installer scripts
```

## Commands

```bash
bun run setup       # Install OpenCode configuration
bun run check       # Lint and format check
bun run format      # Format code with Prettier and Biome
bun run typecheck   # Type checking
bun run test        # Run test suite
```

## Extensibility

The installer uses **automatic asset detection**. When adding new directories or files in `opencode/`:

1. The installer will automatically detect them
2. Symlinks will be created in `~/.config/opencode/` with the same name
3. No need to modify installer code

Example: If you add `opencode/example/`, the installer will automatically link it to `~/.config/opencode/example/`.

## Useful Links

OpenCode: https://opencode.ai/docs
AGENTS.md: https://agents.md
Skills: https://agentskills.io
