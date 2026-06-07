import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPersona } from "../persona/index.js";
import { ENGINE_PRINCIPLES, renderSystemPrompt } from "./index.js";

/**
 * The engine owns the universal operating principles: EVERY persona's rendered prompt must carry them,
 * regardless of what the publisher put in `core/` or the user put in `mandate.md`. This is the seam —
 * if a future change lets a persona render without them, that's a regression this test catches.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const personasDir = join(repoRoot, "personas");

const personaNames = readdirSync(personasDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

describe("engine principles — conformance across every shipped persona", () => {
  it("ships at least the full roster", () => {
    // guard against the glob silently finding nothing (which would make the loop below vacuously pass)
    expect(personaNames.length).toBeGreaterThanOrEqual(9);
  });

  it.each(personaNames)("%s renders with the engine principles block", (name) => {
    const persona = loadPersona(join(personasDir, name));
    const prompt = renderSystemPrompt(
      { name, version: persona.manifest.version, coreDir: persona.coreDir },
      persona,
    );
    expect(prompt).toContain(ENGINE_PRINCIPLES);
  });

  it("injects principles independent of persona content (publisher cannot omit them)", () => {
    const persona = loadPersona(join(personasDir, personaNames[0]));
    const prompt = renderSystemPrompt(
      { name: personaNames[0], version: persona.manifest.version, coreDir: persona.coreDir },
      persona,
    );
    // the block sits between the persona's craft and the per-project job pointer
    expect(prompt.indexOf(ENGINE_PRINCIPLES)).toBeLessThan(prompt.indexOf("Your job in this project"));
    // and it is behavioral-hygiene only — no project-judgment leaked into the engine layer
    expect(ENGINE_PRINCIPLES).not.toMatch(/north star|out of scope|the bar for this project/i);
  });
});
