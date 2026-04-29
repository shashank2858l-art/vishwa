/**
 * Rate Limiter Presets
 * 
 * Uses express-rate-limit with configurable windows.
 * Different presets for public vs authenticated routes.
 */

const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { sendError } = require('../utils/response');

/**
 * Strict rate limiter for public endpoints (auth, tracking).
 * 30 requests per 15 minutes per IP.
 */
const publicLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many requests — please try again later', 429);
  },
});

/**
 * Moderate rate limiter for authenticated endpoints.
 * Uses the configured max from env.
 */
const authenticatedLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise fall back to IP
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    sendError(res, 'Rate limit exceeded — please slow down', 429);
  },
});

/**
 * Very strict limiter for sensitive operations (e.g., login attempts).
 * 5 requests per 15 minutes per IP.
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for development testing (was 5)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many attempts — account temporarily locked', 429);
  },
});

/**
 * Face auth limiter — slightly more lenient for camera retries.
 * 10 requests per 5 minutes per IP.
 */
const faceLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many face verification attempts — please wait a few minutes', 429);
  },
});

module.exports = { publicLimiter, authenticatedLimiter, strictLimiter, faceLimiter };
