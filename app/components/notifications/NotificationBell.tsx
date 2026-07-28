"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationsApi, type AppNotification } from "@/app/lib/api/notifications";
import s from "./notification-bell.module.css";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = () => {
    notificationsApi
      .list()
      .then((res) => {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      })
      .catch((err) => console.error("Failed to load notifications", err));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((o) => !o);
    if (!open) load(); // refresh on open
  };

  const handleNotificationClick = async (n: AppNotification) => {
    if (!n.read) {
      try {
        await notificationsApi.markRead(n._id);
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error("Failed to mark notification read", err);
      }
    }
    setOpen(false);
    if (n.carId) router.push(`/cars/${n.carId}`);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  };

  return (
    <div className={s.container} ref={containerRef}>
      <button className={s.bellBtn} aria-label="Notifications" onClick={handleToggle}>
        🔔
        {unreadCount > 0 && (
          <span className={s.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={s.dropdown}>
          <div className={s.dropdownHeader}>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className={s.markAllBtn} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className={s.list}>
            {notifications.length === 0 ? (
              <div className={s.empty}>No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  className={`${s.item} ${!n.read ? s.itemUnread : ""}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <span className={s.itemDot} />
                  <div>
                    <div className={s.itemMessage}>{n.message}</div>
                    <div className={s.itemTime}>{timeAgo(n.createdAt)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}