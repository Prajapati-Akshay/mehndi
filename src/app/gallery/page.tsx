'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ChevronLeft, ChevronRight, X, ZoomIn, MessageCircle, Calendar,
  Sparkles, Filter
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import type { GalleryItem } from '@/lib/types';
import { listGallery } from '@/services/gallery.repo';
import { whatsappLink } from '@/lib/whatsapp';

const PAGE_SIZE = 24;

const CATEGORY_TABS = [
  { key: 'all', label: 'All Designs' },
  { key: 'bridal-mehndi', label: 'Bridal' },
  { key: 'arabic-mehndi', label: 'Arabic' },
  { key: 'designer-fancy-mehndi', label: 'Designer & Fancy' },
  { key: 'indian-traditional', label: 'Traditional' },
  { key: 'engagement-mehndi', label: 'Engagement' },
  { key: 'feet-mehndi', label: 'Feet Mehndi' },
];

const CATEGORY_LABELS: Record<string, string> = {
  'arabic-mehndi': 'Arabic',
  'designer-fancy-mehndi': 'Designer / Fancy',
  'indian-traditional': 'Indian Traditional',
  'engagement-mehndi': 'Engagement',
  'bridal-mehndi': 'Bridal',
  'feet-mehndi': 'Feet Mehndi',
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    listGallery().then((g) => {
      setItems(g);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <PageLoader />;

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleCategoryChange(catKey: string) {
    setActiveCategory(catKey);
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  }

  const currentLightboxItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  function nextLightbox() {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  }

  function prevLightbox() {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  }

  return (
    <div className="container py-16 sm:py-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          <span>Artisan Portfolio</span>
        </div>
        <h1 className="section-heading">Our Mehndi Gallery</h1>
        <div className="gold-divider mt-2" />
        <p className="text-forest-800/80 text-sm sm:text-base">
          A showcase of handcrafted bridal, Arabic, traditional, and contemporary mehndi patterns by Dhara.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          const count = tab.key === 'all'
            ? items.length
            : items.filter((it) => it.category === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => handleCategoryChange(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-forest-900 text-ivory shadow-forest-glow border border-gold-400/40'
                  : 'bg-white/80 text-forest-900 border border-gold-200/80 hover:border-gold-400 hover:bg-gold-50/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                isActive ? 'bg-gold-500 text-forest-950 font-bold' : 'bg-gold-100 text-forest-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-3xl border border-gold-200 mt-12 max-w-lg mx-auto p-8">
          <Filter className="h-10 w-10 text-gold-400 mx-auto mb-3 opacity-60" />
          <p className="font-serif text-lg text-forest-900">No designs found in this category</p>
          <p className="text-sm text-forest-700/70 mt-1">Please select another category or check back soon.</p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="mt-4 text-xs font-semibold text-gold-600 hover:underline"
          >
            Show All Designs
          </button>
        </div>
      ) : (
        <>
          <div className="mt-12 columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {pageItems.map((item, idx) => {
              const globalIdx = (currentPage - 1) * PAGE_SIZE + idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxIndex(globalIdx)}
                  className="mb-4 break-inside-avoid group relative overflow-hidden rounded-3xl border border-gold-200/90 bg-white shadow-card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-luxury"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title ?? 'Mehndi design by Dhara'}
                    width={600}
                    height={800}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/30 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between mb-1">
                      {item.category && (
                        <span className="inline-block rounded-full bg-gold-400 text-forest-950 text-[10px] font-bold px-2.5 py-0.5">
                          {CATEGORY_LABELS[item.category] ?? item.category}
                        </span>
                      )}
                      <div className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-serif font-medium">{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline-gold"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-9 w-9 rounded-full text-xs font-semibold transition-all ${
                    p === currentPage
                      ? 'bg-forest-900 text-ivory shadow-forest-glow border border-gold-400'
                      : 'bg-white text-forest-800 border border-gold-200 hover:border-gold-400'
                  }`}
                >
                  {p}
                </button>
              ))}

              <Button
                size="sm"
                variant="outline-gold"
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

      {/* LIGHTBOX MODAL */}
      {currentLightboxItem && activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/90 backdrop-blur-xl p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-forest-900 border border-gold-500/30 shadow-luxury overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-forest-950/80 border border-gold-400/40 text-ivory flex items-center justify-center hover:bg-forest-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lightbox Image View */}
            <div className="relative md:w-3/5 bg-forest-950 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
              <Image
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title ?? 'Mehndi design'}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain p-2"
              />

              {/* Prev / Next Controls */}
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-forest-900/80 border border-gold-400/40 text-white flex items-center justify-center hover:bg-forest-800 transition-all shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-forest-900/80 border border-gold-400/40 text-white flex items-center justify-center hover:bg-forest-800 transition-all shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Lightbox Sidebar Info */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-forest-900 text-ivory overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {currentLightboxItem.category && (
                    <span className="rounded-full bg-gold-400/20 text-gold-300 text-xs px-3 py-1 font-semibold border border-gold-400/30">
                      {CATEGORY_LABELS[currentLightboxItem.category] ?? currentLightboxItem.category}
                    </span>
                  )}
                  <span className="text-xs text-ivory/50">
                    {activeLightboxIndex + 1} of {filteredItems.length}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white font-medium">
                  {currentLightboxItem.title || 'Mehndi Design'}
                </h3>
                
                <p className="mt-4 text-sm text-ivory/70 leading-relaxed">
                  Crafted by Dhara using 100% skin-safe organic henna. Ideal for weddings, engagements, festivals, and festive celebrations.
                </p>

                <div className="mt-6 rounded-2xl bg-forest-950/60 border border-gold-500/20 p-4 space-y-2 text-xs text-ivory/75">
                  <p>✨ <strong>Style:</strong> {CATEGORY_LABELS[currentLightboxItem.category || ''] || 'Custom Artistry'}</p>
                  <p>🌿 <strong>Stain:</strong> Deep rich burgundy / mahogany</p>
                  <p>📍 <strong>Availability:</strong> Studio &amp; home visits</p>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-ivory/10">
                <Link
                  href={`/booking?category=${currentLightboxItem.category || ''}`}
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-full block"
                >
                  <Button variant="luxury" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Book This Style</span>
                  </Button>
                </Link>

                <a
                  href={whatsappLink(`Hi Dhara! I love this design: "${currentLightboxItem.title}". Can I get a quote for my event?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button variant="whatsapp" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Inquire on WhatsApp</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

