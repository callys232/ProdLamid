"use client";

import { motion } from "framer-motion";

const VALUES = [
  { icon: "🎯", title: "Radical Accessibility",  body: "Great expertise should not be a privilege of the few." },
  { icon: "🤝", title: "Trust-First",             body: "Transparency, security, and ethical AI are non-negotiable." },
  { icon: "⚡", title: "Relentless Innovation",  body: "We push the boundaries of what Human+AI can achieve." },
  { icon: "🌍", title: "Global Impact",            body: "We build for the world, not just one market." },
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
    <main className="aivora-section min-h-screen pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Hero ── */}
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">About LAMID ONE</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Our Origin Story
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            LAMID ONE was born from a simple observation: the world&apos;s best expertise is locked behind outdated gatekeepers.
            We set out to build an ecosystem where AI amplifies human wisdom, making world-class consulting accessible
            to every organisation — not just those who can afford the Big Four.
          </p>
        </motion.div>

        {/* ── Mission & Vision ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {[
            {
              icon: "◈",
              title: "Our Mission",
              body: "To democratize access to world-class expertise by building an AI-powered ecosystem that connects organisations with the right human talent, at the right time, augmented by intelligent technology.",
            },
            {
              icon: "⬡",
              title: "Our Vision",
              body: "A world where every organisation — from startups to governments — can access the intelligence they need to thrive, powered by the seamless synergy of human expertise and artificial intelligence.",
            },
          ].map((item, i) => (
            <motion.div key={item.title} {...fadeUp(i * 0.08)}
              className="aivora-card border rounded-2xl p-7">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[#C12129]/12 border border-[#C12129]/25">
                <span className="text-base aivora-gradient-text">{item.icon}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">{item.title}</h2>
              <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Core Values ── */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.07)}
                className="aivora-card border rounded-2xl p-6 text-center hover:border-[#C12129]/30 transition-colors duration-200">
                <div className="text-2xl mb-4">{v.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Global Presence ── */}
        <motion.div {...fadeUp(0)}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            Global Presence
          </h2>
          <p className="text-gray-500 dark:text-white/45 text-sm text-center mb-10">Making an impact across borders.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.07)}
                className="aivora-card border rounded-2xl p-6 text-center hover:border-[#C12129]/25 transition-colors duration-200">
                <p className="text-3xl font-extrabold aivora-gradient-text mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
