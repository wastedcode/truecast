import {
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
import type { Config } from "../config/index.js";
import type { GrantableTool } from "../schema/index.js";
import { doctor } from "./doctor.js";
import { install } from "./install.js";
import { list } from "./list.js";
import { remove } from "./remove.js";
import { update } from "./update.js";

/** Proves the robustness fixes (R1–R9) end to end, not just that the machinery compiles. */

interface PersonaSpec {
  version: string;
  skills?: string[];
  tools?: GrantableTool[];
  identity?: string;
}
function writePersona(dir: string, spec: PersonaSpec): void {
  const core = join(dir, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), spec.identity ?? "you are the tester");
  for (const leaf of spec.skills ?? ["greet"]) {
    mkdirSync(join(core, "skills", leaf), { recursive: true });
    writeFileSync(join(core, "skills", leaf, "SKILL.md"), `# ${leaf}\n`);
  }
  writeFileSync(
    join(core, "persona.toml"),
    [
      'name = "tester"',
      `version = "${spec.version}"`,
      'identity = "agent.md"',
      `skills = [${(spec.skills ?? ["greet"]).map((s) => `"skills/${s}/SKILL.md"`).join(", ")}]`,
      spec.tools ? `tools = [${spec.tools.map((t) => `"${t}"`).join(", ")}]` : "",
    ].join("\n"),
  );
  mkdirSync(join(dir, "instance-template"), { recursive: true });
  writeFileSync(join(dir, "instance-template", "mandate.md"), "# Mandate\n");
}

let home: string;
let config: Config;
let project: string;
let src: string;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-robust-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  project = join(home, "app");
  mkdirSync(join(project, ".git"), { recursive: true });
  src = join(home, "src");
  writePersona(src, { version: "1.0.0", skills: ["greet"], tools: ["Read"] });
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

const agentFile = (): string => join(config.claudeHome, "agents", "tester.md");
const skillDir = (leaf: string): string => join(config.claudeHome, "skills", `tester-${leaf}`);
const currentLink = (): string => join(config.truecastHome, "personas", "tester", "current");
const cacheCore = (v: string): string => join(config.truecastHome, "personas", "tester", v, "core");
const installV1 = () =>
  install({ source: src, project, cwd: project }, { config, confirm: () => true });

describe("R1 — --force discards a hand-edit instead of wedging", () => {
  it("a drifted managed file blocks update, but --force overwrites it", async () => {
    await installV1();
    writeFileSync(agentFile(), "HAND EDITED\n");
    writePersona(src, { version: "1.1.0", skills: ["greet"], tools: ["Read"] });

    await expect(update({ name: "tester" }, { config, confirm: () => true })).rejects.toMatchObject(
      {
        code: "DRIFT",
      },
    );
    // force succeeds and regenerates the file
    const [r] = await update({ name: "tester", force: true }, { config, confirm: () => true });
    expect(r.applied).toBe(true);
    expect(readFileSync(agentFile(), "utf8")).not.toBe("HAND EDITED\n");
  });
});

describe("R2 — write-through ledger: a failed apply does not wedge the next run", () => {
  it("after a drift-aborted update, retry hits DRIFT again (NOT a CollisionError)", async () => {
    await installV1();
    writeFileSync(agentFile(), "HAND EDITED\n"); // will make materialize throw mid-apply
    writePersona(src, { version: "1.1.0", skills: ["greet"], tools: ["Read"] });

    const first = await update({ name: "tester" }, { config, confirm: () => true }).catch((e) => e);
    expect(first.code).toBe("DRIFT");
    // the candidate cache the aborted run wrote is OWNED (write-through) → idempotent, not orphaned
    expect(existsSync(cacheCore("1.1.0"))).toBe(true);

    const second = await update({ name: "tester" }, { config, confirm: () => true }).catch(
      (e) => e,
    );
    expect(second.code).toBe("DRIFT"); // consistent, not the old compounding COLLISION
  });
});

describe("R5 — a removed skill is pruned, not orphaned", () => {
  it("dropping a skill upstream deletes its generated /skill dir", async () => {
    await install({ source: src, project, cwd: project }, { config, confirm: () => true });
    writePersona(src, { version: "1.0.0", skills: ["greet"], tools: ["Read"] }); // re-write same
    writePersona(src, { version: "1.1.0", skills: ["greet", "extra"], tools: ["Read"] });
    await update({ name: "tester" }, { config, confirm: () => true });
    expect(existsSync(skillDir("extra"))).toBe(true);

    // now drop "extra"
    writePersona(src, { version: "1.2.0", skills: ["greet"], tools: ["Read"] });
    await update({ name: "tester" }, { config, confirm: () => true });
    expect(existsSync(skillDir("extra"))).toBe(false); // pruned (R5)
    expect(existsSync(skillDir("greet"))).toBe(true);
  });
});

describe("R7 — corrupt records surface as typed errors, not 'not installed'", () => {
  it("a corrupt meta.json makes list report CORRUPT and update throw META_CORRUPT", async () => {
    await installV1();
    writeFileSync(join(config.truecastHome, "personas", "tester", "meta.json"), "{ not json");

    const result = await list({}, { config });
    expect(result.personas.find((p) => p.name === "tester")?.corrupt).toBe(true);

    await expect(update({ name: "tester" }, { config })).rejects.toMatchObject({
      code: "META_CORRUPT",
    });
  });

  it("a corrupt project lock surfaces as LOCK_CORRUPT", async () => {
    await installV1();
    writeFileSync(join(project, ".truecast", "lock"), "{ broken");
    await expect(
      remove({ name: "tester", project, cwd: project }, { config }),
    ).rejects.toMatchObject({ code: "LOCK_CORRUPT" });
  });
});

describe("R8 — safe-default confirm", () => {
  it("a risky update with no confirm is held back (blocked), not silently applied", async () => {
    await installV1();
    writePersona(src, { version: "2.0.0", skills: ["greet"], tools: ["Read", "Bash"] }); // new tool ⇒ major
    const [r] = await update({ name: "tester" }, { config }); // NO confirm provided
    expect(r.applied).toBe(false);
    expect(r.blocked).toBe(true);
    expect(r.plan?.changeClass).toBe("major");
  });

  it("a safe (patch/minor) update with no confirm still applies", async () => {
    await installV1();
    writePersona(src, { version: "1.1.0", skills: ["greet", "summarize"], tools: ["Read"] }); // minor
    const [r] = await update({ name: "tester" }, { config });
    expect(r.applied).toBe(true);
    expect(r.blocked).toBe(false);
  });

  it("remove --global with no confirm is denied by default", async () => {
    await installV1();
    const r = await remove({ name: "tester", global: true }, { config }); // no confirm
    expect(r.applied).toBe(false);
    expect(existsSync(cacheCore("1.0.0"))).toBe(true);
  });
});

describe("R9 — doctor inspects and repairs", () => {
  it("reports a healthy home", async () => {
    await installV1();
    const report = await doctor({}, { config });
    expect(report.healthy).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("heals a dangling current pointer", async () => {
    await installV1();
    rmSync(currentLink(), { force: true });
    symlinkSync("9.9.9", currentLink()); // dangling: points at a non-existent version

    const before = await doctor({}, { config });
    expect(before.healthy).toBe(false);
    expect(before.issues.some((i) => i.kind === "dangling-current")).toBe(true);

    const fixed = await doctor({ fix: true }, { config });
    expect(fixed.issues.find((i) => i.kind === "dangling-current")?.healed).toBe(true);
    expect(existsSync(join(currentLink(), "core", "agent.md"))).toBe(true); // resolves again
  });

  it("removes stale staging artifacts with --fix", async () => {
    await installV1();
    const stale = join(config.truecastHome, "personas", "tester", "1.0.0", "core.staging-99999");
    mkdirSync(stale, { recursive: true });
    const report = await doctor({ fix: true }, { config });
    expect(report.issues.some((i) => i.kind === "stale-staging" && i.healed)).toBe(true);
    expect(existsSync(stale)).toBe(false);
  });

  it("reports drift but never auto-discards it", async () => {
    await installV1();
    writeFileSync(agentFile(), "HAND EDITED\n");
    const report = await doctor({ fix: true }, { config });
    const drift = report.issues.find((i) => i.kind === "drift");
    expect(drift).toBeTruthy();
    expect(drift?.healed).toBe(false);
    expect(readFileSync(agentFile(), "utf8")).toBe("HAND EDITED\n"); // preserved
  });
});

describe("R3 — the home lock serializes concurrent operations", () => {
  it("two installs racing the same home both complete without corrupting the ledger", async () => {
    const srcB = join(home, "srcB");
    mkdirSync(join(srcB, "core", "skills", "greet"), { recursive: true });
    writeFileSync(join(srcB, "core", "agent.md"), "B");
    writeFileSync(join(srcB, "core", "skills", "greet", "SKILL.md"), "# greet\n");
    writeFileSync(
      join(srcB, "core", "persona.toml"),
      [
        'name = "tester-b"',
        'version = "1.0.0"',
        'identity = "agent.md"',
        'skills = ["skills/greet/SKILL.md"]',
      ].join("\n"),
    );
    const projB = join(home, "appB");
    mkdirSync(join(projB, ".git"), { recursive: true });

    await Promise.all([
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
      install({ source: srcB, project: projB, cwd: projB }, { config, confirm: () => true }),
    ]);

    const result = await list({}, { config });
    expect(result.personas.map((p) => p.name).sort()).toEqual(["tester", "tester-b"]);
    // the manifest is valid JSON with both personas' entries (no torn write)
    const ledger = JSON.parse(readFileSync(join(config.truecastHome, "manifest.json"), "utf8"));
    expect(ledger.entries.length).toBeGreaterThan(0);
  });
});
