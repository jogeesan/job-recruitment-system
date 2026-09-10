"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, FileText, UserRound } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { useAuth } from "@/store/authStore";

export default function JobSeekerDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your applications and find your next opportunity.</p>
          </div>
          <Link href="/job-seeker/jobs" className="inline-flex items-center gap-2 rounded-lg bg-[#5b55dc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4c47c7]">
            Find Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Applications", "No applications yet", FileText],
            ["Saved Jobs", "No saved jobs yet", BriefcaseBusiness],
            ["Interviews", "No interviews scheduled", CalendarDays],
            ["Profile", "Complete your profile", UserRound],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-[#5b55dc]" />
              <p className="mt-5 text-sm font-medium text-slate-500">{label as string}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{value as string}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Recent Applications</h2>
          <p className="mt-2 text-sm text-slate-500">Your submitted applications will appear here.</p>
          <Link href="/job-seeker/jobs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5b55dc]">
            Browse available jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </ProtectedDashboard>
  );
}
