export interface CompanyProfile {
  id: number;
  companyName: string;
  description: string | null;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  companySize: string | null;
  verificationStatus: string;
}

export interface CompanyJob {
  id: number;
  title: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  location: string | null;
  employmentType: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  applicationDeadline: string | null;
  status: string;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  jobSeekerId: number;
  applicantName: string;
  applicantEmail: string;
  status: string;
  coverLetter: string | null;
  resumeId: number | null;
  resumeFileName: string | null;
  resumeFileUrl: string | null;
  resumeFileType: string | null;
  appliedAt: string;
  updatedAt: string;
}

export interface CompanyInterview {
  id: number;
  applicationId: number;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  interviewType: string;
  scheduledAt: string;
  durationMinutes: number;
  location: string | null;
  meetingLink: string | null;
  status: string;
  notes: string | null;
}

export interface ScheduleInterviewInput {
  interviewType: string;
  scheduledAt: string;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface CompanyDashboard {
  company: CompanyProfile;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  shortlistedApplications: number;
}

export interface CompanyJobInput {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location?: string;
  employmentType: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline?: string;
  status?: string;
}
