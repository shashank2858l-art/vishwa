/* ============================================
   GRIEVANCE PLATFORM — TYPE DEFINITIONS
   ============================================ */

export type ComplaintCategory =
  | "water"
  | "roads"
  | "sanitation"
  | "harassment"
  | "corruption"
  | "ration"
  | "safety"
  | "abuse"
  | "other";

export type ComplaintPriority = "critical" | "high" | "medium" | "low";

export type ComplaintStatus =
  | "submitted"
  | "verified"
  | "assigned"
  | "under_review"
  | "action_taken"
  | "resolved"
  | "rejected";

export type ReportingMode = "self" | "anonymous" | "proxy";

export interface ProxyReporter {
  name: string;
  relationship: string;
  organization?: string;
  contact?: string;
}

export interface Complaint {
  id: string;
  pin: string;
  rawText: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  reportingMode: ReportingMode;
  proxyReporter?: ProxyReporter;
  summary: string;
  location?: string;
  affectedPeople?: number;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  communityVotes: number;
  validatorEndorsements: number;
  genuinenessScore: number;
  timeline: TimelineEvent[];
  proofOfAction: ProofOfAction[];
  escalationLevel: number;
  escalatedAt?: string;
  // Admin Approval
  approved: boolean;
  // Internal UUID for API calls (different from display id which is complaint_code)
  _apiId?: string;
  // Community Feed & AI Routing Extensions
  amountRaised?: number;
  targetAmount?: number;
  qrCodeUrl?: string;
  commission?: number;
  department?: string;
  routedTo?: string;
  aiConfidence?: number;
  assignedDepartment?: string;
  assignedOfficer?: string;
  // AI Moderation
  aiDecision?: 'auto_publish' | 'pending_review' | 'rejected' | 'duplicate';
  spamScore?: number;
  authenticityScore?: number;
  aiSentiment?: string;
  isPublicSafetyRisk?: boolean;
  aiKeyIssues?: string[];
  aiRejectionReason?: string;
  aiModerationNotes?: string;
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
  actor?: string;
  actorRole?: "system" | "official" | "validator" | "citizen";
}

export interface ProofOfAction {
  id: string;
  type: "before" | "after" | "note" | "document";
  imageUrl?: string;
  note: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AISummary {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  summary: string;
  formalStatement: string;
  location: string | null;
  affectedPeople: number;
  keywords: string[];
  urgencyReason: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  complaint: Complaint;
}

export interface AdminAction {
  type: "assign" | "update_status" | "add_note" | "add_proof" | "resolve";
  complaintId: string;
  data: Record<string, unknown>;
  performedAt: string;
  performedBy: string;
}
