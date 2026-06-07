import pino, { type Logger } from "pino";

export type { Logger };

export interface LogOptions {
  level?: string | undefined;
  /** Pretty (human) output to stderr; defaults to TTY detection. */
  pretty?: boolean | undefined;
}

/** Strip credentials from a URL. URL-parse handles `@` in passwords; scp-style falls back. */
export function redactUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.username || u.password) {
      u.username = "";
      u.password = "";
      return u.toString();
    }
    return url;
  } catch {
    // userinfo class excludes '@' and is bounded → linear, no backtracking (scp-style/unparseable URLs).
    return url.replace(/\/\/[^/\s@]{1,256}@/, "//[redacted]@");
  }
}

/**
 * Redact credentials embedded anywhere in a string (log messages, error text — the main leak path).
 * Runs on UNCONTROLLED input, so the pattern is linear-time by construction: a literal `://` anchor,
 * then a bounded userinfo class that excludes `@` (no ambiguous overlap → no polynomial backtracking).
 */
export function redactText(s: string): string {
  return s.replace(/(:\/\/)[^\s/@]{1,256}@/g, "$1[redacted]@");
}

/** The one logger. Structured by default; redacts credentials in fields AND error messages/stacks. */
export function createLogger(opts: LogOptions = {}): Logger {
  const level = opts.level ?? process.env.TRUECAST_LOG ?? "info";
  const pretty = opts.pretty ?? process.stderr.isTTY === true;
  return pino({
    level,
    redact: {
      paths: ["url", "*.url", "token", "*.token", "headers.authorization"],
      censor: "[redacted]",
    },
    serializers: {
      err: (e: Error) => {
        const s = pino.stdSerializers.err(e);
        return {
          ...s,
          message: redactText(String(s.message ?? "")),
          stack: s.stack ? redactText(String(s.stack)) : s.stack,
        };
      },
    },
    ...(pretty
      ? { transport: { target: "pino-pretty", options: { destination: 2, colorize: true } } }
      : {}),
  });
}
