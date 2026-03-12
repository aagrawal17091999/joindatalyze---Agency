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

export default function Layout({ children }) {
  useEffect(() => {
    preloadImages(GLOBAL_PRELOAD_URLS);
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
