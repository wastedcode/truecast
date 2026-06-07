import { describe, expect, it } from "vitest";
import { parseSemverTags, parseSource, sourceLocator } from "./index.js";

describe("parseSource", () => {
  it("local path, no version", () => {
    expect(parseSource("./personas/product-manager")).toMatchObject({
      kind: "path",
      ref: undefined,
    });
  });
  it("git https with @version", () => {
    expect(parseSource("https://github.com/x/y@1.2.3")).toMatchObject({
      kind: "git",
      url: "https://github.com/x/y",
      ref: "1.2.3",
    });
  });
  it("does NOT split scp-style on git@", () => {
    expect(parseSource("git@github.com:x/y")).toMatchObject({
      kind: "git",
      url: "git@github.com:x/y",
      ref: undefined,
    });
  });
  it("splits scp-style with a trailing @version", () => {
    expect(parseSource("git@github.com:x/y@1.0.0")).toMatchObject({
      kind: "git",
      url: "git@github.com:x/y",
      ref: "1.0.0",
    });
  });
  it("rejects the ext:: transport (RCE vector)", () => {
    expect(() => parseSource("ext::sh -c whoami")).toThrow();
  });
});

describe("parseSource — #subpath (monorepos)", () => {
  it("extracts a subpath from a git URL", () => {
    expect(parseSource("https://github.com/o/r#personas/pm")).toMatchObject({
      kind: "git",
      url: "https://github.com/o/r",
      ref: undefined,
      subpath: "personas/pm",
    });
  });
  it("supports @version AND #subpath together (version first)", () => {
    expect(parseSource("https://github.com/o/r@1.2.0#personas/pm")).toMatchObject({
      url: "https://github.com/o/r",
      ref: "1.2.0",
      subpath: "personas/pm",
    });
  });
  it("supports #subpath on a local path", () => {
    expect(parseSource("./monorepo#personas/pm")).toMatchObject({
      kind: "path",
      url: "./monorepo",
      subpath: "personas/pm",
    });
  });
  it("rejects a '..' escape in the subpath", () => {
    expect(() => parseSource("https://github.com/o/r#../../etc")).toThrow();
  });
  it("rejects an absolute subpath", () => {
    expect(() => parseSource("https://github.com/o/r#/etc/passwd")).toThrow();
  });
  it("sourceLocator round-trips url + subpath (no version)", () => {
    expect(sourceLocator(parseSource("https://github.com/o/r@1.2.0#personas/pm"))).toBe(
      "https://github.com/o/r#personas/pm",
    );
    expect(sourceLocator(parseSource("https://github.com/o/r"))).toBe("https://github.com/o/r");
  });

  it("sourceLocator strips embedded credentials (never persist a token to the committed lock)", () => {
    expect(sourceLocator(parseSource("https://user:ghp_TOKEN@github.com/o/r#personas/pm"))).toBe(
      "https://github.com/o/r#personas/pm",
    );
    expect(sourceLocator(parseSource("https://x-access-token:tok@github.com/o/r.git"))).toBe(
      "https://github.com/o/r.git",
    );
    // scp-style username is required (not a secret) — left intact
    expect(sourceLocator(parseSource("git@github.com:o/r.git"))).toBe("git@github.com:o/r.git");
  });
});

describe("parseSemverTags", () => {
  const lsRemote = [
    "abc123\trefs/tags/v1.0.0",
    "def456\trefs/tags/v2.1.0",
    "def456\trefs/tags/v2.1.0^{}", // peeled annotated tag — same version
    "aaa111\trefs/tags/1.5.0", // no leading v
    "bbb222\trefs/tags/nightly", // not semver — dropped
    "ccc333\trefs/heads/main", // not a tag — ignored
  ].join("\n");

  it("extracts clean semver, newest first", () => {
    expect(parseSemverTags(lsRemote)).toEqual(["2.1.0", "1.5.0", "1.0.0"]);
  });
  it("dedupes peeled annotated tags", () => {
    expect(parseSemverTags(lsRemote).filter((v) => v === "2.1.0")).toHaveLength(1);
  });
  it("returns [] for no tags", () => {
    expect(parseSemverTags("abc\trefs/heads/main")).toEqual([]);
  });
});
