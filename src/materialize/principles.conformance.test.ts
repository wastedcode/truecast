import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPersona } from "../persona/index.js";
import {
  ENGINE_FRONTIER_BAR,
  ENGINE_PRINCIPLES,
  renderSystemPrompt,
  TRUECAST_HOME_PLACEHOLDER,
} from "./index.js";

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
      { kind: "subagent", truecastHome: TRUECAST_HOME_PLACEHOLDER },
    );
    expect(prompt).toContain(ENGINE_PRINCIPLES);
  });

  it.each(personaNames)(
    "%s renders with the frontier bar + carries its beat-the-frontier skill",
    (name) => {
      const persona = loadPersona(join(personasDir, name));
      const prompt = renderSystemPrompt(
        { name, version: persona.manifest.version, coreDir: persona.coreDir },
        persona,
        { kind: "subagent", truecastHome: TRUECAST_HOME_PLACEHOLDER },
      );
      expect(prompt).toContain(ENGINE_FRONTIER_BAR);
      // the engine block points every persona at its role's version of the loop — it must exist
      expect(persona.manifest.skills).toContain("skills/beat-the-frontier/SKILL.md");
      // and sits after the hygiene principles, before the per-project job pointer
      expect(prompt.indexOf(ENGINE_PRINCIPLES)).toBeLessThan(prompt.indexOf(ENGINE_FRONTIER_BAR));
      expect(prompt.indexOf(ENGINE_FRONTIER_BAR)).toBeLessThan(
        prompt.indexOf("Your job in this project"),
      );
    },
  );

  it.each(personaNames)(
    "%s can spawn the fresh-seat judge (Agent granted) and its prompt names the loop's artifacts",
    (name) => {
      const persona = loadPersona(join(personasDir, name));
      // step 4 of the loop is a fresh subagent that can disagree — the persona must be able to spawn one
      expect(persona.manifest.tools).toContain("Agent");
      const prompt = renderSystemPrompt(
        { name, version: persona.manifest.version, coreDir: persona.coreDir },
        persona,
        { kind: "subagent", truecastHome: TRUECAST_HOME_PLACEHOLDER },
      );
      // the loop is a mechanical protocol with required artifacts, not adjectives (founder ruling)
      for (const artifact of ["`frontier.md`", "`plan.md`", "`judge.md`"]) {
        expect(prompt).toContain(artifact);
      }
      // the judge is fresh, never a fork; the hunt fetches a real artifact per leader
      expect(prompt).toMatch(/never a fork/);
      expect(prompt).toMatch(/No leader without a fetched artifact/);
      expect(prompt).toMatch(/SHIP or NOT YET/);
      // the loop's results are a required shape of the hand-off (process rules got skipped in the
      // 2026-11-04 smoke test; output-format rules held 6/6 in the fair test)
      expect(prompt).toContain("## Your hand-off has a required shape");
      for (const section of ["## Frontier\n", "## Judge\n", "## Frontier check\n"]) {
        expect(prompt).toContain(section);
      }
      expect(prompt).toMatch(/checked against the transcript/);
    },
  );

  it("injects principles independent of persona content (publisher cannot omit them)", () => {
    const persona = loadPersona(join(personasDir, personaNames[0]));
    const prompt = renderSystemPrompt(
      { name: personaNames[0], version: persona.manifest.version, coreDir: persona.coreDir },
      persona,
      { kind: "subagent", truecastHome: TRUECAST_HOME_PLACEHOLDER },
    );
    // the block sits between the persona's craft and the per-project job pointer
    expect(prompt.indexOf(ENGINE_PRINCIPLES)).toBeLessThan(
      prompt.indexOf("Your job in this project"),
    );
    // and it is behavioral-hygiene only — no project-judgment leaked into the engine layer
    expect(ENGINE_PRINCIPLES).not.toMatch(/north star|out of scope|the bar for this project/i);
  });
});
