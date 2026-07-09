/**
 * middleware/requestLogger.js
 * log ทุก HTTP request เข้ามา (ใช้ร่วมกับ morgan + custom logger)
 */

const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      ua: req.get('user-agent') || '-',
    };

    // log ตาม status code
    if (res.statusCode >= 500) {
      logger.error(message, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  });

  next();
}

module.exports = requestLogger;