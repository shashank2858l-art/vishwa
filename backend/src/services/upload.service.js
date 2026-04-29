/**
 * Upload Service — File uploads to Supabase Storage.
 */

const { supabaseAdmin } = require('../config/supabase');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { generateUUID } = require('../utils/codeGenerator');

const UploadService = {
  /**
   * Upload a file to Supabase Storage.
   * @param {Buffer} fileBuffer
   * @param {string} originalName
   * @param {string} mimeType
   * @returns {Promise<string>} Public URL of the uploaded file
   */
  async uploadFile(fileBuffer, originalName, mimeType) {
    const ext = originalName.split('.').pop();
    const fileName = `${Date.now()}-${generateUUID()}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from(env.uploadBucket)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      logger.error(`File upload failed: ${error.message}`);
      throw AppError.internal('File upload failed');
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(env.uploadBucket)
      .getPublicUrl(filePath);

    logger.info(`File uploaded: ${filePath}`);
    return urlData.publicUrl;
  },

  /**
   * Upload multiple files.
   * @param {Array} files - Multer file objects
   * @returns {Promise<string[]>} Array of public URLs
   */
  async uploadMultiple(files) {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file.buffer, file.originalname, file.mimetype);
      urls.push(url);
    }
    return urls;
  },

  /**
   * Delete a file from Supabase Storage.
   * @param {string} filePath
   */
  async deleteFile(filePath) {
    const { error } = await supabaseAdmin.storage
      .from(env.uploadBucket)
      .remove([filePath]);

    if (error) {
      logger.error(`File deletion failed: ${error.message}`);
    }
  },
};

module.exports = UploadService;
