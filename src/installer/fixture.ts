import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { planPublish } from "../publish/index.js";

/**
 * Test support for the installer lane — NOT a test file. Everything here is hermetic: a `mkdtemp` home
 * and a `mkdtemp` marketplace clone. Nothing in this module may read the real home (T-H1 scans it).
 */

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** The script under test, inside the REAL repo (which is itself a valid marketplace clone). */
export const realScript = join(repoRoot, "plugin", "truecast", "bin", "truecast-plugin.sh");

/** Is `bash` usable here? The lane is POSIX-only by design — skip, don't fail, where it isn't. */
export function hasBash(): boolean {
  const r = spawnSync("bash", ["-c", "exit 0"], { encoding: "utf8" });
  return r.status === 0;
}

export interface FakeHome {
  /** The fake `$HOME`. */
  home: string;
  truecastHome: string;
  claudeHome: string;
  /** The env every script run gets — no inherited HOME, ever. */
  env: NodeJS.ProcessEnv;
}

export function makeHome(prefix = "tc-plugin-"): FakeHome {
  const home = mkdtempSync(join(tmpdir(), prefix));
  const truecastHome = join(home, ".truecast");
  const claudeHome = join(home, ".claude");
  mkdirSync(join(home, "tmp"), { recursive: true }); // the script's scratch, inside the fake home
  return {
    home,
    truecastHome,
    claudeHome,
    env: {
      HOME: home,
      TRUECAST_HOME: truecastHome,
      CLAUDE_HOME: claudeHome,
      PATH: process.env.PATH ?? "/usr/bin:/bin",
      TMPDIR: join(home, "tmp"),
    },
  };
}

export interface FixturePersona {
  name: string;
  version: string;
  skills?: string[];
  tools?: string[];
  description?: string;
}

/**
 * A synthetic marketplace clone: a copy of the hand-authored `plugin/` dir plus tiny generated personas.
 * Built with the REAL `planPublish`, so the `subagent.md` the script consumes is the same artifact
 * `truecast publish` commits — the fixture can never drift from the generator.
 */
export function makeClone(personas: FixturePersona[], prefix = "tc-clone-"): string {
  const clone = mkdtempSync(join(tmpdir(), prefix));
  writeFileSync(
    join(clone, "package.json"),
    `${JSON.stringify(
      {
        // the marketplace handle comes from the repo name — the script verifies it is `truecast`
        name: "@fixture/truecast",
        author: "Fixture Owner",
        repository: { url: "git+https://github.com/fixture/truecast.git" },
        license: "MIT",
      },
      null,
      2,
    )}\n`,
  );
  // the installer plugin rides along as a read input — copy it before planning so publish sees it
  cpSync(join(repoRoot, "plugin"), join(clone, "plugin"), { recursive: true });
  for (const p of personas) writePersonaSource(clone, p);
  writePlan(clone);
  return clone;
}

/** Write (or rewrite, to bump a version) one persona's source under `<clone>/personas/<name>`. */
export function writePersonaSource(clone: string, p: FixturePersona): void {
  const core = join(clone, "personas", p.name, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), `# ${p.name}\n\nYou are the ${p.name}.\n`);
  const skills = p.skills ?? ["do-the-thing"];
  for (const s of skills) {
    mkdirSync(join(core, "skills", s), { recursive: true });
    writeFileSync(
      join(core, "skills", s, "SKILL.md"),
      `---\nname: ${s}\ndescription: Use this to ${s}.\n---\n\nHow to ${s}.\n`,
    );
  }
  writeFileSync(
    join(core, "persona.toml"),
    [
      `name = "${p.name}"`,
      `version = "${p.version}"`,
      `description = "${p.description ?? `A ${p.name} who does the job.`}"`,
      `identity = "agent.md"`,
      `skills = [${skills.map((s) => `"skills/${s}/SKILL.md"`).join(", ")}]`,
      `tools = [${(p.tools ?? ["Read", "Grep"]).map((t) => `"${t}"`).join(", ")}]`,
      "",
    ].join("\n"),
  );
  mkdirSync(join(clone, "personas", p.name, "instance-template"), { recursive: true });
  writeFileSync(
    join(clone, "personas", p.name, "instance-template", "mandate.md"),
    `# Mandate — ${p.name}\n\nWhat ${p.name} should do in this repo.\n`,
  );
}

/** (Re)generate the clone's committed plugin surface — the same files `truecast publish` writes. */
export function writePlan(clone: string): void {
  for (const f of planPublish({ repoRoot: clone }).files) {
    const abs = join(clone, f.path);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, f.content);
  }
}

export interface ScriptRun {
  status: number;
  stdout: string;
  stderr: string;
  /** The parsed `TRUECAST_RESULT` line, or null if the run printed none. */
  result: Record<string, string> | null;
}

/** Run the installer script from `clone`, against `env`. Never inherits the caller's environment. */
export function runScript(
  clone: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  opts: { cwd?: string } = {},
): ScriptRun {
  const script = join(clone, "plugin", "truecast", "bin", "truecast-plugin.sh");
  const r = spawnSync("bash", [script, ...args], {
    env: env as NodeJS.ProcessEnv,
    cwd: opts.cwd ?? clone,
    encoding: "utf8",
  });
  const stdout = r.stdout ?? "";
  return { status: r.status ?? -1, stdout, stderr: r.stderr ?? "", result: parseResult(stdout) };
}

/** The contract the slash commands read: the LAST line of stdout, or nothing. */
export function parseResult(stdout: string): Record<string, string> | null {
  const lines = stdout.trimEnd().split("\n");
  const last = lines[lines.length - 1] ?? "";
  const prefix = "TRUECAST_RESULT ";
  if (!last.startsWith(prefix)) return null;
  const out: Record<string, string> = {};
  for (const pair of last.slice(prefix.length).split(" ")) {
    const eq = pair.indexOf("=");
    if (eq > 0) out[pair.slice(0, eq)] = pair.slice(eq + 1);
  }
  return out;
}
