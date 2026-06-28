"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ── Learning journey steps ── */
const JOURNEY = [
  { num: 1, title: "Assess",        body: "AI analyses your current skills, experience, and goals to create a baseline competency map.",                                   href: "/premium/business-diagnostic" },
  { num: 2, title: "Learn",         body: "Personalised learning paths adapt in real-time. AI curates content, paces your learning, and identifies gaps.",                href: "/events" },
  { num: 3, title: "Certify & Grow",body: "Earn micro-certifications, build your portfolio, and get matched with opportunities.",                                          href: "/hcd/recruitment" },
];

/* ── 4 Feature cards ── */
const FEATURES = [
  { icon: "⚡", title: "Adaptive Learning AI",   body: "Content difficulty and pacing adjust automatically based on your performance.",           href: "/events" },
  { icon: "◈", title: "Micro-Certifications",    body: "Industry-recognised credentials you can earn in days, not months.",                       href: "/hcd/recruitment" },
  { icon: "⬡", title: "Mentorship Matching",     body: "AI pairs you with mentors who have walked your career path.",                             href: "/talent" },
  { icon: "⬟", title: "Career Intelligence",     body: "AI-powered career trajectory modelling and opportunity alerts.",                           href: "/jobs" },
];

/* ── Impact stats ── */
const STATS = [
  { value: "3×",  label: "Faster skill acquisition vs. traditional learning" },
  { value: "92%", label: "Certification completion rate" },
  { value: "40%", label: "Average salary increase within 12 months" },
];

/* ── 6 Program categories — redesigned with outcome statements ── */
const PROGRAMS = [
  {
    icon: "⚡",
    title: "Strategic Leadership & Executive Effectiveness",
    outcome: "Lead with confidence. Build decision-makers who move organisations forward — not just manage them.",
    href: "/events",
  },
  {
    icon: "◈",
    title: "AI Literacy & Digital Strategy for Leaders",
    outcome: "Stop guessing about AI. Own the strategy. Lead digital transformation with clarity and intent.",
    href: "/events",
  },
  {
    icon: "⬡",
    title: "Financial Acumen & Business Performance",
    outcome: "Read the numbers like a CFO. Drive performance like an operator. Speak the language of growth.",
    href: "/events",
  },
  {
    icon: "⬟",
    title: "Organisational Design & Change Management",
    outcome: "Build structures that scale. Lead change that sticks. Design organisations built for the future.",
    href: "/events",
  },
  {
    icon: "▣",
    title: "Sales, Growth & Business Development",
    outcome: "Fill the pipeline. Open markets. Build a business development engine that runs without you.",
    href: "/events",
  },
  {
    icon: "✦",
    title: "Operational Excellence & Process Improvement",
    outcome: "Cut the waste. Lift the margins. Make excellence the default — not the exception.",
    href: "/events",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function HCDPage() {
  const [hoveredFeature,  setHoveredFeature]  = useState(null);
  const [hoveredStep,     setHoveredStep]     = useState(null);
  const [hoveredProgram,  setHoveredProgram]  = useState(null);
  const [programsOpen,    setProgramsOpen]    = useState(false);
  const router = useRouter();

  return (
    <div className="aivora-section min-h-screen">

      {/* ── Hero ── */}
      <section className="relative px-4 pt-28 pb-10 text-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <motion.path d="M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150"
            fill="none" stroke="#C12129" strokeWidth="0.6" strokeOpacity="0.07" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </svg>
        <motion.div {...fadeUp(0)} className="relative z-10 max-w-3xl mx-auto">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">AIVORA Talent Portal</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span className="aivora-gradient-text">Your AI-Powered Career Engine</span>
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Personalised learning paths, micro-certifications, and career development powered by AI — built for the modern professional.
          </p>
        </motion.div>
      </section>

      {/* ── Your Learning Journey ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Your Learning Journey
          </motion.h2>
          {/* Desktop: horizontal with connecting line */}
          <div className="hidden sm:grid grid-cols-3 gap-6 relative">
            <motion.div className="absolute top-[52px] left-[20%] right-[20%] h-[2px]"
              style={{ background: "linear-gradient(to right, #C12129, #ff6060, #C12129)" }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
            {JOURNEY.map((step, i) => {
              const isHov = hoveredStep === i;
              return (
                <motion.div key={step.num} {...fadeUp(i * 0.1)}
                  onHoverStart={() => setHoveredStep(i)} onHoverEnd={() => setHoveredStep(null)}
                  onClick={() => router.push(step.href)}
                  whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(193,33,41,0.18)" }} whileTap={{ scale: 0.97 }}
                  className="aivora-card border rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}
                >
                  <motion.div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-5 bg-[#C12129] relative z-10"
                    animate={{ scale: isHov ? 1.12 : 1, boxShadow: isHov ? "0 0 24px rgba(193,33,41,0.6)" : "none" }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}>
                    {step.num}
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
          {/* Mobile: vertical */}
          <div className="flex flex-col gap-4 sm:hidden">
            {JOURNEY.map((step, i) => {
              const isHov = hoveredStep === i + 10;
              return (
                <motion.div key={step.num} {...fadeUp(i * 0.08)}
                  onHoverStart={() => setHoveredStep(i + 10)} onHoverEnd={() => setHoveredStep(null)}
                  onClick={() => router.push(step.href)}
                  whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                  className="aivora-card border rounded-2xl p-5 flex items-start gap-4 cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#C12129] shrink-0">{step.num}</div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{step.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 Feature cards ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => {
            const isHov = hoveredFeature === i;
            return (
              <motion.div key={f.title} {...fadeUp(i * 0.08)}
                onHoverStart={() => setHoveredFeature(i)} onHoverEnd={() => setHoveredFeature(null)}
                onClick={() => router.push(f.href)}
                whileHover={{ y: -5, boxShadow: "0 14px 34px rgba(193,33,41,0.16)" }} whileTap={{ scale: 0.97 }}
                className="aivora-card border rounded-2xl p-6 cursor-pointer"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}>
                <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#C12129]/12 border border-[#C12129]/25"
                  animate={{ scale: isHov ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                  <span className="text-base aivora-gradient-text">{f.icon}</span>
                </motion.div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{f.body}</p>
                <motion.span className="text-[10px] font-semibold mt-3 block aivora-gradient-text"
                  animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }} transition={{ duration: 0.15 }}>
                  Open →
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Impact stats ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.1)}
              whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(193,33,41,0.15)" }}
              className="aivora-card border rounded-2xl p-8 text-center">
              <p className="text-4xl sm:text-5xl font-extrabold aivora-gradient-text mb-3">{s.value}</p>
              <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Enterprise enrollment + Programs button (final CTA) ── */}
      <section className="px-4 pb-12">
        <motion.div {...fadeUp(0)}
          className="max-w-4xl mx-auto rounded-2xl border border-[#C12129]/30 bg-gradient-to-br from-[#C12129]/8 via-transparent to-transparent p-10 text-center">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">For Teams</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Transform your entire organisation — not just individuals.
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Enterprise cohort programs enroll entire departments, each receiving personalised paths within a shared framework. Track organisational capability as a portfolio — not just individual progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/premium/business-diagnostic"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_18px_rgba(193,33,41,0.4)]">
                Start Your Free Assessment
              </Link>
            </motion.div>
            {/* Programs button — reveals the 6 program tiles in a modal */}
            <motion.button
              type="button"
              onClick={() => setProgramsOpen(true)}
              whileHover={{ scale: 1.04, borderColor: "rgba(193,33,41,0.6)", color: "#C12129", boxShadow: "0 0 18px rgba(193,33,41,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold border border-[#C12129]/30 text-[#C12129] hover:bg-[#C12129]/10 transition-all duration-200 cursor-pointer"
            >
              What Can You Build? →
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Programs Modal ── */}
      <AnimatePresence>
        {programsOpen && (
          <motion.div
            key="programs-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-md px-4 py-8"
            onClick={() => setProgramsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#080808] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(193,33,41,0.2)] max-h-[88vh] overflow-y-auto"
            >
              {/* Top accent */}
              <div className="h-[3px] bg-gradient-to-r from-[#C12129] via-red-400 to-transparent sticky top-0" />

              <div className="px-7 pt-7 pb-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Program Categories</p>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      Build the capability your organisation needs.
                    </h2>
                    <p className="text-white/45 text-xs mt-2 leading-relaxed max-w-md">
                      Every program is practitioner-designed, AI-coached, and tied directly to organisational outcomes.
                    </p>
                  </div>
                  <button type="button" onClick={() => setProgramsOpen(false)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-[#C12129]/40 transition-colors cursor-pointer text-base">
                    ✕
                  </button>
                </div>

                <div className="h-px bg-white/8 my-6" />

                {/* 6 redesigned program tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROGRAMS.map((prog, i) => {
                    const isHov = hoveredProgram === i;
                    return (
                      <motion.div
                        key={prog.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                        onHoverStart={() => setHoveredProgram(i)}
                        onHoverEnd={() => setHoveredProgram(null)}
                        onClick={() => { setProgramsOpen(false); router.push(prog.href); }}
                        whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(193,33,41,0.18)" }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative flex gap-4 p-5 rounded-xl border bg-white/[0.025] cursor-pointer overflow-hidden transition-all duration-200"
                        style={{ borderColor: isHov ? "rgba(193,33,41,0.45)" : "rgba(255,255,255,0.07)" }}
                      >
                        {/* Left accent bar */}
                        <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-[#C12129]"
                          animate={{ scaleY: isHov ? 1 : 0, originY: 0 }} transition={{ duration: 0.2 }} />
                        {/* Glow */}
                        <motion.div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl bg-[#C12129] pointer-events-none"
                          animate={{ opacity: isHov ? 0.1 : 0 }} transition={{ duration: 0.25 }} />

                        <motion.div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/15 border border-[#C12129]/25 mt-0.5"
                          animate={{ scale: isHov ? 1.12 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                          <span className="text-sm text-[#C12129]">{prog.icon}</span>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white leading-snug mb-1.5">{prog.title}</h3>
                          <p className="text-white/50 text-[11px] leading-relaxed italic">{prog.outcome}</p>
                          <motion.span className="text-[10px] font-semibold mt-2 block aivora-gradient-text"
                            animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }} transition={{ duration: 0.15 }}>
                            Explore this program →
                          </motion.span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="h-px bg-white/8 my-6" />
                <p className="text-center text-white/35 text-xs">
                  Don&apos;t see your topic? Our expert-design team builds custom programs for enterprise cohorts.{" "}
                  <button type="button" onClick={() => { setProgramsOpen(false); router.push("/contact"); }}
                    className="text-[#C12129] hover:text-red-400 transition-colors cursor-pointer underline underline-offset-2">
                    Talk to us →
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Subtle CTA at bottom ── */}
      <section className="px-4 pb-12">
        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto border-t border-gray-100 dark:border-white/6 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">The capability your organisation needs is 12 minutes away.</p>
            <p className="text-xs text-gray-500 dark:text-white/40">Start with an AI-powered skills assessment. Receive your personalised learning path.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/premium/business-diagnostic"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)]">
              Start Your Assessment
            </Link>
            <Link href="/events"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
              Explore Programs →
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
