/**
 * Complaint Model — Data access layer for complaints table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'complaints';

const ComplaintModel = {
  /**
   * Create a new complaint.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: complaint, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return complaint;
  },

  /**
   * Find complaint by ID.
   * @param {string} id - UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Find complaint by tracking code and PIN.
   * @param {string} code - complaint_code
   * @param {string} pin - pin_code
   * @returns {Promise<Object|null>}
   */
  async findByCode(code, pin) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('id, complaint_code, title, ai_summary, category, priority, urgency_score, location, status, escalation_level, genuineness_score, created_at, updated_at')
      .eq('complaint_code', code.toUpperCase())
      .eq('pin_code', pin)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Find complaint by tracking code only (no PIN required).
   * Returns limited fields for public access.
   * @param {string} code - complaint_code
   * @returns {Promise<Object|null>}
   */
  async findByCodeOnly(code) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('id, complaint_code, title, ai_summary, category, priority, urgency_score, location, status, escalation_level, genuineness_score, anonymous, created_at, updated_at')
      .eq('complaint_code', code.toUpperCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * List complaints with filters and pagination.
   * @param {Object} filters - { status, category, priority, submitted_by }
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{ data: Array, count: number }>}
   */
  async list(filters = {}, page = 1, limit = 20) {
    let query = supabaseAdmin
      .from(TABLE)
      .select('id, complaint_code, pin_code, title, raw_text, ai_summary, category, priority, urgency_score, location, media_urls, status, escalation_level, genuineness_score, anonymous, submitted_by, created_at, updated_at', { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.submitted_by) {
      query = query.eq('submitted_by', filters.submitted_by);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  },

  /**
   * Update a complaint.
   * @param {string} id - UUID
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data;
  },

  /**
   * Find stale complaints for escalation.
   * Returns complaints in actionable statuses with no activity
   * past the threshold.
   * 
   * @param {number} thresholdHours
   * @returns {Promise<Array>}
   */
  async findStale(thresholdHours) {
    const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('id, complaint_code, title, status, escalation_level, created_at, updated_at')
      .in('status', ['submitted', 'assigned', 'under_review'])
      .lt('updated_at', cutoff);

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get aggregate statistics for dashboard.
   * @returns {Promise<Object>}
   */
  async getStats() {
    // Total count
    const { count: total } = await supabaseAdmin
      .from(TABLE)
      .select('id', { count: 'exact', head: true });

    // Count by status
    const statusCounts = {};
    const statuses = ['submitted', 'verified', 'assigned', 'under_review', 'action_taken', 'resolved', 'escalated'];

    for (const status of statuses) {
      const { count } = await supabaseAdmin
        .from(TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('status', status);

      statusCounts[status] = count || 0;
    }

    // Count by category
    const { data: categoryData } = await supabaseAdmin
      .from(TABLE)
      .select('category');

    const categoryCounts = {};
    if (categoryData) {
      categoryData.forEach((row) => {
        categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1;
      });
    }

    return {
      total: total || 0,
      byStatus: statusCounts,
      byCategory: categoryCounts,
    };
  },
};

module.exports = ComplaintModel;
