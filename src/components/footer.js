const brandMarkup = ({ includeDescription = true, includeSocial = false } = {}) => {
  const description = includeDescription
    ? `
        <p>
          Datalyze is your analytics and growth partner. We help teams collect clean data, unlock
          insights, and run experiments that compound.
        </p>
      `
    : '';

  const socialLinks = includeSocial
    ? `
        <div class="footer-social">
          ${renderSocialLinks()}
        </div>
      `
    : '';

  return `
      <div class="footer-brand">
        <div class="brand">
          <span class="brand-mark">D</span>
          <div class="brand-text">
            <span class="brand-name">Datalyze</span>
            <span class="brand-tag">Analytics & Growth</span>
          </div>
        </div>
        ${description}
        ${socialLinks}
      </div>
    `;
};

const renderSocialLinks = () => {
  const socialLinks = [
    {
      href: 'https://www.linkedin.com/company/datalyze',
      label: 'LinkedIn',
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.447 20.452H17.21v-4.993c0-1.19-.023-2.72-1.658-2.72-1.66 0-1.914 1.296-1.914 2.633v5.08H10.4V9h3.115v1.561h.045c.434-.82 1.494-1.686 3.074-1.686 3.29 0 3.895 2.164 3.895 4.977v6.6ZM7.003 7.433a1.804 1.804 0 1 1 0-3.608 1.804 1.804 0 0 1 0 3.608ZM8.62 20.452H5.383V9H8.62v11.452Z"
          />
        </svg>
      `.trim()
    },
    {
      href: 'mailto:hello@datalyze.io',
      label: 'Email',
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.511l-8 5.333-8-5.333V6h16Zm0 12H4V8.156l7.4 4.933a1 1 0 0 0 1.2 0L20 8.156V18Z"
          />
        </svg>
      `.trim()
    }
  ];

  return socialLinks
    .map(
      (link) =>
        `<a class="social-link" href="${link.href}" aria-label="${link.label}">${link.icon}</a>`
    )
    .join('');
};

const renderNavLinks = () => {
  const navLinks = [
    { href: '/index', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/case-studies/', label: 'Case studies' },
    { href: '/resources', label: 'Resources' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contact', label: 'Contact' }
  ];

  return navLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join('');
};

const renderAuthLinks = () => {
  const groups = [
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/case-studies/', label: 'Case Studies' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '/resources', label: 'Resources' },
        { href: '/faqs', label: 'FAQs' },
        { href: '/contact', label: 'Contact' }
      ]
    }
  ];

  return groups
    .map(
      (group) => `
        <div>
          <span>${group.title}</span>
          ${group.links.map((link) => `<a href="${link.href}">${link.label}</a>`).join('')}
        </div>
      `
    )
    .join('');
};

const renderPrimaryFooter = () => {
  return `
    <div class="container footer-grid">
      ${brandMarkup({ includeDescription: false, includeSocial: true })}
      <div class="footer-nav">
        ${renderNavLinks()}
      </div>
      <p class="copyright">© <span id="year"></span> Datalyze. All rights reserved.</p>
    </div>
  `;
};

const renderAuthFooter = () => {
  return `
    <div class="container footer-grid">
      ${brandMarkup({ includeDescription: true })}
      <div class="footer-links">
        ${renderAuthLinks()}
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span id="year"></span> Datalyze. All rights reserved.</p>
    </div>
  `;
};

export const renderFooter = (variant = 'primary') => {
  if (variant === 'auth') {
    return renderAuthFooter();
  }

  return renderPrimaryFooter();
};
