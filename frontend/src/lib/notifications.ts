import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { NotificationItem } from "@/types/notification";

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get<ApiResponse<NotificationItem[]>>("/api/notifications");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await api.get<ApiResponse<number>>("/api/notifications/unread-count");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function markNotificationAsRead(id: number): Promise<NotificationItem> {
  const response = await api.put<ApiResponse<NotificationItem>>(`/api/notifications/${id}/read`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const response = await api.put<ApiResponse<null>>("/api/notifications/read-all");
  if (!response.data.success) throw new Error(response.data.message);
}
