"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Landmark, Users, Lightbulb, ShieldCheck, Banknote } from "lucide-react";
import EcosystemTag from "@/components/EcosystemTag";

const MARKET_BULLETS = [
  {
    Icon: Users,
    text: "We handhold SMEs to find their niche and access and dominate the market with lasting brands;",
  },
  {
    Icon: TrendingUp,
    text: "We show effective ways to drive lead generation and create conversions",
  },
  {
    Icon: Lightbulb,
    text: "BIZ builds the entrepreneur and the enterprise capacity for a timely response to market opportunities, and propels them along a sustainable pathway;",
  },
  {
    Icon: ShieldCheck,
    text: "BIZ uses data to activate a culture of continuous innovation in the entrepreneur and the enterprise resulting in sustained and raving customers.",
  },
];

const FINANCE_BULLETS = [
  {
    Icon: Landmark,
    text: "A cost affordable option to address the structural deficiencies that create lack of access to finance and other support resources that are critical to success, creates strong partnerships with financial institutions to facilitate and package businesses to access easier and appropriate, least cost growth finance",
  },
  {
    Icon: Banknote,
    text: "We support SME financing with banks by monitoring enterprises to successfully utilize appropriate financing according to plans.",
  },
];

/* ── Animated bullet row ── */
function Bullet({ Icon, text, delay, accent }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 22 }}
      className="flex items-start gap-2 group"
    >
      <span
        className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5"
        style={{ backgroundColor: `${accent}25`, border: `1px solid ${accent}50` }}
      >
        <Icon className="h-3 w-3" style={{ color: accent }} />
      </span>
      <p className="text-xs leading-relaxed text-white/80 group-hover:text-white transition-colors duration-200">
        {text}
      </p>
    </motion.li>
  );
}

const BizAccessCards = () => {
  return (
    <section className="relative bg-black py-8 px-4 md:px-8 lg:px-16 overflow-hidden">

      {/* Global ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-900/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ══ LEFT — BIZ for Market Access ══ */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          whileHover={{ y: -4 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Gradient pattern background */}
          <div className="absolute inset-0 z-0">
            {/* Base radial gradient */}
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 30%, #2563EB 0%, #8b0f14 35%, #3a0608 65%, #0d0202 100%)",
              }}
            />
            {/* Diagonal stripe overlay */}
            <div className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 28px)",
              }}
            />
            {/* Dot grid overlay */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Top-right corner highlight */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-400/20 blur-3xl" />
            {/* Bottom-left accent */}
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-blue-900/40 blur-2xl" />
          </div>

          {/* Live sweep glow */}
          <motion.div
            className="absolute top-0 left-0 h-px z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #fca5a5, transparent)" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Pulsing ambient orb */}
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-500/20 blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Card content */}
          <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 border border-white/25 shrink-0"
              >
                <TrendingUp className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-rose-300">
                  Business Innovation Zone
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  BIZ for Market Access
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            {/* Bullets */}
            <ul className="space-y-3">
              {MARKET_BULLETS.map((b, i) => (
                <Bullet key={i} {...b} delay={0.08 + i * 0.1} accent="#fca5a5" />
              ))}
            </ul>

            {/* Bottom accent bar */}
            <div className="h-0.5 w-14 rounded-full bg-gradient-to-r from-white/50 to-transparent" />
          </div>
        </motion.div>

        {/* ══ RIGHT — BIZ for Finance Access ══ */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Gradient pattern background */}
          <div className="absolute inset-0 z-0">
            {/* Base mesh gradient — dark navy to deep teal */}
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 20%, #1e3a5f 0%, #0d1f3a 30%, #071020 60%, #020508 100%)",
              }}
            />
            {/* Secondary radial accent — bottom left emerald hint */}
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 10% 90%, rgba(6,78,59,0.55) 0%, transparent 55%)",
              }}
            />
            {/* Diagonal stripe overlay */}
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px)",
              }}
            />
            {/* Dot grid overlay */}
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* Corner glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-900/30 blur-2xl" />
            {/* Subtle border gradient */}
            <div className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.18)" }}
            />
          </div>

          {/* Live sweep glow */}
          <motion.div
            className="absolute top-0 left-0 h-px z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #93c5fd, transparent)" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          {/* Pulsing ambient orb */}
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />

          {/* Card content */}
          <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-400/35 shrink-0"
              >
                <Landmark className="h-4 w-4 text-blue-300" />
              </motion.div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-300">
                  Business Innovation Zone
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  BIZ for Finance Access
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent" />

            {/* Bullets */}
            <ul className="space-y-3">
              {FINANCE_BULLETS.map((b, i) => (
                <Bullet key={i} {...b} delay={0.1 + i * 0.12} accent="#93c5fd" />
              ))}
            </ul>

            {/* Bottom accent bar */}
            <div className="h-0.5 w-14 rounded-full bg-gradient-to-r from-blue-400/50 to-transparent" />
          </div>
        </motion.div>

      </div>
      <EcosystemTag />
    </section>
  );
};

export default BizAccessCards;
