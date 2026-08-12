import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { planPublish } from "./index.js";

/**
 * The byte-pin on every generated artifact — `truecast publish --check`, run in the test suite so CI
 * enforces it without needing a built CLI.
 *
 * This REPLACES `src/materialize/__goldens__` (D11). The goldens existed to pin the subagent render;
 * the committed `personas/<name>/subagent.md` is that same pin on a real shipped artifact, and keeping
 * both meant two copies of eleven files and two regeneration commands that could disagree. There is now
 * exactly one regeneration command: `truecast publish`.
 *
 * This test NEVER writes. A stale committed file fails here and must be regenerated on purpose, in a
 * reviewable diff — a self-writing snapshot would let a real regression pass.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const plan = planPublish({ repoRoot });

/** Every file the generator owns, as committed on disk (for the set comparison below). */
function committedGeneratedFiles(): string[] {
  const out = [".claude-plugin/marketplace.json"];
  for (const name of readdirSync(join(repoRoot, "personas"), { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    out.push(
      `personas/${name.name}/.claude-plugin/plugin.json`,
      `personas/${name.name}/agents/${name.name}.md`,
      `personas/${name.name}/subagent.md`,
    );
  }
  return out.sort();
}

describe("publish conformance — the committed surface IS the plan", () => {
  it("ships at least the full roster (guard against a vacuous pass)", () => {
    expect(plan.personas.length).toBeGreaterThanOrEqual(11);
  });

  it("plans exactly the committed file set — no orphans, no missing artifacts", () => {
    expect(plan.files.map((f) => f.path).sort()).toEqual(committedGeneratedFiles());
  });

  it.each(plan.files.map((f) => f.path))("%s is byte-identical to the committed file", (path) => {
    const file = plan.files.find((f) => f.path === path);
    const abs = join(repoRoot, path);
    expect(existsSync(abs), `${path} is missing; run 'truecast publish'`).toBe(true);
    const content = file?.content ?? "";
    expect(content.length, `${path} planned empty`).toBeGreaterThan(0);
    expect(readFileSync(abs, "utf8"), `${path} is stale; run 'truecast publish'`).toBe(content);
  });
});
