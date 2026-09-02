"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import {
  Briefcase, LogOut, User, Bell, Search,
  TrendingUp, FileText, CheckCircle, Clock
} from "lucide-react";

// ─── Role Badge ───────────────────────────────────────────────────────────────
const roleBadge: Record<string, { label: string; color: string }> = {
  JOB_SEEKER: { label: "Job Seeker", color: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  HR: { label: "HR / Recruiter", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  ADMIN: { label: "Administrator", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const badge = roleBadge[user.role] ?? roleBadge.JOB_SEEKER;
  const stats =
    user.role === "JOB_SEEKER"
      ? [
          { icon: Search, label: "Jobs Available", value: "1,240", color: "text-violet-400" },
          { icon: FileText, label: "Applications", value: "3", color: "text-indigo-400" },
          { icon: Clock, label: "Under Review", value: "1", color: "text-amber-400" },
          { icon: CheckCircle, label: "Interviews", value: "0", color: "text-emerald-400" },
        ]
      : [
          { icon: Briefcase, label: "Active Jobs", value: "5", color: "text-violet-400" },
          { icon: FileText, label: "Applications", value: "28", color: "text-indigo-400" },
          { icon: Clock, label: "Pending Review", value: "12", color: "text-amber-400" },
          { icon: TrendingUp, label: "Hired", value: "3", color: "text-emerald-400" },
        ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-700/10 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">TalentBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Active
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-400 mt-1.5">
            {user.role === "JOB_SEEKER"
              ? "Here's what's happening with your job search today."
              : "Here's your recruiting overview for today."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {user.role === "JOB_SEEKER" ? "Quick Actions" : "Recruiter Actions"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.role === "JOB_SEEKER" ? (
              <>
                <button className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:border-violet-500/40 transition-all text-left group">
                  <Search className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-white">Browse Jobs</p>
                    <p className="text-xs text-gray-500">Find your next opportunity</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all text-left group">
                  <User className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-white">Edit Profile</p>
                    <p className="text-xs text-gray-500">Update your resume & skills</p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:border-indigo-500/40 transition-all text-left group">
                  <Briefcase className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-white">Post a Job</p>
                    <p className="text-xs text-gray-500">Create a new job listing</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-white/20 transition-all text-left group">
                  <FileText className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-white">Review Applications</p>
                    <p className="text-xs text-gray-500">View and manage applicants</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
