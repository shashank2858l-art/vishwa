/**
 * Voice Routes — Process AI voice transcripts into complaints.
 */

const { Router } = require('express');
const ComplaintService = require('../services/complaint.service');
const logger = require('../utils/logger');

const router = Router();

/**
 * POST /api/voice/process-transcript
 * Takes the structured result from the Gemini Live AI conversation
 * and creates a complaint via the existing complaint service.
 */
router.post('/process-transcript', async (req, res) => {
  try {
    const {
      category = 'other',
      priority = 'medium',
      summary = '',
      location = '',
      original_text = '',
      translated_text = '',
      affected_people = 1,
      language = 'unknown',
    } = req.body;

    if (!summary && !translated_text && !original_text) {
      return res.status(400).json({
        success: false,
        message: 'No complaint content provided.',
      });
    }

    // Build payload compatible with existing complaint service
    const complaintData = {
      title: summary.slice(0, 100) || 'Voice Complaint',
      raw_text: translated_text || original_text || summary,
      category,
      priority,
      location: location || null,
      anonymous: true,
      proxy_mode: false,
      media_urls: [],
      metadata: {
        source: 'ai_voice_assistant',
        original_language: language,
        original_text,
        affected_people,
      },
    };

    const result = await ComplaintService.createComplaint(complaintData);

    logger.info(`Voice complaint created: ${result.complaint_code}`);

    return res.status(201).json({
      success: true,
      data: {
        id: result.id,
        complaint_code: result.complaint_code,
        pin_code: result.pin_code,
      },
      message: 'Complaint filed successfully via AI voice assistant.',
    });
  } catch (err) {
    logger.error('Voice transcript processing failed:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process voice complaint.',
    });
  }
});

module.exports = router;
