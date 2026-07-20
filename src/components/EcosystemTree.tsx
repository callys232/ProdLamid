"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CYCLE_MS = 9000; // full draw + hold + fade, then restart

const ENGINES = [
  { id: "CORE",    label: "CORE",    sub: "Strategy & Execution", cx: 85,  cy: 165, color: "#2563EB", delay: 2.0 },
  { id: "GROW",    label: "GROW",    sub: "Customer & Digital",   cx: 320, cy: 145, color: "#3B82F6", delay: 2.3 },
  { id: "TALENT",  label: "TALENT",  sub: "People Intelligence",  cx: 68,  cy: 295, color: "#2563EB", delay: 2.6 },
  { id: "FINANCE", label: "FINANCE", sub: "Financial Clarity",    cx: 342, cy: 275, color: "#F59E0B", delay: 2.9 },
];

const TRUNK = "M 200 475 C 200 430 200 370 200 288";

const BRANCHES = [
  { id: "CORE",    d: "M 200 288 C 190 265 140 218 85 165",  delay: 1.1 },
  { id: "GROW",    d: "M 200 288 C 210 262 272 208 320 145", delay: 1.4 },
  { id: "TALENT",  d: "M 200 312 C 178 312 118 306 68 295",  delay: 1.7 },
  { id: "FINANCE", d: "M 200 312 C 222 312 288 298 342 275", delay: 2.0 },
];

const ROOTS = [
  { d: "M 200 475 C 170 490 128 498 88 508",  delay: 0.1, dur: 1.4 },
  { d: "M 200 475 C 185 493 162 500 138 512", delay: 0.2, dur: 1.3 },
  { d: "M 200 475 C 200 492 200 502 200 518", delay: 0.0, dur: 1.2 },
  { d: "M 200 475 C 215 493 238 500 262 512", delay: 0.2, dur: 1.3 },
  { d: "M 200 475 C 230 490 272 498 312 508", delay: 0.1, dur: 1.4 },
  { d: "M 88 508  C 68 514 48 512 28 516",    delay: 0.5, dur: 1.0 },
  { d: "M 312 508 C 332 514 352 512 372 516", delay: 0.5, dur: 1.0 },
];

const TWIGS = [
  { d: "M 85 165  C 65 148 52 138 38 126",    delay: 2.4, dur: 0.7 },
  { d: "M 85 165  C 72 146 62 134 48 120",    delay: 2.5, dur: 0.7 },
  { d: "M 320 145 C 340 126 352 116 366 104", delay: 2.7, dur: 0.7 },
  { d: "M 320 145 C 334 128 346 118 362 110", delay: 2.8, dur: 0.7 },
  { d: "M 68 295  C 46 288 28 282 12 276",    delay: 3.0, dur: 0.7 },
  { d: "M 342 275 C 362 266 376 258 392 250", delay: 3.2, dur: 0.7 },
];

const MID_DOTS = [
  { cx: 142, cy: 226, color: "#2563EB", delay: 2.2 },
  { cx: 260, cy: 216, color: "#3B82F6", delay: 2.5 },
  { cx: 134, cy: 303, color: "#2563EB", delay: 2.8 },
  { cx: 271, cy: 294, color: "#F59E0B", delay: 3.1 },
];

function AP({
  d, delay, dur = 1.2, w = 2, color = "#2563EB", opacity = 1,
}: {
  d: string; delay: number; dur?: number; w?: number; color?: string; opacity?: number;
}) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={w}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: dur, delay, ease: "easeInOut" }}
      style={{ opacity }}
    />
  );
}

export default function EcosystemTree({ className }: { className?: string }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearTimeout(id);
  }, [cycle]);

  return (
    <div
      className={`relative select-none ${className ?? "w-full max-w-sm lg:max-w-[380px] xl:max-w-[420px]"}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 -10 400 540"
        className="h-full w-auto aspect-[400/540] overflow-visible [filter:drop-shadow(0_0_22px_rgba(37,99,235,0.18))]"
      >
        {/* Entire drawing re-mounts each cycle — fades in, holds, fades out */}
        <motion.g
          key={cycle}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: CYCLE_MS / 1000,
            times: [0, 0.06, 0.84, 1],
            ease: "easeInOut",
          }}
        >
          {/* ── Roots ── */}
          <g opacity={0.38}>
            {ROOTS.map((r, i) => (
              <AP key={i} d={r.d} delay={r.delay} dur={r.dur} w={1.2} />
            ))}
          </g>

          {/* ── Trunk glow + core ── */}
          <AP d={TRUNK} delay={0.5} dur={1.8} w={14} color="#2563EB" opacity={0.07} />
          <AP d={TRUNK} delay={0.5} dur={1.8} w={3.5} />

          {/* ── Branches ── */}
          {BRANCHES.map((b) => (
            <g key={b.id}>
              <AP d={b.d} delay={b.delay - 0.1} dur={1.2} w={9}   color="#93c5fd" opacity={0.08} />
              <AP d={b.d} delay={b.delay}        dur={1.2} w={2} />
            </g>
          ))}

          {/* ── Twigs ── */}
          <g opacity={0.42}>
            {TWIGS.map((t, i) => (
              <AP key={i} d={t.d} delay={t.delay} dur={t.dur} w={1} color="#3B82F6" />
            ))}
          </g>

          {/* ── Mid-branch pulsing dots ── */}
          {MID_DOTS.map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r={3}
              fill={dot.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.75, 0.4, 0.75], scale: 1 }}
              transition={{
                opacity: {
                  duration: 2.6,
                  delay: dot.delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
                scale: { duration: 0.4, delay: dot.delay },
              }}
              style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
            />
          ))}

          {/* ── LAMID ONE trunk label ── */}
          <motion.text
            x={215}
            y={276}
            fill="rgba(147,197,253,0.48)"
            fontSize={7.5}
            fontWeight="700"
            fontFamily="monospace"
            letterSpacing="0.18em"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.9 }}
          >
            LAMID ONE
          </motion.text>

          {/* ── Engine nodes ── */}
          {ENGINES.map((e) => (
            <motion.g
              key={e.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: e.delay, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${e.cx}px ${e.cy}px` }}
            >
              {/* Pulsing outer ring */}
              <motion.circle
                cx={e.cx}
                cy={e.cy}
                fill="none"
                stroke={e.color}
                strokeWidth={1}
                animate={{ r: [20, 30, 20], opacity: [0.28, 0.05, 0.28] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: e.delay + 0.6,
                }}
              />
              <circle cx={e.cx} cy={e.cy} r={15} fill={`${e.color}14`} stroke={e.color} strokeWidth={1.5} />
              <circle cx={e.cx} cy={e.cy} r={3.5} fill={e.color} opacity={0.85} />
              <text
                x={e.cx} y={e.cy - 23}
                textAnchor="middle"
                fill={e.color}
                fontSize={8.5}
                fontWeight="700"
                fontFamily="monospace"
                letterSpacing="0.12em"
              >
                {e.label}
              </text>
              <text
                x={e.cx} y={e.cy + 30}
                textAnchor="middle"
                fill="rgba(148,163,184,0.58)"
                fontSize={6.5}
                fontFamily="system-ui, sans-serif"
              >
                {e.sub}
              </text>
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
