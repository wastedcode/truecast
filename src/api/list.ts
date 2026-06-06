import { existsSync } from "node:fs";
import semver from "semver";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { parseSource, resolveVersions } from "../fetch/index.js";
import { locateProject } from "../locate/index.js";
import { readEntries } from "../lock/index.js";
import type { Logger } from "../log/index.js";
import { readMeta } from "../meta/index.js";
import { installedPersonas, latestCached, runningVersion } from "../state/index.js";

export interface ListOptions {
  /** Also resolve the latest version from each source over the network (slower). */
  check?: boolean | undefined;
  /** Also show personas attached to a project (tracking vs pinned). `true` = discover from cwd;
   *  a string = use that project root. Omit to skip the project view. */
  project?: string | boolean | undefined;
  /** Discover the project from here (defaults to process.cwd()). */
  cwd?: string | undefined;
}

export interface ListCtx {
  config?: Config | undefined;
  logger?: Logger | undefined;
}

/** One row of the global install table. */
export interface PersonaListing {
  name: string;
  /** Running version (resolved from the `current` symlink), or null if the link is broken (RR7). */
  running: string | null;
  /** True when `running` is null because the symlink dangles (vs simply never promoted). */
  broken: boolean;
  source: string | null;
  /** Newest version we know of: a remote resolve with `--check`, else the newest cached ("last-known"). */
  latest: string | null;
  /** Whether `latest` was network-resolved (true) or is the last-known cached value (false). */
  checked: boolean;
  updateAvailable: boolean;
  /** The persona's meta.json exists but is unreadable (R7) — surfaced distinctly, not as "not installed". */
  corrupt: boolean;
}

/** One row of the project view: a persona attached here + how it tracks. */
export interface ProjectAttachment {
  name: string;
  spec: string; // "current" | a pinned semver
  source: string;
}

export interface ListResult {
  personas: PersonaListing[];
  /** Present only when `project` was requested. */
  project?: { root: string; attached: ProjectAttachment[] } | undefined;
}

/** Enumerate installed personas + their running/latest versions; optionally scope to a project. */
export async function list(opts: ListOptions = {}, ctx: ListCtx = {}): Promise<ListResult> {
  const config = ctx.config ?? resolveConfig();
  const personas: PersonaListing[] = [];

  for (const name of installedPersonas(config)) {
    const running = runningVersion(config, name);
    const broken = running === null && existsSync(paths.currentLink(config, name));

    // a corrupt meta is reported distinctly — never silently as "not installed" (R7).
    let meta: ReturnType<typeof readMeta> = null;
    let corrupt = false;
    try {
      meta = readMeta(config, name);
    } catch (err) {
      corrupt = true;
      ctx.logger?.warn({ persona: name, err }, "meta.json unreadable");
    }
    const source = meta?.source ?? null;

    let latest = meta ? latestCached(meta.versions) : null;
    let checked = false;
    if (opts.check && source) {
      try {
        latest = (await resolveVersions(parseSource(source)))[0] ?? latest;
        checked = true;
      } catch (err) {
        ctx.logger?.warn({ persona: name, err }, "could not resolve latest from source");
      }
    }

    const updateAvailable =
      latest !== null && running !== null && semver.valid(latest) !== null
        ? semver.gt(latest, running)
        : false;

    personas.push({ name, running, broken, source, latest, checked, updateAvailable, corrupt });
  }

  if (!opts.project) return { personas };

  // project view — the lock/ module owns reading + validating the committed lock (RR6).
  const root = locateProject({
    cwd: opts.cwd ?? process.cwd(),
    project: typeof opts.project === "string" ? opts.project : undefined,
  });
  const attached: ProjectAttachment[] = readEntries(root).map(([name, entry]) => ({
    name,
    spec: entry.spec,
    source: entry.source,
  }));
  return { personas, project: { root, attached } };
}
