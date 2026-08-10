'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';
import { listCategoriesWithServices } from '@/services/categories.repo';

export default function ServicesPage() {
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
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">What We Offer</span>
        <h1 className="section-heading mt-3">Our Mehndi Services</h1>
        <p className="mt-4 text-forest-800/70">
          From bold Arabic vines to elaborate bridal masterpieces, choose the style that suits your occasion.
        </p>
      </div>

      {loaded && categories.length === 0 ? (
        <p className="text-center mt-16 text-forest-700/60">
          Services are being updated. Please check back shortly or contact us on WhatsApp.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {categories.map((cat) => {
            const prices = cat.services.flatMap((s) => s.pricingTiers.map((t) => t.price));
            return (
              <Card key={cat.id} className="p-8">
                <h2 className="font-serif text-2xl text-forest-900">{cat.name}</h2>
                <p className="mt-2 text-sm text-forest-800/70">{cat.description}</p>
                {prices.length > 0 && (
                  <p className="mt-4 text-gold-600 font-medium">
                    {formatINR(Math.min(...prices))} – {formatINR(Math.max(...prices))}
                  </p>
                )}
                <div className="mt-6 flex gap-3">
                  <Link href={`/pricing#${cat.slug}`}><Button size="sm" variant="outline">View Pricing</Button></Link>
                  <Link href={`/booking?category=${cat.slug}`}><Button size="sm">Book This</Button></Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
