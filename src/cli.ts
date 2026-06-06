#!/usr/bin/env node
import { Command } from "@commander-js/extra-typings";
import { TruecastError } from "./errors.js";

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
  .action(async () => {
    // Walking skeleton lands next: fetch → persona → cache → locate → attach → materialize.
    throw new TruecastError("NOT_IMPLEMENTED", "install is not wired up yet", "coming next");
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
