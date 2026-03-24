import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import mixpanel from '../utils/mixpanel';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/ai-analytics-agent', label: 'AI Analytics Agent' },
];

const hamburgerLinks = [
  { to: '/tools', label: 'Tools' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
  { to: 'https://blog.joindatalyze.com', label: 'Blog', external: true },
];

function NavItem({ to, label, external, onClick }) {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" onClick={() => { onClick?.(); mixpanel.track('Nav Link Clicked', { link_label: label, link_url: to }); }}>
        {label}
      </a>
    );
  }
  return (
    <NavLink to={to} end={to === '/'} onClick={() => { onClick?.(); mixpanel.track('Nav Link Clicked', { link_label: label, link_url: to }); }}>
      {label}
    </NavLink>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setHamburgerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close hamburger dropdown on outside click
  useEffect(() => {
    if (!hamburgerOpen) return;
    function handleClick(e) {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [hamburgerOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/datalyze logo small arrow transparent.svg" alt="" className="brand-logo" aria-hidden="true" fetchpriority="high" />
          <span className="brand-name">Datalyze</span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className={`menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <nav className={`site-nav ${mobileMenuOpen ? 'site-nav--open' : ''}`}>
          {primaryLinks.map(({ to, label, external }) => (
            <NavItem key={to} to={to} label={label} external={external} />
          ))}

          <Link className="btn pill" to="/contact" onClick={() => mixpanel.track('CTA Clicked', { cta_text: 'Book Audit', location: 'header' })}>
            Book Audit
          </Link>

          {/* Hamburger dropdown for secondary links */}
          <div className="hamburger-dropdown" ref={hamburgerRef}>
            <button
              className={`hamburger-toggle ${hamburgerOpen ? 'open' : ''}`}
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              aria-label="More links"
              aria-expanded={hamburgerOpen}
            >
              <span className="hamburger-toggle-bar" />
              <span className="hamburger-toggle-bar" />
              <span className="hamburger-toggle-bar" />
            </button>
            {hamburgerOpen && (
              <div className="hamburger-menu">
                {hamburgerLinks.map(({ to, label, external }) => (
                  <NavItem key={to} to={to} label={label} external={external} onClick={() => setHamburgerOpen(false)} />
                ))}
              </div>
            )}
          </div>

          {/* Show hamburger links inline in mobile overlay */}
          <div className="mobile-extra-links">
            {hamburgerLinks.map(({ to, label, external }) => (
              <NavItem key={to} to={to} label={label} external={external} />
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
