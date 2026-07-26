"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STEPS = [
  { num: 1, title: "Diagnose",  body: "Take the Enterprise Diagnostic. Tell us where you are across Strategy, Growth, People, and Finance.",   href: "/premium/business-diagnostic", accent: "#2563EB" },
  { num: 2, title: "Reveal",    body: "See your real score. LAMID ONE surfaces the gaps and strengths across all four pillars — honestly.",      href: "/ecosystem",                   accent: "#2563EB" },
  { num: 3, title: "Unlock",    body: "Get personalized recommendations matched to your scale, sector, and situation — not a generic report.",   href: "/premium/proposal-drafter",    accent: "#2563EB" },
  { num: 4, title: "Act",       body: "Engage the suite, the experts, or the tools your score says you need most. One ecosystem, one entry point.", href: "/client",                   accent: "#2563EB" },
  { num: 5, title: "Grow",      body: "Track progress. Refine your position. See your organization evolve in real time — quarter by quarter.",   href: "/ecosystem",                   accent: "#2563EB" },
];

const QUICK_TOOLS = [
  { label: "Enterprise Diagnostic", href: "/premium/business-diagnostic", icon: "⚡" },
  { label: "Lamid Core",   href: "/core",   icon: "◈" },
  { label: "Lamid Grow",   href: "/grow",   icon: "▣" },
  { label: "Lamid Talent", href: "/talent", icon: "✦" },
];

export default function HowItWorks() {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section id="how-it-works" className="relative lamidone-section py-10 px-4 overflow-hidden">

      {/* Wave bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150",
          "M-60 260 C200 140 400 380 700 220 C950 100 1200 340 1450 210",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.6"
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
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            <span className="lamidone-gradient-text">From Diagnostic to Growth.</span>
          </h2>
        </motion.div>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="hidden lg:block relative mb-8">
          {/* Connecting line */}
          <motion.div
            className="absolute top-[28px] left-[10%] right-[10%] h-[2px]"
            style={{ background: "linear-gradient(to right, #2563EB, #3b82f6, #7c3aed, #f59e0b, #10b981)" }}
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
                className="flex items-start gap-4 lamidone-card border rounded-2xl p-5 cursor-pointer text-left"
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
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <span className="text-[10px] lamidone-text-muted tracking-wider uppercase shrink-0 w-full text-center mb-2">Quick access</span>
          {QUICK_TOOLS.map((tool) => (
            <motion.button key={tool.label} type="button"
              onClick={() => router.push(tool.href)}
              whileHover={{ scale: 1.08, borderColor: "#2563EB", color: "#2563EB", boxShadow: "0 0 22px rgba(37,99,235,0.65)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium border border-[#2563EB]/30 text-gray-600 dark:text-white/60 cursor-pointer transition-colors shadow-[0_0_10px_rgba(37,99,235,0.2)]"
            >
              <span className="lamidone-gradient-text">{tool.icon}</span>{tool.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
