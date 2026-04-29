import type { ComplaintCategory, ComplaintPriority, ComplaintStatus } from "./types";

/* ============================================
   CATEGORY CONFIG
   ============================================ */

export interface CategoryConfig {
  id: ComplaintCategory;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Tailwind class
}

export const CATEGORIES: CategoryConfig[] = [
  { id: "water", label: "Water", icon: "Droplets", description: "Water supply issues", color: "text-sky-400" },
  { id: "roads", label: "Roads", icon: "Construction", description: "Road damage, potholes", color: "text-amber-400" },
  { id: "sanitation", label: "Sanitation", icon: "Trash2", description: "Cleanliness, waste issues", color: "text-lime-400" },
  { id: "harassment", label: "Harassment", icon: "ShieldAlert", description: "Harassment or intimidation", color: "text-rose-400" },
  { id: "corruption", label: "Corruption", icon: "Scale", description: "Bribery, favoritism", color: "text-orange-400" },
  { id: "ration", label: "Ration Denial", icon: "Wheat", description: "Ration card or PDS issues", color: "text-yellow-400" },
  { id: "safety", label: "Safety", icon: "Siren", description: "Public safety concerns", color: "text-red-400" },
  { id: "abuse", label: "Abuse", icon: "HeartCrack", description: "Physical or verbal abuse", color: "text-pink-400" },
  { id: "other", label: "Other", icon: "MessageCircleQuestion", description: "Other issues", color: "text-zinc-400" },
];

export const DEPARTMENT_ROUTING: Record<string, { department: string; minister: string }> = {
  water: { department: "Water Supply & Sanitation", minister: "Ministry of Jal Shakti" },
  roads: { department: "Public Works Department", minister: "Ministry of Road Transport" },
  sanitation: { department: "Waste Management Board", minister: "Ministry of Housing & Urban Affairs" },
  harassment: { department: "Women's Safety Cell", minister: "Ministry of Women & Child Dev" },
  corruption: { department: "Anti-Corruption Bureau", minister: "Central Vigilance Commission" },
  ration: { department: "Public Distribution System", minister: "Ministry of Consumer Affairs" },
  safety: { department: "Local Police", minister: "Ministry of Home Affairs" },
  abuse: { department: "Social Justice Dept", minister: "Ministry of Social Justice" },
  other: { department: "General Administration", minister: "District Collectorate" },
};

/* ============================================
   STATUS CONFIG
   ============================================ */

export interface StatusConfig {
  id: ComplaintStatus;
  label: string;
  icon: string;
  color: string;
  description: string;
  order: number;
}

export const STATUSES: StatusConfig[] = [
  { id: "submitted", label: "Submitted", icon: "Send", color: "text-zinc-400", description: "Complaint received", order: 0 },
  { id: "verified", label: "Verified", icon: "CheckCircle2", color: "text-accent", description: "Verified by community", order: 1 },
  { id: "assigned", label: "Assigned", icon: "UserCheck", color: "text-sky-400", description: "Assigned to official", order: 2 },
  { id: "under_review", label: "Under Review", icon: "Search", color: "text-warning", description: "Being investigated", order: 3 },
  { id: "action_taken", label: "Action Taken", icon: "Hammer", color: "text-orange-400", description: "Action in progress", order: 4 },
  { id: "resolved", label: "Resolved", icon: "CircleCheckBig", color: "text-success", description: "Issue resolved with proof", order: 5 },
  { id: "rejected", label: "Rejected", icon: "XCircle", color: "text-danger", description: "Rejected by AI or admin", order: 6 },
];

/* ============================================
   PRIORITY CONFIG
   ============================================ */

export interface PriorityConfig {
  id: ComplaintPriority;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const PRIORITIES: PriorityConfig[] = [
  { id: "critical", label: "Critical", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", description: "Immediate danger or severe harm" },
  { id: "high", label: "High", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", description: "Significant impact, urgent" },
  { id: "medium", label: "Medium", color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/30", description: "Moderate impact" },
  { id: "low", label: "Low", color: "text-zinc-400", bgColor: "bg-zinc-500/10", borderColor: "border-zinc-500/30", description: "Minor issue" },
];

/* ============================================
   ESCALATION CONFIG
   ============================================ */

export const ESCALATION_THRESHOLDS = {
  level1: 24 * 60 * 60 * 1000,  // 24 hours → local authority reminder
  level2: 72 * 60 * 60 * 1000,  // 72 hours → NGO/validator notification
  level3: 168 * 60 * 60 * 1000, // 7 days → higher authority escalation
} as const;

export const ESCALATION_LABELS = [
  "Local Authority",
  "NGO / Community Validator",
  "Higher Authority",
  "Public Visibility",
] as const;

/* ============================================
   DEMO OFFICERS
   ============================================ */

export const OFFICERS = [
  { id: "off_001", name: "Rajesh Kumar", role: "Ward Officer", department: "Municipal Corp" },
  { id: "off_002", name: "Priya Sharma", role: "Sanitation Inspector", department: "Sanitation Dept" },
  { id: "off_003", name: "Amit Singh", role: "District Collector", department: "District Admin" },
  { id: "off_004", name: "Sunita Devi", role: "Women's Cell Head", department: "Police" },
] as const;

/* ============================================
   APP CONFIG
   ============================================ */

export const APP_NAME = "VISHWAS";
export const APP_TAGLINE = "Your Voice. Your Right. Your Justice.";
export const APP_DESCRIPTION = "A trust-mediated grievance platform empowering communities to report issues safely, track progress transparently, and verify real action by authorities.";

export const STORAGE_KEYS = {
  complaints: "vishwas_complaints",
  adminComplaints: "vishwas_admin_complaints",
  settings: "vishwas_settings",
} as const;
