"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getApplicationHistory, getApplications } from "@/lib/jobs";
import type { ApplicationStatusHistory, ApplicationSummary } from "@/types/jobSeeker";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<number, ApplicationStatusHistory[]>>({});
  const [historyLoading, setHistoryLoading] = useState<number | null>(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("We could not load your applications."))
      .finally(() => setIsLoading(false));
  }, []);

  async function toggleHistory(applicationId: number) {
    if (expandedId === applicationId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(applicationId);
    if (history[applicationId]) return;
    setHistoryLoading(applicationId);
    try {
      const items = await getApplicationHistory(applicationId);
      setHistory((current) => ({ ...current, [applicationId]: items }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not load the application history.");
    } finally {
      setHistoryLoading(null);
    }
  }

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
            <article key={application.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                <h2 className="font-bold">{application.jobTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">{application.companyName}</p>
                <p className="mt-2 text-xs text-slate-400">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{application.status}</span>
                  <button type="button" onClick={() => void toggleHistory(application.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                    {expandedId === application.id ? "Hide timeline" : "View timeline"}
                  </button>
                </div>
              </div>
              {expandedId === application.id && <StatusTimeline history={history[application.id] ?? []} isLoading={historyLoading === application.id} />}
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function StatusTimeline({ history, isLoading }: { history: ApplicationStatusHistory[]; isLoading: boolean }) {
  if (isLoading) return <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">Loading status timeline...</p>;
  if (history.length === 0) return <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">No status history available.</p>;
  return (
    <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
      {history.map((item, index) => (
        <div key={item.id} className="relative pl-6">
          {index < history.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-indigo-200" />}
          <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#5b55dc]" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold">{item.newStatus}</p>
            <time className="text-xs text-slate-400">{new Date(item.changedAt).toLocaleString()}</time>
          </div>
          <p className="mt-1 text-xs text-slate-500">Updated by {item.changedByName}</p>
          {item.notes && <p className="mt-1 text-sm text-slate-600">{item.notes}</p>}
        </div>
      ))}
    </div>
  );
}
