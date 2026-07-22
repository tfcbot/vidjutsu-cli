import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import packageJson from "../package.json";
import { VERSION } from "../src/version";

const root = join(import.meta.dir, "..");

describe("release invariants", () => {
  test("package and runtime versions match", () => {
    expect(packageJson.version).toBe("0.6.0");
    expect(VERSION).toBe(packageJson.version);
  });

  test("dead jobs command is absent and clone is registered", () => {
    expect(existsSync(join(root, "src/commands/jobs.ts"))).toBe(false);
    const index = readFileSync(join(root, "src/index.ts"), "utf8");
    expect(index).not.toContain('jobs: () => import("./commands/jobs")');
    expect(index).toContain('clone: () => import("./commands/clone")');
  });
});
