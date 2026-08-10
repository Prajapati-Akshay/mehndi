'use client';

import { Suspense, useEffect, useState } from 'react';
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

  return (
    <div className="container py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Book Now</span>
        <h1 className="section-heading mt-3">Reserve Your Mehndi Appointment</h1>
        <p className="mt-4 text-forest-800/70">Follow the steps below — it only takes a minute.</p>
      </div>

      {loaded && categories.length === 0 ? (
        <p className="text-center mt-16 text-forest-700/60">
          Booking is temporarily unavailable. Please contact us on WhatsApp to book directly.
        </p>
      ) : loaded ? (
        <Suspense fallback={null}>
          <BookingWizard categories={categories} />
        </Suspense>
      ) : null}
    </div>
  );
}
