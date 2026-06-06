import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { GrantableTool } from "../schema/index.js";
import { classify, computeChanges, toolsDiff } from "./index.js";

/** A minimal on-disk core: persona.toml manifest + the files it references. */
interface CoreSpec {
  skills?: Record<string, string>;
  knowledge?: Record<string, string>;
  identity?: string;
  tools?: GrantableTool[];
}

let root: string;
function core(name: string, spec: CoreSpec): string {
  const dir = join(root, name);
  mkdirSync(join(dir, "skills"), { recursive: true });
  mkdirSync(join(dir, "knowledge"), { recursive: true });
  writeFileSync(join(dir, "agent.md"), spec.identity ?? "you are an expert");
  for (const [rel, body] of Object.entries(spec.skills ?? {})) {
    writeFileSync(join(dir, rel), body);
  }
  for (const [rel, body] of Object.entries(spec.knowledge ?? {})) {
    writeFileSync(join(dir, rel), body);
  }
  const toml = [
    'name = "tester"',
    'version = "1.0.0"',
    'identity = "agent.md"',
    `skills = [${Object.keys(spec.skills ?? {})
      .map((s) => `"${s}"`)
      .join(", ")}]`,
    `knowledge = [${Object.keys(spec.knowledge ?? {})
      .map((k) => `"${k}"`)
      .join(", ")}]`,
    spec.tools ? `tools = [${spec.tools.map((t) => `"${t}"`).join(", ")}]` : "",
  ].join("\n");
  writeFileSync(join(dir, "persona.toml"), toml);
  return dir;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "tc-review-"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("computeChanges", () => {
  it("detects an added skill", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A" } });
    const cand = core("cand", { skills: { "skills/a.md": "A", "skills/b.md": "B" } });
    const changes = computeChanges(cur, cand);
    expect(changes).toContainEqual({ kind: "add", path: "skills/b.md", layer: "skill" });
    expect(changes).toContainEqual({ kind: "modify", path: "persona.toml", layer: "manifest" });
  });

  it("detects a deleted skill", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A", "skills/b.md": "B" } });
    const cand = core("cand", { skills: { "skills/a.md": "A" } });
    expect(computeChanges(cur, cand)).toContainEqual({
      kind: "delete",
      path: "skills/b.md",
      layer: "skill",
    });
  });

  it("detects a modified file", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A" } });
    const cand = core("cand", { skills: { "skills/a.md": "A2" } });
    expect(computeChanges(cur, cand)).toContainEqual({
      kind: "modify",
      path: "skills/a.md",
      layer: "skill",
    });
  });

  it("detects an identity change", () => {
    const cur = core("cur", { identity: "v1" });
    const cand = core("cand", { identity: "v2" });
    expect(computeChanges(cur, cand)).toContainEqual({
      kind: "modify",
      path: "agent.md",
      layer: "identity",
    });
  });

  it("reports no file changes for identical cores (manifest aside)", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A" } });
    const cand = core("cand", { skills: { "skills/a.md": "A" } });
    expect(computeChanges(cur, cand).filter((c) => c.layer !== "manifest")).toEqual([]);
  });
});

describe("classify", () => {
  it("major when identity changes", () => {
    const changes = computeChanges(
      core("cur", { identity: "v1" }),
      core("cand", { identity: "v2" }),
    );
    expect(classify(changes, [])).toBe("major");
  });

  it("major when a tool is newly granted", () => {
    expect(classify([], ["Bash"])).toBe("major");
  });

  it("major when a skill is removed", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A", "skills/b.md": "B" } });
    const cand = core("cand", { skills: { "skills/a.md": "A" } });
    expect(classify(computeChanges(cur, cand), [])).toBe("major");
  });

  it("minor when a skill is added", () => {
    const cur = core("cur", { skills: { "skills/a.md": "A" } });
    const cand = core("cand", { skills: { "skills/a.md": "A", "skills/b.md": "B" } });
    // strip the manifest-modify so we test the skill add in isolation
    const changes = computeChanges(cur, cand).filter((c) => c.layer !== "manifest");
    expect(classify(changes, [])).toBe("minor");
  });

  it("patch when nothing of substance changed", () => {
    expect(classify([], [])).toBe("patch");
  });
});

describe("toolsDiff", () => {
  it("reports added and removed", () => {
    expect(toolsDiff(["Read", "Grep"], ["Read", "Bash"])).toEqual({
      added: ["Bash"],
      removed: ["Grep"],
    });
  });
  it("handles undefined inputs", () => {
    expect(toolsDiff(undefined, ["Read"])).toEqual({ added: ["Read"], removed: [] });
    expect(toolsDiff(["Read"], undefined)).toEqual({ added: [], removed: ["Read"] });
  });
});
