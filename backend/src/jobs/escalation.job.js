/**
 * Escalation Job — Auto-escalates stale complaints.
 * 
 * Runs on a cron schedule. Finds complaints in actionable statuses
 * that haven't been updated within the threshold, and escalates them.
 */

const cron = require('node-cron');
const env = require('../config/env');
const ComplaintModel = require('../models/complaint.model');
const TimelineModel = require('../models/timeline.model');
const AuditLogModel = require('../models/auditLog.model');
const { COMPLAINT_STATUS, AUDIT_ACTIONS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Run the escalation check.
 */
async function runEscalation() {
  try {
    const staleComplaints = await ComplaintModel.findStale(env.escalationThresholdHours);

    if (staleComplaints.length === 0) {
      logger.debug('Escalation job: No stale complaints found');
      return;
    }

    logger.info(`Escalation job: Found ${staleComplaints.length} stale complaints`);

    for (const complaint of staleComplaints) {
      try {
        // Escalate
        await ComplaintModel.update(complaint.id, {
          status: COMPLAINT_STATUS.ESCALATED,
          escalation_level: (complaint.escalation_level || 0) + 1,
        });

        // Timeline entry
        await TimelineModel.create({
          complaint_id: complaint.id,
          status: COMPLAINT_STATUS.ESCALATED,
          note: `Auto-escalated: No activity for ${env.escalationThresholdHours} hours (Level ${(complaint.escalation_level || 0) + 1})`,
          updated_by: null, // System action
        });

        // Audit log
        await AuditLogModel.create({
          complaint_id: complaint.id,
          action: AUDIT_ACTIONS.COMPLAINT_ESCALATED,
          actor: null,
          metadata: {
            reason: 'auto_escalation',
            threshold_hours: env.escalationThresholdHours,
            previous_status: complaint.status,
            escalation_level: (complaint.escalation_level || 0) + 1,
          },
        });

        logger.warn(`Escalated complaint ${complaint.complaint_code} to level ${(complaint.escalation_level || 0) + 1}`);
      } catch (err) {
        logger.error(`Failed to escalate complaint ${complaint.id}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Escalation job failed: ${err.message}`);
  }
}

/**
 * Start the escalation cron job.
 */
function startEscalationJob() {
  const cronExpression = env.escalationCron;

  if (!cron.validate(cronExpression)) {
    logger.error(`Invalid escalation cron expression: ${cronExpression}`);
    return;
  }

  cron.schedule(cronExpression, runEscalation, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  });

  logger.info(`Escalation job scheduled: "${cronExpression}" (threshold: ${env.escalationThresholdHours}h)`);
}

module.exports = { startEscalationJob, runEscalation };
