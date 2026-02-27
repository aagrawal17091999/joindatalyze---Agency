import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/tools', label: 'Tools' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' },
  { to: 'https://blog.joindatalyze.com', label: 'Blog', external: true },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/datalyze logo small arrow transparent.svg" alt="" className="brand-logo" aria-hidden="true" fetchpriority="high" />
          <span className="brand-name">Datalyze</span>
        </Link>
        <nav className="site-nav">
          {navLinks.map(({ to, label, external }) =>
            external ? (
              <a key={to} href={to} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            )
          )}
          <Link className="btn pill" to="/contact">
            Book Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
