'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Menu, X } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-50 border-b border-gold-200/60 bg-ivory/90 backdrop-blur">
      <div className="container flex h-16 sm:h-20 items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl">
          <Logo markSize={38} />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forest-800/80 hover:text-forest-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-forest-800 hover:text-rose-500 transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Link href="/booking">
            <Button size="sm">Book Appointment</Button>
          </Link>
        </div>

        <button className="lg:hidden text-forest-900" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold-200/60 bg-ivory px-4 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-forest-800 border-b border-gold-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-forest-800">
              <Instagram className="h-5 w-5" />
            </a>
            <Link href="/booking" className="flex-1">
              <Button className="w-full">Book Appointment</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
