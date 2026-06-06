import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { assertRegularFile, resolveContained } from "./index.js";

const base = mkdtempSync(join(tmpdir(), "tc-safety-"));
const core = join(base, "core");
mkdirSync(core);
writeFileSync(join(core, "ok.md"), "ok");
writeFileSync(join(base, "outside.md"), "secret");
symlinkSync(join(base, "outside.md"), join(core, "link.md"));

afterAll(() => rmSync(base, { recursive: true, force: true }));

describe("resolveContained", () => {
  it("allows a contained relative path", () => {
    expect(resolveContained(core, "ok.md")).toMatch(/ok\.md$/);
  });
  it("rejects traversal", () => {
    expect(() => resolveContained(core, "../outside.md")).toThrow();
  });
  it("rejects an absolute path", () => {
    expect(() => resolveContained(core, "/etc/passwd")).toThrow();
  });
  it("rejects a null byte", () => {
    expect(() => resolveContained(core, `a${String.fromCharCode(0)}b`)).toThrow();
  });
});

describe("assertRegularFile", () => {
  it("accepts a regular file", () => {
    expect(() => assertRegularFile(join(core, "ok.md"))).not.toThrow();
  });
  it("rejects a symlink (source symlink-escape)", () => {
    expect(() => assertRegularFile(join(core, "link.md"))).toThrow();
  });
});
