import Image from 'next/image';
import { homeLogos } from '@/lib/data/home-logos';

export default function LogoWall() {
  return (
    <section className="section logo-wall" aria-label="Clients">
      <div className="container">
        <p className="logo-wall__intro">
          From Seed rounds to unicorns. Here are a few teams we&apos;ve worked
          with.
        </p>
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
      </div>
    </section>
  );
}
