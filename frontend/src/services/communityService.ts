import api from "./api";
import type { ApiResponse } from "./api";

interface VoteResult {
  validation: { id: string; complaint_id: string; user_id: string; type: string };
  genuineness_score: number;
}

export const communityService = {
  async vote(complaintId: string) {
    const res = (await api.post(`/validation/${complaintId}/vote`)) as ApiResponse<VoteResult>;
    return res.data;
  },

  async verify(complaintId: string) {
    const res = (await api.post(`/validation/${complaintId}/verify`)) as ApiResponse<VoteResult>;
    return res.data;
  },
};
