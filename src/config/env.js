const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES,
  redisUrl: process.env.REDIS_URL,
  nodeEnv: process.env.NODE_ENV,

  // Email Configuration
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || '"Finware System" <noreply@finware.com>',
  },

  // Domain Configuration
  appDomain: process.env.APP_DOMAIN || 'apphosting.com',

  // AWS Configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
  },
};