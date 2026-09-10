import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { CompanyApplication, CompanyDashboard, CompanyInterview, CompanyJob, CompanyJobInput, CompanyProfile, ScheduleInterviewInput } from "@/types/company";

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request;
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export const getCompanyDashboard = () => unwrap<CompanyDashboard>(api.get("/api/company/dashboard"));
export const getCompanyProfile = () => unwrap<CompanyProfile>(api.get("/api/company/profile"));
export const updateCompanyProfile = (profile: Omit<CompanyProfile, "id" | "verificationStatus">) =>
  unwrap<CompanyProfile>(api.put("/api/company/profile", profile));
export const getCompanyJobs = () => unwrap<CompanyJob[]>(api.get("/api/company/jobs"));
export const createCompanyJob = (job: CompanyJobInput) => unwrap<CompanyJob>(api.post("/api/company/jobs", job));
export const updateCompanyJob = (id: number, job: CompanyJobInput) => unwrap<CompanyJob>(api.put(`/api/company/jobs/${id}`, job));
export const updateCompanyJobStatus = (id: number, status: string) =>
  unwrap<CompanyJob>(api.put(`/api/company/jobs/${id}/status`, null, { params: { status } }));
export const getCompanyApplications = () => unwrap<CompanyApplication[]>(api.get("/api/company/applications"));
export const updateApplicationStatus = (id: number, status: string) =>
  unwrap<CompanyApplication>(api.put(`/api/company/applications/${id}/status`, { status }));
export const getCompanyInterviews = () => unwrap<CompanyInterview[]>(api.get("/api/company/interviews"));
export const scheduleInterview = (applicationId: number, input: ScheduleInterviewInput) =>
  unwrap<CompanyInterview>(api.post(`/api/company/applications/${applicationId}/interviews`, input));
export const updateInterviewStatus = (id: number, status: string) =>
  unwrap<CompanyInterview>(api.put(`/api/company/interviews/${id}/status`, null, { params: { status } }));
