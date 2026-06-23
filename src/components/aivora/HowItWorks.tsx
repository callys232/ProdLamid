"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  {
    num: "01", icon: "◈", iconCls: "text-[#C12129]",  ringCls: "border-[#C12129]/40",  glowCls: "bg-[#C12129]",
    title: "Onboard",
    body: "Tell us about your organization, your challenge, and your goals. The more context you give, the smarter your experience will be.",
    authHref: "/account-type",   // registered → choose account type / dashboard
  },
  {
    num: "02", icon: "⬡", iconCls: "text-blue-400",    ringCls: "border-blue-500/40",   glowCls: "bg-blue-500",
    title: "Match",
    body: "Our AI analyzes 47 data points to surface the consultants, tools, or programs most aligned with your specific needs.",
    authHref: "/talent",          // registered → browse & get matched
  },
  {
    num: "03", icon: "⬟", iconCls: "text-violet-400",  ringCls: "border-violet-500/40", glowCls: "bg-violet-500",
    title: "Engage",
    body: "Work inside a secure, AI-assisted workspace — task boards, milestones, messaging, document sharing, and contracts in one place.",
    authHref: "/postjobs",        // registered → post a project / workspace
  },
  {
    num: "04", icon: "▣", iconCls: "text-amber-400",   ringCls: "border-amber-500/40",  glowCls: "bg-amber-500",
    title: "Measure",
    body: "Real-time dashboards track engagement progress, milestones, and ROI from kickoff to completion.",
    authHref: "/client",          // registered → client dashboard with analytics
  },
  {
    num: "05", icon: "⚡", iconCls: "text-emerald-400", ringCls: "border-emerald-500/40", glowCls: "bg-emerald-500",
    title: "Evolve",
    body: "Every engagement makes AIVORA smarter. Capabilities build, talent deepens, and your organization keeps growing.",
    authHref: "/hcd",             // registered → talent development
  },
];

/* Flowing wave path that mimics the 5-step journey */
const paths = [
  { d: "M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150", delay: 0,   dur: 20 },
  { d: "M-60 260 C200 140 400 380 700 220 C950 100 1200 340 1450 210", delay: 4, dur: 24 },
];
const dots = [
  { cx: "20%", cy: 40, r: 1.5, delay: 0,   dur: 8,  floatPct: 4 },
  { cx: "40%", cy: 65, r: 1,   delay: 2,   dur: 10, floatPct: 5 },
  { cx: "60%", cy: 35, r: 1.5, delay: 1,   dur: 7,  floatPct: 4 },
  { cx: "80%", cy: 70, r: 1,   delay: 3,   dur: 9,  floatPct: 4 },
];

export default function HowItWorks() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  return (
    <section className="relative bg-black text-white py-16 px-4 overflow-hidden">

      {/* Wave path bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.7"
            strokeOpacity="0.1" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100], opacity: [0.06, 0.2, 0.06] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.55, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {/* Animated connector line — draws left to right on viewport entry */}
        <motion.line
          x1="10%" y1="50%" x2="90%" y2="50%"
          stroke="#C12129" strokeWidth="0.5" strokeOpacity="0.12"
          strokeDasharray="4 12"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        />
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.12, 0.32, 0.12] }}
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
          className="text-center mb-14"
        >
          <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug overflow-hidden">
            {["Human", "Insight", "+"].map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
            {["Advanced", "AI."].map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.3em] text-[#C12129]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="mt-3 text-white/75 text-sm max-w-lg mx-auto">
            AIVORA combines the depth of human expertise with the speed and precision of advanced AI — across every stage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STEPS.map((step, i) => {
            const isHov = hovered === i;
            return (
              <motion.button
                key={step.num}
                type="button"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(!loading && isAuthenticated ? step.authHref : "/signup")}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                {/* Circle with pulse ring */}
                <div className="relative mb-5">
                  {/* Pulse ring on hover */}
                  <motion.div
                    className={`absolute -inset-2 rounded-full border ${step.ringCls}`}
                    animate={{ scale: isHov ? 1 : 0.7, opacity: isHov ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                  />
                  {/* Glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-md pointer-events-none ${step.glowCls}`}
                    animate={{ opacity: isHov ? 0.25 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <motion.div
                    className="relative w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center"
                    animate={{ borderColor: isHov ? `${step.ringCls}` : "rgba(255,255,255,0.1)" }}
                  >
                    <motion.span
                      className={`text-xl ${step.iconCls}`}
                      animate={{ scale: isHov ? 1.22 : 1, rotate: isHov ? 8 : 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    >
                      {step.icon}
                    </motion.span>
                  </motion.div>
                  <motion.span
                    className="absolute -top-1 -right-1 text-[9px] font-bold bg-black px-1"
                    style={{ color: isHov ? "#C12129" : "rgba(255,255,255,0.25)" }}
                    animate={{ color: isHov ? "#C12129" : "rgba(255,255,255,0.25)" }}
                    transition={{ duration: 0.18 }}
                  >
                    {step.num}
                  </motion.span>
                </div>

                <motion.h3
                  className="text-sm font-bold mb-2"
                  animate={{ color: isHov ? "#ffffff" : "#ffffff" }}
                  transition={{ duration: 0.18 }}
                >
                  {step.title}
                </motion.h3>
                <p className="text-white/80 text-xs leading-relaxed">{step.body}</p>

                {/* "Click to begin" hint — appears on hover */}
                <motion.span
                  className="text-[10px] font-semibold mt-2 text-white/30"
                  animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 4 }}
                  transition={{ duration: 0.16 }}
                >
                  {!loading && isAuthenticated ? "Open →" : "Sign up →"}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
