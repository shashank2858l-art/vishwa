/**
 * Timeline Validation Rules
 */

const { body, param } = require('express-validator');
const { VALID_STATUSES } = require('../config/constants');

const addTimelineRules = [
  param('complaintId')
    .isUUID().withMessage('Invalid complaint ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('note')
    .notEmpty().withMessage('Note is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Note must be 5-1000 characters'),
];

module.exports = { addTimelineRules };
