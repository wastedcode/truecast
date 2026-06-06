import { describe, expect, it } from "vitest";
import { parseSource } from "./index.js";

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
