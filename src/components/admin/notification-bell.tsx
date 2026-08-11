'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  url: string | null;
  isRead: boolean;
  createdAt: string;
}

const POLL_MS = 30_000;

export function NotificationBell({ adminId }: { adminId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  async function refreshCount() {
    const res = await fetch(`/api/notifications/unread-count?recipientType=ADMIN&recipientId=${adminId}`, { cache: 'no-store' });
    if (res.ok) setUnreadCount((await res.json()).count);
  }

  async function loadNotifications() {
    const res = await fetch(`/api/notifications?recipientType=ADMIN&recipientId=${adminId}`, { cache: 'no-store' });
    if (res.ok) setNotifications((await res.json()).notifications);
  }

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) await loadNotifications();
  }

  async function handleClick(n: AdminNotification) {
    if (!n.isRead) {
      await fetch(`/api/notifications/${n.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((list) => list.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
    }
    setOpen(false);
    if (n.url) router.push(n.url);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ivory/80 hover:bg-forest-800/60"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-gold-200 bg-white shadow-lg">
          <div className="px-4 py-3 border-b border-gold-100">
            <p className="text-sm font-medium text-forest-900">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-forest-800/50">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`block w-full text-left px-4 py-3 text-sm border-b border-gold-50 last:border-0 hover:bg-cream/60 ${
                  n.isRead ? 'text-forest-800/60' : 'text-forest-900 font-medium bg-gold-50/40'
                }`}
              >
                <p className="line-clamp-2">{n.message}</p>
                <p className="mt-1 text-[11px] text-forest-800/40">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
