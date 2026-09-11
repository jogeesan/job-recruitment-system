export interface ProfileData {
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
}
export interface EducationItem { id: number; institution: string; degree: string; fieldOfStudy: string | null; startDate: string | null; endDate: string | null; description: string | null; }
export interface ExperienceItem { id: number; companyName: string; jobTitle: string; location: string | null; startDate: string; endDate: string | null; isCurrent: boolean; description: string | null; }
export interface SkillItem { id: number; skillId: number; name: string; proficiencyLevel: string | null; yearsOfExperience: number; }
