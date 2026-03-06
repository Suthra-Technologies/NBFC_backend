const { nodeEnv } = require("../config/env");

module.exports = (err, req, res, next) => {
  // 9. Security Logging - Ensure errors are logged internally
  console.error(`[Error] ${err.message}\nStack: ${err.stack}`);

  // 10. Exceptional Condition Mishandling - Hide stack trace in production
  const status = err.status || 500;
  const message = status === 500 && nodeEnv === "production"
    ? "An internal server error occurred"
    : err.message;

  res.status(status).json({
    success: false,
    message,
    ...(nodeEnv === "development" && { stack: err.stack }),
  });
};
