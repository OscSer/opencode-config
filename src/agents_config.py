#!/usr/bin/env python3


from src.types_def import AgentConfig

AGENTS_CONFIG: dict[str, AgentConfig] = {
    "opencode": {
        "label": "Opencode",
        "assets": [
            {
                "source": "agents/opencode/opencode.jsonc",
                "target": "opencode.json",
                "type": "file",
            },
            {
                "source": "agents/rules/AGENTS.md",
                "target": "AGENTS.md",
                "type": "file",
            },
        ],
    },
}
