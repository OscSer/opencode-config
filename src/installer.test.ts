import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { ConfigInstaller } from "./installer";

let tmpDir: string;

describe("installer", () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should install opencode successfully with auto-detected assets", async () => {
    // Create sample repo with opencode directory and assets
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    // Create sample files and directories
    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");
    await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "rules");
    await fs.mkdir(path.join(opencodeSourceDir, "command"), { recursive: true });
    await fs.writeFile(path.join(opencodeSourceDir, "command", "check.md"), "command");
    await fs.mkdir(path.join(opencodeSourceDir, "tool"), { recursive: true });
    await fs.writeFile(path.join(opencodeSourceDir, "tool", "mgrep.ts"), "tool");

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    // Check that symlinks were created for auto-detected assets
    const stats = {
      jsonc: await fs.lstat(path.join(targetDir, "opencode.jsonc")),
      agents: await fs.lstat(path.join(targetDir, "AGENTS.md")),
      command: await fs.lstat(path.join(targetDir, "command")),
      tool: await fs.lstat(path.join(targetDir, "tool")),
    };

    expect(stats.jsonc.isSymbolicLink()).toBe(true);
    expect(stats.agents.isSymbolicLink()).toBe(true);
    expect(stats.command.isSymbolicLink()).toBe(true);
    expect(stats.tool.isSymbolicLink()).toBe(true);
  });

  it("should skip missing opencode directory gracefully", async () => {
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });
    // Don't create opencode directory

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(false);
  });

  it("should handle symlink creation for multiple assets", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    // Create multiple assets
    for (let i = 1; i <= 5; i++) {
      await fs.writeFile(path.join(opencodeSourceDir, `file${i}.txt`), `content${i}`);
    }

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    // Verify all symlinks were created
    for (let i = 1; i <= 5; i++) {
      const stat = await fs.lstat(path.join(targetDir, `file${i}.txt`));
      expect(stat.isSymbolicLink()).toBe(true);
    }
  });

  it("should resolve source paths correctly", async () => {
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });
    const filePath = path.join(repoDir, "test.txt");
    await fs.writeFile(filePath, "test");

    const installer = new ConfigInstaller(repoDir);
    const resolvedPath = await installer.resolveSource("test.txt");

    expect(resolvedPath).toBe(filePath);
  });

  it("should return null for non-existent source", async () => {
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });

    const installer = new ConfigInstaller(repoDir);
    const resolvedPath = await installer.resolveSource("missing.txt", true);

    expect(resolvedPath).toBeNull();
  });
});
