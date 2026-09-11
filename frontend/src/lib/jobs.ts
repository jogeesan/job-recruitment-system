import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { JobSummary } from "@/types/jobs";
import type { JobDetails } from "@/types/jobDetails";
import type { ApplicationSummary, JobSeekerProfile } from "@/types/jobSeeker";
import type { Resume } from "@/types/resume";
import type { ProfileData, EducationItem, ExperienceItem, SkillItem } from "@/types/profileData";
import type { JobSeekerInterview } from "@/types/interview";

export async function searchJobs(params: {
  keyword?: string;
  location?: string;
  employmentType?: string;
}): Promise<JobSummary[]> {
  const response = await api.get<ApiResponse<JobSummary[]>>("/api/jobs", { params });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getJobDetails(jobId: number): Promise<JobDetails> {
  const response = await api.get<ApiResponse<JobDetails>>(`/api/jobs/${jobId}`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function applyForJob(jobId: number, input: { resumeId: number; coverLetter: string }): Promise<ApplicationSummary> {
  const response = await api.post<ApiResponse<ApplicationSummary>>(`/api/job-seeker/jobs/${jobId}/applications`, input);
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

export async function getProfileData(): Promise<ProfileData> {
  const response = await api.get<ApiResponse<ProfileData>>("/api/job-seeker/profile-data");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
export async function getProfileSkills(): Promise<{ id: number; name: string }[]> {
  const response = await api.get<ApiResponse<{ id: number; name: string }[]>>("/api/job-seeker/skills");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
export async function addEducation(input: Omit<EducationItem, "id">): Promise<EducationItem> {
  const response = await api.post<ApiResponse<EducationItem>>("/api/job-seeker/education", input);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
export async function deleteEducation(id: number) { await api.delete(`/api/job-seeker/education/${id}`); }
export async function addExperience(input: Omit<ExperienceItem, "id">): Promise<ExperienceItem> {
  const response = await api.post<ApiResponse<ExperienceItem>>("/api/job-seeker/experience", input);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
export async function deleteExperience(id: number) { await api.delete(`/api/job-seeker/experience/${id}`); }
export async function addProfileSkill(input: { skillId: number; proficiencyLevel?: string; yearsOfExperience?: number }): Promise<SkillItem> {
  const response = await api.post<ApiResponse<SkillItem>>("/api/job-seeker/skills", input);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
export async function deleteProfileSkill(skillId: number) { await api.delete(`/api/job-seeker/skills/${skillId}`); }

export async function getJobSeekerInterviews(): Promise<JobSeekerInterview[]> {
  const response = await api.get<ApiResponse<JobSeekerInterview[]>>("/api/job-seeker/interviews");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function respondToInterview(id: number, responseValue: "ACCEPTED" | "DECLINED"): Promise<JobSeekerInterview> {
  const response = await api.put<ApiResponse<JobSeekerInterview>>(`/api/job-seeker/interviews/${id}/response`, null, {
    params: { response: responseValue },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}
