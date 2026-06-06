import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseToml } from "smol-toml";
import { describe, expect, it } from "vitest";
import { PersonaManifest } from "./index.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const coreDir = join(repoRoot, "personas", "product-manager", "core");

describe("default persona: product-manager", () => {
  const raw = parseToml(readFileSync(join(coreDir, "persona.toml"), "utf8"));
  const result = PersonaManifest.safeParse(raw);

  it("persona.toml is valid against the schema", () => {
    if (!result.success) console.error(result.error.format());
    expect(result.success).toBe(true);
  });

  it("every file referenced by the manifest exists in core/", () => {
    expect(result.success).toBe(true);
    if (!result.success) return;
    const m = result.data;
    for (const rel of [m.identity, ...m.skills, ...m.knowledge]) {
      expect(existsSync(join(coreDir, rel)), `missing file: ${rel}`).toBe(true);
    }
  });
});
