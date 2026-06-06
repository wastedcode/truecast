// The programmatic API — one typed function per CLI verb (CLI verb ≡ library call, 1:1).
// Posse and other orchestrators import from here; the CLI (`src/cli.ts`) is a thin adapter over it.
export * from "./install.js";
