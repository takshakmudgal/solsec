import { env } from "~/env";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogData {
  message: string;
  level: LogLevel;
  timestamp: string;
  [key: string]: unknown;
}

class Logger {
  private isProduction = env.NODE_ENV === "production";

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.log("debug", message, meta);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}): void {
    this.log("error", message, meta);
  }

  private log(
    level: LogLevel,
    message: string,
    meta: Record<string, unknown> = {},
  ): void {
    const timestamp = new Date().toISOString();

    const logData: LogData = {
      message,
      level,
      timestamp,
      ...meta,
    };

    if (this.isProduction) {
      console[level](JSON.stringify(logData));
    } else {
      const metaString =
        Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : "";

      console[level](
        `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`,
      );
    }
  }
}

export const logger = new Logger();
