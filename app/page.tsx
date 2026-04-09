import { homeTestimonials } from '@/lib/data/home-testimonials';
import Hero from './_components/hero';
import LogoWall from './_components/logo-wall';
import PainSection from './_components/pain-section';
import Method from './_components/method';
import CaseCards from './_components/case-cards';
import TestimonialCarousel from './_components/testimonial-carousel';
import Personas from './_components/personas';
import Differentiators from './_components/differentiators';
import FinalCta from './_components/final-cta';
import Faq from './_components/faq';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoWall />
      <PainSection />
      <Method />
      <CaseCards />
      <section className="section" id="testimonials">
        <div className="container">
          <header className="page-header page-header--center">
            <div className="eyebrow eyebrow--center">Voices</div>
            <h2 className="page-header__title">
              What teams say after they&apos;ve worked with us
            </h2>
          </header>
          <TestimonialCarousel testimonials={homeTestimonials} />
        </div>
      </section>
      <Personas />
      <Differentiators />
      <FinalCta />
      <Faq />
    </>
  );
}
