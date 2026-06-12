"use client";

import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any;

const A = (a: number) => `rgba(251,191,36,${a})`;   // amber
const V = (a: number) => `rgba(167,139,250,${a})`;   // violet accent

interface Runner { x: number; speed: number; phase: number; }
interface FloatItem { x: number; y: number; vy: number; vx: number; sz: number; alpha: number; }
interface Particle { x: number; y: number; vx: number; vy: number; r: number; alpha: number; }

export default function LearningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: Ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;
    let W = 0, H = 0;

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    /* ── Runners ── */
    const runners: Runner[] = [
      { x: 0,   speed: 1.3,  phase: 0           },
      { x: 0,   speed: 0.95, phase: Math.PI * 0.7 },
      { x: 0,   speed: 1.65, phase: Math.PI * 1.4 },
    ];

    /* ── Floating books ── */
    const books: FloatItem[] = [
      { x: 0, y: 0, vy: -0.22, vx:  0.07, sz: 14, alpha: 0.32 },
      { x: 0, y: 0, vy: -0.17, vx: -0.05, sz: 11, alpha: 0.26 },
      { x: 0, y: 0, vy: -0.28, vx:  0.09, sz: 16, alpha: 0.34 },
    ];

    /* ── Floating grad-caps ── */
    const caps: FloatItem[] = [
      { x: 0, y: 0, vy: -0.19, vx:  0.06, sz: 12, alpha: 0.28 },
      { x: 0, y: 0, vy: -0.14, vx: -0.07, sz:  9, alpha: 0.22 },
    ];

    /* ── Particles ── */
    const particles: Particle[] = Array.from({ length: 22 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, r: 0, alpha: 0,
    }));

    /* ── Init positions after first sync ── */
    const initPositions = () => {
      if (!W || !H) return;
      runners[0].x = W * 0.05;
      runners[1].x = W * 0.42;
      runners[2].x = W * 0.72;

      books[0].x = W * 0.16; books[0].y = H * 0.62;
      books[1].x = W * 0.52; books[1].y = H * 0.45;
      books[2].x = W * 0.83; books[2].y = H * 0.55;

      caps[0].x = W * 0.33; caps[0].y = H * 0.38;
      caps[1].x = W * 0.68; caps[1].y = H * 0.28;

      particles.forEach((p) => {
        p.x     = Math.random() * W;
        p.y     = Math.random() * H;
        p.vx    = (Math.random() - 0.5) * 0.22;
        p.vy    = -(Math.random() * 0.32 + 0.1);
        p.r     = Math.random() * 1.6 + 0.5;
        p.alpha = Math.random() * 0.38 + 0.1;
      });
    };

    /* ────────── Draw helpers ───────────────────────────── */

    function drawRunner(cx: number, gY: number, f: number, ph: number) {
      const HR = 6, TORSO = 20, LEG = 15;
      const t      = f * 0.22 + ph;
      const stride = Math.sin(t);
      const bounce = Math.max(0, Math.abs(stride) - 0.15) * 5;
      const by     = gY - bounce;
      const hY     = by - LEG - TORSO - HR;

      ctx.save();
      ctx.strokeStyle = A(0.46); ctx.fillStyle = A(0.46);
      ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.lineJoin = "round";

      // head + eye
      ctx.beginPath(); ctx.arc(cx + 2, hY, HR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 4, hY - 1.5, 1.2, 0, Math.PI * 2); ctx.fill();

      // torso (lean forward)
      ctx.beginPath();
      ctx.moveTo(cx + 2, hY + HR);
      ctx.lineTo(cx, by - LEG);
      ctx.stroke();

      // legs — wide sprinting stride
      const la = stride * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx, by - LEG);
      ctx.lineTo(cx + Math.sin(la) * LEG * 1.25, by);
      ctx.stroke();

      const bkx = cx - Math.sin(la) * LEG * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx, by - LEG);
      ctx.lineTo(bkx, by - LEG * 0.38 + 2);
      ctx.lineTo(bkx - 4, by + 4);
      ctx.stroke();

      // arms — pumping opposite to stride
      const aY    = hY + HR + TORSO * 0.38;
      const swing = stride * 13;
      ctx.beginPath(); ctx.moveTo(cx + 1, aY); ctx.lineTo(cx + 11, aY - swing); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 1, aY); ctx.lineTo(cx - 9,  aY + swing); ctx.stroke();

      ctx.restore();
    }

    function drawReader(cx: number, gY: number, bob: number) {
      const HR = 6;
      const sY  = gY - 8 + bob;
      const hY  = sY - 22 - HR;

      ctx.save();
      ctx.strokeStyle = A(0.38); ctx.fillStyle = A(0.38);
      ctx.lineWidth = 1.65; ctx.lineCap = "round";

      // head + eye
      ctx.beginPath(); ctx.arc(cx, hY, HR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 2.5, hY - 1, 1.2, 0, Math.PI * 2); ctx.fill();

      // torso (slight forward lean when seated)
      ctx.beginPath(); ctx.moveTo(cx, hY + HR); ctx.lineTo(cx - 1, sY); ctx.stroke();

      // crossed legs
      ctx.beginPath();
      ctx.moveTo(cx - 1, sY);
      ctx.lineTo(cx - 13, sY + 11);
      ctx.lineTo(cx + 5,  sY + 13);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 1, sY);
      ctx.lineTo(cx + 11, sY + 9);
      ctx.lineTo(cx - 5,  sY + 13);
      ctx.stroke();

      // open book on lap
      const bx = cx + 1, bY = sY - 11;
      drawOpenBook(bx, bY, 11, 0.5, 0);

      // arms reaching to book
      const aY = hY + HR + 8;
      ctx.beginPath(); ctx.moveTo(cx, aY); ctx.lineTo(bx - 9, bY + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, aY); ctx.lineTo(bx + 9, bY + 5); ctx.stroke();

      ctx.restore();
    }

    function drawOpenBook(cx: number, cy: number, sz: number, alpha: number, angle: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.35; ctx.lineCap = "round";

      // left page
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.42);
      ctx.lineTo(-sz * 0.95, -sz * 0.28);
      ctx.lineTo(-sz * 0.95,  sz * 0.45);
      ctx.lineTo(0,           sz * 0.42);
      ctx.closePath(); ctx.stroke();

      // right page
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.42);
      ctx.lineTo( sz * 0.95, -sz * 0.28);
      ctx.lineTo( sz * 0.95,  sz * 0.45);
      ctx.lineTo(0,            sz * 0.42);
      ctx.closePath(); ctx.stroke();

      // spine
      ctx.beginPath(); ctx.moveTo(0, -sz * 0.42); ctx.lineTo(0, sz * 0.42); ctx.stroke();

      // page lines
      ctx.globalAlpha = alpha * 0.32; ctx.lineWidth = 0.85;
      for (let i = 1; i <= 3; i++) {
        const ly = -sz * 0.42 + (sz * 0.84 * i / 4);
        ctx.beginPath(); ctx.moveTo(-sz * 0.88, ly); ctx.lineTo(-sz * 0.1, ly); ctx.stroke();
        ctx.beginPath(); ctx.moveTo( sz * 0.1,  ly); ctx.lineTo( sz * 0.88, ly); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawGradCap(cx: number, cy: number, sz: number, alpha: number) {
      ctx.save();
      ctx.strokeStyle = V(alpha); ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, cy - sz * 0.5);
      ctx.lineTo(cx + sz, cy);
      ctx.lineTo(cx, cy + sz * 0.5);
      ctx.lineTo(cx - sz, cy);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sz * 0.65, cy); ctx.lineTo(cx + sz * 0.65, cy + sz * 0.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + sz * 0.65, cy + sz * 0.9, sz * 0.14, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function drawStar(cx: number, cy: number, r: number, alpha: number) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = A(1);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const oa = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const ia = oa + Math.PI / 5;
        if (i === 0) ctx.moveTo(cx + Math.cos(oa) * r,        cy + Math.sin(oa) * r);
        else         ctx.lineTo(cx + Math.cos(oa) * r,        cy + Math.sin(oa) * r);
        ctx.lineTo(cx + Math.cos(ia) * r * 0.42, cy + Math.sin(ia) * r * 0.42);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function drawLightbulb(cx: number, cy: number, sz: number, alpha: number) {
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy, sz, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz, cy); ctx.lineTo(cx - sz * 0.6, cy + sz * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sz, cy); ctx.lineTo(cx + sz * 0.6, cy + sz * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.52, cy + sz * 0.7);  ctx.lineTo(cx + sz * 0.52, cy + sz * 0.7);  ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.36, cy + sz * 0.98); ctx.lineTo(cx + sz * 0.36, cy + sz * 0.98); ctx.stroke();
      // rays
      ctx.strokeStyle = A(alpha * 0.4); ctx.lineWidth = 0.9;
      [[-1.3, -0.6], [0, -1], [1.3, -0.6]].forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.moveTo(cx + rx * sz * 1.15, cy + ry * sz * 1.15);
        ctx.lineTo(cx + rx * sz * 1.6,  cy + ry * sz * 1.6);
        ctx.stroke();
      });
      ctx.restore();
    }

    /* ────────── Loop ───────────────────────────────────── */
    const loop = () => {
      if (!W || !H) { raf = requestAnimationFrame(loop); return; }

      // one-time init after canvas first has dimensions
      if (frame === 0) initPositions();

      ctx.clearRect(0, 0, W, H);
      frame++;

      const gY  = H * 0.83;
      const bob = (t: number) => Math.sin(frame * 0.032 + t) * 3;

      // Dashed ground
      ctx.save();
      ctx.strokeStyle = A(0.08); ctx.lineWidth = 1; ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.moveTo(0, gY); ctx.lineTo(W, gY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Floating books
      for (const b of books) {
        b.y += b.vy; b.x += b.vx;
        if (b.y < -40) { b.y = H + 40; b.x = Math.random() * W; }
        if (b.x > W + 40) b.x = -40;
        if (b.x <    -40) b.x = W + 40;
        drawOpenBook(b.x, b.y, b.sz, b.alpha, Math.sin(frame * 0.022 + b.vx * 10) * 0.14);
      }

      // Floating grad-caps
      for (const c of caps) {
        c.y += c.vy; c.x += c.vx;
        if (c.y < -40) { c.y = H + 40; c.x = Math.random() * W; }
        if (c.x > W + 40) c.x = -40;
        if (c.x <    -40) c.x = W + 40;
        drawGradCap(c.x, c.y, c.sz, c.alpha);
      }

      // Static decorations
      drawLightbulb(W * 0.42, H * 0.2 + bob(1.0), 10, 0.24);
      drawLightbulb(W * 0.86, H * 0.32 + bob(2.4), 8,  0.2);

      drawStar(W * 0.18, H * 0.18 + bob(0.5), 4.5, (Math.sin(frame * 0.04) + 1) * 0.22);
      drawStar(W * 0.62, H * 0.14 + bob(1.8), 3.5, (Math.sin(frame * 0.05 + 1.4) + 1) * 0.2);
      drawStar(W * 0.78, H * 0.42 + bob(0.9), 3,   (Math.sin(frame * 0.037 + 2.8) + 1) * 0.18);

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.save();
        ctx.fillStyle = A(p.alpha);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Seated readers — stationary
      drawReader(W * 0.22, gY, bob(1.3));
      drawReader(W * 0.78, gY, bob(2.7));

      // Runners — moving left to right
      for (const r of runners) {
        r.x += r.speed;
        if (r.x > W + 90) r.x = -90;
        drawRunner(r.x, gY, frame, r.phase);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
