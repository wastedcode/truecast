// Regenerate the subagent render goldens — the ONE reviewed step that updates them (QA M2).
// Run deliberately after an INTENTIONAL renderer/persona change: `pnpm tsx scripts/regen-goldens.ts`.
// Renders from the committed `personas/` source (never the ~/.truecast cache) so the baseline can't lie.
// The golden test never auto-writes; a real regression must come here on purpose and be reviewed in the diff.
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSystemPrompt } from "../src/materialize/index.js";
import { loadPersona } from "../src/persona/index.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const personasDir = join(repoRoot, "personas");
const goldenDir = join(repoRoot, "src", "materialize", "__goldens__");
mkdirSync(goldenDir, { recursive: true });

const names = readdirSync(personasDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

for (const name of names) {
  const persona = loadPersona(join(personasDir, name));
  const prompt = renderSystemPrompt(
    { name, version: persona.manifest.version, coreDir: persona.coreDir },
    persona,
    { kind: "subagent" },
  );
  writeFileSync(join(goldenDir, `${name}.subagent.md`), prompt);
  process.stdout.write(`regenerated ${name}.subagent.md\n`);
}
