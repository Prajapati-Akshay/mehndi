'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Tag,
  CalendarClock,
  Users,
  LogOut,
  Settings,
  Shield,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { clearSession, getSession, type AdminUser } from '@/lib/auth';
import { LogoMark } from '@/components/logo';
import { NotificationBell } from '@/components/admin/notification-bell';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Studio Metrics' },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, desc: 'Client Reservations & Deposits' },
  { href: '/admin/services', label: 'Services', icon: Sparkles, desc: 'Designs & Packages Catalog' },
  { href: '/admin/pricing', label: 'Pricing', icon: Tag, desc: 'Coverage Rates & Inclusions' },
  { href: '/admin/availability', label: 'Availability', icon: CalendarClock, desc: 'Schedule & Time Slots' },
  { href: '/admin/customers', label: 'Customers', icon: Users, desc: 'Client Directory & History' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, desc: 'Backups & Maintenance' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      setUser(session);
      setChecked(true);
    });
  }, [router]);

  if (!checked) return null;

  const currentNav = NAV.find((n) => n.href === pathname);
  const CurrentIcon = currentNav?.icon || LayoutDashboard;

  async function handleLogout() {
    await clearSession();
    router.replace('/admin/login');
  }

  return (
    <div className="min-h-screen bg-sand/30 flex text-forest-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-forest-950 text-ivory border-r border-gold-500/20 shadow-2xl shrink-0">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-ivory/10 flex items-center gap-3.5 bg-gradient-to-b from-forest-900/60 to-transparent">
          <LogoMark size={38} />
          <div>
            <p className="font-serif text-lg font-bold tracking-wide text-white leading-tight">Mehndi By Dhara</p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold-300 uppercase tracking-wider mt-0.5">
              <Shield className="h-3 w-3 text-gold-400" /> Admin Studio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500/20 text-gold-300 font-semibold border border-gold-400/40 shadow-sm'
                    : 'text-ivory/70 hover:bg-forest-900/80 hover:text-white'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-gold-400' : 'text-ivory/60'}`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 m-4 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-forest-950 font-serif font-bold text-sm flex items-center justify-center shadow-sm">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[11px] text-ivory/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl bg-forest-950/80 border border-ivory/10 px-3 py-2 text-xs font-medium text-ivory/80 hover:text-rose-300 hover:border-rose-400/30 transition-all w-full cursor-pointer hover:bg-forest-950"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-white/95 backdrop-blur-xl border-b border-gold-200/80 px-4 sm:px-8 shadow-sm">
          {/* Left: Breadcrumbs & Current Page Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gold-200/90 bg-white text-forest-900 shadow-sm hover:bg-gold-50"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-gold-400 shadow-sm border border-gold-500/20">
                <CurrentIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-forest-800/60">
                  <span>Studio Portal</span>
                  <ChevronRight className="h-3 w-3 text-gold-600" />
                  <span className="text-gold-700">{currentNav?.label || 'Dashboard'}</span>
                </div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-forest-950 leading-tight">
                  {currentNav?.label || 'Admin Panel'}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Website Shortcut */}
            <Link
              href="/"
              target="_blank"
              title="Open public website in new tab"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gold-200/90 bg-gold-50/60 hover:bg-gold-100/90 px-3.5 py-2 text-xs font-semibold text-forest-900 shadow-sm transition-all hover:scale-[1.02]"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gold-700" />
              <span className="hidden sm:inline">Live Website</span>
            </Link>

            {/* Notification Bell */}
            {user && <NotificationBell adminId={user.id} />}

            {/* Header User Profile & Quick Logout on Desktop/Mobile */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gold-200/80">
              <div
                title={user?.email}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-forest-900 to-forest-950 text-gold-300 font-serif font-bold text-xs flex items-center justify-center border border-gold-400/30 shadow-sm"
              >
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-200/90 bg-white text-forest-800 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-sm transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-forest-950 text-ivory px-4 py-5 border-b border-gold-500/30 shadow-2xl space-y-1.5 animate-fade-in">
            <div className="px-3 pb-3 mb-2 border-b border-ivory/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LogoMark size={28} />
                <span className="font-serif font-bold text-white text-sm">Mehndi By Dhara</span>
              </div>
              <span className="text-[10px] text-gold-300 font-semibold uppercase bg-gold-400/20 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>

            {NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-400 text-forest-950 font-bold shadow-md'
                      : 'text-ivory/80 hover:bg-forest-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-3 border-t border-ivory/10 flex items-center justify-between px-2">
              <span className="text-xs text-ivory/50 truncate max-w-[200px]">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg bg-rose-950/40 border border-rose-500/20"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Sub-nav horizontal pills on mobile for 1-tap switching */}
        <div className="lg:hidden flex gap-2 overflow-x-auto bg-forest-950 px-4 py-2.5 text-xs border-b border-gold-500/20 shadow-inner">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                pathname === item.href
                  ? 'bg-gold-400 text-forest-950 shadow-sm'
                  : 'text-ivory/70 hover:text-white bg-forest-900/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
