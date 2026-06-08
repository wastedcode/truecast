#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { Command } from "@commander-js/extra-typings";
import {
  autoApprove,
  type ConsentRequest,
  type DoctorReport,
  doctor,
  type InstallResult,
  install,
  isRiskyUpdate,
  type ListResult,
  list,
  personaPrompt,
  type RemoveResult,
  remove,
  type UpdateResult,
  update,
} from "./api/index.js";
import { TruecastError } from "./errors.js";
import { createLogger } from "./log/index.js";
import type { InstallPlan, UpdatePlan } from "./schema/index.js";

// Read the real version from the package manifest so `--version` can never drift from what's published.
// dist/cli.js → ../package.json (works the same in dev: src/cli.ts → ../package.json).
const pkgVersion = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"),
).version as string;

const program = new Command()
  .name("truecast")
  .description("Install and run portable expert personas in Claude Code.")
  .version(pkgVersion);

program
  .command("install")
  .argument("<source>", "git URL or local path to a persona (optionally @version)")
  .option("--project <path>", "attach to this project instead of the discovered one")
  .option("--global", "install to the cache only; do not attach to a project")
  .option("--as <name>", "install under a different local name")
  .option("--dry-run", "show what would happen; write nothing")
  .option("--force", "overwrite a hand-edited (drifted) managed file")
  .option("--yes", "skip the confirmation prompt")
  .action(async (source, opts) => {
    const result = await install(
      {
        source,
        project: opts.project,
        global: opts.global,
        as: opts.as,
        dryRun: opts.dryRun,
        force: opts.force,
      },
      { logger: createLogger(), confirm: opts.yes ? autoApprove : confirmInteractive },
    );
    renderInstall(result);
  });

program
  .command("update")
  .argument("[name]", "installed persona to update (optionally @version); omit to update all")
  .option("--dry-run", "show the change set + classification; write nothing")
  .option("--force", "overwrite a hand-edited (drifted) managed file")
  .option("--yes", "skip the confirmation prompt")
  .action(async (target, opts) => {
    const { name, version } = splitTarget(target);
    const results = await update(
      { name, version, dryRun: opts.dryRun, force: opts.force },
      { logger: createLogger(), confirm: opts.yes ? autoApprove : confirmInteractive },
    );
    renderUpdate(results);
    if (results.some((r) => r.outcome === "failed")) process.exitCode = 1;
  });

program
  .command("list")
  .option("--check", "resolve the latest version from each source (network)")
  .option("--project [path]", "also show personas attached to a project")
  .action(async (opts) => {
    const result = await list(
      { check: opts.check, project: opts.project },
      { logger: createLogger() },
    );
    renderList(result);
  });

program
  .command("remove")
  .argument("<name>", "persona to remove")
  .option("--global", "purge globally (cache + surface + meta), not just detach here")
  .option("--purge", "when detaching, also delete the project instance/ (your edits)")
  .option("--project <path>", "detach from this project instead of the discovered one")
  .option("--yes", "skip the confirmation prompt (required for --global)")
  .action(async (name, opts) => {
    const result = await remove(
      { name, global: opts.global, purge: opts.purge, project: opts.project },
      { logger: createLogger(), confirm: opts.yes ? autoApprove : confirmInteractive },
    );
    renderRemove(result);
  });

program
  .command("prompt")
  .argument("<name>", "installed persona")
  .description(
    "print the persona's composed system prompt (for `claude --append-system-prompt-file`)",
  )
  .action((name) => {
    process.stdout.write(`${personaPrompt({ name }, { logger: createLogger() })}\n`);
  });

program
  .command("doctor")
  .description("inspect (and with --fix, repair) the truecast home")
  .option("--fix", "apply the safe repairs (re-point a dangling current, remove stale staging)")
  .option("--yes", "skip the confirmation prompt for --fix")
  .action(async (opts) => {
    const report = await doctor(
      { fix: opts.fix },
      { logger: createLogger(), confirm: opts.yes ? autoApprove : confirmInteractive },
    );
    renderDoctor(report);
    if (!report.healthy) process.exitCode = 1;
  });

program.parseAsync().catch((err: unknown) => {
  if (err instanceof TruecastError) {
    process.stderr.write(`truecast: ${err.message}\n`);
    if (err.hint) process.stderr.write(`  → ${err.hint}\n`);
  } else {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`truecast: unexpected error: ${msg}\n`);
  }
  process.exitCode = 1;
});

// --- helpers ---

/** Split a `name@version` positional (a PersonaName never contains `@`, so the split is safe). */
function splitTarget(target: string | undefined): {
  name: string | undefined;
  version: string | undefined;
} {
  if (!target) return { name: undefined, version: undefined };
  const at = target.lastIndexOf("@");
  if (at > 0) return { name: target.slice(0, at), version: target.slice(at + 1) };
  return { name: target, version: undefined };
}

async function ask(prompt: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const ans = (await rl.question(prompt)).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes";
}

// --- presentation (CLI-only; the library returns data, the CLI renders it) ---

function renderInstallPlan(plan: InstallPlan): void {
  const w = process.stderr;
  w.write(`\ninstall ${plan.persona}@${plan.version}\n`);
  w.write(`  source: ${plan.source}  (${plan.commit})\n`);
  w.write(`  tools:  ${plan.tools.length ? plan.tools.join(", ") : "none"}\n`);
  w.write(`  target: ${plan.projectRoot ?? "(global only)"}\n`);
  if (plan.writes.length) {
    w.write("  writes:\n");
    for (const x of plan.writes) w.write(`    ${x.kind.padEnd(9)} ${x.path}\n`);
  }
}

/** The ONE interactive consent handler — renders the right thing per request kind, then prompts. */
function confirmInteractive(req: ConsentRequest): Promise<boolean> {
  switch (req.kind) {
    case "install":
      renderInstallPlan(req.plan);
      return ask("Proceed? [y/N] ");
    case "update":
      renderUpdatePlan(req.plan);
      return ask(
        isRiskyUpdate(req.plan) ? "This is a sensitive change. Proceed? [y/N] " : "Proceed? [y/N] ",
      );
    case "remove-project": {
      const fate = req.purge ? "and DELETE its instance/ (your edits)" : "(keeps instance/)";
      process.stderr.write(`\ndetach ${req.persona} from ${req.root} ${fate}\n`);
      return ask("Proceed? [y/N] ");
    }
    case "remove-global":
      process.stderr.write(`\nremove ${req.persona} GLOBALLY (cache + surface + meta).\n`);
      process.stderr.write(`  ⚠ ${req.dependentsWarning}\n`);
      return ask("Proceed? [y/N] ");
    case "doctor-fix":
      return ask(`Apply ${req.issues} safe repair(s)? [y/N] `);
  }
}

function renderInstall(result: InstallResult): void {
  if (!result.applied) {
    process.stderr.write("\n(dry run — nothing written)\n");
    if (!process.stdout.isTTY) process.stdout.write(`${JSON.stringify(result.plan, null, 2)}\n`);
    return;
  }
  process.stderr.write(`\n✓ installed ${result.plan.persona}@${result.plan.version}\n`);
}

function renderUpdatePlan(plan: UpdatePlan): void {
  const w = process.stderr;
  const tag = plan.changeClass.toUpperCase();
  w.write(`\nupdate ${plan.persona}: ${plan.from} → ${plan.to}  [${tag}]\n`);
  w.write(`  commit: ${plan.fromCommit} → ${plan.toCommit}\n`);
  if (plan.downgrade) w.write("  ⚠ DOWNGRADE — moving to an older version.\n");
  if (plan.tagMoved) w.write("  ⚠ TAG MOVED — same version, different commit upstream.\n");
  if (plan.toolsAdded.length) w.write(`  ⚠ NEW TOOLS GRANTED: ${plan.toolsAdded.join(", ")}\n`);
  if (plan.toolsRemoved.length) w.write(`  tools removed: ${plan.toolsRemoved.join(", ")}\n`);
  if (plan.changes.length) {
    w.write("  changes:\n");
    const sym = { add: "+", delete: "-", modify: "~" } as const;
    for (const c of plan.changes) w.write(`    ${sym[c.kind]} ${c.layer.padEnd(9)} ${c.path}\n`);
  }
}

function renderUpdate(results: UpdateResult[]): void {
  const w = process.stderr;
  for (const r of results) {
    const span = r.plan ? `${r.plan.from} → ${r.plan.to}` : "";
    switch (r.outcome) {
      case "failed":
        w.write(`✗ ${r.persona}: ${r.error}\n`);
        break;
      case "up-to-date":
        w.write(`• ${r.persona}: already up to date\n`);
        break;
      case "applied":
        w.write(`✓ ${r.persona}: ${span}\n`);
        break;
      case "blocked":
        if (r.plan) renderUpdatePlan(r.plan); // show WHY it's sensitive
        w.write(`⚠ ${r.persona}: ${span} held back (not approved)\n`);
        break;
      case "dry-run":
        if (r.plan) renderUpdatePlan(r.plan); // a dry run's whole point: the change set + classification
        w.write("(dry run — nothing written)\n");
        break;
    }
  }
}

function renderList(result: ListResult): void {
  const w = process.stdout;
  if (result.personas.length === 0) {
    w.write("No personas installed.\n");
  } else {
    const latestLabel = result.personas.some((p) => p.checked) ? "latest" : "last-known";
    w.write(
      `\n${"PERSONA".padEnd(20)}${"RUNNING".padEnd(12)}${latestLabel.toUpperCase().padEnd(12)}SOURCE\n`,
    );
    for (const p of result.personas) {
      const running = p.corrupt ? "CORRUPT" : p.broken ? "BROKEN" : (p.running ?? "—");
      const latest = p.latest ?? "—";
      const flag = p.updateAvailable ? " ⬆" : "";
      w.write(
        `${p.name.padEnd(20)}${running.padEnd(12)}${(latest + flag).padEnd(12)}${p.source ?? "—"}\n`,
      );
    }
  }
  if (result.project) {
    w.write(`\nattached in ${result.project.root}:\n`);
    if (result.project.attached.length === 0) w.write("  (none)\n");
    for (const a of result.project.attached) {
      w.write(`  ${a.name.padEnd(20)}${a.spec.padEnd(12)}${a.source}\n`);
    }
  }
}

function renderDoctor(report: DoctorReport): void {
  const w = process.stderr;
  if (report.issues.length === 0) {
    w.write("✓ truecast home is healthy\n");
    return;
  }
  for (const i of report.issues) {
    const mark = i.healed ? "✓ fixed" : i.healable ? "⚠ fixable" : "✗";
    w.write(`${mark}  [${i.kind}] ${i.path}\n         ${i.detail}\n`);
  }
  const unresolved = report.issues.filter((i) => !i.healed).length;
  if (unresolved > 0)
    w.write(
      `\n${unresolved} issue(s) need attention; run 'truecast doctor --fix' for the safe ones.\n`,
    );
}

function renderRemove(result: RemoveResult): void {
  const w = process.stderr;
  if (!result.applied) {
    w.write(`\n(declined — ${result.name} not removed)\n`);
    return;
  }
  if (result.scope === "global") {
    w.write(`\n✓ removed ${result.name} globally (${result.removed.length} paths)\n`);
  } else {
    w.write(`\n✓ detached ${result.name}\n`);
    if (result.instancePreserved) w.write(`  instance/ preserved: ${result.instancePreserved}\n`);
  }
}
