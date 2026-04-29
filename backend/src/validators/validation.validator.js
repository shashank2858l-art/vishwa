/**
 * Validation (Community Trust) Validation Rules
 */

const { param } = require('express-validator');

const voteRules = [
  param('complaintId')
    .isUUID().withMessage('Invalid complaint ID'),
];

const verifyRules = [
  param('complaintId')
    .isUUID().withMessage('Invalid complaint ID'),
];

module.exports = { voteRules, verifyRules };
