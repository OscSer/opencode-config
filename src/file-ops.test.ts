import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { createSymlink, isBrokenSymlink, validateSourcePath } from "./file-ops";
import { SymlinkError } from "./types-def";

let tmpDir: string;

describe("file-ops", () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe("validateSourcePath", () => {
    it("should return null for missing file", async () => {
      const result = await validateSourcePath(tmpDir, "missing.txt", true);
      expect(result).toBeNull();
    });

    it("should return null when expecting file but directory exists", async () => {
      const dirPath = path.join(tmpDir, "data");
      await fs.mkdir(dirPath);

      const result = await validateSourcePath(tmpDir, "data", true);
      expect(result).toBeNull();
    });

    it("should return null when expecting directory but file exists", async () => {
      const filePath = path.join(tmpDir, "file.txt");
      await fs.writeFile(filePath, "content");

      const result = await validateSourcePath(tmpDir, "file.txt", false);
      expect(result).toBeNull();
    });

    it("should return absolute path for valid file", async () => {
      const filePath = path.join(tmpDir, "file.txt");
      await fs.writeFile(filePath, "content");

      const result = await validateSourcePath(tmpDir, "file.txt", true);
      expect(result).toBe(filePath);
    });

    it("should return absolute path for valid directory", async () => {
      const dirPath = path.join(tmpDir, "data");
      await fs.mkdir(dirPath);

      const result = await validateSourcePath(tmpDir, "data", false);
      expect(result).toBe(dirPath);
    });

    it("should return path for file when isFile is undefined", async () => {
      const filePath = path.join(tmpDir, "file.txt");
      await fs.writeFile(filePath, "content");

      const result = await validateSourcePath(tmpDir, "file.txt");
      expect(result).toBe(filePath);
    });

    it("should return path for directory when isFile is undefined", async () => {
      const dirPath = path.join(tmpDir, "dir");
      await fs.mkdir(dirPath);

      const result = await validateSourcePath(tmpDir, "dir");
      expect(result).toBe(dirPath);
    });
  });

  describe("isBrokenSymlink", () => {
    it("should return false for valid symlink", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "content");
      const linkPath = path.join(tmpDir, "link.txt");
      await fs.symlink(sourcePath, linkPath);

      const result = await isBrokenSymlink(linkPath);

      expect(result).toBe(false);
    });

    it("should return true for broken symlink", async () => {
      const linkPath = path.join(tmpDir, "broken-link.txt");
      await fs.symlink("/nonexistent/path", linkPath);

      const result = await isBrokenSymlink(linkPath);

      expect(result).toBe(true);
    });

    it("should return false for regular file", async () => {
      const filePath = path.join(tmpDir, "regular.txt");
      await fs.writeFile(filePath, "content");

      const result = await isBrokenSymlink(filePath);

      expect(result).toBe(false);
    });

    it("should return false for directory", async () => {
      const dirPath = path.join(tmpDir, "dir");
      await fs.mkdir(dirPath);

      const result = await isBrokenSymlink(dirPath);

      expect(result).toBe(false);
    });

    it("should return true for nonexistent path (treated as inaccessible)", async () => {
      // Note: A nonexistent path is not technically a "broken symlink",
      // but the function returns true for any inaccessible path.
      // This behavior is intentional for cleanup operations.
      const result = await isBrokenSymlink(path.join(tmpDir, "nonexistent"));

      expect(result).toBe(true);
    });
  });

  describe("createSymlink", () => {
    it("should create symlink to existing file", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "data");
      const targetPath = path.join(tmpDir, "links", "link.txt");

      const result = await createSymlink(sourcePath, targetPath);

      expect(result).toBe(true);
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
      const linkTarget = await fs.readlink(targetPath);
      expect(path.resolve(linkTarget)).toBe(path.resolve(sourcePath));
    });

    it("should replace existing symlink", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "data");
      const otherPath = path.join(tmpDir, "other.txt");
      await fs.writeFile(otherPath, "other");
      const targetPath = path.join(tmpDir, "link.txt");

      await fs.symlink(otherPath, targetPath);
      await createSymlink(sourcePath, targetPath);

      const linkTarget = await fs.readlink(targetPath);
      expect(path.resolve(linkTarget)).toBe(path.resolve(sourcePath));
    });

    it("should replace existing directory", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "data");
      const targetPath = path.join(tmpDir, "dir_target");
      await fs.mkdir(targetPath);
      await fs.writeFile(path.join(targetPath, "old.txt"), "old");

      await createSymlink(sourcePath, targetPath);

      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
      const linkTarget = await fs.readlink(targetPath);
      expect(path.resolve(linkTarget)).toBe(path.resolve(sourcePath));
    });

    it("should replace existing regular file", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "new content");
      const targetPath = path.join(tmpDir, "existing.txt");
      await fs.writeFile(targetPath, "old content");

      await createSymlink(sourcePath, targetPath);

      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
      const linkTarget = await fs.readlink(targetPath);
      expect(path.resolve(linkTarget)).toBe(path.resolve(sourcePath));
    });

    it("should create symlink to directory", async () => {
      const sourceDir = path.join(tmpDir, "source-dir");
      await fs.mkdir(sourceDir);
      await fs.writeFile(path.join(sourceDir, "file.txt"), "content");
      const targetPath = path.join(tmpDir, "link-dir");

      const result = await createSymlink(sourceDir, targetPath);

      expect(result).toBe(true);
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
      const linkTarget = await fs.readlink(targetPath);
      expect(path.resolve(linkTarget)).toBe(path.resolve(sourceDir));

      // Verify directory content is accessible through symlink
      const content = await fs.readFile(path.join(targetPath, "file.txt"), "utf-8");
      expect(content).toBe("content");
    });

    it("should throw SymlinkError when source is missing", async () => {
      const sourcePath = path.join(tmpDir, "missing.txt");
      const targetPath = path.join(tmpDir, "link.txt");

      await expect(createSymlink(sourcePath, targetPath)).rejects.toBeInstanceOf(SymlinkError);
    });

    it("should include source and target paths in error message", async () => {
      const sourcePath = path.join(tmpDir, "missing.txt");
      const targetPath = path.join(tmpDir, "link.txt");

      await expect(createSymlink(sourcePath, targetPath)).rejects.toThrow(/missing\.txt/);
    });

    it("should replace broken symlink with valid one", async () => {
      const sourcePath = path.join(tmpDir, "source.txt");
      await fs.writeFile(sourcePath, "content");
      const targetPath = path.join(tmpDir, "link.txt");

      // Create broken symlink first
      await fs.symlink("/nonexistent/path", targetPath);

      const result = await createSymlink(sourcePath, targetPath);

      expect(result).toBe(true);
      const stat = await fs.lstat(targetPath);
      expect(stat.isSymbolicLink()).toBe(true);
      const content = await fs.readFile(targetPath, "utf-8");
      expect(content).toBe("content");
    });
  });
});
