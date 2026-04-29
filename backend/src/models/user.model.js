/**
 * User Model — Data access layer for users table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'users';

const UserModel = {
  /**
   * Find user by email.
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Find user by ID.
   * @param {string} id - UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('id, name, email, phone, role, created_at')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Create a new user.
   * @param {Object} userData - { name, email, phone, password_hash, role }
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert(userData)
      .select('id, name, email, phone, role, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw AppError.conflict('User with this email already exists');
      }
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Update user role.
   * @param {string} id - UUID
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async updateRole(id, role) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ role })
      .eq('id', id)
      .select('id, name, email, phone, role')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },
};

module.exports = UserModel;
