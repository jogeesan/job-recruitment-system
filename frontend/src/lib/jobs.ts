import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { JobSummary } from "@/types/jobs";

export async function searchJobs(params: {
  keyword?: string;
  location?: string;
  employmentType?: string;
}): Promise<JobSummary[]> {
  const response = await api.get<ApiResponse<JobSummary[]>>("/api/jobs", { params });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
