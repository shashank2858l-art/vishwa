/**
 * Server Entry Point
 * 
 * Starts the HTTP server, initializes cron jobs,
 * and handles graceful shutdown.
 */

const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { startEscalationJob } = require('./jobs/escalation.job');
const { seedAdminUser } = require('./jobs/seed');

const server = app.listen(env.port, () => {
  logger.info(`
  ══════════════════════════════════════════════════
  🚀 Grievance Platform API Server
  ──────────────────────────────────────────────────
  Environment : ${env.nodeEnv}
  Port        : ${env.port}
  Health      : http://localhost:${env.port}/api/health
  ══════════════════════════════════════════════════
  `);

  // Start cron jobs
  startEscalationJob();
  
  // Seed database
  seedAdminUser();
});

// ─── Graceful Shutdown ──────────────────────────────────
function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = server;
