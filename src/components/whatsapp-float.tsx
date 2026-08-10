import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('Hi Mehndi By Dhara! I would like to know more about your services.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105 lg:bottom-8 lg:right-8"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
