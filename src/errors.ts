/**
 * Typed error surface. The CLI maps each to a message + a concrete next step (AC10);
 * nothing throws a raw Error to the user.
 */
export class TruecastError extends Error {
  readonly code: string;
  /** A concrete next step shown to the user. */
  readonly hint: string | undefined;

  constructor(code: string, message: string, hint?: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "TruecastError";
    this.code = code;
    this.hint = hint;
  }
}

export class NoProjectError extends TruecastError {
  constructor() {
    super(
      "NO_PROJECT",
      "Not inside a git project (no .git found in this directory or its parents).",
      "cd into your project (a git repo), pass --project <path>, or use --global to skip attaching.",
    );
  }
}

/** Path traversal / symlink-escape / absolute path in untrusted persona content. */
export class UnsafePathError extends TruecastError {
  constructor(detail: string) {
    super(
      "UNSAFE_PATH",
      `Refusing unsafe path: ${detail}`,
      "This persona is malformed or hostile.",
    );
  }
}

/** A name already exists in the target scope (B5: never silently shadow). */
export class CollisionError extends TruecastError {
  constructor(name: string, source: string) {
    super(
      "COLLISION",
      `"${name}" already exists (source: ${source}); installing would shadow it.`,
      `Reinstall with --as <other-name>, or run 'truecast update ${name}' if it is the same one.`,
    );
  }
}

/** persona.toml failed schema or content validation. */
export class ValidationError extends TruecastError {
  constructor(message: string) {
    super("INVALID_PERSONA", message, "Check the persona's persona.toml against the spec.");
  }
}

/** A truecast-managed file was hand-edited since it was generated — refuse to clobber it (B1/AC3). */
export class DriftError extends TruecastError {
  constructor(path: string) {
    super(
      "DRIFT",
      `Refusing to overwrite a hand-edited managed file: ${path}`,
      "Your change isn't tracked and would be lost. Re-run with --force to discard it, or restore the file.",
    );
  }
}

/** A committed `.truecast/lock` failed to parse — it was corrupted or hand-broken. */
export class LockCorruptError extends TruecastError {
  constructor(path: string, detail: string) {
    super(
      "LOCK_CORRUPT",
      `The project lock is unreadable (${path}): ${detail}`,
      "Restore it from version control, or delete it and re-install the personas.",
    );
  }
}

/** A global `meta.json` exists but failed to parse — distinct from a persona simply not being installed. */
export class MetaCorruptError extends TruecastError {
  constructor(path: string, detail: string) {
    super(
      "META_CORRUPT",
      `A persona's record is unreadable (${path}): ${detail}`,
      "Run 'truecast doctor' to inspect, or 'truecast remove <name> --global' to clear it.",
    );
  }
}
