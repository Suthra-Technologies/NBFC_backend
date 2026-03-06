const winston = require("winston");
const { nodeEnv } = require("../config/env");

/**
 * 9. Security Logging and Monitoring Failures - Use winston for structured logging.
 * Logs are stored in 'logs/error.log' for errors and 'logs/combined.log' for all events.
 */
const logger = winston.createLogger({
    level: nodeEnv === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: "nbfc-backend" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

module.exports = logger;
