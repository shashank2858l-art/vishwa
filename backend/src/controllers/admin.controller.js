/**
 * Admin Controller — Dashboard, AI queues, assignment, and resolution handlers.
 */

const AdminService = require('../services/admin.service');
const { sendSuccess } = require('../utils/response');

const AdminController = {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await AdminService.getDashboardStats();
      return sendSuccess(res, stats, 'Dashboard stats retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getQueues(req, res, next) {
    try {
      const { status, category, priority } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (priority) filters.priority = priority;

      const result = await AdminService.getQueues(filters);
      return sendSuccess(res, result, 'Queues retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getPendingVerification(req, res, next) {
    try {
      const data = await AdminService.getPendingVerification();
      return sendSuccess(res, data, 'Pending verification queue retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getCriticalAlerts(req, res, next) {
    try {
      const data = await AdminService.getCriticalAlerts();
      return sendSuccess(res, data, 'Critical alerts retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getSpamRejected(req, res, next) {
    try {
      const data = await AdminService.getSpamRejected();
      return sendSuccess(res, data, 'Spam/rejected complaints retrieved');
    } catch (err) {
      next(err);
    }
  },

  async approveComplaint(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AdminService.approveComplaint(id, req.user.id);
      return sendSuccess(res, result, 'Complaint approved');
    } catch (err) {
      next(err);
    }
  },

  async rejectComplaint(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await AdminService.rejectComplaint(id, reason, req.user.id);
      return sendSuccess(res, result, 'Complaint rejected');
    } catch (err) {
      next(err);
    }
  },

  async assignComplaint(req, res, next) {
    try {
      const { complaintId } = req.params;
      const { assigned_to, assigned_role } = req.body;
      const result = await AdminService.assignComplaint(complaintId, assigned_to, assigned_role, req.user.id);
      return sendSuccess(res, result, 'Complaint assigned successfully');
    } catch (err) {
      next(err);
    }
  },

  async resolveComplaint(req, res, next) {
    try {
      const { complaintId } = req.params;
      const { resolution_note } = req.body;
      const result = await AdminService.resolveComplaint(complaintId, resolution_note, req.user.id);
      return sendSuccess(res, result, 'Complaint resolved successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AdminController;
