import Image from 'next/image';
import { homeLogos } from '@/lib/data/home-logos';

const CATEGORIES = ['B2B SaaS', 'Consumer SaaS', 'Web3', 'Fintech', 'D2C'];

export default function LogoWall() {
  return (
    <section className="section logo-wall" aria-label="Clients">
      <div className="container">
        <p className="logo-wall__intro">
          From Seed rounds to Series C. Here are a few teams we&apos;ve worked
          with.
        </p>

        {/* Categories — desktop renders the standard pill row; mobile
            renders an auto-scrolling marquee with a duplicated copy. */}
        <div className="logo-wall__categories">
          {CATEGORIES.map((c) => (
            <span key={c} className="logo-wall__category">
              {c}
            </span>
          ))}
        </div>

        <div
          className="logo-wall__categories-marquee"
          aria-hidden="true"
        >
          <div className="logo-wall__categories-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="logo-wall__categories-set"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {CATEGORIES.map((c) => (
                  <span
                    key={`${copy}-${c}`}
                    className="logo-wall__category"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Logos — desktop renders the static grid; mobile renders an
            auto-scrolling marquee with a duplicated copy. */}
        <div className="logo-wall__grid">
          {homeLogos.map((logo) => (
            <div key={logo.name} className="logo-wall__cell">
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="logo-wall__marquee" aria-hidden="true">
          <div className="logo-wall__marquee-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="logo-wall__marquee-set"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {homeLogos.map((logo) => (
                  <div
                    key={`${copy}-${logo.name}`}
                    className="logo-wall__cell"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
