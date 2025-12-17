import type { AgentsConfigMap } from "./types-def";

export const AGENTS_CONFIG: AgentsConfigMap = {
  opencode: {
    label: "OpenCode",
    assets: [
      {
        source: "agents/opencode/opencode.jsonc",
        target: "opencode.jsonc",
        type: "file",
      },
      {
        source: "agents/rules/AGENTS.md",
        target: "AGENTS.md",
        type: "file",
      },
      {
        source: "agents/opencode/command",
        target: "command",
        type: "dir",
      },
    ],
  },
};
