'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Check, ShieldCheck, Heart, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import { formatINR } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';
import { listCategoriesWithServices } from '@/services/categories.repo';
import { whatsappLink } from '@/lib/whatsapp';

export default function ServicesPage() {
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
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>Our Offerings</span>
        </div>
        <h1 className="section-heading">Signature Mehndi Services</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          From intricate bridal sagas to delicate Arabic bel designs, select the ideal henna style for your celebration.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-center mt-16 text-forest-700/60">
          Services are being updated. Please check back shortly or contact us on WhatsApp.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const prices = cat.services.flatMap((s) => s.pricingTiers.map((t) => t.price));
            const tiers = cat.services.flatMap((s) => s.pricingTiers);

            return (
              <div
                key={cat.id}
                className="group relative rounded-3xl border border-gold-200/90 bg-white/90 p-8 shadow-card backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-luxury"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-gold-50 border border-gold-200/80 px-3 py-1 text-xs font-semibold text-gold-800">
                      Collection
                    </span>
                    {prices.length > 0 && (
                      <span className="font-serif font-bold text-forest-900 text-sm">
                        {formatINR(Math.min(...prices))} – {formatINR(Math.max(...prices))}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-forest-950 group-hover:text-gold-700 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-3 text-sm text-forest-800/80 leading-relaxed">
                    {cat.description}
                  </p>

                  {tiers.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gold-100 space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">Available Packages:</p>
                      {tiers.slice(0, 3).map((tier) => (
                        <div key={tier.id} className="flex items-center justify-between text-xs text-forest-800/80">
                          <span className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-gold-600" />
                            {tier.lengthLabel}
                          </span>
                          <span className="font-semibold text-forest-900">{formatINR(tier.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-gold-100 flex items-center gap-3">
                  <Link href={`/pricing#${cat.slug}`} className="flex-1">
                    <Button size="sm" variant="outline-gold" className="w-full">
                      Price Details
                    </Button>
                  </Link>
                  <Link href={`/booking?category=${cat.slug}`} className="flex-1">
                    <Button size="sm" variant="luxury" className="w-full gap-1">
                      <span>Book</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bridal Consultation Highlight */}
      <div className="mt-16 rounded-[32px] bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 p-8 sm:p-12 text-ivory border border-gold-500/30 shadow-luxury">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-gold-300 text-xs font-semibold uppercase tracking-widest">Bridal Specialization</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
              Planning a Grand Wedding or Destination Mehndi?
            </h3>
            <p className="text-sm text-ivory/80 leading-relaxed max-w-xl">
              Dhara provides tailored bridal packages including trial motif consultations, groom’s subtle henna, and full bridal party coordination.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
            <Link href="/booking">
              <Button size="md" variant="luxury" className="w-full gap-2">
                <Calendar className="h-4 w-4" /> Book Bridal Henna
              </Button>
            </Link>
            <a
              href={whatsappLink('Hi Dhara! I want to consult for my upcoming wedding mehndi package.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="md" variant="whatsapp" className="w-full">
                WhatsApp Bridal Inquiry
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

