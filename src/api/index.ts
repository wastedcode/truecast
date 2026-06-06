// The programmatic API — one typed function per CLI verb (CLI verb ≡ library call, 1:1).
// Posse and other orchestrators import from here; the CLI (`src/cli.ts`) is a thin adapter over it.
export { isRiskyUpdate } from "../review/index.js";
export { type Confirm, type ConsentRequest, autoApprove, defaultConsent } from "./consent.js";
export * from "./doctor.js";
export * from "./install.js";
export * from "./list.js";
export * from "./remove.js";
export * from "./update.js";
