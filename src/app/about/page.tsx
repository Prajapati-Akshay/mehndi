import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, Heart, Award, ShieldCheck, Flame, Droplet,
  Sun, CheckCircle2, ArrowRight, Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/lib/whatsapp';

export default function AboutPage() {
  return (
    <div className="container py-16 sm:py-24 space-y-20">
      {/* Header & Story Section */}
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span>Our Heritage &amp; Passion</span>
          </div>
          <h1 className="section-heading">The Art &amp; Soul Behind <span className="gold-gradient-text italic font-serif">Mehndi By Dhara</span></h1>
          <div className="gold-divider-left" />

          <p className="text-forest-800/80 leading-relaxed text-base">
            Founded by Dhara, <strong>Mehndi By Dhara</strong> was born from a deep reverence for the sacred tradition of Indian henna artistry. For centuries, mehndi has symbolized joy, auspiciousness, love, and celebration across weddings and festive milestones.
          </p>
          <p className="text-forest-800/80 leading-relaxed text-base">
            Dhara blends classic heritage motifs — intricate kalash, blooming lotuses, ornate peacocks, and personalized bride-groom figures — with modern geometric finesse and clean negative space. Every design is hand-drawn freehand with utmost precision, patience, and warmth.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/booking">
              <Button variant="luxury" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Book a Consultation</span>
              </Button>
            </Link>
            <a
              href={whatsappLink('Hi Dhara! I would like to know more about your bridal mehndi services.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline-gold">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-gold-300 shadow-luxury bg-cream">
            <Image
              src="/gallery/bridal-heavy-elbow-dark.jpg"
              alt="Bridal mehndi by Dhara"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-forest-900/85 backdrop-blur-md border border-gold-400/40 text-ivory">
              <p className="font-serif text-lg text-white font-bold">500+ Happy Brides &amp; Clients</p>
              <p className="text-xs text-gold-300 mt-0.5">Creating unforgettable bridal memories since inception</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div>
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-600">Our Guiding Pillars</span>
          <h2 className="section-heading">Why Dhara’s Artistry Stands Out</h2>
          <div className="gold-divider mt-2" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-gold-200/90 bg-white/90 p-8 shadow-card text-center space-y-4 hover:-translate-y-1 hover:border-gold-400 transition-all">
            <div className="h-16 w-16 rounded-2xl bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-700 mx-auto">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Master Freehand Art</h3>
            <p className="text-sm text-forest-800/70 leading-relaxed">
              Never stenciled, never rushed. Every curve, dot, and shade is hand-crafted to highlight the beauty of your hands.
            </p>
          </div>

          <div className="rounded-3xl border border-gold-200/90 bg-white/90 p-8 shadow-card text-center space-y-4 hover:-translate-y-1 hover:border-gold-400 transition-all">
            <div className="h-16 w-16 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 mx-auto">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Custom Storytelling</h3>
            <p className="text-sm text-forest-800/70 leading-relaxed">
              We incorporate your wedding dates, proposal moments, favorite elements, and partner’s name seamlessly into the design.
            </p>
          </div>

          <div className="rounded-3xl border border-gold-200/90 bg-white/90 p-8 shadow-card text-center space-y-4 hover:-translate-y-1 hover:border-gold-400 transition-all">
            <div className="h-16 w-16 rounded-2xl bg-forest-100 border border-forest-300 flex items-center justify-center text-forest-800 mx-auto">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">100% Organic Cones</h3>
            <p className="text-sm text-forest-800/70 leading-relaxed">
              Freshly hand-mixed using pure triple-sifted Sojat henna, therapeutic eucalyptus oil, and sugar for a skin-friendly, dark stain.
            </p>
          </div>
        </div>
      </div>

      {/* Henna Stain & Aftercare Guide */}
      <div className="rounded-3xl bg-forest-950 text-ivory p-8 sm:p-12 lg:p-14 border border-gold-500/30 shadow-luxury">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">Expert Tips</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white">How to Get the Darkest Henna Stain</h2>
          <div className="gold-divider mt-2" />
          <p className="text-sm text-ivory/70">Follow Dhara’s proven aftercare routine for a deep, rich mahogany bridal stain.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold font-serif">1</div>
            <h4 className="font-serif text-lg text-white font-semibold">Keep it on 6–8 Hours</h4>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Allow the henna paste to stay on your skin undisturbed for maximum dye transfer into the epidermis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold font-serif">2</div>
            <h4 className="font-serif text-lg text-white font-semibold">Lemon-Sugar Sealant</h4>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Dab warm lemon juice mixed with sugar once the paste is dry to keep it moist and adhering to the skin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold font-serif">3</div>
            <h4 className="font-serif text-lg text-white font-semibold">Clove Warmth &amp; Balm</h4>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Fume hands gently over roasted cloves and apply natural coconut oil or balm after scraping (never wash with soap!).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest-900/80 border border-gold-500/20 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold font-serif">4</div>
            <h4 className="font-serif text-lg text-white font-semibold">Avoid Water for 12h</h4>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Protect your design from water and soap for the first 12–24 hours to let the stain oxidize into rich burgundy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

