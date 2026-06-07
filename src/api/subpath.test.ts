import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Config } from "../config/index.js";
import { install } from "./install.js";
import { list } from "./list.js";
import { update } from "./update.js";

/** Install a persona that lives in a SUB-DIRECTORY of a source (monorepo layout): `<repo>#<subpath>`. */

let home: string;
let config: Config;
let project: string;
let repo: string;

/** Write a persona at `<repo>/<sub>/` (so the repo root is NOT itself a persona). */
function writePersonaAt(sub: string, version: string): void {
  const core = join(repo, sub, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), "you are the pm");
  mkdirSync(join(core, "skills", "greet"), { recursive: true });
  writeFileSync(join(core, "skills", "greet", "SKILL.md"), "# greet\n");
  writeFileSync(
    join(core, "persona.toml"),
    [
      'name = "pm"',
      `version = "${version}"`,
      'identity = "agent.md"',
      'skills = ["skills/greet/SKILL.md"]',
    ].join("\n"),
  );
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-subpath-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  project = join(home, "app");
  mkdirSync(join(project, ".git"), { recursive: true });
  repo = join(home, "monorepo");
  writePersonaAt("personas/pm", "1.0.0");
  // a decoy at the repo root proves we load the SUBPATH, not the root
  writeFileSync(join(repo, "README.md"), "this repo root is not a persona");
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

describe("install from a subpath", () => {
  it("installs the persona from <repo>#<subpath>", async () => {
    const result = await install(
      { source: `${repo}#personas/pm`, project, cwd: project },
      { config, confirm: () => true },
    );
    expect(result.applied).toBe(true);
    expect(result.plan.persona).toBe("pm");
    expect(result.plan.source).toBe(`${repo}#personas/pm`); // subpath preserved in the plan
    // cached + surface produced as usual
    expect(
      existsSync(join(config.truecastHome, "personas", "pm", "1.0.0", "core", "agent.md")),
    ).toBe(true);
    expect(existsSync(join(config.claudeHome, "agents", "pm.md"))).toBe(true);
  });

  it("persists the subpath so list + update use it", async () => {
    await install(
      { source: `${repo}#personas/pm`, project, cwd: project },
      { config, confirm: () => true },
    );

    // the stored source (meta) carries the subpath
    const meta = JSON.parse(
      readFileSync(join(config.truecastHome, "personas", "pm", "meta.json"), "utf8"),
    );
    expect(meta.source).toBe(`${repo}#personas/pm`);

    // bump the version IN THE SUBPATH; update must re-fetch the right dir and apply
    writePersonaAt("personas/pm", "1.1.0");
    const [r] = await update({ name: "pm" }, { config, confirm: () => true });
    expect(r.outcome).toBe("applied");
    expect(r.plan?.to).toBe("1.1.0");

    const row = (await list({}, { config })).personas.find((p) => p.name === "pm");
    expect(row?.running).toBe("1.1.0");
  });

  it("refuses a subpath that escapes the source root", async () => {
    await expect(
      install(
        { source: `${repo}#../../etc`, project, cwd: project },
        { config, confirm: () => true },
      ),
    ).rejects.toThrow();
  });

  it("gives a clear error when the subpath has no persona", async () => {
    await expect(
      install(
        { source: `${repo}#personas/nope`, project, cwd: project },
        { config, confirm: () => true },
      ),
    ).rejects.toThrow(/persona\.toml/);
  });
});
