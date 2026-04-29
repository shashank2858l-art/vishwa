/**
 * API ↔ Frontend Type Transformers
 * Bridges the naming/shape differences between backend and frontend.
 */

import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, TimelineEvent, ProofOfAction, ReportingMode } from "./types";
import type { ApiComplaint, ApiTimelineEntry } from "@/services/complaintService";

/* ── Backend → Frontend ─────────────────────────── */

import { extractFundingConfig } from "./fundingUtils";

export function mapApiComplaintToFrontend(api: ApiComplaint, timeline?: ApiTimelineEntry[]): Complaint {
  let reportingMode: ReportingMode = "self";
  if (api.anonymous) reportingMode = "anonymous";
  else if (api.proxy_mode) reportingMode = "proxy";

  const { cleanText, config } = extractFundingConfig(api.raw_text);
  
  let targetAmount, commission, amountRaised, qrCodeUrl;
  const mediaUrls = [...(api.media_urls || [])];

  if (config) {
    targetAmount = config.target;
    commission = config.commission;
    amountRaised = 0; // Mock initial value
    // We will generate a real scannable QR code based on the target amount and complaint ID
    // instead of mistakenly using the first uploaded image (which is usually just a photo of the issue).
    qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=vishwas@platform&pn=VishwasFund&am=${targetAmount}&cu=INR&tn=DonationFor_${api.id}`;
  }

  // Parse AI summary
  let summary = api.ai_summary || "";
  let aiDecision: Complaint['aiDecision'] = undefined;
  let aiDepartment: string | undefined = undefined;
  let spamScore: number | undefined = undefined;
  let authenticityScore: number | undefined = undefined;
  let aiSentiment: string | undefined = undefined;
  let isPublicSafetyRisk = false;
  let aiKeyIssues: string[] | undefined = undefined;
  let aiRejectionReason: string | undefined = undefined;
  let aiModerationNotes: string | undefined = undefined;

  try {
    if (api.ai_summary && api.ai_summary.startsWith("{")) {
      const parsed = JSON.parse(api.ai_summary);
      summary = parsed.summary || "";
      aiDecision = parsed.decision;
      aiDepartment = parsed.department;
      spamScore = parsed.spam_score;
      authenticityScore = parsed.authenticity_score;
      aiSentiment = parsed.sentiment;
      isPublicSafetyRisk = parsed.public_safety_risk || false;
      aiKeyIssues = parsed.key_issues;
      aiRejectionReason = parsed.rejection_reason;
      aiModerationNotes = parsed.moderation_notes;
    }
  } catch {
    // Legacy plain-text summary
  }

  // FORCE AI decision to be rejected if the overall status is rejected
  if (api.status === 'rejected') {
    aiDecision = 'rejected';
  }

  const DEPARTMENT_MAP: Record<string, string> = {
    water: "Municipal Water Board",
    roads: "Public Works Department",
    sanitation: "Sanitation Department",
    safety: "Police Department",
    electricity: "Electricity Board",
    harassment: "Women & Child Safety Cell",
    corruption: "Anti-Corruption Bureau",
    ration: "Food & Civil Supplies Dept",
    abuse: "Social Welfare Department",
    other: "General Civic Administration"
  };
  const MOCK_OFFICERS = [
    "A. Sharma", "R. Verma", "S. Patel", "M. Reddy", 
    "K. Singh", "P. Kumar", "N. Gupta", "T. Rao", 
    "V. Desai", "D. Joshi"
  ];
  
  const assignedDepartment = DEPARTMENT_MAP[api.category] || "General Civic Administration";
  const hashId = api.complaint_code || api.id || "1234";
  const hash = hashId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const assignedOfficer = MOCK_OFFICERS[hash % MOCK_OFFICERS.length];

  return {
    id: api.complaint_code || api.id,
    pin: api.pin_code || "",
    rawText: cleanText,
    category: api.category as ComplaintCategory,
    priority: api.priority as ComplaintPriority,
    status: api.status as ComplaintStatus,
    reportingMode,
    proxyReporter: api.proxy_reporter,
    summary,
    location: api.location || undefined,
    affectedPeople: undefined,
    mediaUrls,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    communityVotes: 0,
    validatorEndorsements: 0,
    genuinenessScore: api.genuineness_score || 0,
    timeline: timeline ? timeline.map(mapApiTimelineToFrontend) : [],
    proofOfAction: timeline ? extractProofFromTimeline(timeline) : [],
    escalationLevel: api.escalation_level || 0,
    approved: api.status !== 'rejected',
    department: aiDepartment,
    routedTo: undefined,
    aiConfidence: api.urgency_score ? api.urgency_score / 100 : undefined,
    targetAmount,
    commission,
    amountRaised,
    qrCodeUrl,
    aiDecision,
    spamScore,
    authenticityScore,
    aiSentiment,
    isPublicSafetyRisk,
    aiKeyIssues,
    aiRejectionReason,
    aiModerationNotes,

    // Internal reference to UUID for API calls
    _apiId: api.id,
    assignedDepartment,
    assignedOfficer,
  };
}

export function mapApiTimelineToFrontend(entry: ApiTimelineEntry): TimelineEvent {
  return {
    id: entry.id,
    status: entry.status as ComplaintStatus,
    timestamp: entry.created_at,
    note: entry.note || undefined,
    actor: entry.updated_by || "System",
    actorRole: "system",
  };
}

function extractProofFromTimeline(timeline: ApiTimelineEntry[]): ProofOfAction[] {
  return timeline
    .filter((t) => t.proof_urls && t.proof_urls.length > 0)
    .flatMap((t) =>
      t.proof_urls.map((url, i) => ({
        id: `${t.id}_proof_${i}`,
        type: "after" as const,
        imageUrl: url,
        note: t.note || "Proof uploaded",
        uploadedBy: t.updated_by || "Official",
        uploadedAt: t.created_at,
      }))
    );
}

/* ── Frontend → Backend ─────────────────────────── */

export function mapFrontendComplaintToApi(complaint: {
  rawText: string;
  category: ComplaintCategory;
  priority?: ComplaintPriority;
  reportingMode: ReportingMode;
  proxyReporter?: { name: string; relationship: string; organization?: string };
  location?: string;
  mediaUrls?: string[];
}) {
  return {
    title: complaint.rawText.slice(0, 100).trim(),
    raw_text: complaint.rawText,
    category: complaint.category,
    priority: complaint.priority || "medium",
    location: complaint.location || undefined,
    anonymous: complaint.reportingMode === "anonymous",
    proxy_mode: complaint.reportingMode === "proxy",
    proxy_reporter: complaint.reportingMode === "proxy" ? complaint.proxyReporter : undefined,
    media_urls: complaint.mediaUrls || [],
  };
}
