import logger from "../utils/logger.js";

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  logger.error({
    message: err.message,
    status: err.statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  const message = err.statusCode === 500 ? "Internal server error" : err.message;
  res.status(err.statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
