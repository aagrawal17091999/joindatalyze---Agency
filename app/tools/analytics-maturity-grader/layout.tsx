import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Maturity Grader',
  description:
    'Take a 2-minute quiz to get a personalized analytics maturity scorecard with actionable recommendations.',
  alternates: { canonical: '/tools/analytics-maturity-grader' },
};

// No JSON-LD here: this layout also wraps /results, and the grader's FAQPage /
// SoftwareApplication markup would then appear on a page that renders neither.
// The schema is emitted from page.tsx instead ('use client' components still
// server-render, so it lands in the initial HTML either way).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
