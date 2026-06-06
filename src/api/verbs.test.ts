import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Config } from "../config/index.js";
import type { GrantableTool } from "../schema/index.js";
import { install } from "./install.js";
import { list } from "./list.js";
import { remove } from "./remove.js";
import { update } from "./update.js";

/** A synthetic, mutable persona source on disk so we can bump versions between installs. */
interface PersonaSpec {
  version: string;
  skills?: string[]; // leaf names → core/skills/<leaf>/SKILL.md
  tools?: GrantableTool[];
  identity?: string;
}
function writePersona(dir: string, spec: PersonaSpec): void {
  const core = join(dir, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), spec.identity ?? "You are the tester persona.");
  const skills = spec.skills ?? ["greet"];
  for (const leaf of skills) {
    mkdirSync(join(core, "skills", leaf), { recursive: true });
    writeFileSync(join(core, "skills", leaf, "SKILL.md"), `# ${leaf}\n`);
  }
  const toml = [
    'name = "tester"',
    `version = "${spec.version}"`,
    'description = "a test persona"',
    'identity = "agent.md"',
    `skills = [${skills.map((s) => `"skills/${s}/SKILL.md"`).join(", ")}]`,
    spec.tools ? `tools = [${spec.tools.map((t) => `"${t}"`).join(", ")}]` : "",
  ].join("\n");
  writeFileSync(join(core, "persona.toml"), toml);
  mkdirSync(join(dir, "instance-template"), { recursive: true });
  writeFileSync(join(dir, "instance-template", "mandate.md"), "# Mandate — tester\n");
}

let home: string;
let config: Config;
let project: string;
let src: string;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-verbs-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  project = join(home, "myapp");
  mkdirSync(join(project, ".git"), { recursive: true });
  src = join(home, "src-persona");
  writePersona(src, { version: "1.0.0", skills: ["greet"], tools: ["Read"] });
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

async function installV1(): Promise<void> {
  await install({ source: src, project, cwd: project }, { config, confirm: () => true });
}

const cacheCore = (ver: string): string =>
  join(config.truecastHome, "personas", "tester", ver, "core");
const currentCore = (): string =>
  join(config.truecastHome, "personas", "tester", "current", "core");
const mandate = (): string =>
  join(project, ".truecast", "agents", "tester", "instance", "mandate.md");

describe("update", () => {
  it("AC-U1: updates to a newer version; tracking project follows; instance untouched", async () => {
    await installV1();
    writeFileSync(mandate(), "# MY JOB\n"); // user edit to instance

    writePersona(src, { version: "1.1.0", skills: ["greet", "summarize"], tools: ["Read"] });
    const [r] = await update({ name: "tester" }, { config, confirm: () => true });

    expect(r.outcome).toBe("applied");
    expect(r.plan?.to).toBe("1.1.0");
    expect(r.plan?.changeClass).toBe("minor"); // a skill was added
    // current re-points; the new skill is materialized; the project resolves it through the symlink
    expect(existsSync(join(currentCore(), "skills", "summarize", "SKILL.md"))).toBe(true);
    expect(existsSync(cacheCore("1.1.0"))).toBe(true);
    expect(readFileSync(mandate(), "utf8")).toBe("# MY JOB\n"); // instance preserved
  });

  it("AC-U2: already latest ⇒ no writes, reports up to date", async () => {
    await installV1();
    const [r] = await update({ name: "tester" }, { config, confirm: () => true });
    expect(r.outcome).toBe("up-to-date");
    expect(existsSync(cacheCore("1.0.0"))).toBe(true);
  });

  it("AC-U3/RR4: a newly granted tool classifies major", async () => {
    await installV1();
    writePersona(src, { version: "1.2.0", skills: ["greet"], tools: ["Read", "Bash"] });
    const [r] = await update({ name: "tester" }, { config, confirm: () => true });
    expect(r.plan?.changeClass).toBe("major");
    expect(r.plan?.toolsAdded).toContain("Bash");
  });

  it("AC-U3: an identity change classifies major and is NOT applied if declined", async () => {
    await installV1();
    writePersona(src, {
      version: "1.3.0",
      skills: ["greet"],
      tools: ["Read"],
      identity: "You are a RADICALLY different persona.",
    });
    const [r] = await update({ name: "tester" }, { config, confirm: () => false });
    expect(r.plan?.changeClass).toBe("major");
    expect(r.outcome).toBe("blocked");
    expect(existsSync(cacheCore("1.3.0"))).toBe(false); // declined ⇒ nothing cached/promoted
  });

  it("a candidate older than what runs is flagged as a downgrade", async () => {
    await installV1();
    writePersona(src, { version: "2.0.0", skills: ["greet"], tools: ["Read"] });
    await update({ name: "tester" }, { config, confirm: () => true }); // now on 2.0.0
    // the source manifest rolls back to an older version → next update is a downgrade
    writePersona(src, { version: "1.0.0", skills: ["greet"], tools: ["Read"] });
    const [r] = await update({ name: "tester" }, { config, confirm: () => true });
    expect(r.plan?.to).toBe("1.0.0");
    expect(r.plan?.downgrade).toBe(true);
  });

  it("AC-U6: --dry-run returns the plan and writes nothing", async () => {
    await installV1();
    writePersona(src, { version: "1.1.0", skills: ["greet", "summarize"], tools: ["Read"] });
    const [r] = await update({ name: "tester", dryRun: true }, { config });
    expect(r.outcome).toBe("dry-run");
    expect(r.plan?.to).toBe("1.1.0");
    expect(existsSync(cacheCore("1.1.0"))).toBe(false); // nothing written
  });

  it("RR7: update unknown persona throws NOT_INSTALLED", async () => {
    await expect(update({ name: "ghost" }, { config })).rejects.toMatchObject({
      code: "NOT_INSTALLED",
    });
  });
});

describe("list", () => {
  it("AC-L1: shows running version + source", async () => {
    await installV1();
    const result = await list({}, { config });
    const row = result.personas.find((p) => p.name === "tester");
    expect(row?.running).toBe("1.0.0");
    expect(row?.broken).toBe(false);
    expect(row?.source).toBe(src);
  });

  it("--project shows attachments + spec", async () => {
    await installV1();
    const result = await list({ project: project, cwd: project }, { config });
    expect(result.project?.attached.find((a) => a.name === "tester")?.spec).toBe("current");
  });

  it("returns empty list when nothing installed", async () => {
    const result = await list({}, { config });
    expect(result.personas).toEqual([]);
  });
});

describe("remove", () => {
  it("AC-R1: detach preserves instance/ and drops the lock entry; cache survives", async () => {
    await installV1();
    writeFileSync(mandate(), "# MY JOB\n");
    const r = await remove({ name: "tester", project, cwd: project }, { config });

    expect(r.scope).toBe("project");
    expect(r.instancePreserved).toBeTruthy();
    expect(readFileSync(mandate(), "utf8")).toBe("# MY JOB\n"); // preserved
    expect(existsSync(join(project, ".truecast", "agents", "tester", "core"))).toBe(false); // detached
    expect(existsSync(cacheCore("1.0.0"))).toBe(true); // global cache untouched
    const lock = JSON.parse(readFileSync(join(project, ".truecast", "lock"), "utf8"));
    expect(lock.personas.tester).toBeUndefined();
  });

  it("AC-R1: --purge deletes instance/ too", async () => {
    await installV1();
    const r = await remove({ name: "tester", project, cwd: project, purge: true }, { config });
    expect(existsSync(join(project, ".truecast", "agents", "tester"))).toBe(false);
    expect(r.instancePreserved).toBeUndefined();
  });

  it("AC-R2: --global cleans cache + surface + meta + ledger (with consent)", async () => {
    await installV1();
    const agent = join(config.claudeHome, "agents", "tester.md");
    expect(existsSync(agent)).toBe(true);

    const r = await remove({ name: "tester", global: true }, { config, confirm: () => true });
    expect(r.scope).toBe("global");
    expect(existsSync(agent)).toBe(false);
    expect(existsSync(join(config.truecastHome, "personas", "tester"))).toBe(false);
    expect(existsSync(join(config.claudeHome, "skills", "tester-greet"))).toBe(false);
    await expect(list({}, { config })).resolves.toMatchObject({ personas: [] });
  });

  it("AC-R2: --global declined ⇒ nothing removed", async () => {
    await installV1();
    const r = await remove({ name: "tester", global: true }, { config, confirm: () => false });
    expect(r.applied).toBe(false);
    expect(existsSync(join(config.truecastHome, "personas", "tester"))).toBe(true);
  });

  it("RR8: remove rejects an invalid persona name", async () => {
    await expect(remove({ name: "../etc", global: true }, { config })).rejects.toThrow();
  });
});
