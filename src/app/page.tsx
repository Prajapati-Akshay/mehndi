'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Sparkles, Heart, Clock, ShieldCheck, CalendarCheck, MessageCircleHeart,
  Palette, Users, ArrowRight, Star, Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/loader';
import { LogoMark } from '@/components/logo';
import { MehndiMotif } from '@/components/mehndi-motif';
import { listCategoriesWithServices } from '@/services/categories.repo';
import { listTestimonials } from '@/services/testimonials.repo';
import { listGallery } from '@/services/gallery.repo';
import type { ServiceCategory, Testimonial, GalleryItem } from '@/lib/types';
import { INSTAGRAM_URL, whatsappLink } from '@/lib/whatsapp';

const WHY_CHOOSE_US = [
  { icon: Sparkles, title: 'Premium Designs', desc: 'Intricate Arabic, Bridal and Traditional artistry tailored to you.' },
  { icon: Clock, title: 'On-Time & Reliable', desc: 'Punctual appointments so your event runs exactly on schedule.' },
  { icon: ShieldCheck, title: 'Skin-Safe Henna', desc: 'Natural, high-quality cones for a deep, long-lasting stain.' },
  { icon: Heart, title: 'Personal Touch', desc: 'Every design customised to your event, outfit and story.' },
];

const BOOKING_STEPS = [
  { icon: Palette, title: 'Choose a Service', desc: 'Pick your Mehndi style and package length.' },
  { icon: CalendarCheck, title: 'Select Date & Time', desc: 'Choose a slot that fits your celebration.' },
  { icon: Users, title: 'Share Your Details', desc: 'Tell us about your event and requirements.' },
  { icon: MessageCircleHeart, title: 'Confirm & Relax', desc: 'We confirm your booking — you enjoy your moment.' },
];

export default function HomePage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([listCategoriesWithServices(), listTestimonials(), listGallery()]).then(
      ([cats, t, g]) => {
        setCategories(cats);
        setTestimonials(t);
        setGallery(g);
        setLoaded(true);
      },
    );
  }, []);

  if (!loaded) return <PageLoader />;

  return (
    <>
      <section className="relative overflow-hidden bg-mehndi-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-ivory to-ivory" />
        <MehndiMotif className="pointer-events-none absolute -left-40 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 opacity-[0.15] lg:block" />
        <MehndiMotif className="pointer-events-none absolute -right-40 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 scale-x-[-1] opacity-[0.15] lg:block" />

        <div className="container relative py-20 sm:py-28 lg:py-32 text-center">
          <LogoMark size={64} className="mx-auto animate-fade-up" />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-gold-600 animate-fade-up [animation-delay:80ms]">
            <Sparkles className="h-3.5 w-3.5" /> Luxury Mehndi Artistry
          </span>
          <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl text-forest-900 animate-fade-up [animation-delay:150ms]">
            Mehndi By <span className="text-gold-500">Dhara</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-lg text-forest-800/80 animate-fade-up [animation-delay:220ms]">
            Beautiful Mehndi for Your Beautiful Moments
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up [animation-delay:300ms]">
            <Link href="/booking">
              <Button size="lg">Book Appointment <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">View Price List</Button>
            </Link>
            <a href={whatsappLink('Hi Mehndi By Dhara! I would like to know more.')} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp">WhatsApp Us</Button>
            </a>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-forest-800/70 hover:text-rose-500 transition-colors"
          >
            <Instagram className="h-4 w-4" /> @mehndibydhara
          </a>
        </div>
      </section>

      <section className="container py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">About Us</span>
            <h2 className="section-heading mt-3">The Art of Timeless Mehndi</h2>
            <p className="mt-6 text-forest-800/80 leading-relaxed">
              Mehndi By Dhara brings together traditional Indian craftsmanship and modern design sensibility.
              From intricate Arabic vines to elaborate bridal masterpieces, every design is applied with care,
              precision, and a deep respect for the artform — making your celebration truly unforgettable.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
              <div><p className="font-serif text-3xl text-forest-900">500+</p><p className="text-xs text-forest-700/70 mt-1">Happy Clients</p></div>
              <div><p className="font-serif text-3xl text-forest-900">6</p><p className="text-xs text-forest-700/70 mt-1">Signature Styles</p></div>
              <div><p className="font-serif text-3xl text-forest-900">5★</p><p className="text-xs text-forest-700/70 mt-1">Rated Service</p></div>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-forest-100 via-cream to-gold-100 border border-gold-200 shadow-soft flex items-center justify-center overflow-hidden relative">
            <MehndiMotif className="absolute h-[140%] w-[140%] opacity-20" />
            <LogoMark size={120} className="relative" />
          </div>
        </div>
      </section>

      <section className="bg-forest-900 py-20 sm:py-24">
        <div className="container text-center">
          <span className="text-gold-300 text-sm tracking-widest uppercase font-medium">Our Services</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ivory">Signature Mehndi Styles</h2>
          <div className="gold-divider mt-4" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const prices = cat.services.flatMap((s) => s.pricingTiers.map((t) => t.price));
              return (
                <Card
                  key={cat.id}
                  className="bg-forest-800/60 border-gold-300/20 text-left p-6 hover:-translate-y-1 transition-transform"
                >
                  <h3 className="font-serif text-xl text-ivory">{cat.name}</h3>
                  <p className="mt-2 text-sm text-ivory/60 leading-relaxed">{cat.description}</p>
                  {prices.length > 0 && (
                    <p className="mt-4 text-gold-300 text-sm font-medium">From ₹{Math.min(...prices)}</p>
                  )}
                </Card>
              );
            })}
          </div>
          <Link href="/services" className="inline-block mt-10">
            <Button variant="secondary">Explore All Services</Button>
          </Link>
        </div>
      </section>

      <section className="container py-20 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Why Choose Us</span>
          <h2 className="section-heading mt-3">Crafted With Care, Trusted By Many</h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-gold-100 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="mt-4 font-serif text-lg text-forest-900">{item.title}</h3>
              <p className="mt-2 text-sm text-forest-800/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="container text-center max-w-2xl mx-auto">
          <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Booking Process</span>
          <h2 className="section-heading mt-3">Booking Made Effortless</h2>
        </div>
        <div className="container mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STEPS.map((step, i) => (
            <Card key={step.title} className="p-6 relative">
              <span className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-forest-800 text-ivory text-sm font-serif flex items-center justify-center">
                {i + 1}
              </span>
              <step.icon className="h-6 w-6 text-gold-500" />
              <h3 className="mt-4 font-serif text-lg text-forest-900">{step.title}</h3>
              <p className="mt-2 text-sm text-forest-800/70">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="container py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Gallery</span>
            <h2 className="section-heading mt-3">A Glimpse of Our Artistry</h2>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.slice(0, 6).map((item) => (
              <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-gold-200 shadow-card">
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? 'Mehndi design by Mehndi By Dhara'}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-900/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-ivory text-xs font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/gallery"><Button variant="outline">View Full Gallery</Button></Link>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-forest-900 py-20 sm:py-24">
          <div className="container text-center max-w-2xl mx-auto">
            <span className="text-gold-300 text-sm tracking-widest uppercase font-medium">Testimonials</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ivory">What Our Clients Say</h2>
          </div>
          <div className="container mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <Card key={t.id} className="bg-forest-800/60 border-gold-300/20 p-6">
                <div className="flex gap-1 text-gold-300">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-ivory/80 leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                <p className="mt-4 text-gold-300 text-sm font-medium">— {t.customerName}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="container py-20 sm:py-28 text-center">
        <h2 className="section-heading">Ready to Book Your Mehndi Appointment?</h2>
        <p className="mt-4 text-forest-800/70 max-w-lg mx-auto">
          Reserve your slot today and let us make your celebration even more beautiful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/booking"><Button size="lg">Book Appointment</Button></Link>
          <a href={whatsappLink('Hi Mehndi By Dhara! I would like to book an appointment.')} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="whatsapp">Book via WhatsApp</Button>
          </a>
        </div>
      </section>
    </>
  );
}
