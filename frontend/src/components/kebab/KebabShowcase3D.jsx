import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './kebabShowcase.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * KebabShowcase3D — header of the home "menu wave" section: copy on one side, a scroll-driven 3D scene on the other.
 *
 * The real photo is split into layers (laptop+bowl, platter, escaping bits). In three.js each layer is a textured plane
 * at its own depth: as the user scrolls, the camera pulls back from the laptop screen, the glowing dish "leaves" the screen
 * along a 3D arc (with a golden trail), turns, grows and settles into the original photo composition, then steam rises.
 * One master GSAP timeline (ScrollTrigger, scrub) drives the copy AND the scene; idle motion lives on separate objects.
 *
 * Props: title, subtitle (already translated), lang ('fa'|'ar'|'en'), isRtl, isDark.
 * Files: /images/kebab/{laptop,platter,bits}.webp (+ kebab-scene.webp = static fallback). Missing layers are skipped.
 */
const BASE = '/images/kebab/';
const VER = '?v=1';
// original photo: 1674 x 940 px; layer boxes = [x, y, w, h] in that pixel space
const M = { W: 1674, H: 940, laptop: [52, 73, 808, 833], platter: [691, 286, 966, 640], bits: [807, 230, 105, 255] };
const U = 0.001; // 1 photo pixel = 0.001 world units
const px = (x, y) => [(x - M.W / 2) * U, -(y - M.H / 2) * U];
const centerOf = (b) => px(b[0] + b[2] / 2, b[1] + b[3] / 2);
const SCREEN = px(560, 330); // the glowing dish on the laptop screen

const COPY = {
  fa: { eyebrow: 'کباب داغ نان داغ', cta: 'مشاهده منو', alt: 'بشقاب کباب کوبیده ایرانی با گوجه کبابی، سیب‌زمینی و سبزی تازه — کباب داغ نان داغ، دوحه' },
  ar: { eyebrow: 'كباب داغ نان داغ', cta: 'عرض القائمة', alt: 'طبق كباب كوبيدة إيراني مع طماطم مشوية وبطاطس وأعشاب طازجة — كباب داغ نان داغ، الدوحة' },
  en: { eyebrow: 'Kabab Dagh Nan Dagh', cta: 'View Menu', alt: 'Persian koobideh kebab platter with grilled tomato, fries and fresh herbs — Kabab Dagh Nan Dagh, Doha' },
};
const initialState = () => ({ glow: 0, zoom: 0, bits: 0, plateA: 0, fly: 0, steam: 0, orbit: 0 });
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function KebabShowcase3D({ title = '', subtitle = '', lang = 'en', isRtl = false, isDark = true }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const S = useRef(initialState());
  const L = COPY[lang] || COPY.en;
  const words = useMemo(() => String(title).trim().split(/\s+/).filter(Boolean), [title]);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- master timeline: copy + scene state, scrubbed by scroll ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return undefined;
    Object.assign(S.current, initialState());
    const s = S.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 25%', scrub: 0.7 },
      });
      tl.from('.kb-eyebrow', { autoAlpha: 0, y: 18, duration: 1 }, 0)
        .from('.kb-w__i', { yPercent: 115, autoAlpha: 0, stagger: 0.12, duration: 1.4 }, 0.3)
        .from('.kb-sub', { autoAlpha: 0, y: 24, duration: 1.4 }, 1.6)
        .from('.kb-cta', { autoAlpha: 0, y: 24, duration: 1.2 }, 6.4)
        .to(s, { glow: 1, duration: 1.6 }, 0)
        .to(s, { zoom: 1, duration: 6.4, ease: 'power2.inOut' }, 0.4)
        .to(s, { bits: 1, duration: 3, ease: 'power2.out' }, 1.4)
        .to(s, { plateA: 1, duration: 1.4, ease: 'power1.out' }, 2.2)
        .to(s, { fly: 1, duration: 4.6, ease: 'power2.inOut' }, 2.2)
        .to(s, { glow: 0, duration: 2.4, ease: 'power1.in' }, 4.6)
        .to(s, { steam: 1, duration: 1.6 }, 7.2)
        .to(s, { orbit: 1, duration: 2.2, ease: 'sine.inOut' }, 7.8)
        .to({}, { duration: 0.001 }, 10);
    }, root);
    return () => ctx.revert();
  }, [reduce, words]);

  /* ---------- three.js scene (lazy: starts when the header is near the viewport) ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return undefined;
    let disposed = false;
    let cleanup = () => {};
    const lite = window.innerWidth < 760;

    const start = async () => {
      let THREE;
      try { THREE = await import('three'); } catch { return; }
      if (disposed || !canvasRef.current) return;

      const loader = new THREE.TextureLoader();
      const load = (name) => new Promise((res) => loader.load(`${BASE}${name}.webp${VER}`, res, undefined, () => res(null)));
      const [tLap, tPlate, tBits] = await Promise.all([load('laptop'), load('platter'), load('bits')]);
      const loaded = [tLap, tPlate, tBits].filter(Boolean);
      if (disposed || !tLap) { loaded.forEach((t) => t.dispose()); return; } // no base layer -> keep the static fallback

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      } catch { loaded.forEach((t) => t.dispose()); return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 30);
      const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());

      const mkPlane = (tex, box, order) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = maxAniso;
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(box[2] * U, box[3] * U), mat);
        mesh.renderOrder = order;
        return mesh;
      };
      const canvasTex = (draw, size = 128) => {
        const c = document.createElement('canvas'); c.width = c.height = size;
        draw(c.getContext('2d'), size);
        return new THREE.CanvasTexture(c);
      };
      const radial = (stops) => canvasTex((x, n) => {
        const g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        stops.forEach(([o, col]) => g.addColorStop(o, col));
        x.fillStyle = g; x.fillRect(0, 0, n, n);
      });

      /* laptop (+ olive bowl): the stage */
      const lapC = centerOf(M.laptop);
      const laptop = mkPlane(tLap, M.laptop, 0); laptop.position.set(lapC[0], lapC[1], 0);
      scene.add(laptop);

      /* bits that escape the screen: pivot at the screen, expand outward */
      let bitsGroup = null; let bitsMat = null;
      if (tBits) {
        bitsGroup = new THREE.Group(); bitsGroup.position.set(SCREEN[0], SCREEN[1], 0.03);
        const bm = mkPlane(tBits, M.bits, 1); const bc = centerOf(M.bits);
        bm.position.set(bc[0] - SCREEN[0], bc[1] - SCREEN[1], 0); bitsMat = bm.material;
        bitsGroup.add(bm); scene.add(bitsGroup);
      }

      /* platter: rig (scroll-driven transform) > idle (float) > plane */
      const plC = centerOf(M.platter);
      const rig = new THREE.Group(); const idle = new THREE.Group(); rig.add(idle); scene.add(rig);
      let plateMat = null;
      if (tPlate) { const pm = mkPlane(tPlate, M.platter, 2); plateMat = pm.material; idle.add(pm); }
      rig.visible = !!tPlate;

      /* glow on the screen, steam above the food, golden particles */
      const glowTex = radial([[0, 'rgba(255,196,90,.95)'], [0.4, 'rgba(255,150,40,.35)'], [1, 'rgba(255,120,20,0)']]);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, toneMapped: false }));
      glow.position.set(SCREEN[0], SCREEN[1], 0.03); glow.scale.set(0.95, 0.95, 1); glow.renderOrder = 1.5; scene.add(glow);

      const puffTex = radial([[0, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);
      const puffs = Array.from({ length: lite ? 3 : 5 }, (_, i) => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false }));
        sp.userData.ph = i / (lite ? 3 : 5); sp.renderOrder = 4; idle.add(sp); return sp;
      });

      const dotTex = radial([[0, 'rgba(255,255,255,1)'], [0.5, 'rgba(255,255,255,.45)'], [1, 'rgba(255,255,255,0)']]);
      const mkPoints = (n) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        const m = new THREE.PointsMaterial({ size: 0.03, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false });
        const p = new THREE.Points(g, m); p.frustumCulled = false; p.renderOrder = 5; scene.add(p); return p;
      };
      const NT = lite ? 22 : 44; const ND = lite ? 14 : 30;
      const trail = mkPoints(NT); const dust = mkPoints(ND);
      const rnd = (() => { let v = 11; return () => { v = (v * 16807) % 2147483647; return (v - 1) / 2147483646; }; })();
      const tp = Array.from({ length: NT }, () => ({ lag: rnd() * 0.34, jx: rnd() - 0.5, jy: rnd() - 0.5, jz: rnd() - 0.5, b: 0.5 + rnd() * 0.5 }));
      const dp = Array.from({ length: ND }, () => ({ x: lerp(-0.85, 0.95, rnd()), y: lerp(-0.42, 0.4, rnd()), z: rnd() * 0.3, ph: rnd(), sp: 0.015 + rnd() * 0.03, w: rnd() * 6.28 }));

      /* flight path of the platter (quadratic bezier with a lift toward the viewer) */
      const P0 = [SCREEN[0], SCREEN[1], 0.02]; const P2 = [plC[0], plC[1], 0];
      const P1 = [(P0[0] + P2[0]) / 2, Math.max(P0[1], P2[1]) + 0.34, 1.05];
      const bez = (t, k) => { const u = 1 - t; return u * u * P0[k] + 2 * u * t * P1[k] + t * t * P2[k]; };

      /* ---------- per-frame ---------- */
      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      const root = rootRef.current;
      const fine = window.matchMedia('(pointer: fine)').matches;
      const onMove = (e) => { const r = stage.getBoundingClientRect(); ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; };
      if (fine && root) { root.addEventListener('pointermove', onMove, { passive: true }); root.addEventListener('pointerleave', onLeave); }

      let camBase = 3.4;
      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.01 });
      io.observe(stage);

      const tick = (time) => {
        if (!visible || document.hidden) return;
        const s = S.current;
        ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;

        /* camera: pull back from the screen, then a slight orbit; pointer parallax */
        const dist = camBase * (0.64 + 0.36 * s.zoom);
        const cx = lerp(SCREEN[0] * 0.8, 0, s.zoom) + ptr.x * 0.03 + s.orbit * 0.05;
        const cy = lerp(SCREEN[1] * 0.8, 0, s.zoom) - ptr.y * 0.02;
        camera.position.set(cx, cy, dist);
        camera.lookAt(cx * 0.5, cy * 0.5, 0);

        laptop.rotation.y = Math.sin(time * 0.4) * 0.008;
        glow.material.opacity = s.glow * (0.6 + 0.15 * Math.sin(time * 2.2));

        if (bitsGroup) {
          bitsGroup.scale.setScalar(lerp(0.5, 1, s.bits));
          bitsMat.opacity = clamp01(s.bits * 1.2);
          bitsGroup.position.y = SCREEN[1] + Math.sin(time * 0.9) * 0.004;
        }

        const f = s.fly;
        if (plateMat) {
          rig.position.set(bez(f, 0), bez(f, 1), bez(f, 2));
          const k = 1 - f;
          rig.rotation.set(k * 0.55, -k * 0.6, k * 0.18);
          rig.scale.setScalar(0.32 + 0.68 * f);
          plateMat.opacity = s.plateA;
          idle.position.y = Math.sin(time * 1.1) * 0.004 * f;
          idle.rotation.z = Math.sin(time * 0.6) * 0.004 * f;
        }

        /* steam rises from the food once the platter has landed */
        puffs.forEach((sp) => {
          const life = (time * 0.2 + sp.userData.ph) % 1;
          sp.position.set(-0.085 + Math.sin(life * 5 + sp.userData.ph * 9) * 0.03, 0.04 + life * 0.3, 0.02);
          sp.scale.setScalar(0.1 + life * 0.22);
          sp.material.opacity = Math.sin(Math.PI * life) * 0.32 * s.steam;
        });

        /* golden trail behind the flying platter */
        const tPos = trail.geometry.attributes.position; const tCol = trail.geometry.attributes.color;
        const flight = Math.sin(Math.PI * clamp01(f));
        tp.forEach((p, i) => {
          const t = clamp01(f - p.lag);
          const spread = Math.sin(Math.PI * t) * 0.14;
          tPos.setXYZ(i, bez(t, 0) + p.jx * spread, bez(t, 1) + p.jy * spread, bez(t, 2) + p.jz * spread);
          const a = flight * p.b * (1 - p.lag * 1.4);
          tCol.setXYZ(i, 1 * a, 0.78 * a, 0.3 * a);
        });
        tPos.needsUpdate = true; tCol.needsUpdate = true;

        /* soft golden dust drifting through the scene */
        const dPos = dust.geometry.attributes.position; const dCol = dust.geometry.attributes.color;
        dp.forEach((p, i) => {
          const life = (time * p.sp + p.ph) % 1;
          dPos.setXYZ(i, p.x + Math.sin(time * 0.3 + p.w) * 0.04, p.y + life * 0.35, p.z);
          const a = Math.sin(Math.PI * life) * (0.3 + 0.4 * s.steam) * (0.4 + 0.6 * s.zoom);
          dCol.setXYZ(i, a, 0.78 * a, 0.3 * a);
        });
        dPos.needsUpdate = true; dCol.needsUpdate = true;

        renderer.render(scene, camera);
      };
      gsap.ticker.add(tick);

      const resize = () => {
        const w = stage.clientWidth; const h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        const t = Math.tan((camera.fov * Math.PI) / 360);
        const fitW = lite ? 1.66 : 1.78;
        camBase = Math.max(fitW / 2 / (t * camera.aspect), 1.02 / 2 / t);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage); resize();
      stage.classList.add('is-ready');

      cleanup = () => {
        gsap.ticker.remove(tick);
        io.disconnect(); ro.disconnect();
        root?.removeEventListener('pointermove', onMove); root?.removeEventListener('pointerleave', onLeave);
        scene.traverse((o) => {
          o.geometry?.dispose?.();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map?.dispose?.(); m.dispose(); });
        });
        renderer.dispose();
        stage.classList.remove('is-ready');
      };
    };

    const io0 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io0.disconnect(); { let started = false; const go = () => { if (started || disposed) return; started = true; start(); }; const later = () => setTimeout(go, 3500); window.addEventListener('scroll', go, { once: true, passive: true }); window.addEventListener('touchstart', go, { once: true, passive: true }); if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true }); } } }, { rootMargin: '400px' });
    io0.observe(stage);
    return () => { disposed = true; io0.disconnect(); cleanup(); };
  }, [reduce]);

  return (
    <div ref={rootRef} className={`kb-showcase ${isDark ? 'kb--dark' : 'kb--light'}`} dir={isRtl ? 'rtl' : 'ltr'} lang={lang}>
      <div className="kb-copy">
        <p className="kb-eyebrow">{L.eyebrow}</p>
        <h2 className="kb-title">
          {words.map((w, i) => (
            <span key={`${w}-${i}`}>
              <span className="kb-w"><span className="kb-w__i">{w}</span></span>{' '}
            </span>
          ))}
        </h2>
        {subtitle ? <p className="kb-sub">{subtitle}</p> : null}
        <Link to="/menu" className="kb-cta">
          <span>{L.cta}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <div ref={stageRef} className="kb-stage">
        <img className="kb-fallback" src={`${BASE}kebab-scene.webp${VER}`} alt={L.alt} width="1172" height="658" loading="lazy" decoding="async" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </div>
  );
}
