/**
 * Code Generator Utilities
 * 
 * Generates unique complaint tracking codes and PIN codes
 * for the anonymous complaint tracking system.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique 8-character alphanumeric complaint code.
 * Format: GRV-XXXXXXXX (e.g., GRV-A3F8K2M1)
 * 
 * @returns {string} Complaint tracking code
 */
function generateComplaintCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous: 0/O, 1/I
  let code = '';

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `GRV-${code}`;
}

/**
 * Generate a 6-digit numeric PIN code for complaint access.
 * 
 * @returns {string} 6-digit PIN (zero-padded)
 */
function generatePinCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a UUID v4.
 * 
 * @returns {string} UUID
 */
function generateUUID() {
  return uuidv4();
}

module.exports = { generateComplaintCode, generatePinCode, generateUUID };
