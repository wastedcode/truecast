import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

/**
 * The homepage's numbers are generated from the playbooks: every band in its figures is a real file's
 * `wc -w`, built by `scripts/brand/build.py` into `site/brand/` and filled into `site/index.html` by
 * `page.py`. Without a gate, any persona edit silently makes the published "to scale" claims false, so
 * this is the same byte-pin `publish.conformance.test.ts` puts on the plugin surface: both scripts'
 * `--check` mode regenerates in memory and fails on any diff. It never writes.
 *
 * `--check` uses only the Python standard library (3.11+, for tomllib). Skipped where python3 is missing
 * locally, but never in CI: a gate that can quietly not run is not a gate.
 */
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const python = ((): boolean => {
  const r = spawnSync("python3", ["-c", "import sys, tomllib; sys.exit(0)"], { encoding: "utf8" });
  return r.status === 0;
})();

const check = (root: string, script: "build.py" | "page.py") =>
  // -S: no site-packages, so a check that starts needing fontTools or Playwright fails here, not in CI
  spawnSync("python3", ["-S", join(root, "scripts", "brand", script), "--check"], {
    encoding: "utf8",
  });

describe("brand conformance — the homepage's drawn numbers ARE the playbooks", () => {
  it("python3 is available wherever CI runs this", () => {
    if (process.env.CI)
      expect(python, "python3 >= 3.11 is required for the brand checks").toBe(true);
  });

  it.skipIf(!python)("site/brand is up to date (build.py --check)", () => {
    const r = check(repoRoot, "build.py");
    expect(r.status, r.stderr).toBe(0);
  });

  it.skipIf(!python)("site/index.html's generated blocks are up to date (page.py --check)", () => {
    const r = check(repoRoot, "page.py");
    expect(r.status, r.stderr).toBe(0);
  });

  describe.skipIf(!python)("the gate catches drift (a copy of the repo, edited)", () => {
    const copy = mkdtempSync(join(tmpdir(), "tc-brand-"));
    for (const dir of ["personas", "site", "scripts/brand"]) {
      cpSync(join(repoRoot, dir), join(copy, dir), {
        recursive: true,
        filter: (src) => !src.includes("__pycache__") && !src.includes(".fonts"),
      });
    }
    afterAll(() => rmSync(copy, { recursive: true, force: true }));

    it("a playbook edit without a rebuild fails build.py --check and names the outputs", () => {
      appendFileSync(
        join(copy, "personas", "qa", "core", "agent.md"),
        "\none more line of craft\n",
      );
      const r = check(copy, "build.py");
      expect(r.status).toBe(1);
      expect(r.stderr).toContain("site/brand/cores.json");
      expect(r.stderr).toContain("site/brand/cores/qa.svg");
      expect(r.stderr).toContain("the PNGs drawn from cores.json");
      expect(r.stderr).toContain("python3 scripts/brand/build.py");
    });

    it("a cores.json the page wasn't refilled from fails page.py --check and names the block", () => {
      const json = join(copy, "site", "brand", "cores.json");
      const data = JSON.parse(readFileSync(json, "utf8"));
      data.personas.find((p: { name: string }) => p.name === "qa").words += 1;
      writeFileSync(json, JSON.stringify(data));
      const r = check(copy, "page.py");
      expect(r.status).toBe(1);
      expect(r.stderr).toContain("roster");
      expect(r.stderr).toContain("python3 scripts/brand/page.py");
    });

    it("the hand-written agent's count comes from the published proof, so a clean checkout builds it", () => {
      // internal/ is git-ignored: it is absent in CI and in every clone, and the copy has none either
      const r = spawnSync(
        "python3",
        ["-S", "-c", "import build; print(build.handwritten_words())"],
        { cwd: join(copy, "scripts", "brand"), encoding: "utf8" },
      );
      expect(r.status, r.stderr).toBe(0);
      expect(r.stdout.trim()).toBe("76");
    });
  });
});
