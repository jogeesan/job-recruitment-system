"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getJobSeekerInterviews, respondToInterview } from "@/lib/jobs";
import type { JobSeekerInterview } from "@/types/interview";

export default function JobSeekerInterviewsPage() {
  const [interviews, setInterviews] = useState<JobSeekerInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJobSeekerInterviews()
      .then(setInterviews)
      .catch(() => setError("We could not load your interviews."))
      .finally(() => setIsLoading(false));
  }, []);

  async function respond(interview: JobSeekerInterview, response: "ACCEPTED" | "DECLINED") {
    try {
      const updated = await respondToInterview(interview.id, response);
      setInterviews((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not save your response.");
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
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No interviews have been scheduled for your applications yet.
          </div>
        )}
        <div className="space-y-3">
          {interviews.map((interview) => (
            <article key={interview.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">{interview.jobTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{interview.companyName} · {interview.interviewType}</p>
                  <p className="mt-3 text-sm font-semibold">{new Date(interview.scheduledAt).toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-500">{interview.durationMinutes} minutes{interview.location ? ` · ${interview.location}` : ""}</p>
                  {interview.meetingLink && <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-[#5b55dc]">Open meeting link</a>}
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{interview.status}</span>
              </div>
              {interview.notes && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">{interview.notes}</p>}
              {interview.status === "SCHEDULED" && (
                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => void respond(interview, "ACCEPTED")} className="rounded-lg bg-[#5b55dc] px-4 py-2 text-sm font-semibold text-white">Accept</button>
                  <button type="button" onClick={() => void respond(interview, "DECLINED")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Decline</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
