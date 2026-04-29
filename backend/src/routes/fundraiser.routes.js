/**
 * Fundraiser Routes — Community support fundraiser API endpoints.
 */

const { Router } = require('express');
const multer = require('multer');
const FundraiserController = require('../controllers/fundraiser.controller');
const { authenticate } = require('../middleware/auth');
const env = require('../config/env');

const router = Router();

// Multer config — memory storage for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  },
});

// Public routes
router.get('/', FundraiserController.list);
router.get('/total-raised', FundraiserController.getTotalRaised);
router.get('/:id', FundraiserController.getById);

// Authenticated routes
router.post('/', authenticate, FundraiserController.create);
router.post('/:id/upload-image', authenticate, upload.single('image'), FundraiserController.uploadImage);
router.post('/:id/donate', FundraiserController.donate);

module.exports = router;
