/**
 * Validation Middleware
 * 
 * Runs express-validator validation chains and returns
 * structured 400 errors if any rules fail.
 * 
 * Usage:
 *   router.post('/route', validate(myRules), controller);
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Factory: Creates middleware that runs validation rules
 * and short-circuits with 400 if errors exist.
 * 
 * @param {Array} rules - Array of express-validator validation chains
 * @returns {Array} Middleware array: [...rules, errorChecker]
 */
function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        }));

        return sendError(res, 'Validation failed', 400, formattedErrors);
      }

      next();
    },
  ];
}

module.exports = validate;
