"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { quote: "AIVORA gave us access to verified expertise we couldn't find locally — and delivered results in half the time we expected. The AI matching was remarkably accurate.", name: "Chief Operating Officer", org: "Technology Group, UAE",          initial: "C", accentCls: "bg-[#C12129]" },
  { quote: "As an SME navigating scale-up, the BIZ diagnostics gave us a clear picture of our gaps. We walked away with a roadmap, not just a report.",                          name: "Chief Executive Officer",   org: "FinTech Startup, Nigeria",      initial: "C", accentCls: "bg-blue-600"   },
  { quote: "The Talent Development portal transformed how we build capability across our teams. The structured learning journeys and program quality speak for themselves.",        name: "Chief People Officer",      org: "Professional Services Firm, UK", initial: "C", accentCls: "bg-orange-500" },
];

/* Gentle arcs — human warmth */
const paths = [
  { d: "M-100 400 Q350 100 700 350 Q1050 600 1450 200", delay: 0,   dur: 22 },
  { d: "M-100 250 Q400 500 750 200 Q1100 -100 1450 350", delay: 5,  dur: 26 },
];
const dots = [
  { cx: "10%", cy: 60, r: 1.5, delay: 0,   dur: 10, floatPct: 5 },
  { cx: "90%", cy: 40, r: 1,   delay: 2.5, dur: 8,  floatPct: 4 },
  { cx: "45%", cy: 80, r: 1.5, delay: 1,   dur: 12, floatPct: 5 },
  { cx: "70%", cy: 15, r: 1,   delay: 4,   dur: 9,  floatPct: 4 },
];

export default function AivoraTestimonials() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative bg-black text-white py-16 px-4 overflow-hidden">

      {/* Arc bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.09" strokeDasharray="14 28"
            animate={{ strokeDashoffset: [0, -150], opacity: [0.05, 0.16, 0.05] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            Client Voices
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            Organizations That{" "}
            <span className="text-[#C12129]">Refuse to Stand Still.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={t.org}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                animate={{ y: isHov ? -5 : 0 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="relative bg-white/[0.025] border border-white/8 rounded-2xl p-7 flex flex-col overflow-hidden cursor-default"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.3)" : "rgba(255,255,255,0.08)" }}
              >
                {/* Top glow */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-16 rounded-full blur-2xl bg-[#C12129] pointer-events-none"
                  animate={{ opacity: isHov ? 0.1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Stars — sequential reveal */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <motion.span
                      key={s}
                      className="text-[#C12129] text-sm"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 + s * 0.07, duration: 0.25, type: "spring" }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Large opening quote */}
                <motion.span
                  className="text-5xl font-serif text-[#C12129]/20 leading-none -mb-2 select-none"
                  animate={{ opacity: isHov ? 0.4 : 0.15 }}
                  transition={{ duration: 0.25 }}
                >
                  "
                </motion.span>

                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6 italic">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.accentCls} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.org}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-white/20 text-xs mt-8 tracking-wide"
        >
          Testimonials will be replaced with verified client quotes before launch.
        </motion.p>
      </div>
    </section>
  );
}
