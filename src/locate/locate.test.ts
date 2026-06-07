import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { NoProjectError } from "../errors.js";
import { locateProject } from "./index.js";

/**
 * Tree (mirrors the real-world bug): a "home" that contains the GLOBAL truecast home (~/.truecast),
 * a git project nested under it with a deep subdir, a previously-attached NON-git dir (has .truecast),
 * and a nested git repo inside the project.
 *
 *   home/.truecast                      ← global home (must NOT be a discovery marker)
 *   home/Code/proj/.git                 ← the real project
 *   home/Code/proj/src/deep
 *   home/Code/proj/vendor/lib/.git      ← nested git repo
 *   home/attached/.truecast             ← attached but not a git repo
 */
let root: string;
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "tc-locate-"));
  mkdirSync(join(root, "home", ".truecast"), { recursive: true });
  mkdirSync(join(root, "home", "Code", "proj", ".git"), { recursive: true });
  mkdirSync(join(root, "home", "Code", "proj", "src", "deep"), { recursive: true });
  mkdirSync(join(root, "home", "Code", "proj", "vendor", "lib", ".git"), { recursive: true });
  mkdirSync(join(root, "home", "attached", ".truecast"), { recursive: true });
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

const proj = () => join(root, "home", "Code", "proj");

describe("locateProject", () => {
  it("explicit --project wins, resolved", () => {
    const target = join(root, "home", "elsewhere");
    expect(locateProject({ cwd: proj(), project: target })).toBe(resolve(target));
  });

  it("from a subdirectory, returns the nearest enclosing git root", () => {
    expect(locateProject({ cwd: join(proj(), "src", "deep") })).toBe(resolve(proj()));
  });

  it("REGRESSION: the global ~/.truecast does not shadow a nested git project", () => {
    // cwd is the git project; an ancestor (home) holds .truecast (the global home). Must NOT escape to home.
    expect(locateProject({ cwd: proj() })).toBe(resolve(proj()));
    expect(locateProject({ cwd: proj() })).not.toBe(resolve(join(root, "home")));
  });

  it("nested git repo: the nearest .git wins, not the outer one", () => {
    expect(locateProject({ cwd: join(proj(), "vendor", "lib") })).toBe(
      resolve(join(proj(), "vendor", "lib")),
    );
  });

  it("a .truecast dir without .git is no longer a discovery marker → throws", () => {
    expect(() => locateProject({ cwd: join(root, "home", "attached") })).toThrow(NoProjectError);
  });

  it("no git root and no --project throws NoProjectError", () => {
    expect(() => locateProject({ cwd: join(root, "home") })).toThrow(NoProjectError);
  });
});
