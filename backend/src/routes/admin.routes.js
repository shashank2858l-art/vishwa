/**
 * Admin Routes
 */

const { Router } = require('express');
const AdminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { assignRules, resolveRules } = require('../validators/admin.validator');

const router = Router();

// All admin routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard-stats', AdminController.getDashboardStats);
router.get('/queues', AdminController.getQueues);

// AI Moderation Queues
router.get('/pending-verification', AdminController.getPendingVerification);
router.get('/critical-alerts', AdminController.getCriticalAlerts);
router.get('/spam-rejected', AdminController.getSpamRejected);

// Admin Actions
router.post('/approve/:id', AdminController.approveComplaint);
router.post('/reject/:id', AdminController.rejectComplaint);
router.post('/assign/:complaintId', validate(assignRules), AdminController.assignComplaint);
router.post('/resolve/:complaintId', validate(resolveRules), AdminController.resolveComplaint);

module.exports = router;
