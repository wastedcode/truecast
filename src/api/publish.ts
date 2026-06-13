import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execa } from "execa";
import type { Logger } from "../log/index.js";
import {
  type PublishConfig,
  type PublishPlan,
  planPublish,
  settingsSnippet,
} from "../publish/index.js";
import { isSymlink, resolveContained, writeContained } from "../safety/index.js";

export interface PublishOptions {
  /** Repo root to publish (default: process.cwd()). */
  repoRoot?: string | undefined;
  /** Override the marketplace handle / owner / GitHub slug (else derived from package.json). */
  marketplaceName?: string | undefined;
  owner?: string | undefined;
  repoSlug?: string | undefined;
  /** Print the consuming-repo settings snippet instead of writing files. */
  settings?: boolean | undefined;
  /** Verify the committed surface matches the personas; write nothing. Sets `drift`. */
  check?: boolean | undefined;
  /** Compute the plan, write nothing. */
  dryRun?: boolean | undefined;
}

/**
 * No `confirm` field (unlike `install`/`update`/`remove`'s `Ctx`): `publish` is intentionally exempt from
 * the consent gate. It writes ONLY inside the user's own repo, into git-tracked generated files the user
 * reviews in the diff before committing — the gate exists for writes to the global `~/.claude` / cache, not
 * for repo-local codegen the user runs and inspects themselves.
 */
export interface PublishCtx {
  logger?: Logger | undefined;
}

/** A generated file that is missing on disk or whose committed content drifted from the plan. */
export interface Drift {
  path: string;
  reason: "missing" | "changed";
}

export interface PublishResult {
  plan: PublishPlan;
  /** Which path the verb took — lets the CLI render the right thing. */
  mode: "write" | "check" | "dry-run" | "settings";
  /** Files actually written (empty for dry-run/check/settings). */
  written: string[];
  /** `--check` only: the drifted/missing files (empty ⇒ surface is up to date). */
  drift: Drift[];
  /** `--settings` only: the snippet to paste into a consuming repo's .claude/settings.json. */
  settings?: string | undefined;
  /** `claude plugin validate` outcome, if the binary was on PATH (else undefined). */
  validate?: { ok: boolean; output: string } | undefined;
}

/**
 * Generate the committed Claude Code plugin + marketplace surface from this repo's personas — the
 * programmatic entry point (`truecast publish`). Pure of process concerns (no prompt/exit); writes only
 * inside the repo, each path proven contained first (a malformed persona can't escape the repo root).
 */
export async function publish(opts: PublishOptions, ctx: PublishCtx = {}): Promise<PublishResult> {
  const repoRoot = opts.repoRoot ?? process.cwd();
  const cfg: PublishConfig = {
    repoRoot,
    marketplaceName: opts.marketplaceName,
    owner: opts.owner,
    repoSlug: opts.repoSlug,
  };
  const plan = planPublish(cfg);

  if (opts.settings) {
    return { plan, mode: "settings", written: [], drift: [], settings: settingsSnippet(plan) };
  }

  if (opts.check) {
    const drift: Drift[] = [];
    for (const f of plan.files) {
      const abs = resolveContained(repoRoot, f.path);
      if (!existsSync(abs) && !isSymlink(abs)) drift.push({ path: f.path, reason: "missing" });
      // a committed generated file is never a symlink — treat one as drift, don't follow it on read
      else if (isSymlink(abs) || readFileSync(abs, "utf8") !== f.content)
        drift.push({ path: f.path, reason: "changed" });
    }
    return { plan, mode: "check", written: [], drift };
  }

  if (opts.dryRun) {
    return { plan, mode: "dry-run", written: [], drift: [] };
  }

  const written: string[] = [];
  for (const f of plan.files) {
    // writeContained refuses to follow a symlink at any output component — a cloned hostile repo cannot
    // redirect a write outside the repo (the guarantee that lets publish skip the consent gate).
    writeContained(repoRoot, f.path, f.content);
    written.push(f.path);
    ctx.logger?.info({ path: f.path }, "wrote");
  }

  const validate = await runValidate(repoRoot, ctx);
  return { plan, mode: "write", written, drift: [], validate };
}

/**
 * Best-effort external conformance: `claude plugin validate --strict` on the generated marketplace, if
 * `claude` is on PATH. Warn-not-fail when absent (claudemux/PATH-peer rule) so publish works without it;
 * the founder gets the validate verdict at publish time, not after a failed install (observability).
 */
async function runValidate(
  repoRoot: string,
  ctx: PublishCtx,
): Promise<{ ok: boolean; output: string } | undefined> {
  const marketplace = join(repoRoot, ".claude-plugin", "marketplace.json");
  try {
    const res = await execa("claude", ["plugin", "validate", marketplace, "--strict"], {
      reject: false,
    });
    // execa v9 RESOLVES (does not throw) when the binary is missing: { failed: true, code: "ENOENT",
    // exitCode: undefined }. Treat a spawn failure as "claude not available" → skip, don't report a
    // false validation failure. Only a real non-zero exit (number) counts as issues.
    if (res.exitCode == null || res.code === "ENOENT") return undefined;
    const output = `${res.stdout}\n${res.stderr}`.trim();
    const ok = res.exitCode === 0;
    if (!ok) ctx.logger?.warn({ output }, "claude plugin validate reported issues");
    return { ok, output };
  } catch {
    // belt-and-suspenders: any other spawn error → skip silently (the CLI notes "validate skipped").
    return undefined;
  }
}
