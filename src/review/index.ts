import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sha256 } from "../ledger/index.js";
import { readManifest } from "../persona/index.js";
import type {
  Change,
  ChangeClass,
  GrantableTool,
  PersonaManifest,
  UpdatePlan,
} from "../schema/index.js";

/**
 * The source-agnostic change pipeline (SPEC §15): `update` is its first consumer; the v1 gate the
 * second. Diff two cores, classify the blast radius, diff requested tools.
 */

type Layer = Change["layer"];

function fileLayers(m: PersonaManifest): Map<string, Layer> {
  const map = new Map<string, Layer>();
  map.set(m.identity, "identity");
  for (const s of m.skills) map.set(s, "skill");
  for (const k of m.knowledge) map.set(k, "knowledge");
  return map;
}

function fileHash(coreDir: string, rel: string): string | null {
  const p = join(coreDir, rel);
  return existsSync(p) ? sha256(readFileSync(p)) : null;
}

/** Diff two cached cores → add/delete/modify changes, each tagged with its layer. */
export function computeChanges(currentCore: string, candidateCore: string): Change[] {
  const curFiles = fileLayers(readManifest(currentCore));
  const candFiles = fileLayers(readManifest(candidateCore));
  const changes: Change[] = [];

  if (fileHash(currentCore, "persona.toml") !== fileHash(candidateCore, "persona.toml")) {
    changes.push({ kind: "modify", path: "persona.toml", layer: "manifest" });
  }

  for (const rel of new Set([...curFiles.keys(), ...candFiles.keys()])) {
    const curLayer = curFiles.get(rel);
    const candLayer = candFiles.get(rel);
    if (candLayer && !curLayer) changes.push({ kind: "add", path: rel, layer: candLayer });
    else if (curLayer && !candLayer) changes.push({ kind: "delete", path: rel, layer: curLayer });
    else if (candLayer && fileHash(currentCore, rel) !== fileHash(candidateCore, rel)) {
      changes.push({ kind: "modify", path: rel, layer: candLayer });
    }
  }
  return changes;
}

/** Major iff identity changed, a tool was newly granted, or a skill/knowledge file was removed (RR4). */
export function classify(changes: Change[], toolsAdded: readonly GrantableTool[]): ChangeClass {
  if (toolsAdded.length > 0) return "major";
  const major = changes.some(
    (c) =>
      c.layer === "identity" ||
      (c.kind === "delete" && (c.layer === "skill" || c.layer === "knowledge")),
  );
  if (major) return "major";
  const minor = changes.some((c) => c.layer === "skill" || c.layer === "knowledge");
  return minor ? "minor" : "patch";
}

/**
 * Is this update one a human must consent to explicitly? A major change, a downgrade, a moved tag, or a
 * net-new tool grant (B7/RR4/RR5). The safe default `confirm` rejects these unless told otherwise.
 */
export function isRiskyUpdate(plan: UpdatePlan): boolean {
  return (
    plan.changeClass === "major" || plan.downgrade || plan.tagMoved || plan.toolsAdded.length > 0
  );
}

/** Diff requested tools between two versions (a net-new grant forces explicit consent — B7). */
export function toolsDiff(
  before: readonly GrantableTool[] = [],
  after: readonly GrantableTool[] = [],
): { added: GrantableTool[]; removed: GrantableTool[] } {
  const b = new Set(before);
  const a = new Set(after);
  return { added: after.filter((t) => !b.has(t)), removed: before.filter((t) => !a.has(t)) };
}
