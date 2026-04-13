'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ensureInitialized, trackPageview } from '@/lib/mixpanel';

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
  useEffect(() => {
    ensureInitialized();
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
