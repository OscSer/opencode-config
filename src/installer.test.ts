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

  it("should create symlinks for files during installation", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");
    await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "rules");

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    const jsoncStat = await fs.lstat(path.join(targetDir, "opencode.jsonc"));
    const agentsStat = await fs.lstat(path.join(targetDir, "AGENTS.md"));

    expect(jsoncStat.isSymbolicLink()).toBe(true);
    expect(agentsStat.isSymbolicLink()).toBe(true);
  });

  it("should create symlinks for directories during installation", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.mkdir(path.join(opencodeSourceDir, "command"), { recursive: true });
    await fs.mkdir(path.join(opencodeSourceDir, "tool"), { recursive: true });

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    const commandStat = await fs.lstat(path.join(targetDir, "command"));
    const toolStat = await fs.lstat(path.join(targetDir, "tool"));

    expect(commandStat.isSymbolicLink()).toBe(true);
    expect(toolStat.isSymbolicLink()).toBe(true);
  });

  it("should make nested content accessible through symlinked directories", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.mkdir(path.join(opencodeSourceDir, "command"), { recursive: true });
    await fs.writeFile(path.join(opencodeSourceDir, "command", "pre-commit.md"), "command content");
    await fs.mkdir(path.join(opencodeSourceDir, "tool"), { recursive: true });
    await fs.writeFile(path.join(opencodeSourceDir, "tool", "example-tool.ts"), "tool content");

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    await installer.installAll();

    const commandContent = await fs.readFile(
      path.join(targetDir, "command", "pre-commit.md"),
      "utf-8",
    );
    expect(commandContent).toBe("command content");

    const toolContent = await fs.readFile(path.join(targetDir, "tool", "example-tool.ts"), "utf-8");
    expect(toolContent).toBe("tool content");
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

    for (let i = 1; i <= 5; i++) {
      await fs.writeFile(path.join(opencodeSourceDir, `file${i}.txt`), `content${i}`);
    }

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

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

  it("should resolve directory path correctly", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const dirPath = path.join(repoDir, "commands");
    await fs.mkdir(dirPath, { recursive: true });

    const installer = new ConfigInstaller(repoDir);
    const resolvedPath = await installer.resolveSource("commands", false);

    expect(resolvedPath).toBe(dirPath);
  });

  it("should return null when resolving file as directory", async () => {
    const repoDir = path.join(tmpDir, "repo");
    await fs.mkdir(repoDir, { recursive: true });
    const filePath = path.join(repoDir, "config.txt");
    await fs.writeFile(filePath, "content");

    const installer = new ConfigInstaller(repoDir);
    const resolvedPath = await installer.resolveSource("config.txt", false);

    expect(resolvedPath).toBeNull();
  });

  describe("getOpencodeAssets", () => {
    it("should return all files and directories from opencode folder", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeSourceDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeSourceDir, { recursive: true });

      await fs.writeFile(path.join(opencodeSourceDir, "config.jsonc"), "config");
      await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "agents");
      await fs.mkdir(path.join(opencodeSourceDir, "commands"), { recursive: true });

      const installer = new ConfigInstaller(repoDir, path.join(tmpDir, "target"));
      const assets = await installer.getOpencodeAssets();

      expect(assets.length).toBe(3);
      const targets = assets.map((a) => a.target).sort();
      expect(targets).toContain("config.jsonc");
      expect(targets).toContain("AGENTS.md");
      expect(targets).toContain("commands");
    });

    it("should return empty array for empty opencode directory", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeSourceDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeSourceDir, { recursive: true });

      const installer = new ConfigInstaller(repoDir, path.join(tmpDir, "target"));
      const assets = await installer.getOpencodeAssets();

      expect(assets).toEqual([]);
    });

    it("should throw InstallError when opencode directory is missing", async () => {
      const repoDir = path.join(tmpDir, "repo");
      await fs.mkdir(repoDir, { recursive: true });

      const installer = new ConfigInstaller(repoDir, path.join(tmpDir, "target"));

      await expect(installer.getOpencodeAssets()).rejects.toThrow(
        "OpenCode source directory not found: opencode",
      );
    });

    it("should detect nested subdirectories as assets", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeSourceDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeSourceDir, { recursive: true });

      // Create nested structure
      await fs.mkdir(path.join(opencodeSourceDir, "skill", "testing"), { recursive: true });
      await fs.writeFile(path.join(opencodeSourceDir, "skill", "testing", "SKILL.md"), "skill");
      await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "agents");

      const installer = new ConfigInstaller(repoDir, path.join(tmpDir, "target"));
      const assets = await installer.getOpencodeAssets();

      expect(assets.length).toBe(2);
      const targets = assets.map((a) => a.target).sort();
      expect(targets).toContain("AGENTS.md");
      expect(targets).toContain("skill");
    });
  });

  it("should clean up broken symlinks after installation", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");
    await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "rules");

    const targetDir = path.join(tmpDir, "opencode");
    await fs.mkdir(targetDir, { recursive: true });

    await fs.symlink("/nonexistent/path", path.join(targetDir, "broken-link.txt"));

    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    const brokenLinkExists = await fs
      .lstat(path.join(targetDir, "broken-link.txt"))
      .then(() => true)
      .catch(() => false);

    expect(brokenLinkExists).toBe(false);

    const validLinkExists = await fs.lstat(path.join(targetDir, "opencode.jsonc"));
    expect(validLinkExists.isSymbolicLink()).toBe(true);
  });

  it("should not remove valid symlinks during cleanup", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");

    const targetDir = path.join(tmpDir, "opencode");
    await fs.mkdir(targetDir, { recursive: true });

    await fs.symlink(
      path.join(opencodeSourceDir, "opencode.jsonc"),
      path.join(targetDir, "valid-link.jsonc"),
    );

    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    const validLinkExists = await fs.lstat(path.join(targetDir, "valid-link.jsonc"));
    expect(validLinkExists.isSymbolicLink()).toBe(true);
  });

  it("should handle empty opencode directory", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });
    // Empty opencode directory - no files inside

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    // Target directory should exist but be empty
    const entries = await fs.readdir(targetDir);
    expect(entries.length).toBe(0);
  });

  it("should not fail cleanup when no broken symlinks exist", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");

    const targetDir = path.join(tmpDir, "opencode");
    await fs.mkdir(targetDir, { recursive: true });

    // Create a valid symlink that should NOT be removed
    await fs.symlink(
      path.join(opencodeSourceDir, "opencode.jsonc"),
      path.join(targetDir, "existing-valid.jsonc"),
    );

    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    // Valid symlink should still exist
    const validLinkExists = await fs.lstat(path.join(targetDir, "existing-valid.jsonc"));
    expect(validLinkExists.isSymbolicLink()).toBe(true);

    // New symlink should be created
    const newLinkExists = await fs.lstat(path.join(targetDir, "opencode.jsonc"));
    expect(newLinkExists.isSymbolicLink()).toBe(true);
  });

  it("should remove multiple broken symlinks", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config");

    const targetDir = path.join(tmpDir, "opencode");
    await fs.mkdir(targetDir, { recursive: true });

    const brokenLinks = ["broken1.txt", "broken2.txt", "broken3.txt"];
    for (const link of brokenLinks) {
      await fs.symlink(`/nonexistent/${link}`, path.join(targetDir, link));
    }

    const installer = new ConfigInstaller(repoDir, targetDir);

    const success = await installer.installAll();

    expect(success).toBe(true);

    for (const link of brokenLinks) {
      const exists = await fs
        .lstat(path.join(targetDir, link))
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(false);
    }
  });

  it("should be idempotent when running installAll twice", async () => {
    const repoDir = path.join(tmpDir, "repo");
    const opencodeSourceDir = path.join(repoDir, "opencode");
    await fs.mkdir(opencodeSourceDir, { recursive: true });

    await fs.writeFile(path.join(opencodeSourceDir, "opencode.jsonc"), "config content");
    await fs.writeFile(path.join(opencodeSourceDir, "AGENTS.md"), "agents content");

    const targetDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(repoDir, targetDir);

    const firstRun = await installer.installAll();
    const secondRun = await installer.installAll();

    expect(firstRun).toBe(true);
    expect(secondRun).toBe(true);

    const stats = {
      jsonc: await fs.lstat(path.join(targetDir, "opencode.jsonc")),
      agents: await fs.lstat(path.join(targetDir, "AGENTS.md")),
    };

    expect(stats.jsonc.isSymbolicLink()).toBe(true);
    expect(stats.agents.isSymbolicLink()).toBe(true);

    // Verify content is still accessible after second run
    const jsoncContent = await fs.readFile(path.join(targetDir, "opencode.jsonc"), "utf-8");
    expect(jsoncContent).toBe("config content");
  });
});
