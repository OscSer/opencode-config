# OpenCode Config

Centralized configuration for [OpenCode](https://opencode.ai/docs). Automatically syncs `opencode/` assets to `~/.config/opencode/`

## Usage

```
bun run setup       # Install configuration
bun run check       # Lint and format check
bun run format      # Format code
bun run typecheck   # Type checking
bun run test        # Test suite
```

## Structure

```
opencode/
├── opencode.jsonc  # Global config
├── AGENTS.md       # Global rules
├── agent/          # Custom agents
└── command/        # Custom commands
src/
└── installer.ts    # Setup script
```
