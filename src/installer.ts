import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { createSymlink, isBrokenSymlink, validateSourcePath } from "./file-ops";
import { InstallError } from "./types-def";

const OPENCODE_SOURCE_DIR = "opencode";

export class ConfigInstaller {
  private repoDir: string;
  private opencodeDir: string;

  constructor(repoDir?: string, opencodeDir?: string) {
    this.repoDir = repoDir || process.cwd();
    this.opencodeDir =
      opencodeDir || path.join(os.homedir(), ".config", "opencode");
  }

  async resolveSource(
    relative: string,
    isFile?: boolean,
  ): Promise<string | null> {
    return validateSourcePath(this.repoDir, relative, isFile);
  }

  async getOpencodeAssets(): Promise<
    Array<{ source: string; target: string }>
  > {
    const sourcePath = await this.resolveSource(OPENCODE_SOURCE_DIR, false);
    if (!sourcePath) {
      throw new InstallError(
        `OpenCode source directory not found: ${OPENCODE_SOURCE_DIR}`,
      );
    }

    const assets: Array<{ source: string; target: string }> = [];
    const entries = await fs.readdir(sourcePath);

    for (const entry of entries) {
      const relativePath = path.join(OPENCODE_SOURCE_DIR, entry);
      assets.push({
        source: relativePath,
        target: entry,
      });
    }

    return assets;
  }

  async cleanupBrokenSymlinks(): Promise<number> {
    let removedCount = 0;

    try {
      const entries = await fs.readdir(this.opencodeDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const targetPath = path.join(this.opencodeDir, entry.name);

        if (entry.isSymbolicLink()) {
          const isBroken = await isBrokenSymlink(targetPath);
          if (isBroken) {
            await fs.unlink(targetPath);
            console.log(`🗑️  Removed broken symlink: ${entry.name}`);
            removedCount++;
          }
        }
      }
    } catch {
      // Directory might not exist yet
    }

    return removedCount;
  }

  async installOpencode(): Promise<boolean> {
    console.log("Installing OpenCode configuration...");

    try {
      await fs.mkdir(this.opencodeDir, { recursive: true });

      const assets = await this.getOpencodeAssets();

      for (const asset of assets) {
        const sourcePath = await this.resolveSource(asset.source);
        if (!sourcePath) continue;

        const targetPath = path.join(this.opencodeDir, asset.target);
        console.log(`Linking ${asset.source} to ${targetPath}...`);
        await createSymlink(sourcePath, targetPath);
        console.log(`✓ Linked ${asset.target}`);
      }

      const removedCount = await this.cleanupBrokenSymlinks();
      if (removedCount > 0) {
        console.log(`✓ Cleaned up ${removedCount} broken symlink(s)`);
      }

      return true;
    } catch (error) {
      console.error(
        `Error installing OpenCode: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  async installAll(): Promise<boolean> {
    console.log("OpenCode Configuration Installation");
    console.log("====================================");

    const success = await this.installOpencode();

    if (!success) {
      console.log("");
      console.log(
        "⚠️ Installation failed. Check the output above for details.",
      );
      return false;
    }

    console.log("");
    console.log("✅ Installation complete!");
    console.log("OpenCode configuration is available in ~/.config/opencode/");
    return true;
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
