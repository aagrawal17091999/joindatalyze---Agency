import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Analytics Maturity Results',
  description: 'Your personalized analytics maturity scorecard from Datalyze.',
  alternates: { canonical: '/tools/analytics-maturity-grader/results' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
