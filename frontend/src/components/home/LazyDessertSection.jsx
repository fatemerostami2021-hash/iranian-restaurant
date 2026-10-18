import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const loadSection = () => import('./DessertSection');

// Warm the video's bytes during idle time (hidden, muted element) so the real <video>
// finds them in the browser cache and the poster is only on screen for a moment.
const VIDEO_URL = '/images/desserts/dessert-hero.mp4?v=2';
let warmed = null;
const warmVideo = () => {
  if (warmed || typeof document === 'undefined') return;
  const c = navigator.connection;
  if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return;
  warmed = document.createElement('video');
  warmed.preload = 'auto';
  warmed.muted = true;
  warmed.playsInline = true;
  warmed.src = VIDEO_URL;
  warmed.load();
};
const DessertSection = lazy(loadSection);

const POSTER = '/images/desserts/dessert-poster.webp?v=3';
const STAGE_H = 'clamp(480px, 78svh, 760px)';
const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 761px)').matches;
const stageHeight = () => (isDesktop() ? 'clamp(480px, 86svh, 1000px)' : STAGE_H);
// Reserve the hero's height only until the real section replaces it (then the real height rules).
const reserve = () => ({ position: 'relative', minHeight: `calc(${stageHeight()} + 120px)` });

// Shown instantly (tiny poster), so the area is never blank while the section loads.
function Skeleton({ box }) {
  return (
    <div style={box}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', insetInline: 0, bottom: 0, height: stageHeight(),
          background: `url(${POSTER}) center / cover no-repeat, #1a0d10`,
        }}
      />
    </div>
  );
}

/**
 * Loads the dessert section's code during idle time (no video, no three.js yet),
 * and mounts it ~1400px before it scrolls into view, so it is ready on arrival.
 */
export default function LazyDessertSection() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [box] = useState(reserve);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // 1) fetch the section's JS during idle time
    let idleId; let timer;
    const prefetch = () => { loadSection().catch(() => {}); warmVideo(); };
    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(prefetch, { timeout: 1200 });
      else timer = setTimeout(prefetch, 800);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    // 2) mount it well before it is visible
    let io;
    if (typeof IntersectionObserver === 'undefined') setShow(true);
    else {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setShow(true); io.disconnect(); }
      }, { rootMargin: '1400px 0px' });
      io.observe(el);
    }

    return () => {
      window.removeEventListener('load', schedule);
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<Skeleton box={box} />}>
          <DessertSection />
        </Suspense>
      ) : (
        <Skeleton box={box} />
      )}
    </div>
  );
}
