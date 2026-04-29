const env = require('../config/env');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { ROLES } = require('../config/constants');

async function seedAdminUser(retries = 3) {
  try {
    const { adminEmail, adminPassword } = env;

    // Check if admin already exists
    const existingAdmin = await UserModel.findByEmail(adminEmail);
    if (existingAdmin) {
      // If admin exists but password or role needs checking, skip for now to avoid overwriting password
      logger.info(`Admin user already exists: ${adminEmail}`);
      return;
    }

    // Create default admin
    const password_hash = await bcrypt.hash(adminPassword, 10);
    
    await UserModel.create({
      name: 'System Administrator',
      email: adminEmail,
      phone: null,
      password_hash,
      role: ROLES.ADMIN,
    });

    logger.info(`Default admin user created: ${adminEmail}`);
  } catch (err) {
    if (retries > 0) {
      logger.warn(`Failed to seed admin user. Retrying in 5s... (${retries} retries left). Error: ${err.message}`);
      setTimeout(() => seedAdminUser(retries - 1), 5000);
    } else {
      logger.error('Failed to seed admin user after multiple attempts:', err);
    }
  }
}

module.exports = { seedAdminUser };
