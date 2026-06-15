// Centralised SEO/structured-data helpers. Keep schema construction here so
// every page emits consistent JSON-LD that matches the canonical www host.

export const SITE_URL = 'https://www.joindatalyze.com';
export const SITE_NAME = 'Datalyze';

type Json = Record<string, unknown>;

export const organizationSchema: Json = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    'Datalyze is an analytics & growth partner. We rebuild your data foundation, then surface the growth your data has been hiding.',
  founder: { '@type': 'Person', name: 'Ansh Agrawal' },
  sameAs: ['https://www.linkedin.com/company/joindatalyze'],
};

export const websiteSchema: Json = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
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

/** Build an FAQPage from {q, a} pairs (eligible for FAQ rich results). */
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
