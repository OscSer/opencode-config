#!/usr/bin/env python3

from typing import Dict

from src.types_def import AgentConfig

AGENTS_CONFIG: Dict[str, AgentConfig] = {
    "opencode": {
        "label": "Opencode",
        "assets": [
            {
                "source": "agents/opencode/opencode.json",
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
