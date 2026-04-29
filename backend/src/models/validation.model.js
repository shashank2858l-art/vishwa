/**
 * Validation Model — Data access layer for validations table.
 * Handles community support votes and trusted verifications.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'validations';

const ValidationModel = {
  /**
   * Create a validation entry (vote or verification).
   * @param {Object} data - { complaint_id, user_id, type }
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: validation, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw AppError.conflict('You have already submitted this type of validation for this complaint');
      }
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return validation;
  },

  /**
   * Count validations for a complaint, grouped by type.
   * @param {string} complaintId - UUID
   * @returns {Promise<{ support_votes: number, trusted_verifies: number }>}
   */
  async countByComplaint(complaintId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('type')
      .eq('complaint_id', complaintId);

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    const counts = {
      support_votes: 0,
      trusted_verifies: 0,
    };

    if (data) {
      data.forEach((v) => {
        if (v.type === 'support_vote') counts.support_votes++;
        if (v.type === 'trusted_verify') counts.trusted_verifies++;
      });
    }

    return counts;
  },

  /**
   * Check if a user has already voted/verified for a complaint.
   * @param {string} complaintId
   * @param {string} userId
   * @param {string} type
   * @returns {Promise<Object|null>}
   */
  async findUserVote(complaintId, userId, type) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('complaint_id', complaintId)
      .eq('user_id', userId)
      .eq('type', type)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },
};

module.exports = ValidationModel;
