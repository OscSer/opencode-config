import { promises as fs } from "node:fs";
import * as path from "node:path";

import { CopyError } from "./types-def";

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

export async function createSymlink(source: string, target: string): Promise<boolean> {
  try {
    const sourceStat = await fs.stat(source);

    const targetDir = path.dirname(target);
    await fs.mkdir(targetDir, { recursive: true });

    try {
      const targetStat = await fs.lstat(target);
      if (targetStat.isSymbolicLink()) {
        await fs.unlink(target);
      } else if (targetStat.isDirectory()) {
        await fs.rm(target, { recursive: true, force: true });
      } else {
        await fs.unlink(target);
      }
    } catch {
      // Target doesn't exist, that's fine
    }

    const resolvedSource = path.resolve(source);
    const symlinkType = sourceStat.isDirectory() ? "dir" : "file";
    await fs.symlink(resolvedSource, target, symlinkType);

    return true;
  } catch (error) {
    throw new CopyError(
      `Failed to symlink ${source} to ${target}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
