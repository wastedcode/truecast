import { z } from "zod";

/** Tools a persona may request — an explicit allowlist (B7, least-privilege). */
export const GRANTABLE_TOOLS = [
  "Read",
  "Grep",
  "Glob",
  "WebSearch",
  "WebFetch",
  "Bash",
  "Edit",
  "Write",
  "NotebookEdit",
] as const;
export const GrantableTool = z.enum(GRANTABLE_TOOLS);
export type GrantableTool = z.infer<typeof GrantableTool>;

/** Reject C0 control chars + DEL (incl. null byte) without an escape-laden regex literal. */
const noControlChars = (s: string): boolean => {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) return false;
  }
  return true;
};

function isAbsoluteAnyOS(p: string): boolean {
  return p.startsWith("/") || p.startsWith("\\") || /^[A-Za-z]:/.test(p);
}

/** Persona name: lowercase/dash, bounded — blocks path & `@agent` injection. */
export const PersonaName = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-z0-9-]*$/, "must start with a letter; lowercase letters, digits, dashes only")
  .refine((s) => !s.endsWith("-"), "must not end with a dash");

const SemVer = z
  .string()
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, "must be semver (e.g. 1.2.3)");

/**
 * A relative path that cannot escape its base — SYNTACTIC pre-filter only.
 * The authoritative containment check is runtime: see `src/safety` (realpath + isPathInside + lstat).
 */
const RelPath = z
  .string()
  .min(1)
  .refine(noControlChars, "must not contain control characters / null bytes")
  .refine(
    (p) => !isAbsoluteAnyOS(p) && !p.startsWith("~"),
    "must be relative (no leading /, \\, drive letter, or ~)",
  )
  .refine((p) => !p.split(/[/\\]/).includes(".."), "must not contain a '..' path segment");

/** A source ref recorded on disk — a git URL or relative path; blocks dangerous git transports. */
export const SourceRef = z
  .string()
  .min(1)
  .refine(noControlChars, "must not contain control characters")
  .refine(
    (s) => !/^(ext|file)::/i.test(s) && !/^file:\/\//i.test(s),
    "git 'ext::' and 'file://' transports are not allowed",
  );
export type SourceRef = z.infer<typeof SourceRef>;

/** `core/persona.toml` — the manifest + corpus index (primary access; SPEC §14.8). */
export const PersonaManifest = z
  .object({
    name: PersonaName,
    version: SemVer,
    /** One-line summary for listings / the registry. */
    description: z.string().optional(),
    identity: RelPath,
    skills: z.array(RelPath).default([]),
    knowledge: z.array(RelPath).default([]),
    modelHint: z.string().optional(),
    /** Requested tools — validated against the allowlist; surfaced at install (B7). */
    tools: z.array(GrantableTool).optional(),
  })
  .strict();
export type PersonaManifest = z.infer<typeof PersonaManifest>;

/** A project's `.truecast/lock` entry — pins source + version + commit (integrity). */
export const LockEntry = z.object({
  source: SourceRef,
  version: SemVer,
  commit: z
    .string()
    .regex(/^[0-9a-f]{7,40}$/, "must be a git commit sha")
    .or(z.literal("local")),
});
export type LockEntry = z.infer<typeof LockEntry>;

export const Lock = z.object({
  version: z.literal(1).default(1),
  personas: z.record(PersonaName, LockEntry).default({}),
});
export type Lock = z.infer<typeof Lock>;

/** A truecast-owned file, hashed so `sync` can detect a hand-edit (B1/AC3). */
export const LedgerEntry = z.object({
  path: z.string().min(1).refine(noControlChars, "must not contain control characters"),
  sha256: z.string().regex(/^[0-9a-f]{64}$/, "must be a sha256 hex digest"),
  source: SourceRef,
  kind: z.enum(["cache", "agent", "skill", "symlink"]),
});
export type LedgerEntry = z.infer<typeof LedgerEntry>;

export const Ledger = z.object({
  version: z.literal(1).default(1),
  entries: z.array(LedgerEntry).default([]),
});
export type Ledger = z.infer<typeof Ledger>;

/**
 * A reviewable change to a persona — the v1 gate's unit, defined in v0 so the review/apply pipeline
 * is source-agnostic and never foreclosed (SPEC §15). Anti-invention: at least one evidence cite.
 */
export const Proposal = z.object({
  id: z.string(),
  persona: PersonaName,
  layer: z.enum(["core", "instance"]),
  change: z.object({
    file: RelPath,
    op: z.enum(["append", "create", "replace"]),
    content: z.string(),
  }),
  evidence: z
    .array(z.object({ source: z.string(), quote: z.string() }))
    .min(1, "a Proposal must cite at least one piece of evidence"),
  rationale: z.string().optional(),
  status: z.enum(["pending", "accepted", "declined"]).default("pending"),
});
export type Proposal = z.infer<typeof Proposal>;

/** The plan `install` renders for confirm / --dry-run (the B7 trust surface) before any write. */
export const PlannedWrite = z.object({
  path: z.string(),
  kind: z.enum(["cache", "symlink", "instance", "agent", "skill", "lock", "gitignore"]),
});
export type PlannedWrite = z.infer<typeof PlannedWrite>;

export const InstallPlan = z.object({
  persona: PersonaName,
  source: SourceRef,
  version: SemVer,
  commit: z.string(),
  projectRoot: z.string().nullable(),
  tools: z.array(GrantableTool).default([]),
  writes: z.array(PlannedWrite).default([]),
});
export type InstallPlan = z.infer<typeof InstallPlan>;
