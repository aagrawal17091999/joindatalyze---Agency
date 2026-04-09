import mixpanel from 'mixpanel-browser';

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  if (typeof window === 'undefined') return;

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;

  mixpanel.init(token, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: true,
    persistence: 'localStorage',
    autocapture: true,
    record_sessions_percent: 100,
  });
  initialized = true;
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
