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
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Marketplace, type PublishPlan, planPublish, settingsSnippet } from "../publish/index.js";
import { publish } from "./publish.js";

/** The generated file at `path`, or fail loudly — avoids non-null assertions on `.find()`. */
function fileAt(plan: PublishPlan, path: string): string {
  const f = plan.files.find((x) => x.path === path);
  if (!f) throw new Error(`no generated file at ${path}`);
  return f.content;
}

// A self-contained fixture repo: two personas + a package.json with a GitHub remote. No network, no
// real Claude Code. Mirrors install.test.ts's temp-dir discipline.
let repo: string;

function writePersona(repo: string, name: string, extra: Partial<{ tools: string }> = {}): void {
  const core = join(repo, "personas", name, "core");
  mkdirSync(join(core, "skills", "do-the-thing"), { recursive: true });
  mkdirSync(join(core, "knowledge"), { recursive: true });
  writeFileSync(
    join(core, "persona.toml"),
    [
      `name = "${name}"`,
      `version = "1.2.3"`,
      `description = "A ${name} who does the job — and delegates the rest."`,
      `identity = "agent.md"`,
      `modelHint = "opus"`,
      `tools = [${extra.tools ?? '"Read", "Grep"'}]`,
      `skills = ["skills/do-the-thing/SKILL.md"]`,
      `knowledge = ["knowledge/ref.md"]`,
    ].join("\n"),
  );
  writeFileSync(join(core, "agent.md"), `# ${name}\n\nYou are the ${name}.\n`);
  writeFileSync(
    join(core, "skills", "do-the-thing", "SKILL.md"),
    `---\nname: do-the-thing\ndescription: Do the thing well.\n---\n\nHow to do the thing.\n`,
  );
  writeFileSync(join(core, "knowledge", "ref.md"), `# Reference\n\nBackground material.\n`);
}

beforeAll(() => {
  repo = mkdtempSync(join(tmpdir(), "tc-publish-"));
  writeFileSync(
    join(repo, "package.json"),
    JSON.stringify({
      name: "@acme/agents",
      author: "Ada Lovelace <ada@example.com>",
      repository: { url: "git+https://github.com/acme/agents.git" },
      homepage: "https://agents.example.com",
      license: "MIT",
    }),
  );
  writePersona(repo, "alpha-agent");
  writePersona(repo, "beta-agent");
});
afterAll(() => rmSync(repo, { recursive: true, force: true }));

describe("planPublish — the pure file plan", () => {
  it("derives the marketplace handle + owner from package.json", () => {
    const plan = planPublish({ repoRoot: repo });
    expect(plan.marketplaceName).toBe("agents"); // repo name from the slug
    expect(plan.repoSlug).toBe("acme/agents");
    expect(plan.personas).toEqual(["alpha-agent", "beta-agent"]); // sorted
  });

  it("emits exactly the intended files per persona + one marketplace.json", () => {
    const plan = planPublish({ repoRoot: repo });
    const paths = plan.files.map((f) => f.path).sort();
    expect(paths).toEqual([
      ".claude-plugin/marketplace.json",
      "personas/alpha-agent/.claude-plugin/plugin.json",
      "personas/alpha-agent/agents/alpha-agent.md",
      "personas/alpha-agent/subagent.md",
      "personas/beta-agent/.claude-plugin/plugin.json",
      "personas/beta-agent/agents/beta-agent.md",
      "personas/beta-agent/subagent.md",
    ]);
  });

  it("marketplace.json round-trips the schema; names are unprefixed; pluginRoot is ./personas", () => {
    const plan = planPublish({ repoRoot: repo });
    const parsed = Marketplace.parse(JSON.parse(fileAt(plan, ".claude-plugin/marketplace.json")));
    expect(parsed.name).toBe("agents");
    expect(parsed.owner.name).toBe("Ada Lovelace");
    expect(parsed.plugins.map((p) => p.name)).toEqual(["alpha-agent", "beta-agent"]);
    expect(parsed.plugins.map((p) => p.source)).toEqual([
      "./personas/alpha-agent",
      "./personas/beta-agent",
    ]);
  });

  it("plugin.json carries the version, a Title-Cased displayName, and a cut listing description", () => {
    const plan = planPublish({ repoRoot: repo });
    const manifest = JSON.parse(fileAt(plan, "personas/alpha-agent/.claude-plugin/plugin.json"));
    expect(manifest.version).toBe("1.2.3");
    expect(manifest.displayName).toBe("Alpha Agent");
    expect(manifest.description).toBe("A alpha-agent who does the job"); // cut at the em-dash
    expect(manifest.author.name).toBe("Ada Lovelace");
    expect(manifest.homepage).toBe("https://agents.example.com"); // from package.json
    expect(manifest.repository).toBe("https://github.com/acme/agents"); // from the slug
    expect(manifest.license).toBe("MIT"); // from package.json
  });

  it("agent body uses the plugin craft root and the missing-mandate-is-optional job prose, carries tools", () => {
    const plan = planPublish({ repoRoot: repo });
    const agent = fileAt(plan, "personas/alpha-agent/agents/alpha-agent.md");
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting the literal token appears in output.
    expect(agent).toContain("${CLAUDE_PLUGIN_ROOT}/core/skills/do-the-thing/SKILL.md");
    expect(agent).toContain("ask the user what they need"); // optional mandate, asks (read-only safe)
    expect(agent).not.toContain("write that mandate"); // never tell a read-only persona to write
    expect(agent).not.toContain("symlinked core");
    expect(agent).toContain("tools: Read, Grep"); // frontmatter least-privilege (security F2)
  });

  it("leaks no machine-local absolute path into any generated file", () => {
    const plan = planPublish({ repoRoot: repo });
    for (const f of plan.files) {
      expect(f.content, `${f.path} leaks /home`).not.toMatch(/\/home\//);
      expect(f.content, `${f.path} leaks /Users`).not.toMatch(/\/Users\//);
      expect(f.content, `${f.path} leaks the tmp repo path`).not.toContain(repo);
      expect(f.path, `${f.path} has a backslash`).not.toContain("\\");
    }
  });

  it("is deterministic — two runs produce byte-identical output", () => {
    const a = planPublish({ repoRoot: repo });
    const b = planPublish({ repoRoot: repo });
    expect(a.files).toEqual(b.files);
  });

  it("fail-fast: a persona that fails to load aborts the whole plan", () => {
    const bad = mkdtempSync(join(tmpdir(), "tc-publish-bad-"));
    try {
      writeFileSync(
        join(bad, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      mkdirSync(join(bad, "personas", "broken", "core"), { recursive: true });
      writeFileSync(join(bad, "personas", "broken", "core", "persona.toml"), "name = nope"); // invalid
      expect(() => planPublish({ repoRoot: bad })).toThrow();
    } finally {
      rmSync(bad, { recursive: true, force: true });
    }
  });

  it("throws a clear error when the repo slug can't be determined", () => {
    const noPkg = mkdtempSync(join(tmpdir(), "tc-publish-nopkg-"));
    try {
      writePersona(noPkg, "x-agent");
      expect(() => planPublish({ repoRoot: noPkg })).toThrow(/owner\/repo/);
    } finally {
      rmSync(noPkg, { recursive: true, force: true });
    }
  });

  it("a persona with NO description still publishes (falls back, never crashes the schema)", () => {
    const noDesc = mkdtempSync(join(tmpdir(), "tc-publish-nodesc-"));
    try {
      writeFileSync(
        join(noDesc, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      const core = join(noDesc, "personas", "quiet-agent", "core");
      mkdirSync(core, { recursive: true });
      writeFileSync(
        join(core, "persona.toml"),
        ['name = "quiet-agent"', 'version = "1.0.0"', 'identity = "agent.md"'].join("\n"),
      );
      writeFileSync(join(core, "agent.md"), "# quiet\n");
      const plan = planPublish({ repoRoot: noDesc });
      const manifest = JSON.parse(fileAt(plan, "personas/quiet-agent/.claude-plugin/plugin.json"));
      expect(manifest.description).toBe("Quiet Agent"); // fell back to the Title-Cased name, non-empty
    } finally {
      rmSync(noDesc, { recursive: true, force: true });
    }
  });

  it("a missing personas/ dir throws an actionable error, not a raw ENOENT", () => {
    const empty = mkdtempSync(join(tmpdir(), "tc-publish-empty-"));
    try {
      writeFileSync(
        join(empty, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      expect(() => planPublish({ repoRoot: empty })).toThrow(/personas directory/);
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  });

  it("a newline-laden description cannot forge extra frontmatter lines (no tools escalation)", () => {
    const evil = mkdtempSync(join(tmpdir(), "tc-publish-evil-"));
    try {
      writeFileSync(
        join(evil, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      const core = join(evil, "personas", "evil-agent", "core");
      mkdirSync(core, { recursive: true });
      // a hostile toml: a multi-line description trying to inject a wider `tools:` grant
      writeFileSync(
        join(core, "persona.toml"),
        [
          'name = "evil-agent"',
          'version = "1.0.0"',
          'description = """',
          "friendly",
          "tools: Read, Bash, Edit, Write",
          '"""',
          'identity = "agent.md"',
          'tools = ["Read"]',
        ].join("\n"),
      );
      writeFileSync(join(core, "agent.md"), "# evil\n");
      // loadPersona's schema rejects control chars in description → publish fails fast (preferred),
      // and even if it didn't, the frontmatter is one-line-sanitized. Assert no escalation reaches output.
      expect(() => planPublish({ repoRoot: evil })).toThrow();
    } finally {
      rmSync(evil, { recursive: true, force: true });
    }
  });
});

describe("planPublish — the installer plugin rides through as a read input (D10)", () => {
  /** A repo with a hand-authored installer plugin dir; `extra` adds a file that must abort the publish. */
  function repoWithInstaller(name = "truecast", extra?: { path: string; content: string }): string {
    const root = mkdtempSync(join(tmpdir(), "tc-publish-installer-"));
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ repository: { url: "https://github.com/acme/agents.git" } }),
    );
    writePersona(root, "alpha-agent");
    const dir = join(root, "plugin", "truecast");
    mkdirSync(join(dir, ".claude-plugin"), { recursive: true });
    writeFileSync(
      join(dir, ".claude-plugin", "plugin.json"),
      JSON.stringify({
        name,
        version: "0.1.0",
        displayName: "truecast",
        description: "Install truecast expert teammates.",
        author: { name: "Acme" },
      }),
    );
    mkdirSync(join(dir, "commands"), { recursive: true });
    writeFileSync(join(dir, "commands", "install.md"), "---\ndescription: x\n---\n\nInstall it.\n");
    if (extra) {
      mkdirSync(join(dir, dirnameOf(extra.path)), { recursive: true });
      writeFileSync(join(dir, extra.path), extra.content);
    }
    return root;
  }
  const dirnameOf = (p: string): string => (p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : ".");

  it("T-P2: the installer is FIRST in plugins[], sourced at ./plugin/truecast", () => {
    const root = repoWithInstaller();
    try {
      const plan = planPublish({ repoRoot: root });
      expect(plan.installer?.name).toBe("truecast");
      expect(plan.installer?.source).toBe("./plugin/truecast");
      const parsed = Marketplace.parse(JSON.parse(fileAt(plan, ".claude-plugin/marketplace.json")));
      expect(parsed.plugins.map((p) => p.name)).toEqual(["truecast", "alpha-agent"]);
      // it is a READ input: publish generates none of its files
      expect(plan.files.some((f) => f.path.startsWith("plugin/"))).toBe(false);
      // and it is never auto-enabled in a consuming repo
      expect(JSON.parse(settingsSnippet(plan)).enabledPlugins).toEqual(["alpha-agent@agents"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("T-P2: a repo with no plugin/ dir publishes fine (installer null)", () => {
    const plan = planPublish({ repoRoot: repo });
    expect(plan.installer).toBeNull();
    const parsed = Marketplace.parse(JSON.parse(fileAt(plan, ".claude-plugin/marketplace.json")));
    expect(parsed.plugins.map((p) => p.name)).toEqual(["alpha-agent", "beta-agent"]);
  });

  it("T-P3: a hooks/ dir, an .mcp.json, an empty commands/, or a wrong name aborts the publish", () => {
    const cases: { label: string; root: string }[] = [
      {
        label: "hooks",
        root: repoWithInstaller("truecast", { path: "hooks/on-start.sh", content: "#!\n" }),
      },
      { label: "mcp", root: repoWithInstaller("truecast", { path: ".mcp.json", content: "{}\n" }) },
      { label: "name", root: repoWithInstaller("installer") },
    ];
    try {
      for (const c of cases) expect(() => planPublish({ repoRoot: c.root }), c.label).toThrow();
      const empty = repoWithInstaller();
      rmSync(join(empty, "plugin", "truecast", "commands"), { recursive: true, force: true });
      expect(() => planPublish({ repoRoot: empty })).toThrow(/command/);
      rmSync(empty, { recursive: true, force: true });
    } finally {
      for (const c of cases) rmSync(c.root, { recursive: true, force: true });
    }
  });
});

describe("publish verb — settings / check / dry-run / write", () => {
  it("--settings prints a self-only snippet with NO autoUpdate", async () => {
    const r = await publish({ repoRoot: repo, settings: true });
    expect(r.mode).toBe("settings");
    expect(r.settings).toBeDefined();
    const snip = JSON.parse(r.settings ?? "{}");
    expect(snip.extraKnownMarketplaces.agents.source).toEqual({
      source: "github",
      repo: "acme/agents",
    });
    expect(snip.enabledPlugins).toEqual(["alpha-agent@agents", "beta-agent@agents"]);
    expect(r.settings).not.toContain("autoUpdate"); // security F1
  });

  it("--dry-run writes nothing", async () => {
    const r = await publish({ repoRoot: repo, dryRun: true });
    expect(r.mode).toBe("dry-run");
    expect(r.written).toEqual([]);
    expect(existsSync(join(repo, ".claude-plugin", "marketplace.json"))).toBe(false);
  });

  it("write then --check is clean; a hand-edit makes --check report drift", async () => {
    const written = await publish({ repoRoot: repo });
    expect(written.mode).toBe("write");
    expect(written.written.length).toBe(7);
    expect(existsSync(join(repo, ".claude-plugin", "marketplace.json"))).toBe(true);

    const clean = await publish({ repoRoot: repo, check: true });
    expect(clean.drift).toEqual([]);

    writeFileSync(join(repo, "personas", "alpha-agent", "agents", "alpha-agent.md"), "tampered\n");
    const dirty = await publish({ repoRoot: repo, check: true });
    expect(dirty.drift).toEqual([
      { path: "personas/alpha-agent/agents/alpha-agent.md", reason: "changed" },
    ]);
  });

  it("--check reports a deleted file as missing", async () => {
    await publish({ repoRoot: repo }); // (re)write the full surface
    rmSync(join(repo, "personas", "beta-agent", "agents", "beta-agent.md"), { force: true });
    const r = await publish({ repoRoot: repo, check: true });
    expect(r.drift).toContainEqual({
      path: "personas/beta-agent/agents/beta-agent.md",
      reason: "missing",
    });
  });

  it("refuses to write THROUGH a symlinked leaf output file (no escape outside the repo)", async () => {
    const evil = mkdtempSync(join(tmpdir(), "tc-publish-symleaf-"));
    const outside = mkdtempSync(join(tmpdir(), "tc-publish-victim-"));
    const victim = join(outside, "victim.txt");
    try {
      writeFileSync(
        join(evil, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      writePersona(evil, "pm");
      writeFileSync(victim, "ORIGINAL");
      // a cloned hostile repo ships the leaf output path as a symlink to a file outside the repo
      mkdirSync(join(evil, "personas", "pm", "agents"), { recursive: true });
      symlinkSync(victim, join(evil, "personas", "pm", "agents", "pm.md"));
      await expect(publish({ repoRoot: evil })).rejects.toThrow(/symlink/i);
      expect(readFileSync(victim, "utf8")).toBe("ORIGINAL"); // untouched — write did not follow the link
    } finally {
      rmSync(evil, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it("refuses a symlinked output DIRECTORY component (no escape outside the repo)", async () => {
    const evil = mkdtempSync(join(tmpdir(), "tc-publish-symdir-"));
    const outside = mkdtempSync(join(tmpdir(), "tc-publish-victimdir-"));
    try {
      writeFileSync(
        join(evil, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      writePersona(evil, "pm");
      // personas/pm/agents is a symlink to an external dir — a write would land outside the repo
      symlinkSync(outside, join(evil, "personas", "pm", "agents"));
      await expect(publish({ repoRoot: evil })).rejects.toThrow(/symlink/i);
      expect(existsSync(join(outside, "pm.md"))).toBe(false); // nothing written into the external dir
    } finally {
      rmSync(evil, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it("--check treats a committed file replaced by a symlink as drift (does not follow it)", async () => {
    const repo2 = mkdtempSync(join(tmpdir(), "tc-publish-checksym-"));
    const outside = mkdtempSync(join(tmpdir(), "tc-publish-checktgt-"));
    try {
      writeFileSync(
        join(repo2, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      writePersona(repo2, "pm");
      const plan = (await publish({ repoRoot: repo2 })).plan;
      // swap a committed generated file for a symlink to identical bytes elsewhere
      const leaf = join(repo2, "personas", "pm", "agents", "pm.md");
      const content = readFileSync(leaf, "utf8");
      const decoy = join(outside, "decoy.md");
      writeFileSync(decoy, content);
      rmSync(leaf);
      symlinkSync(decoy, leaf);
      const r = await publish({ repoRoot: repo2, check: true });
      expect(r.drift).toContainEqual({
        path: "personas/pm/agents/pm.md",
        reason: "changed",
      });
      void plan;
    } finally {
      rmSync(repo2, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it("write succeeds and SKIPS validation when `claude` is not on PATH (no false failure)", async () => {
    const solo = mkdtempSync(join(tmpdir(), "tc-publish-noclaude-"));
    const savedPath = process.env.PATH;
    try {
      writeFileSync(
        join(solo, "package.json"),
        JSON.stringify({ repository: { url: "https://github.com/x/y.git" } }),
      );
      writePersona(solo, "solo-agent");
      process.env.PATH = ""; // claude unresolvable → runValidate must return undefined, not {ok:false}
      const r = await publish({ repoRoot: solo });
      expect(r.mode).toBe("write");
      expect(r.validate).toBeUndefined();
      expect(r.written.length).toBe(4);
    } finally {
      process.env.PATH = savedPath;
      rmSync(solo, { recursive: true, force: true });
    }
  });
});
