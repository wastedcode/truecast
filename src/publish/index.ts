import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { TruecastError } from "../errors.js";
import { composeAgentFile } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import { PersonaName } from "../schema/index.js";

// --- the committed plugin/marketplace contracts (zod = executable spec; .strict so a one-way --
// --- public contract can't be silently widened). What Claude Code parses on `marketplace add`. ---

/** A persona's `.claude-plugin/plugin.json` — the fields we commit. */
export const PluginManifest = z
  .object({
    name: PersonaName,
    version: z.string().min(1),
    displayName: z.string().min(1),
    description: z.string().min(1),
    author: z.object({ name: z.string().min(1) }),
  })
  .strict();
export type PluginManifest = z.infer<typeof PluginManifest>;

/** One plugin entry in `.claude-plugin/marketplace.json` — `source` resolves under `metadata.pluginRoot`. */
export const MarketplaceEntry = z
  .object({
    name: PersonaName,
    source: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();
export type MarketplaceEntry = z.infer<typeof MarketplaceEntry>;

/** The repo-root `.claude-plugin/marketplace.json`. `name` is the one-way install handle (`<plugin>@<name>`). */
export const Marketplace = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    owner: z.object({ name: z.string().min(1) }),
    plugins: z.array(MarketplaceEntry),
  })
  .strict();
export type Marketplace = z.infer<typeof Marketplace>;

/** One file the generator will write. `path` is ALWAYS repo-relative with forward slashes (cross-OS). */
export interface GeneratedFile {
  path: string;
  content: string;
}

/** The authoritative output set — what `publish` writes, `--check` diffs, `--dry-run` shows. */
export interface PublishPlan {
  /** The marketplace handle (`<plugin>@<marketplaceName>`). */
  marketplaceName: string;
  /** GitHub `owner/repo` the consuming-repo settings snippet registers. */
  repoSlug: string;
  /** Personas published, sorted. */
  personas: string[];
  files: GeneratedFile[];
}

export interface PublishConfig {
  /** Repo root (absolute) — personas live under it and files are written under it. */
  repoRoot: string;
  /** Override the persona dir (default `<repoRoot>/personas`). */
  personasDir?: string | undefined;
  /** Override the marketplace handle (default: the repo name from the slug). */
  marketplaceName?: string | undefined;
  /** Override the marketplace owner display name (default: package.json author, else slug owner). */
  owner?: string | undefined;
  /** Override the GitHub `owner/repo` (default: parsed from package.json `repository.url`). */
  repoSlug?: string | undefined;
  /** Override the marketplace description (default: package.json `description`). */
  description?: string | undefined;
}

/**
 * Deterministic JSON for JSON-SAFE values only (plain objects/arrays/strings/numbers/booleans/null — which
 * is all this generator produces from `.parse()`d strict schemas): keys sorted recursively, 2-space indent,
 * trailing newline. Byte-stable so `--check` and diffs are trustworthy. NOT a general canonicaliser —
 * `undefined` keys drop, and `Date`/`Map`/`Set`/`bigint`/circular refs are unsupported (unreachable here).
 */
export function stableStringify(value: unknown): string {
  const sort = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === "object") {
      return Object.fromEntries(
        Object.keys(v as Record<string, unknown>)
          .sort()
          .map((k) => [k, sort((v as Record<string, unknown>)[k])]),
      );
    }
    return v;
  };
  return `${JSON.stringify(sort(value), null, 2)}\n`;
}

/** "product-manager" → "Product Manager" (best-effort default; authors override via copy if needed). */
function titleCase(name: string): string {
  return name
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** First clause of a description: up to a spaced em-dash or a sentence-ending period (not a decimal/URL dot). */
function firstClause(d: string): string {
  const m = d.match(/\s—\s|\.(?:\s|$)/); // " — " separator, or "." followed by space/end
  return m?.index !== undefined ? d.slice(0, m.index).trim() : d;
}

/**
 * Storefront one-liner for a listing — never empty (it feeds a `.min(1)` schema): explicit
 * `pluginDescription`, else the first clause of `description`, else the whole `description`, else the
 * Title-Cased name. So a persona with a missing/leading-punctuation description still publishes.
 */
function listingDescription(
  name: string,
  description: string | undefined,
  override: string | undefined,
): string {
  const desc = (description ?? "").trim();
  for (const candidate of [override?.trim(), firstClause(desc), desc, titleCase(name)]) {
    if (candidate) return candidate;
  }
  return titleCase(name); // PersonaName guarantees this is non-empty
}

/** Parse `git+https://github.com/owner/repo(.git)` (or ssh, trailing slash, deep URL) → `owner/repo`. */
function parseSlug(url: unknown): string | null {
  if (typeof url !== "string") return null;
  // strip a `.git` suffix (only when it ends the repo segment), then take the first owner/repo pair
  const m = url.replace(/\.git(?=$|[/?#])/i, "").match(/github\.com[/:]([^/]+)\/([^/?#]+)/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

/** "Inder Singh <x@y>" or { name } → display name. Take the part before the email/url (never a `<`). */
function parseAuthor(author: unknown): string | null {
  if (typeof author === "string") return (author.split("<")[0] ?? "").trim() || null;
  if (author && typeof author === "object" && "name" in author) {
    const n = (author as { name?: unknown }).name;
    return typeof n === "string" ? n : null;
  }
  return null;
}

function resolveRepoMeta(cfg: PublishConfig): {
  marketplaceName: string;
  owner: string;
  repoSlug: string;
  description: string;
} {
  let slug: string | null = null;
  let author: string | null = null;
  let pkgDescription: string | null = null;
  try {
    const pkg = JSON.parse(readFileSync(join(cfg.repoRoot, "package.json"), "utf8")) as {
      repository?: { url?: string } | string;
      author?: unknown;
      description?: unknown;
    };
    const repoUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
    slug = parseSlug(repoUrl);
    author = parseAuthor(pkg.author);
    pkgDescription = typeof pkg.description === "string" ? pkg.description : null;
  } catch {
    // no/unreadable package.json — fall back to explicit overrides below
  }
  const repoSlug = cfg.repoSlug ?? slug ?? undefined;
  if (!repoSlug) {
    throw new TruecastError(
      "NO_REPO",
      "could not determine the GitHub owner/repo for the marketplace",
      "pass --repo <owner/repo> (publish needs it for the marketplace install handle + settings snippet)",
    );
  }
  const [slugOwner, slugRepo] = repoSlug.split("/");
  const marketplaceName = cfg.marketplaceName ?? slugRepo ?? repoSlug;
  const owner = cfg.owner ?? author ?? slugOwner ?? repoSlug;
  const description =
    cfg.description ?? pkgDescription ?? `Expert teammates you install into Claude Code.`;
  return { marketplaceName, owner, repoSlug, description };
}

/**
 * Compute the full set of files to generate — PURE (no writes, no network). Reuses `loadPersona` for
 * path-safety + manifest validation, and `composeAgentFile({kind:"plugin"})` for the agent body, so the
 * plugin prompt comes from the SAME renderer as the subagent. FAIL-FAST: if any persona fails to load,
 * the whole publish aborts (never advertise a plugin that won't load). Deterministic: personas sorted,
 * JSON keys sorted, LF endings, forward-slash paths.
 */
export function planPublish(cfg: PublishConfig): PublishPlan {
  const { marketplaceName, owner, repoSlug, description } = resolveRepoMeta(cfg);
  const personasDir = cfg.personasDir ?? join(cfg.repoRoot, "personas");

  if (!existsSync(personasDir)) {
    throw new TruecastError(
      "NO_PERSONAS",
      `no personas directory at ${personasDir}`,
      "run 'truecast publish' from your persona repo root, or pass --personas-dir",
    );
  }

  const personas = readdirSync(personasDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const files: GeneratedFile[] = [];
  const entries: MarketplaceEntry[] = [];

  for (const name of personas) {
    const persona = loadPersona(join(personasDir, name)); // throws → fail-fast (PersonaName-validated)
    const m = persona.manifest;

    const agentBody = composeAgentFile(
      { name, version: m.version, coreDir: persona.coreDir },
      persona,
      { kind: "plugin" },
    );
    const manifest = PluginManifest.parse({
      name,
      version: m.version,
      displayName: titleCase(name),
      description: listingDescription(name, m.description, m.pluginDescription),
      author: { name: owner },
    });
    const entry = MarketplaceEntry.parse({
      name,
      source: `./personas/${name}`, // explicit repo-relative path to the plugin dir
      description: manifest.description,
    });
    entries.push(entry);

    // Forward-slash, repo-relative paths only (never an absolute/home path — leak-safe + cross-OS).
    files.push({ path: `personas/${name}/agents/${name}.md`, content: agentBody });
    files.push({
      path: `personas/${name}/.claude-plugin/plugin.json`,
      content: stableStringify(manifest),
    });
  }

  const marketplace = Marketplace.parse({
    name: marketplaceName,
    description,
    owner: { name: owner },
    plugins: entries,
  });
  files.push({ path: ".claude-plugin/marketplace.json", content: stableStringify(marketplace) });

  // One deterministic order regardless of how the files were appended (path-sorted).
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

  return { marketplaceName, repoSlug, personas, files };
}

/**
 * The `.claude/settings.json` snippet for a CONSUMING repo (posse, tacithq…). Registers ONLY this
 * publisher's own marketplace and enables ONLY this repo's personas. Deliberately NO `autoUpdate`:
 * third-party auto-update silently re-pulls executable plugin code on every clone+trust (the
 * supply-chain shape). Collaborators who trust the folder are prompted to install — they review first.
 */
export function settingsSnippet(plan: PublishPlan): string {
  return stableStringify({
    extraKnownMarketplaces: {
      [plan.marketplaceName]: { source: { source: "github", repo: plan.repoSlug } },
    },
    enabledPlugins: plan.personas.map((n) => `${n}@${plan.marketplaceName}`),
  });
}
