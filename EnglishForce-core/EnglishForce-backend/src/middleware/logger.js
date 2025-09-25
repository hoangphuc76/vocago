import logger from '../config/logger.config.js';

const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Bỏ qua log với OPTIONS
  if (req.method === "OPTIONS") {
    return next();
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(message);
    } else if (statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
};

export default httpLogger;

