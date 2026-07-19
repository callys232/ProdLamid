"use client";

import { useEffect, useRef } from "react";

interface Runner {
  x: number;
  groundY: number; // fraction of canvas height
  size: number;
  speed: number;
  phase: number;
  phaseSpeed: number;
  opacity: number;
  color: string;
  dir: 1 | -1; // 1 = left→right, -1 = right→left
}

function drawRunner(
  ctx: CanvasRenderingContext2D,
  r: Runner,
  cw: number,
  ch: number
) {
  const { x, groundY, size, phase, opacity, color, dir } = r;
  const gy = groundY * ch;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.2, size * 0.075);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Flip horizontally when running right→left
  ctx.translate(x, gy);
  if (dir === -1) ctx.scale(-1, 1);

  const s = size;
  const headR    = s * 0.14;
  const torsoLen = s * 0.38;
  const armLen   = s * 0.28;
  const legLen   = s * 0.38;

  // hip at origin, shoulder above
  const shoulderY = -torsoLen;
  const headY     = shoulderY - headR - s * 0.02;

  // body bob
  const bob = Math.abs(Math.sin(phase)) * s * 0.04;

  // angles — arms opposite legs
  const swing = Math.sin(phase);
  const legAngleA =  swing * 0.55;  // left leg
  const legAngleB = -swing * 0.55;  // right leg
  const armAngleA = -swing * 0.45;  // left arm (opposite)
  const armAngleB =  swing * 0.45;  // right arm

  // Head
  ctx.beginPath();
  ctx.arc(0, headY - bob, headR, 0, Math.PI * 2);
  ctx.stroke();

  // Torso
  ctx.beginPath();
  ctx.moveTo(0, shoulderY - bob);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // --- Left leg ---
  const lLegX = Math.sin(legAngleA) * legLen;
  const lLegY = Math.cos(legAngleA) * legLen;
  // knee bend: shin continues from knee with extra bend
  const lShinAngle = legAngleA + Math.max(0,  swing) * 0.55;
  const lShinX = lLegX * 0.55 + Math.sin(lShinAngle) * legLen * 0.55;
  const lShinY = lLegY * 0.55 + Math.cos(lShinAngle) * legLen * 0.55;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(lLegX * 0.55, lLegY * 0.55);
  ctx.lineTo(lShinX, lShinY);
  ctx.stroke();

  // --- Right leg ---
  const rLegX = Math.sin(legAngleB) * legLen;
  const rLegY = Math.cos(legAngleB) * legLen;
  const rShinAngle = legAngleB - Math.max(0, -swing) * 0.55;
  const rShinX = rLegX * 0.55 + Math.sin(rShinAngle) * legLen * 0.55;
  const rShinY = rLegY * 0.55 + Math.cos(rShinAngle) * legLen * 0.55;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(rLegX * 0.55, rLegY * 0.55);
  ctx.lineTo(rShinX, rShinY);
  ctx.stroke();

  // --- Left arm ---
  const lArmX = Math.sin(armAngleA) * armLen;
  const lArmY = Math.abs(Math.cos(armAngleA)) * armLen * 0.6;
  ctx.beginPath();
  ctx.moveTo(0, shoulderY - bob);
  ctx.lineTo(lArmX, shoulderY - bob + lArmY);
  ctx.stroke();

  // --- Right arm ---
  const rArmX = Math.sin(armAngleB) * armLen;
  const rArmY = Math.abs(Math.cos(armAngleB)) * armLen * 0.6;
  ctx.beginPath();
  ctx.moveTo(0, shoulderY - bob);
  ctx.lineTo(rArmX, shoulderY - bob + rArmY);
  ctx.stroke();

  ctx.restore();
}

const RUNNERS: Omit<Runner, "x">[] = [
  { groundY: 0.98, size: 34, speed: 1.2, phase: 0,    phaseSpeed: 0.14, opacity: 0.13, color: "#2563EB", dir:  1 },
  { groundY: 0.95, size: 22, speed: 0.9, phase: 1.5,  phaseSpeed: 0.11, opacity: 0.09, color: "#ffffff", dir: -1 },
  { groundY: 0.99, size: 28, speed: 1.5, phase: 3.0,  phaseSpeed: 0.16, opacity: 0.10, color: "#2563EB", dir:  1 },
  { groundY: 0.96, size: 18, speed: 0.7, phase: 0.8,  phaseSpeed: 0.09, opacity: 0.07, color: "#ffffff", dir: -1 },
  { groundY: 0.97, size: 40, speed: 1.8, phase: 2.2,  phaseSpeed: 0.18, opacity: 0.08, color: "#2563EB", dir:  1 },
  { groundY: 0.94, size: 26, speed: 1.0, phase: 4.1,  phaseSpeed: 0.12, opacity: 0.07, color: "#ffffff", dir: -1 },
];

export default function StickmanBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    // Initialise runner positions spread across width
    const runners: Runner[] = RUNNERS.map((r, i) => ({
      ...r,
      x: (i / RUNNERS.length) * window.innerWidth + 60,
    }));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      for (const r of runners) {
        drawRunner(ctx, r, cw, ch);

        // Advance horizontal position
        r.x += r.speed * r.dir;
        // Advance running phase
        r.phase += r.phaseSpeed;

        // Wrap: left→right runners wrap from right back to left edge
        if (r.dir === 1 && r.x > cw + r.size * 2) r.x = -r.size * 2;
        if (r.dir === -1 && r.x < -r.size * 2)     r.x = cw + r.size * 2;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
