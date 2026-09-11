"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, FileText, Plus, Users } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyDashboard } from "@/lib/company";
import type { CompanyDashboard as DashboardData } from "@/types/company";

export default function CompanyDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCompanyDashboard().then(setDashboard).catch(() => setError("We could not load your company dashboard."));
  }, []);

  return (
    <ProtectedDashboard role="HR">
      <div className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
          <p className="text-sm font-medium text-[#5b55dc]">HR Portal</p>
          <h1 className="mt-1 text-3xl font-bold">{dashboard?.company.companyName ?? "Company Dashboard"}</h1>
          <p className="mt-2 text-sm text-slate-500">Monitor your recruitment activity and manage open roles.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/company/jobs" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#5b55dc] hover:text-[#5b55dc]">
              <BriefcaseBusiness className="h-4 w-4" /> Manage jobs
            </Link>
            <Link href="/company/jobs" className="inline-flex items-center gap-2 rounded-lg bg-[#5b55dc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7]">
              <Plus className="h-4 w-4" /> Post a job
            </Link>
          </div>
        </header>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!dashboard && !error && <DashboardSkeleton />}
        {dashboard && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total jobs" value={dashboard.totalJobs} icon={BriefcaseBusiness} />
          <Metric label="Active jobs" value={dashboard.activeJobs} icon={CheckCircle2} />
          <Metric label="Applications" value={dashboard.totalApplications} icon={Users} />
          <Metric label="Shortlisted" value={dashboard.shortlistedApplications} icon={ClipboardList} />
        </div>}
        {dashboard && <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-[#5b55dc]" />
              <div>
                <h2 className="font-bold">Recruitment overview</h2>
                <p className="mt-1 text-sm text-slate-500">Use the portal to manage your jobs, applications, and interviews.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <QuickLink href="/company/jobs" label="Jobs" />
              <QuickLink href="/company/applications" label="Applications" />
              <QuickLink href="/company/interviews" label="Interviews" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Verification status</p>
            <StatusBadge status={dashboard.company.verificationStatus} />
            <p className="mt-3 text-sm leading-6 text-slate-500">This status is managed by the platform administrator.</p>
          </div>
        </div>}
      </div>
    </ProtectedDashboard>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof BriefcaseBusiness }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#c7c4f7] hover:shadow-md"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className="h-5 w-5 text-[#5b55dc]" /></div><p className="mt-3 text-3xl font-bold text-slate-900">{value}</p></div>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-700",
  };
  return <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>{formatLabel(status)}</span>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#c7c4f7] hover:text-[#5b55dc]">{label}<ArrowRight className="h-4 w-4" /></Link>;
}

function formatLabel(value: string): string {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function DashboardSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />)}</div>;
}
