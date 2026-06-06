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
  | { kind: "remove-global"; persona: string; dependentsWarning: string };

export type Confirm = (req: ConsentRequest) => boolean | Promise<boolean>;

/** Approve everything — unattended adoption; the caller takes on the risk. */
export const autoApprove: Confirm = () => true;

/**
 * Safe-by-default consent (R8). Used whenever a caller passes no `confirm`:
 * - install  → approve (it is the user's explicit, named act)
 * - update   → apply only when NOT risky (major / downgrade / tag-move / new tool); else withhold
 * - remove --global → deny (irreversible; must be opted into)
 */
export const defaultConsent: Confirm = (req) => {
  switch (req.kind) {
    case "install":
      return true;
    case "update":
      return !isRiskyUpdate(req.plan);
    case "remove-global":
      return false;
  }
};
