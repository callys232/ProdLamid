"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  {
    num: "01", icon: "◈", iconCls: "text-[#C12129]",  ringCls: "border-[#C12129]/40",  glowCls: "bg-[#C12129]",  accentHex: "#C12129",
    title: "Onboard",
    body: "Join AIVORA and complete an AI-powered diagnostic that maps your organization's unique growth profile, capability gaps, and strategic priorities.",
    authHref: "/premium/business-diagnostic",
  },
  {
    num: "02", icon: "⬡", iconCls: "text-blue-400",   ringCls: "border-blue-500/40",   glowCls: "bg-blue-500",   accentHex: "#3b82f6",
    title: "Match",
    body: "The platform instantly connects you with the right consultants, intelligence tools, and learning pathways — calibrated to your specific context.",
    authHref: "/talent",
  },
  {
    num: "03", icon: "⬟", iconCls: "text-violet-400", ringCls: "border-violet-500/40", glowCls: "bg-violet-500", accentHex: "#7c3aed",
    title: "Engage",
    body: "Projects, workshops, AI analyses, and learning cohorts run through a unified, managed digital environment. Everything in one place.",
    authHref: "/premium/proposal-drafter",
  },
  {
    num: "04", icon: "▣", iconCls: "text-amber-400",  ringCls: "border-amber-500/40",  glowCls: "bg-amber-500",  accentHex: "#f59e0b",
    title: "Measure",
    body: "Real-time dashboards track outcomes, ROI, and organizational progress at every stage. Nothing is a black box.",
    authHref: "/client",
  },
  {
    num: "05", icon: "⚡", iconCls: "text-emerald-400",ringCls: "border-emerald-500/40",glowCls: "bg-emerald-500",accentHex: "#10b981",
    title: "Evolve",
    body: "AIVORA's AI continuously refines its recommendations as your organization grows, learns, and changes. The platform grows with you.",
    authHref: "/hcd",
  },
];

/* Flowing wave path */
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

const QUICK_TOOLS = [
  { label: "Business Diagnostic", href: "/premium/business-diagnostic", icon: "⚡", accent: "#b45309" },
  { label: "Proposal Drafter",    href: "/premium/proposal-drafter",    icon: "◈", accent: "#C12129" },
  { label: "Budget Estimator",    href: "/postjobs?tool=estimator",     icon: "▣", accent: "#eab308" },
  { label: "Expert Advisor",      href: "/concierge",                   icon: "✦", accent: "#7c3aed" },
];

const ALL_FREE_TOOLS = [
  { id: "diagnostic",   icon: "⚡", accent: "#b45309", title: "Business Diagnostic",  desc: "AI-powered health check across 7 business dimensions.", href: "/premium/business-diagnostic" },
  { id: "proposal",     icon: "◈", accent: "#C12129", title: "Proposal Drafter",      desc: "Generate a client-ready consulting proposal in seconds.", href: "/premium/proposal-drafter" },
  { id: "estimator",    icon: "▣", accent: "#eab308", title: "Budget Estimator",      desc: "AI-assisted project cost & timeline estimator.",          href: "/postjobs?tool=estimator" },
  { id: "advisor",      icon: "✦", accent: "#7c3aed", title: "Expert Advisor",        desc: "Managed, high-touch delivery for complex engagements.",   href: "/concierge" },
  { id: "talent",       icon: "◈", accent: "#C12129", title: "Browse Consultants",    desc: "Search AIVORA's verified marketplace across every sector.", href: "/talent" },
  { id: "bizprototype", icon: "⬡", accent: "#2563eb", title: "Biz Prototypes",        desc: "Explore startup methodology and rapid build tools.",         href: "/bizprototype" },
  { id: "jobs",         icon: "▣", accent: "#d97706", title: "Job Board",             desc: "Explore open roles — contract, permanent, short-term.",     href: "/jobs" },
  { id: "events",       icon: "✦", accent: "#7c3aed", title: "Events & Training",     desc: "Upcoming Talent Development events and workshops.",          href: "/events" },
  { id: "biz",          icon: "⬡", accent: "#4f46e5", title: "BIZ Portal",            desc: "Startup toolkits, growth diagnostics, coaching resources.", href: "/biz" },
  { id: "hcd",          icon: "⬟", accent: "#f97316", title: "Talent Development",    desc: "Recruitment, capability building, leadership development.",  href: "/hcd" },
];

const toolStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const toolCard = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  const [hovered,       setHovered]       = useState<number | null>(null);
  const [showFreeTools, setShowFreeTools] = useState(false);
  const [hoveredTool,   setHoveredTool]   = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  return (
    <>
    <section id="how-it-works" className="relative aivora-section py-16 px-4 overflow-hidden">

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
            The AIVORA Experience
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
            From challenge to clarity —{" "}
            <span className="text-[#C12129]">in five steps.</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-white/75 text-sm max-w-lg mx-auto">
            AIVORA combines the depth of human expertise with the speed and precision of advanced AI — across every stage.
          </p>
        </motion.div>

        {/* Quick-access tool strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <span className="text-xs aivora-text-muted tracking-wider uppercase shrink-0">Quick access:</span>

          {QUICK_TOOLS.map((tool) => (
            <motion.button
              key={tool.label}
              type="button"
              onClick={() => router.push(tool.href)}
              whileHover={{
                scale: 1.05,
                borderColor: tool.accent,
                color: tool.accent,
                boxShadow: `0 0 14px ${tool.accent}55, inset 0 0 8px ${tool.accent}18`,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-white/15 dark:border-white/15 text-gray-600 dark:text-white/60 cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <motion.span
                whileHover={{ scale: 1.25, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
              >
                {tool.icon}
              </motion.span>
              {tool.label}
            </motion.button>
          ))}

          {/* View All — opens full tools modal */}
          <motion.button
            type="button"
            onClick={() => setShowFreeTools(true)}
            whileHover={{
              scale: 1.05,
              borderColor: "#C12129",
              color: "#ffffff",
              backgroundColor: "rgba(193,33,41,0.15)",
              boxShadow: "0 0 14px rgba(193,33,41,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-[#C12129]/40 text-[#C12129] cursor-pointer"
          >
            View All →
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                animate={{ y: isHov ? -6 : 0 }}
                onClick={() => router.push(step.authHref)}
                className="relative flex flex-col items-center text-center cursor-pointer group rounded-2xl p-5 overflow-hidden border transition-colors duration-300"
                style={{
                  borderColor: isHov ? `${step.accentHex}55` : "rgba(255,255,255,0.08)",
                  background: isHov ? `${step.accentHex}12` : "rgba(255,255,255,0.025)",
                }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ opacity: isHov ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ background: `radial-gradient(circle at 50% 30%, ${step.accentHex}18, transparent 70%)` }}
                />

                {/* Top accent bar — slides in on hover */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${step.accentHex}, transparent)` }}
                  animate={{ scaleX: isHov ? 1 : 0, originX: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />

                {/* Circle icon */}
                <div className="relative mb-4 mt-1">
                  <motion.div
                    className={`absolute -inset-2 rounded-full border ${step.ringCls}`}
                    animate={{ scale: isHov ? 1 : 0.7, opacity: isHov ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-md pointer-events-none ${step.glowCls}`}
                    animate={{ opacity: isHov ? 0.3 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <div className="relative w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 flex items-center justify-center">
                    <motion.span
                      className={`text-lg ${step.iconCls}`}
                      animate={{ scale: isHov ? 1.22 : 1, rotate: isHov ? 8 : 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    >
                      {step.icon}
                    </motion.span>
                  </div>
                  <motion.span
                    className="absolute -top-1 -right-1 text-[9px] font-bold bg-white dark:bg-black px-1"
                    animate={{ color: isHov ? step.accentHex : "rgba(255,255,255,0.25)" }}
                    transition={{ duration: 0.18 }}
                  >
                    {step.num}
                  </motion.span>
                </div>

                <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-white/75 text-xs leading-relaxed">{step.body}</p>

                <motion.span
                  className="text-[10px] font-semibold mt-3"
                  style={{ color: step.accentHex }}
                  animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                  transition={{ duration: 0.16 }}
                >
                  Open →
                </motion.span>
              </motion.button>
            );
          })}
        </div>
        {/* Copy doc: "Ready to begin? Get Started Free" below the steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12"
        >
          <p className="text-gray-600 dark:text-white/60 text-sm">Ready to begin?</p>
          <button
            type="button"
            onClick={() => router.push("/premium/business-diagnostic")}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden
              bg-[#C12129] hover:bg-[#a01a20] transition-colors duration-300
              shadow-[0_0_18px_rgba(193,33,41,0.4)] hover:shadow-[0_0_28px_rgba(193,33,41,0.7)]"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
            <span className="relative z-10">Get Started Free</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

      </div>
    </section>

    {/* ── All Free Tools Modal ── */}
    <AnimatePresence>
      {showFreeTools && (
        <motion.div
          key="hw-ft-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          onClick={() => setShowFreeTools(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-[3px] bg-gradient-to-r from-[#C12129] to-transparent" />
            <div className="px-6 pt-6 pb-7">
              <button
                type="button"
                onClick={() => setShowFreeTools(false)}
                className="absolute top-5 right-5 text-white/30 hover:text-white transition text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
              <p className="text-[#C12129] text-[10px] tracking-[0.3em] uppercase font-bold mb-1">
                No credit card needed
              </p>
              <h2 className="text-xl font-bold text-white mb-1">All Free Tools</h2>
              <p className="text-white/45 text-xs mb-6 leading-snug">
                Use any tool instantly. Sign up to save your results.
              </p>
              <div className="h-px bg-white/8 mb-5" />
              <motion.div
                variants={toolStagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                {ALL_FREE_TOOLS.map((tool) => {
                  const isHov = hoveredTool === tool.id;
                  return (
                    <motion.div key={tool.id} variants={toolCard}>
                      <motion.div
                        onHoverStart={() => setHoveredTool(tool.id)}
                        onHoverEnd={() => setHoveredTool(null)}
                        animate={{
                          borderColor: isHov ? `${tool.accent}55` : "rgba(255,255,255,0.07)",
                          boxShadow:   isHov ? `0 0 16px ${tool.accent}30` : "0 0 0px transparent",
                        }}
                        transition={{ duration: 0.2 }}
                        className="group relative flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.06] overflow-hidden cursor-pointer"
                      >
                        <Link
                          href={tool.href}
                          onClick={() => setShowFreeTools(false)}
                          className="absolute inset-0 z-10"
                          aria-label={tool.title}
                        />

                        {/* Left accent bar */}
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl origin-top"
                          animate={{
                            scaleY:          isHov ? 1 : 0,
                            backgroundColor: tool.accent,
                          }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Glow */}
                        <motion.div
                          className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                          animate={{
                            opacity:         isHov ? 0.12 : 0,
                            backgroundColor: tool.accent,
                          }}
                          transition={{ duration: 0.25 }}
                        />

                        {/* Icon */}
                        <motion.span
                          className="text-lg shrink-0 mt-0.5 relative z-20"
                          animate={{ color: tool.accent, scale: isHov ? 1.2 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        >
                          {tool.icon}
                        </motion.span>

                        <div className="flex-1 min-w-0 relative z-20">
                          <p className="text-sm font-semibold text-white leading-tight">{tool.title}</p>
                          <p className="text-white/75 text-xs mt-0.5 leading-snug">{tool.desc}</p>
                        </div>

                        <motion.span
                          className="shrink-0 self-center text-xs relative z-20"
                          animate={{ color: tool.accent, opacity: isHov ? 1 : 0, x: isHov ? 0 : -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
