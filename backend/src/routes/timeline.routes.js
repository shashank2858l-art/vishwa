/**
 * Timeline Routes
 */

const { Router } = require('express');
const TimelineController = require('../controllers/timeline.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addTimelineRules } = require('../validators/timeline.validator');

const router = Router();

router.post(
  '/:complaintId/add',
  authenticate,
  authorize('admin', 'ngo'),
  validate(addTimelineRules),
  TimelineController.addEntry,
);

router.get(
  '/:complaintId',
  authenticate,
  TimelineController.getTimeline,
);

module.exports = router;
