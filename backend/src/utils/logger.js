/**
 * Winston Logger
 * 
 * Console transport in development (colorized).
 * File transport in production (JSON, rotated by PM2/logrotate).
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const env = require('../config/env');

const { combine, timestamp, printf, colorize, errors, json } = format;

/** Custom console format for development */
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, stack, ...meta }) => {
    let log = `${ts} [${level}]: ${message}`;

    if (stack) {
      log += `\n${stack}`;
    }

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  }),
);

/** Structured JSON format for production */
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const logger = createLogger({
  level: env.isDev ? 'debug' : 'info',
  format: env.isDev ? devFormat : prodFormat,
  defaultMeta: { service: 'grievance-api' },
  transports: [
    new transports.Console(),
  ],
});

// Add file transports in production
if (env.isProd) {
  const logsDir = path.resolve(__dirname, '../../logs');

  logger.add(
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
  );

  logger.add(
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  );
}

module.exports = logger;
