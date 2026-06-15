import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Absolute because the parent grader layout's own title stops the root
  // template from cascading to this nested segment.
  title: { absolute: 'Your Analytics Maturity Results | Datalyze' },
  description: 'Your personalized analytics maturity scorecard from Datalyze.',
  alternates: { canonical: '/tools/analytics-maturity-grader/results' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
