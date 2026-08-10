import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { SeedProvider } from '@/components/seed-provider';
import './globals.css';

const heading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mehndi By Dhara (Standalone) | Premium Mehndi Artist & Booking',
    template: '%s | Mehndi By Dhara',
  },
  description:
    'Standalone, backend-free demo of the Mehndi By Dhara booking site. Book beautiful Arabic, Bridal, Engagement, Designer and Traditional Mehndi — all data stored locally in your browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <SeedProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SeedProvider>
      </body>
    </html>
  );
}
