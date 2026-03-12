import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://joindatalyze.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/datalyze%20logo%20updated.png`;

export default function SEO({ title, description, path, ogImage }) {
  const fullTitle = title
    ? `${title} | Datalyze`
    : 'Datalyze | Analytics & Growth Partner';
  const url = `${SITE_URL}${path || ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />
    </Helmet>
  );
}
