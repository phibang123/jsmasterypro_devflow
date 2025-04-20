import pino from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isEdge
    ? undefined
    : !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
            sync: true,
          },
        }
      : undefined,
  formatters: {
    level: (label) => ({ level: label.toLowerCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Cleanup function for logger
const cleanupLogger = () => {
  if (logger.flush) {
    logger.flush();
  }
};

export { logger, cleanupLogger };
export default logger;
