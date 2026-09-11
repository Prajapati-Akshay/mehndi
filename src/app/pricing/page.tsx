'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldAlert, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import { formatINR } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';
import { listCategoriesWithServices } from '@/services/categories.repo';

export default function PricingPage() {
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
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>Transparent Packages</span>
        </div>
        <h1 className="section-heading">Pricing &amp; Packages</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          Honest, transparent pricing for all mehndi styles. Custom group rates and bridal packages available upon request.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.slug} className="scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gold-200">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">{cat.name}</h2>
                <p className="text-xs sm:text-sm text-forest-800/70 mt-1">{cat.description}</p>
              </div>
              <Link href={`/booking?category=${cat.slug}`}>
                <Button size="sm" variant="luxury" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book This Style</span>
                </Button>
              </Link>
            </div>

            {cat.services.map((svc) => (
              <div key={svc.id} className="rounded-3xl border border-gold-200/90 bg-white shadow-card overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-forest-950 text-ivory text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Length &amp; Coverage</th>
                        <th className="px-6 py-4 font-semibold">Price (Per Person)</th>
                        <th className="px-6 py-4 font-semibold">Artistry Details &amp; Inclusions</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-100">
                      {svc.pricingTiers.map((tier) => (
                        <tr key={tier.id} className="hover:bg-cream/40 transition-colors">
                          <td className="px-6 py-5 font-semibold text-forest-950">
                            {tier.lengthLabel}
                          </td>
                          <td className="px-6 py-5 font-serif font-bold text-gold-600 text-lg">
                            {formatINR(tier.price)}
                          </td>
                          <td className="px-6 py-5 text-forest-800/80 leading-relaxed max-w-md">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-gold-600 shrink-0" />
                              <span>{tier.whatsIncluded}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Link href={`/booking?pricing=${tier.id}`}>
                              <Button size="sm" variant="outline-gold" className="gap-1">
                                <span>Select</span>
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Booking Terms Box */}
      <div className="mt-16 rounded-3xl bg-gradient-to-tr from-cream via-white to-gold-50/60 p-8 sm:p-10 border border-gold-300 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Important Booking Guidelines</h3>
            <p className="text-xs text-forest-700/80">Please review before confirming your appointment</p>
          </div>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4 mt-6 text-sm text-forest-800/80">
          <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-gold-200">
            <Check className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
            <span><strong>50% Advance:</strong> Bookings are finalized once the 50% reservation advance is received.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-gold-200">
            <Check className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
            <span><strong>Skin Prep:</strong> Waxing/manicure should be done 2 days prior for optimum stain absorption.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-gold-200">
            <Check className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
            <span><strong>Travel Charges:</strong> Outstation &amp; home visits include nominal travel fare as applicable.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-gold-200">
            <Check className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
            <span><strong>Post-Care Guidance:</strong> Free organic lemon-sugar balm tips provided with every booking.</span>
          </li>
        </ul>

        <div className="mt-8 flex items-center gap-4">
          <Link href="/terms">
            <Button size="sm" variant="outline-gold">
              Read Complete Terms &amp; Policies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

