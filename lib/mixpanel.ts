import mixpanel from 'mixpanel-browser';

let initialized = false;

export function ensureInitialized() {
  if (initialized) return initialized;
  if (typeof window === 'undefined') return false;

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return false;

  mixpanel.init(token, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: false,
    persistence: 'localStorage',
    autocapture: true,
    record_sessions_percent: 100,
  });
  initialized = true;
  return initialized;
}

export function trackPageview(url: string) {
  if (!ensureInitialized()) return;
  mixpanel.track('$mp_web_page_view', { page: url });
}

export function track(event: string, properties?: Record<string, unknown>) {
  ensureInitialized();
  if (!initialized) return;
  mixpanel.track(event, properties);
}

export function identify(userId: string) {
  ensureInitialized();
  if (!initialized) return;
  mixpanel.identify(userId);
}

export default { track, identify };
