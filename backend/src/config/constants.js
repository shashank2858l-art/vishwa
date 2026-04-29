/**
 * Application Constants
 * Single source of truth for enums, thresholds, and defaults.
 */

/** Complaint status flow — ordered by lifecycle progression */
const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  ASSIGNED: 'assigned',
  UNDER_REVIEW: 'under_review',
  ACTION_TAKEN: 'action_taken',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
  REJECTED: 'rejected',
};

/** Valid status values as array (for validation) */
const VALID_STATUSES = Object.values(COMPLAINT_STATUS);

/** Allowed status transitions — maps current status to array of valid next statuses */
const STATUS_TRANSITIONS = {
  [COMPLAINT_STATUS.SUBMITTED]: [COMPLAINT_STATUS.VERIFIED, COMPLAINT_STATUS.ESCALATED, COMPLAINT_STATUS.REJECTED],
  [COMPLAINT_STATUS.VERIFIED]: [COMPLAINT_STATUS.ASSIGNED, COMPLAINT_STATUS.ESCALATED],
  [COMPLAINT_STATUS.ASSIGNED]: [COMPLAINT_STATUS.UNDER_REVIEW, COMPLAINT_STATUS.ESCALATED],
  [COMPLAINT_STATUS.UNDER_REVIEW]: [COMPLAINT_STATUS.ACTION_TAKEN, COMPLAINT_STATUS.ESCALATED],
  [COMPLAINT_STATUS.ACTION_TAKEN]: [COMPLAINT_STATUS.RESOLVED, COMPLAINT_STATUS.ESCALATED],
  [COMPLAINT_STATUS.RESOLVED]: [],
  [COMPLAINT_STATUS.ESCALATED]: [COMPLAINT_STATUS.ASSIGNED, COMPLAINT_STATUS.UNDER_REVIEW],
  [COMPLAINT_STATUS.REJECTED]: [COMPLAINT_STATUS.SUBMITTED], // Allow resubmission
};

/** User roles */
const ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  NGO: 'ngo',
  VALIDATOR: 'validator',
};

const VALID_ROLES = Object.values(ROLES);

/** Complaint categories */
const CATEGORIES = [
  'water',
  'roads',
  'sanitation',
  'harassment',
  'corruption',
  'ration',
  'safety',
  'abuse',
  'other',
];

/** Complaint priorities */
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

/** AI Publish decisions */
const PUBLISH_DECISIONS = {
  AUTO_PUBLISH: 'auto_publish',
  PENDING_REVIEW: 'pending_review',
  REJECTED: 'rejected',
  DUPLICATE: 'duplicate',
};

/** Department routing map */
const DEPARTMENTS = {
  water: 'Municipal Water Board',
  roads: 'Roads & Transport Department',
  sanitation: 'Sanitation & Public Health',
  harassment: 'Women & Child Welfare / Police',
  corruption: 'Anti-Corruption Bureau',
  ration: 'Food & Civil Supplies',
  safety: 'Police / Emergency Services',
  abuse: 'Women & Child Welfare',
  other: 'District Administration',
};

/** Safety keywords — trigger critical priority + pending_review */
const SAFETY_KEYWORDS = [
  'assault', 'kidnapping', 'kidnap', 'domestic violence', 'theft', 'rape',
  'child abuse', 'murder', 'riot', 'fire', 'arson', 'bomb', 'explosion',
  'stabbing', 'shooting', 'acid attack', 'molestation', 'trafficking',
  'suicide', 'hostage', 'armed', 'weapon', 'gun', 'knife attack',
  'gang', 'extortion', 'blackmail', 'death threat', 'missing child',
  'missing person', 'drowning', 'collapsed building', 'gas leak',
];

/** Validation types */
const VALIDATION_TYPES = {
  SUPPORT_VOTE: 'support_vote',
  TRUSTED_VERIFY: 'trusted_verify',
};

const VALID_VALIDATION_TYPES = Object.values(VALIDATION_TYPES);

/** Pagination defaults */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/** Audit log actions */
const AUDIT_ACTIONS = {
  COMPLAINT_CREATED: 'complaint_created',
  COMPLAINT_UPDATED: 'complaint_updated',
  COMPLAINT_ESCALATED: 'complaint_escalated',
  STATUS_CHANGED: 'status_changed',
  COMPLAINT_ASSIGNED: 'complaint_assigned',
  COMPLAINT_RESOLVED: 'complaint_resolved',
  COMPLAINT_REJECTED: 'complaint_rejected',
  COMPLAINT_APPROVED: 'complaint_approved',
  VOTE_ADDED: 'vote_added',
  VERIFICATION_ADDED: 'verification_added',
  PROOF_UPLOADED: 'proof_uploaded',
  AI_PROCESSED: 'ai_processed',
  AI_MODERATED: 'ai_moderated',
  TIMELINE_ENTRY_ADDED: 'timeline_entry_added',
};

/** Genuineness score weights */
const GENUINENESS_WEIGHTS = {
  SUPPORT_VOTE: 1,
  TRUSTED_VERIFY: 5,
};

module.exports = {
  COMPLAINT_STATUS,
  VALID_STATUSES,
  STATUS_TRANSITIONS,
  ROLES,
  VALID_ROLES,
  CATEGORIES,
  PRIORITIES,
  PUBLISH_DECISIONS,
  DEPARTMENTS,
  SAFETY_KEYWORDS,
  VALIDATION_TYPES,
  VALID_VALIDATION_TYPES,
  PAGINATION,
  AUDIT_ACTIONS,
  GENUINENESS_WEIGHTS,
};

