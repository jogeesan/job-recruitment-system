"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bookmark, Search, SlidersHorizontal } from "lucide-react";
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

        <form onSubmit={submitSearch} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-[#5b55dc]" />
            Search and filter jobs
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title or keyword" aria-label="Job title or keyword" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" />
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" aria-label="Location" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" />
            <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} aria-label="Employment type" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10">
              <option value="">All employment types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="TEMPORARY">Temporary</option>
            </select>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] focus:outline-none focus:ring-2 focus:ring-[#5b55dc]/30">
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </form>

        {isLoading && <p className="text-sm text-slate-500">Loading available jobs...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">No jobs found</p>
            <p className="mt-1 text-sm text-slate-500">Try changing your search terms or filters.</p>
          </div>
        )}
        <div className="space-y-3">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-slate-900">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{job.companyName ?? "Company"} · {job.location ?? "Location not specified"}</p>
                </div>
                <button type="button" onClick={() => void toggleSaved(job.id)} aria-label={`${savedJobIds.includes(job.id) ? "Remove" : "Save"} ${job.title}`} className={`rounded-lg border p-2 transition hover:bg-indigo-50 hover:text-[#5b55dc] ${savedJobIds.includes(job.id) ? "border-[#5b55dc] text-[#5b55dc]" : "border-slate-200 text-slate-400"}`}>
                  <Bookmark className={`h-4 w-4 ${savedJobIds.includes(job.id) ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[#514bc6]">{formatEmploymentType(job.employmentType)}</span>
                {job.experienceLevel && <span className="rounded-full bg-slate-100 px-3 py-1">{formatLabel(job.experienceLevel)}</span>}
                {job.applicationDeadline && <span className="rounded-full bg-slate-100 px-3 py-1">Apply by {formatDate(job.applicationDeadline)}</span>}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                <span className="font-semibold text-slate-700">{formatSalary(job)}</span>
                <Link href={`/job-seeker/jobs/${job.id}`} className="rounded-lg bg-[#5b55dc] px-4 py-2 font-semibold text-white transition hover:bg-[#4c47c7]">View details</Link>
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
  const min = job.salaryMin?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "";
  const max = job.salaryMax?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "";
  return max ? `${min} - ${max}` : min;
}

function formatEmploymentType(value: string): string {
  return formatLabel(value);
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
