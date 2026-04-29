/**
 * AI Controller — AI-powered complaint processing.
 */

const AIService = require('../services/ai.service');
const { sendSuccess } = require('../utils/response');

const AIController = {
  async processComplaint(req, res, next) {
    try {
      const { complaintId } = req.body;

      if (!complaintId) {
        return res.status(400).json({ success: false, message: 'complaintId is required' });
      }

      const result = await AIService.processComplaint(complaintId);
      return sendSuccess(res, result, 'Complaint processed by AI successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AIController;
