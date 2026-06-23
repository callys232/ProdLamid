"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const TILES = [
  { icon: "◈", iconCls: "text-[#C12129]",  accentColor: "#C12129", authHref: "/talent",                    title: "Integrated by Design",        body: "Marketplace, BIZ Portal, and Talent Development are not separate products — they are one ecosystem, built to work together from day one." },
  { icon: "⬡", iconCls: "text-blue-400",   accentColor: "#3b82f6", authHref: "/talent",                    title: "AI + Experts",                 body: "Advanced AI accelerates matching, delivery, and diagnostics. Human expertise ensures every outcome is grounded in real-world knowledge." },
  { icon: "⬟", iconCls: "text-emerald-400",accentColor: "#10b981", authHref: "/pricing",                   title: "Accessible at Every Scale",    body: "Whether you're a growing SME or a global enterprise, AIVORA scales with you. No gatekeepers. No complexity. Built for the realities of today." },
  { icon: "⚡", iconCls: "text-amber-400",  accentColor: "#f59e0b", authHref: "/postjobs",                  title: "Outcomes, Not Outputs",        body: "We measure success by what your organization achieves — not the number of reports delivered. Every engagement is built around measurable results." },
];

/* Cross-hatch / grid feel — structure and precision */
const paths = [
  { d: "M0 100 L1400 100",   delay: 0,   dur: 25, dash: "6 40" },
  { d: "M0 300 L1400 300",   delay: 5,   dur: 28, dash: "6 40" },
  { d: "M0 500 L1400 500",   delay: 10,  dur: 22, dash: "6 40" },
  { d: "M300 0 L300 700",    delay: 2,   dur: 26, dash: "6 40" },
  { d: "M700 0 L700 700",    delay: 7,   dur: 24, dash: "6 40" },
  { d: "M1100 0 L1100 700",  delay: 12,  dur: 20, dash: "6 40" },
];
const dots = [
  { cx: "25%", cy: 30, r: 1.5, delay: 0,   dur: 9,  floatPct: 3 },
  { cx: "75%", cy: 70, r: 1,   delay: 2,   dur: 11, floatPct: 3 },
  { cx: "50%", cy: 50, r: 1.5, delay: 4,   dur: 8,  floatPct: 4 },
];

export default function WhyAivora() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const dest = (href: string) => (!loading && isAuthenticated ? href : "/signup");

  return (
    <section className="relative bg-black text-white py-16 px-4 overflow-hidden">

      {/* Grid / cross-hatch bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.5"
            strokeOpacity="0.07" strokeDasharray={v.dash}
            animate={{ strokeDashoffset: [0, -100], opacity: [0.04, 0.14, 0.04] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.1, 0.28, 0.1] }}
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
          className="mb-12"
        >
          <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            Why AIVORA
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            Built Different.{" "}
            <span className="text-[#C12129]">Delivered Differently.</span>
          </h2>
          <div className="mt-6 h-px bg-gradient-to-r from-[#C12129]/40 via-white/10 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TILES.map((tile, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: i * 0.09 }}
                animate={{ y: isHov ? -5 : 0 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="relative bg-white/[0.025] border rounded-2xl p-7 overflow-hidden cursor-pointer"
                style={{ borderColor: isHov ? `${tile.accentColor}55` : "rgba(255,255,255,0.08)" }}
                onClick={() => router.push(dest(tile.authHref))}
              >
                {/* Glow */}
                <motion.div
                  className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                  style={{ background: tile.accentColor }}
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Bottom sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                  style={{ background: `linear-gradient(to right, ${tile.accentColor}, transparent)` }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                />

                <motion.span
                  className={`text-3xl block mb-4 ${tile.iconCls}`}
                  animate={{ scale: isHov ? 1.18 : 1, rotate: isHov ? 10 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {tile.icon}
                </motion.span>
                <h3 className="text-base font-bold text-white mb-2">{tile.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-3">{tile.body}</p>
                <motion.span
                  className="text-[10px] font-semibold text-white/30"
                  animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                  transition={{ duration: 0.16 }}
                >
                  {!loading && isAuthenticated ? "Open →" : "Sign up →"}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
