import Link from 'next/link';
import { Instagram, MessageCircle, Phone, Sparkles, Heart, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { LogoMark } from '@/components/logo';
import { INSTAGRAM_URL, WHATSAPP_NUMBER, whatsappLink } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-ivory/80 border-t border-gold-500/20">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-gold-600/10 blur-[100px]" />

      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <LogoMark size={40} />
              <div>
                <h3 className="font-serif text-2xl tracking-wide text-ivory">Mehndi By Dhara</h3>
                <p className="text-xs text-gold-400/90 tracking-wider uppercase font-medium">Luxury Bridal Henna Studio</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ivory/70 max-w-sm">
              Crafting bespoke bridal, Arabic, traditional, and contemporary mehndi designs. Adorning life&rsquo;s most precious moments with purity, love, and intricate elegance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 border border-gold-500/30 px-3 py-1 text-xs text-gold-300">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Skin-Safe Organic Henna
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 border border-gold-500/30 px-3 py-1 text-xs text-gold-300">
                <Heart className="h-3.5 w-3.5" /> 500+ Happy Brides
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-300">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services" className="text-ivory/70 hover:text-gold-300 transition-colors">Signature Services</Link></li>
              <li><Link href="/pricing" className="text-ivory/70 hover:text-gold-300 transition-colors">Price Packages</Link></li>
              <li><Link href="/gallery" className="text-ivory/70 hover:text-gold-300 transition-colors">Design Portfolio</Link></li>
              <li><Link href="/booking" className="text-ivory/70 hover:text-gold-300 transition-colors">Book Appointment</Link></li>
              <li><Link href="/terms" className="text-ivory/70 hover:text-gold-300 transition-colors">Terms &amp; Policies</Link></li>
            </ul>
          </div>

          {/* Studio Info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-300">Studio &amp; Hours</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Mon – Sun: 9:00 AM – 8:00 PM<br /><span className="text-xs text-ivory/50">By Prior Appointment Only</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Home visits available across city &amp; destination weddings (Travel charges apply)</span>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-300">Get in Touch</h4>
            <div className="space-y-2.5 text-sm">
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 rounded-xl border border-ivory/10 bg-forest-900/60 p-2.5 hover:border-gold-400/40 hover:bg-forest-900 transition-all text-ivory/90"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-ivory/50">Direct Call</p>
                  <p className="font-medium">+91 6358290268</p>
                </div>
              </a>

              <a
                href={whatsappLink('Hi Mehndi By Dhara! I would like to inquire about booking.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-ivory/10 bg-forest-900/60 p-2.5 hover:border-[#25D366]/50 hover:bg-forest-900 transition-all text-ivory/90"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-ivory/50">Instant WhatsApp</p>
                  <p className="font-medium text-[#25D366]">Chat with Dhara</p>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-ivory/10 bg-forest-900/60 p-2.5 hover:border-rose-400/40 hover:bg-forest-900 transition-all text-ivory/90"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-ivory/50">Instagram</p>
                  <p className="font-medium">@mehndibydhara</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
          <p>&copy; {new Date().getFullYear()} Mehndi By Dhara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gold-300 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gold-300 transition-colors">Inquiries</Link>
            <span>•</span>
            <Link href="/gallery" className="hover:text-gold-300 transition-colors">Portfolio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

