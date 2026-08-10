import { Sparkles, Heart, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Our Story</span>
        <h1 className="section-heading mt-3">About Mehndi By Dhara</h1>
        <p className="mt-6 text-forest-800/80 leading-relaxed">
          Mehndi By Dhara was founded on a simple belief: every celebration deserves artistry that feels as
          special as the moment itself. With a passion for traditional Indian Mehndi and an eye for modern
          design, Dhara has adorned hundreds of hands and feet for weddings, engagements and festive occasions.
        </p>
        <p className="mt-4 text-forest-800/80 leading-relaxed">
          Every design — from bold Arabic vines to intricate bridal masterpieces featuring peacocks, kalash,
          and couple figures — is applied with premium, skin-safe henna for a rich, long-lasting stain.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        <Card className="p-8 text-center">
          <Sparkles className="h-8 w-8 text-gold-500 mx-auto" />
          <h3 className="mt-4 font-serif text-lg text-forest-900">Premium Artistry</h3>
          <p className="mt-2 text-sm text-forest-800/70">Every design is custom, detailed, and finished with care.</p>
        </Card>
        <Card className="p-8 text-center">
          <Heart className="h-8 w-8 text-rose-500 mx-auto" />
          <h3 className="mt-4 font-serif text-lg text-forest-900">Made With Love</h3>
          <p className="mt-2 text-sm text-forest-800/70">Your celebration is treated with the personal attention it deserves.</p>
        </Card>
        <Card className="p-8 text-center">
          <Award className="h-8 w-8 text-forest-700 mx-auto" />
          <h3 className="mt-4 font-serif text-lg text-forest-900">Trusted Experience</h3>
          <p className="mt-2 text-sm text-forest-800/70">Hundreds of happy brides, families and friends across events.</p>
        </Card>
      </div>
    </div>
  );
}
