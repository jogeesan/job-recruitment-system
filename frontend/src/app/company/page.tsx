"use client";

import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";

export default function CompanyDashboard() {
  return (
    <ProtectedDashboard role="HR">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5b55dc]">HR Portal</p>
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-sm text-slate-500">Your live recruitment metrics will appear here once jobs and applications are available.</p>
      </div>
    </ProtectedDashboard>
  );
}
