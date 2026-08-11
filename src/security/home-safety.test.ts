import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * T-H1 — the home-safety fitness function. The suite runs on machines with a LIVE `~/.claude` and
 * `~/.truecast` (the founder's, and every contributor's). A test that resolves the real home would
 * install personas into it, overwrite agent files, or delete them — silently, on `pnpm test`.
 *
 * So: no test may reach the real home. The two ways to get there are `os.homedir()` and a zero-arg
 * `resolveConfig()` (which defaults to `homedir()`); both are banned in `*.test.ts`. Tests build a
 * `Config` over a `mkdtemp` dir instead, and shell tests pass `HOME`/`TRUECAST_HOME`/`CLAUDE_HOME`
 * explicitly. This test is the enforcement — it fails the suite rather than trusting review.
 */

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const selfPath = fileURLToPath(import.meta.url);

/**
 * Every test file under `src/`: the `*.test.ts` suites plus their support modules (`fixture.ts`) —
 * a helper that resolved the real home would poison every suite that imports it.
 */
function testFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...testFiles(p));
    else if (entry.name.endsWith(".test.ts") || entry.name === "fixture.ts") out.push(p);
  }
  return out.sort();
}

/** The reach-the-real-home patterns, one per way in. Comments/strings count — this is deliberately blunt. */
const BANNED: { pattern: RegExp; why: string }[] = [
  { pattern: /\bhomedir\s*\(/, why: "os.homedir() resolves the REAL home" },
  {
    pattern: /\bresolveConfig\s*\(\s*\)/,
    why: "zero-arg resolveConfig() defaults to homedir(); pass an explicit env + home",
  },
  {
    pattern: /process\.env\.HOME|process\.env\[["']HOME["']\]/,
    why: "process.env.HOME is the REAL home; build a mkdtemp one instead",
  },
  { pattern: /\buserInfo\s*\(/, why: "os.userInfo().homedir is the REAL home" },
  { pattern: /\buntildify\b/, why: "untildify expands ~ to the REAL home" },
  { pattern: /["'`]~\//, why: "a literal '~/' path expands to the REAL home in a shell" },
];

describe("T-H1 — no test can reach the real ~/.claude or ~/.truecast", () => {
  const files = testFiles(srcRoot).filter((f) => f !== selfPath);

  it("finds the test corpus (guard against a vacuous pass)", () => {
    expect(files.length).toBeGreaterThanOrEqual(15);
  });

  it.each(files.map((f) => relative(srcRoot, f)))("%s never resolves the real home", (rel) => {
    const text = readFileSync(join(srcRoot, rel), "utf8");
    for (const { pattern, why } of BANNED) {
      expect(text, `${rel}: ${why}`).not.toMatch(pattern);
    }
  });
});
