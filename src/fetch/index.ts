import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import semver from "semver";
import { type SimpleGit, simpleGit } from "simple-git";
import { ValidationError } from "../errors.js";
import { redactUrl } from "../log/index.js";
import { readManifest } from "../persona/index.js";
import { resolveContained } from "../safety/index.js";
import { RelPath, SourceRef } from "../schema/index.js";

export interface ParsedSource {
  kind: "git" | "path";
  /** A git remote URL or a local filesystem path. */
  url: string;
  /** Optional version/tag from `@<ref>`. */
  ref: string | undefined;
  /** Optional sub-directory (from `#<subpath>`) within the source that holds `core/persona.toml`. */
  subpath: string | undefined;
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

/**
 * Parse `<source>[@<version>][#<subpath>]` into a typed ref. `#<subpath>` names the dir inside the
 * source that holds `core/persona.toml` (for monorepos); `@<version>` is a git tag. Order matters:
 * the subpath is stripped first, then the version, so `git@host` is never mistaken for a version.
 */
export function parseSource(input: string): ParsedSource {
  let rest = input;
  let subpath: string | undefined;
  const hash = rest.indexOf("#");
  if (hash >= 0) {
    subpath = rest.slice(hash + 1);
    rest = rest.slice(0, hash);
    if (!RelPath.safeParse(subpath).success) {
      // syntactic pre-filter (realpath containment is re-checked at fetch)
      throw new ValidationError(
        `invalid subpath '#${subpath}': must be a relative path inside the source (no '..', no leading '/')`,
      );
    }
  }

  let url = rest;
  let ref: string | undefined;
  const at = rest.lastIndexOf("@");
  if (at > 0) {
    const cand = rest.slice(at + 1);
    // a version/tag has no path/host separators — avoids splitting scp-style URLs
    if (/^[\w.][\w.-]*$/.test(cand)) {
      url = rest.slice(0, at);
      ref = cand;
    }
  }
  if (!SourceRef.safeParse(url).success) {
    throw new ValidationError(
      `invalid source '${url}': not a usable path/URL (ext:: and file:// transports are not allowed)`,
    );
  }
  const kind: "git" | "path" = GIT_URL.test(url) || SCP_LIKE.test(url) ? "git" : "path";
  return { kind, url, ref, subpath };
}

/** The reinstallable source string (url + subpath, NO version) — persisted in meta/lock so `update`
 *  re-fetches the same dir. The single owner of reconstructing a source from a ParsedSource.
 *  Credentials embedded in the URL are stripped here: this string is persisted to the committed lock
 *  and printed, so a token must never reach it. The FETCH still uses the full URL (`parsed.url`); a
 *  re-fetch/update authenticates via the user's git credential helper, so the clean URL stays usable. */
export function sourceLocator(parsed: ParsedSource): string {
  const clean = redactUrl(parsed.url);
  return parsed.subpath ? `${clean}#${parsed.subpath}` : clean;
}

/** Resolve the persona root within a fetched/local base, applying `#subpath` with realpath containment. */
function personaRootIn(baseDir: string, subpath: string | undefined): string {
  return subpath ? resolveContained(baseDir, subpath) : baseDir; // resolveContained defeats ../ escape
}

/**
 * Clone hardening. The THREAT is the persona repo's content, not the user's own machine — so we block
 * the repo-driven RCE vectors and otherwise stay out of git's way (modern git ≥2.53 already hardens
 * `clone` heavily by default):
 *  - GIT_ALLOW_PROTOCOL allowlists transports → `ext::`/`file::` are refused (defense in depth; the
 *    syntactic `SourceRef`/`parseSource` already block them).
 *  - `--no-recurse-submodules` on the clone disables submodule fetch.
 *  - GIT_TERMINAL_PROMPT=0 so a missing credential fails fast instead of hanging.
 * We deliberately do NOT neutralize the user's own git config — it isn't part of the threat model, and
 * doing so would break their credential helper / proxy / `insteadOf` for private or proxied remotes.
 */
const HARDENED_ENV = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_ALLOW_PROTOCOL: "https:http:git:ssh",
  GIT_PROTOCOL_FROM_USER: "0",
};

/**
 * The environment for every git child: inherit the user's (so proxies, SSH agent, credential helpers
 * keep working) plus the hardening, but DROP the "run a program" vars a non-interactive clone never
 * needs and that git's clone hardening refuses (`GIT_EDITOR`/`GIT_ASKPASS`: "not permitted without
 * allowUnsafe…"). simple-git REPLACES the child env with this object, so absent ⇒ git won't see them.
 */
function gitEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, ...HARDENED_ENV };
  for (const k of ["GIT_EDITOR", "GIT_SEQUENCE_EDITOR", "GIT_ASKPASS"]) delete env[k];
  return env;
}

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
    return { dir: personaRootIn(parsed.url, parsed.subpath), commit, dispose: async () => {} };
  }

  const dir = await mkdtemp(join(tmpRoot, "truecast-fetch-"));
  const dispose = async (): Promise<void> => {
    await rm(dir, { recursive: true, force: true });
  };
  try {
    const git: SimpleGit = simpleGit({ baseDir: dir }).env(gitEnv());
    const args = ["--depth", "1", "--no-tags", "--no-recurse-submodules"];
    if (parsed.ref) args.push("--branch", parsed.ref);
    await git.clone(parsed.url, dir, args);
    const commit = (await git.revparse(["HEAD"])).trim();
    // load from the subdir if given; dispose still removes the whole clone (`dir`).
    return { dir: personaRootIn(dir, parsed.subpath), commit, dispose };
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
    return [readManifest(join(personaRootIn(parsed.url, parsed.subpath), "core")).version];
  }
  const git = simpleGit().env(gitEnv());
  const out = await git.listRemote(["--tags", parsed.url]);
  return parseSemverTags(out);
}
