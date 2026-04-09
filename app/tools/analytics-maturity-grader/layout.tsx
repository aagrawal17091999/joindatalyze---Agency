import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Take a 2-minute quiz to get a personalized analytics maturity scorecard with actionable recommendations.',
  alternates: { canonical: '/tools/analytics-maturity-grader' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
