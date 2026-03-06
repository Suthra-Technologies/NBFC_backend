const logger = require("./logger");

/**
 * 9. Security Logging and Monitoring Failures - Utility to log security-sensitive events.
 * Use this for logins, role changes, data deletions, and administrative actions.
 */
const logAuditEvent = (event, userId, details = {}, ip = "unknown") => {
    const auditData = {
        timestamp: new Date().toISOString(),
        event,
        userId,
        ip,
        details,
    };

    logger.info(`[AUDIT] ${JSON.stringify(auditData)}`);

    // In a real application, you would also save this to a database
    // dedicated to audit logs for long-term retention and querying.
};

module.exports = {
    logAuditEvent,
};
