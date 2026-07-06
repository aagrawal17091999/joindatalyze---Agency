'use client';

import { useEffect } from 'react';
import { track } from '@/lib/mixpanel';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Calendly redirects the invitee here after a booking is confirmed (set the
// event type's confirmation page to "Redirect to an external site" →
// https://joindatalyze.com/contact/booked). This is where the booking
// conversion fires now that scheduling happens on a top-level Calendly page
// rather than an on-page iframe we can listen to via postMessage.
export default function BookedTracker() {
  useEffect(() => {
    track('Calendly Event Scheduled', { location: 'contact_page' });
    window.gtag?.('event', 'conversion', {
      send_to: 'AW-18010353889/q2vPCKXQkIccEOHhgIxD',
    });
  }, []);

  return null;
}
