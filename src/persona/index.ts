import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseToml } from "smol-toml";
import { ValidationError } from "../errors.js";
import { assertRegularFile, resolveContained } from "../safety/index.js";
import { PersonaManifest as ManifestSchema, type PersonaManifest } from "../schema/index.js";

export interface Persona {
  /** The persona root (contains `core/`, optionally `instance-template/`). */
  root: string;
  /** `root/core` — the read-only craft dir. */
  coreDir: string;
  manifest: PersonaManifest;
  /** Absolute path to `instance-template/mandate.md`, if the persona ships one. */
  instanceTemplate: string | null;
}

/**
 * Load + validate a persona from its root dir. Parses `core/persona.toml`, validates it against the
 * schema, and proves every referenced file is contained + a regular file (authoritative path-safety).
 */
export function loadPersona(root: string): Persona {
  const coreDir = join(root, "core");
  const tomlPath = join(coreDir, "persona.toml");
  if (!existsSync(tomlPath)) throw new ValidationError(`no core/persona.toml found under ${root}`);

  let raw: unknown;
  try {
    raw = parseToml(readFileSync(tomlPath, "utf8"));
  } catch (err) {
    throw new ValidationError(`invalid persona.toml: ${err instanceof Error ? err.message : err}`);
  }

  const parsed = ManifestSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ValidationError(`persona.toml failed validation: ${detail}`);
  }
  const manifest = parsed.data;

  for (const rel of [manifest.identity, ...manifest.skills, ...manifest.knowledge]) {
    const abs = resolveContained(coreDir, rel); // authoritative containment (defeats ../ symlink/abs)
    assertRegularFile(abs); // reject symlinks / non-regular files
  }

  const tpl = join(root, "instance-template", "mandate.md");
  return { root, coreDir, manifest, instanceTemplate: existsSync(tpl) ? tpl : null };
}

/** Parse just the manifest from a core dir (no path validation — for already-cached versions). */
export function readManifest(coreDir: string): PersonaManifest {
  const tomlPath = join(coreDir, "persona.toml");
  if (!existsSync(tomlPath)) throw new ValidationError(`no persona.toml in ${coreDir}`);
  const parsed = ManifestSchema.safeParse(parseToml(readFileSync(tomlPath, "utf8")));
  if (!parsed.success) {
    throw new ValidationError(
      `persona.toml invalid: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }
  return parsed.data;
}
