export type LogValue = string | number | boolean | null | undefined;
export type LogContext = Record<string, LogValue>;

type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  event: string;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
};

function toError(error: unknown): Error | null {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return null;
}

function buildEntry(
  level: LogLevel,
  event: string,
  message: string,
  context?: LogContext,
  error?: unknown
): LogEntry {
  const normalizedError = toError(error);

  return {
    timestamp: new Date().toISOString(),
    level,
    event,
    message,
    context,
    error: normalizedError
      ? {
          name: normalizedError.name,
          message: normalizedError.message,
          stack: normalizedError.stack,
        }
      : undefined,
  };
}

function writeLog(entry: LogEntry): void {
  const payload = JSON.stringify(entry);

  if (entry.level === "error") {
    console.error(payload);
    return;
  }

  if (entry.level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(event: string, message: string, context?: LogContext) {
    writeLog(buildEntry("info", event, message, context));
  },
  warn(event: string, message: string, context?: LogContext, error?: unknown) {
    writeLog(buildEntry("warn", event, message, context, error));
  },
  error(event: string, message: string, context?: LogContext, error?: unknown) {
    writeLog(buildEntry("error", event, message, context, error));
  },
};
