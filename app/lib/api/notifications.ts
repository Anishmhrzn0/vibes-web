export interface AppNotification {
  _id: string;
  carId?: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const notificationsApi = {
  list: () =>
    request<{ notifications: AppNotification[]; unreadCount: number }>(
      "/api/notifications/mine"
    ),
  markRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () =>
    request<{ success: boolean }>("/api/notifications/read-all", { method: "PATCH" }),
};