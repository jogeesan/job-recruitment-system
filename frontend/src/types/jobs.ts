export interface JobSummary {
  id: number;
  title: string;
  companyName: string | null;
  location: string | null;
  employmentType: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  applicationDeadline: string | null;
  status: string;
  createdAt: string;
}
