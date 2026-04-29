/**
 * Auth Service — Business logic for authentication.
 * 
 * Handles signup, login, and admin login.
 * Uses bcrypt for password hashing and JWT for token generation.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { ROLES } = require('../config/constants');
const UserModel = require('../models/user.model');
const AuditLogModel = require('../models/auditLog.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const SALT_ROUNDS = 12;

/**
 * Generate a JWT token for a user.
 * @param {Object} user - User object with id and role
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

/**
 * Strip sensitive fields from user object before sending to client.
 * @param {Object} user
 * @returns {Object}
 */
function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

const AuthService = {
  /**
   * Register a new user.
   * 
   * @param {Object} data - { name, email, phone, password, role? }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async signup(data) {
    const { name, email, phone, password, role } = data;

    // Check if user already exists
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw AppError.conflict('An account with this email already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      phone: phone || null,
      password_hash,
      role: role || ROLES.CITIZEN,
    });

    // Generate token
    const token = generateToken(user);

    logger.info(`New user registered: ${user.email} (${user.role})`);

    return { user: sanitizeUser(user), token };
  },

  /**
   * Authenticate a user with email and password.
   * 
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async login(email, password) {
    // Find user (need full record including password_hash)
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user);

    logger.info(`User logged in: ${user.email}`);

    return { user: sanitizeUser(user), token };
  },

  /**
   * Admin-specific login — validates role after authentication.
   * 
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async adminLogin(email, password) {
    const result = await this.login(email, password);

    if (result.user.role !== ROLES.ADMIN) {
      logger.warn(`Non-admin attempted admin login: ${email} (role: ${result.user.role})`);
      throw AppError.forbidden('This login is restricted to administrators');
    }

    logger.info(`Admin logged in: ${email}`);

    return result;
  },

  /**
   * Google Login — Verifies Supabase token and creates/logs in user.
   * 
   * @param {string} supabaseToken
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async googleLogin(supabaseToken) {
    const { supabaseAdmin } = require('../config/supabase');
    
    // Verify token with Supabase
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(supabaseToken);
    
    if (error || !supabaseUser) {
      throw AppError.unauthorized('Invalid Google session');
    }

    const email = supabaseUser.email;
    const name = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'Google User';

    // Check if user exists in our public.users table
    let user = await UserModel.findByEmail(email);

    if (!user) {
      // Create citizen user if doesn't exist
      user = await UserModel.create({
        name,
        email,
        phone: supabaseUser.phone || null,
        password_hash: 'GOOGLE_AUTH_USER', // Placeholder for social users
        role: ROLES.CITIZEN,
      });
      logger.info(`New Google user registered: ${user.email}`);
    }

    // Generate our custom JWT token
    const token = generateToken(user);

    logger.info(`Google user logged in: ${user.email}`);

    return { user: sanitizeUser(user), token };
  },

  /* ══════════════════════════════════════════════
     TWO-STEP ADMIN AUTHENTICATION
     ══════════════════════════════════════════════ */

  /**
   * Admin Login Step 1 — Validate credentials, return temporary token.
   * Does NOT grant dashboard access. Only proves password ownership.
   * 
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ tempToken: string, requiresFaceEnrollment: boolean }>}
   */
  async adminLoginStep1(email, password) {
    // Validate credentials (reuse existing logic)
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Must be admin
    if (user.role !== ROLES.ADMIN) {
      logger.warn(`Non-admin attempted admin login step1: ${email} (role: ${user.role})`);
      throw AppError.forbidden('This login is restricted to administrators');
    }

    // Check if admin has face registered
    const FaceService = require('./face.service');
    const hasFace = await FaceService.hasFaceRegistered(user.id);

    // Generate short-lived temp token (5 minutes)
    const tempToken = jwt.sign(
      { userId: user.id, role: user.role, step: 'face_pending' },
      env.tempTokenSecret,
      { expiresIn: '5m' },
    );

    logger.info(`Admin step1 passed: ${email} (face registered: ${hasFace})`);

    return { tempToken, requiresFaceEnrollment: !hasFace };
  },

  /**
   * Admin Login Step 2 — Verify face recognition, issue final JWT.
   * 
   * @param {string} tempToken - Temporary token from Step 1
   * @param {string} faceImage - Base64-encoded face image
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async adminLoginStep2(tempToken, faceImage) {
    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, env.tempTokenSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Verification session expired. Please login again.');
      }
      throw AppError.unauthorized('Invalid verification session');
    }

    if (decoded.step !== 'face_pending') {
      throw AppError.unauthorized('Invalid verification step');
    }

    // Verify face with Luxand
    const FaceService = require('./face.service');
    const result = await FaceService.verifyFace(decoded.userId, faceImage);

    if (!result.matched) {
      logger.warn(`Face verification FAILED for admin ${decoded.userId} (confidence: ${(result.confidence * 100).toFixed(1)}%)`);
      
      if (result.error === 'no_face_detected') {
        throw AppError.badRequest('No face detected in the image. Please center your face and try again.');
      }
      
      throw AppError.unauthorized('Face verification failed. Identity mismatch.');
    }

    // Face verified — issue final JWT
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw AppError.unauthorized('Admin account not found');
    }

    // Generate final JWT with faceVerified flag
    const token = jwt.sign(
      { userId: user.id, role: user.role, faceVerified: true },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn },
    );

    logger.info(`Admin face verified and fully logged in: ${user.email}`);

    return { user: sanitizeUser(user), token };
  },

  /**
   * Register an admin's face for future verification.
   * Must be called by an authenticated admin.
   * 
   * @param {string} adminId - Admin user UUID
   * @param {string} adminName - Admin display name
   * @param {string} faceImage - Base64-encoded face image
   * @returns {Promise<{ success: boolean }>}
   */
  async registerAdminFace(adminId, adminName, faceImage) {
    const FaceService = require('./face.service');
    const result = await FaceService.registerFace(adminId, adminName, faceImage);

    logger.info(`Admin face registered: ${adminId}`);

    return result;
  },
};

module.exports = AuthService;

