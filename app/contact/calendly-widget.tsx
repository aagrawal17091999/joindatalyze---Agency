'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { track } from '@/lib/mixpanel';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/ansh-datalyze/chat?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0b&text_color=fafaf9&primary_color=c4f02e"
        style={{
          minWidth: 320,
          height: 720,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
        }}
      />
    </>
  );
}
