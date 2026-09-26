"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getSavedJobIds, searchJobs, toggleSavedJob } from "@/lib/jobs";
import type { JobSummary } from "@/types/jobs";

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadJobs(), getSavedJobIds()])
      .then(([, savedIds]) => setSavedJobIds(savedIds))
      .catch(() => undefined);
  }, []);

  async function loadJobs(filters = { keyword, location, employmentType }) {
    setIsLoading(true);
    setError(null);
    try {
      setJobs(await searchJobs(filters));
    } catch {
      setError("We could not load jobs right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadJobs();
  }

  async function toggleSaved(jobId: number) {
    try {
      const saved = await toggleSavedJob(jobId);
      setSavedJobIds((current) => saved ? [...new Set([...current, jobId])] : current.filter((id) => id !== jobId));
    } catch {
      setError("We could not update saved jobs. Please try again.");
    }
  }

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">Find Jobs</h1>
          <p className="mt-2 text-sm text-slate-500">Discover roles that match your skills and experience.</p>
        </header>

        <form onSubmit={submitSearch} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_auto]">
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title or keyword" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" />
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" />
          <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]">
            <option value="">All employment types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
          </select>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4c47c7]">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>

        {isLoading && <p className="text-sm text-slate-500">Loading available jobs...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!isLoading && !error && jobs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No jobs found for the selected filters.</div>}
        <div className="space-y-3">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{job.companyName ?? "Company"} · {job.location ?? "Location not specified"} · {job.employmentType}</p>
                </div>
                <button type="button" onClick={() => void toggleSaved(job.id)} aria-label={`${savedJobIds.includes(job.id) ? "Remove" : "Save"} ${job.title}`} className={`rounded-lg border p-2 hover:text-[#5b55dc] ${savedJobIds.includes(job.id) ? "border-[#5b55dc] text-[#5b55dc]" : "border-slate-200 text-slate-400"}`}><Bookmark className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                <span className="font-semibold text-slate-700">{formatSalary(job)}</span>
                <Link href={`/job-seeker/jobs/${job.id}`} className="rounded-lg bg-[#5b55dc] px-4 py-2 font-semibold text-white hover:bg-[#4c47c7]">View details</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function formatSalary(job: JobSummary): string {
  if (job.salaryMin == null && job.salaryMax == null) return "Salary not specified";
  const min = job.salaryMin?.toLocaleString() ?? "";
  const max = job.salaryMax?.toLocaleString() ?? "";
  return max ? `${min} - ${max}` : min;
}
