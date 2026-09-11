"use client";

import { AlertCircle, Bell, BriefcaseBusiness, CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/notifications";
import { useAuth } from "@/store/authStore";
import type { NotificationItem } from "@/types/notification";

const notificationUpdatedEvent = "notifications:updated";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [readingId, setReadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const role = user?.role ?? "JOB_SEEKER";
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.isRead).length, [notifications]);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => setError("We could not load your notifications."))
      .finally(() => setIsLoading(false));
  }, []);

  async function readNotification(notification: NotificationItem) {
    if (notification.isRead || readingId !== null || isMarkingAll) return;
    setReadingId(notification.id);
    setError(null);
    try {
      const updated = await markNotificationAsRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === updated.id ? updated : item));
      window.dispatchEvent(new Event(notificationUpdatedEvent));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not update this notification.");
    } finally {
      setReadingId(null);
    }
  }

  async function readAll() {
    if (isMarkingAll || unreadCount === 0) return;
    setIsMarkingAll(true);
    setError(null);
    try {
      await markAllNotificationsAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      window.dispatchEvent(new Event(notificationUpdatedEvent));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not update your notifications.");
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <ProtectedDashboard role={role}>
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#5b55dc]">RecruitFlow</p>
            <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">Stay up to date with your recruitment activity.</p>
          </div>
          {!isLoading && unreadCount > 0 && (
            <button type="button" disabled={isMarkingAll} onClick={() => void readAll()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#5b55dc] hover:text-[#5b55dc] disabled:cursor-not-allowed disabled:opacity-60">
              {isMarkingAll && <Loader2 className="h-4 w-4 animate-spin" />}
              {isMarkingAll ? "Updating..." : `Mark all as read (${unreadCount})`}
            </button>
          )}
        </header>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {isLoading && <div className="space-y-3"><div className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" /><div className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" /><div className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" /></div>}

        {!isLoading && notifications.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Bell className="mx-auto h-9 w-9 text-slate-300" />
            <p className="mt-4 text-sm font-semibold text-slate-700">You have no notifications yet</p>
            <p className="mt-1 text-sm text-slate-500">New recruitment activity will appear here.</p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const isReading = readingId === notification.id;
              return (
                <button key={notification.id} type="button" disabled={isReading || isMarkingAll} onClick={() => void readNotification(notification)} className={`group w-full rounded-xl border p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#5b55dc] disabled:cursor-wait ${notification.isRead ? "border-slate-200 bg-white hover:border-slate-300" : "border-indigo-200 bg-indigo-50/50 hover:border-[#5b55dc]"}`}>
                  <div className="flex items-start gap-4">
                    <NotificationIcon type={notification.type} isRead={notification.isRead} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0"><h2 className={`font-bold ${notification.isRead ? "text-slate-800" : "text-slate-950"}`}>{notification.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p></div>
                        {isReading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#5b55dc]" /> : !notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5b55dc]" aria-label="Unread" />}
                      </div>
                      <p className="mt-3 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedDashboard>
  );
}

function NotificationIcon({ type, isRead }: { type: string; isRead: boolean }) {
  const normalizedType = type.toLowerCase();
  const Icon = normalizedType.includes("interview") ? CalendarDays : normalizedType.includes("job") || normalizedType.includes("application") ? BriefcaseBusiness : normalizedType.includes("success") || normalizedType.includes("hired") ? CheckCircle2 : normalizedType.includes("alert") || normalizedType.includes("rejected") ? AlertCircle : Bell;
  return <div className={`rounded-xl p-3 ${isRead ? "bg-slate-100 text-slate-400" : "bg-indigo-100 text-[#5b55dc]"}`}><Icon className="h-5 w-5" /></div>;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
