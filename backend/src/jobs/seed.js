const env = require('../config/env');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { ROLES } = require('../config/constants');
const { supabaseAdmin } = require('../config/supabase');

async function seedAdminUser(retries = 3) {
  try {
    const { adminEmail, adminPassword } = env;

    // Check if admin already exists
    const existingAdmin = await UserModel.findByEmail(adminEmail);
    if (existingAdmin) {
      // Always sync password hash & role to match current env vars
      // This ensures password changes via env vars take effect on next deploy
      const password_hash = await bcrypt.hash(adminPassword, 12);
      const updates = { password_hash };

      // Ensure role is admin (in case it drifted)
      if (existingAdmin.role !== ROLES.ADMIN) {
        updates.role = ROLES.ADMIN;
      }

      const { error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('email', adminEmail);

      if (error) {
        logger.error(`Failed to sync admin password: ${error.message}`);
      } else {
        logger.info(`Admin user synced (password re-hashed): ${adminEmail}`);
      }
      return;
    }

    // Create default admin
    const password_hash = await bcrypt.hash(adminPassword, 12);
    
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
