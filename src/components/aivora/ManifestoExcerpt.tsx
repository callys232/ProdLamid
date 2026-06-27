"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LINES = [
  { text: "We believe the future of consulting is not human or artificial —", bold: true },
  { text: "it is human and intelligent, working together.",                    bold: true },
  { text: "We believe clarity should be accessible.",                          bold: false },
  { text: "We believe growth should be simple.",                               bold: false },
  { text: "We believe organizations thrive when expertise and advanced AI",    bold: false },
  { text: "unite to unlock potential.",                                        bold: false },
];

/* Radial lines from center — declaration / manifesto energy */
const radialLines = [
  { x1: "50%", y1: "50%", x2: "5%",  y2: "10%", delay: 0,   dur: 18 },
  { x1: "50%", y1: "50%", x2: "95%", y2: "10%", delay: 3,   dur: 22 },
  { x1: "50%", y1: "50%", x2: "5%",  y2: "90%", delay: 6,   dur: 20 },
  { x1: "50%", y1: "50%", x2: "95%", y2: "90%", delay: 1.5, dur: 16 },
  { x1: "50%", y1: "50%", x2: "50%", y2: "5%",  delay: 4.5, dur: 24 },
  { x1: "50%", y1: "50%", x2: "50%", y2: "95%", delay: 7,   dur: 19 },
];
const dots = [
  { cx: "50%", cy: 50, r: 2.5, delay: 0, dur: 5,  floatPct: 2 },
  { cx: "20%", cy: 25, r: 1,   delay: 2, dur: 9,  floatPct: 4 },
  { cx: "80%", cy: 75, r: 1,   delay: 4, dur: 11, floatPct: 4 },
];

export default function ManifestoExcerpt() {
  return (
    <section className="relative aivora-section py-32 px-4 overflow-hidden">

      {/* Radial lines bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {radialLines.map((v, i) => (
          <motion.line
            key={i}
            x1={v.x1} y1={v.y1} x2={v.x2} y2={v.y2}
            stroke="#C12129" strokeWidth="0.6" strokeOpacity="0.08"
            strokeDasharray="5 25"
            animate={{ strokeDashoffset: [0, -90], opacity: [0.04, 0.16, 0.04] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: i === 0 ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      {/* Centre ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-96 h-96 rounded-full bg-[#C12129] blur-3xl"
          animate={{ opacity: [0.02, 0.06, 0.02], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-8"
        >
          Our Belief
        </motion.p>

        <div className="space-y-2 mb-10">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`leading-relaxed ${
                line.bold
                  ? "text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                  : "text-base sm:text-lg text-gray-500 dark:text-white/60"
              }`}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold aivora-gradient-text hover:opacity-80 transition-opacity group"
          >
            Read the full AIVORA manifesto
            <motion.span
              className="group-hover:translate-x-1 transition-transform"
            >
              →
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
