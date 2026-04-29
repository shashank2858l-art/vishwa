/**
 * Authentication & Authorization Middleware
 * 
 * - authenticate: Verifies JWT from Authorization header, attaches req.user
 * - authorize: Role-based access control factory
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Authenticate incoming request via JWT.
 * Extracts token from `Authorization: Bearer <token>`,
 * verifies signature, and attaches decoded user to `req.user`.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw AppError.unauthorized('Token not provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, env.jwtSecret);

    // Fetch fresh user data from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, phone, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw AppError.unauthorized('User not found or token invalid');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Invalid token'));
    }

    if (err.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Token expired'));
    }

    next(err);
  }
}

/**
 * Role-based authorization factory.
 * Returns middleware that checks if req.user.role is in the allowed roles.
 * 
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'ngo')
 * @returns {Function} Express middleware
 * 
 * @example
 * router.get('/admin-only', authenticate, authorize('admin'), handler);
 * router.get('/staff', authenticate, authorize('admin', 'ngo'), handler);
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization denied: user ${req.user.id} (role: ${req.user.role}) attempted to access route requiring [${roles.join(', ')}]`);
      return next(AppError.forbidden(`This action requires one of the following roles: ${roles.join(', ')}`));
    }

    next();
  };
}

module.exports = { authenticate, authorize };
