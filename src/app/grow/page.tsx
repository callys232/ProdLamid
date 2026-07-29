"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Globe, BarChart2, Smartphone } from "lucide-react";
import { useScrollBackground } from "@/hooks/useScrollBackground";
import { toolBlurb } from "@/lib/intelligence/toolBlurbs";

const FEATURES = [
  {
    Icon: BarChart2,
    title: "Market Timing Intelligence",
    body: "Know when to move and when to hold. Real-time market signals that tell you where the opportunity is before it becomes obvious to everyone else.",
    href: "/grow-market-intelligence",
    cta: "View Market Signals →",
  },
  {
    Icon: Globe,
    title: "Localized Advisory for Every Market You Operate In",
    body: "Growth intelligence built for where you actually operate — nuanced, ground-level insight into markets that global platforms don't understand.",
    href: "/grow-advisory-console",
    cta: "Open Advisory Console →",
  },
  {
    Icon: Smartphone,
    title: "Digital Transformation Pathway",
    body: "A clear roadmap from where your digital capability is today to where your business needs it to be — practical, sequenced, and tied to real outcomes.",
    href: "/grow-pathways",
    cta: "Explore Pathways →",
  },
  {
    Icon: TrendingUp,
    title: "Customer Engagement Intelligence",
    body: "Modern, simple insights on who your customers are, what they respond to, and how to build loyalty that compounds over time.",
    href: "/grow-opportunity-signals",
    cta: "View Opportunity Signals →",
  },
];

const GROW_TOOLS = [
  { label: "Opportunity Signals",    href: "/grow-opportunity-signals" },
  { label: "Market Intelligence",    href: "/grow-market-intelligence" },
  { label: "Digital Maturity",       href: "/grow-digital-maturity" },
  { label: "Growth Pathways",        href: "/grow-pathways" },
  { label: "Digital Modernisation",  href: "/grow-modernisation" },
  { label: "Growth Planner",         href: "/grow-planner" },
  { label: "Advisory Console",       href: "/grow-advisory-console" },
  { label: "Executive Report",       href: "/grow-executive-report" },
  { label: "Grow Dashboard",         href: "/grow-dashboard" },
  { label: "Cadence Intelligence",    href: "/cadence-intelligence" },
  { label: "Operations Intelligence", href: "/operations-intelligence" },
];

const RHYTHM_TOOLS = [
  { label: "Cadence Mapping",                   href: "/r01-cadence-mapping" },
  { label: "Pace of Execution",                 href: "/r02-pace-of-execution" },
  { label: "Cadence Drift Alert",               href: "/r03-cadence-drift-alert" },
  { label: "Cadence Stability Score",           href: "/r04-cadence-stability-score" },
  { label: "Workload Balance Monitor",          href: "/r05-workload-balance-monitor" },
  { label: "Cross-Team Cadence Fit",            href: "/r06-cross-team-cadence-fit" },
  { label: "Cadence Consistency Check",         href: "/r07-cadence-consistency-check" },
  { label: "Cadence Integration Across Teams",  href: "/r08-cadence-integration" },
  { label: "Strategy-to-Execution Alignment",   href: "/r09-strategy-to-execution-alignment" },
  { label: "Multi-Team Cadence Sync",           href: "/r10-multi-team-cadence-sync" },
  { label: "Real-Time Cadence Sync",            href: "/r11-real-time-cadence-sync" },
  { label: "Operational Flow Tracker",          href: "/r12-operational-flow-tracker" },
  { label: "Team Cadence Engagement Score",     href: "/r13-team-cadence-engagement-score" },
  { label: "Real-Time Cadence Pulse",           href: "/r14-real-time-cadence-pulse" },
  { label: "Organisational Cadence Profile",    href: "/r15-organisational-cadence-profile" },
  { label: "Cadence Pattern Report",            href: "/r16-cadence-pattern-report" },
  { label: "Core Cadence Drivers",              href: "/r17-core-cadence-drivers" },
  { label: "Cultural Cadence Fit",              href: "/r18-cultural-cadence-fit" },
  { label: "Cadence Impact Area",               href: "/r19-cadence-impact-area" },
  { label: "Department Cadence View",           href: "/r20-department-cadence-view" },
  { label: "Business Unit Cadence View",        href: "/r21-business-unit-cadence-view" },
  { label: "Enterprise-Wide Cadence View",      href: "/r22-enterprise-wide-cadence-view" },
  { label: "Long-Term Cadence Trends",          href: "/r23-long-term-cadence-trends" },
  { label: "Historical Cadence Tracking",       href: "/r24-historical-cadence-tracking" },
  { label: "Root Cause of Cadence Issues",      href: "/r25-root-cause-of-cadence-issues" },
  { label: "Cadence Data Sources",              href: "/r26-cadence-data-sources" },
  { label: "Peak Performance Cadence",          href: "/r27-peak-performance-cadence" },
  { label: "Cadence Governance Console",        href: "/r28-cadence-governance-console" },
  { label: "Executive Cadence Report",          href: "/r29-executive-cadence-report" },
  { label: "Enterprise Cadence Overview",       href: "/r30-enterprise-cadence-overview" },
];

const WHY = [
  "Market timing that turns uncertainty into advantage",
  "Customer insights that drive real revenue, not just awareness",
  "Digital pathways built for where your business is going",
  "Local market intelligence in every region you operate",
];

const cardV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.42 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export default function GrowPage() {
  useScrollBackground();
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();
  return (
    <main className="min-h-screen lamidone-section">

      {/* Hero */}
      <section data-scroll-section data-bg-from-dark="#1456A0" data-bg-to-dark="#040A1E" data-bg-from-light="#B8CCFF" data-bg-to-light="#F5F3FF" className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[480px] h-[220px] rounded-full bg-[#2563EB]/6 blur-[80px]" />
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {[
            "M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150",
            "M-60 260 C200 140 400 380 700 220 C950 100 1200 340 1450 210",
          ].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
              strokeOpacity="0.08" strokeDasharray="12 20"
              animate={{ strokeDashoffset: [0, -100], opacity: [0.04, 0.14, 0.04] }}
              transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "linear", delay: i * 4 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="lamidone-gradient-text">Customer & Digital Performance Suite</span>
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4"
              >
                LAMID GROW
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white mb-6"
              >
                Customer clarity.{" "}
                <span className="lamidone-gradient-text">Digital confidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-gray-500 dark:text-white/60 text-base leading-relaxed mb-8"
              >
                LAMID GROW shows how customers find, interact with, and experience your business — and where to improve.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/grow-dashboard"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm overflow-hidden bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
                  <span className="relative z-10">See GROW in Action</span>
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
                >
                  Book a Demo
                </Link>
              </motion.div>
            </div>

            {/* Why it matters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lamidone-card border rounded-2xl p-8"
            >
              <p className="lamidone-gradient-text text-[10px] tracking-[0.35em] uppercase font-bold mb-5">
                Why It Matters
              </p>
              <ul className="space-y-4">
                {WHY.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB]/12 border border-[#2563EB]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#2563EB] text-[10px] font-bold">✓</span>
                    </span>
                    <span className="text-gray-700 dark:text-white/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section data-scroll-section data-bg-from-dark="#0A8090" data-bg-to-dark="#030C14" data-bg-from-light="#FDDCB0" data-bg-to-light="#FEF9F0" className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">What You Get</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Growth intelligence that <span className="lamidone-gradient-text">moves with your market.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={cardV}
                whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(37,99,235,0.22)" }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(feat.href)}
                className="group relative lamidone-card border rounded-2xl p-7 overflow-hidden cursor-pointer"
                style={{ borderColor: hovered === i ? "rgba(37,99,235,0.45)" : undefined }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#2563EB]"
                  animate={{ scaleY: hovered === i ? 1 : 0 }}
                  initial={{ scaleY: 0 }}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.22 }}
                />
                {/* Corner glow */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#2563EB] pointer-events-none"
                  style={{ filter: "blur(40px)" }}
                  animate={{ opacity: hovered === i ? 0.10 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Bottom sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                  animate={{ width: hovered === i ? "100%" : "0%" }}
                  transition={{ duration: 0.38 }}
                />
                {/* Icon badge */}
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#2563EB]/25 bg-[#2563EB]/10"
                  animate={{
                    scale: hovered === i ? 1.08 : 1,
                    boxShadow: hovered === i ? "0 0 16px rgba(37,99,235,0.35)" : "none",
                  }}
                  transition={{ duration: 0.22 }}
                >
                  <feat.Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.75} />
                </motion.div>
                <h3 className="relative text-sm font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="relative text-gray-500 dark:text-white/55 text-xs leading-relaxed mb-4">{feat.body}</p>
                {/* CTA reveal */}
                <motion.span
                  className="relative inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]"
                  animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 6 }}
                  transition={{ duration: 0.22 }}
                >
                  {feat.cta}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools in this engine */}
      <section data-scroll-section data-bg-from-dark="#1A2880" data-bg-to-dark="#020508" data-bg-from-light="#B0C4FF" data-bg-to-light="#E8EEFF" className="relative py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6 text-center">
              All Tools in LAMID GROW
            </p>
            {/* Every tool states what it does — no bare names. The line is the
                same definition the tool carries on its own page. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {GROW_TOOLS.map((tool) => (
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
              Cadence Intelligence Framework
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RHYTHM_TOOLS.map((tool) => (
                <Link key={tool.label} href={tool.href}
                  className="group rounded-xl border border-gray-200 dark:border-white/12 p-4 hover:border-[#2563EB]/45 hover:bg-[#2563EB]/6 transition-all duration-200"
                >
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 dark:text-white/70 group-hover:text-[#2563EB] transition-colors">
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

      {/* Who it's for */}
      <section data-scroll-section data-bg-from-dark="#3D1070" data-bg-to-dark="#0A041E" data-bg-from-light="#E8D8C0" data-bg-to-light="#FFFFF0" className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lamidone-card border rounded-2xl p-10 text-center"
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Who It&apos;s For</p>
            <p className="text-gray-700 dark:text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              LAMID GROW is built for Chief Marketing Officers, Chief Commercial Officers, and growth leaders who need market intelligence that is timely, localized, and connected to real strategic decisions — not generic trend reports.
            </p>
            <Link href="/premium/business-diagnostic"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-sm bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
            >
              Take your LAMID ONE Diagnostic
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Back to Ecosystem */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="py-10 px-4 text-center">
        <Link href="/ecosystem" className="inline-flex items-center gap-2 text-sm font-medium lamidone-gradient-text hover:opacity-80 transition-opacity">
          ← Back to the Ecosystem
        </Link>
      </section>

    </main>
  );
}
