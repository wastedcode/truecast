import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import semver from "semver";
import { type SimpleGit, simpleGit } from "simple-git";
import { ValidationError } from "../errors.js";
import { readManifest } from "../persona/index.js";
import { SourceRef } from "../schema/index.js";

export interface ParsedSource {
  kind: "git" | "path";
  /** A git remote URL or a local filesystem path. */
  url: string;
  /** Optional version/tag from `@<ref>`. */
  ref: string | undefined;
}

export interface FetchedCore {
  /** Directory containing the fetched repo (read `core/` from here, then `dispose`). */
  dir: string;
  /** Resolved commit SHA (integrity pin), or "local" for an unversioned local path. */
  commit: string;
  dispose: () => Promise<void>;
}

const GIT_URL = /^(https?|git|ssh):\/\//i;
const SCP_LIKE = /^[\w.-]+@[\w.-]+:/; // git@github.com:user/repo

/** Split `<source>[@<version>]` into a typed ref without mistaking `git@host` for a version. */
export function parseSource(input: string): ParsedSource {
  let url = input;
  let ref: string | undefined;
  const at = input.lastIndexOf("@");
  if (at > 0) {
    const cand = input.slice(at + 1);
    // a version/tag has no path/host separators — avoids splitting scp-style URLs
    if (/^[\w.][\w.-]*$/.test(cand)) {
      url = input.slice(0, at);
      ref = cand;
    }
  }
  SourceRef.parse(url); // rejects ext::/file:// transports + control chars
  const kind: "git" | "path" = GIT_URL.test(url) || SCP_LIKE.test(url) ? "git" : "path";
  return { kind, url, ref };
}

/** Hardening applied to every clone: no hooks, no dangerous transports, no submodule recursion. */
const HARDENED_CONFIG = [
  "core.hooksPath=/dev/null",
  "protocol.ext.allow=never",
  "protocol.file.allow=never",
  "submodule.recurse=false",
];
const HARDENED_ENV = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_ASKPASS: "/bin/true",
  GCM_INTERACTIVE: "never",
};

/** Fetch a persona's repo into a temp dir (git) or resolve a local path. Sandboxed; SHA-pinned. */
export async function fetchSource(parsed: ParsedSource, tmpRoot: string): Promise<FetchedCore> {
  if (parsed.kind === "path") {
    if (parsed.ref) {
      throw new ValidationError(
        `@version is not supported for a local path source (${parsed.url})`,
      );
    }
    let commit = "local";
    try {
      commit = (await simpleGit(parsed.url).revparse(["HEAD"])).trim();
    } catch {
      // not a git repo — fine for a local path source
    }
    return { dir: parsed.url, commit, dispose: async () => {} };
  }

  const dir = await mkdtemp(join(tmpRoot, "truecast-fetch-"));
  const dispose = async (): Promise<void> => {
    await rm(dir, { recursive: true, force: true });
  };
  try {
    const git: SimpleGit = simpleGit({ baseDir: dir, config: HARDENED_CONFIG }).env({
      ...process.env,
      ...HARDENED_ENV,
    });
    const args = ["--depth", "1", "--no-tags", "--no-recurse-submodules"];
    if (parsed.ref) args.push("--branch", parsed.ref);
    await git.clone(parsed.url, dir, args);
    const commit = (await git.revparse(["HEAD"])).trim();
    return { dir, commit, dispose };
  } catch (err) {
    await dispose();
    throw new ValidationError(`fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Parse `git ls-remote --tags` output → clean semver list, newest first (RR5). */
export function parseSemverTags(lsRemote: string): string[] {
  const seen = new Set<string>();
  for (const m of lsRemote.matchAll(/refs\/tags\/(\S+)/g)) {
    const raw = m[1]?.replace(/\^\{\}$/, "").replace(/^v/, "") ?? ""; // drop peeled-tag + leading v
    const v = semver.valid(raw);
    if (v) seen.add(v);
  }
  return [...seen].sort(semver.rcompare);
}

/** List the versions a source offers, newest first. Path → the single manifest version (RR5). */
export async function resolveVersions(parsed: ParsedSource): Promise<string[]> {
  if (parsed.kind === "path") {
    return [readManifest(join(parsed.url, "core")).version];
  }
  const git = simpleGit({ config: HARDENED_CONFIG }).env({ ...process.env, ...HARDENED_ENV });
  const out = await git.listRemote(["--tags", parsed.url]);
  return parseSemverTags(out);
}
