import './styles.css';

const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const ensureSeamlessLogoMarquee = () => {
  const marquee = document.querySelector('.logo-marquee');
  if (!marquee) return;

  const tracks = marquee.querySelectorAll('.logo-track');

  tracks.forEach((track) => {
    const existingLogos = Array.from(track.children);
    if (existingLogos.length === 0) return;

    const seen = new Set();
    const baseSet = [];

    existingLogos.forEach((logo) => {
      const key = logo.getAttribute('src');
      if (seen.has(key)) return;
      seen.add(key);
      baseSet.push(logo.cloneNode(true));
    });

    track.replaceChildren(...baseSet.map((logo) => logo.cloneNode(true)));

    const requiredWidth = marquee.clientWidth * 3;
    while (track.scrollWidth < requiredWidth) {
      baseSet.forEach((logo) => {
        const clone = logo.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureSeamlessLogoMarquee);
} else {
  ensureSeamlessLogoMarquee();
}
