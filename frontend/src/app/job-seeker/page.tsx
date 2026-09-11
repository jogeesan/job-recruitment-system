"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, FileText, UserRound, type LucideIcon } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { useAuth } from "@/store/authStore";
import { getApplications, getJobSeekerInterviews, getProfileData, getSavedJobIds } from "@/lib/jobs";
import { useEffect, useState } from "react";
import type { ApplicationSummary } from "@/types/jobSeeker";

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [savedJobCount, setSavedJobCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getApplications(), getSavedJobIds(), getJobSeekerInterviews(), getProfileData()])
      .then(([loadedApplications, savedIds, interviews, profileData]) => {
        setApplications(loadedApplications);
        setSavedJobCount(savedIds.length);
        setInterviewCount(interviews.length);
        setProfileComplete(profileData.education.length > 0 || profileData.experience.length > 0 || profileData.skills.length > 0);
      })
      .catch(() => setError("We could not load your dashboard data."));
  }, []);

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
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {([
            ["Applications", String(applications.length), "/job-seeker/applications", FileText],
            ["Saved Jobs", String(savedJobCount), "/job-seeker/saved-jobs", BriefcaseBusiness],
            ["Interviews", String(interviewCount), "/job-seeker/interviews", CalendarDays],
            ["Profile", profileComplete ? "Updated" : "Incomplete", "/job-seeker/profile", UserRound],
          ] as Array<[string, string, string, LucideIcon]>).map(([label, value, href, Icon]) => (
            <Link href={href} key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-[#5b55dc]" />
              <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Recent Applications</h2>
          {applications.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No applications have been submitted yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {applications.slice(0, 3).map((application) => (
                <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800">{application.jobTitle}</p>
                    <p className="text-slate-500">{application.companyName}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{application.status}</span>
                </div>
              ))}
            </div>
          )}
          <Link href={applications.length > 0 ? "/job-seeker/applications" : "/job-seeker/jobs"} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5b55dc]">
            {applications.length > 0 ? "View all applications" : "Browse available jobs"} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </ProtectedDashboard>
  );
}
