export interface JobSeekerProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  yearsOfExperience: number;
  profileImageUrl: string | null;
}

export interface ApplicationSummary {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  status: string;
  coverLetter: string | null;
  appliedAt: string;
  updatedAt: string;
}
