"use client";

import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any;

const SPEED = 0.0022; // very slow — subtle background presence

/* ── Path types ───────────────────────────────────────────────── */
type PathType = "ellipse" | "tilted" | "figure8";

interface Runner {
  bib: string; sz: number; alpha: number;
  path: PathType; t0: number;
  dir: number;   // +1 clockwise, -1 counter-clockwise
  scale: number; // orbit size multiplier
}

const RUNNERS: Runner[] = [
  { bib: "01", sz: 11, alpha: 0.38, path: "ellipse",  t0: 0,              dir:  1, scale: 1.00 },
  { bib: "02", sz: 9,  alpha: 0.30, path: "tilted",   t0: Math.PI * 0.55, dir:  1, scale: 0.88 },
  { bib: "03", sz: 8,  alpha: 0.24, path: "figure8",  t0: Math.PI,        dir:  1, scale: 0.84 },
  { bib: "04", sz: 10, alpha: 0.28, path: "ellipse",  t0: Math.PI * 0.3,  dir: -1, scale: 0.74 },
  { bib: "05", sz: 7,  alpha: 0.20, path: "tilted",   t0: Math.PI * 1.4,  dir:  1, scale: 0.78 },
];

/* Numerically differentiated path positions ─────────────────── */
function pathPos(type: PathType, t: number, cx: number, cy: number, W: number, H: number, scale = 1) {
  const rx = W * 0.38 * scale, ry = H * 0.26 * scale;

  function raw(a: number) {
    if (type === "ellipse") {
      return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
    }
    if (type === "tilted") {
      const tilt = 0.48;
      const ex = Math.cos(a) * rx * 0.68, ey = Math.sin(a) * ry * 0.52;
      return {
        x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt),
        y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt),
      };
    }
    // figure-8 (lemniscate)
    const sc = 1 / (1 + Math.sin(a) ** 2);
    return { x: cx + rx * 0.82 * Math.cos(a) * sc, y: cy + ry * 0.62 * Math.sin(a) * Math.cos(a) * sc };
  }

  const p = raw(t), p1 = raw(t + 0.01);
  return { ...p, facingRight: p1.x >= p.x };
}

/* ── Colors ───────────────────────────────────────────────────── */
const W_A = (a: number) => `rgba(255,255,255,${a})`;
const R_A = (a: number) => `rgba(37,99,235,${a})`;

/* ── Background decorations ───────────────────────────────────── */
function drawBg(ctx: Ctx, W: number, H: number, frame: number) {
  const pulse = (Math.sin(frame * 0.012) + 1) * 0.5; // 0→1 slow

  /* Long diagonal lines */
  ctx.save();
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = R_A(0.07 + pulse * 0.03);
  ctx.beginPath(); ctx.moveTo(W * 0.05, 0); ctx.lineTo(W * 0.68, H); ctx.stroke();
  ctx.strokeStyle = R_A(0.05 + pulse * 0.02);
  ctx.beginPath(); ctx.moveTo(W * 0.78, 0); ctx.lineTo(W * 0.18, H); ctx.stroke();

  /* Large faint arc — echoes the track */
  ctx.strokeStyle = W_A(0.04 + pulse * 0.02);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.5, H * 0.42, Math.PI * 0.6, Math.PI * 1.8);
  ctx.stroke();

  /* Diamond outline — upper-left accent */
  const dx = W * 0.08, dy = H * 0.28, ds = 24;
  ctx.strokeStyle = R_A(0.10 + pulse * 0.04);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(dx, dy - ds); ctx.lineTo(dx + ds, dy);
  ctx.lineTo(dx, dy + ds); ctx.lineTo(dx - ds, dy);
  ctx.closePath(); ctx.stroke();

  /* Triangle outline — lower-right */
  const tx = W * 0.88, ty = H * 0.72, ts = 28;
  ctx.strokeStyle = W_A(0.06);
  ctx.beginPath();
  ctx.moveTo(tx, ty - ts); ctx.lineTo(tx + ts, ty + ts * 0.6);
  ctx.lineTo(tx - ts, ty + ts * 0.6); ctx.closePath(); ctx.stroke();

  /* Small hexagon — mid right */
  const hx = W * 0.92, hy = H * 0.28, hr = 14;
  ctx.strokeStyle = R_A(0.08 + pulse * 0.03);
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    if (i === 0) ctx.moveTo(hx + Math.cos(a) * hr, hy + Math.sin(a) * hr);
    else         ctx.lineTo(hx + Math.cos(a) * hr, hy + Math.sin(a) * hr);
  }
  ctx.closePath(); ctx.stroke();

  /* Network cluster — upper centre-right */
  const nodes: [number, number][] = [
    [W * 0.62, H * 0.14], [W * 0.70, H * 0.22],
    [W * 0.76, H * 0.12], [W * 0.68, H * 0.08],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,0],[0,2]];
  ctx.strokeStyle = W_A(0.06);
  ctx.lineWidth = 0.6;
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });
  ctx.fillStyle = R_A(0.18 + pulse * 0.06);
  nodes.forEach(([nx, ny]) => {
    ctx.beginPath(); ctx.arc(nx, ny, 2.2, 0, Math.PI * 2); ctx.fill();
  });

  /* Sparse horizontal dashes — depth lines */
  ctx.strokeStyle = W_A(0.04);
  ctx.lineWidth = 0.5;
  ctx.setLineDash([6, 14]);
  [0.32, 0.58, 0.76].forEach((yf) => {
    ctx.beginPath();
    ctx.moveTo(W * 0.04, H * yf);
    ctx.lineTo(W * 0.48, H * yf);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  ctx.restore();
}

/* ── Draw stickman runner ─────────────────────────────────────── */
function drawRunner(ctx: Ctx, x: number, y: number, runPhase: number, sz: number, alpha: number, facingRight: boolean, bib: string) {
  const stride = Math.sin(runPhase);
  const legA   = stride * 0.62;
  const armA   = -stride * 0.54;
  const bounce = Math.abs(stride) * sz * 0.22;

  ctx.save();
  ctx.translate(x, y - bounce);
  if (!facingRight) ctx.scale(-1, 1);

  ctx.strokeStyle = W_A(alpha);
  ctx.fillStyle   = W_A(alpha);
  ctx.lineWidth   = Math.max(sz * 0.13, 1.1);
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  // Head
  ctx.beginPath();
  ctx.arc(0, -sz * 2.9, sz * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Body (slight lean)
  ctx.beginPath();
  ctx.moveTo(sz * 0.1, -sz * 2.35);
  ctx.lineTo(0,        -sz * 0.72);
  ctx.stroke();

  // Arms
  const ay = -sz * 1.92;
  ctx.beginPath(); ctx.moveTo(sz * 0.05, ay); ctx.lineTo( sz * 0.88, ay + armA * sz * 0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sz * 0.05, ay); ctx.lineTo(-sz * 0.82, ay - armA * sz * 0.55); ctx.stroke();

  // Legs
  ctx.beginPath(); ctx.moveTo(0, -sz * 0.72); ctx.lineTo( Math.sin(legA) * sz, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -sz * 0.72); ctx.lineTo(-Math.sin(legA) * sz, Math.cos(legA) * sz * -0.15); ctx.stroke();

  // Race bib
  const bw = sz * 0.52, bh = sz * 0.35;
  ctx.fillStyle   = R_A(alpha * 0.95);
  ctx.strokeStyle = R_A(alpha * 0.45);
  ctx.lineWidth   = sz * 0.055;
  ctx.fillRect  (sz * 0.05 - bw / 2, -sz * 1.74 - bh / 2, bw, bh);
  ctx.strokeRect(sz * 0.05 - bw / 2, -sz * 1.74 - bh / 2, bw, bh);

  ctx.fillStyle    = W_A(Math.min(alpha * 1.5, 0.9));
  ctx.font         = `bold ${Math.max(sz * 0.28, 7)}px monospace`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  if (!facingRight) ctx.scale(-1, 1); // keep text readable
  ctx.fillText(bib, facingRight ? sz * 0.05 : -sz * 0.05, -sz * 1.74);

  ctx.restore();
}

/* ── Component ─────────────────────────────────────────────────── */
export default function HeroStickmen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: Ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number, frame = 0;
    let W = 0, H = 0;

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    const loop = () => {
      if (!W || !H) { raf = requestAnimationFrame(loop); return; }
      ctx.clearRect(0, 0, W, H);
      frame++;
      tRef.current += SPEED;

      const cx = W * 0.5, cy = H * 0.5;

      drawBg(ctx, W, H, frame);

      // Depth-sort: runners lower on screen render on top
      const rendered = RUNNERS.map((r) => {
        const t = tRef.current * r.dir + r.t0;
        const { x, y, facingRight } = pathPos(r.path, t, cx, cy, W, H, r.scale);
        return { ...r, x, y, facingRight, t };
      }).sort((a, b) => a.y - b.y);

      for (const r of rendered) {
        // Pseudo-depth: bigger + brighter at bottom of frame
        const depth = 0.80 + 0.20 * ((r.y - cy) / (H * 0.3 + 1) + 1) / 2;
        const sz    = r.sz * Math.min(depth, 1.1);

        // Slow run phase tied to path advancement
        const runPhase = tRef.current * 18 + r.t0 * 4;

        drawRunner(ctx, r.x, r.y, runPhase, sz, r.alpha * depth, r.facingRight, r.bib);
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
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
