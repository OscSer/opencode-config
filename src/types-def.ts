export interface AgentAsset {
  source: string;
  target: string;
  type: "file" | "dir";
}

export interface AgentConfig {
  label: string;
  assets: AgentAsset[];
}

export type AgentsConfigMap = Record<string, AgentConfig>;

export class CopyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CopyError";
  }
}

export class InstallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstallError";
  }
}
