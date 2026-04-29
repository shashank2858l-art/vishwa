/**
 * Environment Configuration
 * Centralizes all env var access with validation.
 * Fails fast on missing required variables in production.
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
];

/**
 * Validate that all required environment variables are set.
 * Throws in production, warns in development.
 */
function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;

    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }

    console.warn(`⚠️  ${message}`);
  }
}

validateEnv();

const env = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // AI
  geminiApiKey: process.env.GEMINI_API_KEY,

  // Face Recognition (Luxand.Cloud)
  luxandApiKey: process.env.LUXAND_API_KEY,
  tempTokenSecret: process.env.TEMP_TOKEN_SECRET || 'temp-token-dev-secret-32chars-min',

  // Escalation
  escalationThresholdHours: parseInt(process.env.ESCALATION_THRESHOLD_HOURS, 10) || 48,
  escalationCron: process.env.ESCALATION_CRON || '0 * * * *',

  // Upload
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  uploadBucket: process.env.UPLOAD_BUCKET || 'complaint-media',

  // Admin Defaults
  adminEmail: process.env.ADMIN_EMAIL || 'admin@vishwas.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
};

module.exports = env;
