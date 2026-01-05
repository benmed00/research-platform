/**
 * @file logger.ts
 * @description Structured logging utility using Pino
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 80
 * @size 2.3 KB
 */
import pino from "pino";

// Determine log level based on environment
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

// Create logger instance
const logger = pino({
  level: logLevel,
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Logger interface for type safety
export interface Logger {
  error: (obj: object | string, msg?: string, ...args: any[]) => void;
  warn: (obj: object | string, msg?: string, ...args: any[]) => void;
  info: (obj: object | string, msg?: string, ...args: any[]) => void;
  debug: (obj: object | string, msg?: string, ...args: any[]) => void;
  trace: (obj: object | string, msg?: string, ...args: any[]) => void;
}

// Create typed logger wrapper
export const log: Logger = {
  error: (obj: object | string, msg?: string, ...args: any[]) => {
    if (typeof obj === "string") {
      logger.error({ msg: obj, ...args }, msg);
    } else {
      logger.error(obj, msg, ...args);
    }
  },
  warn: (obj: object | string, msg?: string, ...args: any[]) => {
    if (typeof obj === "string") {
      logger.warn({ msg: obj, ...args }, msg);
    } else {
      logger.warn(obj, msg, ...args);
    }
  },
  info: (obj: object | string, msg?: string, ...args: any[]) => {
    if (typeof obj === "string") {
      logger.info({ msg: obj, ...args }, msg);
    } else {
      logger.info(obj, msg, ...args);
    }
  },
  debug: (obj: object | string, msg?: string, ...args: any[]) => {
    if (typeof obj === "string") {
      logger.debug({ msg: obj, ...args }, msg);
    } else {
      logger.debug(obj, msg, ...args);
    }
  },
  trace: (obj: object | string, msg?: string, ...args: any[]) => {
    if (typeof obj === "string") {
      logger.trace({ msg: obj, ...args }, msg);
    } else {
      logger.trace(obj, msg, ...args);
    }
  },
};

// Helper functions for common logging patterns
export const loggerHelpers = {
  /**
   * Log API errors with context
   */
  apiError: (error: Error, context: { route?: string; method?: string; userId?: string; [key: string]: any }) => {
    log.error(
      {
        err: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...context,
      },
      "API Error"
    );
  },

  /**
   * Log authentication events
   */
  authEvent: (event: string, context: { userId?: string; email?: string; [key: string]: any }) => {
    log.info({ event, ...context }, "Authentication Event");
  },

  /**
   * Log database operations
   */
  dbOperation: (operation: string, context: { entity?: string; entityId?: string; [key: string]: any }) => {
    log.debug({ operation, ...context }, "Database Operation");
  },

  /**
   * Log rate limit events
   */
  rateLimit: (context: { identifier: string; limit: number; remaining: number; [key: string]: any }) => {
    log.warn({ ...context }, "Rate Limit Exceeded");
  },
};

export default log;

