import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { JobSummary } from "@/types/jobs";
import type { ApplicationSummary, JobSeekerProfile } from "@/types/jobSeeker";
import type { Resume } from "@/types/resume";

export async function searchJobs(params: {
  keyword?: string;
  location?: string;
  employmentType?: string;
}): Promise<JobSummary[]> {
  const response = await api.get<ApiResponse<JobSummary[]>>("/api/jobs", { params });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getJobSeekerProfile(): Promise<JobSeekerProfile> {
  const response = await api.get<ApiResponse<JobSeekerProfile>>("/api/job-seeker/profile");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function updateJobSeekerProfile(
  profile: Omit<JobSeekerProfile, "id" | "firstName" | "lastName" | "email" | "phone">,
): Promise<JobSeekerProfile> {
  const response = await api.put<ApiResponse<JobSeekerProfile>>("/api/job-seeker/profile", profile);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getApplications(): Promise<ApplicationSummary[]> {
  const response = await api.get<ApiResponse<ApplicationSummary[]>>("/api/job-seeker/applications");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getSavedJobIds(): Promise<number[]> {
  const response = await api.get<ApiResponse<number[]>>("/api/job-seeker/saved-jobs");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function toggleSavedJob(jobId: number): Promise<boolean> {
  const response = await api.put<ApiResponse<boolean>>(`/api/job-seeker/jobs/${jobId}/saved`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getResumes(): Promise<Resume[]> {
  const response = await api.get<ApiResponse<Resume[]>>("/api/job-seeker/resumes");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function uploadResume(file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<ApiResponse<Resume>>("/api/job-seeker/resumes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function deleteResume(id: number): Promise<void> {
  const response = await api.delete<ApiResponse<null>>(`/api/job-seeker/resumes/${id}`);
  if (!response.data.success) throw new Error(response.data.message);
}
