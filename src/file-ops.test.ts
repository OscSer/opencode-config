import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { createSymlink, validateSourcePath } from "./file-ops";
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

  describe("createSymlink", () => {
    it("should create symlink that points to source", async () => {
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

    it("should throw SymlinkError when source is missing", async () => {
      const sourcePath = path.join(tmpDir, "missing.txt");
      const targetPath = path.join(tmpDir, "link.txt");

      await expect(createSymlink(sourcePath, targetPath)).rejects.toBeInstanceOf(SymlinkError);
    });
  });
});
