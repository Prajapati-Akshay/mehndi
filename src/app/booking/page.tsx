'use client';

import { Suspense, useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loader';
import type { ServiceCategory } from '@/lib/types';
import { listCategoriesWithServices } from '@/services/categories.repo';
import { BookingWizard } from './booking-wizard';

export default function BookingPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listCategoriesWithServices().then((cats) => {
      setCategories(cats);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <PageLoader />;

  return (
    <div className="container py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <span>Appointment Reservation</span>
        </div>
        <h1 className="section-heading">Reserve Your Mehndi Experience</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          Select your desired package and preferred time slot. We guarantee focused personal attention for every client.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-center mt-16 text-forest-700/60">
          Booking is temporarily unavailable. Please contact us on WhatsApp to book directly.
        </p>
      ) : (
        <Suspense fallback={null}>
          <BookingWizard categories={categories} />
        </Suspense>
      )}
    </div>
  );
}
