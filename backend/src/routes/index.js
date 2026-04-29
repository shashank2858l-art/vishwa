/**
 * Route Index — Mounts all API route groups.
 */

const { Router } = require('express');

const authRoutes = require('./auth.routes');
const complaintRoutes = require('./complaint.routes');
const timelineRoutes = require('./timeline.routes');
const validationRoutes = require('./validation.routes');
const aiRoutes = require('./ai.routes');
const adminRoutes = require('./admin.routes');
const voiceRoutes = require('./voice.routes');
const fundraiserRoutes = require('./fundraiser.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/timeline', timelineRoutes);
router.use('/validation', validationRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/voice', voiceRoutes);
router.use('/fundraisers', fundraiserRoutes);

module.exports = router;
