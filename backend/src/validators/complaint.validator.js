/**
 * Complaint Validation Rules
 */

const { body, param, query } = require('express-validator');
const { VALID_STATUSES, CATEGORIES, PRIORITIES } = require('../config/constants');

const createComplaintRules = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),

  body('raw_text')
    .notEmpty().withMessage('Complaint description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),

  body('location')
    .optional()
    .isLength({ min: 2, max: 500 }).withMessage('Location must be 2-500 characters'),

  body('anonymous')
    .optional()
    .isBoolean().withMessage('Anonymous must be true or false'),

  body('proxy_mode')
    .optional()
    .isBoolean().withMessage('Proxy mode must be true or false'),

  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
];

const updateComplaintRules = [
  param('id')
    .isUUID().withMessage('Invalid complaint ID'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('title')
    .optional()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),

  body('category')
    .optional()
    .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
];

const trackComplaintRules = [
  param('code')
    .notEmpty().withMessage('Complaint code is required'),

  query('pin')
    .optional()
    .isLength({ min: 6, max: 6 }).withMessage('PIN must be 6 digits'),
];

const complaintIdRule = [
  param('id')
    .isUUID().withMessage('Invalid complaint ID'),
];

module.exports = {
  createComplaintRules,
  updateComplaintRules,
  trackComplaintRules,
  complaintIdRule,
};
