"use client";

import { useEffect, useState } from "react";
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
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">HR Portal</p>
          <h1 className="mt-1 text-3xl font-bold">{dashboard?.company.companyName ?? "Company Dashboard"}</h1>
          <p className="mt-2 text-sm text-slate-500">Monitor your recruitment activity and manage open roles.</p>
        </header>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!dashboard && !error && <p className="text-sm text-slate-500">Loading dashboard...</p>}
        {dashboard && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total jobs" value={dashboard.totalJobs} />
          <Metric label="Active jobs" value={dashboard.activeJobs} />
          <Metric label="Applications" value={dashboard.totalApplications} />
          <Metric label="Shortlisted" value={dashboard.shortlistedApplications} />
        </div>}
        {dashboard && <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Verification status</p>
          <p className="mt-2 font-bold text-amber-700">{dashboard.company.verificationStatus}</p>
          <p className="mt-2 text-sm text-slate-500">Your company can post jobs while admin verification is pending.</p>
        </div>}
      </div>
    </ProtectedDashboard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
}
