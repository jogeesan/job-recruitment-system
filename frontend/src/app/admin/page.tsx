"use client";

import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";

export default function AdminDashboard() {
  return (
    <ProtectedDashboard role="ADMIN">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5b55dc]">Platform Administration</p>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Platform statistics will be loaded from the admin APIs.</p>
      </div>
    </ProtectedDashboard>
  );
}
