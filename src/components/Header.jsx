import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import mixpanel from '../utils/mixpanel';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/tools', label: 'Tools' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/resources', label: 'Resources' },
  { to: '/ai-analytics-agent', label: 'AI Analytics Agent' },
  { to: '/contact', label: 'Contact' },
  { to: 'https://blog.joindatalyze.com', label: 'Blog', external: true },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/datalyze logo small arrow transparent.svg" alt="" className="brand-logo" aria-hidden="true" fetchpriority="high" />
          <span className="brand-name">Datalyze</span>
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>
          {navLinks.map(({ to, label, external }) =>
            external ? (
              <a key={to} href={to} target="_blank" rel="noopener noreferrer" onClick={() => mixpanel.track('Nav Link Clicked', { link_label: label, link_url: to })}>
                {label}
              </a>
            ) : (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => mixpanel.track('Nav Link Clicked', { link_label: label, link_url: to })}>
                {label}
              </NavLink>
            )
          )}
          <Link className="btn pill" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Book Audit', location: 'header' })}>
            Book Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
