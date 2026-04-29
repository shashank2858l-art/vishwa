/**
 * Face Recognition Service — Luxand.Cloud API Integration.
 * 
 * Provides face enrollment (register) and verification (search/match)
 * for the two-step admin authentication flow.
 */

const env = require('../config/env');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const LUXAND_BASE_URL = 'https://api.luxand.cloud';

/**
 * Make a request to the Luxand.Cloud API.
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
async function luxandRequest(endpoint, options = {}) {
  if (!env.luxandApiKey || env.luxandApiKey === 'your-luxand-api-key-here') {
    throw AppError.internal('Luxand API key not configured. Set LUXAND_API_KEY in .env');
  }

  const url = `${LUXAND_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'token': env.luxandApiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(`Luxand API error: ${response.status} ${errorText}`);
    
    if (response.status === 401) {
      throw AppError.internal('Invalid Luxand API key');
    }
    if (response.status === 429) {
      throw AppError.internal('Luxand API rate limit exceeded');
    }
    throw AppError.internal(`Face recognition service error: ${response.status}`);
  }

  return response.json();
}

const FaceService = {
  /**
   * Register an admin's face with Luxand.Cloud.
   * Creates a subject (person) and uploads their face image.
   * 
   * @param {string} adminId - Admin user UUID
   * @param {string} adminName - Admin display name
   * @param {string} imageBase64 - Base64-encoded face image (JPEG/PNG)
   * @returns {Promise<{ subjectId: string, success: boolean }>}
   */
  async registerFace(adminId, adminName, imageBase64) {
    const subjectName = `admin_${adminId}`;

    // Clean base64 string (remove data:image/... prefix if present)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(cleanBase64, 'base64');

    const formData = new FormData();
    formData.append('name', subjectName);
    formData.append('store', '1');
    formData.append('photos', new Blob([imageBuffer], { type: 'image/jpeg' }), 'face.jpg');

    // Create person and upload face in a single request (V2 API)
    const result = await luxandRequest('/v2/person', {
      method: 'POST',
      body: formData,
    });

    if (result.status === 'failure') {
      if (result.message?.includes('No matching images found') || result.message?.includes('no faces') || result.message?.includes('find faces')) {
        throw AppError.badRequest('No face detected in the image. Please center your face and try again.');
      }
      throw AppError.internal(`Face registration failed: ${result.message}`);
    }

    logger.info(`Face registered for admin ${adminId}: subject=${subjectName}, uuid=${result.uuid}`);

    return {
      subjectId: subjectName,
      success: true,
      faceId: result.uuid,
    };
  },

  /**
   * Verify an admin's face against their registered Luxand subject.
   * 
   * @param {string} adminId - Admin user UUID
   * @param {string} imageBase64 - Base64-encoded face image to verify
   * @returns {Promise<{ matched: boolean, confidence: number }>}
   */
  async verifyFace(adminId, imageBase64) {
    const subjectName = `admin_${adminId}`;

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(cleanBase64, 'base64');

    const formData = new FormData();
    formData.append('photo', new Blob([imageBuffer], { type: 'image/jpeg' }), 'face.jpg');

    try {
      const result = await luxandRequest('/photo/search/v2', {
        method: 'POST',
        body: formData,
      });

      if (result.status === 'failure') {
        if (result.message?.includes('No matching images found') || result.message?.includes('no faces') || result.message?.includes('find faces')) {
          return { matched: false, confidence: 0, error: 'no_face_detected' };
        }
        throw AppError.internal(`Face verification failed: ${result.message}`);
      }

      // result is an array of matched subjects with probability scores
      if (!Array.isArray(result) || result.length === 0) {
        logger.warn(`No face match found for admin ${adminId}`);
        return { matched: false, confidence: 0 };
      }

      // Find the match for this admin's subject
      const adminMatch = result.find(
        (match) => match.name === subjectName || match.subject === subjectName
      );

      if (!adminMatch) {
        logger.warn(`Face detected but no match for subject ${subjectName}`);
        return { matched: false, confidence: 0 };
      }

      const confidence = adminMatch.probability || adminMatch.confidence || 0;
      const CONFIDENCE_THRESHOLD = 0.85; // 85% minimum match

      const matched = confidence >= CONFIDENCE_THRESHOLD;

      logger.info(`Face verification for ${adminId}: matched=${matched}, confidence=${(confidence * 100).toFixed(1)}%`);

      return { matched, confidence };
    } catch (err) {
      if (err.message?.includes('No face found') || err.message?.includes('no faces') || err.message?.includes('No matching images found') || err.message?.includes('find faces')) {
        return { matched: false, confidence: 0, error: 'no_face_detected' };
      }
      throw err;
    }
  },

  /**
   * Check if an admin has a registered face subject.
   * @param {string} adminId 
   * @returns {Promise<boolean>}
   */
  async hasFaceRegistered(adminId) {
    const subjectName = `admin_${adminId}`;
    try {
      // V2 get person list and check if name exists
      const result = await luxandRequest('/v2/person', {
        method: 'GET',
      });
      if (Array.isArray(result)) {
        return result.some(person => person.name === subjectName);
      }
      return false;
    } catch {
      return false;
    }
  },
};

module.exports = FaceService;
