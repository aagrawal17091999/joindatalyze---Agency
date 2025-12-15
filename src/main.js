import './styles.css';

const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const trackBaseCache = new WeakMap();

const buildLogoTrack = (track, marqueeWidth) => {
  const getBaseSet = () => {
    if (trackBaseCache.has(track)) return trackBaseCache.get(track);

    const seen = new Set();
    const base = [];

    Array.from(track.querySelectorAll('img')).forEach((logo) => {
      const src = logo.getAttribute('src');
      if (!src || seen.has(src)) return;
      seen.add(src);
      base.push({ src, alt: logo.getAttribute('alt') || '' });
    });

    trackBaseCache.set(track, base);
    return base;
  };

  const baseSet = getBaseSet();
  if (baseSet.length === 0) return;

  const createLogo = (data, hidden = false) => {
    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.alt;
    if (hidden) {
      img.setAttribute('aria-hidden', 'true');
    }
    return img;
  };

  track.textContent = '';

  baseSet.forEach((data) => {
    track.appendChild(createLogo(data));
  });

  while (track.scrollWidth < marqueeWidth) {
    baseSet.forEach((data) => {
      track.appendChild(createLogo(data, true));
    });
  }

  const cycleWidth = track.scrollWidth;
  Array.from(track.children).forEach((logo) => {
    track.appendChild(logo.cloneNode(true));
  });

  const pixelsPerSecond = 80;
  const duration = Math.max(cycleWidth / pixelsPerSecond, 18);
  track.style.setProperty('--loop-distance', `${cycleWidth}px`);
  track.style.setProperty('--animation-duration', `${duration}s`);
};

const ensureSeamlessLogoMarquee = () => {
  const marquee = document.querySelector('.logo-marquee');
  if (!marquee) return;

  const marqueeWidth = marquee.clientWidth;
  marquee.querySelectorAll('.logo-track').forEach((track) => {
    buildLogoTrack(track, marqueeWidth);
  });
};

const debounce = (fn, delay = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const initLogoMarquee = () => {
  ensureSeamlessLogoMarquee();
  window.addEventListener('resize', debounce(ensureSeamlessLogoMarquee, 200));
};

if (document.readyState === 'complete') {
  initLogoMarquee();
} else {
  window.addEventListener('load', initLogoMarquee);
}
