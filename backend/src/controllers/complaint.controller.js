/**
 * Complaint Controller — Handlers for complaint CRUD operations.
 */

const ComplaintService = require('../services/complaint.service');
const UploadService = require('../services/upload.service');
const { sendSuccess, sendPaginated } = require('../utils/response');

const ComplaintController = {
  async create(req, res, next) {
    try {
      const complaint = await ComplaintService.createComplaint(req.body, req.user.id);
      return sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async createAnonymous(req, res, next) {
    try {
      const data = { ...req.body, anonymous: true };
      const complaint = await ComplaintService.createComplaint(data, null);
      return sendSuccess(res, complaint, 'Anonymous complaint submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const complaint = await ComplaintService.getComplaint(req.params.id, req.user);
      return sendSuccess(res, complaint, 'Complaint retrieved');
    } catch (err) {
      next(err);
    }
  },

  async trackByCode(req, res, next) {
    try {
      const { code } = req.params;
      const { pin } = req.query;
      const result = await ComplaintService.trackComplaint(code, pin);
      return sendSuccess(res, result, 'Complaint tracked successfully');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const complaint = await ComplaintService.updateComplaint(req.params.id, req.body, req.user);
      return sendSuccess(res, complaint, 'Complaint updated');
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { status, category, priority, page, limit } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (priority) filters.priority = priority;

      const result = await ComplaintService.listComplaints(filters, page, limit, req.user);
      return sendPaginated(res, result.data, result.page, result.limit, result.count);
    } catch (err) {
      next(err);
    }
  },

  async publicList(req, res, next) {
    try {
      const { category, priority, page, limit } = req.query;
      const filters = {};
      // PUBLIC FEED: Only show verified (auto-published) complaints
      // This excludes: rejected (spam), pending_review (needs admin), and newly submitted
      filters.status = 'verified';
      if (category) filters.category = category;
      if (priority) filters.priority = priority;

      const result = await ComplaintService.listComplaints(filters, page || 1, limit || 50, null);

      // Secondary safety filter: exclude any complaint AI flagged as rejected
      // (in case status was manually changed but ai_summary still says rejected)
      result.data = result.data.filter(c => {
        if (!c.ai_summary) return true; // legacy complaints without AI
        try {
          const parsed = typeof c.ai_summary === 'string' && c.ai_summary.startsWith('{')
            ? JSON.parse(c.ai_summary)
            : null;
          if (parsed && parsed.decision === 'rejected') return false;
        } catch { /* not JSON, allow */ }
        return true;
      });

      return sendPaginated(res, result.data, result.page, result.limit, result.count);
    } catch (err) {
      next(err);
    }
  },

  async uploadProof(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return sendSuccess(res, null, 'No files uploaded', 400);
      }

      const urls = await UploadService.uploadMultiple(req.files);
      const complaint = await ComplaintService.uploadProof(req.params.id, urls, req.user.id);
      return sendSuccess(res, complaint, 'Files uploaded successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ComplaintController;
