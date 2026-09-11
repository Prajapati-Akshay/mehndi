import Link from 'next/link';
import { ShieldCheck, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TERMS = [
  {
    title: '1. Travel & Outstation Appointments',
    body: 'Travel charges are additional based on distance for home and outstation visits. Alternatively, the client may arrange dedicated transportation for the artist.',
  },
  {
    title: '2. Advance Payment & Slot Reservation',
    body: 'Your appointment is officially confirmed only after a 50% advance deposit is received. The remaining 50% balance is payable on the appointment day.',
  },
  {
    title: '3. Pre-Appointment Skincare & Prep',
    body: 'For the deepest and richest stain absorption, please ensure waxing, manicures, pedicures, and body polishing are completed at least 2 days prior to your mehndi session.',
  },
  {
    title: '4. Scope Changes After Confirmation',
    body: 'Any last-minute additions to design coverage, arm/feet length, or number of guests after confirmation are subject to availability and will be billed accordingly.',
  },
  {
    title: '5. Cancellation & Rescheduling',
    body: 'In case of unforeseen circumstances, please notify us at least 7 days in advance. Rescheduled dates are accommodated subject to artist availability.',
  },
];

export default function TermsPage() {
  return (
    <div className="container py-16 sm:py-24 max-w-3xl space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
          <span>Client Policies</span>
        </div>
        <h1 className="section-heading">Booking Terms &amp; Policies</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          Clear, professional terms ensuring a seamless and reliable experience for your celebration.
        </p>
      </div>

      <div className="space-y-4">
        {TERMS.map((term) => (
          <div key={term.title} className="rounded-3xl border border-gold-200/90 bg-white/90 p-6 sm:p-8 shadow-card">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-forest-950">{term.title}</h2>
            <p className="mt-2.5 text-sm text-forest-800/80 leading-relaxed">{term.body}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link href="/booking">
          <Button size="lg" variant="luxury" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Proceed to Booking</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

