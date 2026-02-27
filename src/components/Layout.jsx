import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { preloadImages } from '../utils/preloadImages';

export default function Layout({ children }) {
  useEffect(() => {
    preloadImages([
      '/datalyze logo small arrow transparent.svg',
      '/datalyze logo updated.svg',
    ]);
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
