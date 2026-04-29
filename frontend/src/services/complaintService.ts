import api from "./api";
import type { ApiResponse, PaginatedResponse } from "./api";
import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "@/lib/types";
import { mapApiComplaintToFrontend, mapFrontendComplaintToApi } from "@/lib/apiTransformers";

/* ── Backend response types ─────────────────────── */
export interface ApiComplaint {
  id: string;
  complaint_code: string;
  pin_code?: string;
  submitted_by: string | null;
  anonymous: boolean;
  proxy_mode: boolean;
  proxy_reporter?: { name: string; relationship: string; organization?: string };
  title: string;
  raw_text: string;
  ai_summary: string | null;
  category: string;
  priority: string;
  urgency_score: number;
  location: string | null;
  media_urls: string[];
  status: string;
  escalation_level: number;
  genuineness_score: number;
  created_at: string;
  updated_at: string;
}

export interface TrackResult {
  complaint: ApiComplaint;
  timeline: ApiTimelineEntry[];
}

export interface ApiTimelineEntry {
  id: string;
  complaint_id: string;
  status: string;
  note: string | null;
  updated_by: string | null;
  proof_urls: string[];
  created_at: string;
}

export interface CreateComplaintPayload {
  title: string;
  raw_text: string;
  category: string;
  priority?: string;
  location?: string;
  anonymous?: boolean;
  proxy_mode?: boolean;
  proxy_reporter?: { name: string; relationship: string; organization?: string };
  media_urls?: string[];
}

export const complaintService = {
  async create(data: CreateComplaintPayload) {
    const res = (await api.post("/complaints/create", data)) as ApiResponse<ApiComplaint & { complaint_code: string; pin_code: string }>;
    return res.data;
  },

  async track(code: string, pin?: string) {
    const url = `/complaints/track/${code}${pin ? `?pin=${pin}` : ""}`;
    const res = (await api.get(url)) as ApiResponse<TrackResult>;
    return res.data;
  },

  async getById(id: string) {
    const res = (await api.get(`/complaints/${id}`)) as ApiResponse<ApiComplaint>;
    return res.data;
  },

  async list(filters?: {
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    priority?: ComplaintPriority;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.priority) params.set("priority", filters.priority);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const res = (await api.get(`/complaints/list?${params.toString()}`)) as PaginatedResponse<ApiComplaint>;
    return res;
  },

  async update(id: string, updates: Record<string, unknown>) {
    const res = (await api.put(`/complaints/${id}/update`, updates)) as ApiResponse<ApiComplaint>;
    return res.data;
  },

  async uploadProof(complaintId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = (await api.post(`/complaints/${complaintId}/upload-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })) as ApiResponse<ApiComplaint>;
    return res.data;
  },
};
