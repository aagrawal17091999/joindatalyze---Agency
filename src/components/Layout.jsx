import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { preloadImages } from '../utils/preloadImages';
import { caseStudyList } from '../data/caseStudies';

// Preload images from all pages so they're cached before the user navigates.
// This runs once on app load, in the background via requestIdleCallback.
const GLOBAL_PRELOAD_URLS = [
  // Shared logos
  '/datalyze logo small arrow transparent.svg',
  '/datalyze logo updated.svg',
  // About page
  '/Ansh.png',
  '/sara-maarouf.jpg',
  '/world map.svg',
  // Services page
  '/service-icons/product-analytics.svg',
  '/service-icons/data-modelling.svg',
  '/service-icons/growth-experimentation.svg',
  // AI Agent page poster
  '/ai-agent-poster.jpg',
  // Case study logos
  ...caseStudyList.filter((c) => c.logo).map((c) => c.logo),
];

// Prefetch non-image assets (video, etc.) via a low-priority <link rel="prefetch">.
// The browser downloads these when idle without blocking anything.
function prefetchAssets(urls) {
  const run = () => {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run);
  } else {
    setTimeout(run, 500);
  }
}

export default function Layout({ children }) {
  useEffect(() => {
    preloadImages(GLOBAL_PRELOAD_URLS);
    prefetchAssets(['/ai-agent-video-new.mp4']);
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
