"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* Expanding concentric diamond/circle bursts — energy, CTA */
const paths = [
  { d: "M700 300 L900 150 L1100 300 L900 450 Z",  delay: 0,   dur: 14 },
  { d: "M700 300 L1050 50 L1400 300 L1050 550 Z",  delay: 2,   dur: 18 },
  { d: "M700 300 L500 150 L300 300 L500 450 Z",    delay: 1,   dur: 16 },
  { d: "M700 300 L350 50 L0 300 L350 550 Z",       delay: 3,   dur: 20 },
];
const dots = [
  { cx: "30%", cy: 35, r: 1.5, delay: 0,   dur: 8,  floatPct: 4 },
  { cx: "70%", cy: 65, r: 1.5, delay: 2,   dur: 10, floatPct: 5 },
  { cx: "15%", cy: 70, r: 1,   delay: 4,   dur: 7,  floatPct: 3 },
  { cx: "85%", cy: 30, r: 1,   delay: 1.5, dur: 9,  floatPct: 4 },
];

export default function CtaBanner() {
  const [primaryHov, setPrimaryHov] = useState(false);
  const [secondaryHov, setSecondaryHov] = useState(false);

  return (
    <section className="relative aivora-section py-24 px-4 overflow-hidden">

      {/* Diamond burst bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.08" strokeDasharray="8 20"
            animate={{ strokeDashoffset: [0, -110], opacity: [0.04, 0.16, 0.04] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.55, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.12, 0.35, 0.12] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl border border-[#C12129]/30 bg-gradient-to-br from-[#C12129]/8 via-black to-black overflow-hidden px-8 py-14 text-center"
        >
          {/* Pulsing background glow */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-3xl bg-[#C12129] pointer-events-none"
            animate={{ opacity: [0.06, 0.14, 0.06], scale: [0.9, 1.08, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-[#C12129]/60 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-20 bg-gradient-to-b from-[#C12129]/60 to-transparent" />
          <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-[#C12129]/60 to-transparent" />
          <div className="absolute bottom-0 right-0 w-px h-20 bg-gradient-to-t from-[#C12129]/60 to-transparent" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4 relative z-10"
          >
            AIVORA — Smarter. Faster. Accessible.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-4 relative z-10"
          >
            Your organization&apos;s next chapter starts here.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="text-white/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8 relative z-10"
          >
            Join the growing network of ambitious organizations using AIVORA to grow smarter, move faster, and build lasting capability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 relative z-10"
          >
            {/* Primary — shimmer effect */}
            <Link
              href="/signup"
              onMouseEnter={() => setPrimaryHov(true)}
              onMouseLeave={() => setPrimaryHov(false)}
              className="relative overflow-hidden px-7 py-3 rounded-full text-sm font-bold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors"
            >
              {primaryHov && (
                <motion.span
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              )}
              <span className="relative z-10">Get Started Free</span>
            </Link>

            <Link
              href="/contact"
              onMouseEnter={() => setSecondaryHov(true)}
              onMouseLeave={() => setSecondaryHov(false)}
              className="px-7 py-3 rounded-full text-sm font-semibold border border-white/20 text-white/70 hover:border-[#C12129] hover:text-[#C12129] transition-colors"
            >
              Talk to an Expert
              <motion.span
                className="inline-block ml-1"
                animate={{ x: secondaryHov ? 3 : 0 }}
                transition={{ duration: 0.15 }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
