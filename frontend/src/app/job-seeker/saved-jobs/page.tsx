"use client";

import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getSavedJobIds, searchJobs, toggleSavedJob } from "@/lib/jobs";
import type { JobSummary } from "@/types/jobs";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSavedJobIds(), searchJobs({})])
      .then(([savedIds, availableJobs]) => setJobs(availableJobs.filter((job) => savedIds.includes(job.id))))
      .catch(() => setError("We could not load your saved jobs."))
      .finally(() => setIsLoading(false));
  }, []);

  async function removeSavedJob(jobId: number) {
    try {
      await toggleSavedJob(jobId);
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch {
      setError("We could not update your saved jobs. Please try again.");
    }
  }

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">Saved Jobs</h1>
          <p className="mt-2 text-sm text-slate-500">Review the opportunities you saved for later.</p>
        </header>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {isLoading && <p className="text-sm text-slate-500">Loading saved jobs...</p>}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">You have not saved any jobs yet.</p>
            <Link href="/job-seeker/jobs" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b55dc]">
              <Search className="h-4 w-4" /> Find jobs
            </Link>
          </div>
        )}
        <div className="space-y-3">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{job.companyName ?? "Company"} · {job.location ?? "Location not specified"} · {job.employmentType}</p>
                </div>
                <button type="button" onClick={() => void removeSavedJob(job.id)} aria-label={`Remove ${job.title} from saved jobs`} className="rounded-lg border border-[#5b55dc] p-2 text-[#5b55dc] hover:bg-indigo-50">
                  <Bookmark className="h-4 w-4 fill-current" />
                </button>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <Link href={`/job-seeker/jobs/${job.id}`} className="rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4c47c7]">View details</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
