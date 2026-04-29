/**
 * AI Routes
 */

const { Router } = require('express');
const AIController = require('../controllers/ai.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.post(
  '/process-complaint',
  authenticate,
  authorize('admin'),
  AIController.processComplaint,
);

module.exports = router;
