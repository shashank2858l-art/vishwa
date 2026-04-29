/**
 * Fundraiser Controller — Thin handler layer for fundraiser routes.
 */

const FundraiserService = require('../services/fundraiser.service');
const UploadService = require('../services/upload.service');
const { sendSuccess } = require('../utils/response');

const FundraiserController = {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return sendSuccess(res, null, 'No file uploaded', 400);
      }
      
      const url = await UploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      const fundraiser = await FundraiserService.uploadImage(req.params.id, url, req.user.id);
      
      return sendSuccess(res, fundraiser, 'Image uploaded successfully');
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const result = await FundraiserService.create(req.body, userId);
      return sendSuccess(res, result, 'Fundraiser created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const { status, category, page = 1, limit = 20 } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      const result = await FundraiserService.list(filters, parseInt(page), parseInt(limit));
      return sendSuccess(res, result, 'Fundraisers retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await FundraiserService.getById(req.params.id);
      return sendSuccess(res, result, 'Fundraiser retrieved');
    } catch (err) {
      next(err);
    }
  },

  async donate(req, res, next) {
    try {
      const result = await FundraiserService.donate(req.params.id, {
        ...req.body,
        donor_id: req.user?.id || null,
      });
      return sendSuccess(res, result, 'Donation recorded successfully');
    } catch (err) {
      next(err);
    }
  },

  async getTotalRaised(req, res, next) {
    try {
      const total = await FundraiserService.getTotalRaised();
      return sendSuccess(res, { total }, 'Total raised retrieved');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = FundraiserController;
