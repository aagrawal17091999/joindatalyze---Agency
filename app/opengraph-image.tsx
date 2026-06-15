import { ImageResponse } from 'next/og';

// Sitewide default social-share image. Next applies this as og:image (and the
// Twitter card falls back to it) for every route that doesn't define its own.
export const alt = 'Datalyze — Analytics & Growth Partner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0B',
          padding: 80,
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 34,
            letterSpacing: 8,
            fontWeight: 600,
          }}
        >
          DATALYZE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}
          >
            Analytics &amp; Growth Partner
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#9A9A9A',
              marginTop: 28,
              maxWidth: 880,
            }}
          >
            We rebuild your data foundation, then show you the growth your data
            has been hiding.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            color: '#7C7C7C',
          }}
        >
          <span>joindatalyze.com</span>
          <span>150+ startups</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
