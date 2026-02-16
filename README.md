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
├── AGENTS.md       # Global instructions
├── agents/         # Custom agents
├── commands/       # Custom commands
└── skills/         # Custom skills
src/
└── installer.ts    # Setup script
```
