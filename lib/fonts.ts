import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Mono is no longer used on the homepage (typography consolidated to General
// Sans + Instrument Serif). It stays registered because the /tools code and
// snippet sections still reference var(--font-mono), but preload is disabled
// so its woff2 is never requested on routes that don't use it (e.g. the home
// page).
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

export const generalSans = localFont({
  src: [
    {
      path: '../public/fonts/GeneralSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeneralSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeneralSans-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
});
