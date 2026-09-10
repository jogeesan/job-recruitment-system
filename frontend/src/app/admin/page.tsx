"use client";

import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/lib/admin";
import type { AdminDashboard as DashboardData } from "@/types/admin";

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getAdminDashboard().then(setData).catch(() => setError("We could not load platform statistics.")); }, []);
  return (
    <ProtectedDashboard role="ADMIN">
      <div className="space-y-6">
        <p className="text-sm font-medium text-[#5b55dc]">Platform Administration</p>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!data && !error && <p className="text-sm text-slate-500">Loading statistics...</p>}
        {data && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
          ["Users", data.totalUsers], ["Companies", data.totalCompanies], ["Active jobs", data.activeJobs], ["Applications", data.totalApplications],
          ["Job seekers", data.totalJobSeekers], ["HR users", data.totalHrUsers], ["Pending companies", data.pendingCompanies], ["All jobs", data.totalJobs],
        ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}</div>}
      </div>
    </ProtectedDashboard>
  );
}
