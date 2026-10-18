import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitWords from './SplitWords';
import IceCreamBowl3D from './IceCreamBowl3D';

/**
 * Hero header v18: headline copy + the 3D ice-cream bowl side by side
 * (desktop: two columns; mobile: copy first, bowl right below it).
 * The text is visible immediately and only moves a few px with the mouse (pointer: fine, transform only).
 */
export default function DessertBrand({ brand, headline, sub, tone = 'falooda' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const zone = el.closest('.dz-hero') || el;
    const parts = [
      { node: el.querySelector('.dz-brand__name'), k: 6 },
      { node: el.querySelector('.dz-brand__title'), k: 12 },
      { node: el.querySelector('.dz-brand__sub'), k: 8 },
    ].filter((p) => p.node);
    const movers = parts.map((p) => ({ ...p, to: gsap.quickTo(p.node, 'y', { duration: 0.35, ease: 'power3.out' }) }));

    const onMove = (e) => {
      const r = zone.getBoundingClientRect();
      const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      movers.forEach((m) => m.to(ny * m.k));
    };
    const onLeave = () => movers.forEach((m) => m.to(0));

    zone.addEventListener('mousemove', onMove, { passive: true });
    zone.addEventListener('mouseleave', onLeave);
    return () => {
      zone.removeEventListener('mousemove', onMove);
      zone.removeEventListener('mouseleave', onLeave);
      parts.forEach((p) => gsap.set(p.node, { clearProps: 'transform' }));
    };
  }, [headline]);

  return (
    <header ref={ref} className="dz-brand">
      <div className="dz-brand__copy">
        <div className="dz-brand__name">
          <i className="dz-brand__line" aria-hidden="true" />
          <span>{brand}</span>
          <i className="dz-brand__line" aria-hidden="true" />
        </div>
        <SplitWords as="h2" className="dz-brand__title" text={headline} />
        <p className="dz-brand__sub">{sub}</p>
      </div>
      <div className="dz-brand__stage">
        <IceCreamBowl3D tone={tone} />
      </div>
    </header>
  );
}
