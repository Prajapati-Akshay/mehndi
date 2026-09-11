'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Instagram, Menu, X, Sparkles, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { INSTAGRAM_URL } from '@/lib/whatsapp';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold-300/40 bg-ivory/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(15,42,23,0.03)] transition-all">
      <div className="container flex h-20 sm:h-24 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-[1.02]">
          <Logo markSize={42} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-gold-300/50 bg-white/60 px-4 py-1.5 backdrop-blur-md shadow-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-forest-950 font-semibold bg-gold-100/80 shadow-sm'
                    : 'text-forest-800/80 hover:text-forest-950 hover:bg-gold-50/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/admin/login"
            title="Admin Studio Portal"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/60 bg-white/60 text-forest-800 hover:text-gold-700 hover:border-gold-400 hover:bg-gold-50/70 transition-all duration-300 shadow-sm"
            aria-label="Admin Portal"
          >
            <Shield className="h-4 w-4" />
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/60 bg-white/60 text-forest-800 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300 shadow-sm"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Link href="/booking">
            <Button size="sm" variant="luxury" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-300/60 bg-white/70 text-forest-900 shadow-sm transition-all active:scale-95"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold-300/40 bg-ivory/95 backdrop-blur-2xl px-5 pb-8 pt-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-100 text-forest-950 font-semibold'
                      : 'text-forest-800 hover:bg-gold-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles className="h-4 w-4 text-gold-600" />}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-gold-200/60">
            <Link href="/booking" onClick={() => setOpen(false)}>
              <Button variant="luxury" className="w-full justify-center py-3.5 shadow-md">
                <Calendar className="h-4 w-4" /> Book Appointment
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-300 bg-white/80 py-2.5 text-xs font-medium text-forest-800 hover:text-rose-600 transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </a>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-300 bg-white/80 py-2.5 text-xs font-medium text-forest-800 hover:text-gold-700 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-gold-600" /> Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
