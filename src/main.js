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

    const cloneLogo = (logo, hidden = false) => {
      const clone = logo.cloneNode(true);
      if (hidden) {
        clone.setAttribute('aria-hidden', 'true');
      } else {
        clone.removeAttribute('aria-hidden');
      }
      return clone;
    };

    track.textContent = '';

    baseSet.forEach((logo) => {
      track.appendChild(cloneLogo(logo));
    });

    while (track.scrollWidth < marquee.clientWidth) {
      baseSet.forEach((logo) => {
        track.appendChild(cloneLogo(logo, true));
      });
    }

    const cycleWidth = track.scrollWidth;
    Array.from(track.children).forEach((logo) => {
      track.appendChild(cloneLogo(logo, true));
    });

    const pixelsPerSecond = 80;
    const duration = Math.max(cycleWidth / pixelsPerSecond, 18);
    track.style.setProperty('--loop-distance', `${cycleWidth}px`);
    track.style.setProperty('--animation-duration', `${duration}s`);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureSeamlessLogoMarquee);
} else {
  ensureSeamlessLogoMarquee();
}
