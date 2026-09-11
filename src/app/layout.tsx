import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SiteFrame } from '@/components/site-frame';
import { PostHogProvider } from '@/components/posthog-provider';
import { PostHogPageView } from '@/components/posthog-pageview';
import './globals.css';

const heading = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mehndi By Dhara (Standalone) | Premium Mehndi Artist & Booking',
    template: '%s | Mehndi By Dhara',
  },
  description:
    'Book beautiful Arabic, Bridal, Engagement, Designer and Traditional Mehndi with Mehndi By Dhara.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <PostHogProvider>
          <PostHogPageView />
          <SiteFrame>{children}</SiteFrame>
        </PostHogProvider>
      </body>
    </html>
  );
}
