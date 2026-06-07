import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Config } from "../config/index.js";
import { doctor } from "./doctor.js";
import { install } from "./install.js";
import { remove } from "./remove.js";
import { update } from "./update.js";

/**
 * THE CONSENT GUARD-RAIL. Every state-altering verb MUST abstain when consent is denied — there is one
 * `it` per mutating entry point. If you add an altering verb, add a case here; an un-gated verb (one
 * that mutates despite `confirm: () => false`) fails this suite. Read-only verbs (`list`, `prompt`,
 * `doctor` without `--fix`) are intentionally absent.
 */

const deny = () => false; // a confirm that refuses everything

let home: string;
let config: Config;
let project: string;
let src: string;

function writePersona(dir: string, version: string): void {
  const core = join(dir, "core");
  mkdirSync(join(core, "skills", "greet"), { recursive: true });
  writeFileSync(join(core, "agent.md"), "you are the tester");
  writeFileSync(join(core, "skills", "greet", "SKILL.md"), "# greet\n");
  writeFileSync(
    join(core, "persona.toml"),
    [
      'name = "tester"',
      `version = "${version}"`,
      'identity = "agent.md"',
      'skills = ["skills/greet/SKILL.md"]',
    ].join("\n"),
  );
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-consent-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  project = join(home, "app");
  mkdirSync(join(project, ".git"), { recursive: true });
  src = join(home, "src");
  writePersona(src, "1.0.0");
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

const personaDir = join("personas", "tester");
const installed = () => existsSync(join(config.truecastHome, personaDir));
const attached = () => existsSync(join(project, ".truecast", "agents", "tester", "core"));
const approve = () =>
  install({ source: src, project, cwd: project }, { config, confirm: () => true });

describe("consent conformance — denied confirm ⇒ no mutation", () => {
  it("install", async () => {
    const r = await install({ source: src, project, cwd: project }, { config, confirm: deny });
    expect(r.applied).toBe(false);
    expect(installed()).toBe(false); // nothing cached
    expect(existsSync(join(config.claudeHome, "agents", "tester.md"))).toBe(false); // no surface
    expect(attached()).toBe(false); // project untouched
  });

  it("update", async () => {
    await approve();
    writePersona(src, "1.1.0"); // a newer version is available
    const [r] = await update({ name: "tester" }, { config, confirm: deny });
    expect(r.outcome).toBe("blocked");
    expect(existsSync(join(config.truecastHome, personaDir, "1.1.0"))).toBe(false); // not adopted
  });

  it("remove (detach)", async () => {
    await approve();
    const r = await remove({ name: "tester", project, cwd: project }, { config, confirm: deny });
    expect(r.applied).toBe(false);
    expect(attached()).toBe(true); // still attached
  });

  it("remove --global", async () => {
    await approve();
    const r = await remove({ name: "tester", global: true }, { config, confirm: deny });
    expect(r.applied).toBe(false);
    expect(installed()).toBe(true); // still installed
  });

  it("doctor --fix", async () => {
    await approve();
    const current = join(config.truecastHome, personaDir, "current");
    rmSync(current, { force: true });
    symlinkSync("9.9.9", current); // a dangling pointer — a fixable issue
    const report = await doctor({ fix: true }, { config, confirm: deny });
    expect(report.issues.find((i) => i.kind === "dangling-current")?.healed).toBe(false);
  });
});
