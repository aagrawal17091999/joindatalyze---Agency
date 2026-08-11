import type { Metadata } from 'next';
import { homeTestimonials } from '@/lib/data/home-testimonials';
import Hero from './_components/hero';
import LogoWall from './_components/logo-wall';
import PainSection from './_components/pain-section';
import Method from './_components/method';
import { TechStack } from '@/components/tech-stack/TechStack';
import CaseCards from './_components/case-cards';
import WallOfLove from './_components/wall-of-love';
import Differentiators from './_components/differentiators';
import { EngagementModel } from '@/components/engagement/EngagementModel';
import FinalCta from './_components/final-cta';
import Faq from './_components/faq';
import { InlineCTA } from '@/components/inline-cta/InlineCTA';
import JsonLd from '@/components/seo/JsonLd';
import { faqPageSchema } from '@/lib/seo';
import { homeFaqs } from '@/lib/data/home-faqs';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* Built from the same homeFaqs array the <Faq> section renders below. */}
      <JsonLd data={faqPageSchema(homeFaqs)} />
      <Hero />
      <LogoWall />
      <PainSection />
      <Method />
      <InlineCTA
        href="/contact?source=method"
        heading="Curious how this would work on your stack?"
        buttonLabel="Book a call"
      />
      <TechStack />
      <Differentiators />
      <CaseCards />
      <EngagementModel />
      <section className="section" id="testimonials">
        <div className="container">
          <header className="page-header page-header--center">
            <div className="eyebrow eyebrow--center">Voices</div>
            <h2 className="page-header__title">
              What teams say after they&apos;ve worked with us
            </h2>
          </header>
          <WallOfLove testimonials={homeTestimonials} />
        </div>
      </section>
      <InlineCTA
        href="/contact?source=testimonials"
        heading="Ready to join them?"
        buttonLabel="Book a call"
      />
      <FinalCta />
      <Faq />
    </>
  );
}
