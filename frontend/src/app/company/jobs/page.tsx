"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { createCompanyJob, getCompanyJobs, updateCompanyJobStatus } from "@/lib/company";
import type { CompanyJob, CompanyJobInput } from "@/types/company";

const emptyJob: CompanyJobInput = { title: "", description: "", employmentType: "FULL_TIME", location: "", experienceLevel: "", applicationDeadline: "", status: "DRAFT" };

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [form, setForm] = useState<CompanyJobInput>(emptyJob);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => { getCompanyJobs().then(setJobs).catch(() => setMessage("We could not load your jobs.")).finally(() => setIsLoading(false)); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(null);
    try { const job = await createCompanyJob(form); setJobs((current) => [job, ...current]); setForm(emptyJob); setMessage("Job created successfully."); }
    catch { setMessage("We could not create this job."); }
  }

  async function changeStatus(job: CompanyJob, status: string) {
    try { const updated = await updateCompanyJobStatus(job.id, status); setJobs((current) => current.map((item) => item.id === job.id ? updated : item)); }
    catch { setMessage("We could not update the job status."); }
  }

  return <ProtectedDashboard role="HR"><div className="space-y-6">
    <header><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Jobs</h1><p className="mt-2 text-sm text-slate-500">Create and manage the roles your company is recruiting for.</p></header>
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
      <Input label="Job title" value={form.title} required onChange={(value) => setForm({ ...form, title: value })} />
      <Input label="Location" value={form.location ?? ""} onChange={(value) => setForm({ ...form, location: value })} />
      <label className="text-sm font-medium text-slate-700">Employment type<select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option></select></label>
      <Input label="Application deadline" type="date" value={form.applicationDeadline ?? ""} onChange={(value) => setForm({ ...form, applicationDeadline: value })} />
      <label className="text-sm font-medium text-slate-700 md:col-span-2">Description<textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
      <button className="w-fit rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white">Create job</button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
    {isLoading && <p className="text-sm text-slate-500">Loading jobs...</p>}
    {!isLoading && jobs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No jobs created yet.</div>}
    <div className="space-y-3">{jobs.map((job) => <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.location ?? "Location not specified"} · {job.employmentType}</p><p className="mt-2 text-xs text-slate-400">{job.applicationCount} applications</p></div><select value={job.status} onChange={(e) => void changeStatus(job, e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="DRAFT">Draft</option><option value="OPEN">Open</option><option value="CLOSED">Closed</option></select></div></article>)}</div>
  </div></ProtectedDashboard>;
}

function Input({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>;
}
