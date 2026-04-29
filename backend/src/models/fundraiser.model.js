/**
 * Fundraiser Model — Data access layer for fundraisers table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'fundraisers';

const FundraiserModel = {
  /**
   * Create a new fundraiser.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: fundraiser, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return fundraiser;
  },

  /**
   * Find fundraiser by ID.
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
   * List fundraisers with filters and pagination.
   * @param {Object} filters - { status, category }
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{ data: Array, count: number }>}
   */
  async list(filters = {}, page = 1, limit = 20) {
    let query = supabaseAdmin
      .from(TABLE)
      .select('*', { count: 'exact' });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

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
   * Update a fundraiser.
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
   * Get total donated amount across all fundraisers.
   * @returns {Promise<number>}
   */
  async getTotalRaised() {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('raised_amount');

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return (data || []).reduce((sum, f) => sum + (f.raised_amount || 0), 0);
  },
};

module.exports = FundraiserModel;
