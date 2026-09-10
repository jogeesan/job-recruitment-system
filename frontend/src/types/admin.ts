export interface AdminDashboard { totalUsers: number; totalJobSeekers: number; totalHrUsers: number; totalCompanies: number; pendingCompanies: number; totalJobs: number; activeJobs: number; totalApplications: number; }
export interface AdminUser { id: number; firstName: string; lastName: string; email: string; role: string; status: string; createdAt: string; }
export interface AdminCompany { id: number; companyName: string; ownerName: string; ownerEmail: string; industry: string | null; city: string | null; country: string | null; verificationStatus: string; jobCount: number; }
export interface AdminJob { id: number; title: string; companyName: string; location: string | null; employmentType: string; status: string; applicationCount: number; createdAt: string; }
export interface AdminApplication { id: number; jobTitle: string; companyName: string; applicantName: string; applicantEmail: string; status: string; appliedAt: string; }
export interface Skill { id: number; name: string; createdAt: string; }
