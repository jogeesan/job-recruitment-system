"use client";

import { CalendarDays, ChevronDown, ChevronUp, FileText, Mail, UserRound } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { isAxiosError } from "axios";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyApplications, scheduleInterview, updateApplicationStatus } from "@/lib/company";
import type { CompanyApplication } from "@/types/company";

const statuses = ["APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<CompanyApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [schedulingId, setSchedulingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { type: string; at: string }>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const scheduling = useRef(false);
  function editDraft(id: number, changes: Partial<{ type: string; at: string }>) {
    setDrafts(current => ({ ...current, [id]: { ...(current[id] ?? { type: "ONLINE", at: "" }), ...changes } }));
    setSchedulingId(null);
  }
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  useEffect(() => { getCompanyApplications().then(setApplications).catch(() => setError("We could not load applications.")); }, []);
  async function changeStatus(application: CompanyApplication, status: string) {
    setUpdatingId(application.id); setError(null);
    try { const updated = await updateApplicationStatus(application.id, status); setApplications((current) => current.map((item) => item.id === updated.id ? updated : item)); }
    catch { setError("We could not update the application."); }
    finally { setUpdatingId(null); }
  }
  async function schedule(application: CompanyApplication) {
    if (scheduling.current) return;
    const draft = drafts[application.id] ?? { type: "ONLINE", at: "" };
    const date = new Date(draft.at);
    if (!draft.at || Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
      setError("Choose a valid future interview date and time.");
      return;
    }
    scheduling.current = true;
    setPendingId(application.id);
    setSchedulingId(null);
    setError(null);
    try {
      await scheduleInterview(application.id, { interviewType: draft.type, scheduledAt: date.toISOString(), durationMinutes: 60 });
      setSchedulingId(application.id);
      setDrafts(current => ({ ...current, [application.id]: { ...draft, at: "" } }));
    } catch (reason) {
      const message = isAxiosError(reason) ? reason.response?.data?.message : undefined;
      setError(typeof message === "string" ? message : "We could not schedule the interview. Please try again.");
    } finally {
      scheduling.current = false;
      setPendingId(null);
    }
  }
  return <ProtectedDashboard role="HR"><div className="space-y-6"><header><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Applications</h1><p className="mt-2 text-sm text-slate-500">Review candidates, resumes, and application progress.</p></header>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{applications.length === 0 && !error && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><FileText className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No applications yet</p><p className="mt-1 text-sm text-slate-500">Applications submitted to your jobs will appear here.</p></div>}<div className="space-y-3">{applications.map((application) => <article key={application.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h2 className="truncate font-bold text-slate-900">{application.applicantName}</h2><p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500"><Mail className="h-4 w-4" />{application.applicantEmail}</p><p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700"><BriefcaseIcon />{application.jobTitle}</p><p className="mt-1 text-xs text-slate-400">Applied {formatDate(application.appliedAt)}</p></div><div className="flex items-center gap-3"><StatusBadge status={application.status} /><select disabled={updatingId === application.id} value={application.status} onChange={(e) => void changeStatus(application, e.target.value)} aria-label={`Update status for ${application.applicantName}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-60">{statuses.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}</select></div></div><div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">{application.resumeFileUrl ? <a href={application.resumeFileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#5b55dc]"><FileText className="h-4 w-4" />View resume{application.resumeFileName ? ` · ${application.resumeFileName}` : ""}</a> : <span className="text-sm text-slate-400">No resume attached</span>} {application.coverLetter && <button type="button" onClick={() => setExpandedId(expandedId === application.id ? null : application.id)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">{expandedId === application.id ? "Hide cover letter" : "View cover letter"}{expandedId === application.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>}</div>{expandedId === application.id && application.coverLetter && <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">{application.coverLetter}</div>}<div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[auto_auto_1fr] sm:items-end"><label className="text-xs font-semibold text-slate-600">Interview type<select value={drafts[application.id]?.type ?? "ONLINE"} onChange={(e) => editDraft(application.id, { type: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ONLINE">Video</option><option value="PHONE">Phone</option><option value="ONSITE">On-site</option></select></label><label className="text-xs font-semibold text-slate-600">Date and time<input type="datetime-local" value={drafts[application.id]?.at ?? ""} onChange={(e) => editDraft(application.id, { at: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><button type="button" disabled={pendingId !== null} onClick={() => void schedule(application)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b55dc] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4c47c7]">{pendingId === application.id ? "Scheduling..." : schedulingId === application.id ? <><CheckCircleIcon /> Interview scheduled</> : <><CalendarDays className="h-4 w-4" />Schedule interview</>}</button></div></article>)}</div></div></ProtectedDashboard>;
}

function BriefcaseIcon() { return <UserRound className="h-4 w-4 text-slate-400" />; }
function CheckCircleIcon() { return <span className="inline-block h-2 w-2 rounded-full bg-white" />; }
function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { APPLIED: "bg-slate-100 text-slate-700", REVIEWING: "bg-blue-50 text-blue-700", SHORTLISTED: "bg-amber-50 text-amber-700", REJECTED: "bg-red-50 text-red-700", HIRED: "bg-emerald-50 text-emerald-700" }; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-indigo-50 text-indigo-700"}`}>{formatLabel(status)}</span>; }
function formatLabel(value: string): string { return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
