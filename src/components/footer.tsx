import Link from 'next/link';
import { Instagram, MessageCircle, Phone } from 'lucide-react';
import { LogoMark } from '@/components/logo';
import { INSTAGRAM_URL, WHATSAPP_NUMBER, whatsappLink } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="bg-forest-900 text-ivory/80">
      <div className="container py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={34} />
            <h3 className="font-serif text-2xl text-ivory">Mehndi By Dhara</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ivory/70">
            Beautiful Mehndi for your beautiful moments. Bridal, Arabic, Engagement, Designer and Traditional
            Mehndi crafted with love.
          </p>
          <p className="mt-4 text-xs text-ivory/40">
            Standalone demo build — all data stored locally in your browser, no backend.
          </p>
        </div>

        <div>
          <h4 className="text-gold-300 font-medium mb-4 text-sm tracking-widest uppercase">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-gold-300">Services</Link></li>
            <li><Link href="/pricing" className="hover:text-gold-300">Pricing</Link></li>
            <li><Link href="/gallery" className="hover:text-gold-300">Gallery</Link></li>
            <li><Link href="/booking" className="hover:text-gold-300">Book Appointment</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-300 font-medium mb-4 text-sm tracking-widest uppercase">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gold-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Contact</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold-300">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-300 font-medium mb-4 text-sm tracking-widest uppercase">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-2 hover:text-gold-300">
                <Phone className="h-4 w-4" /> +91 6358290268
              </a>
            </li>
            <li>
              <a
                href={whatsappLink('Hi Mehndi By Dhara! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-300"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-300"
              >
                <Instagram className="h-4 w-4" /> @mehndibydhara
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50">
        &copy; {new Date().getFullYear()} Mehndi By Dhara. All rights reserved.
      </div>
    </footer>
  );
}
