'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';
import { listCategoriesWithServices } from '@/services/categories.repo';

export default function PricingPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    listCategoriesWithServices().then(setCategories);
  }, []);

  return (
    <div className="container py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Price List</span>
        <h1 className="section-heading mt-3">Transparent, Simple Pricing</h1>
        <p className="mt-4 text-forest-800/70">
          All pricing shown is per hand/feet length as applicable. Travel charges are additional.
        </p>
      </div>

      <div className="mt-16 space-y-14">
        {categories.map((cat) => (
          <div key={cat.id} id={cat.slug} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-forest-900">{cat.name}</h2>
              <div className="flex-1 h-px bg-gold-200" />
            </div>
            {cat.services.map((svc) => (
              <Card key={svc.id} className="overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-900 text-ivory text-left">
                        <th className="px-5 py-3 font-medium">Length</th>
                        <th className="px-5 py-3 font-medium">Price</th>
                        <th className="px-5 py-3 font-medium">What&rsquo;s Included</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-100">
                      {svc.pricingTiers.map((tier) => (
                        <tr key={tier.id} className="hover:bg-cream/60 transition-colors">
                          <td className="px-5 py-4 font-medium text-forest-900">{tier.lengthLabel}</td>
                          <td className="px-5 py-4 text-gold-600 font-semibold">{formatINR(tier.price)}</td>
                          <td className="px-5 py-4 text-forest-800/70">{tier.whatsIncluded}</td>
                          <td className="px-5 py-4 text-right">
                            <Link href={`/booking?pricing=${tier.id}`}>
                              <Button size="sm" variant="outline">Book</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>

      <Card className="mt-16 p-8 bg-cream border-gold-300">
        <h3 className="font-serif text-xl text-forest-900">Booking Terms &amp; Conditions</h3>
        <ul className="mt-4 space-y-2 text-sm text-forest-800/80 list-disc list-inside">
          <li>Travel charges are additional, or the client may arrange transportation for the artist.</li>
          <li>Your booking is confirmed only after a 50% advance payment is received.</li>
          <li>Please complete waxing and skincare at least 2 days before your appointment for the best stain.</li>
          <li>Last-minute changes to design, length or requirements after confirmation may incur extra charges.</li>
        </ul>
        <Link href="/terms" className="inline-block mt-4">
          <Button size="sm" variant="outline">Read Full Terms</Button>
        </Link>
      </Card>
    </div>
  );
}
