import { useEffect, useRef } from 'react';

export default function GalaxyFireBurst({ isDark = true }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let emberTimer = 0;
    let burstStarted = false;

    const FIRE_COLORS = ['#FFD700', '#FFA500', '#FF6B35', '#F9A825', '#D32F2F', '#FFF3C4'];
    const COSMIC_COLORS = ['#FFD700', '#FFFFFF', '#F9A825', '#FF8C42'];

    let burstParticles = [];
    let emberParticles = [];

    const centerX = () => width / 2;
    const centerY = () => height * 0.35;

    const initBurst = () => {
      if (burstStarted || width === 0 || height === 0) return;
      burstStarted = true;
      const BURST_COUNT = 100;
      for (let i = 0; i < BURST_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.5;
        const isStar = Math.random() < 0.35;
        burstParticles.push({
          x: centerX(),
          y: centerY(),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isStar ? 1 + Math.random() * 2 : 2.5 + Math.random() * 4,
          color: isStar
            ? COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)]
            : FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
          life: 0,
          maxLife: 60 + Math.random() * 50,
          glow: !isStar,
        });
      }
    };

    const spawnEmber = () => {
      if (width === 0 || height === 0) return;
      emberParticles.push({
        x: centerX() + (Math.random() - 0.5) * width * 0.6,
        y: height + 8,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.5 + Math.random() * 1.4),
        size: 2 + Math.random() * 3,
        color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
        life: 0,
        maxLife: 100 + Math.random() * 70,
        flicker: Math.random() * Math.PI * 2,
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      width = newWidth;
      height = newHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ResizeObserver برای زمانی که Modal باز می‌شه و ابعاد مشخص می‌شه
    const ro = new ResizeObserver(() => {
      resize();
      if (!burstStarted && width > 0 && height > 0) {
        initBurst();
      }
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // تاخیر اولیه برای اطمینان از باز شدن کامل Modal
    const startDelay = setTimeout(() => {
      resize();
      initBurst();
    }, 300);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      /* --- فاز ۱: انفجار --- */
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.life++;
        if (p.life > p.maxLife) {
          burstParticles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.965;
        p.vy *= 0.965;
        const alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(alpha, 0);
        if (p.glow) {
          ctx.shadowBlur = 16;
          ctx.shadowColor = p.color;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + 0.5 * alpha), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* --- فاز ۲: شعله شناور --- */
      emberTimer++;
      if (emberTimer > 4 && emberParticles.length < 30) {
        spawnEmber();
        emberTimer = 0;
      }

      for (let i = emberParticles.length - 1; i >= 0; i--) {
        const p = emberParticles[i];
        p.life++;
        if (p.life > p.maxLife) {
          emberParticles.splice(i, 1);
          continue;
        }
        p.flicker += 0.12;
        p.x += p.vx + Math.sin(p.flicker) * 0.25;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        const alpha = progress < 0.12 ? progress / 0.12 : 1 - (progress - 0.12) / 0.88;

        ctx.save();
        ctx.globalAlpha = Math.max(alpha * 0.9, 0);
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      clearTimeout(startDelay);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
}