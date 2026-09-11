import { Instagram, MessageCircle, Phone, MapPin, Sparkles, HelpCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INSTAGRAM_URL, WHATSAPP_NUMBER, whatsappLink } from '@/lib/whatsapp';
import { ContactForm } from './contact-form';

const FAQS = [
  {
    q: 'How far in advance should I book for a wedding?',
    a: 'For weddings and bridal mehndi, we recommend booking at least 1 to 3 months in advance to ensure date availability, especially during peak wedding and festival seasons.',
  },
  {
    q: 'Are your henna cones 100% skin-safe and natural?',
    a: 'Yes, absolutely. Dhara uses only pure Rajasthani triple-sifted organic henna, eucalyptus essential oil, lemon, and sugar. We never use black henna, PPD, or synthetic chemical dyes.',
  },
  {
    q: 'Do you travel to the client’s home or wedding venue?',
    a: 'Yes, on-location and destination visits are available. A nominal travel charge applies based on distance.',
  },
  {
    q: 'How is the booking confirmed?',
    a: 'Once you select your package and date, a 50% advance deposit confirms your slot. The remaining 50% is paid on the day of the appointment.',
  },
];

export default function ContactPage() {
  return (
    <div className="container py-16 sm:py-24 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>Connect With Dhara</span>
        </div>
        <h1 className="section-heading">Get in Touch</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          Have a question before booking or looking for custom bridal quotes? Reach out directly via WhatsApp, call, or form.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-3xl border border-gold-200/90 bg-white/95 p-8 sm:p-10 shadow-card backdrop-blur-md">
          <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">Send an Inquiry</h2>
          <p className="text-sm text-forest-800/70 mb-6">Fill out the details below and Dhara will reply promptly.</p>
          <ContactForm />
        </div>

        {/* Quick Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <a
            href={whatsappLink('Hi Dhara! I have a question regarding mehndi booking.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-[#25D366]/40 bg-white/90 p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#25D366]">Fastest Response</span>
              <p className="font-serif text-lg font-bold text-forest-950">Chat on WhatsApp</p>
              <p className="text-xs text-forest-800/70 mt-0.5">Instant booking inquiries &amp; photo shares</p>
            </div>
          </a>

          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="flex items-center gap-4 rounded-3xl border border-gold-200/90 bg-white/90 p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">Direct Phone</span>
              <p className="font-serif text-lg font-bold text-forest-950">+91 6358290268</p>
              <p className="text-xs text-forest-800/70 mt-0.5">Call between 9:00 AM – 8:00 PM</p>
            </div>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-rose-200/90 bg-white/90 p-6 shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Instagram className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Instagram Profile</span>
              <p className="font-serif text-lg font-bold text-forest-950">@mehndibydhara</p>
              <p className="text-xs text-forest-800/70 mt-0.5">Explore stories, reels &amp; live designs</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-3xl border border-gold-200/90 bg-white/90 p-6 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-800">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800">Service Coverage</span>
              <p className="font-serif text-lg font-bold text-forest-950">Studio &amp; Home Visits</p>
              <p className="text-xs text-forest-800/70 mt-0.5">Available locally &amp; destination weddings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">Got Questions?</span>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <div className="gold-divider mt-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-3xl bg-white/90 border border-gold-200/90 shadow-card space-y-2">
              <div className="flex items-center gap-2 text-gold-700 font-semibold text-sm">
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs sm:text-sm text-forest-800/80 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

