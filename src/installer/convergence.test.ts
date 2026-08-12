import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { doctor } from "../api/doctor.js";
import { install } from "../api/install.js";
import { remove } from "../api/remove.js";
import { update } from "../api/update.js";
import type { Config } from "../config/index.js";
import { composeAgentFile } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import {
  type FakeHome,
  hasBash,
  makeClone,
  makeHome,
  repoRoot,
  runScript,
  writePersonaSource,
  writePlan,
} from "./fixture.js";

/**
 * The gate that says the two lanes are ONE (driver #2). The risk this feature could not take is two
 * teammates with the same name behaving differently — so T-C1 pins the shell lane's bytes to
 * `composeAgentFile`'s, forever, in CI.
 */

const bash = hasBash();
/** Every shipped persona — the metacharacter sweep must cover the whole catalog, not a sample. */
const personaNames = readdirSync(join(repoRoot, "personas"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();
let fake: FakeHome;
let config: Config;

function fresh(): void {
  if (fake) rmSync(fake.home, { recursive: true, force: true });
  fake = makeHome("tc-converge-");
  config = {
    truecastHome: fake.truecastHome,
    claudeHome: fake.claudeHome,
    tmpRoot: fake.home,
  };
}

describe.skipIf(!bash)("T-C1 — the convergence golden", () => {
  afterEach(() => rmSync(fake.home, { recursive: true, force: true }));

  it.each(["qa", "software-engineer"])(
    "%s: the script writes byte-for-byte what materialize() writes",
    (name) => {
      fresh();
      // the REAL repo is a valid marketplace clone — install from it into the fake home
      const r = runScript(repoRoot, ["install", name, "--yes"], fake.env);
      expect(r.status, r.stderr).toBe(0);
      expect(r.result?.status).toBe("installed");

      const persona = loadPersona(join(repoRoot, "personas", name));
      const expected = composeAgentFile(
        { name, version: persona.manifest.version, coreDir: persona.coreDir },
        persona,
        { kind: "subagent", truecastHome: fake.truecastHome },
      );
      expect(readFileSync(join(fake.claudeHome, "agents", `${name}.md`), "utf8")).toBe(expected);
    },
  );

  it.each(personaNames)(
    "%s: convergence holds for a home containing shell metacharacters",
    (name) => {
      // bash 5.2 turned `patsub_replacement` on by default: a bare `&` in the REPLACEMENT half of
      // ${var//pat/repl} became "the matched text", so a home with an `&` in it left the literal
      // {{TRUECAST_HOME}} in the written file — silently, exit 0, every craft path broken. The `|`
      // and `\` are here because they are what would break a `sed`-based substitution instead.
      fake = makeHome("tc-converge-meta-", "a&b|c\\d");
      try {
        const r = runScript(repoRoot, ["install", name, "--yes"], fake.env);
        expect(r.status, r.stderr).toBe(0);
        const written = readFileSync(join(fake.claudeHome, "agents", `${name}.md`), "utf8");
        expect(written, `${name}: the placeholder survived`).not.toContain("{{TRUECAST_HOME}}");

        const persona = loadPersona(join(repoRoot, "personas", name));
        expect(written).toBe(
          composeAgentFile(
            { name, version: persona.manifest.version, coreDir: persona.coreDir },
            persona,
            { kind: "subagent", truecastHome: fake.truecastHome },
          ),
        );
      } finally {
        rmSync(fake.home, { recursive: true, force: true });
      }
    },
  );

  it("NEW-2: the lanes converge even when the user agents dir is a symlink (dotfiles)", async () => {
    fresh();
    // the CLI permits a symlinked agents dir (write-file-atomic resolves the parent), so the script
    // must too, or the same user gets two different behaviours from the two lanes
    const dotfiles = join(fake.home, "dotfiles", "agents");
    mkdirSync(dotfiles, { recursive: true });
    mkdirSync(fake.claudeHome, { recursive: true });
    symlinkSync(dotfiles, join(fake.claudeHome, "agents"));

    await install(
      { source: join(repoRoot, "personas", "qa"), global: true },
      { config, confirm: () => true },
    );
    const cliBytes = readFileSync(join(dotfiles, "qa.md"), "utf8");

    const r = runScript(repoRoot, ["install", "qa"], fake.env);
    expect(r.status, r.stderr).toBe(0);
    expect(r.result?.status).toBe("up-to-date"); // byte-identical through the symlink
    expect(readFileSync(join(dotfiles, "qa.md"), "utf8")).toBe(cliBytes);
  });

  it("T-C4: after the CLI installs, the script sees byte-identity and reports up-to-date", async () => {
    fresh();
    await install(
      { source: join(repoRoot, "personas", "qa"), global: true },
      { config, confirm: () => true },
    );
    const r = runScript(repoRoot, ["install", "qa"], fake.env);
    expect(r.status, r.stderr).toBe(0);
    expect(r.result?.status).toBe("up-to-date");
    expect(r.result?.drift).toBe("false");
  });
});

describe.skipIf(!bash)("the CLI operates on what the script installed", () => {
  let clone: string;

  beforeAll(() => {
    clone = makeClone([{ name: "alpha", version: "1.0.0", tools: ["Read"] }], "tc-converge-clone-");
  });
  afterAll(() => rmSync(clone, { recursive: true, force: true }));
  afterEach(() => rmSync(fake.home, { recursive: true, force: true }));

  const source = (): string => join(clone, "personas", "alpha");
  const agentFile = (): string => join(fake.claudeHome, "agents", "alpha.md");

  it("T-C2: install() adopts the script's install instead of colliding with it", async () => {
    fresh();
    expect(runScript(clone, ["install", "alpha", "--yes"], fake.env).status).toBe(0);
    const r = await install({ source: source(), global: true }, { config, confirm: () => true });
    expect(r.applied).toBe(true);
    expect(existsSync(join(fake.truecastHome, "personas", "alpha", "owned.json"))).toBe(true);
  });

  it("T-C3: update() takes a script-installed persona to a newer version", async () => {
    fresh();
    // a private clone: this test bumps the version the recorded `source` points at
    const own = makeClone(
      [{ name: "alpha", version: "1.0.0", tools: ["Read"] }],
      "tc-converge-up-",
    );
    try {
      expect(runScript(own, ["install", "alpha", "--yes"], fake.env).status).toBe(0);
      // the script recorded the clone itself as the source (no git remote), so update re-reads it
      const meta = JSON.parse(
        readFileSync(join(fake.truecastHome, "personas", "alpha", "meta.json"), "utf8"),
      );
      expect(meta.source).toBe(`${own}#personas/alpha`);

      writePersonaSource(own, {
        name: "alpha",
        version: "1.2.0",
        skills: ["do-the-thing", "ship"],
      });
      writePlan(own);

      const [r] = await update({ name: "alpha" }, { config, confirm: () => true });
      expect(r.outcome).toBe("applied");
      expect(r.plan?.from).toBe("1.0.0");
      expect(r.plan?.to).toBe("1.2.0");
      expect(readFileSync(agentFile(), "utf8")).toContain("ship");
    } finally {
      rmSync(own, { recursive: true, force: true });
    }
  });

  it("T-C5: remove --global purges the script's install from both homes", async () => {
    fresh();
    expect(runScript(clone, ["install", "alpha", "--yes"], fake.env).status).toBe(0);
    const r = await remove({ name: "alpha", global: true }, { config, confirm: () => true });
    expect(r.applied).toBe(true);
    expect(existsSync(join(fake.truecastHome, "personas", "alpha"))).toBe(false);
    expect(existsSync(agentFile())).toBe(false);
  });

  it("T-C6: doctor sees only adoptable state, and --fix makes the home healthy", async () => {
    fresh();
    expect(runScript(clone, ["install", "alpha", "--yes"], fake.env).status).toBe(0);
    const before = await doctor({}, { config });
    expect(before.issues.every((i) => i.kind === "unledgered" && i.healable)).toBe(true);
    expect(before.issues.length).toBeGreaterThan(0);
    expect((await doctor({ fix: true }, { config })).healthy).toBe(true);
    expect((await doctor({}, { config })).issues).toEqual([]);
  });
});
