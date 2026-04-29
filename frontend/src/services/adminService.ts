import api from "./api";
import type { ApiResponse } from "./api";
import type { ApiComplaint } from "./complaintService";

export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  ai?: {
    pending_review: number;
    auto_published: number;
    spam_rejected: number;
    critical_alerts: number;
  };
}

interface QueueResult {
  data: ApiComplaint[];
  count: number;
}

interface AIAnalysis {
  summary: string;
  suggested_category: string;
  suggested_priority: string;
  urgency_score: number;
  key_issues: string[];
  sentiment: string;
  publish_decision: string;
  department: string;
  authenticity_score: number;
  spam_score: number;
}

export const adminService = {
  async getDashboardStats() {
    const res = (await api.get("/admin/dashboard-stats")) as ApiResponse<DashboardStats>;
    return res.data;
  },

  async getQueues(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters);
    const res = (await api.get(`/admin/queues?${params.toString()}`)) as ApiResponse<QueueResult>;
    return res.data;
  },

  // AI Moderation Queues
  async getPendingVerification() {
    const res = (await api.get("/admin/pending-verification")) as ApiResponse<ApiComplaint[]>;
    return res.data;
  },

  async getCriticalAlerts() {
    const res = (await api.get("/admin/critical-alerts")) as ApiResponse<ApiComplaint[]>;
    return res.data;
  },

  async getSpamRejected() {
    const res = (await api.get("/admin/spam-rejected")) as ApiResponse<ApiComplaint[]>;
    return res.data;
  },

  // Admin Actions
  async approveComplaint(complaintId: string) {
    const res = (await api.post(`/admin/approve/${complaintId}`, {})) as ApiResponse<unknown>;
    return res.data;
  },

  async rejectComplaint(complaintId: string, reason?: string) {
    const res = (await api.post(`/admin/reject/${complaintId}`, { reason })) as ApiResponse<unknown>;
    return res.data;
  },

  async assignComplaint(complaintId: string, assigneeId: string, assignedRole: string) {
    const res = (await api.post(`/admin/assign/${complaintId}`, {
      assignee_id: assigneeId,
      assigned_role: assignedRole,
    })) as ApiResponse<unknown>;
    return res.data;
  },

  async resolveComplaint(complaintId: string, resolutionNote: string) {
    const res = (await api.post(`/admin/resolve/${complaintId}`, {
      resolution_note: resolutionNote,
    })) as ApiResponse<unknown>;
    return res.data;
  },

  async processComplaintAI(complaintId: string) {
    const res = (await api.post("/ai/process-complaint", {
      complaint_id: complaintId,
    })) as ApiResponse<{ complaint: ApiComplaint; analysis: AIAnalysis }>;
    return res.data;
  },

  async addTimelineEntry(complaintId: string, status: string, note: string, proofUrls?: string[]) {
    const res = (await api.post(`/timeline/${complaintId}/add`, { status, note, proof_urls: proofUrls })) as ApiResponse<unknown>;
    return res.data;
  },

  async getTimeline(complaintId: string) {
    const res = (await api.get(`/timeline/${complaintId}`)) as ApiResponse<unknown[]>;
    return res.data;
  },
};
