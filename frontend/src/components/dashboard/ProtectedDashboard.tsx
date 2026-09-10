"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export function ProtectedDashboard({
  role,
  children,
}: {
  role: "JOB_SEEKER" | "HR" | "ADMIN";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    if (!isLoading && user && user.role !== role) router.replace("/");
  }, [isLoading, role, router, user]);

  if (isLoading || !user || user.role !== role) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] text-sm text-slate-500">Loading your workspace...</div>;
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
