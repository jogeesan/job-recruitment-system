"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getApplications } from "@/lib/jobs";
import type { ApplicationSummary } from "@/types/jobSeeker";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("We could not load your applications."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">My Applications</h1>
          <p className="mt-2 text-sm text-slate-500">Track every application from submission to decision.</p>
        </header>
        {isLoading && <p className="text-sm text-slate-500">Loading applications...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!isLoading && !error && applications.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">You have not submitted any applications yet.</div>}
        <div className="space-y-3">
          {applications.map((application) => (
            <article key={application.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="font-bold">{application.jobTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">{application.companyName}</p>
                <p className="mt-2 text-xs text-slate-400">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{application.status}</span>
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
