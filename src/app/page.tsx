'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Sparkles, Heart, Clock, ShieldCheck, CalendarCheck, MessageCircleHeart,
  Palette, Users, ArrowRight, Star, Instagram, Calendar, CheckCircle2, ChevronRight
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
  {
    icon: Sparkles,
    title: 'Bespoke Luxury Designs',
    desc: 'Intricate Arabic vines, custom couple motifs, and royal traditional artistry tailored to your style.',
  },
  {
    icon: ShieldCheck,
    title: '100% Skin-Safe Organic Henna',
    desc: 'Prepared with pure natural triple-sifted henna leaves and essential oils for a deep, rich dark stain.',
  },
  {
    icon: Clock,
    title: 'Punctual & Dedicated',
    desc: 'Professional timing and focused attention so your wedding or celebration runs smoothly on schedule.',
  },
  {
    icon: Heart,
    title: 'Personalized Bridal Experience',
    desc: 'Every bridal piece is crafted with patience and love to tell your unique love story and match your outfit.',
  },
];

const BOOKING_STEPS = [
  {
    icon: Palette,
    step: '01',
    title: 'Choose Your Style',
    desc: 'Pick from Bridal, Arabic, Engagement, Designer, or Traditional Mehndi collections.',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Select Date & Slot',
    desc: 'Choose your event date and preferred time slot with instant availability check.',
  },
  {
    icon: Users,
    step: '03',
    title: 'Share Event Details',
    desc: 'Provide your venue, number of guests, and any custom motif preferences.',
  },
  {
    icon: MessageCircleHeart,
    step: '04',
    title: 'Confirm & Celebrate',
    desc: 'Get your instant confirmation and prepare for a flawless, memorable mehndi experience.',
  },
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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-mehndi-pattern pt-8 pb-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-ivory to-ivory pointer-events-none" />
        <MehndiMotif className="pointer-events-none absolute -left-48 top-1/3 hidden h-[700px] w-[700px] -translate-y-1/2 opacity-[0.12] lg:block text-gold-600" />
        <MehndiMotif className="pointer-events-none absolute -right-48 top-1/3 hidden h-[700px] w-[700px] -translate-y-1/2 scale-x-[-1] opacity-[0.12] lg:block text-gold-600" />

        <div className="container relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm backdrop-blur-md animate-fade-up">
                <Sparkles className="h-3.5 w-3.5 text-gold-500 animate-pulse" />
                <span>Luxury Bridal &amp; Event Mehndi Artistry</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-forest-950 tracking-tight leading-[1.15] animate-fade-up [animation-delay:100ms]">
                Timeless Mehndi for Your Most <span className="gold-gradient-text font-serif italic">Cherished Moments</span>
              </h1>

              <p className="text-base sm:text-lg text-forest-800/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-up [animation-delay:200ms]">
                Elevating traditional Indian henna craftsmanship with contemporary elegance. From bespoke royal bridal designs to chic Arabic vines, crafted with 100% natural organic henna for a deep, rich stain.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-up [animation-delay:300ms]">
                <Link href="/booking">
                  <Button size="lg" variant="luxury" className="gap-2 shadow-luxury">
                    <Calendar className="h-4 w-4" />
                    <span>Book Appointment</span>
                    <ArrowRight className="h-4 w-4 ml-0.5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline-gold">
                    View Price Packages
                  </Button>
                </Link>
                <a
                  href={whatsappLink('Hi Dhara! I would like to inquire about booking mehndi for my event.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="whatsapp" className="gap-2">
                    WhatsApp Inquiry
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gold-200/80 grid grid-cols-3 gap-4 text-center lg:text-left animate-fade-up [animation-delay:400ms]">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">500+</p>
                  <p className="text-xs text-forest-700/70 font-medium mt-0.5">Happy Brides &amp; Clients</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">100%</p>
                  <p className="text-xs text-forest-700/70 font-medium mt-0.5">Natural Organic Henna</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">5.0 ★</p>
                  <p className="text-xs text-forest-700/70 font-medium mt-0.5">Top-Rated Experience</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Showcase */}
            <div className="lg:col-span-5 relative flex justify-center animate-fade-up [animation-delay:200ms]">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] p-2.5 bg-gradient-to-tr from-gold-400 via-gold-200 to-gold-400 shadow-luxury">
                <div className="relative w-full h-full rounded-[26px] overflow-hidden">
                  <Image
                    src="/gallery/bridal-peacock-ornate.jpg"
                    alt="Luxury Bridal Mehndi Design by Dhara"
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Detail Badges */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-forest-900/85 backdrop-blur-md border border-gold-400/40 text-ivory flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">Featured Style</span>
                      <p className="font-serif text-base text-white">Royal Peacock Bridal</p>
                    </div>
                    <Link href="/gallery" className="text-xs text-gold-300 hover:text-white flex items-center gap-1">
                      <span>View</span> <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Floating Micro Badge Top Right */}
                <div className="absolute -top-4 -right-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gold-300 p-3 shadow-gold flex items-center gap-2.5 animate-float">
                  <div className="h-9 w-9 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest-900">Natural Organic Cone</p>
                    <p className="text-[10px] text-forest-700/70">Rich &amp; Dark Stain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & PHILOSOPHY SECTION */}
      <section className="container py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold-300 shadow-soft">
              <Image
                src="/gallery/bridal-full-hand-floral.jpg"
                alt="Bridal hand mehndi artwork"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <p className="font-serif text-xl font-medium">Bespoke Bridal Henna</p>
                <p className="text-xs text-gold-300/90 mt-1">Detailed to perfection for your big day</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="gold-divider-left" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">The Artistry &amp; Heritage</span>
            </div>
            <h2 className="section-heading">Every Henna Stroke Tells <span className="font-serif italic text-gold-600">Your Story</span></h2>
            <p className="text-base text-forest-800/80 leading-relaxed">
              At Mehndi By Dhara, henna is an art of devotion and celebration. With years of experience adorning brides and festive hands across the region, Dhara blends sacred Indian motifs — such as lotus blooms, peacocks, kalash, and personalized wedding narratives — with modern symmetry and flair.
            </p>
            <p className="text-base text-forest-800/80 leading-relaxed">
              We exclusively prepare our cones with pure Rajasthani henna, certified skin-safe essential oils, and zero harmful chemicals, guaranteeing not just breathtaking intricate patterns, but a deep mahogany stain that lasts.
            </p>

            <div className="pt-2 grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-gold-200/80 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-semibold text-forest-900">Customized Bridal Motifs</h3>
                  <p className="text-xs text-forest-800/70 mt-0.5">Portraits, hashtags, and story elements incorporated seamlessly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-gold-200/80 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-semibold text-forest-900">On-Location Services</h3>
                  <p className="text-xs text-forest-800/70 mt-0.5">Comfortable home visits and destination wedding travel available.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about">
                <Button variant="outline-gold" className="gap-2">
                  <span>Learn More About Dhara</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE STYLES / SERVICES SECTION */}
      <section className="bg-forest-950 py-20 sm:py-28 relative overflow-hidden bg-dark-pattern">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />
        
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-block rounded-full bg-forest-900 border border-gold-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
              Signature Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory tracking-tight">
              Curated Mehndi Styles
            </h2>
            <div className="gold-divider mt-3" />
            <p className="text-sm sm:text-base text-ivory/70 max-w-lg mx-auto">
              Explore our wide range of handcrafted styles designed for weddings, sangeet, engagement, festivals, and parties.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const prices = cat.services.flatMap((s) => s.pricingTiers.map((t) => t.price));
              return (
                <div
                  key={cat.id}
                  className="group relative rounded-3xl border border-gold-500/20 bg-forest-900/60 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/50 hover:bg-forest-900/90 hover:shadow-luxury"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block rounded-full bg-gold-500/20 text-gold-300 text-xs px-3 py-1 font-medium">
                      Collection
                    </span>
                    {prices.length > 0 && (
                      <span className="text-gold-300 font-semibold text-sm">
                        From ₹{Math.min(...prices)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl text-ivory group-hover:text-gold-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-3 text-sm text-ivory/70 leading-relaxed min-h-[48px]">
                    {cat.description}
                  </p>
                  
                  <div className="mt-6 pt-5 border-t border-ivory/10 flex items-center justify-between">
                    <Link
                      href={`/booking?category=${cat.slug}`}
                      className="text-xs font-semibold text-gold-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>Book This Style</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/pricing#${cat.slug}`}
                      className="text-xs text-ivory/50 hover:text-ivory transition-colors"
                    >
                      View Packages
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="luxury" size="lg" className="gap-2">
                <span>View Full Service Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">The Dhara Difference</span>
          <h2 className="section-heading">Why Brides &amp; Families Choose Us</h2>
          <div className="gold-divider mt-2" />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item) => (
            <Card
              key={item.title}
              className="p-7 text-center group hover:-translate-y-1 hover:border-gold-400 hover:shadow-luxury transition-all duration-300"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-gold-100 to-gold-200/60 border border-gold-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <item.icon className="h-7 w-7 text-gold-700" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-forest-950">{item.title}</h3>
              <p className="mt-2.5 text-sm text-forest-800/70 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4-STEP BOOKING PROCESS */}
      <section className="bg-cream/60 py-20 sm:py-28 border-y border-gold-200/60">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">Effortless Reservation</span>
            <h2 className="section-heading">Simple 4-Step Booking</h2>
            <div className="gold-divider mt-2" />
            <p className="text-sm text-forest-800/70">Reserve your luxury henna slot smoothly in less than a minute.</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((step) => (
              <div
                key={step.title}
                className="relative rounded-3xl bg-white p-7 border border-gold-200/90 shadow-card flex flex-col justify-between hover:border-gold-400 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-gold-500/80">{step.step}</span>
                    <div className="h-10 w-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-forest-950">{step.title}</h3>
                  <p className="mt-2 text-sm text-forest-800/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/booking">
              <Button size="lg" variant="luxury" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Start Your Booking</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY SHOWCASE */}
      {gallery.length > 0 && (
        <section className="container py-20 sm:py-28">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">Recent Masterpieces</span>
              <h2 className="section-heading mt-1">Our Mehndi Portfolio</h2>
            </div>
            <Link href="/gallery">
              <Button variant="outline-gold" className="gap-1.5">
                <span>View Full Gallery ({gallery.length}+)</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-3xl border border-gold-200/90 shadow-card bg-cream"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? 'Mehndi design by Dhara'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider">
                    {item.category?.replace('-', ' ') || 'Mehndi Design'}
                  </span>
                  <p className="text-white text-sm font-serif font-medium mt-0.5 line-clamp-1">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-forest-950 py-20 sm:py-28 relative overflow-hidden bg-dark-pattern">
          <div className="container relative">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-block rounded-full bg-forest-900 border border-gold-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
                Client Love
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory">Words From Happy Brides</h2>
              <div className="gold-divider mt-2" />
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="rounded-3xl border border-gold-500/20 bg-forest-900/70 p-7 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 text-gold-400 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-ivory/80 leading-relaxed italic">
                      &ldquo;{t.message}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-ivory/10 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 font-serif font-bold text-sm">
                      {t.customerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ivory">{t.customerName}</p>
                      <p className="text-[11px] text-gold-300/80">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CALL TO ACTION */}
      <section className="container py-20 sm:py-28 text-center">
        <div className="relative rounded-[36px] bg-gradient-to-tr from-cream via-white to-gold-50 p-8 sm:p-14 lg:p-16 border border-gold-300/80 shadow-luxury overflow-hidden max-w-4xl mx-auto">
          <MehndiMotif className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 opacity-10 text-gold-600" />
          <MehndiMotif className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 opacity-10 text-gold-600" />

          <LogoMark size={48} className="mx-auto mb-6" />
          <h2 className="section-heading text-forest-950 max-w-xl mx-auto">
            Ready to Adorn Your Hands for the Big Celebration?
          </h2>
          <p className="mt-4 text-base text-forest-800/80 max-w-lg mx-auto leading-relaxed">
            Reserve your wedding or event date now to secure Dhara’s exclusive personal attention and premium organic henna service.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="luxury" className="shadow-gold">
                <Calendar className="h-4 w-4" /> Book Appointment Now
              </Button>
            </Link>
            <a
              href={whatsappLink('Hi Mehndi By Dhara! I would like to book an appointment.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="whatsapp" className="gap-2">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

