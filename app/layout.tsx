import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { instrumentSerif, jetbrainsMono, generalSans } from '@/lib/fonts';
import Nav from './_components/nav';
import Footer from './_components/footer';
import Grain from './_components/grain';
import GfxObserver from './_components/graphic-observer';
import MixpanelProvider from './_components/mixpanel-provider';
import JsonLd from '@/components/seo/JsonLd';
import { siteGraph } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.joindatalyze.com'),
  title: {
    default: 'Datalyze — Analytics & Growth Partner',
    template: '%s | Datalyze',
  },
  description:
    "We've seen this across 150+ startups. Datalyze rebuilds your data foundation, then shows you the growth your data has been hiding.",
  openGraph: {
    type: 'website',
    siteName: 'Datalyze',
    title: 'Analytics & Growth Partner',
    description:
      "We've seen this across 150+ startups. Datalyze rebuilds your data foundation, then shows you the growth your data has been hiding.",
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${generalSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://calendly.com" crossOrigin="anonymous" />
        <Script
          src="https://www.rocketsdr.ai/api/pixel?id=ts_843347486702a28fbe0402db6e1bc9ea"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <JsonLd data={siteGraph} />
        <MixpanelProvider />
        <Grain />
        <GfxObserver />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
