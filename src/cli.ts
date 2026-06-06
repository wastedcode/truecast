#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { Command } from "@commander-js/extra-typings";
import { type InstallResult, install } from "./api/index.js";
import { TruecastError } from "./errors.js";
import { createLogger } from "./log/index.js";
import type { InstallPlan } from "./schema/index.js";

const program = new Command()
  .name("truecast")
  .description("Install and run portable expert personas in Claude Code.")
  .version("0.0.0");

program
  .command("install")
  .argument("<source>", "git URL or local path to a persona (optionally @version)")
  .option("--project <path>", "attach to this project instead of the discovered one")
  .option("--global", "install to the cache only; do not attach to a project")
  .option("--as <name>", "install under a different local name")
  .option("--dry-run", "show what would happen; write nothing")
  .option("--yes", "skip the confirmation prompt")
  .action(async (source, opts) => {
    const result = await install(
      { source, project: opts.project, global: opts.global, as: opts.as, dryRun: opts.dryRun },
      { logger: createLogger(), confirm: opts.yes ? () => true : confirmInteractive },
    );
    renderResult(result);
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

// --- presentation (CLI-only; the library returns data, the CLI renders it) ---

function renderPlan(plan: InstallPlan): void {
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

async function confirmInteractive(plan: InstallPlan): Promise<boolean> {
  renderPlan(plan);
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const ans = (await rl.question("Proceed? [y/N] ")).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes";
}

function renderResult(result: InstallResult): void {
  if (!result.applied) {
    process.stderr.write("\n(dry run — nothing written)\n");
    if (!process.stdout.isTTY) process.stdout.write(`${JSON.stringify(result.plan, null, 2)}\n`);
    return;
  }
  process.stderr.write(`\n✓ installed ${result.plan.persona}@${result.plan.version}\n`);
}
