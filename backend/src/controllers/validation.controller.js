/**
 * Validation Controller — Community voting and verification.
 */

const ValidationService = require('../services/validation.service');
const { sendSuccess } = require('../utils/response');

const ValidationController = {
  async vote(req, res, next) {
    try {
      const result = await ValidationService.vote(req.params.complaintId, req.user.id);
      return sendSuccess(res, result, 'Vote recorded successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async verify(req, res, next) {
    try {
      const result = await ValidationService.verify(req.params.complaintId, req.user.id);
      return sendSuccess(res, result, 'Verification recorded successfully', 201);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ValidationController;
