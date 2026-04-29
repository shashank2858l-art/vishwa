/**
 * Auth Routes
 */

const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { signupRules, loginRules } = require('../validators/auth.validator');
const { publicLimiter, strictLimiter, faceLimiter } = require('../middleware/rateLimiter');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.post('/signup', publicLimiter, validate(signupRules), AuthController.signup);
router.post('/login', strictLimiter, validate(loginRules), AuthController.login);
router.post('/google', strictLimiter, AuthController.googleLogin);
router.post('/admin-login', strictLimiter, validate(loginRules), AuthController.adminLogin);

// Two-step admin authentication
router.post('/admin-login-step1', strictLimiter, AuthController.adminLoginStep1);
router.post('/admin-login-step2', faceLimiter, AuthController.adminLoginStep2);
router.post('/admin-register-face', faceLimiter, AuthController.registerAdminFace);

module.exports = router;

