'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import type { GalleryItem } from '@/lib/types';
import { listGallery } from '@/services/gallery.repo';

const PAGE_SIZE = 24;

const CATEGORY_LABELS: Record<string, string> = {
  'arabic-mehndi': 'Arabic',
  'designer-fancy-mehndi': 'Designer / Fancy',
  'indian-traditional': 'Indian Traditional',
  'engagement-mehndi': 'Engagement',
  'bridal-mehndi': 'Bridal',
  'feet-mehndi': 'Feet',
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    listGallery().then((g) => {
      setItems(g);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <PageLoader />;

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="container py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Portfolio</span>
        <h1 className="section-heading mt-3">Our Mehndi Gallery</h1>
        <p className="mt-4 text-forest-800/70">A glimpse of designs crafted for weddings, engagements and celebrations.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-center mt-16 text-forest-700/60">Gallery coming soon. Follow us on Instagram @mehndibydhara.</p>
      ) : (
        <>
          <div className="mt-16 columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {pageItems.map((item) => (
              <div key={item.id} className="mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl border border-gold-200 shadow-card">
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? 'Mehndi design by Mehndi By Dhara'}
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/80 via-forest-900/20 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.category && (
                    <span className="inline-block rounded-full bg-gold-400 text-forest-900 text-[10px] font-semibold px-2 py-0.5 mb-1">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                  )}
                  <p className="text-ivory text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === currentPage ? 'secondary' : 'outline'}
                  onClick={() => goToPage(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </Button>
              ))}

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
