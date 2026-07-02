'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/mixpanel';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CALENDLY_URL =
  'https://calendly.com/ansh-datalyze/chat?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0b&text_color=fafaf9&primary_color=c4f02e&embed_domain=joindatalyze.com&embed_type=Inline';

// If Calendly hasn't rendered its booking UI within this window, we treat the
// embed as failed to load (ad blocker, blocked third-party storage, network,
// etc.). Generous enough to avoid flagging slow-but-working loads.
const LOAD_TIMEOUT_MS = 10000;

export default function CalendlyWidget() {
  // Fire-once guards so a single visit produces at most one of each signal.
  const iframeLoadedRef = useRef(false);
  const renderedRef = useRef(false);
  const failTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const event = (e.data as { event?: string }).event;

      // Fires when Calendly's booking UI has actually rendered — the definitive
      // "the embed works for this user" signal. Cancels the failure timer.
      if (event === 'calendly.event_type_viewed' && !renderedRef.current) {
        renderedRef.current = true;
        if (failTimerRef.current) clearTimeout(failTimerRef.current);
        track('Calendly Rendered', { location: 'contact_page' });
      }
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

    // If nothing rendered in time, record a load failure. iframe_loaded tells
    // apart a hard block (frame never responded) from a frame that loaded but
    // whose Calendly app never initialized (blocked storage/resources inside).
    failTimerRef.current = setTimeout(() => {
      if (renderedRef.current) return;
      track('Calendly Load Failed', {
        location: 'contact_page',
        iframe_loaded: iframeLoadedRef.current,
      });
    }, LOAD_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (failTimerRef.current) clearTimeout(failTimerRef.current);
    };
  }, []);

  const handleIframeLoad = () => {
    if (iframeLoadedRef.current) return;
    iframeLoadedRef.current = true;
    // The frame responded (request wasn't hard-blocked). Not proof the booking
    // UI is usable — that's what 'Calendly Rendered' confirms.
    track('Calendly Iframe Loaded', { location: 'contact_page' });
  };

  return (
    <iframe
      src={CALENDLY_URL}
      title="Schedule a call with Datalyze"
      onLoad={handleIframeLoad}
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
