"use client";

import { useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/notifications";
import { useAuth } from "@/store/authStore";
import type { NotificationItem } from "@/types/notification";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = user?.role ?? "JOB_SEEKER";

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => setError("We could not load your notifications."))
      .finally(() => setIsLoading(false));
  }, []);

  async function readNotification(notification: NotificationItem) {
    if (notification.isRead) return;
    try {
      const updated = await markNotificationAsRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not update this notification.");
    }
  }

  async function readAll() {
    try {
      await markAllNotificationsAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not update your notifications.");
    }
  }

  return (
    <ProtectedDashboard role={role}>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#5b55dc]">RecruitFlow</p>
            <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">Stay up to date with your recruitment activity.</p>
          </div>
          {notifications.some((notification) => !notification.isRead) && (
            <button type="button" onClick={() => void readAll()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Mark all as read
            </button>
          )}
        </header>
        {isLoading && <p className="text-sm text-slate-500">Loading notifications...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            You have no notifications yet.
          </div>
        )}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => void readNotification(notification)}
              className={`w-full rounded-xl border p-5 text-left shadow-sm transition ${notification.isRead ? "border-slate-200 bg-white" : "border-indigo-200 bg-indigo-50/50"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">{notification.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                </div>
                {!notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5b55dc]" aria-label="Unread" />}
              </div>
              <p className="mt-3 text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>
    </ProtectedDashboard>
  );
}
