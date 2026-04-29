/**
 * Timeline Service — Business logic for complaint timeline management.
 */

const TimelineModel = require('../models/timeline.model');
const ComplaintModel = require('../models/complaint.model');
const AuditLogModel = require('../models/auditLog.model');
const { AUDIT_ACTIONS, STATUS_TRANSITIONS } = require('../config/constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const TimelineService = {
  /**
   * Add a timeline entry to a complaint.
   * Also updates the complaint's status if provided.
   * 
   * @param {string} complaintId - UUID
   * @param {Object} data - { status, note, proof_urls }
   * @param {string} userId - User adding the entry
   * @returns {Promise<Object>}
   */
  async addEntry(complaintId, data, userId) {
    // Verify complaint exists
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    // Validate status transition
    if (data.status !== complaint.status) {
      const allowed = STATUS_TRANSITIONS[complaint.status] || [];

      if (!allowed.includes(data.status)) {
        throw AppError.badRequest(
          `Cannot transition from "${complaint.status}" to "${data.status}". Allowed: ${allowed.join(', ') || 'none'}`,
        );
      }

      // Update complaint status
      await ComplaintModel.update(complaintId, { status: data.status });
    }

    // Create timeline entry
    const entry = await TimelineModel.create({
      complaint_id: complaintId,
      status: data.status,
      note: data.note,
      updated_by: userId,
      proof_urls: data.proof_urls || [],
    });

    // Audit log
    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.TIMELINE_ENTRY_ADDED,
      actor: userId,
      metadata: { status: data.status, note: data.note },
    });

    logger.info(`Timeline entry added for ${complaint.complaint_code}: ${data.status}`);

    return entry;
  },

  /**
   * Get the full timeline for a complaint.
   * 
   * @param {string} complaintId - UUID
   * @returns {Promise<Array>}
   */
  async getTimeline(complaintId) {
    // Verify complaint exists
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    return TimelineModel.findByComplaintId(complaintId);
  },
};

module.exports = TimelineService;
