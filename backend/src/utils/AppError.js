/**
 * AppError — Custom operational error class.
 * 
 * Use this for all known/expected errors (validation failures, not found, etc).
 * The global error handler distinguishes operational errors from programming bugs
 * using the `isOperational` flag.
 */

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (default 500)
   * @param {Array|Object|null} errors - Optional validation errors or details
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory: 400 Bad Request
   */
  static badRequest(message = 'Bad request', errors = null) {
    return new AppError(message, 400, errors);
  }

  /**
   * Factory: 401 Unauthorized
   */
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  /**
   * Factory: 403 Forbidden
   */
  static forbidden(message = 'Forbidden — insufficient permissions') {
    return new AppError(message, 403);
  }

  /**
   * Factory: 404 Not Found
   */
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  /**
   * Factory: 409 Conflict
   */
  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409);
  }

  /**
   * Factory: 429 Too Many Requests
   */
  static tooManyRequests(message = 'Too many requests — please try again later') {
    return new AppError(message, 429);
  }

  /**
   * Factory: 500 Internal Server Error
   */
  static internal(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
