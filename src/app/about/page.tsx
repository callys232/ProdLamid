"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroStickmen from "@/components/HeroStickmen";

const VALUES = [
  { icon: "🎯", title: "Radical Accessibility",  body: "Great expertise should not be a privilege of the few." },
  { icon: "🤝", title: "Trust-First",             body: "Transparency, security, and ethical AI are non-negotiable." },
  { icon: "⚡", title: "Relentless Innovation",  body: "We push the boundaries of what Human+AI can achieve." },
  { icon: "🌍", title: "Global Impact",            body: "We build for the world, not just one market." },
];

/* Moved from the homepage — these are entry points, which suits a page
   people read when deciding where to start. */
const QUICK_TOOLS = [
  { label: "Enterprise Diagnostic", href: "/premium/business-diagnostic", icon: "⚡" },
  { label: "LAMID CORE",   href: "/core",   icon: "◈" },
  { label: "LAMID GROW",   href: "/grow",   icon: "▣" },
  { label: "LAMID TALENT", href: "/talent", icon: "✦" },
];

const STATS = [
  { value: "6",    label: "Countries" },
  { value: "120+", label: "Expert Partners" },
  { value: "14+",  label: "Enterprise Clients" },
  { value: "50K+", label: "Hours Delivered" },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: d },
});

export default function AboutPage() {
  return (
    <main className="lamidone-section min-h-screen pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Hero ── */}
        <motion.div {...fadeUp(0)} className="relative text-center mb-8 overflow-hidden rounded-2xl py-14 px-4">
          <HeroStickmen />
          <div className="relative z-10">
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">About LAMID ONE</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Our Origin Story
            </h1>
            <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              LAMID ONE was born from a simple observation: the world&apos;s best expertise is locked behind outdated gatekeepers.
              So we built an ecosystem where AI amplifies human judgement, and expert consulting reaches every organisation —
              not just the ones who can afford the Big Four.
            </p>
          </div>
        </motion.div>

        {/* ── Mission & Vision ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {[
            {
              icon: "◈",
              title: "Our Mission",
              body: "Put expert-level consulting within reach of any organisation. We connect you to the right specialist at the right time, with AI doing the analysis underneath.",
            },
            {
              icon: "⬡",
              title: "Our Vision",
              body: "Every organisation — startup to government — gets the intelligence it needs to make good decisions. Human judgement and AI, working the same problem.",
            },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp(i * 0.08)}
              className="lamidone-card border rounded-2xl p-7">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[#2563EB]/12 border border-[#2563EB]/25">
                <span className="text-base lamidone-gradient-text">{item.icon}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">{item.title}</h2>
              <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* ── The Promise ── */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="text-center mb-8">
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
              The Promise
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Three things every leader deserves.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                word: "Clarity",
                icon: "◎",
                desc: "One unified view across strategy, growth, people, and finance — so leaders stop guessing and start deciding with confidence.",
              },
              {
                word: "Growth",
                icon: "▲",
                desc: "Market timing intelligence, digital pathways, and customer insights that move with your business in real time.",
              },
              {
                word: "Value",
                icon: "◈",
                desc: "Every recommendation connects to outcome — not a report left on a shelf, but a system that tracks what happens next.",
              },
            ].map((p, i) => (
              <motion.div
                key={p.word}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -5, boxShadow: "0 20px 44px rgba(37,99,235,0.13)" }}
                className="group lamidone-card border rounded-2xl p-7 text-center hover:border-[#2563EB]/30 transition-all duration-200"
              >
                <span className="text-2xl lamidone-gradient-text block mb-4 select-none group-hover:scale-110 transition-transform duration-200 inline-block">
                  {p.icon}
                </span>
                <h3 className="text-base font-bold lamidone-gradient-text mb-3">{p.word}</h3>
                <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Core Values ── */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.07)}
                className="lamidone-card border rounded-2xl p-6 text-center hover:border-[#2563EB]/30 transition-colors duration-200">
                <div className="text-2xl mb-4">{v.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-xs text-gray-600 dark:text-white/55 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Global Presence ── */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            Global Presence
          </h2>
          <p className="text-gray-600 dark:text-white/55 text-sm text-center mb-10">Making an impact across borders.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.07)}
                className="lamidone-card border rounded-2xl p-6 text-center hover:border-[#2563EB]/25 transition-colors duration-200">
                <p className="text-3xl font-extrabold lamidone-gradient-text mb-1">{s.value}</p>
                <p className="text-xs text-gray-600 dark:text-white/55">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick access — moved here from the homepage's How It Works section */}
        <motion.div {...fadeUp(0)}>
          <p className="mb-6 text-center text-[10px] uppercase tracking-wider lamidone-text-muted">
            Quick access
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {QUICK_TOOLS.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="flex items-center gap-1.5 rounded-full border border-[#2563EB]/30 px-5 py-2 text-xs font-medium text-gray-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] transition-all duration-200 hover:scale-[1.06] hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-[0_0_22px_rgba(37,99,235,0.55)] dark:text-white/60"
              >
                <span className="lamidone-gradient-text">{tool.icon}</span>
                {tool.label}
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
