'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CtaButton from './cta-button';

const PRIMARY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/ai-analytics-agent', label: 'AI Agent' },
  { href: '/case-studies', label: 'Case Studies' },
];

const SECONDARY_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav__inner">
          <Link href="/" className="nav__logo" aria-label="Datalyze home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/datalyze%20logo%20small%20arrow%20transparent.svg"
              alt=""
              className="nav__logo-mark"
              width={56}
              height={56}
            />
            <span>Datalyze</span>
          </Link>

          <div className="nav__links">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'is-active' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav__right">
            <div className="nav__cta-desktop">
              <CtaButton
                href="/contact"
                location="nav_header"
                className="btn-primary nav__cta"
              >
                Book a Call
              </CtaButton>
            </div>

            <button
              type="button"
              className="nav__hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`nav__menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {PRIMARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav__menu-primary"
          >
            {link.label}
          </Link>
        ))}
        {SECONDARY_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <CtaButton
          href="/contact"
          location="nav_mobile"
          className="btn-primary"
        >
          Book a Call
        </CtaButton>
      </div>
    </>
  );
}
