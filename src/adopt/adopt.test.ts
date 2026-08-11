import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { doctor } from "../api/doctor.js";
import { install } from "../api/install.js";
import { remove } from "../api/remove.js";
import { update } from "../api/update.js";
import type { Config } from "../config/index.js";
import { Ledger } from "../ledger/index.js";
import { composeAgentFile } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import { adoptUnledgered, findUnledgered } from "./index.js";

/**
 * D4 — adoption is what makes the two lanes one. These tests drive it from a HAND-FAKED plugin-lane
 * install (the exact on-disk shape `bin/truecast-plugin.sh` produces, minus `owned.json`), so they hold
 * even where bash isn't available and they don't depend on the script's own correctness.
 */

let home: string;
let config: Config;
let src: string;

function writePersona(dir: string, version: string, skills: string[] = ["greet"]): void {
  const core = join(dir, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), "you are the tester");
  for (const leaf of skills) {
    mkdirSync(join(core, "skills", leaf), { recursive: true });
    writeFileSync(join(core, "skills", leaf, "SKILL.md"), `# ${leaf}\n`);
  }
  writeFileSync(
    join(core, "persona.toml"),
    [
      'name = "tester"',
      `version = "${version}"`,
      'identity = "agent.md"',
      `skills = [${skills.map((s) => `"skills/${s}/SKILL.md"`).join(", ")}]`,
      'tools = ["Read"]',
    ].join("\n"),
  );
}

const personaDir = (): string => join(config.truecastHome, "personas", "tester");
const cacheCore = (v: string): string => join(personaDir(), v, "core");
const currentLink = (): string => join(personaDir(), "current");
const metaFile = (): string => join(personaDir(), "meta.json");
const agentFile = (): string => join(config.claudeHome, "agents", "tester.md");

/** The plugin lane's on-disk result: body store + meta + current + agent file, and NO owned.json. */
function fakePluginInstall(version = "1.0.0"): void {
  const persona = loadPersona(src);
  cpSync(join(src, "core"), cacheCore(version), { recursive: true });
  writeFileSync(
    metaFile(),
    `${JSON.stringify({ source: src, versions: [{ ver: version, commit: "local" }] }, null, 2)}\n`,
  );
  rmSync(currentLink(), { force: true });
  symlinkSync(version, currentLink());
  mkdirSync(join(config.claudeHome, "agents"), { recursive: true });
  writeFileSync(
    agentFile(),
    composeAgentFile({ name: "tester", version, coreDir: cacheCore(version) }, persona, {
      kind: "subagent",
      truecastHome: config.truecastHome,
    }),
  );
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-adopt-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  src = join(home, "src");
  writePersona(src, "1.0.0");
  mkdirSync(personaDir(), { recursive: true });
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

const ledgerFor = (): Promise<Ledger> => Ledger.load(config, "tester");

describe("adoptUnledgered — one conservative predicate per managed kind", () => {
  it("T-A1: adopts a cached version dir whose manifest names this persona at this version", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    expect(adoptUnledgered(config, "tester", ledger)).toContain(cacheCore("1.0.0"));
    expect(ledger.owns(cacheCore("1.0.0"))).toBe(true);
    expect(ledger.isDrifted(cacheCore("1.0.0"))).toBe(false); // recorded from the OBSERVED bytes
    expect(ledger.owned().find((e) => e.path === cacheCore("1.0.0"))?.kind).toBe("cache");
  });

  it("T-A1 (negative): a version dir whose manifest disagrees with its path is NOT adopted", async () => {
    fakePluginInstall();
    // the dir says 2.0.0 but the manifest inside still says 1.0.0 ⇒ unattributable
    cpSync(cacheCore("1.0.0"), cacheCore("2.0.0"), { recursive: true });
    const ledger = await ledgerFor();
    const adopted = adoptUnledgered(config, "tester", ledger);
    expect(adopted).toContain(cacheCore("1.0.0"));
    expect(adopted).not.toContain(cacheCore("2.0.0"));
    expect(ledger.owns(cacheCore("2.0.0"))).toBe(false);
  });

  it("T-A2: adopts `current` when it points at an attributed version, not otherwise", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    adoptUnledgered(config, "tester", ledger);
    const entry = ledger.owned().find((e) => e.path === currentLink());
    expect(entry?.kind).toBe("symlink");

    // a pointer to a version we cannot attribute is left alone
    const other = mkdtempSync(join(tmpdir(), "tc-adopt-other-"));
    try {
      rmSync(join(home, ".truecast", "personas", "ghost"), { recursive: true, force: true });
      mkdirSync(join(config.truecastHome, "personas", "ghost"), { recursive: true });
      symlinkSync("9.9.9", join(config.truecastHome, "personas", "ghost", "current"));
      const gl = await Ledger.load(config, "ghost");
      expect(adoptUnledgered(config, "ghost", gl)).toEqual([]);
    } finally {
      rmSync(other, { recursive: true, force: true });
    }
  });

  it("T-A3: adopts a parseable meta.json; a corrupt one throws (R7) instead of being skipped", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    adoptUnledgered(config, "tester", ledger);
    expect(ledger.owned().find((e) => e.path === metaFile())?.kind).toBe("meta");

    // a corrupt record must stay VISIBLE (R7) — never silently skipped into a later CollisionError
    rmSync(join(personaDir(), "owned.json"), { force: true });
    writeFileSync(metaFile(), "{ not json");
    const fresh = await Ledger.load(config, "tester");
    expect(() => adoptUnledgered(config, "tester", fresh)).toThrow(/unreadable/i);
  });

  it("T-A4: adopts a stamped agent file", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    adoptUnledgered(config, "tester", ledger);
    expect(ledger.owned().find((e) => e.path === agentFile())?.kind).toBe("agent");
    expect(ledger.isDrifted(agentFile())).toBe(false);
  });

  it("T-A4 (negative): an UNSTAMPED agent file is never adopted and still collides (B5)", async () => {
    fakePluginInstall();
    writeFileSync(agentFile(), "# my own notes about the tester\n");
    const ledger = await ledgerFor();
    expect(adoptUnledgered(config, "tester", ledger)).not.toContain(agentFile());

    await expect(
      install({ source: src, global: true }, { config, confirm: () => true }),
    ).rejects.toMatchObject({ code: "COLLISION" });
    expect(readFileSync(agentFile(), "utf8")).toBe("# my own notes about the tester\n");
  });

  it("is idempotent — a second pass adopts nothing new", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    expect(adoptUnledgered(config, "tester", ledger).length).toBeGreaterThan(0);
    expect(adoptUnledgered(config, "tester", ledger)).toEqual([]);
  });

  it("findUnledgered is read-only (reports the same paths, records nothing)", async () => {
    fakePluginInstall();
    const ledger = await ledgerFor();
    const found = findUnledgered(config, "tester", ledger);
    expect(found.length).toBeGreaterThan(0);
    expect(ledger.owned()).toEqual([]);
    expect(existsSync(join(personaDir(), "owned.json"))).toBe(false);
  });
});

describe("lane convergence — the CLI can operate on a plugin-lane install", () => {
  it("T-C2: install() over a plugin-lane install applies (no CollisionError, no DriftError)", async () => {
    fakePluginInstall();
    const r = await install({ source: src, global: true }, { config, confirm: () => true });
    expect(r.applied).toBe(true);
    expect(existsSync(join(personaDir(), "owned.json"))).toBe(true);
  });

  it("T-C3: update() to a newer version works on a plugin-lane install", async () => {
    fakePluginInstall();
    writePersona(src, "1.1.0", ["greet", "summarize"]);
    const [r] = await update({ name: "tester" }, { config, confirm: () => true });
    expect(r.outcome).toBe("applied");
    expect(r.plan?.from).toBe("1.0.0");
    expect(r.plan?.to).toBe("1.1.0");
    expect(existsSync(join(personaDir(), "1.1.0", "core", "persona.toml"))).toBe(true);
    expect(readFileSync(agentFile(), "utf8")).toContain("summarize");
  });

  it("T-C5: remove --global purges a plugin-lane install from both homes", async () => {
    fakePluginInstall();
    const r = await remove({ name: "tester", global: true }, { config, confirm: () => true });
    expect(r.applied).toBe(true);
    expect(existsSync(personaDir())).toBe(false);
    expect(existsSync(agentFile())).toBe(false);
  });

  it("T-C6: doctor reports the install as healable `unledgered` — never drift or orphan-cache", async () => {
    fakePluginInstall();
    const before = await doctor({}, { config });
    expect(before.issues.map((i) => i.kind).sort()).toEqual([
      "unledgered",
      "unledgered",
      "unledgered",
      "unledgered",
    ]);
    expect(before.issues.every((i) => i.healable)).toBe(true);

    const fixed = await doctor({ fix: true }, { config });
    expect(fixed.healthy).toBe(true);
    const after = await doctor({}, { config });
    expect(after.issues).toEqual([]);
  });
});
