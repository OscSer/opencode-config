import { describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { AGENTS_CONFIG } from "../src/agents-config";

describe("agents-config", () => {
  it("should not be empty", () => {
    expect(Object.keys(AGENTS_CONFIG).length).toBeGreaterThan(0);
  });

  it("should have required fields for each agent", () => {
    for (const config of Object.values(AGENTS_CONFIG)) {
      expect(config).toHaveProperty("label");
      expect(config.label).toBeTruthy();
      expect(config).toHaveProperty("assets");
      expect(config.assets.length).toBeGreaterThan(0);

      for (const asset of config.assets) {
        expect(asset).toHaveProperty("source");
        expect(asset).toHaveProperty("target");
        expect(asset).toHaveProperty("type");
        expect(asset.source).toBeTruthy();
        expect(asset.target).toBeTruthy();
        expect(["file", "dir"]).toContain(asset.type);
      }
    }
  });

  it("should have asset sources that exist and match type", async () => {
    const repoRoot = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

    for (const config of Object.values(AGENTS_CONFIG)) {
      for (const asset of config.assets) {
        const sourcePath = path.join(repoRoot, asset.source);
        try {
          const stat = await fs.stat(sourcePath);
          expect(stat !== null).toBe(true);

          if (asset.type === "file") {
            expect(stat.isFile()).toBe(true);
          } else {
            expect(stat.isDirectory()).toBe(true);
          }
        } catch {
          throw new Error(`Asset not found: ${sourcePath}`);
        }
      }
    }
  });
});
