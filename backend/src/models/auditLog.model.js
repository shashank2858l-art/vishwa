/**
 * Audit Log Model — Data access layer for audit_logs table.
 * Every significant action is recorded here for accountability.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'audit_logs';

const AuditLogModel = {
  /**
   * Create an audit log entry.
   * @param {Object} data - { complaint_id, action, actor, metadata }
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: log, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      // Audit log failures should not crash the operation — log and continue
      console.error(`Audit log creation failed: ${error.message}`, data);
      return null;
    }

    return log;
  },

  /**
   * Get all audit logs for a complaint, ordered newest first.
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
};

module.exports = AuditLogModel;
