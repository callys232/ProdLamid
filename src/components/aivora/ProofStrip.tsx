"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const STATS = [
  { value: "14+",   label: "Organizations" },
  { value: "120+",  label: "Verified Experts" },
  { value: "4.8/5", label: "Platform Rating" },
  { value: "3",     label: "Integrated Portals" },
];

/* Horizontal dashes — calm, structured */
const paths = [
  { d: "M-40 30  Q300 20  700 35  Q1000 48 1400 28",  delay: 0,   dur: 16 },
  { d: "M-40 60  Q400 72  800 58  Q1100 44 1400 65",  delay: 2.5, dur: 20 },
  { d: "M-40 90  Q350 80  750 95  Q1050 108 1400 88", delay: 5,   dur: 18 },
];
const dots = [
  { cx: "8%",  cy: 50, r: 1,   delay: 0,   dur: 6,  floatPct: 2 },
  { cx: "50%", cy: 50, r: 1.5, delay: 1.5, dur: 8,  floatPct: 2 },
  { cx: "92%", cy: 50, r: 1,   delay: 3,   dur: 7,  floatPct: 2 },
];

export default function ProofStrip() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-black border-y border-white/8 py-5 overflow-hidden">

      {/* Horizontal dashes bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.12" strokeDasharray="6 24"
            animate={{ strokeDashoffset: [0, -90], opacity: [0.08, 0.22, 0.08] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.4 }}
              onHoverStart={() => setHoveredIdx(i)}
              onHoverEnd={() => setHoveredIdx(null)}
              className="flex items-center gap-3 cursor-default select-none"
            >
              <motion.span
                className="text-xl sm:text-2xl font-bold text-[#C12129]"
                animate={{ scale: hoveredIdx === i ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {stat.value}
              </motion.span>
              <motion.span
                className="text-xs sm:text-sm font-medium"
                animate={{ color: hoveredIdx === i ? "#ffffff" : "rgba(255,255,255,0.45)" }}
                transition={{ duration: 0.18 }}
              >
                {stat.label}
              </motion.span>
              {i < STATS.length - 1 && (
                <span className="hidden sm:block w-px h-5 bg-white/12 ml-3" />
              )}
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-white/25 text-xs tracking-widest uppercase hidden lg:block"
          >
            Trusted by organizations seeking clarity and growth
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
