import { MessageCircle, Sparkles } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 lg:bottom-7 lg:right-7 group">
      <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-forest-900/90 text-ivory border border-gold-400/40 px-3.5 py-1.5 text-xs font-medium shadow-luxury backdrop-blur-md transition-all duration-300 group-hover:scale-105">
        <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />
        <span>Chat with Dhara</span>
      </div>
      <a
        href={whatsappLink('Hi Mehndi By Dhara! I would like to know more about your services.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dhara on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <MessageCircle className="h-7 w-7 relative z-10" />
      </a>
    </div>
  );
}

