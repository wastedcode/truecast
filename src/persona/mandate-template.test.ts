import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPersona } from "./index.js";

/**
 * The mandate template is the first file a new user opens, and it is copied verbatim by both lanes
 * (the CLI and `/truecast:install --project`). Its promise that updates leave it alone must name the
 * command the reader actually has — on the plugin lane that is `/truecast:update`, not the CLI.
 */
const personasDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "personas");
const names = readdirSync(personasDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

describe("instance-template/mandate.md", () => {
  it("ships for the full roster (guard against a vacuous pass)", () => {
    expect(names.length).toBeGreaterThanOrEqual(11);
    for (const name of names)
      expect(loadPersona(join(personasDir, name)).instanceTemplate, name).not.toBeNull();
  });

  it.each(names)("%s names both update commands that leave it untouched", (name) => {
    const tpl = loadPersona(join(personasDir, name)).instanceTemplate as string;
    // the guidance blockquote, unwrapped — the line break may fall anywhere inside the sentence
    const guidance = readFileSync(tpl, "utf8")
      .split("\n")
      .filter((l) => l.startsWith("> "))
      .map((l) => l.slice(2))
      .join(" ");
    expect(guidance).toContain(
      "`/truecast:update` (or the `truecast update` CLI) never touches it.",
    );
  });
});
