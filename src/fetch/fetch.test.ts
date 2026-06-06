import { describe, expect, it } from "vitest";
import { parseSemverTags, parseSource } from "./index.js";

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
