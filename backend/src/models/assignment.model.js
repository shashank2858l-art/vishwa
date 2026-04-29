/**
 * Assignment Model — Data access layer for assignments table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'assignments';

const AssignmentModel = {
  /**
   * Create a new assignment.
   * @param {Object} data - { complaint_id, assigned_to, assigned_role }
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: assignment, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return assignment;
  },

  /**
   * Find all assignments for a complaint.
   * @param {string} complaintId - UUID
   * @returns {Promise<Array>}
   */
  async findByComplaintId(complaintId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: false });

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Find all complaints assigned to a user.
   * @param {string} userId - UUID
   * @returns {Promise<Array>}
   */
  async findByAssignee(userId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*, complaints(*)')
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data || [];
  },
};

module.exports = AssignmentModel;
