export interface JobSeekerInterview {
  id: number;
  applicationId: number;
  jobTitle: string;
  companyName: string;
  interviewType: string;
  scheduledAt: string;
  durationMinutes: number;
  location: string | null;
  meetingLink: string | null;
  status: string;
  notes: string | null;
}
