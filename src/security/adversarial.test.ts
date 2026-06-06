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
import { install } from "../api/install.js";
import { update } from "../api/update.js";
import type { Config } from "../config/index.js";
import { loadPersona } from "../persona/index.js";
import { removeContained } from "../safety/index.js";

/**
 * The end-to-end adversarial proof (ticket T12). Unit tests cover each guard in isolation; here we
 * build HOSTILE personas on disk and assert the full pipeline (parse → fetch → load → cache → install)
 * refuses them. Maps 1:1 to internal/eng/threat-model.md.
 */

let home: string;
let config: Config;
let project: string;

/** Write a persona core with a custom persona.toml body + arbitrary extra files/symlinks. */
function hostileCore(dir: string, tomlBody: string, build?: (core: string) => void): string {
  const core = join(dir, "core");
  mkdirSync(core, { recursive: true });
  writeFileSync(join(core, "agent.md"), "you are evil");
  writeFileSync(join(core, "persona.toml"), tomlBody);
  build?.(core);
  return dir;
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "tc-adv-"));
  config = {
    truecastHome: join(home, ".truecast"),
    claudeHome: join(home, ".claude"),
    tmpRoot: home,
  };
  project = join(home, "myapp");
  mkdirSync(join(project, ".git"), { recursive: true });
});
afterEach(() => rmSync(home, { recursive: true, force: true }));

const baseToml = (extra: string): string =>
  ['name = "evil"', 'version = "1.0.0"', 'identity = "agent.md"', extra].join("\n");

describe("adversarial — escaping the managed roots", () => {
  it("T1: zip-slip in a manifest path is rejected end-to-end", async () => {
    const src = hostileCore(join(home, "t1"), baseToml('knowledge = ["../../../../etc/passwd"]'));
    await expect(
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
    ).rejects.toThrow();
  });

  it("T2: an absolute path in a manifest is rejected", async () => {
    const src = hostileCore(join(home, "t2"), baseToml('knowledge = ["/etc/shadow"]'));
    await expect(
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
    ).rejects.toThrow();
  });

  it("T3: a manifest pointing at a symlink-out-of-core is rejected (no-follow lstat)", () => {
    const src = hostileCore(join(home, "t3"), baseToml('knowledge = ["secret.md"]'), (core) => {
      symlinkSync("/etc/hostname", join(core, "secret.md")); // referenced file IS a symlink
    });
    expect(() => loadPersona(src)).toThrow(/symlink/i);
  });

  it("T4: a symlink smuggled in core/ (not in the manifest) is rejected while caching", async () => {
    const src = hostileCore(join(home, "t4"), baseToml("knowledge = []"), (core) => {
      mkdirSync(join(core, "skills", "x"), { recursive: true });
      symlinkSync("/etc/passwd", join(core, "skills", "x", "leak.md")); // smuggled, unreferenced
    });
    await expect(
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
    ).rejects.toThrow(/symlink/i);
  });

  it("T5: removeContained refuses to delete through a symlink escaping its base", () => {
    const base = join(home, "base");
    const outside = join(home, "outside");
    mkdirSync(base, { recursive: true });
    mkdirSync(outside, { recursive: true });
    writeFileSync(join(outside, "important.txt"), "do not delete");
    const escapeLink = join(base, "escape");
    symlinkSync(outside, escapeLink); // a healed/hostile link pointing out of base

    // unlinking the link itself is fine (it lives in base); but the target must survive.
    removeContained(base, escapeLink);
    expect(existsSync(join(outside, "important.txt"))).toBe(true);
  });
});

describe("adversarial — spoofing / injection", () => {
  it("S1: a path-injection persona name is rejected", async () => {
    const src = hostileCore(
      join(home, "s1"),
      ['name = "../evil"', 'version = "1.0.0"', 'identity = "agent.md"'].join("\n"),
    );
    await expect(
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
    ).rejects.toThrow();
  });

  it("S2: update refuses when the source's identity (name) changed (RR7)", async () => {
    // install a legit persona named "good"
    const good = hostileCore(
      join(home, "good"),
      ['name = "good"', 'version = "1.0.0"', 'identity = "agent.md"'].join("\n"),
    );
    await install({ source: good, project, cwd: project }, { config, confirm: () => true });
    // the same source now ships a DIFFERENT identity
    writeFileSync(
      join(good, "core", "persona.toml"),
      ['name = "attacker"', 'version = "2.0.0"', 'identity = "agent.md"'].join("\n"),
    );
    // a single named update fails loudly (the all-personas path instead records per-persona errors).
    await expect(update({ name: "good" }, { config, confirm: () => true })).rejects.toMatchObject({
      code: "NAME_MISMATCH",
    });
    // and update-all records it as a per-persona error rather than aborting the batch (RR7).
    const results = await update({}, { config, confirm: () => true });
    expect(results.find((x) => x.persona === "good")?.error).toMatch(/attacker|name/i);
  });
});

describe("adversarial — clobber protection (B5)", () => {
  it("D1: install refuses to overwrite an existing un-owned ~/.claude agent file", async () => {
    // a pre-existing, truecast-UNMANAGED agent of the same name
    const agent = join(config.claudeHome, "agents", "good.md");
    mkdirSync(join(config.claudeHome, "agents"), { recursive: true });
    writeFileSync(agent, "the user's own subagent");

    const src = hostileCore(
      join(home, "d1"),
      ['name = "good"', 'version = "1.0.0"', 'identity = "agent.md"'].join("\n"),
    );
    await expect(
      install({ source: src, project, cwd: project }, { config, confirm: () => true }),
    ).rejects.toMatchObject({ code: "COLLISION" });
    // the user's file is intact
    expect(readFileSync(agent, "utf8")).toBe("the user's own subagent");
  });
});
