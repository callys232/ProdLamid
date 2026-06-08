"use client";

import { useEffect, useRef } from "react";
import styles from "./BizPhereStickman.module.css";

interface Runner {
  x: number;
  speed: number;
  phase: number;
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
    let cssW = 0;
    let cssH = 0;

    /* Sync canvas resolution to CSS size × device pixel ratio (crisp on Retina) */
    const sync = () => {
      const dpr = window.devicePixelRatio || 1;
      cssW = canvas.offsetWidth;
      cssH = canvas.offsetHeight;
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale so draw coords stay in CSS px
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(canvas);

    const runners: Runner[] = [
      { x: 0,   speed: 0.55, phase: 0 },
      { x: 0,   speed: 0.45, phase: Math.PI },
    ];

    /* ── Draw one stickman + cart ── */
    function drawUnit(cx: number, cy: number, f: number, phase: number) {
      const CW = 60;
      const CH = 38;
      const WR = 8;
      const HR = 8;

      ctx.save();
      ctx.strokeStyle = "rgba(251,146,60,0.35)";
      ctx.fillStyle   = "rgba(251,146,60,0.35)";
      ctx.lineWidth   = 2;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";

      /* Cart basket — trapezoid */
      ctx.beginPath();
      ctx.moveTo(cx - CW / 2 - 4, cy - CH);
      ctx.lineTo(cx + CW / 2 + 4, cy - CH);
      ctx.lineTo(cx + CW / 2 - 2, cy);
      ctx.lineTo(cx - CW / 2 + 2, cy);
      ctx.closePath();
      ctx.stroke();

      /* Cross-bar */
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
        /* Spokes */
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(wx, cy + 2);
        ctx.lineTo(wx, cy + WR * 2 - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(wx - WR + 2, cy + WR);
        ctx.lineTo(wx + WR - 2, cy + WR);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* Handle */
      ctx.beginPath();
      ctx.moveTo(cx + CW / 2 + 4, cy - CH);
      ctx.lineTo(cx + CW / 2 + 22, cy - CH - 20);
      ctx.stroke();

      /* Stickman */
      const sx    = cx - 6;
      const rimY  = cy - CH + 2;
      const headY = rimY - HR - 10;

      ctx.beginPath();
      ctx.arc(sx, headY, HR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx + 3, headY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sx, headY + HR);
      ctx.lineTo(sx, rimY);
      ctx.stroke();

      const armY = headY + HR + (rimY - headY - HR) * 0.35;
      const wave = Math.sin(f * 0.08 + phase) * 14;

      ctx.beginPath();
      ctx.moveTo(sx, armY);
      ctx.lineTo(cx - CW / 2 + 6, rimY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sx, armY);
      ctx.lineTo(sx + 18, armY - wave);
      ctx.stroke();

      ctx.restore();
    }

    /* Stagger carts BEFORE the loop starts so the first frame is correct */
    runners[0].x = 0;
    runners[1].x = (cssW || 300) * 0.55 + 130;

    const loop = () => {
      if (!cssW || !cssH) { raf = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, cssW, cssH);
      frame++;

      const baseY = cssH * 0.70 + Math.sin(frame * 0.03) * 4;

      for (const r of runners) {
        r.x += r.speed;
        if (r.x > cssW + 130) r.x = -130;
        drawUnit(r.x, baseY + Math.sin(frame * 0.045 + r.phase) * 3, frame, r.phase);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.canvas} />
  );
}
