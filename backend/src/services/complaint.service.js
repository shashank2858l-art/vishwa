/**
 * Complaint Service — Core business logic for grievance complaints.
 */

const ComplaintModel = require('../models/complaint.model');
const TimelineModel = require('../models/timeline.model');
const AuditLogModel = require('../models/auditLog.model');
const AIService = require('./ai.service');
const { generateComplaintCode, generatePinCode } = require('../utils/codeGenerator');
const { COMPLAINT_STATUS, AUDIT_ACTIONS, STATUS_TRANSITIONS, PAGINATION } = require('../config/constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const ComplaintService = {
  /**
   * Create a new complaint.
   * Generates tracking code + PIN, creates initial timeline entry, logs audit.
   * Then runs AI moderation and applies the decision.
   */
  async createComplaint(data, userId) {
    const complaintCode = generateComplaintCode();
    const pinCode = generatePinCode();

    const complaint = await ComplaintModel.create({
      complaint_code: complaintCode,
      pin_code: pinCode,
      submitted_by: userId,
      anonymous: data.anonymous || false,
      proxy_mode: data.proxy_mode || false,
      title: data.title,
      raw_text: data.raw_text,
      category: data.category,
      priority: data.priority || 'medium',
      location: data.location,
      media_urls: data.media_urls || [],
      status: COMPLAINT_STATUS.SUBMITTED,
      escalation_level: 0,
      genuineness_score: 0,
    });

    // Create initial timeline entry
    await TimelineModel.create({
      complaint_id: complaint.id,
      status: COMPLAINT_STATUS.SUBMITTED,
      note: 'Complaint submitted successfully',
      updated_by: userId,
    });

    // Audit log
    await AuditLogModel.create({
      complaint_id: complaint.id,
      action: AUDIT_ACTIONS.COMPLAINT_CREATED,
      actor: userId,
      metadata: { anonymous: data.anonymous || false },
    });

    logger.info(`Complaint created: ${complaintCode} by user ${userId}`);

    // ── AI MODERATION ─────────────────────────────
    let aiAnalysis = null;
    try {
      aiAnalysis = await AIService.moderateComplaint(complaint.raw_text, complaint.category, complaint.location);

      // Store AI data using EXISTING columns only (no schema migration needed)
      // ai_summary: JSON string with full analysis
      // genuineness_score: authenticity_score
      // urgency_score: urgency_score
      // category/priority: AI-suggested values
      // status: based on publish_decision
      const aiSummaryPayload = JSON.stringify({
        summary: aiAnalysis.summary,
        decision: aiAnalysis.publish_decision,
        department: aiAnalysis.department,
        spam_score: aiAnalysis.spam_score,
        authenticity_score: aiAnalysis.authenticity_score,
        sentiment: aiAnalysis.sentiment,
        is_spam: aiAnalysis.is_spam,
        is_abusive: aiAnalysis.is_abusive,
        public_safety_risk: aiAnalysis.public_safety_risk,
        key_issues: aiAnalysis.key_issues,
        moderation_notes: aiAnalysis.moderation_notes,
        english_translation: aiAnalysis.english_translation,
        rejection_reason: aiAnalysis.rejection_reason,
      });

      const aiUpdates = {
        ai_summary: aiSummaryPayload,
        category: aiAnalysis.category,
        priority: aiAnalysis.priority,
        urgency_score: aiAnalysis.urgency_score,
        genuineness_score: aiAnalysis.authenticity_score,
      };

      // Apply publish decision to status
      // NOTE: DB only allows: submitted, verified, assigned, under_review, action_taken, resolved
      // For 'rejected' decisions, we keep status as 'submitted' and store decision in ai_summary JSON
      if (aiAnalysis.publish_decision === 'auto_publish') {
        aiUpdates.status = COMPLAINT_STATUS.VERIFIED;
      }
      // 'rejected' and 'pending_review' both keep SUBMITTED status — ai_summary.decision has the truth

      const updatedComplaint = await ComplaintModel.update(complaint.id, aiUpdates);

      // Timeline entry for AI decision
      const decisionLabel = aiAnalysis.publish_decision === 'auto_publish'
        ? 'AI verified and auto-published'
        : aiAnalysis.publish_decision === 'rejected'
          ? `AI rejected: ${aiAnalysis.rejection_reason || 'Spam detected'}`
          : 'Held for admin verification by AI';

      await TimelineModel.create({
        complaint_id: complaint.id,
        status: updatedComplaint.status,
        note: decisionLabel,
        updated_by: null,
      });

      await AuditLogModel.create({
        complaint_id: complaint.id,
        action: AUDIT_ACTIONS.AI_MODERATED,
        actor: null,
        metadata: { decision: aiAnalysis.publish_decision, priority: aiAnalysis.priority },
      });

      logger.info(`AI moderated ${complaintCode}: ${aiAnalysis.publish_decision} (priority: ${aiAnalysis.priority})`);

      return {
        ...updatedComplaint,
        complaint_code: complaintCode,
        pin_code: pinCode,
        ai_analysis: aiAnalysis,
      };
    } catch (aiErr) {
      // AI failure is non-critical — complaint is already saved
      logger.error(`AI moderation failed for ${complaintCode}: ${aiErr.message}`);
    }

    return {
      ...complaint,
      complaint_code: complaintCode,
      pin_code: pinCode,
      ai_analysis: aiAnalysis,
    };
  },

  /**
   * Get a complaint by ID.
   * Strips submitter identity if complaint is anonymous.
   * 
   * @param {string} id - Complaint UUID
   * @param {Object} requestingUser - The user making the request
   * @returns {Promise<Object>}
   */
  async getComplaint(id, requestingUser) {
    const complaint = await ComplaintModel.findById(id);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    // Strip identity for anonymous complaints unless requester is the submitter or admin
    if (
      complaint.anonymous &&
      requestingUser.id !== complaint.submitted_by &&
      requestingUser.role !== 'admin'
    ) {
      complaint.submitted_by = null;
    }

    // Never expose PIN in regular GET
    delete complaint.pin_code;

    return complaint;
  },

  /**
   * Track a complaint using public complaint_code + pin_code.
   * No authentication required — this is the public tracking endpoint.
   * 
   * @param {string} code - Complaint tracking code
   * @param {string} pin - 6-digit PIN
   * @returns {Promise<Object>}
   */
  async trackComplaint(code, pin) {
    let complaint;
    if (pin) {
      complaint = await ComplaintModel.findByCode(code, pin);
    } else {
      // Track by code only — limited fields (no sensitive data)
      complaint = await ComplaintModel.findByCodeOnly(code);
    }

    if (!complaint) {
      throw AppError.notFound('No complaint found with this code');
    }

    // Get timeline for the complaint
    const timeline = await TimelineModel.findByComplaintId(complaint.id);

    return { complaint, timeline };
  },

  /**
   * Update a complaint.
   * Validates status transitions, creates timeline entry, logs audit.
   * 
   * @param {string} id - Complaint UUID
   * @param {Object} updates - Fields to update
   * @param {Object} updatedBy - User performing the update
   * @returns {Promise<Object>}
   */
  async updateComplaint(id, updates, updatedBy) {
    const existing = await ComplaintModel.findById(id);

    if (!existing) {
      throw AppError.notFound('Complaint not found');
    }

    // Validate status transition if status is being changed
    if (updates.status && updates.status !== existing.status) {
      const allowedTransitions = STATUS_TRANSITIONS[existing.status] || [];

      if (!allowedTransitions.includes(updates.status)) {
        throw AppError.badRequest(
          `Invalid status transition: ${existing.status} → ${updates.status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
        );
      }
    }

    const complaint = await ComplaintModel.update(id, updates);

    // If status changed, add timeline entry
    if (updates.status && updates.status !== existing.status) {
      await TimelineModel.create({
        complaint_id: id,
        status: updates.status,
        note: updates.note || `Status updated to ${updates.status}`,
        updated_by: updatedBy.id,
      });

      await AuditLogModel.create({
        complaint_id: id,
        action: AUDIT_ACTIONS.STATUS_CHANGED,
        actor: updatedBy.id,
        metadata: {
          from: existing.status,
          to: updates.status,
        },
      });
    } else {
      await AuditLogModel.create({
        complaint_id: id,
        action: AUDIT_ACTIONS.COMPLAINT_UPDATED,
        actor: updatedBy.id,
        metadata: { fields: Object.keys(updates) },
      });
    }

    logger.info(`Complaint ${existing.complaint_code} updated by ${updatedBy.id}`);

    return complaint;
  },

  /**
   * List complaints with filters and pagination.
   * 
   * @param {Object} filters - Filter criteria
   * @param {number} page
   * @param {number} limit
   * @param {Object} user - Requesting user (for role-based filtering)
   * @returns {Promise<{ data: Array, count: number }>}
   */
  async listComplaints(filters, page, limit, user) {
    // Clamp pagination
    page = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT));

    // Citizens only see their own complaints (skip for public/null user)
    if (user && user.role === 'citizen') {
      filters.submitted_by = user.id;
    }

    const result = await ComplaintModel.list(filters, page, limit);

    // Strip anonymous submitter info
    result.data = result.data.map((complaint) => {
      if (complaint.anonymous) {
        // For public access (no user) or non-admin non-owner, strip submitter
        if (!user || (complaint.submitted_by !== user.id && user.role !== 'admin')) {
          return { ...complaint, submitted_by: null };
        }
      }
      return complaint;
    });

    return { ...result, page, limit };
  },

  /**
   * Upload proof/media files for a complaint.
   * 
   * @param {string} complaintId - UUID
   * @param {Array} fileUrls - Array of uploaded file URLs
   * @param {string} userId - Uploading user's ID
   * @returns {Promise<Object>}
   */
  async uploadProof(complaintId, fileUrls, userId) {
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      throw AppError.notFound('Complaint not found');
    }

    // Append new URLs to existing media_urls
    const updatedUrls = [...(complaint.media_urls || []), ...fileUrls];

    const updated = await ComplaintModel.update(complaintId, {
      media_urls: updatedUrls,
    });

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.PROOF_UPLOADED,
      actor: userId,
      metadata: { files_added: fileUrls.length, total_files: updatedUrls.length },
    });

    logger.info(`${fileUrls.length} files uploaded for complaint ${complaint.complaint_code}`);

    return updated;
  },
};

module.exports = ComplaintService;
