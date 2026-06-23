"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const STATS = [
  { value: "74%", label: "of organizations report fragmented consulting delivery", authHref: "/postjobs" },
  { value: "60%", label: "of consulting engagements fail to achieve stated goals", authHref: "/talent"   },
  { value: "40%", label: "faster delivery with AI-assisted project management",    authHref: "/premium/business-diagnostic" },
];

/* Vertical column lines — data/intelligence feel */
const paths = [
  { d: "M200 -20 L200 120%",  delay: 0,   dur: 18 },
  { d: "M500 -20 L500 120%",  delay: 2,   dur: 22 },
  { d: "M800 -20 L800 120%",  delay: 4,   dur: 20 },
  { d: "M1100 -20 L1100 120%",delay: 1,   dur: 24 },
];
const dots = [
  { cx: "18%", cy: 25, r: 1.5, delay: 0,   dur: 9,  floatPct: 5 },
  { cx: "75%", cy: 55, r: 1,   delay: 2.5, dur: 7,  floatPct: 4 },
  { cx: "40%", cy: 80, r: 1.5, delay: 1,   dur: 11, floatPct: 5 },
  { cx: "90%", cy: 20, r: 1,   delay: 3,   dur: 8,  floatPct: 4 },
];

export default function AivoraGap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const dest = (href: string) => (!loading && isAuthenticated ? href : "/signup");

  return (
    <section className="relative bg-black text-white py-16 px-4 overflow-hidden">

      {/* Vertical column lines bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.09" strokeDasharray="4 28"
            animate={{ strokeDashoffset: [0, -80], opacity: [0.05, 0.18, 0.05] }}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
              Why AIVORA Exists
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
              The Gap We Were{" "}
              <span className="text-[#C12129]">Built to Close.</span>
            </h2>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-4">
              Most organizations operate with fragmented tools, inconsistent expertise, and no unified delivery system. The result: costly trial and error, slow decisions, and outcomes that never quite match the brief.
            </p>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed">
              AIVORA was built to change this — combining trusted human expertise with advanced AI in one ecosystem, giving every organization access to the intelligence, talent, and systems they need to grow smarter and faster.
            </p>
          </motion.div>

          {/* Right — stat cards */}
          <div className="flex flex-col gap-4">
            {STATS.map((stat, i) => {
              const isHov = hovered === i;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.45 }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  animate={{ y: isHov ? -3 : 0 }}
                  onClick={() => router.push(dest(stat.authHref))}
                  className="relative flex items-start gap-5 bg-white/[0.03] border rounded-xl p-5 overflow-hidden cursor-pointer"
                  style={{ borderColor: isHov ? "#C1212955" : "rgba(255,255,255,0.08)" }}
                >
                  {/* Left accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-[#C12129]"
                    animate={{ scaleY: isHov ? 1 : 0, originY: 0 }}
                    transition={{ duration: 0.2 }}
                  />

                  <motion.span
                    className="text-3xl font-bold text-[#C12129] shrink-0 leading-none"
                    animate={{ scale: isHov ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    {stat.value}
                  </motion.span>
                  <div className="flex-1">
                    <p className="text-white/75 text-sm leading-relaxed">{stat.label}</p>
                    <motion.span
                      className="text-[10px] font-semibold text-white/30 mt-1 block"
                      animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                      transition={{ duration: 0.16 }}
                    >
                      {!loading && isAuthenticated ? "Explore solution →" : "Sign up →"}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
