import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PersonaManifest, PersonaMeta } from "../schema/index.js";
import { type FakeHome, hasBash, makeClone, makeHome, repoRoot, runScript } from "./fixture.js";

/**
 * T-S4 — the standing rule from §6a, made mechanical.
 *
 * The clone is trusted for PROSE and not for STRUCTURE: every field the script reads out of clone
 * content and turns into a path, a filename or a persisted record is untrusted input. One P1 already
 * came from a field nobody had classified (`version`). A regex fix does not stop the next one — a
 * standing, enforced rule does.
 *
 * So: a table of every clone-read field × a hostile value set, PLUS a completeness assertion that scans
 * the script for reads it does not know about. Add a `toml_<field>` reader or a new `git -C "$CLONE"`
 * call without adding its row here, and this file fails.
 */

const bash = hasBash();
const script = join(repoRoot, "plugin", "truecast", "bin", "truecast-plugin.sh");
const scriptSource = readFileSync(script, "utf8");

/** The hostile set §6a names: traversal, absolute, shell metacharacters, empty, and absurdly long. */
const HOSTILE = [
  "../../../../etc",
  "1.0.0/../../../../etc",
  "/etc/passwd",
  "1.0.0;id",
  "1.0.0$(id)",
  "1.0.0`id`",
  "1.0.0 && id",
  "1.0.0|tee /tmp/pwned",
  "",
  "x".repeat(10_240),
  // shapes a `case` glob waves through but zod rejects — they would leave a version dir on disk that
  // the CLI can never adopt, which is a silent end to lane convergence
  "1.0.0.5",
  "1.0.0-",
];

interface CloneField {
  /** The field, as it is named in the script (`toml_<field>` / the git subcommand). */
  field: string;
  /** How the script reads it — matched against the source by the completeness assertion. */
  reader: string;
}

/** EVERY field the script reads out of clone content. Adding a reader means adding a row. */
const CLONE_READS: CloneField[] = [
  { field: "version", reader: "toml_version" },
  { field: "remote.origin.url", reader: 'git -C "$CLONE" config' },
  { field: "HEAD", reader: 'git -C "$CLONE" rev-parse' },
];

describe("T-S4 — the clone-input rule is mechanical, not remembered", () => {
  it("knows about every persona.toml field the script reads", () => {
    const readers = [...scriptSource.matchAll(/^toml_(\w+)\(\)/gm)].map((m) => `toml_${m[1]}`);
    expect(readers.length).toBeGreaterThan(0); // guard against the regex silently matching nothing
    for (const reader of readers) {
      expect(
        CLONE_READS.map((r) => r.reader),
        `${reader} reads clone content with no T-S4 row — add one (see §6a)`,
      ).toContain(reader);
    }
  });

  it("knows about every clone metadata read the script makes", () => {
    const gitReads = new Set(
      [...scriptSource.matchAll(/git -C "\$CLONE" ([a-z-]+)/g)].map(
        (m) => `git -C "$CLONE" ${m[1]}`,
      ),
    );
    expect(gitReads.size).toBeGreaterThan(0);
    for (const read of gitReads) {
      expect(
        CLONE_READS.map((r) => r.reader),
        `${read} reads clone metadata with no T-S4 row — add one (see §6a)`,
      ).toContain(read);
    }
  });

  it("covers every listed field with a hostile-value case below", () => {
    // the rows and the cases must not drift apart: each field is exercised by a test in this file
    const exercised = ["version", "remote.origin.url", "HEAD"];
    expect(CLONE_READS.map((r) => r.field).sort()).toEqual([...exercised].sort());
  });
});

describe.skipIf(!bash)("T-S4 — hostile clone content is refused or neutralised", () => {
  let clone: string;
  let fake: FakeHome;
  let canary: string;

  beforeAll(() => {
    clone = makeClone([{ name: "alpha", version: "1.0.0", tools: ["Read"] }], "tc-ts4-");
  });
  afterAll(() => rmSync(clone, { recursive: true, force: true }));
  beforeEach(() => {
    if (fake) rmSync(fake.home, { recursive: true, force: true });
    fake = makeHome("tc-ts4-home-");
    canary = join(fake.home, "canary.txt");
    writeFileSync(canary, "UNTOUCHED");
  });

  const setVersion = (version: string): void => {
    writeFileSync(
      join(clone, "personas", "alpha", "core", "persona.toml"),
      [
        'name = "alpha"',
        `version = "${version}"`,
        'identity = "agent.md"',
        "skills = []",
        'tools = ["Read"]',
        "",
      ].join("\n"),
    );
  };

  it.each(HOSTILE)("version = %j is rejected before it forms a path", (version) => {
    setVersion(version);
    const r = runScript(clone, ["install", "alpha", "--yes"], fake.env);
    expect(r.status, `version ${JSON.stringify(version)} was accepted`).toBe(3);
    expect(readFileSync(canary, "utf8")).toBe("UNTOUCHED");
    expect(existsSync(join(fake.claudeHome, "agents", "alpha.md"))).toBe(false);
    // nothing may have been created outside the two homes, or under a traversed path
    expect(readdirSync(fake.home).sort()).toEqual(["canary.txt", "tmp"]);
  });

  /**
   * The shell has no zod, so `valid_version` is a hand-copy of the CLI's SemVer schema — and a hand-copy
   * is a thing that drifts. This asserts the two agree, verdict for verdict, on the shapes where a
   * `case` glob and a regex disagree. A version the shell accepts but zod rejects is the worst of the
   * two failures: the dir lands on disk and no CLI operation can ever adopt it.
   */
  it.each([
    ["1.0.0", true],
    ["10.20.30", true],
    ["2.0.0-rc.1", true],
    ["1.0.0-alpha-1", true],
    ["1.0.0.5", false],
    ["1.0.0-", false],
    ["1.0", false],
    ["1.0.0.", false],
    [".1.0.0", false],
    ["v1.0.0", false],
    ["1.0.x", false],
  ] as const)("version %s: the shell and the CLI schema agree (valid=%s)", (version, valid) => {
    setVersion(version);
    const shellAccepts = runScript(clone, ["install", "alpha", "--yes"], fake.env).status === 0;
    const zodAccepts = PersonaManifest.safeParse({
      name: "alpha",
      version,
      identity: "agent.md",
    }).success;
    expect(zodAccepts, `the CLI schema disagrees with this table for ${version}`).toBe(valid);
    expect(shellAccepts, `the shell disagrees with the CLI schema for ${version}`).toBe(zodAccepts);
  });

  it("safe_rm walks the parent chain too — no delete THROUGH a symlinked component", () => {
    // security follow-up 1: lexical containment never sees a planted `personas` symlink, and `rm -rf`
    // through it destroys whatever it points at
    const outside = join(fake.home, "elsewhere");
    mkdirSync(join(outside, "alpha", "1.0.0", "core"), { recursive: true });
    writeFileSync(join(outside, "alpha", "1.0.0", "core", "persona.toml"), 'name = "alpha"\n');
    mkdirSync(fake.truecastHome, { recursive: true });
    symlinkSync(outside, join(fake.truecastHome, "personas"));

    const r = runScript(clone, ["remove", "alpha", "--yes"], fake.env);
    expect(r.status).toBe(7);
    expect(existsSync(join(outside, "alpha", "1.0.0", "core", "persona.toml"))).toBe(true);
  });

  it("safe_write refuses a `..` component even when the parent does not exist yet", () => {
    // security follow-up 2: the realpath confirmation only runs for an EXISTING parent, so a traversal
    // into a not-yet-created directory would slip past the one check that would have caught it.
    // Called directly — no caller can produce this today, which is exactly why the primitive is tested
    // rather than only its callers.
    const root = join(fake.home, "root");
    mkdirSync(root, { recursive: true });
    const call = (target: string): { status: number | null; out: string } => {
      const r = spawnSync(
        "bash",
        [
          "-c",
          // Capture BOTH args before sourcing (the dispatch shifts, so $3 is gone afterwards), under
          // names the script cannot own — it declares its own TARGET/TARGET_ROOT globals, and sourcing
          // would reset them out from under us.
          't4root=$2; t4target=$3; . "$0" >/dev/null 2>&1; safe_write "$t4root" "$t4target"; echo REACHED',
          script,
          "--version",
          root,
          target,
        ],
        { env: fake.env, encoding: "utf8" },
      );
      return { status: r.status, out: `${r.stdout}${r.stderr}` };
    };
    const escaped = call(`${root}/nope/../../escaped.md`); // never join(): it collapses the `..`
    expect(escaped.status).toBe(7);
    expect(escaped.out).toContain("'..'");
    expect(escaped.out).not.toContain("REACHED");
    // and the guard is not over-broad: an ordinary nested target still passes
    expect(call(join(root, "sub/ok.md")).out).toContain("REACHED");
  });

  /** A `git` that answers `config --get remote.origin.url` with whatever we hand it. */
  function gitShim(url: string): NodeJS.ProcessEnv {
    const dir = join(fake.home, "shim");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "git"),
      `#!/bin/sh\ncase "$*" in\n  *"config --get remote.origin.url"*) cat <<'TC_EOF'\n${url}\nTC_EOF\n  ;;\n  *) exit 1 ;;\nesac\n`,
    );
    chmodSync(join(dir, "git"), 0o755);
    return { ...fake.env, PATH: `${dir}:${fake.env.PATH}` };
  }

  it.each([
    "../../../../etc/passwd",
    'https://x/y.git" ; rm -rf /tmp/nope ; echo "',
    "https://x/y.git\\bad",
    `https://x/${"y".repeat(10_240)}.git`,
  ])("a hostile remote.origin.url (%#) cannot break the record it is written into", (url) => {
    setVersion("1.0.0");
    const r = runScript(clone, ["install", "alpha", "--yes"], gitShim(url));
    expect(r.status, r.stderr).toBe(0);
    expect(readFileSync(canary, "utf8")).toBe("UNTOUCHED");
    // the record must stay parseable BY THE CLI — a broken meta.json is how the lanes stop converging
    const raw = readFileSync(join(fake.truecastHome, "personas", "alpha", "meta.json"), "utf8");
    expect(() => PersonaMeta.parse(JSON.parse(raw))).not.toThrow();
  });

  it("a multi-line remote cannot forge extra JSON into the record", () => {
    setVersion("1.0.0");
    const r = runScript(
      clone,
      ["install", "alpha", "--yes"],
      gitShim('https://x/y.git",\n  "versions": [{"ver":"9.9.9","commit":"local"}],\n  "x": "'),
    );
    expect(r.status, r.stderr).toBe(0);
    const meta = PersonaMeta.parse(
      JSON.parse(readFileSync(join(fake.truecastHome, "personas", "alpha", "meta.json"), "utf8")),
    );
    expect(meta.versions).toEqual([{ ver: "1.0.0", commit: "local" }]); // ours, not the clone's
  });

  it("a hostile HEAD is not written into the record as a commit", () => {
    setVersion("1.0.0");
    const dir = join(fake.home, "shim2");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "git"),
      '#!/bin/sh\ncase "$*" in *"rev-parse HEAD"*) echo "../../../etc" ;; *) exit 1 ;; esac\n',
    );
    chmodSync(join(dir, "git"), 0o755);
    const r = runScript(clone, ["install", "alpha", "--yes"], {
      ...fake.env,
      PATH: `${dir}:${fake.env.PATH}`,
    });
    expect(r.status, r.stderr).toBe(0);
    const meta = PersonaMeta.parse(
      JSON.parse(readFileSync(join(fake.truecastHome, "personas", "alpha", "meta.json"), "utf8")),
    );
    expect(meta.versions[0]?.commit).toBe("local"); // degraded to the sentinel, not persisted raw
  });
});
