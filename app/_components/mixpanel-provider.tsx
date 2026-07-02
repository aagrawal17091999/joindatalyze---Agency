'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ensureInitialized, trackPageview } from '@/lib/mixpanel';

// Kick off init (and therefore session recording) as soon as this client
// chunk evaluates, rather than waiting for the component to mount and its
// useEffect to flush after hydration. This shaves the pre-hydration window
// where fast bounces would otherwise never start a replay. ensureInitialized
// is idempotent and no-ops on the server.
ensureInitialized();

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    trackPageview(url);
  }, [pathname, searchParams]);

  return null;
}

export default function MixpanelProvider() {
  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
