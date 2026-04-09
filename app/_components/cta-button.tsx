'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track } from '@/lib/mixpanel';

type Props = {
  href: string;
  location: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export default function CtaButton({
  href,
  location,
  children,
  className = 'btn-primary',
  external = false,
}: Props) {
  const handleClick = () => {
    const text = typeof children === 'string' ? children : undefined;
    track('CTA Clicked', { cta_text: text, location });
  };

  if (external) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
