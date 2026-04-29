/**
 * Global Error Handler Middleware
 * 
 * Catches all errors thrown in route handlers and services.
 * Distinguishes between operational errors (AppError) and programming bugs.
 * Returns consistent error response structure.
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');
const env = require('../config/env');

/**
 * Express error handling middleware (4 args).
 */
function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} — ${message}`, {
      stack: err.stack,
      body: req.body,
      userId: req.user?.id,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} — ${statusCode} ${message}`);
  }

  // In production, don't leak internal error details
  if (env.isProd && !err.isOperational) {
    message = 'Internal server error';
    errors = null;
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = `File too large. Maximum size is ${env.maxFileSizeMB}MB`;
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  return sendError(res, message, statusCode, errors);
}

module.exports = errorHandler;
