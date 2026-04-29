/**
 * Admin Service — Administrative operations for the grievance platform.
 */

const ComplaintModel = require('../models/complaint.model');
const AssignmentModel = require('../models/assignment.model');
const TimelineModel = require('../models/timeline.model');
const AuditLogModel = require('../models/auditLog.model');
const UserModel = require('../models/user.model');
const { COMPLAINT_STATUS, AUDIT_ACTIONS } = require('../config/constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const AdminService = {
  async getDashboardStats() {
    const baseStats = await ComplaintModel.getStats();

    const { supabaseAdmin } = require('../config/supabase');

    // Count pending review (submitted status + ai_summary contains pending_review)
    const { count: pendingReview } = await supabaseAdmin
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'submitted')
      .like('ai_summary', '%pending_review%');

    // Count auto-published (verified status + ai_summary contains auto_publish)
    const { count: autoPublished } = await supabaseAdmin
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'verified');

    // Count rejected
    const { count: spamRejected } = await supabaseAdmin
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Count critical
    const { count: criticalAlerts } = await supabaseAdmin
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .eq('priority', 'critical')
      .neq('status', 'resolved');

    return {
      ...baseStats,
      ai: {
        pending_review: pendingReview || 0,
        auto_published: autoPublished || 0,
        spam_rejected: spamRejected || 0,
        critical_alerts: criticalAlerts || 0,
      },
    };
  },

  async getQueues(filters = {}) {
    const result = await ComplaintModel.list(filters, 1, 100);
    return result;
  },

  /**
   * Get complaints pending admin verification (AI flagged as pending_review).
   */
  async getPendingVerification() {
    const { supabaseAdmin } = require('../config/supabase');
    const { data, error } = await supabaseAdmin
      .from('complaints')
      .select('*')
      .eq('status', 'submitted')
      .like('ai_summary', '%pending_review%')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw AppError.internal(`Database error: ${error.message}`);
    return data || [];
  },

  /**
   * Get critical/safety alert complaints.
   */
  async getCriticalAlerts() {
    const { supabaseAdmin } = require('../config/supabase');
    const { data, error } = await supabaseAdmin
      .from('complaints')
      .select('*')
      .eq('priority', 'critical')
      .neq('status', 'resolved')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw AppError.internal(`Database error: ${error.message}`);
    return data || [];
  },

  /**
   * Get spam/rejected complaints.
   */
  async getSpamRejected() {
    const { supabaseAdmin } = require('../config/supabase');
    const { data, error } = await supabaseAdmin
      .from('complaints')
      .select('*')
      .like('ai_summary', '%"rejected"%')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw AppError.internal(`Database error: ${error.message}`);
    return data || [];
  },

  /**
   * Admin approves a pending complaint.
   */
  async approveComplaint(complaintId, adminId) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw AppError.notFound('Complaint not found');

    if (complaint.status !== COMPLAINT_STATUS.SUBMITTED) {
      throw AppError.badRequest('Only submitted complaints can be approved');
    }

    await ComplaintModel.update(complaintId, {
      status: COMPLAINT_STATUS.VERIFIED,
    });

    await TimelineModel.create({
      complaint_id: complaintId,
      status: COMPLAINT_STATUS.VERIFIED,
      note: 'Approved by admin after AI review',
      updated_by: adminId,
    });

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.COMPLAINT_APPROVED,
      actor: adminId,
      metadata: { previous_decision: complaint.ai_decision },
    });

    logger.info(`Complaint ${complaint.complaint_code} approved by admin ${adminId}`);
    return { message: 'Complaint approved and published' };
  },

  /**
   * Admin rejects a complaint.
   */
  async rejectComplaint(complaintId, reason, adminId) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw AppError.notFound('Complaint not found');

    await ComplaintModel.update(complaintId, {
      status: COMPLAINT_STATUS.REJECTED,
    });

    await TimelineModel.create({
      complaint_id: complaintId,
      status: COMPLAINT_STATUS.REJECTED,
      note: reason || 'Rejected by admin',
      updated_by: adminId,
    });

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.COMPLAINT_REJECTED,
      actor: adminId,
      metadata: { reason },
    });

    logger.info(`Complaint ${complaint.complaint_code} rejected by admin ${adminId}`);
    return { message: 'Complaint rejected' };
  },

  async assignComplaint(complaintId, assigneeId, assignedRole, adminId) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw AppError.notFound('Complaint not found');

    const assignee = await UserModel.findById(assigneeId);
    if (!assignee) throw AppError.notFound('Assignee user not found');

    const assignment = await AssignmentModel.create({
      complaint_id: complaintId,
      assigned_to: assigneeId,
      assigned_role: assignedRole,
    });

    await ComplaintModel.update(complaintId, { status: COMPLAINT_STATUS.ASSIGNED });

    await TimelineModel.create({
      complaint_id: complaintId,
      status: COMPLAINT_STATUS.ASSIGNED,
      note: `Assigned to ${assignee.name} (${assignedRole})`,
      updated_by: adminId,
    });

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.COMPLAINT_ASSIGNED,
      actor: adminId,
      metadata: { assigned_to: assigneeId, assigned_role: assignedRole },
    });

    logger.info(`Complaint ${complaint.complaint_code} assigned to ${assignee.name} by admin ${adminId}`);
    return assignment;
  },

  async resolveComplaint(complaintId, resolutionNote, adminId) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw AppError.notFound('Complaint not found');

    if (complaint.status === COMPLAINT_STATUS.RESOLVED) {
      throw AppError.badRequest('Complaint is already resolved');
    }

    await ComplaintModel.update(complaintId, { status: COMPLAINT_STATUS.RESOLVED });

    await TimelineModel.create({
      complaint_id: complaintId,
      status: COMPLAINT_STATUS.RESOLVED,
      note: resolutionNote,
      updated_by: adminId,
    });

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.COMPLAINT_RESOLVED,
      actor: adminId,
      metadata: { resolution_note: resolutionNote },
    });

    logger.info(`Complaint ${complaint.complaint_code} resolved by admin ${adminId}`);
    return { message: 'Complaint resolved successfully' };
  },
};

module.exports = AdminService;
