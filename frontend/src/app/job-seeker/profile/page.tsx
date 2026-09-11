"use client";

import { FormEvent, useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, GraduationCap, Trash2, Upload, UserRound } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { addEducation, addExperience, addProfileSkill, deleteEducation, deleteExperience, deleteProfileSkill, deleteResume, getJobSeekerProfile, getProfileData, getProfileSkills, getResumes, updateJobSeekerProfile, uploadResume } from "@/lib/jobs";
import type { JobSeekerProfile } from "@/types/jobSeeker";
import type { Resume } from "@/types/resume";
import type { ProfileData } from "@/types/profileData";

const emptyProfile: JobSeekerProfile = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  phone: null,
  dateOfBirth: null,
  gender: null,
  headline: null,
  bio: null,
  location: null,
  yearsOfExperience: 0,
  profileImageUrl: null,
};

export default function JobSeekerProfilePage() {
  const [profile, setProfile] = useState<JobSeekerProfile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({ education: [], experience: [], skills: [] });
  const [skillOptions, setSkillOptions] = useState<{ id: number; name: string }[]>([]);
  const [educationForm, setEducationForm] = useState({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" });
  const [experienceForm, setExperienceForm] = useState({ companyName: "", jobTitle: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" });
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    Promise.all([getJobSeekerProfile(), getResumes(), getProfileData(), getProfileSkills()])
      .then(([loadedProfile, loadedResumes, loadedData, loadedSkills]) => { setProfile(loadedProfile); setResumes(loadedResumes); setProfileData(loadedData); setSkillOptions(loadedSkills); })
      .catch(() => setMessage("We could not load your profile."))
      .finally(() => setIsLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await updateJobSeekerProfile({
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        yearsOfExperience: profile.yearsOfExperience,
        profileImageUrl: profile.profileImageUrl,
      });
      setProfile(updated);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("We could not save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }

  }

  async function addEducationItem(event: FormEvent) {
    event.preventDefault();
    try { const item = await addEducation({ ...educationForm, fieldOfStudy: educationForm.fieldOfStudy || null, startDate: educationForm.startDate || null, endDate: educationForm.endDate || null, description: educationForm.description || null }); setProfileData((current) => ({ ...current, education: [item, ...current.education] })); setEducationForm({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }); } catch { setMessage("We could not add this education record."); }
  }

  async function addExperienceItem(event: FormEvent) {
    event.preventDefault();
    try { const item = await addExperience({ ...experienceForm, location: experienceForm.location || null, startDate: experienceForm.startDate, endDate: experienceForm.endDate || null, description: experienceForm.description || null }); setProfileData((current) => ({ ...current, experience: [item, ...current.experience] })); setExperienceForm({ companyName: "", jobTitle: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" }); } catch { setMessage("We could not add this work experience."); }
  }

  async function addSkillItem() {
    if (!selectedSkill) return;
    try { const item = await addProfileSkill({ skillId: Number(selectedSkill) }); setProfileData((current) => ({ ...current, skills: [...current.skills, item] })); setSelectedSkill(""); } catch { setMessage("We could not add this skill."); }
  }

  async function handleResumeUpload(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setMessage(null);
    try {
      const resume = await uploadResume(file);
      setResumes((current) => [...current, resume]);
      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not upload your resume.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleResumeDelete(id: number) {
    try {
      await deleteResume(id);
      setResumes((current) => current.filter((resume) => resume.id !== id));
      setMessage("Resume deleted successfully.");
    } catch {
      setMessage("We could not delete your resume.");
    }
  }

  function update<K extends keyof JobSeekerProfile>(key: K, value: JobSeekerProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-[#5b55dc]">
            {profile.firstName || profile.lastName ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() : <UserRound className="h-7 w-7" />}
          </div>
          <div>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-sm text-slate-500">{profile.headline || "Keep your professional profile up to date for employers."}</p>
          </div>
        </header>
        {isLoading ? <p className="text-sm text-slate-500">Loading profile...</p> : (
          <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Your account details and professional profile.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadonlyField label="First name" value={profile.firstName} />
              <ReadonlyField label="Last name" value={profile.lastName} />
              <ReadonlyField label="Email" value={profile.email} />
              <ReadonlyField label="Phone" value={profile.phone ?? "Not provided"} />
              <Field label="Professional headline" value={profile.headline ?? ""} onChange={(value) => update("headline", value)} />
              <Field label="Location" value={profile.location ?? ""} onChange={(value) => update("location", value)} />
              <Field label="Years of experience" type="number" value={String(profile.yearsOfExperience ?? 0)} onChange={(value) => update("yearsOfExperience", Number(value))} />
              <Field label="Date of birth" type="date" value={profile.dateOfBirth ?? ""} onChange={(value) => update("dateOfBirth", value || null)} />
            </div>
            <label className="block text-sm font-medium text-slate-700">About you<textarea value={profile.bio ?? ""} onChange={(event) => update("bio", event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" /></label>
            {message && <p role="status" className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}
            <button disabled={isSaving} className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save changes"}</button>
          </form>
        )}
        {!isLoading && <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-[#5b55dc]" />
            <div>
            <h2 className="font-bold">Resumes</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a PDF, DOC, or DOCX file up to 5 MB.</p>
            </div>
          </div>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-sm font-semibold text-[#5b55dc] transition hover:bg-indigo-50">
            <Upload className="h-4 w-4" /> {isUploading ? "Uploading..." : "Choose a resume"}
            <input type="file" accept=".pdf,.doc,.docx" disabled={isUploading} onChange={(event) => void handleResumeUpload(event.target.files?.[0])} className="sr-only" />
          </label>
          {resumes.length === 0 ? <p className="text-sm text-slate-500">No resumes uploaded yet.</p> : <div className="space-y-2">{resumes.map((resume) => <div key={resume.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"><div><a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${resume.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#5b55dc]">{resume.fileName}</a><p className="mt-1 text-xs text-slate-400">{formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.uploadedAt)}</p></div><button type="button" onClick={() => void handleResumeDelete(resume.id)} aria-label={`Delete ${resume.fileName}`} className="text-slate-400 transition hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
        </section>}
        {!isLoading && <ProfileSections data={profileData} skillOptions={skillOptions} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} onAddSkill={() => void addSkillItem()} onDeleteEducation={async (id: number) => { await deleteEducation(id); setProfileData((current) => ({ ...current, education: current.education.filter((item) => item.id !== id) })); }} onDeleteExperience={async (id: number) => { await deleteExperience(id); setProfileData((current) => ({ ...current, experience: current.experience.filter((item) => item.id !== id) })); }} onDeleteSkill={async (id: number) => { await deleteProfileSkill(id); setProfileData((current) => ({ ...current, skills: current.skills.filter((item) => item.skillId !== id) })); }} educationForm={educationForm} setEducationForm={setEducationForm} experienceForm={experienceForm} setExperienceForm={setExperienceForm} onAddEducation={addEducationItem} onAddExperience={addExperienceItem} />}
      </div>
    </ProtectedDashboard>
  );
}

function ProfileSections({ data, skillOptions, selectedSkill, setSelectedSkill, onAddSkill, onDeleteEducation, onDeleteExperience, onDeleteSkill, educationForm, setEducationForm, experienceForm, setExperienceForm, onAddEducation, onAddExperience }: any) {
  return <div className="space-y-6">
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-[#5b55dc]" /><h2 className="font-bold">Skills</h2></div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="">Select a skill</option>{skillOptions.filter((skill: any) => !data.skills.some((item: any) => item.skillId === skill.id)).map((skill: any) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}</select><button type="button" onClick={onAddSkill} disabled={!selectedSkill} className="rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Add</button></div>{data.skills.length === 0 ? <p className="mt-4 text-sm text-slate-500">No skills added yet.</p> : <div className="mt-4 flex flex-wrap gap-2">{data.skills.map((item: any) => <span key={item.skillId} className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700">{item.name}<button type="button" onClick={() => void onDeleteSkill(item.skillId)} aria-label={`Remove ${item.name}`} className="font-bold text-indigo-400 hover:text-indigo-700">×</button></span>)}</div>}</section>
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[#5b55dc]" /><h2 className="font-bold">Education</h2></div><form onSubmit={onAddEducation} className="mt-4 grid gap-3 sm:grid-cols-2"><input required placeholder="Institution" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input required placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input placeholder="Field of study" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input type="date" value={educationForm.startDate} onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><button className="w-fit rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white">Add education</button></form>{data.education.length === 0 ? <p className="mt-4 text-sm text-slate-500">No education records added yet.</p> : <div className="mt-4 space-y-2">{data.education.map((item: any) => <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3"><div><p className="font-semibold">{item.degree}</p><p className="text-sm text-slate-500">{item.institution}{item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}</p></div><button type="button" onClick={() => void onDeleteEducation(item.id)} className="text-sm font-semibold text-red-600">Delete</button></div>)}</div>}</section>
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-[#5b55dc]" /><h2 className="font-bold">Work experience</h2></div><form onSubmit={onAddExperience} className="mt-4 grid gap-3 sm:grid-cols-2"><input required placeholder="Company" value={experienceForm.companyName} onChange={(e) => setExperienceForm({ ...experienceForm, companyName: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input required placeholder="Job title" value={experienceForm.jobTitle} onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input required type="date" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={experienceForm.isCurrent} onChange={(e) => setExperienceForm({ ...experienceForm, isCurrent: e.target.checked })} /> Current role</label><button className="w-fit rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white">Add experience</button></form>{data.experience.length === 0 ? <p className="mt-4 text-sm text-slate-500">No work experience added yet.</p> : <div className="mt-4 space-y-2">{data.experience.map((item: any) => <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3"><div><p className="font-semibold">{item.jobTitle}</p><p className="text-sm text-slate-500">{item.companyName} · {item.isCurrent ? "Current" : item.endDate ?? "Past role"}</p></div><button type="button" onClick={() => void onDeleteExperience(item.id)} className="text-sm font-semibold text-red-600">Delete</button></div>)}</div>}</section>
  </div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" /></label>;
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input value={value} readOnly className="mt-2 w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" /></label>;
}

function formatFileSize(size: number | null): string {
  if (size == null) return "Size unavailable";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
