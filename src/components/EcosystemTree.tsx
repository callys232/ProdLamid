"use client";

import { useEffect, useRef } from "react";

type Ctx = CanvasRenderingContext2D;

const CYCLE_MS = 9000;
const BLUE  = "#2563EB";
const LB    = "#93c5fd";
const GOLD  = "#F59E0B";
const TBLUE = "#3B82F6";

// All coordinates are in this virtual space, matching the old SVG viewBox
const VW = 400, VH = 540;

function bz(t: number, a: number, b: number, c: number, d: number) {
  const s = 1 - t;
  return s*s*s*a + 3*s*s*t*b + 3*s*t*t*c + t*t*t*d;
}

function eio(t: number) {
  return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
}

function prog(elapsed: number, s: number, e: number) {
  return eio(Math.min(1, Math.max(0, (elapsed - s) / (e - s))));
}

// Draw a cubic bezier (progress 0→1) in SVG coords.
// Canvas must already have the scale+translate transform applied.
function dbez(ctx: Ctx, pts: number[], pr: number, w: number, color: string, alpha: number) {
  if (pr <= 0 || alpha <= 0) return;
  const [x0,y0,x1,y1,x2,y2,x3,y3] = pts;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.min(pr, 1);
    i === 0
      ? ctx.moveTo(bz(t,x0,x1,x2,x3), bz(t,y0,y1,y2,y3))
      : ctx.lineTo(bz(t,x0,x1,x2,x3), bz(t,y0,y1,y2,y3));
  }
  ctx.stroke();
  ctx.restore();
}

// Two-segment path split evenly over pr
function dbez2(ctx: Ctx, s1: number[], s2: number[], pr: number, w: number, color: string, alpha: number) {
  dbez(ctx, s1, Math.min(pr*2, 1),     w, color, alpha);
  dbez(ctx, s2, Math.max(pr*2-1, 0),  w, color, alpha);
}

export default function EcosystemTree({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let CW = 0, CH = 0;

    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      CW = canvas.offsetWidth;
      CH = canvas.offsetHeight;
      canvas.width  = CW * dpr;
      canvas.height = CH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    const startTime = Date.now();

    const loop = () => {
      if (!CW || !CH) { raf = requestAnimationFrame(loop); return; }

      const elapsed = (Date.now() - startTime) % CYCLE_MS;
      const t = elapsed / CYCLE_MS;

      // Global fade: in 0-6%, hold 6-84%, out 84-100%
      const fade = t < 0.06 ? t/0.06 : t > 0.84 ? 1-(t-0.84)/0.16 : 1;

      ctx.clearRect(0, 0, CW, CH);
      if (fade <= 0) { raf = requestAnimationFrame(loop); return; }

      // Scale tree to canvas height, then right-align
      const scale = CH / VH;
      const OX = CW - VW * scale; // CSS-pixel offset from left

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";
      // Apply transform: translate right, then scale. After this,
      // all draw coords are in SVG space (0-400 × 0-540).
      ctx.translate(OX, 0);
      ctx.scale(scale, scale);

      // ── RIGHT-TO-LEFT FLOW LINES ──
      const flows = [
        { s1:[400,48,  330,44,  265,54,  200,49 ], s2:[200,49,  140,44,  68,52,   0,47  ], t0:180,  t1:2400, op:0.18, w:0.9 },
        { s1:[400,82,  320,76,  248,88,  178,82 ], s2:[178,82,  112,76,  50,84,   0,80  ], t0:270,  t1:2500, op:0.13, w:0.9 },
        { s1:[400,115, 310,108, 238,120, 165,115], s2:[165,115, 100,110, 48,118,  0,113 ], t0:630,  t1:2700, op:0.15, w:0.9 },
        { s1:[400,190, 335,187, 268,196, 200,191], s2:[200,191, 135,186, 65,194,  0,189 ], t0:450,  t1:2600, op:0.16, w:0.9 },
        { s1:[400,270, 318,266, 248,275, 182,270], s2:[182,270, 118,265, 54,273,  0,268 ], t0:990,  t1:2800, op:0.14, w:0.9 },
        { s1:[400,320, 322,315, 252,324, 184,318], s2:[184,318, 118,312, 50,320,  0,315 ], t0:1440, t1:3200, op:0.14, w:0.9 },
        { s1:[400,350, 335,347, 270,356, 200,351], s2:[200,351, 132,346, 62,354,  0,349 ], t0:810,  t1:2900, op:0.18, w:0.9 },
        { s1:[400,395, 345,388, 285,398, 225,393], s2:[225,393, 165,388, 90,396,  0,391 ], t0:1260, t1:3000, op:0.16, w:0.9 },
        { s1:[400,450, 340,447, 278,455, 215,450], s2:[215,450, 150,445, 78,453,  0,448 ], t0:1080, t1:3100, op:0.15, w:0.9 },
        { s1:[400,30,  340,65,  278,110, 215,155], s2:[215,155, 155,195, 88,228,  0,265 ], t0:360,  t1:3400, op:0.12, w:0.8 },
        { s1:[400,460, 340,428, 278,390, 215,352], s2:[215,352, 155,318, 88,282,  0,245 ], t0:720,  t1:3600, op:0.12, w:0.8 },
      ];
      for (const f of flows) {
        dbez2(ctx, f.s1, f.s2, prog(elapsed,f.t0,f.t1), f.w, BLUE, f.op);
      }

      // ── CROSS-CONNECTIONS ──
      dbez(ctx, [320,145, 268,148, 218,154, 85,165 ], prog(elapsed,1530,3330), 1.0, BLUE, 0.30);
      dbez(ctx, [342,275, 288,278, 232,284, 68,295 ], prog(elapsed,1890,3690), 1.0, BLUE, 0.30);

      // ── ROOTS ──
      ctx.save(); ctx.globalAlpha *= 0.38;
      const roots = [
        { pts:[200,475, 170,490, 128,498, 88,508 ], t0:90,  t1:1400 },
        { pts:[200,475, 185,493, 162,500, 138,512], t0:180, t1:1300 },
        { pts:[200,475, 200,492, 200,502, 200,518], t0:0,   t1:1200 },
        { pts:[200,475, 215,493, 238,500, 262,512], t0:180, t1:1300 },
        { pts:[200,475, 230,490, 272,498, 312,508], t0:90,  t1:1400 },
        { pts:[88, 508, 68, 514, 48, 512, 28, 516], t0:450, t1:1000 },
        { pts:[312,508, 332,514, 352,512, 372,516], t0:450, t1:1000 },
      ];
      for (const r of roots) dbez(ctx, r.pts, prog(elapsed,r.t0,r.t1), 1.2, BLUE, 1);
      ctx.restore();

      // ── TRUNK ──
      const trunkP = prog(elapsed, 450, 2250);
      dbez(ctx, [200,475, 200,430, 200,370, 200,288], trunkP, 14,  BLUE, 0.07); // glow
      dbez(ctx, [200,475, 200,430, 200,370, 200,288], trunkP, 3.5, BLUE, 1);

      // ── BRANCHES ──
      const branches = [
        { pts:[200,288, 190,265, 140,218, 85,165 ], t0:990,  t1:2250 },
        { pts:[200,288, 210,262, 272,208, 320,145], t0:1260, t1:2610 },
        { pts:[200,312, 178,312, 118,306, 68,295 ], t0:1530, t1:2970 },
        { pts:[200,312, 222,312, 288,298, 342,275], t0:1800, t1:3330 },
      ];
      for (const b of branches) {
        dbez(ctx, b.pts, prog(elapsed, b.t0-90, b.t1), 9,   LB,   0.08); // glow
        dbez(ctx, b.pts, prog(elapsed, b.t0,    b.t1), 2,   BLUE, 1);
      }

      // ── TWIGS ──
      ctx.save(); ctx.globalAlpha *= 0.42;
      const twigs = [
        { pts:[85,165,  65,148,  52,138, 38,126 ], t0:2160, t1:2790 },
        { pts:[85,165,  72,146,  62,134, 48,120 ], t0:2250, t1:2880 },
        { pts:[320,145, 340,126, 352,116,366,104], t0:2430, t1:3060 },
        { pts:[320,145, 334,128, 346,118,362,110], t0:2520, t1:3150 },
        { pts:[68,295,  46,288,  28,282, 12,276 ], t0:2700, t1:3330 },
        { pts:[342,275, 362,266, 376,258,392,250], t0:2880, t1:3510 },
      ];
      for (const tw of twigs) dbez(ctx, tw.pts, prog(elapsed,tw.t0,tw.t1), 1, TBLUE, 1);
      ctx.restore();

      // ── ENGINE NODES ──
      const nodes = [
        { cx:85,  cy:165, color:BLUE,  label:"CORE",    sub:"Strategy & Execution", ms:1800 },
        { cx:320, cy:145, color:TBLUE, label:"GROW",    sub:"Customer & Digital",   ms:2070 },
        { cx:68,  cy:295, color:BLUE,  label:"TALENT",  sub:"People Intelligence",  ms:2340 },
        { cx:342, cy:275, color:GOLD,  label:"FINANCE", sub:"Financial Clarity",    ms:2610 },
      ];

      const R = 15; // radius in SVG units

      for (const n of nodes) {
        const np = prog(elapsed, n.ms, n.ms+500);
        if (np <= 0) continue;
        const { cx, cy } = n;

        ctx.save();
        ctx.globalAlpha *= np;

        // Pulsing ring
        const pulse = 0.5 + 0.5*Math.sin(elapsed/600 + n.ms*0.002);
        ctx.beginPath();
        ctx.arc(cx, cy, R*(1.35+0.55*pulse), 0, Math.PI*2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha *= (0.04 + 0.24*(1-pulse));
        ctx.stroke();
        ctx.globalAlpha /= (0.04 + 0.24*(1-pulse));

        // Node circle
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
        ctx.fillStyle   = n.color + "18";
        ctx.strokeStyle = n.color;
        ctx.lineWidth   = 1.5;
        ctx.fill(); ctx.stroke();

        // Inner dot
        ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI*2);
        ctx.fillStyle   = n.color;
        ctx.globalAlpha *= 0.85; ctx.fill(); ctx.globalAlpha /= 0.85;

        // Label (font size in SVG units, scaled by canvas transform)
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.font         = "bold 8.5px monospace";
        ctx.fillStyle    = n.color;
        ctx.fillText(n.label, cx, cy - R - 9);

        // Sub label
        ctx.font      = "6.5px system-ui, sans-serif";
        ctx.fillStyle = "rgba(148,163,184,0.60)";
        ctx.fillText(n.sub, cx, cy + R + 13);

        ctx.restore();
      }

      // ── LAMID ONE LABEL ──
      const lp = prog(elapsed, 1440, 2250);
      if (lp > 0) {
        ctx.save();
        ctx.globalAlpha *= lp * 0.48;
        ctx.fillStyle    = LB;
        ctx.font         = "bold 7.5px monospace";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("LAMID  ONE", 215, 276);
        ctx.restore();
      }

      ctx.restore(); // restore scale+translate
      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
    />
  );
}
