'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Sparkles, Inbox } from 'lucide-react';

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
    try {
      const res = await fetch(`/api/notifications/unread-count?recipientType=ADMIN&recipientId=${adminId}`, {
        cache: 'no-store',
      });
      if (res.ok) setUnreadCount((await res.json()).count);
    } catch {
      // ignore
    }
  }

  async function loadNotifications() {
    try {
      const res = await fetch(`/api/notifications?recipientType=ADMIN&recipientId=${adminId}`, {
        cache: 'no-store',
      });
      if (res.ok) setNotifications((await res.json()).notifications);
    } catch {
      // ignore
    }
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

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(
      unread.map((n) =>
        fetch(`/api/notifications/${n.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        })
      )
    );
    setUnreadCount(0);
    setNotifications((list) => list.map((item) => ({ ...item, isRead: true })));
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleOpen}
        aria-label="Studio Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gold-200/90 bg-white text-forest-900 shadow-sm transition-all duration-200 hover:bg-gold-50/70 hover:border-gold-300 hover:text-gold-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-84 max-w-[92vw] rounded-2xl border border-gold-200/90 bg-white shadow-luxury backdrop-blur-xl animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gold-100 flex items-center justify-between bg-gold-50/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-forest-900">Notifications</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-gold-700 hover:text-gold-900 font-medium flex items-center gap-1 transition-colors"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gold-50">
            {notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-forest-800/50">
                <Inbox className="mx-auto h-8 w-8 text-gold-300 mb-1.5 opacity-60" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-[11px] text-forest-800/40 mt-0.5">Booking alerts will appear here</p>
              </div>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`block w-full text-left px-4 py-3 text-xs transition-colors hover:bg-gold-50/50 ${
                  n.isRead ? 'text-forest-800/70 bg-white' : 'text-forest-950 font-semibold bg-gold-50/60'
                }`}
              >
                <p className="line-clamp-2 leading-relaxed">{n.message}</p>
                <p className="mt-1 text-[10px] text-forest-800/50">
                  {new Date(n.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
