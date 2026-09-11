"use client";

import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, ClipboardList, FileText, Users } from "lucide-react";
import { getAdminDashboard } from "@/lib/admin";
import type { AdminDashboard as DashboardData } from "@/types/admin";

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getAdminDashboard().then(setData).catch(() => setError("We could not load platform statistics.")); }, []);
  return (
    <ProtectedDashboard role="ADMIN">
      <div className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#5b55dc]">Platform Administration</p>
            <h1 className="mt-1 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Monitor users, companies, jobs, and applications across the platform.</p>
          </div>
          <Link href="/admin/companies" className="inline-flex items-center gap-2 rounded-lg bg-[#5b55dc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7]">Review companies <ArrowRight className="h-4 w-4" /></Link>
        </header>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!data && !error && <DashboardSkeleton />}
        {data && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total users" value={data.totalUsers} icon={Users} />
          <Metric label="Companies" value={data.totalCompanies} icon={Building2} />
          <Metric label="Active jobs" value={data.activeJobs} icon={BriefcaseBusiness} />
          <Metric label="Applications" value={data.totalApplications} icon={FileText} />
          <Metric label="Job seekers" value={data.totalJobSeekers} icon={Users} />
          <Metric label="HR users" value={data.totalHrUsers} icon={Users} />
          <Metric label="Pending companies" value={data.pendingCompanies} icon={ClipboardList} emphasis={data.pendingCompanies > 0} />
          <Metric label="All jobs" value={data.totalJobs} icon={CheckCircle2} />
        </div>}
        {data && <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions title="User and company management" links={[["/admin/users", "Manage users"], ["/admin/companies", "Manage companies"]]} />
          <QuickActions title="Recruitment management" links={[["/admin/jobs", "Manage jobs"], ["/admin/applications", "Review applications"]]} />
        </div>}
      </div>
    </ProtectedDashboard>
  );
}

function Metric({ label, value, icon: Icon, emphasis = false }: { label: string; value: number; icon: typeof Users; emphasis?: boolean }) {
  return <div className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${emphasis ? "border-amber-200 ring-1 ring-amber-100" : "border-slate-200 hover:border-[#c7c4f7]"}`}><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className={`h-5 w-5 ${emphasis ? "text-amber-600" : "text-[#5b55dc]"}`} /></div><p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>{emphasis && <p className="mt-1 text-xs font-medium text-amber-700">Requires review</p>}</div>;
}

function QuickActions({ title, links }: { title: string; links: string[][] }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold">{title}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{links.map(([href, label]) => <Link key={href} href={href} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#c7c4f7] hover:text-[#5b55dc]">{label}<ArrowRight className="h-4 w-4" /></Link>)}</div></div>;
}

function DashboardSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />)}</div>;
}
