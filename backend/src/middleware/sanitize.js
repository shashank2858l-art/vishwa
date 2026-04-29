/**
 * Input Sanitization Middleware
 * 
 * Recursively sanitizes request body, query, and params:
 * - Trims whitespace from strings
 * - Escapes HTML entities to prevent XSS
 * - Removes null bytes
 */

/**
 * Recursively sanitize an object's string values.
 * 
 * @param {*} obj - Value to sanitize
 * @returns {*} Sanitized value
 */
function sanitizeValue(obj) {
  if (typeof obj === 'string') {
    return obj
      .trim()
      .replace(/\0/g, '')                    // Remove null bytes
      .replace(/</g, '&lt;')                 // Escape HTML
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeValue);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeValue(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 */
function sanitize(req, res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
}

module.exports = sanitize;
