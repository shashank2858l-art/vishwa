/**
 * Donation Model — Data access layer for donations table.
 */

const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLE = 'donations';

const DonationModel = {
  /**
   * Create a donation record.
   * @param {Object} data - { fundraiser_id, donor_id, donor_name, amount }
   * @returns {Promise<Object>}
   */
  async create(data) {
    const { data: donation, error } = await supabaseAdmin
      .from(TABLE)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return donation;
  },

  /**
   * Get donations for a fundraiser.
   * @param {string} fundraiserId - UUID
   * @returns {Promise<Array>}
   */
  async findByFundraiserId(fundraiserId) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('fundraiser_id', fundraiserId)
      .order('created_at', { ascending: false });

    if (error) {
      throw AppError.internal(`Database error: ${error.message}`);
    }

    return data || [];
  },
};

module.exports = DonationModel;
