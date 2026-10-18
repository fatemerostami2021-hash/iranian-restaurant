import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitWords from './SplitWords';


/**
 * DessertCanvas v17 — cinematic stage.
 *  - desktop: full-screen, full-bleed video (object-fit: cover); mobile: the copy sits on the video in a glass card
 *  - lower-third ad copy (both desserts always in the DOM for SEO, the active one reveals word-by-word)
 *  - a rotating three.js ice-cream bowl (GSAP turntable) on the opposite side
 *  - fast video: poster + webm / small mp4 / original sources, preload="auto"
 */
gsap.registerPlugin(ScrollTrigger);

// Lean faststart mp4s (muted, ~1 Mbps) — phones get the 720p one. ?v=3 busts the browser cache.
const VIDEO_DESKTOP = '/images/desserts/dessert-hero-1280.mp4?v=3';
const VIDEO_MOBILE = '/images/desserts/dessert-hero-720.mp4?v=3';
const DEFAULT_POSTER = '/images/desserts/dessert-poster.webp?v=3';
const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fromCopy = (c = {}) => ({ tag: '', name: c.name || '', tagline: c.blurb || '', chips: [] });

const DessertCanvas = forwardRef(function DessertCanvas(
  {
    className = '',
    videoSrc = '',
    poster = DEFAULT_POSTER,
    autoPlay = true,
    loop = true,
    muted = true,
    autoCycle = false,
    cycleIntervalMs = 12000,
    ad = null,
    ctaHref = '/menu',
    falooda = { name: '', alt: '', blurb: '' },
    bastani = { name: '', alt: '', blurb: '' },
    onReady,
    onActiveChange,
  },
  ref,
) {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const key = useRef('falooda');
  const revealed = useRef(false);
  const [active, setActive] = useState('falooda');
  const [sweep, setSweep] = useState(false);
  const [inView, setInView] = useState(false);
  const [src] = useState(() => (isMobile() ? VIDEO_MOBILE : VIDEO_DESKTOP));

  useEffect(() => { onActiveChange?.(active); }, [active, onActiveChange]);

  const items = {
    falooda: { ...fromCopy(falooda), ...(ad?.items?.falooda || {}) },
    bastani: { ...fromCopy(bastani), ...(ad?.items?.bastani || {}) },
  };

  const triggerSweep = useCallback(() => {
    setSweep(false);
    requestAnimationFrame(() => setSweep(true));
    setTimeout(() => setSweep(false), 1200);
  }, []);

  const choose = useCallback((k) => {
    if (k === key.current) return;
    key.current = k;
    setActive(k);
    triggerSweep();
  }, [triggerSweep]);

  useImperativeHandle(ref, () => ({
    setProgress(p) {
      if (hostRef.current) hostRef.current.style.setProperty('--dz-p', String(Math.min(1, Math.max(0, p))));
    },
    setKey(k) { if (k === 'falooda' || k === 'bastani') choose(k); },
    get key() { return key.current; },
  }), [choose]);

  /* ----- auto-cycle (restarts after a manual choice) ----- */
  useEffect(() => {
    if (!autoCycle) return undefined;
    const id = setInterval(() => {
      const next = key.current === 'falooda' ? 'bastani' : 'falooda';
      key.current = next;
      setActive(next);
      triggerSweep();
    }, cycleIntervalMs);
    return () => clearInterval(id);
  }, [autoCycle, cycleIntervalMs, triggerSweep, active]);

  /* ----- reveal trigger (plain, no scroll-scrubbing) ----- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    if (reduced()) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(host);
    const failsafe = setTimeout(() => setInView(true), 6000);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  /* ----- scroll-triggered: the video eases from a slight zoom to 1:1 as the stage enters (transform only, no layout shift) ----- */
  useEffect(() => {
    const host = hostRef.current;
    const v = videoRef.current;
    if (!host || !v || reduced()) return undefined;
    if (window.matchMedia('(max-width: 760px)').matches) return undefined; // mobile: never crop the wide video
    const ctx = gsap.context(() => {
      gsap.fromTo(
        v,
        { scale: 1.14 },
        {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: host, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        },
      );
    }, hostRef);
    return () => ctx.revert();
  }, []);

  /* ----- text: no reveal / no delay. It only moves up/down with the mouse (transform only) ----- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const stack = host.querySelector('.dz-ad__stack');
    const foot = host.querySelector('.dz-ad__foot');
    const targets = [
      { node: stack, k: -16 },
      { node: foot, k: -8 },
    ].filter((t) => t.node);
    const movers = targets.map((t) => ({ ...t, to: gsap.quickTo(t.node, 'y', { duration: 0.35, ease: 'power3.out' }) }));

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      movers.forEach((m) => m.to(ny * m.k));
    };
    const onLeave = () => movers.forEach((m) => m.to(0));

    host.addEventListener('mousemove', onMove, { passive: true });
    host.addEventListener('mouseleave', onLeave);
    return () => {
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      targets.forEach((t) => gsap.set(t.node, { clearProps: 'transform' }));
    };
  }, []);

  /* ----- play / pause the video ----- */
  useEffect(() => {
    const v = videoRef.current;
    const host = hostRef.current;
    if (!v || !host) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { v.play().catch(() => {}); onReady?.(true); } else { v.pause(); }
    }, { threshold: 0.1 });
    io.observe(host);
    return () => io.disconnect();
  }, [onReady]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const onVis = () => {
      if (document.hidden) v.pause();
      else if (hostRef.current) {
        const r = hostRef.current.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div
      ref={hostRef}
      className={`dz-canvas ${sweep ? 'is-sweeping' : ''} ${className}`}
      data-key={active}
      style={{ '--dz-cycle': `${cycleIntervalMs}ms` }}
    >
      <video
        ref={videoRef}
        className="dz-canvas__video"
        poster={poster}
        src={videoSrc || src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <div className="dz-canvas__scrim" aria-hidden="true" />
      <div className="dz-side" aria-hidden="true" />

      <div className="dz-ad">
        <div className="dz-ad__stack">
          {['falooda', 'bastani'].map((k) => {
            const it = items[k];
            return (
              <div
                key={k}
                className={`dz-ad__panel ${active === k ? 'is-active' : ''}`}
                data-tone={k}
                aria-hidden={active === k ? undefined : 'true'}
              >
                {it.tag && <span className="dz-ad__tag">{it.tag}</span>}
                <SplitWords as="h3" className="dz-ad__name" text={it.name} />
                <p className="dz-ad__tagline">{it.tagline}</p>
                {it.chips?.length > 0 && (
                  <ul className="dz-ad__chips">
                    {it.chips.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="dz-ad__foot">
          {ad?.cta && ctaHref && (
            <Link to={ctaHref} className="dz-ad__cta">
              <span>{ad.cta}</span>
              <svg className="dz-ad__arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          <div className="dz-ad__pager" role="group">
            {['falooda', 'bastani'].map((k) => (
              <button
                key={k}
                type="button"
                className={`dz-ad__dot ${active === k ? 'is-active' : ''}`}
                aria-label={items[k].name}
                aria-pressed={active === k}
                onClick={() => choose(k)}
              >
                <span className="dz-ad__line"><span className="dz-ad__bar" key={active === k ? `on-${active}` : 'off'} /></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dz-canvas__shimmer" aria-hidden="true" />
    </div>
  );
});

export default DessertCanvas;
