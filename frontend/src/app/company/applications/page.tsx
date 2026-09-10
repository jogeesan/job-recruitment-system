"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyApplications, updateApplicationStatus } from "@/lib/company";
import type { CompanyApplication } from "@/types/company";

const statuses = ["APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<CompanyApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getCompanyApplications().then(setApplications).catch(() => setError("We could not load applications.")); }, []);
  async function changeStatus(application: CompanyApplication, status: string) {
    try { const updated = await updateApplicationStatus(application.id, status); setApplications((current) => current.map((item) => item.id === updated.id ? updated : item)); }
    catch { setError("We could not update the application."); }
  }
  return <ProtectedDashboard role="HR"><div className="space-y-6"><header><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Applications</h1><p className="mt-2 text-sm text-slate-500">Review candidates and move applications through your hiring process.</p></header>{error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{!error && applications.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No applications have been submitted to your jobs yet.</div>}<div className="space-y-3">{applications.map((application) => <article key={application.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{application.applicantName}</h2><p className="mt-1 text-sm text-slate-500">{application.applicantEmail}</p><p className="mt-2 text-sm font-medium text-slate-700">Applied for {application.jobTitle}</p><p className="mt-1 text-xs text-slate-400">{new Date(application.appliedAt).toLocaleDateString()}</p></div><select value={application.status} onChange={(e) => void changeStatus(application, e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>{application.coverLetter && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">{application.coverLetter}</p>}</article>)}</div></div></ProtectedDashboard>;
}
