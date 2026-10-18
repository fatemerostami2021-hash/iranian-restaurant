import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * IceCreamBowl3D v2 — cinematic, realistic dessert scene (three.js + GSAP, procedural, no external assets).
 *
 *  Scene: glass coupe with sauce-streaked filling, 3 creamy bumpy scoops with sauce caps + drips,
 *         whipped-cream swirl, wafer stick, cherry / saffron, toppings, an espresso cup with steam,
 *         a glossy ribbon of sauce orbiting the dessert, and fruit / beans / chunks on separate orbits.
 *  Motion: sequential assembly intro (starts when the stage is visible), idle orbit + gentle sway,
 *         scroll-driven camera dolly + ribbon spin, damped pointer parallax, flip/pop when the dessert changes.
 *  Props:  tone = 'falooda' | 'bastani'  (same as before — DessertCanvas.jsx needs no change)
 *  Perf:   three.js lazy-loaded, renders only while visible, lite mode on small screens,
 *          prefers-reduced-motion => single static frame, fails silently without WebGL.
 */
const PAL = {
  falooda: { scoops: ['#fff1f3', '#ffc3d3', '#fffaf5'], sauce: '#a80f2b', ribbon: '#b3122f', bits: '#d84a6b' },
  bastani: { scoops: ['#f2b936', '#fbe6b0', '#b4d08a'], sauce: '#a8631a', ribbon: '#c07a1f', bits: '#86ad4f' },
};

export default function IceCreamBowl3D({ tone }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const api = useRef(null);
  const toneRef = useRef(tone);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    let disposed = false;
    let cleanup = () => {};
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = window.innerWidth < 760;

    const start = async () => {
      let THREE;
      let RoomEnvironment;
      try {
        THREE = await import('three');
        ({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'));
      } catch { return; }
      if (disposed || !canvasRef.current) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      scene.add(new THREE.HemisphereLight(0xfff3e6, 0x2a1015, 0.5));
      const keyL = new THREE.DirectionalLight(0xfff0dc, 2.4); keyL.position.set(3, 6, 5); scene.add(keyL);
      const rimL = new THREE.DirectionalLight(0xffa070, 1.8); rimL.position.set(-5, 3, -3); scene.add(rimL);
      const fillL = new THREE.DirectionalLight(0xffd6e0, 0.5); fillL.position.set(-3, 1, 5); scene.add(fillL);

      const rnd = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
      const P = (o) => new THREE.MeshPhysicalMaterial(o);

      /* ---------- procedural textures ---------- */
      const mkCanvas = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
      const grainTex = () => {
        const c = mkCanvas(256); const x = c.getContext('2d');
        const img = x.createImageData(256, 256);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = 128 + (rnd() - 0.5) * 120;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
        }
        x.putImageData(img, 0, 0);
        const c2 = mkCanvas(256); const x2 = c2.getContext('2d');
        x2.filter = 'blur(1.2px)'; x2.drawImage(c, 0, 0);
        const t = new THREE.CanvasTexture(c2);
        t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
        return t;
      };
      const waferTex = () => {
        const c = mkCanvas(64, 128); const x = c.getContext('2d');
        x.fillStyle = '#e2b877'; x.fillRect(0, 0, 64, 128);
        x.strokeStyle = '#5a3418'; x.lineWidth = 9;
        for (let i = -64; i < 192; i += 22) { x.beginPath(); x.moveTo(0, i + 64); x.lineTo(64, i); x.stroke(); }
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      };
      const cremaTex = () => {
        const c = mkCanvas(128); const x = c.getContext('2d');
        const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
        g.addColorStop(0, '#3a1a0c'); g.addColorStop(0.35, '#8a4f24'); g.addColorStop(0.8, '#c98d4f'); g.addColorStop(1, '#6b3a1a');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,220,170,${0.05 + rnd() * 0.12})`; x.beginPath(); x.arc(rnd() * 128, rnd() * 128, 1 + rnd() * 2, 0, 7); x.fill(); }
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      };
      const puffTex = () => {
        const c = mkCanvas(64); const x = c.getContext('2d');
        const g = x.createRadialGradient(32, 32, 2, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      };
      const shadowTex = (() => {
        const c = mkCanvas(128); const x = c.getContext('2d');
        const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
        g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      })();
      const bump = grainTex();

      /* ---------- roots ---------- */
      const sundae = new THREE.Group();      // sways / flips
      const pop = new THREE.Group();         // scale pop on tone change
      pop.add(sundae);
      scene.add(pop);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.9, 48), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.002;
      scene.add(shadow);

      /* ---------- glass coupe ---------- */
      const prof = new THREE.SplineCurve([
        [0, 0], [0.78, 0], [0.8, 0.05], [0.62, 0.1], [0.2, 0.17], [0.13, 0.4], [0.13, 0.62],
        [0.24, 0.72], [0.65, 0.86], [1.05, 1.12], [1.22, 1.42], [1.26, 1.58],
      ].map(([x, y]) => new THREE.Vector2(x, y))).getPoints(60);
      const radiusAt = (y) => {
        for (let i = 1; i < prof.length; i++) {
          const a = prof[i - 1]; const b = prof[i];
          if ((a.y <= y && b.y >= y) || (b.y <= y && a.y >= y)) return a.x + (b.x - a.x) * ((y - a.y) / ((b.y - a.y) || 1));
        }
        return 1;
      };
      const glassMat = P({
        color: 0xffffff, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.3,
        envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.02, ior: 1.5, specularIntensity: 1,
        side: THREE.DoubleSide, depthWrite: false,
      });
      const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, lite ? 48 : 80), glassMat);
      glass.renderOrder = 3;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), glassMat);
      knob.position.y = 0.42; knob.scale.y = 0.7; knob.renderOrder = 3;
      const bowlG = new THREE.Group(); bowlG.add(glass, knob);
      sundae.add(bowlG);

      /* filling + sauce band visible through the glass */
      const fillMat = P({ color: 0xffffff, roughness: 0.6, sheen: 1, sheenRoughness: 0.5 });
      const sauceMat = P({ color: 0xffffff, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3 });
      const fillPts = [new THREE.Vector2(0, 0.8)];
      for (let y = 0.8; y <= 1.56; y += 0.07) fillPts.push(new THREE.Vector2(radiusAt(y) * 0.93, y));
      fillPts.push(new THREE.Vector2(0, 1.58));
      const filling = new THREE.Mesh(new THREE.LatheGeometry(fillPts, 64), fillMat);
      const bandPts = [];
      for (let y = 0.95; y <= 1.36; y += 0.05) bandPts.push(new THREE.Vector2(radiusAt(y) * 0.952, y));
      const bandGeo = new THREE.LatheGeometry(bandPts, 72);
      { const p = bandGeo.attributes.position; const v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          const a = Math.atan2(v.z, v.x); const k = 1 + 0.03 * Math.sin(a * 6 + v.y * 9) + 0.02 * Math.sin(a * 11 - v.y * 5);
          p.setXYZ(i, v.x * k, v.y, v.z * k);
        }
        bandGeo.computeVertexNormals(); }
      const band = new THREE.Mesh(bandGeo, sauceMat);
      sundae.add(filling, band);

      /* ---------- scoops ---------- */
      const mkScoopGeo = (r) => {
        const g = new THREE.IcosahedronGeometry(r, lite ? 4 : 5);
        const p = g.attributes.position; const v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          const d = v.clone().normalize();
          const k = 1 + 0.035 * (Math.sin(d.x * 8 + d.y * 6 + d.z * 4) + 0.7 * Math.sin(d.z * 11 - d.y * 9 + 1.3));
          const squash = d.y < -0.35 ? 0.9 : 1;
          p.setXYZ(i, v.x * k, v.y * k * squash, v.z * k);
        }
        g.computeVertexNormals();
        return g;
      };
      const mkRuffle = (r) => {
        const g = new THREE.TorusGeometry(r * 0.8, r * 0.15, 14, 56); g.rotateX(Math.PI / 2);
        const p = g.attributes.position; const v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          const a = Math.atan2(v.z, v.x); const k = 1 + 0.07 * Math.sin(a * 17);
          p.setXYZ(i, v.x * k, v.y + 0.025 * Math.sin(a * 13), v.z * k);
        }
        g.computeVertexNormals();
        return g;
      };
      const bitsMat = P({ color: 0xffffff, roughness: 0.55 });
      const bitGeo = new THREE.BoxGeometry(0.085, 0.05, 0.07);
      const dummy = new THREE.Object3D();
      const scoopDefs = [
        { r: 0.56, pos: [-0.6, 1.8, 0.12] },
        { r: 0.56, pos: [0.6, 1.8, 0.12] },
        { r: 0.56, pos: [0, 1.82, -0.52] },
      ];
      const scoopMats = [];
      const scoopGroups = [];
      const bitMeshes = [];
      scoopDefs.forEach((d, si) => {
        const mat = P({ color: 0xffffff, roughness: 0.62, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xffffff), bumpMap: bump, bumpScale: 2.2 });
        scoopMats.push(mat);
        const g = new THREE.Group(); g.position.set(...d.pos);
        g.add(new THREE.Mesh(mkScoopGeo(d.r), mat));
        const ruffle = new THREE.Mesh(mkRuffle(d.r), mat); ruffle.position.y = -d.r * 0.55; g.add(ruffle);
        g.add(new THREE.Mesh(new THREE.SphereGeometry(d.r * 1.045, 40, 20, 0, Math.PI * 2, 0, 0.78), sauceMat));
        for (let i = 0; i < 8; i++) {
          const th = (i / 8) * Math.PI * 2 + rnd() * 0.5; const ph = 0.62 + rnd() * 0.36;
          const n = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
          const down = new THREE.Vector3(0, -1, 0); down.addScaledVector(n, -down.dot(n)).normalize();
          const len = 0.16 + rnd() * 0.36;
          const dr = new THREE.Mesh(new THREE.CapsuleGeometry(0.03 + rnd() * 0.014, len, 5, 10), sauceMat);
          dr.position.copy(n).multiplyScalar(d.r * 1.03).addScaledVector(down, len / 2).addScaledVector(n, -(len * len) / (10 * d.r));
          dr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), down);
          g.add(dr);
        }
        const bm = new THREE.InstancedMesh(bitGeo, bitsMat, 12);
        for (let i = 0; i < 12; i++) {
          const dir = new THREE.Vector3(rnd() - 0.5, rnd() * 0.8 + 0.2, rnd() - 0.5).normalize();
          dummy.position.copy(dir).multiplyScalar(d.r * 1.06);
          dummy.lookAt(dummy.position.clone().add(dir)); dummy.rotateZ(rnd() * 3);
          dummy.scale.setScalar(0.7 + rnd() * 0.8); dummy.updateMatrix(); bm.setMatrixAt(i, dummy.matrix);
        }
        g.add(bm); bitMeshes.push(bm);
        sundae.add(g); scoopGroups.push(g);
        void si;
      });

      /* ---------- whipped cream, wafer, cherry, saffron ---------- */
      const creamMat = P({ color: 0xfffaf2, roughness: 0.5, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xffffff) });
      const creamG = new THREE.Group(); creamG.position.y = 0;
      const helix = new THREE.CatmullRomCurve3(Array.from({ length: 90 }, (_, i) => {
        const t = i / 89; const a = t * Math.PI * 2 * 3;
        const rad = 0.52 * (1 - t * 0.86) + 0.04;
        return new THREE.Vector3(Math.cos(a) * rad, 2.18 + t * 0.62, Math.sin(a) * rad);
      }));
      creamG.add(new THREE.Mesh(new THREE.TubeGeometry(helix, 140, 0.13, 12, false), creamMat));
      const creamCore = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.55, 24), creamMat); creamCore.position.y = 2.42;
      creamG.add(creamCore);
      sundae.add(creamG);

      const wafer = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.05, 16), P({ map: waferTex(), roughness: 0.6 }));
      wafer.position.set(0.32, 2.85, 0.05); wafer.rotation.set(0.15, 0, -0.5);
      sundae.add(wafer);

      const falGroup = new THREE.Group();
      const cherryMat = P({ color: 0x8f0a22, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
      const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24), cherryMat);
      const stemC = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(0.06, 0.38, 0), new THREE.Vector3(0.2, 0.58, 0)]);
      const stem = new THREE.Mesh(new THREE.TubeGeometry(stemC, 12, 0.01, 6), P({ color: 0x5a6b2a, roughness: 0.6 }));
      falGroup.add(cherry, stem); falGroup.position.set(-0.12, 2.95, 0.05);
      sundae.add(falGroup);

      const basGroup = new THREE.Group();
      const strandMat = P({ color: 0xe0541a, emissive: 0x4a1a00, roughness: 0.45 });
      for (let i = 0; i < 12; i++) {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.32, 6), strandMat);
        s.position.set((rnd() - 0.5) * 0.4, 0.0 + rnd() * 0.05, (rnd() - 0.5) * 0.4);
        s.rotation.set(rnd() * 1.4, rnd() * 3, rnd() * 1.4); basGroup.add(s);
      }
      basGroup.position.set(0, 2.88, 0); sundae.add(basGroup);

      /* ---------- espresso cup ---------- */
      const cupWrap = new THREE.Group(); cupWrap.position.set(1.75, 0.95, 1.0);
      const cupG = new THREE.Group(); cupWrap.add(cupG);
      const porc = P({ color: 0xfafaf7, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide });
      const cupPts = [[0, 0], [0.22, 0], [0.3, 0.04], [0.4, 0.2], [0.46, 0.42], [0.47, 0.5], [0.43, 0.5], [0.4, 0.42], [0.34, 0.14], [0, 0.1]].map(([x, y]) => new THREE.Vector2(x, y));
      cupG.add(new THREE.Mesh(new THREE.LatheGeometry(cupPts, 56), porc));
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 12, 28, Math.PI * 1.5), porc);
      handle.position.set(0.5, 0.32, 0); handle.rotation.z = -0.75 * Math.PI; cupG.add(handle);
      const saucerPts = [[0, -0.02], [0.5, -0.02], [0.78, 0.05], [0.81, 0.08], [0.77, 0.08], [0.5, 0.03], [0.4, 0.03], [0, 0.03]].map(([x, y]) => new THREE.Vector2(x, y));
      const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerPts, 56), porc); saucer.position.y = -0.04; cupG.add(saucer);
      const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.41, 40), P({ map: cremaTex(), roughness: 0.3, clearcoat: 0.6 }));
      coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.43; cupG.add(coffee);
      const beanMat = P({ color: 0x3b2216, roughness: 0.35, clearcoat: 0.4 });
      const beanGeo = new THREE.SphereGeometry(0.09, 16, 12);
      const grooveGeo = new THREE.BoxGeometry(0.014, 0.02, 0.2);
      const grooveMat = new THREE.MeshStandardMaterial({ color: 0x120804, roughness: 0.6 });
      const mkBean = () => {
        const g = new THREE.Group();
        const b = new THREE.Mesh(beanGeo, beanMat); b.scale.set(1, 0.72, 1.35);
        const gr = new THREE.Mesh(grooveGeo, grooveMat); gr.position.y = 0.062; g.add(b, gr);
        return g;
      };
      [[0.55, 0.45], [0.62, -0.3], [-0.6, 0.35], [-0.2, 0.7]].forEach(([x, z], i) => {
        const b = mkBean(); b.scale.setScalar(0.7); b.position.set(x * 0.9, 0.08, z * 0.9); b.rotation.y = i * 1.7; cupG.add(b);
      });
      const puff = puffTex();
      const puffs = Array.from({ length: 6 }, (_, i) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 }));
        s.userData.ph = i / 6; cupG.add(s); return s;
      });
      scene.add(cupWrap);

      /* ---------- glossy sauce ribbon ---------- */
      const ribbonMat = P({ color: 0xffffff, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.5, side: THREE.DoubleSide });
      const ribbonGeo = (() => {
        const N = lite ? 160 : 260; const pos = []; const idx = [];
        const pts = []; const tw = [];
        for (let i = 0; i <= N; i++) {
          const t = i / N; const a = t * Math.PI * 2 * 1.35 + 0.4;
          const r = 2.6 + 0.28 * Math.sin(t * Math.PI * 3);
          pts.push(new THREE.Vector3(Math.cos(a) * r, 0.55 + t * 1.9 + 0.35 * Math.sin(t * Math.PI * 4), Math.sin(a) * r * 0.82));
          tw.push(0.6 + Math.sin(t * 6) * 0.9);
        }
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const T = pts[Math.min(i + 1, N)].clone().sub(pts[Math.max(i - 1, 0)]).normalize();
          const U = new THREE.Vector3(0, 1, 0);
          const B = U.clone().addScaledVector(T, -U.dot(T)).normalize();
          const Nn = new THREE.Vector3().crossVectors(T, B);
          const W = B.multiplyScalar(Math.cos(tw[i])).addScaledVector(Nn, Math.sin(tw[i]));
          const w = 0.06 + 0.5 * Math.pow(Math.sin(Math.PI * t), 0.7);
          const a = pts[i].clone().addScaledVector(W, w / 2); const b = pts[i].clone().addScaledVector(W, -w / 2);
          pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
          if (i < N) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        return g;
      })();
      const ribbonTilt = new THREE.Group(); ribbonTilt.rotation.set(0.14, 0, -0.08);
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonTilt.add(ribbon); scene.add(ribbonTilt);

      /* ---------- orbiting ingredients ---------- */
      const orbitG = new THREE.Group(); scene.add(orbitG);
      const orbs = [];
      const addOrb = (mesh, o) => {
        const holder = new THREE.Group(); holder.add(mesh); orbitG.add(holder);
        orbs.push({ holder, mesh, rad: 2.7, y: 1.4, bob: 0.12, bf: 0.9, speed: 0.2, phase: rnd() * 6.28, sx: 0.5, sy: 0.7, sz: 0.3, k: 1, ...o });
      };
      const berryMat = P({ color: 0xd4122e, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.15 });
      const leafMat = P({ color: 0x3f8a32, roughness: 0.55 });
      const berryGeo = new THREE.LatheGeometry([[0, -0.22], [0.1, -0.17], [0.17, -0.03], [0.19, 0.08], [0.15, 0.17], [0, 0.2]].map(([x, y]) => new THREE.Vector2(x, y)), 24);
      const calyx = new THREE.ConeGeometry(0.11, 0.07, 7);
      const chocMat = P({ color: 0x3a1d12, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.2 });
      const chocGeo = new THREE.BoxGeometry(0.3, 0.13, 0.22);
      const bananaMat = P({ color: 0xf3e2a9, roughness: 0.6, sheen: 0.5 });
      const bananaGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.08, 36);
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0); leafShape.bezierCurveTo(0.35, 0.1, 0.35, 0.6, 0, 0.9); leafShape.bezierCurveTo(-0.35, 0.6, -0.35, 0.1, 0, 0);
      const leafGeo = new THREE.ShapeGeometry(leafShape, 12); leafGeo.scale(0.3, 0.3, 0.3);
      const cherryGeo = new THREE.SphereGeometry(0.13, 24, 18);
      const cherryStemGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0.05, 0.3, 0), new THREE.Vector3(0.15, 0.45, 0)]), 8, 0.007, 5);
      const stemMat = P({ color: 0x5a6b2a, roughness: 0.6 });

      const nBeans = lite ? 5 : 9;
      for (let i = 0; i < nBeans; i++) addOrb(mkBean(), { rad: 2.9 + rnd() * 0.5, y: 0.5 + rnd() * 2.6, speed: (0.14 + rnd() * 0.12) * (i % 2 ? 1 : -1), sx: 1 + rnd(), sy: 0.8 + rnd(), sz: rnd() });
      for (let i = 0; i < (lite ? 2 : 4); i++) addOrb(new THREE.Mesh(chocGeo, chocMat), { rad: 2.75 + rnd() * 0.4, y: 0.8 + rnd() * 2, speed: 0.12 + rnd() * 0.08, sx: 0.4, sy: 0.6, sz: 0.5 });
      for (let i = 0; i < 3; i++) {
        const g = new THREE.Group(); g.add(new THREE.Mesh(berryGeo, berryMat));
        const c = new THREE.Mesh(calyx, leafMat); c.position.y = 0.2; g.add(c);
        addOrb(g, { rad: 2.8 + rnd() * 0.3, y: 0.9 + i * 0.8, speed: 0.16 + rnd() * 0.05, sx: 0.4, sy: 0.9, sz: 0.2 });
      }
      for (let i = 0; i < 2; i++) {
        const g = new THREE.Group(); g.add(new THREE.Mesh(cherryGeo, cherryMat), new THREE.Mesh(cherryStemGeo, stemMat));
        addOrb(g, { rad: 2.95, y: 0.7 + i * 1.6, speed: -0.17, sx: 0.5, sy: 0.6, sz: 0.4 });
      }
      for (let i = 0; i < 3; i++) addOrb(new THREE.Mesh(bananaGeo, bananaMat), { rad: 2.85 + rnd() * 0.3, y: 1 + i * 0.7, speed: 0.13 + rnd() * 0.05, sx: 0.6, sy: 0.4, sz: 0.5 });
      for (let i = 0; i < 3; i++) addOrb(new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x4f9a3a, roughness: 0.55, side: THREE.DoubleSide })), { rad: 2.9 + rnd() * 0.3, y: 1.2 + i * 0.6, speed: -(0.12 + rnd() * 0.05), sx: 0.3, sy: 0.5, sz: 0.25 });

      const NDROP = lite ? 10 : 20;
      const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 12, 10), sauceMat, NDROP);
      const dropP = Array.from({ length: NDROP }, () => ({ a: rnd() * 6.28, r: 2.2 + rnd() * 1.1, y: 0.4 + rnd() * 2.6, s: 0.1 + rnd() * 0.15, sc: 0.6 + rnd() * 1.2 }));
      scene.add(drops);

      /* ---------- tone ---------- */
      const setTone = (k, animate) => {
        const p = PAL[k] || PAL.falooda;
        const to = (color, hex, dur = 0.8) => {
          const c = new THREE.Color(hex);
          if (animate) gsap.to(color, { r: c.r, g: c.g, b: c.b, duration: dur, ease: 'power2.out' }); else color.copy(c);
        };
        scoopMats.forEach((m, i) => to(m.color, p.scoops[i]));
        to(fillMat.color, p.scoops[1]); to(creamMat.color, k === 'falooda' ? '#fff6f2' : '#fffaf0');
        to(sauceMat.color, p.sauce); to(ribbonMat.color, p.ribbon); to(bitsMat.color, p.bits);
        const f = k === 'falooda' ? 1 : 0.0001; const b = k === 'bastani' ? 1 : 0.0001;
        if (animate) {
          gsap.to(falGroup.scale, { x: f, y: f, z: f, duration: 0.7, ease: 'back.out(2)' });
          gsap.to(basGroup.scale, { x: b, y: b, z: b, duration: 0.7, ease: 'back.out(2)' });
        } else { falGroup.scale.setScalar(f); basGroup.scale.setScalar(b); }
      };
      setTone(toneRef.current, false);

      /* ---------- motion ---------- */
      const state = { sp: 0, burst: 0, ribbonIn: 0 };
      const host = wrap.closest('.dz-canvas') || wrap;
      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      let camDist = 9;
      let scrollTween = null;
      let intro = null;
      let played = false;

      if (!reduce) {
        scrollTween = gsap.to(state, {
          sp: 1, ease: 'none',
          scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
        intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        intro.from(glassMat, { opacity: 0, duration: 1.1 }, 0)
          .from(bowlG.position, { y: 1.4, duration: 1.4 }, 0)
          .from(ribbon.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1.9, ease: 'power2.out' }, 0.1)
          .from(state, { ribbonIn: -1.8, duration: 2.4 }, 0.1)
          .from(filling.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.7 }, 0.7)
          .from(band.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.7 }, 0.9);
        scoopGroups.forEach((g, i) => {
          intro.from(g.position, { y: g.position.y + 3.2, duration: 1.2, ease: 'bounce.out' }, 0.8 + i * 0.22);
          intro.from(g.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 0.8 }, 0.8 + i * 0.22);
        });
        intro.from(creamG.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.9, ease: 'back.out(1.8)' }, 1.9)
          .from(wafer.position, { y: wafer.position.y + 1.6, duration: 0.9, ease: 'back.out(1.4)' }, 2.2)
          .from(wafer.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5 }, 2.2)
          .from(falGroup.position, { y: falGroup.position.y + 1.4, duration: 0.9, ease: 'bounce.out' }, 2.4)
          .from(cupWrap.position, { x: 5.5, duration: 1.7 }, 1.4)
          .from(cupWrap.rotation, { y: -1.3, z: 0.4, duration: 1.7 }, 1.4);
        bitMeshes.forEach((m) => intro.from(m.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.6, ease: 'back.out(2)' }, 2.4));
        orbs.forEach((o, i) => intro.from(o.mesh.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.8, ease: 'back.out(2)' }, 1.2 + i * 0.05));
      } else {
        sundae.rotation.y = 0.25;
      }

      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (e.isIntersecting && intro && !played) { played = true; intro.play(); }
      }, { threshold: 0.25 });
      io.observe(wrap);

      const onMove = (e) => {
        const r = host.getBoundingClientRect();
        ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; };
      const fine = window.matchMedia('(pointer: fine)').matches;
      if (fine && !reduce) { host.addEventListener('pointermove', onMove, { passive: true }); host.addEventListener('pointerleave', onLeave); }

      const render = () => renderer.render(scene, camera);
      const lookAt = new THREE.Vector3(0.2, 1.55, 0);
      const placeCamera = () => {
        camera.position.set(ptr.x * 0.55, 2.3 - ptr.y * 0.3, camDist * (1 - 0.1 * state.sp));
        camera.lookAt(lookAt);
      };

      const tick = (time) => {
        if (!visible || document.hidden || reduce) return;
        ptr.x += (ptr.tx - ptr.x) * 0.05; ptr.y += (ptr.ty - ptr.y) * 0.05;
        sundae.rotation.y = Math.sin(time * 0.45) * 0.32 + state.burst + state.sp * 0.5;
        sundae.rotation.x = Math.sin(time * 0.8) * 0.015;
        sundae.position.y = Math.sin(time * 1.1) * 0.04;
        ribbon.rotation.y = time * 0.13 + state.sp * 1.2 + state.ribbonIn;
        ribbonTilt.position.y = Math.sin(time * 0.7) * 0.06;
        orbs.forEach((o) => {
          const a = o.phase + time * o.speed + state.sp * o.k * 0.8;
          o.holder.position.set(Math.cos(a) * o.rad, o.y + Math.sin(time * o.bf + o.phase) * o.bob, Math.sin(a) * o.rad * 0.78);
          o.mesh.rotation.set(time * o.sx + o.phase, time * o.sy, time * o.sz);
        });
        dropP.forEach((d, i) => {
          const a = d.a + time * d.s;
          dummy.position.set(Math.cos(a) * d.r, d.y + Math.sin(time * 1.3 + i) * 0.15, Math.sin(a) * d.r * 0.78);
          dummy.rotation.set(0, 0, 0); dummy.scale.set(d.sc, d.sc * (1 + 0.5 * Math.abs(Math.sin(time * 2 + i))), d.sc); dummy.updateMatrix();
          drops.setMatrixAt(i, dummy.matrix);
        });
        drops.instanceMatrix.needsUpdate = true;
        cupWrap.position.y = 0.95 + Math.sin(time * 0.9 + 1) * 0.06;
        cupG.rotation.z = Math.sin(time * 0.6) * 0.04;
        puffs.forEach((s) => {
          const life = (time * 0.22 + s.userData.ph) % 1;
          s.position.set(Math.sin(life * 5 + s.userData.ph * 9) * 0.1, 0.5 + life * 1.1, 0.02);
          s.scale.setScalar(0.3 + life * 0.7); s.material.opacity = Math.sin(Math.PI * life) * 0.3;
        });
        placeCamera();
        render();
      };
      gsap.ticker.add(tick);

      const resize = () => {
        const w = wrap.clientWidth; const h = wrap.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        const t = Math.tan((camera.fov * Math.PI) / 360);
        const needW = lite ? 6.2 : 7.6; const needH = lite ? 4.4 : 5.0;
        camDist = Math.max((needW / 2) / (t * camera.aspect), (needH / 2) / t);
        placeCamera();
        render();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();
      wrap.classList.add('is-ready');

      api.current = {
        setTone(k) {
          setTone(k, true);
          if (reduce) { render(); return; }
          gsap.fromTo(state, { burst: -Math.PI * 1.1 }, { burst: 0, duration: 1.4, ease: 'power3.out' });
          gsap.fromTo(pop.scale, { x: 0.82, y: 0.82, z: 0.82 }, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'back.out(2)' });
        },
      };

      cleanup = () => {
        api.current = null;
        gsap.ticker.remove(tick);
        intro?.kill(); scrollTween?.scrollTrigger?.kill(); scrollTween?.kill();
        gsap.killTweensOf(state);
        io.disconnect(); ro.disconnect();
        host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave);
        scene.traverse((o) => {
          gsap.killTweensOf([o, o.position, o.rotation, o.scale]);
          o.geometry?.dispose?.(); o.dispose?.();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            gsap.killTweensOf([m, m.color]);
            m.map?.dispose?.(); m.bumpMap?.dispose?.(); m.dispose();
          });
        });
        shadowTex.dispose(); bump.dispose(); envTex.dispose(); pmrem.dispose(); renderer.dispose();
        wrap.classList.remove('is-ready');
      };
    };

    // load three.js only when the stage is near the viewport
    const io0 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io0.disconnect(); start(); }
    }, { rootMargin: '400px' });
    io0.observe(wrap);

    return () => { disposed = true; io0.disconnect(); cleanup(); };
  }, []);

  useEffect(() => {
    toneRef.current = tone;
    api.current?.setTone(tone);
  }, [tone]);

  return (
    <div ref={wrapRef} className="dz-bowl" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
