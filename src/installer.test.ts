import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { ConfigInstaller } from "./installer";

let tmpDir: string;

describe("ConfigInstaller", () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe("install", () => {
    it("should create symlinks for files", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });

      await fs.writeFile(path.join(opencodeDir, "opencode.jsonc"), "config");
      await fs.writeFile(path.join(opencodeDir, "AGENTS.md"), "rules");

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      expect(
        (
          await fs.lstat(path.join(targetDir, "opencode.jsonc"))
        ).isSymbolicLink(),
      ).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "AGENTS.md"))).isSymbolicLink(),
      ).toBe(true);
    });

    it("should create symlinks for directories", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });

      await fs.mkdir(path.join(opencodeDir, "command"), { recursive: true });
      await fs.mkdir(path.join(opencodeDir, "tool"), { recursive: true });

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "command"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "tool"))).isSymbolicLink(),
      ).toBe(true);
    });

    it("should make nested content accessible through symlinked directories", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(path.join(opencodeDir, "command"), { recursive: true });
      await fs.writeFile(
        path.join(opencodeDir, "command", "example.md"),
        "content",
      );

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      await installer.install();

      const content = await fs.readFile(
        path.join(targetDir, "command", "example.md"),
        "utf-8",
      );
      expect(content).toBe("content");
    });

    it("should return false when opencode directory is missing", async () => {
      const repoDir = path.join(tmpDir, "repo");
      await fs.mkdir(repoDir, { recursive: true });

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(false);
    });

    it("should handle multiple assets", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });

      for (let i = 1; i <= 5; i++) {
        await fs.writeFile(
          path.join(opencodeDir, `file${i}.txt`),
          `content${i}`,
        );
      }

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      for (let i = 1; i <= 5; i++) {
        expect(
          (
            await fs.lstat(path.join(targetDir, `file${i}.txt`))
          ).isSymbolicLink(),
        ).toBe(true);
      }
    });

    it("should replace existing symlink", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.txt"), "new");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });
      await fs.writeFile(path.join(tmpDir, "old.txt"), "old");
      await fs.symlink(
        path.join(tmpDir, "old.txt"),
        path.join(targetDir, "config.txt"),
      );

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      const content = await fs.readFile(
        path.join(targetDir, "config.txt"),
        "utf-8",
      );
      expect(content).toBe("new");
    });

    it("should replace existing directory", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "data"), "file-content");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(path.join(targetDir, "data"), { recursive: true });
      await fs.writeFile(path.join(targetDir, "data", "old.txt"), "old");

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      expect(
        (await fs.lstat(path.join(targetDir, "data"))).isSymbolicLink(),
      ).toBe(true);
      const content = await fs.readFile(path.join(targetDir, "data"), "utf-8");
      expect(content).toBe("file-content");
    });

    it("should replace existing regular file", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.txt"), "new");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });
      await fs.writeFile(path.join(targetDir, "config.txt"), "old");

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      expect(
        (await fs.lstat(path.join(targetDir, "config.txt"))).isSymbolicLink(),
      ).toBe(true);
      const content = await fs.readFile(
        path.join(targetDir, "config.txt"),
        "utf-8",
      );
      expect(content).toBe("new");
    });

    it("should handle empty opencode directory", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      const entries = await fs.readdir(targetDir);
      expect(entries.length).toBe(0);
    });

    it("should be idempotent", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.jsonc"), "content");

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const first = await installer.install();
      const second = await installer.install();

      expect(first).toBe(true);
      expect(second).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "config.jsonc"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        await fs.readFile(path.join(targetDir, "config.jsonc"), "utf-8"),
      ).toBe("content");
    });
  });

  describe("skill directory symlinks", () => {
    it("should create both skill and skills symlinks when directory exists", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      const skillDir = path.join(opencodeDir, "skill");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, "test-skill.md"), "skill content");

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "skill"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "skills"))).isSymbolicLink(),
      ).toBe(true);
    });

    it("should make skill content accessible through both symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      const skillDir = path.join(opencodeDir, "skill");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, "example.md"), "content");

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      await installer.install();

      const contentFromSkill = await fs.readFile(
        path.join(targetDir, "skill", "example.md"),
        "utf-8",
      );
      const contentFromSkills = await fs.readFile(
        path.join(targetDir, "skills", "example.md"),
        "utf-8",
      );
      expect(contentFromSkill).toBe("content");
      expect(contentFromSkills).toBe("content");
    });

    it("should handle gracefully when skill directory is missing", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const success = await installer.install();

      expect(success).toBe(true);
      const skillExists = await fs
        .lstat(path.join(targetDir, "skill"))
        .catch(() => null);
      const skillsExists = await fs
        .lstat(path.join(targetDir, "skills"))
        .catch(() => null);
      expect(skillExists).toBeNull();
      expect(skillsExists).toBeNull();
    });

    it("should replace existing skill symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      const skillDir = path.join(opencodeDir, "skill");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, "new.md"), "new content");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });

      const oldSkillDir = path.join(tmpDir, "old-skill");
      await fs.mkdir(oldSkillDir, { recursive: true });
      await fs.writeFile(path.join(oldSkillDir, "old.md"), "old content");
      await fs.symlink(oldSkillDir, path.join(targetDir, "skill"));
      await fs.symlink(oldSkillDir, path.join(targetDir, "skills"));

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      const skillContent = await fs.readFile(
        path.join(targetDir, "skill", "new.md"),
        "utf-8",
      );
      const skillsContent = await fs.readFile(
        path.join(targetDir, "skills", "new.md"),
        "utf-8",
      );
      expect(skillContent).toBe("new content");
      expect(skillsContent).toBe("new content");
    });

    it("should be idempotent for skill symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      const skillDir = path.join(opencodeDir, "skill");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, "test.md"), "content");

      const targetDir = path.join(tmpDir, "target");
      const installer = new ConfigInstaller(repoDir, targetDir);

      const first = await installer.install();
      const second = await installer.install();

      expect(first).toBe(true);
      expect(second).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "skill"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        (await fs.lstat(path.join(targetDir, "skills"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        await fs.readFile(path.join(targetDir, "skill", "test.md"), "utf-8"),
      ).toBe("content");
    });
  });

  describe("cleanup broken symlinks", () => {
    it("should remove broken symlinks after installation", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.jsonc"), "config");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });
      await fs.symlink("/nonexistent/path", path.join(targetDir, "broken.txt"));

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      const brokenExists = await fs
        .lstat(path.join(targetDir, "broken.txt"))
        .catch(() => null);
      expect(brokenExists).toBeNull();
    });

    it("should not remove valid symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.jsonc"), "config");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });
      await fs.symlink(
        path.join(opencodeDir, "config.jsonc"),
        path.join(targetDir, "valid.jsonc"),
      );

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      expect(
        (await fs.lstat(path.join(targetDir, "valid.jsonc"))).isSymbolicLink(),
      ).toBe(true);
    });

    it("should remove multiple broken symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.jsonc"), "config");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });

      const brokenLinks = ["broken1.txt", "broken2.txt", "broken3.txt"];
      for (const link of brokenLinks) {
        await fs.symlink(`/nonexistent/${link}`, path.join(targetDir, link));
      }

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      for (const link of brokenLinks) {
        const exists = await fs
          .lstat(path.join(targetDir, link))
          .catch(() => null);
        expect(exists).toBeNull();
      }
    });

    it("should handle mixed valid and broken symlinks", async () => {
      const repoDir = path.join(tmpDir, "repo");
      const opencodeDir = path.join(repoDir, "opencode");
      await fs.mkdir(opencodeDir, { recursive: true });
      await fs.writeFile(path.join(opencodeDir, "config.jsonc"), "config");

      const targetDir = path.join(tmpDir, "target");
      await fs.mkdir(targetDir, { recursive: true });

      // Valid symlink
      await fs.symlink(
        path.join(opencodeDir, "config.jsonc"),
        path.join(targetDir, "valid.jsonc"),
      );
      // Broken symlink
      await fs.symlink("/nonexistent", path.join(targetDir, "broken.txt"));

      const installer = new ConfigInstaller(repoDir, targetDir);
      await installer.install();

      expect(
        (await fs.lstat(path.join(targetDir, "valid.jsonc"))).isSymbolicLink(),
      ).toBe(true);
      expect(
        await fs.lstat(path.join(targetDir, "broken.txt")).catch(() => null),
      ).toBeNull();
    });
  });
});
