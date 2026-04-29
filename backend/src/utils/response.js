/**
 * Standardized API Response Helpers
 * 
 * Every API response goes through these functions to ensure
 * consistent structure across the entire platform.
 */

/**
 * Send a success response.
 * 
 * @param {import('express').Response} res
 * @param {*} data - Response payload
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send an error response.
 * 
 * @param {import('express').Response} res
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Array|Object|null} errors - Optional detailed errors
 */
function sendError(res, message = 'Something went wrong', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a paginated success response.
 * 
 * @param {import('express').Response} res
 * @param {Array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total item count
 * @param {string} message - Human-readable message
 */
function sendPaginated(res, data, page, limit, total, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

module.exports = { sendSuccess, sendError, sendPaginated };
