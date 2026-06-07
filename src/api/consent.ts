import { isRiskyUpdate } from "../review/index.js";
import type { InstallPlan, UpdatePlan } from "../schema/index.js";

/**
 * The SINGLE consent contract across every verb (R8 / boundary fix). A caller (the CLI's prompt, or
 * Posse's approval policy) implements ONE `Confirm` function and passes it everywhere; the tagged
 * `kind` tells it which decision it's making. No more three divergent confirm signatures.
 */
export type ConsentRequest =
  | { kind: "install"; plan: InstallPlan }
  | { kind: "update"; plan: UpdatePlan }
  | { kind: "remove-project"; persona: string; root: string; purge: boolean }
  | { kind: "remove-global"; persona: string; dependentsWarning: string }
  | { kind: "doctor-fix"; issues: number };

export type Confirm = (req: ConsentRequest) => boolean | Promise<boolean>;

/** Approve everything — unattended adoption; the caller takes on the risk. */
export const autoApprove: Confirm = () => true;

/**
 * Safe-by-default consent — used whenever a caller passes no `confirm` (the interactive CLI always
 * passes its own prompt, so this governs programmatic callers). Approve the reversible/requested; deny
 * only the irreversible:
 * - install        → approve (the user's explicit, named act)
 * - update         → apply only when NOT risky (major / downgrade / tag-move / new tool)
 * - remove-project → approve a detach (reversible — keeps `instance/`); DENY `--purge` (deletes it)
 * - remove-global  → deny (irreversible)
 * - doctor-fix     → approve (explicit opt-in; only safe heals)
 */
export const defaultConsent: Confirm = (req) => {
  switch (req.kind) {
    case "install":
      return true;
    case "update":
      return !isRiskyUpdate(req.plan);
    case "remove-project":
      return !req.purge;
    case "remove-global":
      return false;
    case "doctor-fix":
      return true;
  }
};

/**
 * The consent guard-rail: run `apply` ONLY if consent is granted for `request`, else return `onDeny()`.
 * Every state-altering verb routes its mutation through here, so the consent check can't be hand-skipped
 * inside a verb — the only path to `apply` is past the gate. (A `consent.conformance` test enforces that
 * each altering verb actually uses it: denied consent ⇒ no mutation.)
 */
export async function gate<T>(
  ctx: { confirm?: Confirm | undefined },
  request: ConsentRequest,
  onDeny: () => T,
  apply: () => Promise<T> | T,
): Promise<T> {
  const confirm = ctx.confirm ?? defaultConsent;
  return (await confirm(request)) ? apply() : onDeny();
}
