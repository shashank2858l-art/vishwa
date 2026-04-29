/**
 * Validation Routes — Community voting and trusted verification.
 */

const { Router } = require('express');
const ValidationController = require('../controllers/validation.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { voteRules, verifyRules } = require('../validators/validation.validator');

const router = Router();

router.post(
  '/:complaintId/vote',
  authenticate,
  validate(voteRules),
  ValidationController.vote,
);

router.post(
  '/:complaintId/verify',
  authenticate,
  authorize('validator'),
  validate(verifyRules),
  ValidationController.verify,
);

module.exports = router;
