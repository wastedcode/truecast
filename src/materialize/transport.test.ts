import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPersona } from "../persona/index.js";
import { renderSystemPrompt, TRUECAST_HOME_PLACEHOLDER } from "./index.js";

/**
 * The renderer is the single owner of "what a persona's prompt says", and the two transports must differ
 * ONLY where they must — craft path and job prose. The BYTE pin lives in `publish.conformance.test.ts`
 * (the committed `personas/<name>/subagent.md` and `agents/<name>.md`); this file pins the *properties*
 * a byte diff would let you rationalise away: no machine-local path leak, no false symlink prose, and
 * the absolute-pointer overlay actually present.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const personasDir = join(repoRoot, "personas");

const personaNames = readdirSync(personasDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const render = (name: string, home?: string): string => {
  const persona = loadPersona(join(personasDir, name));
  return renderSystemPrompt(
    { name, version: persona.manifest.version, coreDir: persona.coreDir },
    persona,
    home === undefined ? { kind: "plugin" } : { kind: "subagent", truecastHome: home },
  );
};

describe("renderSystemPrompt — the subagent transport (T-R1)", () => {
  const sample = personaNames[0] as string;

  it("ships at least the full roster (guard against a vacuous pass)", () => {
    expect(personaNames.length).toBeGreaterThanOrEqual(11);
  });

  it("points at an absolute path through `current`, in the published template", () => {
    const body = render(sample, TRUECAST_HOME_PLACEHOLDER);
    expect(body).toContain(`${TRUECAST_HOME_PLACEHOLDER}/personas/${sample}/current/core/`);
    expect(body).not.toContain(`.truecast/agents/${sample}/core`); // the old project-symlink pointer
  });

  it("substitutes a real home verbatim, with forward slashes only in the pointer", () => {
    const body = render(sample, "/opt/tc-home/.truecast");
    expect(body).toContain(`/opt/tc-home/.truecast/personas/${sample}/current/core/`);
    for (const line of body.split("\n")) {
      if (line.includes("/personas/")) expect(line).not.toContain("\\");
    }
  });

  it("carries the repo-overlay instruction: mandate first, absence is not an error", () => {
    const body = render(sample, TRUECAST_HOME_PLACEHOLDER);
    expect(body).toContain(`.truecast/agents/${sample}/instance/mandate.md`);
    expect(body).toContain("Read it FIRST");
    expect(body).toContain("that is not an error");
    expect(body).toContain("ask the user what they need");
  });

  it("says where the craft is Read from, and drops the project-symlink prose", () => {
    const body = render(sample, TRUECAST_HOME_PLACEHOLDER);
    expect(body).toContain("from your global truecast install");
    expect(body).not.toContain("through the `core/` symlink");
    expect(body).not.toContain("symlinked core");
  });

  it("leaks no machine-local absolute path into any persona's PUBLISHED template", () => {
    for (const name of personaNames) {
      const body = render(name, TRUECAST_HOME_PLACEHOLDER);
      expect(body, `${name} leaks /home`).not.toMatch(/\/home\//);
      expect(body, `${name} leaks /Users`).not.toMatch(/\/Users\//);
      expect(body, `${name} leaks $HOME`).not.toContain("$HOME");
      expect(body, `${name} leaks a Windows drive path`).not.toMatch(/[A-Za-z]:\\/);
    }
  });
});

describe("renderSystemPrompt — the plugin transport differs only where it must (T-R2)", () => {
  const sample = personaNames[0] as string;

  it("reads craft from the bundled plugin root, not a path into the user's home", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting the literal token appears in output.
    expect(render(sample)).toContain("${CLAUDE_PLUGIN_ROOT}/core");
    expect(render(sample)).not.toContain(TRUECAST_HOME_PLACEHOLDER);
  });

  it("drops the symlink/rg prose that is false without a symlink", () => {
    const body = render(sample);
    expect(body).not.toContain("through the `core/` symlink");
    expect(body).not.toContain("rg .");
    expect(body).not.toContain("symlinked core");
  });

  it("treats a missing mandate as optional, not an error — asks instead of failing (read-only safe)", () => {
    const body = render(sample);
    expect(body).toContain("ask the user what they need");
    expect(body).toContain("that's not an error");
    // must NOT instruct a (read-only) persona to write a file it can't, nor present the path as broken
    expect(body).not.toContain("write that mandate");
    expect(body).not.toContain("does not exist yet, that is your first task");
  });

  it("keeps the per-project job path project-relative — the same path the subagent names", () => {
    expect(render(sample)).toContain(`.truecast/agents/${sample}/instance/mandate.md`);
    expect(render(sample, TRUECAST_HOME_PLACEHOLDER)).toContain(
      `.truecast/agents/${sample}/instance/mandate.md`,
    );
  });

  it("leaks no machine-local absolute path into any persona's plugin body", () => {
    for (const name of personaNames) {
      const body = render(name);
      expect(body, `${name} leaks /home`).not.toMatch(/\/home\//);
      expect(body, `${name} leaks /Users`).not.toMatch(/\/Users\//);
      expect(body, `${name} leaks $HOME`).not.toContain("$HOME");
      expect(body, `${name} leaks a Windows drive path`).not.toMatch(/[A-Za-z]:\\/);
    }
  });
});
