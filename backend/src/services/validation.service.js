/**
 * Validation Service — Community trust scoring logic.
 * 
 * Handles support votes (any citizen) and trusted verifications (validators only).
 * Recalculates genuineness_score after each action.
 */

const ValidationModel = require('../models/validation.model');
const ComplaintModel = require('../models/complaint.model');
const AuditLogModel = require('../models/auditLog.model');
const { VALIDATION_TYPES, GENUINENESS_WEIGHTS, AUDIT_ACTIONS } = require('../config/constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Recalculate and update a complaint's genuineness score.
 * Score = (support_votes × SUPPORT_WEIGHT) + (trusted_verifies × VERIFY_WEIGHT)
 * Capped at 100.
 * 
 * @param {string} complaintId
 */
async function recalculateGenuineness(complaintId) {
  const counts = await ValidationModel.countByComplaint(complaintId);

  const score = Math.min(
    100,
    (counts.support_votes * GENUINENESS_WEIGHTS.SUPPORT_VOTE) +
    (counts.trusted_verifies * GENUINENESS_WEIGHTS.TRUSTED_VERIFY),
  );

  await ComplaintModel.update(complaintId, { genuineness_score: score });

  return score;
}

const ValidationService = {
  /**
   * Add a support vote to a complaint.
   * Any authenticated user can vote once per complaint.
   * 
   * @param {string} complaintId - UUID
   * @param {string} userId - Voting user's ID
   * @returns {Promise<Object>}
   */
  async vote(complaintId, userId) {
    // Verify complaint exists
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    // Check for duplicate vote
    const existing = await ValidationModel.findUserVote(
      complaintId,
      userId,
      VALIDATION_TYPES.SUPPORT_VOTE,
    );

    if (existing) {
      throw AppError.conflict('You have already voted on this complaint');
    }

    // Create vote
    const validation = await ValidationModel.create({
      complaint_id: complaintId,
      user_id: userId,
      type: VALIDATION_TYPES.SUPPORT_VOTE,
    });

    // Recalculate genuineness
    const newScore = await recalculateGenuineness(complaintId);

    // Audit
    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.VOTE_ADDED,
      actor: userId,
      metadata: { new_genuineness_score: newScore },
    });

    logger.info(`Support vote added for ${complaint.complaint_code} by ${userId}. Score: ${newScore}`);

    return { validation, genuineness_score: newScore };
  },

  /**
   * Add a trusted verification to a complaint.
   * Only users with 'validator' role can verify.
   * 
   * @param {string} complaintId - UUID
   * @param {string} userId - Validator's ID
   * @returns {Promise<Object>}
   */
  async verify(complaintId, userId) {
    // Verify complaint exists
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    // Check for duplicate verification
    const existing = await ValidationModel.findUserVote(
      complaintId,
      userId,
      VALIDATION_TYPES.TRUSTED_VERIFY,
    );

    if (existing) {
      throw AppError.conflict('You have already verified this complaint');
    }

    // Create verification
    const validation = await ValidationModel.create({
      complaint_id: complaintId,
      user_id: userId,
      type: VALIDATION_TYPES.TRUSTED_VERIFY,
    });

    // Recalculate genuineness
    const newScore = await recalculateGenuineness(complaintId);

    // Audit
    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.VERIFICATION_ADDED,
      actor: userId,
      metadata: { new_genuineness_score: newScore },
    });

    logger.info(`Trusted verification added for ${complaint.complaint_code} by ${userId}. Score: ${newScore}`);

    return { validation, genuineness_score: newScore };
  },
};

module.exports = ValidationService;
