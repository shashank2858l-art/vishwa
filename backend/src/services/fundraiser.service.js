/**
 * Fundraiser Service — Business logic for community support fundraisers.
 */

const FundraiserModel = require('../models/fundraiser.model');
const DonationModel = require('../models/donation.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const FundraiserService = {
  /**
   * Create a new fundraiser campaign.
   */
  async create(data, userId) {
    const fundraiser = await FundraiserModel.create({
      title: data.title,
      description: data.description,
      category: data.category || 'other',
      goal_amount: data.goal_amount || 0,
      raised_amount: 0,
      creator_id: userId || null,
      creator_name: data.creator_name,
      creator_email: data.creator_email || null,
      creator_phone: data.creator_phone || null,
      upi_id: data.upi_id || null,
      status: 'active',
      donor_count: 0,
    });

    logger.info(`Fundraiser created: ${fundraiser.id} by ${data.creator_name}`);
    return fundraiser;
  },

  /**
   * Upload image to fundraiser
   */
  async uploadImage(id, url, userId) {
    const fundraiser = await FundraiserModel.findById(id);
    if (!fundraiser) throw AppError.notFound('Fundraiser not found');
    
    // Optional: add authorization check to ensure only creator can upload
    if (fundraiser.creator_id && fundraiser.creator_id !== userId) {
      throw AppError.forbidden('You can only modify your own fundraisers');
    }

    const updated = await FundraiserModel.update(id, { image_url: url });
    logger.info(`Fundraiser image updated: ${id}`);
    return updated;
  },

  /**
   * List fundraisers with optional filters.
   */
  async list(filters = {}, page = 1, limit = 20) {
    return FundraiserModel.list(filters, page, limit);
  },

  /**
   * Get a single fundraiser by ID.
   */
  async getById(id) {
    const fundraiser = await FundraiserModel.findById(id);
    if (!fundraiser) throw AppError.notFound('Fundraiser not found');
    return fundraiser;
  },

  /**
   * Record a donation to a fundraiser.
   */
  async donate(fundraiserId, data) {
    const fundraiser = await FundraiserModel.findById(fundraiserId);
    if (!fundraiser) throw AppError.notFound('Fundraiser not found');
    if (fundraiser.status !== 'active') throw AppError.badRequest('This fundraiser is no longer accepting donations');

    const amount = parseInt(data.amount, 10);
    if (!amount || amount <= 0) throw AppError.badRequest('Invalid donation amount');

    // Record the donation
    const donation = await DonationModel.create({
      fundraiser_id: fundraiserId,
      donor_id: data.donor_id || null,
      donor_name: data.donor_name || 'Anonymous',
      amount,
    });

    // Update fundraiser totals
    const newRaised = (fundraiser.raised_amount || 0) + amount;
    const newDonorCount = (fundraiser.donor_count || 0) + 1;
    const updates = {
      raised_amount: newRaised,
      donor_count: newDonorCount,
    };

    // Auto-complete if goal reached
    if (fundraiser.goal_amount > 0 && newRaised >= fundraiser.goal_amount) {
      updates.status = 'completed';
    }

    await FundraiserModel.update(fundraiserId, updates);

    logger.info(`Donation of ₹${amount} to fundraiser ${fundraiserId} by ${data.donor_name || 'Anonymous'}`);

    return { donation, new_total: newRaised };
  },

  /**
   * Get total raised across all fundraisers (for admin dashboard).
   */
  async getTotalRaised() {
    return FundraiserModel.getTotalRaised();
  },
};

module.exports = FundraiserService;
