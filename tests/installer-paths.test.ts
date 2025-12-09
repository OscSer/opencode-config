import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { ConfigInstaller } from "../src/installer";
import { InstallError } from "../src/types-def";

let tmpDir: string;

describe("installer-paths", () => {
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should get target dir for opencode agent", () => {
    const opencodeDir = path.join(tmpDir, "opencode");
    const installer = new ConfigInstaller(tmpDir, opencodeDir);

    const targetDir = installer.getTargetDir("opencode");
    expect(targetDir).toBe(opencodeDir);
  });

  it("should throw InstallError for unknown agent", () => {
    const installer = new ConfigInstaller();

    try {
      installer.getTargetDir("unknown");
      expect(false).toBe(true); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(InstallError);
    }
  });
});
