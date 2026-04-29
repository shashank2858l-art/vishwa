/**
 * Admin Validation Rules
 */

const { body, param } = require('express-validator');
const { VALID_ROLES } = require('../config/constants');

const assignRules = [
  param('complaintId')
    .isUUID().withMessage('Invalid complaint ID'),

  body('assigned_to')
    .notEmpty().withMessage('Assignee user ID is required')
    .isUUID().withMessage('Assignee must be a valid user ID'),

  body('assigned_role')
    .notEmpty().withMessage('Assigned role is required')
    .isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}`),
];

const resolveRules = [
  param('complaintId')
    .isUUID().withMessage('Invalid complaint ID'),

  body('resolution_note')
    .notEmpty().withMessage('Resolution note is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Resolution note must be 10-2000 characters'),
];

module.exports = { assignRules, resolveRules };
