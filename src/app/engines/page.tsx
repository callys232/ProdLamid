"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, TrendingUp, Users, ArrowRight, Zap, Lock } from "lucide-react";
import ToolUsageHistory from "@/components/lamidOne/ToolUsageHistory";

const ENGINES = [
  {
    id:          "core",
    href:        "/core",
    icon:        BarChart3,
    label:       "LAMID CORE",
    tagline:     "Strategy, alignment, and execution made clear.",
    description: "The operating system for modern leadership — align strategy, execution, and performance in one place.",
    accent:      "from-blue-500/20 to-blue-600/5",
    border:      "border-blue-500/30 hover:border-blue-500/60",
    iconBg:      "bg-blue-500/10 border-blue-500/25",
    iconColor:   "text-blue-400",
    accentBar:   "from-blue-500",
  },
  {
    id:          "grow",
    href:        "/grow",
    icon:        TrendingUp,
    label:       "LAMID GROW",
    tagline:     "Customer clarity. Digital confidence.",
    description: "See how customers find, interact with, and experience your business — and exactly where to improve.",
    accent:      "from-emerald-500/20 to-emerald-600/5",
    border:      "border-emerald-500/30 hover:border-emerald-500/60",
    iconBg:      "bg-emerald-500/10 border-emerald-500/25",
    iconColor:   "text-emerald-400",
    accentBar:   "from-emerald-500",
  },
  {
    id:          "talent",
    href:        "/talent",
    icon:        Users,
    label:       "LAMID TALENT",
    tagline:     "People intelligence for modern teams.",
    description: "Understand team performance, culture health, and workforce needs with the clarity leaders need to act.",
    accent:      "from-violet-500/20 to-violet-600/5",
    border:      "border-violet-500/30 hover:border-violet-500/60",
    iconBg:      "bg-violet-500/10 border-violet-500/25",
    iconColor:   "text-violet-400",
    accentBar:   "from-violet-500",
  },
];

const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.52 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export default function EnginesPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[600px] h-[260px] rounded-full bg-[#2563EB]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8">
              <Zap className="w-3 h-3 text-[#2563EB]" strokeWidth={2} />
              <span className="lamidone-gradient-text">Engine Access</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white mb-5"
          >
            Your engines.{" "}
            <span className="lamidone-gradient-text">Ready to run.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-gray-500 dark:text-white/60 text-base leading-relaxed max-w-xl mx-auto"
          >
            Access CORE, GROW, and TALENT — three AI-powered engines built to give leaders clarity across strategy, growth, and people. Activate a membership tier to unlock the full LAMID ONE ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Engine cards */}
      <section className="relative px-4 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {ENGINES.map((engine) => {
            const Icon = engine.icon;
            return (
              <motion.div key={engine.id} variants={cardV}>
                <Link
                  href={engine.href}
                  className={`group relative flex flex-col lamidone-card border rounded-2xl p-8 overflow-hidden transition-all duration-300 ${engine.border}`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${engine.accentBar} to-transparent`} />

                  {/* Bg glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${engine.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${engine.iconBg}`}>
                      <Icon className={`w-6 h-6 ${engine.iconColor}`} strokeWidth={1.75} />
                    </div>

                    <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-gray-600 dark:text-white/55 mb-2">
                      {engine.label}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-3">
                      {engine.tagline}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed flex-1 mb-6">
                      {engine.description}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold lamidone-gradient-text group-hover:gap-2.5 transition-all duration-200">
                      Open engine <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Tool history — members only, renders nothing for visitors */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <ToolUsageHistory />
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="px-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="max-w-2xl mx-auto rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/6 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="mx-auto mb-5 w-12 h-12 rounded-xl flex items-center justify-center border border-[#2563EB]/30 bg-[#2563EB]/12">
              <Lock className="w-5 h-5 text-[#2563EB]" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Unlock the full ecosystem
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/55 leading-relaxed max-w-md mx-auto mb-7">
              Activate a membership tier to access LAMID FINANCE, escrow services, expert matching, and the complete LAMID ONE platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
              >
                View plans <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-medium text-sm border border-white/15 text-gray-700 dark:text-white/70 hover:border-white/30 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Explore ecosystem
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
