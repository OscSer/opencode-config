import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { AGENTS_CONFIG } from "./agents-config";
import { createSymlink, validateSourcePath } from "./file-ops";
import { InstallError } from "./types-def";

export class ConfigInstaller {
  private repoDir: string;
  private opencodeDir: string;

  constructor(repoDir?: string, opencodeDir?: string) {
    this.repoDir = repoDir || process.cwd();
    this.opencodeDir = opencodeDir || path.join(os.homedir(), ".config", "opencode");
  }

  async resolveSource(relative: string, mustBeFile: boolean = true): Promise<string | null> {
    return validateSourcePath(this.repoDir, relative, mustBeFile);
  }

  getTargetDir(agentName: string): string {
    const targetDirs: Record<string, string> = {
      opencode: this.opencodeDir,
    };

    if (!(agentName in targetDirs)) {
      throw new InstallError(`Unknown agent: ${agentName}`);
    }

    const targetDir = targetDirs[agentName];
    if (!targetDir) {
      throw new InstallError(`Target directory not found for agent: ${agentName}`);
    }

    return targetDir;
  }

  async installAgent(agentName: string): Promise<boolean> {
    const config = AGENTS_CONFIG[agentName];
    if (!config) {
      throw new InstallError(`Agent configuration not found: ${agentName}`);
    }

    const agentLabel = config.label;
    const targetDir = this.getTargetDir(agentName);

    console.log(`Installing ${agentLabel} configuration...`);

    try {
      await fs.mkdir(targetDir, { recursive: true });

      for (const asset of config.assets) {
        const sourcePath = await this.resolveSource(asset.source, asset.type === "file");

        if (sourcePath) {
          const targetPath = path.join(targetDir, asset.target);
          console.log(`Linking ${asset.source} to ${targetPath}...`);
          await createSymlink(sourcePath, targetPath);
          console.log(`✓ Linked ${asset.target}`);
        }
      }

      return true;
    } catch (error) {
      console.error(
        `Error installing ${agentLabel}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  async installAll(): Promise<boolean> {
    console.log("OpenCode Configuration Installation");
    console.log("====================================");

    const successFlags: boolean[] = [];

    for (const agentName of Object.keys(AGENTS_CONFIG)) {
      const success = await this.installAgent(agentName);
      successFlags.push(success);
    }

    if (successFlags.every((flag) => flag)) {
      console.log("");
      console.log("✅ Installation complete!");
      console.log("OpenCode configuration is available in ~/.config/opencode/");
      return true;
    }

    console.log("");
    console.log("⚠️ Installation completed with some errors. Check the output above for details.");
    return false;
  }
}

async function main(): Promise<void> {
  try {
    const installer = new ConfigInstaller();
    const success = await installer.installAll();
    process.exit(success ? 0 : 1);
  } catch (error) {
    if (error instanceof Error && error.message === "interrupted") {
      console.log("\nInstallation interrupted by user.");
      process.exit(1);
    }

    console.error(
      `Unexpected error during installation: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
