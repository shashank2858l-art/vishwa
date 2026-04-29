/**
 * Auth Controller — Thin handler layer for authentication routes.
 */

const AuthService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

const AuthController = {
  async signup(req, res, next) {
    try {
      const result = await AuthService.signup(req.body);
      return sendSuccess(res, result, 'Account created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async googleLogin(req, res, next) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ status: 'error', message: 'Token is required' });
      }
      const result = await AuthService.googleLogin(token);
      return sendSuccess(res, result, 'Google login successful');
    } catch (err) {
      next(err);
    }
  },

  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.adminLogin(email, password);
      return sendSuccess(res, result, 'Admin login successful');
    } catch (err) {
      next(err);
    }
  },

  /** Step 1: Validate admin credentials, return temp token */
  async adminLoginStep1(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }
      const result = await AuthService.adminLoginStep1(email, password);
      return sendSuccess(res, result, 'Step 1 passed. Proceed to face verification.');
    } catch (err) {
      next(err);
    }
  },

  /** Step 2: Verify face against Luxand, issue final JWT */
  async adminLoginStep2(req, res, next) {
    try {
      const { tempToken, faceImage } = req.body;
      if (!tempToken || !faceImage) {
        return res.status(400).json({ success: false, message: 'Temp token and face image are required' });
      }
      const result = await AuthService.adminLoginStep2(tempToken, faceImage);
      return sendSuccess(res, result, 'Face verified. Admin login complete.');
    } catch (err) {
      next(err);
    }
  },

  /** Register admin face — supports both full JWT and temp token (first-time enrollment) */
  async registerAdminFace(req, res, next) {
    try {
      const { faceImage, tempToken } = req.body;
      if (!faceImage) {
        return res.status(400).json({ success: false, message: 'Face image is required' });
      }

      let adminId, adminName;

      if (req.user) {
        // Authenticated admin (already logged in)
        adminId = req.user.id;
        adminName = req.user.name;
      } else if (tempToken) {
        // First-time enrollment via temp token from Step 1
        const jwt = require('jsonwebtoken');
        const env = require('../config/env');
        const UserModel = require('../models/user.model');

        try {
          const decoded = jwt.verify(tempToken, env.tempTokenSecret);
          if (decoded.step !== 'face_pending' || decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Invalid enrollment token' });
          }
          const user = await UserModel.findById(decoded.userId);
          if (!user) {
            return res.status(401).json({ success: false, message: 'Admin not found' });
          }
          adminId = user.id;
          adminName = user.name;
        } catch (err) {
          return res.status(401).json({ success: false, message: 'Enrollment session expired. Please login again.' });
        }
      } else {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const result = await AuthService.registerAdminFace(adminId, adminName, faceImage);
      return sendSuccess(res, result, 'Face registered successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
