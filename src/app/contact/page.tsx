import { Instagram, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { INSTAGRAM_URL, WHATSAPP_NUMBER, whatsappLink } from '@/lib/whatsapp';
import { ContactForm } from './contact-form';

export default function ContactPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Get in Touch</span>
        <h1 className="section-heading mt-3">Contact Us</h1>
        <p className="mt-4 text-forest-800/70">Have a question before booking? Reach out — we&rsquo;d love to help.</p>
      </div>

      <div className="mt-16 grid lg:grid-cols-2 gap-10">
        <Card className="p-8">
          <ContactForm />
        </Card>

        <div className="space-y-4">
          <Card className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-forest-50 flex items-center justify-center"><Phone className="h-5 w-5 text-forest-700" /></div>
            <div>
              <p className="font-medium text-forest-900">Call or Message</p>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-sm text-forest-800/70">+91 6358290268</a>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-[#25D366]" /></div>
            <div>
              <p className="font-medium text-forest-900">WhatsApp</p>
              <a href={whatsappLink('Hi Mehndi By Dhara! I have a question.')} target="_blank" rel="noopener noreferrer" className="text-sm text-forest-800/70">Chat with us instantly</a>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center"><Instagram className="h-5 w-5 text-rose-500" /></div>
            <div>
              <p className="font-medium text-forest-900">Instagram</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-forest-800/70">@mehndibydhara</a>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gold-50 flex items-center justify-center"><MapPin className="h-5 w-5 text-gold-600" /></div>
            <div>
              <p className="font-medium text-forest-900">Service Area</p>
              <p className="text-sm text-forest-800/70">Available for home visits &mdash; travel charges may apply</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
