/**
 * Timeline Controller
 */

const TimelineService = require('../services/timeline.service');
const { sendSuccess } = require('../utils/response');

const TimelineController = {
  async addEntry(req, res, next) {
    try {
      const entry = await TimelineService.addEntry(req.params.complaintId, req.body, req.user.id);
      return sendSuccess(res, entry, 'Timeline entry added', 201);
    } catch (err) {
      next(err);
    }
  },

  async getTimeline(req, res, next) {
    try {
      const timeline = await TimelineService.getTimeline(req.params.complaintId);
      return sendSuccess(res, timeline, 'Timeline retrieved');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TimelineController;
