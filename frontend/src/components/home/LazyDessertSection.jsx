import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const loadSection = () => import('./DessertSection');
const DessertSection = lazy(loadSection);

// Same files DessertCanvas uses (never the 4MB dessert-hero.mp4)
const VIDEO_DESKTOP = '/images/desserts/dessert-hero-1280.mp4?v=3';
const POSTER = '/images/desserts/dessert-poster.webp?v=3';
const BG = '#1a0d10';
const STAGE_H = 'clamp(480px, 78svh, 760px)';

const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 761px)').matches;
const stageHeight = () => (isDesktop() ? 'clamp(480px, 86svh, 1000px)' : STAGE_H);
// Reserve the hero's height only until the real section replaces it (then the real height rules).
const reserve = () => ({ position: 'relative', minHeight: `calc(${stageHeight()} + 120px)` });

// Desktop only: warm the video bytes during idle time. On mobile nothing is fetched
// until the section is actually close to the screen.
let warmed = null;
const warmVideo = () => {
  if (warmed || typeof document === 'undefined' || !isDesktop()) return;
  const c = navigator.connection;
  if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return;
  warmed = document.createElement('video');
  warmed.preload = 'auto';
  warmed.muted = true;
  warmed.playsInline = true;
  warmed.src = VIDEO_DESKTOP;
  warmed.load();
};

// The poster is requested only once the section is near; before that it is a plain dark block.
function Skeleton({ box, withPoster }) {
  return (
    <div style={box}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', insetInline: 0, bottom: 0, height: stageHeight(),
          background: withPoster ? `url(${POSTER}) center / cover no-repeat, ${BG}` : BG,
        }}
      />
    </div>
  );
}

export default function LazyDessertSection() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [box] = useState(reserve);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // 1) desktop only: fetch JS + video during idle time
    let idleId; let timer;
    const prefetch = () => { loadSection().catch(() => {}); warmVideo(); };
    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(prefetch, { timeout: 1200 });
      else timer = setTimeout(prefetch, 800);
    };
    if (isDesktop()) {
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
    }

    // 2) mount it shortly before it is visible
    let io;
    if (typeof IntersectionObserver === 'undefined') setShow(true);
    else {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setShow(true); io.disconnect(); }
      }, { rootMargin: isDesktop() ? '1400px 0px' : '400px 0px' });
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
        <Suspense fallback={<Skeleton box={box} withPoster />}>
          <DessertSection />
        </Suspense>
      ) : (
        <Skeleton box={box} withPoster={false} />
      )}
    </div>
  );
}
