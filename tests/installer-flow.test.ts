import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { AGENTS_CONFIG } from "../src/agents-config";
import { ConfigInstaller } from "../src/installer";

let tmpDir: string;

describe("installer-flow", () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should install agent successfully", async () => {
    // Create sample repo with assets
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });

    for (const asset of AGENTS_CONFIG.opencode.assets) {
      const sourcePath = path.join(repoDir, asset.source);
      await fs.mkdir(path.dirname(sourcePath), { recursive: true });
      await fs.writeFile(sourcePath, "data");
    }

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAgent("opencode");

    expect(success).toBe(true);

    // Check that symlinks were created
    for (const asset of AGENTS_CONFIG.opencode.assets) {
      const targetPath = path.join(targetDir, asset.target);
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
    }
  });

  it("should skip missing assets", async () => {
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });
    // Don't create source assets

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAgent("opencode");

    // Should still return success (skips missing, doesn't error)
    expect(success).toBe(true);
  });

  it("should handle symlink errors gracefully", async () => {
    // Create repo but make target dir read-only to trigger error
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });

    for (const asset of AGENTS_CONFIG.opencode.assets) {
      const sourcePath = path.join(repoDir, asset.source);
      await fs.mkdir(path.dirname(sourcePath), { recursive: true });
      await fs.writeFile(sourcePath, "data");
    }

    const targetDir = path.join(tmpDir, "opencode");
    await fs.mkdir(targetDir, { recursive: true });
    // Make target read-only
    await fs.chmod(targetDir, 0o444);

    const installer = new ConfigInstaller(repoDir, targetDir);

    try {
      const success = await installer.installAgent("opencode");
      // Should fail due to permissions
      expect(success).toBe(false);
    } finally {
      // Restore permissions for cleanup
      await fs.chmod(targetDir, 0o755);
    }
  });

  it("should install all agents successfully", async () => {
    // Create sample repo with all assets
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });

    for (const config of Object.values(AGENTS_CONFIG)) {
      for (const asset of config.assets) {
        const sourcePath = path.join(repoDir, asset.source);
        await fs.mkdir(path.dirname(sourcePath), { recursive: true });
        await fs.writeFile(sourcePath, "data");
      }
    }

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    // Verify all symlinks were created
    for (const asset of AGENTS_CONFIG.opencode.assets) {
      const targetPath = path.join(targetDir, asset.target);
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
    }
  });
});
