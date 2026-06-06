import { describe, expect, it } from "vitest";
import { paths, resolveConfig } from "./index.js";

describe("resolveConfig", () => {
  it("defaults to ~/.truecast and ~/.claude", () => {
    const c = resolveConfig({}, "/home/u");
    expect(c.truecastHome).toBe("/home/u/.truecast");
    expect(c.claudeHome).toBe("/home/u/.claude");
  });

  it("honors env overrides", () => {
    const c = resolveConfig({ TRUECAST_HOME: "/tc", CLAUDE_HOME: "/cc" }, "/home/u");
    expect(c.truecastHome).toBe("/tc");
    expect(c.claudeHome).toBe("/cc");
  });

  it("derives the cache + claude + project paths", () => {
    const c = resolveConfig({}, "/home/u");
    expect(paths.personaCache(c, "architect", "1.0.0")).toBe(
      "/home/u/.truecast/personas/architect/1.0.0/core",
    );
    expect(paths.currentLink(c, "architect")).toBe("/home/u/.truecast/personas/architect/current");
    expect(paths.claudeAgent(c, "architect")).toBe("/home/u/.claude/agents/architect.md");
    expect(paths.projectLock("/repo")).toBe("/repo/.truecast/lock");
  });
});
