/**
 * Preload images in the background so they're cached before the user scrolls to them.
 * Uses requestIdleCallback (with setTimeout fallback) to avoid blocking the main thread.
 */
export function preloadImages(urls) {
  const load = () => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(load);
  } else {
    setTimeout(load, 200);
  }
}
