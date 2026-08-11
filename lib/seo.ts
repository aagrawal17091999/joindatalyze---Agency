// Centralised SEO/structured-data helpers. Keep schema construction here so
// every page emits consistent JSON-LD that matches the canonical www host.
//
// Entity model: the Organization, the founder Person, and the WebSite are
// declared exactly once (site-wide, in the root layout) as an @graph, each with
// a stable @id. Every other page references them by @id instead of re-declaring
// them. That's what lets search and answer engines resolve "Datalyze" and "Ansh
// Agrawal" to one entity each rather than a dozen look-alike copies.

export const SITE_URL = 'https://www.joindatalyze.com';
export const SITE_NAME = 'Datalyze';

/** Stable @id anchors for the site's core entities. Never change these. */
export const ORG_ID = `${SITE_URL}/#org`;
export const PERSON_ID = `${SITE_URL}/#ansh`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Reference the site-wide entities from a page-level schema. */
export const orgRef = { '@id': ORG_ID };
export const personRef = { '@id': PERSON_ID };

type Json = Record<string, unknown>;

const organizationNode: Json = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.png`,
  description:
    'Datalyze is an analytics & growth partner. We rebuild your data foundation, then surface the growth your data has been hiding.',
  email: 'ansh@joindatalyze.com',
  founder: personRef,
  sameAs: ['https://www.linkedin.com/company/joindatalyze'],
};

const personNode: Json = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Ansh Agrawal',
  jobTitle: 'Founder',
  worksFor: orgRef,
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/Ansh.png`,
  description:
    'Built analytics infrastructure for 90+ startups before founding Datalyze in 2025. Specializes in product analytics, experimentation, and the messy first 90 days of fixing a broken stack. Mixpanel Certified. Based in India.',
  knowsAbout: [
    'Product analytics',
    'Mixpanel',
    'Amplitude',
    'PostHog',
    'Marketing attribution',
    'User retention',
    'Event tracking plans',
    'Data warehousing',
    'Experimentation',
  ],
  sameAs: ['https://www.linkedin.com/in/anshagrawal/'],
};

const websiteNode: Json = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: orgRef,
  // No `potentialAction: SearchAction` — the site has no site-wide search
  // endpoint, and declaring one that doesn't exist is a spam signal.
};

/**
 * The site-wide entity graph. Emitted once, from the root layout, so every
 * page on the site carries the same resolvable Organization/Person/WebSite.
 */
export const siteGraph: Json = {
  '@context': 'https://schema.org',
  '@graph': [organizationNode, personNode, websiteNode],
};

/** Build a BreadcrumbList from an ordered list of {name, path} crumbs. */
export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Build an FAQPage from {q, a} pairs (eligible for FAQ rich results).
 *
 * Callers must pass the *same* data the page renders as visible text. Google
 * and the AI crawlers both penalise FAQ markup whose answers don't appear
 * on-page, so always feed this the array the component renders from.
 */
export function faqPageSchema(items: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * Build a SoftwareApplication for a free tool page. Every Datalyze tool is a
 * free, browser-or-local utility, hence the hardcoded $0 offer.
 */
export function softwareApplicationSchema(app: {
  name: string;
  description: string;
  path: string;
  /** 'Web' for browser tools; the runtime for downloadables (e.g. Jupyter). */
  operatingSystem?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: `${SITE_URL}${app.path}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: app.operatingSystem ?? 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: orgRef,
    author: orgRef,
  };
}
