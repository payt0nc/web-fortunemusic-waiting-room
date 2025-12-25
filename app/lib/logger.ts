import pino from "pino";

/**
 * Create a pino logger with RFC3339 timestamp format
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});
