"use client";

import { motion } from "framer-motion";

interface PathConfig { d: string; delay: number; dur: number }
interface DotConfig  { cx: string; cy: number; r: number; delay: number; dur: number; floatPct: number }

interface VectorBgProps {
  paths?:     PathConfig[];
  dots?:      DotConfig[];
  color?:     string;
  opacity?:   number;
  dashArray?: string;
}

const PATHS: PathConfig[] = [
  { d: "M-80 180 L350 -30 L800 280",  delay: 0,   dur: 20 },
  { d: "M0  480 L550 80 L1150 420",   delay: 3,   dur: 24 },
  { d: "M180 -10 L480 380 L780 40",   delay: 6,   dur: 28 },
  { d: "M-40 330 L320 580 L700 190",  delay: 1.5, dur: 22 },
];

const DOTS: DotConfig[] = [
  { cx: "12%", cy: 22, r: 1.5, delay: 0,   dur: 7,  floatPct: 3 },
  { cx: "82%", cy: 14, r: 1,   delay: 2,   dur: 9,  floatPct: 4 },
  { cx: "62%", cy: 78, r: 1.5, delay: 1,   dur: 8,  floatPct: 3 },
  { cx: "28%", cy: 88, r: 1,   delay: 3,   dur: 11, floatPct: 4 },
  { cx: "88%", cy: 52, r: 1.5, delay: 0.5, dur: 6,  floatPct: 3 },
];

export default function VectorBg({
  paths    = PATHS,
  dots     = DOTS,
  color    = "#C12129",
  opacity  = 0.14,
  dashArray = "8 20",
}: VectorBgProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="vbg-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((v, i) => (
        <motion.path
          key={i}
          d={v.d}
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          strokeOpacity={opacity}
          filter="url(#vbg-glow)"
          strokeDasharray={dashArray}
          animate={{
            strokeDashoffset: [0, -120],
            opacity: [opacity * 0.5, opacity * 1.8, opacity * 0.5],
          }}
          transition={{
            strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
            opacity: { duration: v.dur * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
          }}
        />
      ))}

      {dots.map((dot, i) => (
        <motion.circle
          key={`d-${i}`}
          cx={dot.cx}
          r={dot.r}
          fill={color}
          animate={{
            cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`],
            opacity: [opacity, opacity * 3, opacity],
          }}
          transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
        />
      ))}
    </svg>
  );
}
