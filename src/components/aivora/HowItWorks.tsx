"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    num: 1,
    title: "Define Your Challenge",
    body: "Tell us what you need — strategy, growth, compliance, or innovation.",
    href: "/premium/business-diagnostic",
    accent: "#C12129",
  },
  {
    num: 2,
    title: "AI Matches Experts",
    body: "Our engine analyzes 120+ experts to find your ideal match in minutes.",
    href: "/talent",
    accent: "#3b82f6",
  },
  {
    num: 3,
    title: "Engage & Collaborate",
    body: "Work seamlessly with your expert through our integrated platform.",
    href: "/premium/proposal-drafter",
    accent: "#7c3aed",
  },
  {
    num: 4,
    title: "AI-Augmented Delivery",
    body: "Get real-time insights, automated reports, and data-driven strategy.",
    href: "/client",
    accent: "#f59e0b",
  },
  {
    num: 5,
    title: "Measure & Scale",
    body: "Track impact with dashboards and scale what works across your org.",
    href: "/hcd",
    accent: "#10b981",
  },
];

const QUICK_TOOLS = [
  { label: "Business Diagnostic", href: "/premium/business-diagnostic", icon: "⚡", accent: "#C12129" },
  { label: "Proposal Drafter",    href: "/premium/proposal-drafter",    icon: "◈", accent: "#3b82f6" },
  { label: "Budget Estimator",    href: "/postjobs?tool=estimator",     icon: "▣", accent: "#f59e0b" },
  { label: "Expert Advisor",      href: "/concierge",                   icon: "✦", accent: "#7c3aed" },
];

export default function HowItWorks() {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section id="how-it-works" className="relative aivora-section py-24 px-4 overflow-hidden">

      {/* Wave bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150",
          "M-60 260 C200 140 400 380 700 220 C950 100 1200 340 1450 210",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.08" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100], opacity: [0.05, 0.18, 0.05] }}
            transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "linear", delay: i * 4 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            <span className="aivora-gradient-text">Five Steps to Clarity</span>
          </h2>
        </motion.div>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="hidden lg:block relative mb-8">
          {/* Connecting line */}
          <motion.div
            className="absolute top-[28px] left-[10%] right-[10%] h-[2px]"
            style={{ background: "linear-gradient(to right, #C12129, #3b82f6, #7c3aed, #f59e0b, #10b981)" }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />

          <div className="grid grid-cols-5 gap-4">
            {STEPS.map((step, i) => {
              const isHov = hovered === i;
              return (
                <motion.button
                  key={step.num}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => router.push(step.href)}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  {/* Circle */}
                  <motion.div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 z-10"
                    style={{ background: step.accent }}
                    animate={{
                      scale: isHov ? 1.18 : 1,
                      boxShadow: isHov ? `0 0 24px ${step.accent}80` : "none",
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    {step.num}
                  </motion.div>

                  <motion.h3
                    className="text-xs font-bold text-gray-900 dark:text-white mb-1.5 leading-snug"
                    animate={{ color: isHov ? step.accent : undefined }}
                    transition={{ duration: 0.18 }}
                  >
                    {step.title}
                  </motion.h3>
                  <p className="text-gray-500 dark:text-white/50 text-[11px] leading-relaxed">
                    {step.body}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {STEPS.map((step, i) => {
            const isHov = hovered === i;
            return (
              <motion.button
                key={step.num}
                type="button"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(step.href)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-start gap-4 aivora-card border rounded-2xl p-5 cursor-pointer text-left"
                style={{ borderColor: isHov ? `${step.accent}50` : undefined }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: step.accent }}
                  animate={{ scale: isHov ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                >
                  {step.num}
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{step.body}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick tools — repositioned here below steps */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
          <span className="text-[10px] aivora-text-muted tracking-wider uppercase shrink-0 w-full text-center mb-2">Quick access</span>
          {QUICK_TOOLS.map((tool) => (
            <motion.button key={tool.label} type="button"
              onClick={() => router.push(tool.href)}
              whileHover={{ scale: 1.06, borderColor: "#C12129", color: "#C12129", boxShadow: "0 0 14px rgba(193,33,41,0.4)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium border border-white/12 dark:border-white/12 border-gray-200 text-gray-500 dark:text-white/55 cursor-pointer transition-colors"
            >
              <span className="text-[#C12129]">{tool.icon}</span>{tool.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
