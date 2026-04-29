/**
 * Complaint Routes
 */

const { Router } = require('express');
const multer = require('multer');
const ComplaintController = require('../controllers/complaint.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { publicLimiter } = require('../middleware/rateLimiter');
const {
  createComplaintRules,
  updateComplaintRules,
  trackComplaintRules,
  complaintIdRule,
} = require('../validators/complaint.validator');
const env = require('../config/env');

const router = Router();

// Multer config — memory storage for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  },
});

// Public tracking route (no auth required)
router.get('/track/:code', publicLimiter, validate(trackComplaintRules), ComplaintController.trackByCode);

// Public anonymous submission (no auth required)
router.post('/submit-anonymous', publicLimiter, validate(createComplaintRules), ComplaintController.createAnonymous);

// Public feed — for community page (no auth required)
router.get('/feed', publicLimiter, ComplaintController.publicList);

// Authenticated routes
router.post('/create', authenticate, validate(createComplaintRules), ComplaintController.create);
router.get('/list', authenticate, ComplaintController.list);
router.get('/:id', authenticate, validate(complaintIdRule), ComplaintController.getById);
router.put('/:id/update', authenticate, validate(updateComplaintRules), ComplaintController.update);
router.post('/:id/upload-proof', authenticate, upload.array('files', 5), ComplaintController.uploadProof);

module.exports = router;
