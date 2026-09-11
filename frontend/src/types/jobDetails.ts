import type { JobSummary } from "@/types/jobs";

export interface JobDetails extends JobSummary {
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  companyDescription: string | null;
  companyWebsite: string | null;
}
