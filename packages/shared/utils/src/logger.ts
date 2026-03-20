// ─── Log levels ───────────────────────────────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
};

function levelColor(level: LogLevel): string {
  switch (level) {
    case "debug":
      return colors.dim;
    case "info":
      return colors.cyan;
    case "warn":
      return colors.yellow;
    case "error":
      return colors.red;
  }
}

// ─── Logger ───────────────────────────────────────────────────────────────────

export interface Logger {
  debug(msg: string, data?: unknown): void;
  info(msg: string, data?: unknown): void;
  warn(msg: string, data?: unknown): void;
  error(msg: string, data?: unknown): void;
}

const activeLevel: LogLevel = (process.env["LOG_LEVEL"] as LogLevel | undefined) ?? "info";

export function createLogger(name: string): Logger {
  const minLevel = LOG_LEVELS[activeLevel] ?? 1;

  function log(level: LogLevel, msg: string, data?: unknown): void {
    if (LOG_LEVELS[level] < minLevel) return;
    const ts = new Date().toISOString();
    const prefix = `${colors.dim}${ts}${colors.reset} ${levelColor(level)}[${level.toUpperCase()}]${colors.reset} ${colors.blue}[${name}]${colors.reset}`;
    if (data !== undefined) {
      console.warn(`${prefix} ${msg}`, data);
    } else {
      console.warn(`${prefix} ${msg}`);
    }
  }

  return {
    debug: (msg, data?) => log("debug", msg, data),
    info: (msg, data?) => log("info", msg, data),
    warn: (msg, data?) => log("warn", msg, data),
    error: (msg, data?) => log("error", msg, data),
  };
}

export { LOG_LEVELS, colors };
