"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { deleteResume, getJobSeekerProfile, getResumes, updateJobSeekerProfile, uploadResume } from "@/lib/jobs";
import type { JobSeekerProfile } from "@/types/jobSeeker";
import type { Resume } from "@/types/resume";

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

  useEffect(() => {
    Promise.all([getJobSeekerProfile(), getResumes()])
      .then(([loadedProfile, loadedResumes]) => { setProfile(loadedProfile); setResumes(loadedResumes); })
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
      <div className="max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Keep your professional profile up to date for employers.</p>
        </header>
        {isLoading ? <p className="text-sm text-slate-500">Loading profile...</p> : (
          <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
            {message && <p className="text-sm text-slate-600">{message}</p>}
            <button disabled={isSaving} className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save changes"}</button>
          </form>
        )}
        {!isLoading && <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-bold">Resumes</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a PDF, DOC, or DOCX file up to 5 MB.</p>
          </div>
          <input type="file" accept=".pdf,.doc,.docx" disabled={isUploading} onChange={(event) => void handleResumeUpload(event.target.files?.[0])} className="block w-full rounded-lg border border-slate-200 p-3 text-sm" />
          {resumes.length === 0 ? <p className="text-sm text-slate-500">No resumes uploaded yet.</p> : <div className="space-y-2">{resumes.map((resume) => <div key={resume.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"><a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${resume.fileUrl}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#5b55dc]">{resume.fileName}</a><button type="button" onClick={() => void handleResumeDelete(resume.id)} className="text-sm font-semibold text-red-600">Delete</button></div>)}</div>}
        </section>}
      </div>
    </ProtectedDashboard>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" /></label>;
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input value={value} readOnly className="mt-2 w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" /></label>;
}
