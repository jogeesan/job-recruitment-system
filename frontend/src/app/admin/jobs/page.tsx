"use client";

import { BriefcaseBusiness, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getAdminJobs, updateAdminJobStatus } from "@/lib/admin";
import type { AdminJob } from "@/types/admin";

export default function AdminJobsPage() {
  const [items, setItems] = useState<AdminJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    getAdminJobs().then(setItems).catch(() => setError("We could not load jobs.")).finally(() => setIsLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const searchable = `${item.title} ${item.companyName} ${item.location ?? ""}`.toLowerCase();
      return (!normalized || searchable.includes(normalized)) && (!statusFilter || item.status === statusFilter);
    });
  }, [items, query, statusFilter]);

  async function change(item: AdminJob, status: string) {
    setUpdatingId(item.id);
    setError(null);
    try {
      const updated = await updateAdminJobStatus(item.id, status);
      setItems((current) => current.map((job) => job.id === updated.id ? updated : job));
    } catch {
      setError("We could not update this job.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <ProtectedDashboard role="ADMIN">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Administration</p>
          <h1 className="mt-1 text-3xl font-bold">Jobs</h1>
          <p className="mt-2 text-sm text-slate-500">Review and manage job postings across the platform.</p>
        </header>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search job, company, or location" aria-label="Search jobs" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#5b55dc]" /></label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by job status" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="">All job statuses</option>{Array.from(new Set(items.map((item) => item.status))).map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}</select>
        </div>
        {isLoading && <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />}
        {!isLoading && filteredItems.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No jobs found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filter.</p></div>}
        {!isLoading && filteredItems.length > 0 && <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Job</th><th className="p-4">Company</th><th className="p-4">Location</th><th className="p-4">Applications</th><th className="p-4">Created</th><th className="p-4">Status</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"><td className="p-4"><p className="font-semibold text-slate-900">{item.title}</p><p className="text-xs text-slate-500">{formatLabel(item.employmentType)}</p></td><td className="p-4 font-medium text-slate-700">{item.companyName}</td><td className="p-4 text-slate-500">{item.location ?? "Location not specified"}</td><td className="p-4"><span className="inline-flex items-center gap-1 font-semibold text-slate-700"><Users className="h-4 w-4 text-slate-400" />{item.applicationCount}</span></td><td className="p-4 text-slate-500">{formatDate(item.createdAt)}</td><td className="p-4"><div className="flex items-center gap-2"><StatusBadge status={item.status} /><select disabled={updatingId === item.id} value={item.status} onChange={(event) => void change(item, event.target.value)} aria-label={`Update status for ${item.title}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-60"><option value="DRAFT">Draft</option><option value="OPEN">Open</option><option value="PUBLISHED">Published</option><option value="CLOSED">Closed</option></select></div></td></tr>)}</tbody></table></div>}
      </div>
    </ProtectedDashboard>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { DRAFT: "bg-slate-100 text-slate-700", OPEN: "bg-emerald-50 text-emerald-700", PUBLISHED: "bg-blue-50 text-blue-700", CLOSED: "bg-red-50 text-red-700" };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-amber-50 text-amber-700"}`}>{formatLabel(status)}</span>;
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
