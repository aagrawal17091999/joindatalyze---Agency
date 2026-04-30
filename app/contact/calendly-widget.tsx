'use client';

import { useEffect } from 'react';
import { track } from '@/lib/mixpanel';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CALENDLY_URL =
  'https://calendly.com/ansh-datalyze/chat?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0b&text_color=fafaf9&primary_color=c4f02e&embed_domain=joindatalyze.com&embed_type=Inline';

export default function CalendlyWidget() {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const event = (e.data as { event?: string }).event;
      if (event === 'calendly.date_and_time_selected') {
        track('Calendly Date and Time Selected', { location: 'contact_page' });
      }
      if (event === 'calendly.event_scheduled') {
        track('Calendly Event Scheduled', { location: 'contact_page' });
        window.gtag?.('event', 'conversion', {
          send_to: 'AW-18010353889/q2vPCKXQkIccEOHhgIxD',
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      src={CALENDLY_URL}
      title="Schedule a call with Datalyze"
      style={{
        display: 'block',
        width: '100%',
        minWidth: 320,
        maxWidth: 1000,
        margin: '0 auto',
        height: 720,
        border: 'none',
        colorScheme: 'light',
      }}
    />
  );
}
