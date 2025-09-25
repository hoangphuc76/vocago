import logger from '../config/logger.config.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Something went wrong';


  // Ghi log lỗi chi tiết bằng Winston
  logger.error(
    `${statusCode} - ${errorMessage} - URL: ${req.originalUrl} - Method: ${req.method} - Stack: ${err.stack}`
  );

  const response = {
    success: false,
    message: errorMessage,
  };

  // Chỉ gửi stack trace ở môi trường development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
