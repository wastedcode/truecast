import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPersona } from "../persona/index.js";
import { renderSystemPrompt } from "./index.js";

/**
 * The renderer is the single owner of "what a persona's prompt says". The `PromptTransport` refactor
 * (subagent | plugin) MUST NOT change the subagent output — that is the surface 9 shipped personas
 * already depend on. These goldens were captured from the live `personas/` source on the pre-refactor
 * renderer; the subagent transport must reproduce them byte-for-byte forever.
 *
 * Regenerate deliberately (a reviewed step) with `pnpm tsx scripts/regen-goldens.ts` — never auto-update
 * here (a self-writing snapshot would let a real regression pass). Render is ALWAYS from `personas/`
 * (the committed source), never from the `~/.truecast` cache, so a stale cache can't make this lie.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const personasDir = join(repoRoot, "personas");
const goldenDir = join(dirname(fileURLToPath(import.meta.url)), "__goldens__");

const personaNames = readdirSync(personasDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const renderSubagent = (name: string): string => {
  const persona = loadPersona(join(personasDir, name));
  return renderSystemPrompt(
    { name, version: persona.manifest.version, coreDir: persona.coreDir },
    persona,
    { kind: "subagent" },
  );
};

const renderPlugin = (name: string): string => {
  const persona = loadPersona(join(personasDir, name));
  return renderSystemPrompt(
    { name, version: persona.manifest.version, coreDir: persona.coreDir },
    persona,
    { kind: "plugin" },
  );
};

describe("renderSystemPrompt — subagent output is byte-identical to the golden baseline", () => {
  it("ships at least the full roster (guard against a vacuous pass)", () => {
    expect(personaNames.length).toBeGreaterThanOrEqual(9);
  });

  it("has exactly one golden per persona (no orphan/missing fixtures)", () => {
    const goldens = readdirSync(goldenDir)
      .filter((f) => f.endsWith(".subagent.md"))
      .map((f) => f.replace(/\.subagent\.md$/, ""))
      .sort();
    expect(goldens).toEqual(personaNames);
  });

  it.each(personaNames)("%s renders byte-identical to its golden", (name) => {
    const goldenPath = join(goldenDir, `${name}.subagent.md`);
    // A missing golden FAILS — it is never auto-written (that would mask a regression).
    expect(existsSync(goldenPath), `missing golden for ${name}; run scripts/regen-goldens.ts`).toBe(
      true,
    );
    const golden = readFileSync(goldenPath, "utf8");
    expect(golden.length).toBeGreaterThan(0);
    expect(renderSubagent(name)).toBe(golden);
  });
});

describe("renderSystemPrompt — plugin transport differs only where it must", () => {
  const sample = personaNames[0] as string;

  it("reads craft from the bundled plugin root, not the project symlink", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting the literal token appears in output.
    expect(renderPlugin(sample)).toContain("${CLAUDE_PLUGIN_ROOT}/core");
    expect(renderPlugin(sample)).not.toContain("/core` is transparent through the symlink");
  });

  it("drops the symlink/rg prose that is false without a symlink", () => {
    const body = renderPlugin(sample);
    expect(body).not.toContain("through the `core/` symlink");
    expect(body).not.toContain("rg .");
    expect(body).not.toContain("symlinked core");
  });

  it("treats a missing mandate as optional, not an error — asks instead of failing (read-only safe)", () => {
    const body = renderPlugin(sample);
    expect(body).toContain("ask the user what they need");
    expect(body).toContain("that's not an error");
    // must NOT instruct a (read-only) persona to write a file it can't, nor present the path as broken
    expect(body).not.toContain("write that mandate");
    expect(body).not.toContain("does not exist yet, that is your first task");
  });

  it("keeps the per-project job path project-relative (the job lives in the consuming repo)", () => {
    expect(renderPlugin(sample)).toContain(`.truecast/agents/${sample}/instance/mandate.md`);
  });

  it("leaks no machine-local absolute path into any persona's plugin body", () => {
    for (const name of personaNames) {
      const body = renderPlugin(name);
      expect(body, `${name} leaks /home`).not.toMatch(/\/home\//);
      expect(body, `${name} leaks /Users`).not.toMatch(/\/Users\//);
      expect(body, `${name} leaks $HOME`).not.toContain("$HOME");
      expect(body, `${name} leaks a Windows drive path`).not.toMatch(/[A-Za-z]:\\/);
    }
  });
});
