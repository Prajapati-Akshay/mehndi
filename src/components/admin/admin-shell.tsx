'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarCheck, Sparkles, Tag, CalendarClock, Users, LogOut, Settings,
} from 'lucide-react';
import { clearSession, getSession, type AdminUser } from '@/lib/auth';
import { LogoMark } from '@/components/logo';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/pricing', label: 'Pricing', icon: Tag },
  { href: '/admin/availability', label: 'Availability', icon: CalendarClock },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/admin/login');
      return;
    }
    setUser(session);
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="hidden lg:flex w-64 flex-col bg-forest-900 text-ivory">
        <div className="px-6 py-6 border-b border-ivory/10 flex items-center gap-3">
          <LogoMark size={32} />
          <div>
            <p className="font-serif text-lg leading-tight">Mehndi By Dhara</p>
            <p className="text-xs text-gold-300 mt-0.5">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                pathname === item.href ? 'bg-forest-800 text-gold-300' : 'text-ivory/70 hover:bg-forest-800/60'
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-ivory/10">
          <p className="text-xs text-ivory/60 px-2">{user?.email}</p>
          <button
            onClick={() => {
              clearSession();
              router.replace('/admin/login');
            }}
            className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-ivory/70 hover:bg-forest-800/60 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between bg-forest-900 text-ivory px-4 py-4">
          <p className="font-serif text-lg">Admin</p>
          <button
            onClick={() => {
              clearSession();
              router.replace('/admin/login');
            }}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>
        <nav className="lg:hidden flex gap-2 overflow-x-auto bg-forest-800 px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                pathname === item.href ? 'bg-gold-400 text-forest-900' : 'text-ivory/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
