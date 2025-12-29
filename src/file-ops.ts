import { promises as fs } from "node:fs";
import * as path from "node:path";

import { SymlinkError } from "./types-def";

export async function validateSourcePath(
  repoDir: string,
  relativePath: string,
  isFile?: boolean,
): Promise<string | null> {
  const fullPath = path.join(repoDir, relativePath);

  try {
    const stat = await fs.stat(fullPath);

    if (isFile === true && !stat.isFile()) {
      console.warn(`Warning: ${relativePath} is not a file, skipping...`);
      return null;
    }

    if (isFile === false && !stat.isDirectory()) {
      console.warn(`Warning: ${relativePath} is not a directory, skipping...`);
      return null;
    }

    return fullPath;
  } catch {
    console.warn(`Warning: ${relativePath} not found in repository, skipping...`);
    return null;
  }
}

export async function isBrokenSymlink(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(targetPath);
    if (!stat.isSymbolicLink()) {
      return false;
    }
    await fs.stat(targetPath);
    return false;
  } catch {
    return true;
  }
}

export async function createSymlink(source: string, target: string): Promise<boolean> {
  try {
    const sourceStat = await fs.stat(source);

    const targetDir = path.dirname(target);
    await fs.mkdir(targetDir, { recursive: true });

    const targetStat = await fs.lstat(target).catch(() => null);
    if (targetStat) {
      if (targetStat.isSymbolicLink()) {
        await fs.unlink(target);
      } else if (targetStat.isDirectory()) {
        await fs.rm(target, { recursive: true, force: true });
      } else {
        await fs.unlink(target);
      }
    }

    const resolvedSource = path.resolve(source);
    const symlinkType = sourceStat.isDirectory() ? "dir" : "file";
    await fs.symlink(resolvedSource, target, symlinkType);

    return true;
  } catch (error) {
    throw new SymlinkError(
      `Failed to symlink ${source} to ${target}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
