"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { BriefcaseBusiness, CalendarDays, Plus, X, MapPin, Users } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { createCompanyJob, getCompanyJobs, updateCompanyJobStatus } from "@/lib/company";
import type { CompanyJob, CompanyJobInput } from "@/types/company";

const emptyJob: CompanyJobInput = { title: "", description: "", employmentType: "FULL_TIME", location: "", experienceLevel: "", applicationDeadline: "", status: "DRAFT" };

export default function CompanyJobsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [form, setForm] = useState<CompanyJobInput>(emptyJob);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { getCompanyJobs().then(setJobs).catch(() => setMessage("We could not load your jobs.")).finally(() => setIsLoading(false)); }, []);

  useEffect(() => {
    if (!isCreateOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isCreateOpen]);

  function openCreate() {
    setCreateError(null);
    setIsCreateOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setCreateError(null); setIsSubmitting(true);
    try { const job = await createCompanyJob(cleanJobInput(form)); setJobs((current) => [job, ...current]); setForm(emptyJob); setIsCreateOpen(false); setMessage("Job created successfully."); }
    catch (reason) { setCreateError(reason instanceof Error ? reason.message : "We could not create this job."); }
    finally { setIsSubmitting(false); }
  }

  async function changeStatus(job: CompanyJob, status: string) {
    setUpdatingId(job.id); setMessage(null);
    try { const updated = await updateCompanyJobStatus(job.id, status); setJobs((current) => current.map((item) => item.id === job.id ? updated : item)); }
    catch { setMessage("We could not update the job status."); }
    finally { setUpdatingId(null); }
  }

  return <ProtectedDashboard role="HR"><div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Jobs</h1><p className="mt-2 text-sm text-slate-500">Create and manage the roles your company is recruiting for.</p></div><button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4c47c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><Plus aria-hidden="true" className="h-4 w-4" />Create a job</button></header>
    {message && <p role="status" className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">{message}</p>}
    <dialog ref={dialogRef} aria-labelledby="create-job-title" aria-describedby="create-job-description" onCancel={(event) => { event.preventDefault(); if (!isSubmitting) setIsCreateOpen(false); }} onClose={() => setIsCreateOpen(false)} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5"><div><h2 id="create-job-title" className="text-xl font-bold">Create a job</h2><p id="create-job-description" className="mt-1 text-sm text-slate-500">Add the details candidates need to understand this role.</p></div><button type="button" disabled={isSubmitting} onClick={() => setIsCreateOpen(false)} aria-label="Close create job" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X aria-hidden="true" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="space-y-5 p-6">
        <fieldset disabled={isSubmitting} className="space-y-5 disabled:opacity-60">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Job title" value={form.title} required onChange={(value) => setForm({ ...form, title: value })} />
        <Input label="Location" value={form.location ?? ""} onChange={(value) => setForm({ ...form, location: value })} />
        <SelectInput label="Employment type" value={form.employmentType} onChange={(value) => setForm({ ...form, employmentType: value })} options={[["FULL_TIME", "Full-time"], ["PART_TIME", "Part-time"], ["CONTRACT", "Contract"], ["INTERNSHIP", "Internship"], ["TEMPORARY", "Temporary"]]} />
        <SelectInput label="Experience level" value={form.experienceLevel ?? ""} onChange={(value) => setForm({ ...form, experienceLevel: value })} options={[["ENTRY_LEVEL", "Entry level"], ["MID_LEVEL", "Mid level"], ["SENIOR_LEVEL", "Senior level"], ["", "Not specified"]]} />
        <Input label="Minimum salary" type="number" min="0" value={form.salaryMin == null ? "" : String(form.salaryMin)} onChange={(value) => setForm({ ...form, salaryMin: value ? Number(value) : undefined })} />
        <Input label="Maximum salary" type="number" min="0" value={form.salaryMax == null ? "" : String(form.salaryMax)} onChange={(value) => setForm({ ...form, salaryMax: value ? Number(value) : undefined })} />
        <Input label="Application deadline" type="date" value={form.applicationDeadline ?? ""} onChange={(value) => setForm({ ...form, applicationDeadline: value })} />
      </div>
      <TextArea label="Description" required value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
      <div className="grid gap-4 md:grid-cols-2"><TextArea label="Responsibilities" value={form.responsibilities ?? ""} onChange={(value) => setForm({ ...form, responsibilities: value })} /><TextArea label="Requirements" value={form.requirements ?? ""} onChange={(value) => setForm({ ...form, requirements: value })} /></div>
        </fieldset>
        {createError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{createError}</p>}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" disabled={isSubmitting} onClick={() => setIsCreateOpen(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Creating..." : "Create job"}</button>
        </div>
      </form>
    </dialog>
    {isLoading && <div className="grid gap-3">{Array.from({ length: 2 }, (_, index) => <div key={index} className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white" />)}</div>}
    {!isLoading && jobs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No jobs created yet</p><p className="mt-1 text-sm text-slate-500">Select Create a job to add your first role.</p></div>}
    <div className="space-y-3">{jobs.map((job) => <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h2 className="truncate font-bold text-slate-900">{job.title}</h2><p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" />{job.location ?? "Location not specified"}</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600"><span className="rounded-full bg-indigo-50 px-3 py-1 text-[#514bc6]">{formatLabel(job.employmentType)}</span>{job.experienceLevel && <span className="rounded-full bg-slate-100 px-3 py-1">{formatLabel(job.experienceLevel)}</span>}<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Users className="h-3.5 w-3.5" />{job.applicationCount} applications</span>{job.applicationDeadline && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><CalendarDays className="h-3.5 w-3.5" />Apply by {formatDate(job.applicationDeadline)}</span>}</div></div><div className="flex items-center gap-3"><StatusBadge status={job.status} /><select disabled={updatingId === job.id} value={job.status} onChange={(e) => void changeStatus(job, e.target.value)} aria-label={`Update status for ${job.title}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-60"><option value="DRAFT">Draft</option><option value="OPEN">Open</option><option value="CLOSED">Closed</option></select></div></div><div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">{formatSalary(job) && <span className="font-semibold">{formatSalary(job)}</span>}<span>Created {formatDate(job.createdAt)}</span></div></article>)}</div>
  </div></ProtectedDashboard>;
}

function Input({ label, value, onChange, type = "text", required = false, min }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input required={required} min={min} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" /></label>;
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <label className="text-sm font-medium text-slate-700">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10">{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}

function TextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm font-medium text-slate-700">{label}<textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" /></label>;
}

function cleanJobInput(form: CompanyJobInput): CompanyJobInput {
  return Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === "string" && value.trim() === "" ? undefined : value])) as CompanyJobInput;
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatSalary(job: CompanyJob): string {
  if (job.salaryMin == null && job.salaryMax == null) return "";
  const min = job.salaryMin?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "";
  const max = job.salaryMax?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "";
  return max ? `${min} - ${max}` : min;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { OPEN: "bg-emerald-50 text-emerald-700", PUBLISHED: "bg-blue-50 text-blue-700", DRAFT: "bg-slate-100 text-slate-700", CLOSED: "bg-red-50 text-red-700" };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-amber-50 text-amber-700"}`}>{formatLabel(status)}</span>;
}
