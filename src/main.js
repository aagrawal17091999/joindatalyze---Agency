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
    const initialLogos = Array.from(track.children);
    if (initialLogos.length < 2) return;

    const baseSet = initialLogos.slice(0, initialLogos.length / 2);
    const requiredWidth = marquee.clientWidth * 2.1;

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
