"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Network, TrendingUp, GraduationCap, Landmark } from "lucide-react";
import { useScrollBackground } from "@/hooks/useScrollBackground";
import { toolBlurb } from "@/lib/intelligence/toolBlurbs";
import EcosystemOverview from "@/components/lamidOne/EcosystemOverview";

const ENGINES = [
  {
    id: "core",
    Icon: Network,
    label: "LAMID CORE",
    badge: "Strategy & Execution",
    tagline: "Strategy That Never Goes Stale.",
    body: "Continuous diagnostics, real-time coherence checks, and early-warning signals — so your strategy stays aligned with what's actually happening in your organization.",
    href: "/core",
    cta: "Explore LAMID CORE",
  },
  {
    id: "grow",
    Icon: TrendingUp,
    label: "LAMID GROW",
    badge: "Customer & Digital",
    tagline: "Growth That Reads the Market in Real Time.",
    body: "Market timing intelligence, localized advisory for every market you operate in, and a digital transformation pathway built for where your business is going, not just where it's been.",
    href: "/grow",
    cta: "Explore LAMID GROW",
  },
  {
    id: "talent",
    Icon: GraduationCap,
    label: "LAMID TALENT",
    badge: "People Intelligence",
    tagline: "The Right Person, the Right Role, Every Time.",
    body: "A 40+ signal matching engine that goes beyond CVs — AI-assisted capability diagnostics, LMS-driven learning acceleration, and workforce intelligence that compounds over time.",
    href: "/talent",
    cta: "Explore LAMID TALENT",
  },
  {
    id: "finance",
    Icon: Landmark,
    label: "LAMID FINANCE",
    badge: "Financial Clarity",
    tagline: "Finance That Drives Decisions, Not Just Reports Them.",
    body: "Real-time financial visibility, CFO-grade intelligence, budget-to-strategy linkage, and cost optimization signals — so capital works as hard as the rest of your organization.",
    href: "/finance",
    cta: "Explore LAMID FINANCE",
  },
];

const CROSS_ENGINE_TOOLS = [
  { label: "Protection",   href: "/x01-protection" },
  { label: "Security",     href: "/x02-security" },
  { label: "Governance",   href: "/x03-governance" },
  { label: "Compliance",   href: "/x04-compliance" },
  { label: "Ethics",       href: "/x05-ethics" },
  { label: "Resilience",   href: "/x06-resilience" },
  { label: "Continuity",   href: "/x07-continuity" },
];

const PLATFORM_TOOLS = [
  { label: "Core Dashboard", href: "/core-dashboard" },
  { label: "Concierge",      href: "/concierge" },
];

const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export default function EcosystemPage() {
  useScrollBackground();
  return (
    <main className="min-h-screen lamidone-section">

      {/* Hero */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="relative py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[560px] h-[240px] rounded-full bg-[#2563EB]/6 blur-[90px]" />
        </div>

        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {["M1400 0 L900 300 L400 -100", "M1400 200 L800 500 L200 100"].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
              strokeOpacity="0.08" strokeDasharray="10 22"
              animate={{ strokeDashoffset: [0, 130], opacity: [0.04, 0.14, 0.04] }}
              transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="lamidone-gradient-text">The HumanAI Consulting Operating System</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.12] tracking-tight mb-6"
          >
            <span className="text-gray-900 dark:text-white">One Ecosystem.</span>
            <br />
            <span className="lamidone-gradient-text">Four Suites.</span>
            <br />
            <span className="text-gray-900 dark:text-white">Endless Possibilities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-gray-500 dark:text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Four suites, 245 tools, one signal — see your whole organization in one place, and act on what it shows you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(37,99,235,0.8)" }} whileTap={{ scale: 0.97 }}>
              <Link href="/premium/business-diagnostic"
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-sm overflow-hidden bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
                <span className="relative z-10">Take your LAMID ONE Diagnostic</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
              >
                Book a Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Engine cards */}
      <section data-scroll-section data-bg-from-dark="#1456A0" data-bg-to-dark="#040A1E" data-bg-from-light="#B8CCFF" data-bg-to-light="#F5F3FF" className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
              The Four Suites
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Every layer of your business. <span className="lamidone-gradient-text">One system.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {ENGINES.map((engine) => (
              <motion.div
                key={engine.id}
                variants={cardV}
                whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(37,99,235,0.18)" }}
                className="group relative lamidone-card border rounded-2xl p-8 overflow-hidden"
              >
                {/* Left accent bar on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#2563EB]"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.22 }}
                />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#2563EB]/25 bg-[#2563EB]/10">
                  <engine.Icon className="w-7 h-7 text-[#2563EB]" strokeWidth={1.75} />
                </div>

                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#2563EB]/70 mb-2 block">
                  {engine.badge}
                </span>
                <p className="text-base font-bold lamidone-gradient-text mb-2">{engine.label}</p>
                <p className="text-gray-900 dark:text-white text-sm font-semibold leading-snug mb-3">
                  {engine.tagline}
                </p>
                <p className="text-gray-600 dark:text-white/55 text-xs leading-relaxed mb-6">
                  {engine.body}
                </p>
                <Link href={engine.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold lamidone-gradient-text hover:opacity-80 transition-opacity"
                >
                  {engine.cta} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured tools per engine — tabbed deep dive */}
      <section data-scroll-section data-bg-from-dark="#1A3060" data-bg-to-dark="#060A1A" data-bg-from-light="#FFD8AA" data-bg-to-light="#EEF2FF" className="relative">
        <EcosystemOverview />
      </section>

      {/* Cross-engine & platform tools */}
      <section data-scroll-section data-bg-from-dark="#076070" data-bg-to-dark="#04101A" data-bg-from-light="#A8D8FF" data-bg-to-light="#F0F9FF" className="relative py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6 text-center">
              Cross-Suite Tools
            </p>
            {/* Each protection tool states what it does — the definition it
                carries on its own page. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {CROSS_ENGINE_TOOLS.map((tool) => (
                <Link key={tool.label} href={tool.href}
                  className="group rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-4 hover:border-[#2563EB]/55 hover:bg-[#2563EB]/10 transition-all duration-200"
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white/85 group-hover:text-[#2563EB] transition-colors">
                    {tool.label}
                    <span className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-white/55 line-clamp-2">
                    {toolBlurb(tool.href)}
                  </p>
                </Link>
              ))}
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-4 text-center text-gray-600 dark:text-white/55">
              Platform Tools
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORM_TOOLS.map((tool) => (
                <Link key={tool.label} href={tool.href}
                  className="group rounded-xl border border-gray-200 dark:border-white/12 p-4 hover:border-[#2563EB]/45 hover:bg-[#2563EB]/6 transition-all duration-200"
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-white/70 group-hover:text-[#2563EB] transition-colors">
                    {tool.label}
                    <span className="opacity-50 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-white/55 line-clamp-2">
                    {toolBlurb(tool.href)}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="relative py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to see where you stand?
            </h2>
            <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed mb-8">
              Takes two minutes. No commitment, no cost.
            </p>
            <Link href="/premium/business-diagnostic"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-sm bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
            >
              Take your LAMID ONE Diagnostic
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
