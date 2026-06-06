import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Config } from "../config/index.js";
import { CollisionError, DriftError } from "../errors.js";
import { Ledger } from "./index.js";

let home: string;
function cfg(): Config {
  home = mkdtempSync(join(tmpdir(), "tc-ledger-"));
  return { truecastHome: home, claudeHome: home, tmpRoot: home };
}
afterEach(() => rmSync(home, { recursive: true, force: true }));

describe("Ledger — the managed-write chokepoint", () => {
  it("writes a managed file and records ownership", async () => {
    const l = await Ledger.load(cfg());
    const p = join(home, "agents", "x.md");
    l.writeFile(p, "hello", "agent", "x");
    expect(l.owns(p)).toBe(true);
    expect(l.isDrifted(p)).toBe(false);
  });

  it("detects drift and refuses to overwrite a hand-edited managed file (RR2/B1)", async () => {
    const l = await Ledger.load(cfg());
    const p = join(home, "agents", "x.md");
    l.writeFile(p, "v1", "agent", "x");
    writeFileSync(p, "HAND EDIT"); // the user tampered with a generated file
    expect(l.isDrifted(p)).toBe(true);
    expect(() => l.assertWritable(p, "x")).toThrow(DriftError);
  });

  it("refuses to clobber an un-owned existing file (B5)", async () => {
    const l = await Ledger.load(cfg());
    const p = join(home, "x.md");
    writeFileSync(p, "someone else's");
    expect(() => l.assertWritable(p, "x")).toThrow(CollisionError);
  });
});
