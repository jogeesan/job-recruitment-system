"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
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
        {!isLoading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">No applications yet</p>
            <p className="mt-1 text-sm text-slate-500">Applications you submit will appear here.</p>
          </div>
        )}
        <div className="space-y-3">
          {applications.map((application) => (
            <article key={application.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-slate-900">{application.jobTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{application.companyName}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Applied {formatDate(application.appliedAt)}</span>
                    <span>Updated {formatDate(application.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={application.status} />
                  <button type="button" onClick={() => void toggleHistory(application.id)} aria-expanded={expandedId === application.id} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#5b55dc] hover:text-[#5b55dc]">
                    {expandedId === application.id ? <>Hide <ChevronUp className="h-3.5 w-3.5" /></> : <>Timeline <ChevronDown className="h-3.5 w-3.5" /></>}
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
          <span className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-white bg-[#5b55dc] ring-2 ring-indigo-100" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{formatLabel(item.newStatus)}</p>
            <time className="text-xs text-slate-400">{formatDateTime(item.changedAt)}</time>
          </div>
          <p className="mt-1 text-xs text-slate-500">Updated by {item.changedByName}</p>
          {item.notes && <p className="mt-1 text-sm text-slate-600">{item.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPLIED: "bg-slate-100 text-slate-700",
    REVIEWING: "bg-blue-50 text-blue-700",
    SHORTLISTED: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-700",
    HIRED: "bg-emerald-50 text-emerald-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-indigo-50 text-indigo-700"}`}>{formatLabel(status)}</span>;
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
