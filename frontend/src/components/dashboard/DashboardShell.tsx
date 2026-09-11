"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, BriefcaseBusiness, FileText, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/store/authStore";
import { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "@/lib/notifications";

type DashboardRole = "JOB_SEEKER" | "HR" | "ADMIN";
const notificationUpdatedEvent = "notifications:updated";

const navigation: Record<DashboardRole, Array<{ label: string; href: string; icon: typeof LayoutDashboard }>> = {
  JOB_SEEKER: [
    { label: "Dashboard", href: "/job-seeker", icon: LayoutDashboard },
    { label: "Find Jobs", href: "/job-seeker/jobs", icon: BriefcaseBusiness },
    { label: "Saved Jobs", href: "/job-seeker/saved-jobs", icon: Bookmark },
    { label: "My Applications", href: "/job-seeker/applications", icon: FileText },
    { label: "Interviews", href: "/job-seeker/interviews", icon: FileText },
    { label: "My Profile", href: "/job-seeker/profile", icon: UserRound },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ],
  HR: [
    { label: "Dashboard", href: "/company", icon: LayoutDashboard },
    { label: "Jobs", href: "/company/jobs", icon: BriefcaseBusiness },
    { label: "Applications", href: "/company/applications", icon: FileText },
    { label: "Interviews", href: "/company/interviews", icon: FileText },
    { label: "Company Profile", href: "/company/profile", icon: UserRound },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
    { label: "Users", href: "/admin/users", icon: UserRound },
    { label: "Companies", href: "/admin/companies", icon: BriefcaseBusiness },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Skills", href: "/admin/skills", icon: FileText },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: DashboardRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const items = navigation[role];

  useEffect(() => {
    const refreshUnreadCount = () => {
      getUnreadNotificationCount().then(setUnreadCount).catch(() => setUnreadCount(0));
    };
    refreshUnreadCount();
    window.addEventListener(notificationUpdatedEvent, refreshUnreadCount);
    return () => window.removeEventListener(notificationUpdatedEvent, refreshUnreadCount);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-[#0e172b] text-slate-300 lg:flex">
        <div className="border-b border-white/5 px-6 py-5">
          <Link href={items[0].href} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b55dc] text-sm font-bold text-white">RF</span>
            <span>
              <span className="block text-sm font-bold text-white">RecruitFlow</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#21c79a]">
                {role === "JOB_SEEKER" ? "Job Seeker" : role === "HR" ? "HR Portal" : "Admin"}
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== items[0].href && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-[#5b55dc] text-white" : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#21c79a] px-1.5 py-0.5 text-[10px] font-bold text-[#0e172b]">{unreadCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/5 px-3 py-5">
          <Link href={`${items[0].href}/settings`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 hover:text-white">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
          {user && (
            <div className="mt-4 border-t border-white/5 px-2 pt-4">
              <p className="truncate text-sm font-semibold text-white">{user.firstName} {user.lastName}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          )}
        </div>
      </aside>

      <main className="min-h-screen lg:pl-60">
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
