import { join } from "node:path";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import type { Logger } from "../log/index.js";
import { renderSystemPrompt } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import { runningVersion } from "../state/index.js";

export interface PromptOptions {
  /** The installed persona whose system prompt to render. */
  name: string;
}

export interface PromptCtx {
  config?: Config | undefined;
  logger?: Logger | undefined;
}

/**
 * The composed system prompt for an installed persona — identity + skill/knowledge index + where the
 * job lives. This is the SAME string materialized into the `@subagent` file; emitting it standalone is
 * what lets you run the persona as a full `claude` main agent:
 *   `claude --append-system-prompt-file <(truecast prompt <name>) --allowedTools <its tools>`
 * Read-only. Throws if the persona isn't installed / its `current` pointer is broken.
 */
export function personaPrompt(opts: PromptOptions, ctx: PromptCtx = {}): string {
  const config = ctx.config ?? resolveConfig();
  const running = runningVersion(config, opts.name);
  if (!running) {
    throw new TruecastError(
      "NOT_INSTALLED",
      `"${opts.name}" is not installed (no resolvable current version).`,
      "Install it with 'truecast install <source>', or run 'truecast doctor'.",
    );
  }
  const persona = loadPersona(join(paths.personaDir(config, opts.name), running));
  return renderSystemPrompt(
    { name: opts.name, version: running, coreDir: persona.coreDir },
    persona,
    { kind: "subagent" },
  );
}
