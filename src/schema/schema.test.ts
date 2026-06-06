import { describe, expect, it } from "vitest";
import { PersonaManifest, PersonaName } from "./index.js";

describe("PersonaName", () => {
  it("accepts a normal name", () => {
    expect(PersonaName.safeParse("architect").success).toBe(true);
    expect(PersonaName.safeParse("nock-vc").success).toBe(true);
  });
  it("rejects path / injection names", () => {
    for (const bad of ["../x", "a/b", "Arch", "-x", "x".repeat(65), "x y", ".hidden", ""]) {
      expect(PersonaName.safeParse(bad).success).toBe(false);
    }
  });
});

describe("PersonaManifest", () => {
  const base = { name: "architect", version: "1.0.0", identity: "agent.md" };

  it("parses a minimal valid manifest, applying defaults", () => {
    const r = PersonaManifest.parse(base);
    expect(r.skills).toEqual([]);
    expect(r.knowledge).toEqual([]);
  });

  it("rejects a zip-slip path in identity", () => {
    expect(PersonaManifest.safeParse({ ...base, identity: "../../etc/passwd" }).success).toBe(
      false,
    );
    expect(PersonaManifest.safeParse({ ...base, identity: "/abs" }).success).toBe(false);
  });

  it("rejects a zip-slip path in a knowledge entry", () => {
    expect(PersonaManifest.safeParse({ ...base, knowledge: ["ok.md", "../esc.md"] }).success).toBe(
      false,
    );
  });

  it("rejects unknown keys (strict)", () => {
    expect(PersonaManifest.safeParse({ ...base, evil: true }).success).toBe(false);
  });

  it("rejects a non-semver version", () => {
    expect(PersonaManifest.safeParse({ ...base, version: "v1" }).success).toBe(false);
  });
});
