import mixpanel from 'mixpanel-browser';

// The installed SDK (2.77) supports lib_base_path, but @types/mixpanel-browser
// (2.50) hasn't declared it yet. Extend the init config type so we keep type
// checking on every other option while allowing this one field.
type MixpanelInitConfig = NonNullable<Parameters<typeof mixpanel.init>[1]> & {
  lib_base_path?: string;
};

let initialized = false;

export function ensureInitialized() {
  if (initialized) return initialized;
  if (typeof window === 'undefined') return false;

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return false;

  // Route all Mixpanel traffic through our own origin (see app/mp/*) so ad
  // blockers, which match on *.mxpnl.com / api*.mixpanel.com, can't drop events
  // or session replays. api_host covers ingestion (/track, /engage, /record,
  // /flags); lib_base_path covers the lazy-loaded replay recorder bundle. Built
  // from the live origin so it works on localhost, previews and production.
  const origin = window.location.origin;

  const config: MixpanelInitConfig = {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: false,
    persistence: 'localStorage',
    autocapture: true,
    record_sessions_percent: 100,
    api_host: `${origin}/mp/api`,
    lib_base_path: `${origin}/mp/libs/`,
    // By default Mixpanel masks ALL text with record_mask_text_selector: '*'.
    // Narrow it to an explicit class so normal page text is visible in replays;
    // only elements tagged with .mp-mask are hidden. Form <input>/<textarea>
    // values stay masked regardless (rrweb input masking), so emails etc. are safe.
    record_mask_text_selector: '.mp-mask',
    record_block_selector: '.mp-block',
  };

  mixpanel.init(token, config);
  initialized = true;
  return initialized;
}

export function trackPageview(url: string) {
  if (!ensureInitialized()) return;
  mixpanel.track('$mp_web_page_view', { page: url });
}

type TrackOptions = {
  // Runs once the event has been queued/sent — use to flush before navigating.
  callback?: () => void;
  // 'sendBeacon' survives page unload (tab close / navigation); use it for
  // abandonment-style events fired from pagehide/visibilitychange handlers.
  transport?: 'xhr' | 'sendBeacon';
};

export function track(
  event: string,
  properties?: Record<string, unknown>,
  optionsOrCallback?: (() => void) | TrackOptions,
) {
  const options: TrackOptions =
    typeof optionsOrCallback === 'function'
      ? { callback: optionsOrCallback }
      : (optionsOrCallback ?? {});

  ensureInitialized();
  // If Mixpanel never initialized (blocked before our proxy, SSR, no token),
  // still run the callback so callers that redirect on it aren't left hanging.
  if (!initialized) {
    options.callback?.();
    return;
  }

  const requestOptions = options.transport
    ? { transport: options.transport }
    : {};
  mixpanel.track(event, properties, requestOptions, options.callback);
}

export function identify(userId: string) {
  ensureInitialized();
  if (!initialized) return;
  mixpanel.identify(userId);
}

export default { track, identify };
