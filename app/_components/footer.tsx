import Link from 'next/link';

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/contact', label: 'Contact' },
];

const RESOURCES_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: '/resources', label: 'Resources' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/ai-analytics-agent', label: 'AI Analytics Agent' },
  {
    href: '/blog',
    label: 'Blog',
    external: true,
  },
];

const CONTACT_LINKS = [
  { href: 'mailto:ansh@joindatalyze.com', label: 'ansh@joindatalyze.com' },
  {
    href: 'https://www.linkedin.com/company/joindatalyze',
    label: 'LinkedIn',
    external: true,
  },
  { href: '/contact', label: 'Book a Call' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="footer__brand">
              Datalyze
            </Link>
            <p className="footer__tagline">
              The foundation your data was supposed to be. We rebuild it, then
              find the growth it&apos;s been hiding.
            </p>
          </div>

          <div>
            <div className="footer__col-title">Company</div>
            <div className="footer__links">
              {COMPANY_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Resources</div>
            <div className="footer__links">
              {RESOURCES_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Contact</div>
            <div className="footer__links">
              {CONTACT_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : link.href.startsWith('mailto:') ? (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Datalyze. All rights reserved.</span>
          <span>Analytics & growth partner · 150+ startups</span>
        </div>
      </div>
    </footer>
  );
}
