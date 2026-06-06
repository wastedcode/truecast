import { isRiskyUpdate } from "../review/index.js";
import type { UpdatePlan } from "../schema/index.js";

/**
 * Default approval policy — the SINGLE owner of "what happens when a caller passes no `confirm`".
 * `confirm` is always the caller's to override; these are the safe-by-default fallbacks (R8) so a
 * programmatic caller never silently does something destructive it didn't ask for.
 */

/** Approve unconditionally — for the explicit user action of installing what they named. */
export const autoApprove = (): boolean => true;

/** Deny unconditionally — for irreversible global removal, which must be opted into. */
export const denyByDefault = (): boolean => false;

/** Approve an update only when it is NOT risky (major / downgrade / tag-move / new tool). */
export const safeUpdateConfirm = (plan: UpdatePlan): boolean => !isRiskyUpdate(plan);
