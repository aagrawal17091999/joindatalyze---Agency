import { Link } from 'react-router-dom';

const socialLinks = [
  { href: 'https://www.linkedin.com/company/datalyze', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'mailto:ansh@joindatalyze.com', label: 'Email', icon: 'email' },
];

const navGroups = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Services' },
      { to: '/case-studies', label: 'Case Studies' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/resources', label: 'Resources' },
      { to: '/tools', label: 'Tools' },
      { to: 'https://blog.joindatalyze.com', label: 'Blog', external: true },
    ],
  },
];

function SocialIcon({ icon }) {
  if (icon === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452H17.21v-4.993c0-1.19-.023-2.72-1.658-2.72-1.66 0-1.914 1.296-1.914 2.633v5.08H10.4V9h3.115v1.561h.045c.434-.82 1.494-1.686 3.074-1.686 3.29 0 3.895 2.164 3.895 4.977v6.6ZM7.003 7.433a1.804 1.804 0 1 1 0-3.608 1.804 1.804 0 0 1 0 3.608ZM8.62 20.452H5.383V9H8.62v11.452Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.511l-8 5.333-8-5.333V6h16Zm0 12H4V8.156l7.4 4.933a1 1 0 0 0 1.2 0L20 8.156V18Z" />
    </svg>
  );
}

export default function Footer({ variant = 'primary' }) {
  const isAuth = variant === 'auth';

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="brand">
                <img src="/datalyze logo small arrow transparent.svg" alt="" className="brand-logo" aria-hidden="true" />
                <span className="brand-name">Datalyze</span>
              </div>
            </div>
            {variant !== 'auth' && (
              <>
                <p className="footer-description">
                  Datalyze is your analytics and growth partner. We help teams collect clean data, unlock
                  insights, and run experiments that compound.
                </p>
                <div className="footer-social">
                  <span className="footer-social-label">Follow us</span>
                  <div className="footer-social-links">
                    {socialLinks.map(({ href, label, icon }) => (
                      <a key={label} className="social-link" href={href} aria-label={label}>
                        <SocialIcon icon={icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={isAuth ? 'footer-links' : 'footer-nav'}>
            {navGroups.map((group) => (
              <div key={group.title} className="footer-nav-group">
                <h4 className="footer-nav-title">{group.title}</h4>
                <ul className="footer-nav-list">
                  {group.links.map(({ to, label, external }) => (
                    <li key={to}>
                      {external ? (
                        <a href={to} target="_blank" rel="noopener noreferrer">{label}</a>
                      ) : (
                        <Link to={to}>{label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright">© {new Date().getFullYear()} Datalyze. All rights reserved.</p>
          {!isAuth && (
            <div className="footer-legal">
              <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
              <span className="footer-legal-separator">•</span>
              <a href="/terms" className="footer-legal-link">Terms of Service</a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
