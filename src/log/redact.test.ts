import { describe, expect, it } from "vitest";
import { redactText, redactUrl } from "./index.js";

describe("credential redaction", () => {
  it("redactUrl strips embedded userinfo", () => {
    expect(redactUrl("https://user:ghp_TOKEN@github.com/o/r.git")).toBe(
      "https://github.com/o/r.git",
    );
    expect(redactUrl("https://github.com/o/r.git")).toBe("https://github.com/o/r.git");
  });

  it("redactText redacts creds inside arbitrary text, leaves clean URLs alone", () => {
    expect(redactText("cloning https://u:p@host/x failed")).toBe(
      "cloning https://[redacted]@host/x failed",
    );
    expect(redactText("no creds here https://host/x")).toBe("no creds here https://host/x");
    expect(redactText("ssh://git:secret@example.com/r and http://a:b@h/")).toBe(
      "ssh://[redacted]@example.com/r and http://[redacted]@h/",
    );
  });

  // Regression for the CodeQL "polynomial regexp on uncontrolled data" finding: the redactor runs on
  // log/error text, so it must stay linear. The old pattern was O(n^2); these inputs would have hung.
  // If a ReDoS regression returns, this test times out and fails.
  it("is linear-time on adversarial input (ReDoS guard)", { timeout: 2000 }, () => {
    const noColon = "a".repeat(200_000); // worst case for the old unbounded scheme class
    expect(redactText(noColon)).toBe(noColon);
    const longUserinfoNoAt = `https://${"a".repeat(200_000)}`; // long authority, never terminated by '@'
    expect(redactText(longUserinfoNoAt)).toBe(longUserinfoNoAt);
  });
});
