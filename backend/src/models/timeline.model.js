/**
 * Timeline Model — Data access layer for complaint_timeline table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'complaint_timeline';

const TimelineModel = {
  /**
   * Create a new timeline entry.
   * @param {Object} data - { complaint_id, status, note, updated_by, proof_urls }
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: entry, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return entry;
  },

  /**
   * Get all timeline entries for a complaint, ordered chronologically.
   * @param {string} complaintId - UUID
   * @returns {Promise<Array>}
   */
  async findByComplaintId(complaintId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: true });

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get the latest timeline entry for a complaint.
   * @param {string} complaintId - UUID
   * @returns {Promise<Object|null>}
   */
  async getLatest(complaintId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },
};

module.exports = TimelineModel;
