/**
 * Express Application Factory
 * 
 * Configures middleware stack, mounts routes, and sets up error handling.
 * Exported separately from server.js for testability.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const sanitize = require('./middleware/sanitize');
const { authenticatedLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const { sendSuccess } = require('./utils/response');

const app = express();

// ─── Security Headers ──────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────
app.use(cors({
  origin: env.corsOrigin.split(',').map((o) => o.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body Parsing ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Input Sanitization ────────────────────────────────
app.use(sanitize);

// ─── Global Rate Limiter ────────────────────────────────
app.use('/api', authenticatedLimiter);

// ─── Request Logging ────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
});

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  }, 'Server is running');
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───────────────────────────────
app.use(errorHandler);

module.exports = app;
