"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyInterviews, updateInterviewStatus } from "@/lib/company";
import type { CompanyInterview } from "@/types/company";

export default function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getCompanyInterviews().then(setInterviews).catch(() => setError("We could not load interviews.")); }, []);
  async function changeStatus(interview: CompanyInterview, status: string) {
    try { const updated = await updateInterviewStatus(interview.id, status); setInterviews((current) => current.map((item) => item.id === updated.id ? updated : item)); }
    catch { setError("We could not update the interview."); }
  }
  return <ProtectedDashboard role="HR"><div className="space-y-6"><header><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Interviews</h1><p className="mt-2 text-sm text-slate-500">Review and manage scheduled candidate interviews.</p></header>{error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{!error && interviews.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No interviews scheduled yet.</div>}<div className="space-y-3">{interviews.map((interview) => <article key={interview.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{interview.applicantName}</h2><p className="mt-1 text-sm text-slate-500">{interview.jobTitle} · {interview.interviewType}</p><p className="mt-2 text-sm font-medium">{new Date(interview.scheduledAt).toLocaleString()} · {interview.durationMinutes} minutes</p>{interview.location && <p className="mt-1 text-sm text-slate-500">{interview.location}</p>}{interview.meetingLink && <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-[#5b55dc]">Open meeting link</a>}</div><select value={interview.status} onChange={(e) => void changeStatus(interview, e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option>SCHEDULED</option><option>ACCEPTED</option><option>DECLINED</option><option>COMPLETED</option><option>CANCELLED</option></select></div>{interview.notes && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">{interview.notes}</p>}</article>)}</div></div></ProtectedDashboard>;
}
