"use client";

import { useEffect, useRef } from "react";
import styles from "../biz/BizPhereStickman.module.css";

interface Walker { x: number; speed: number; phase: number; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any; // CanvasRenderingContext2D — typed loosely to avoid TS18047 noise

const A = (a: number) => `rgba(251,191,36,${a})`; // amber helper

export default function HcdStickman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx: Ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;
    let W = 0;
    let H = 0;

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

    const walkers: Walker[] = [
      { x: 0,   speed: 0.58, phase: 0 },
      { x: 0,   speed: 0.44, phase: Math.PI },
    ];

    // ── Stickman with open book ───────────────────────────────────
    function drawLearner(cx: number, groundY: number, f: number, phase: number) {
      const HR = 7, BODY = 26, LEG = 18;
      ctx.save();
      ctx.strokeStyle = A(0.42); ctx.fillStyle = A(0.42);
      ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.lineJoin = "round";
      const walk  = Math.sin(f * 0.1 + phase);
      const headY = groundY - LEG - BODY - HR;
      ctx.beginPath(); ctx.arc(cx, headY, HR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 3, headY - 2, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, headY + HR); ctx.lineTo(cx, headY + HR + BODY); ctx.stroke();
      const legA = walk * 0.45;
      ctx.beginPath(); ctx.moveTo(cx, headY + HR + BODY); ctx.lineTo(cx + Math.sin(legA) * LEG, groundY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, headY + HR + BODY); ctx.lineTo(cx - Math.sin(legA) * LEG, groundY); ctx.stroke();
      const armY = headY + HR + BODY * 0.35;
      ctx.beginPath(); ctx.moveTo(cx, armY); ctx.lineTo(cx + 14, armY + walk * 8); ctx.stroke();
      const bx = cx - 18, by = armY - 14;
      ctx.beginPath(); ctx.moveTo(cx, armY); ctx.lineTo(bx + 5, by + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx - 7, by); ctx.lineTo(bx + 1, by - 7); ctx.lineTo(bx + 9, by); ctx.lineTo(bx + 1, by + 3); ctx.closePath(); ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(bx + 1, by - 7); ctx.lineTo(bx + 1, by + 3); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── Bar chart ─────────────────────────────────────────────────
    function drawBarChart(ox: number, baseY: number, f: number, off: number) {
      const BW = 7, GAP = 4, hs = [16, 26, 38, 52];
      ctx.save();
      hs.forEach((h, i) => {
        const p  = h + Math.sin(f * 0.025 + off + i * 0.6) * 4;
        const bx = ox + i * (BW + GAP);
        ctx.fillStyle = A(0.10 + i * 0.06);
        ctx.fillRect(bx, baseY - p, BW, p);
        ctx.fillStyle = A(0.32 + i * 0.08);
        ctx.fillRect(bx, baseY - p, BW, 2);
      });
      ctx.strokeStyle = A(0.2); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 2, baseY); ctx.lineTo(ox + hs.length * (BW + GAP) + 2, baseY); ctx.stroke();
      const lh = hs[3] + Math.sin(f * 0.025 + off + 1.8) * 4;
      const ax = ox + 3 * (BW + GAP) + BW / 2, ay = baseY - lh - 8;
      ctx.strokeStyle = A(0.5); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ax, ay + 8); ctx.lineTo(ax, ay); ctx.moveTo(ax - 3, ay + 4); ctx.lineTo(ax, ay); ctx.lineTo(ax + 3, ay + 4); ctx.stroke();
      ctx.restore();
    }

    // ── Dashed trend line ─────────────────────────────────────────
    function drawTrendLine(x1: number, y1: number, x2: number, y2: number) {
      ctx.save();
      ctx.strokeStyle = A(0.14); ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.setLineDash([]); ctx.strokeStyle = A(0.28); ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x2 - Math.cos(a - 0.4) * 7, y2 - Math.sin(a - 0.4) * 7);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - Math.cos(a + 0.4) * 7, y2 - Math.sin(a + 0.4) * 7);
      ctx.stroke();
      ctx.restore();
    }

    // ── Star ──────────────────────────────────────────────────────
    function drawStar(cx: number, cy: number, r: number, alpha: number) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = A(1);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const oa = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const ia = oa + Math.PI / 5;
        if (i === 0) ctx.moveTo(cx + Math.cos(oa) * r, cy + Math.sin(oa) * r);
        else         ctx.lineTo(cx + Math.cos(oa) * r, cy + Math.sin(oa) * r);
        ctx.lineTo(cx + Math.cos(ia) * (r * 0.42), cy + Math.sin(ia) * (r * 0.42));
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    // ── Graduation cap ────────────────────────────────────────────
    function drawGradCap(cx: number, cy: number, sz: number, alpha: number) {
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.fillStyle = A(alpha);
      ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, cy - sz * 0.5);
      ctx.lineTo(cx + sz, cy);
      ctx.lineTo(cx, cy + sz * 0.5);
      ctx.lineTo(cx - sz, cy);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sz * 0.65, cy); ctx.lineTo(cx + sz * 0.65, cy + sz * 0.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + sz * 0.65, cy + sz * 0.85, sz * 0.14, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    // ── Lightbulb ─────────────────────────────────────────────────
    function drawLightbulb(cx: number, cy: number, sz: number, alpha: number) {
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy, sz, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz, cy); ctx.lineTo(cx - sz * 0.6, cy + sz * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sz, cy); ctx.lineTo(cx + sz * 0.6, cy + sz * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.55, cy + sz * 0.7); ctx.lineTo(cx + sz * 0.55, cy + sz * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.38, cy + sz * 1.0); ctx.lineTo(cx + sz * 0.38, cy + sz * 1.0); ctx.stroke();
      // rays
      ctx.strokeStyle = A(alpha * 0.45); ctx.lineWidth = 1;
      [[-1.3, -0.6], [0, -1], [1.3, -0.6]].forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.moveTo(cx + rx * sz * 1.15, cy + ry * sz * 1.15);
        ctx.lineTo(cx + rx * sz * 1.6,  cy + ry * sz * 1.6);
        ctx.stroke();
      });
      ctx.restore();
    }

    // ── Trophy ────────────────────────────────────────────────────
    function drawTrophy(cx: number, cy: number, sz: number, alpha: number) {
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - sz * 0.6, cy - sz * 0.8);
      ctx.lineTo(cx - sz * 0.6, cy);
      ctx.quadraticCurveTo(cx - sz * 0.6, cy + sz * 0.4, cx, cy + sz * 0.5);
      ctx.quadraticCurveTo(cx + sz * 0.6, cy + sz * 0.4, cx + sz * 0.6, cy);
      ctx.lineTo(cx + sz * 0.6, cy - sz * 0.8);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.6, cy - sz * 0.4); ctx.quadraticCurveTo(cx - sz, cy - sz * 0.1, cx - sz * 0.6, cy + sz * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sz * 0.6, cy - sz * 0.4); ctx.quadraticCurveTo(cx + sz, cy - sz * 0.1, cx + sz * 0.6, cy + sz * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + sz * 0.5); ctx.lineTo(cx, cy + sz * 0.85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - sz * 0.45, cy + sz * 0.85); ctx.lineTo(cx + sz * 0.45, cy + sz * 0.85); ctx.stroke();
      ctx.restore();
    }

    // ── Target ────────────────────────────────────────────────────
    function drawTarget(cx: number, cy: number, r: number, alpha: number) {
      ctx.save(); ctx.lineWidth = 1.4;
      [r, r * 0.65, r * 0.3].forEach((rad, i) => {
        ctx.strokeStyle = A(alpha - i * 0.06);
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.strokeStyle = A(alpha * 0.4); ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(cx - r * 1.3, cy); ctx.lineTo(cx + r * 1.3, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.3); ctx.lineTo(cx, cy + r * 1.3); ctx.stroke();
      ctx.restore();
    }

    // ── Network nodes ─────────────────────────────────────────────
    function drawNetwork(ox: number, oy: number, scale: number, alpha: number) {
      const nodes: [number, number][] = [[0,0],[35*scale,-18*scale],[65*scale,4*scale],[32*scale,24*scale],[-8*scale,26*scale]];
      const edges = [[0,1],[0,3],[1,2],[1,3],[2,3],[3,4]];
      ctx.save();
      ctx.strokeStyle = A(alpha * 0.55); ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        ctx.beginPath(); ctx.moveTo(ox + nodes[a][0], oy + nodes[a][1]); ctx.lineTo(ox + nodes[b][0], oy + nodes[b][1]); ctx.stroke();
      });
      ctx.fillStyle = A(alpha);
      nodes.forEach(([nx, ny]) => {
        ctx.beginPath(); ctx.arc(ox + nx, oy + ny, 3.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    }

    // ── Pie chart ─────────────────────────────────────────────────
    function drawPie(cx: number, cy: number, r: number, alpha: number) {
      const slices = [0.32, 0.24, 0.22, 0.22];
      const as_ = [alpha, alpha * 0.75, alpha * 0.52, alpha * 0.32];
      ctx.save(); ctx.lineWidth = 1;
      let start = -Math.PI / 2;
      slices.forEach((frac, i) => {
        const end = start + frac * Math.PI * 2;
        ctx.fillStyle   = A(as_[i]);
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();
        ctx.fill(); ctx.stroke();
        start = end;
      });
      ctx.restore();
    }

    // ── Line graph ────────────────────────────────────────────────
    function drawLineGraph(ox: number, oy: number, w: number, h: number, f: number, alpha: number) {
      const pts = 7;
      const step = w / (pts - 1);
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.6; ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < pts; i++) {
        const y = oy - (i / (pts - 1)) * h * 0.75 - Math.sin(f * 0.04 + i * 0.9) * (h * 0.1);
        if (i === 0) ctx.moveTo(ox + i * step, y);
        else         ctx.lineTo(ox + i * step, y);
      }
      ctx.stroke();
      ctx.lineTo(ox + (pts - 1) * step, oy);
      ctx.lineTo(ox, oy);
      ctx.closePath();
      ctx.fillStyle = A(alpha * 0.1);
      ctx.fill();
      ctx.restore();
    }

    // ── Certificate ───────────────────────────────────────────────
    function drawCertificate(cx: number, cy: number, alpha: number) {
      const W = 42, H = 30;
      ctx.save();
      ctx.strokeStyle = A(alpha); ctx.lineWidth = 1.4; ctx.lineCap = "round";
      ctx.strokeRect(cx - W / 2, cy - H / 2, W, H);
      ctx.beginPath(); ctx.arc(cx + W * 0.26, cy + H * 0.18, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = alpha * 0.5;
      [[W * 0.38, 0], [W * 0.32, 6], [W * 0.25, 12]].forEach(([lw, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - lw / 2, cy - H * 0.18 + dy);
        ctx.lineTo(cx + lw / 2, cy - H * 0.18 + dy);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = A(alpha * 0.65);
      ctx.beginPath(); ctx.moveTo(cx - W / 2, cy + H * 0.08); ctx.lineTo(cx + W / 2, cy + H * 0.08); ctx.stroke();
      ctx.restore();
    }

    walkers[0].x = 0;
    walkers[1].x = (W || 300) * 0.55 + 100;

    const loop = () => {
      if (!W || !H) { raf = requestAnimationFrame(loop); return; }
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Ground line — 78% of height
      const gY = H * 0.78;
      // Float offset for gentle bobbing icons
      const bob = (t: number) => Math.sin(frame * 0.035 + t) * 3;

      // ── Background decorations — all anchored to gY so they fit any height ──

      drawTrendLine(W * 0.02, gY - 6, W * 0.97, gY - H * 0.62);

      // Two bar charts
      drawBarChart(W * 0.08, gY, frame, 0);
      drawBarChart(W * 0.56, gY, frame, Math.PI);

      // Line graph — right side, starts at 60% height
      drawLineGraph(W * 0.66, gY - 6, W * 0.26, H * 0.58, frame, 0.28);

      // Pie chart — far right, vertically centred between gY and top
      drawPie(W * 0.9, gY - H * 0.35 + bob(1.2), 18, 0.30);

      // Target — left quarter, mid-height
      drawTarget(W * 0.07, gY - H * 0.4 + bob(0.6), 16, 0.26);

      // Network — upper centre
      drawNetwork(W * 0.38, gY - H * 0.62 + bob(2), 0.9, 0.32);

      // Graduation cap — above left bar chart
      drawGradCap(W * 0.11 + 24, gY - H * 0.45 + bob(0.3), 13, 0.35);

      // Lightbulb — upper left
      drawLightbulb(W * 0.26, gY - H * 0.5 + bob(1.8), 11, 0.28);

      // Trophy — upper right
      drawTrophy(W * 0.76, gY - H * 0.48 + bob(0.9), 13, 0.30);

      // Certificate — centre, mid-height
      drawCertificate(W * 0.48, gY - H * 0.3 + bob(2.5), 0.28);

      // Pulsing stars above bar charts
      drawStar(W * 0.11 + 24, gY - H * 0.48 + bob(0.3),  5, (Math.sin(frame * 0.04) + 1) / 2 * 0.48);
      drawStar(W * 0.57 + 24, gY - H * 0.48 + bob(2.1),  5, (Math.sin(frame * 0.038 + 2) + 1) / 2 * 0.48);

      // ── Walking learners ──
      for (const w of walkers) {
        w.x += w.speed;
        if (w.x > W + 80) w.x = -80;
        drawLearner(w.x, gY + Math.sin(frame * 0.04 + w.phase) * 2, frame, w.phase);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
