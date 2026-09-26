"use client";

import { CalendarDays, Clock3, ExternalLink, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getJobSeekerInterviews, respondToInterview } from "@/lib/jobs";
import type { JobSeekerInterview } from "@/types/interview";

export default function JobSeekerInterviewsPage() {
  const [interviews, setInterviews] = useState<JobSeekerInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<number | null>(null);

  useEffect(() => {
    getJobSeekerInterviews()
      .then(setInterviews)
      .catch(() => setError("We could not load your interviews."))
      .finally(() => setIsLoading(false));
  }, []);

  async function respond(interview: JobSeekerInterview, response: "ACCEPTED" | "DECLINED") {
    setRespondingId(interview.id);
    setError(null);
    try {
      const updated = await respondToInterview(interview.id, response);
      setInterviews((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not save your response.");
    } finally {
      setRespondingId(null);
    }
  }

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">Interviews</h1>
          <p className="mt-2 text-sm text-slate-500">Review your scheduled interviews and respond to invitations.</p>
        </header>
        {isLoading && <p className="text-sm text-slate-500">Loading interviews...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!isLoading && !error && interviews.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">No interviews scheduled</p>
            <p className="mt-1 text-sm text-slate-500">
            No interviews have been scheduled for your applications yet.
            </p>
          </div>
        )}
        <div className="space-y-3">
          {interviews.map((interview) => (
            <article key={interview.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-slate-900">{interview.jobTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{interview.companyName} · {formatLabel(interview.interviewType)}</p>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <CalendarDays className="h-4 w-4 text-[#5b55dc]" /> {formatDateTime(interview.scheduledAt)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-400" /> {interview.durationMinutes} minutes
                    </span>
                    {interview.location && <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" /> {interview.location}
                    </span>}
                  </div>
                  {interview.meetingLink && <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b55dc] hover:underline">Open meeting link <ExternalLink className="h-3.5 w-3.5" /></a>}
                </div>
                <StatusBadge status={interview.status} />
              </div>
              {interview.notes && <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{interview.notes}</p>
              </div>}
              {interview.status === "SCHEDULED" && (
                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                  <button type="button" disabled={respondingId === interview.id} onClick={() => void respond(interview, "ACCEPTED")} className="rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60">
                    {respondingId === interview.id ? "Saving..." : "Accept"}
                  </button>
                  <button type="button" disabled={respondingId === interview.id} onClick={() => void respond(interview, "DECLINED")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60">Decline</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SCHEDULED: "bg-blue-50 text-blue-700",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
    DECLINED: "bg-red-50 text-red-700",
    COMPLETED: "bg-slate-100 text-slate-700",
    CANCELLED: "bg-amber-50 text-amber-700",
  };
  return <span className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-indigo-50 text-indigo-700"}`}>{formatLabel(status)}</span>;
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
