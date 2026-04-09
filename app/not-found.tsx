import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="container">
        <header className="page-header page-header--center">
          <div className="eyebrow eyebrow--center">404</div>
          <h1 className="page-header__title">
            This page doesn&apos;t line up
          </h1>
          <p className="page-header__intro">
            The URL you landed on doesn&apos;t exist. Head back to the
            homepage, or explore the work we&apos;ve shipped.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'center',
              marginTop: 'var(--space-7)',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/" className="btn-primary">
              Home
            </Link>
            <Link href="/case-studies" className="btn-secondary">
              See Case Studies
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
