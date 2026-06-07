"use client";

import { useEffect, useRef } from "react";

interface Runner {
  x: number;
  speed: number;
  phase: number; // arm-wave phase offset
}

export default function BizPhereStickman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;

    const sync = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    /* Two carts staggered across the card */
    const runners: Runner[] = [
      { x: 0,   speed: 0.55, phase: 0 },
      { x: 0.6, speed: 0.45, phase: Math.PI }, // fractional start — resolved each frame
    ];

    /* ── Draw one stickman + cart ── */
    function drawUnit(cx: number, cy: number, f: number, phase: number) {
      const CW = 60;   // cart basket width
      const CH = 38;   // cart basket height
      const WR = 8;    // wheel radius
      const HR = 8;    // head radius
      const STROKE = "rgba(251,146,60,0.35)";
      const lw = 2;

      ctx.save();
      ctx.strokeStyle = STROKE;
      ctx.fillStyle   = STROKE;
      ctx.lineWidth   = lw;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";

      /* Cart basket — trapezoid */
      ctx.beginPath();
      ctx.moveTo(cx - CW / 2 - 4, cy - CH);   // top-left
      ctx.lineTo(cx + CW / 2 + 4, cy - CH);   // top-right
      ctx.lineTo(cx + CW / 2 - 2, cy);         // bottom-right
      ctx.lineTo(cx - CW / 2 + 2, cy);         // bottom-left
      ctx.closePath();
      ctx.stroke();

      /* Basket cross-bar (inside depth illusion) */
      ctx.beginPath();
      ctx.moveTo(cx - CW / 2 + 4, cy - CH * 0.5);
      ctx.lineTo(cx + CW / 2,     cy - CH * 0.5);
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;

      /* Wheels */
      for (const wx of [cx - CW / 2 + 12, cx + CW / 2 - 12]) {
        ctx.beginPath();
        ctx.arc(wx, cy + WR, WR, 0, Math.PI * 2);
        ctx.stroke();
        /* Wheel spokes */
        ctx.beginPath();
        ctx.moveTo(wx, cy + WR - WR + 2);
        ctx.lineTo(wx, cy + WR + WR - 2);
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(wx - WR + 2, cy + WR);
        ctx.lineTo(wx + WR - 2, cy + WR);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* Handle — diagonal bar up-right */
      ctx.beginPath();
      ctx.moveTo(cx + CW / 2 + 4, cy - CH);
      ctx.lineTo(cx + CW / 2 + 22, cy - CH - 20);
      ctx.stroke();

      /* ── Stickman — sitting in cart, upper body peeking out ── */
      const sx = cx - 6;
      const rimY = cy - CH + 2;          // top of basket inner rim
      const headCY = rimY - HR - 10;     // head centre above rim

      /* Head */
      ctx.beginPath();
      ctx.arc(sx, headCY, HR, 0, Math.PI * 2);
      ctx.stroke();

      /* Face dot (eye) */
      ctx.beginPath();
      ctx.arc(sx + 3, headCY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      /* Neck + upper body */
      const neckY  = headCY + HR;
      const bodyY2 = rimY;
      ctx.beginPath();
      ctx.moveTo(sx, neckY);
      ctx.lineTo(sx, bodyY2);
      ctx.stroke();

      /* Arms */
      const armY    = neckY + (bodyY2 - neckY) * 0.35;
      const wave    = Math.sin(f * 0.08 + phase) * 14;
      /* Left arm — resting on cart rim */
      ctx.beginPath();
      ctx.moveTo(sx, armY);
      ctx.lineTo(cx - CW / 2 + 6, rimY);
      ctx.stroke();
      /* Right arm — waving */
      ctx.beginPath();
      ctx.moveTo(sx, armY);
      ctx.lineTo(sx + 18, armY - wave);
      ctx.stroke();

      ctx.restore();
    }

    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, W, H);
      frame++;

      const baseY = H * 0.70 + Math.sin(frame * 0.03) * 4;

      for (const r of runners) {
        /* advance */
        r.x += r.speed;
        if (r.x > W + 130) r.x = -130;

        const bobY = baseY + Math.sin(frame * 0.045 + r.phase) * 3;
        drawUnit(r.x, bobY, frame, r.phase);
      }

      raf = requestAnimationFrame(loop);
    };

    /* Stagger second cart so they don't overlap at start */
    runners[1].x = (canvas.width || 300) * 0.55 + 130;

    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
