"use client";

import React from "react";
import { motion } from "framer-motion";
import { Handshake, TrendingUp } from "lucide-react";
import EcosystemTag from "@/components/EcosystemTag";

const PLEDGE_LINES = [
  "We don't just build tools.",
  "We build systems that build people.",
  "We build ecosystems that build nations.",
];

const PledgeStrategySection = () => {
  return (
    <section className="relative bg-black py-16 px-4 md:px-8 lg:px-16 overflow-hidden">

      {/* Global ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-900/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ══ LEFT — Our Pledge ══ */}
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
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 30%, #2563EB 0%, #8b0f14 35%, #3a0608 65%, #0d0202 100%)",
              }}
            />
            <div className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 28px)",
              }}
            />
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-400/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-blue-900/40 blur-2xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-7">
            {/* Header */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/15 border border-white/25"
              >
                <Handshake className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                  Commitment
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Our Pledge
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            {/* CSS keyframe guarantees the pulse loops forever */}
            <style>{`
              @keyframes pledge-radar {
                0%   { transform: scale(1);   opacity: 0.55; }
                60%  { transform: scale(2.4); opacity: 0;    }
                100% { transform: scale(1);   opacity: 0;    }
              }
              .pulse-0 { animation: pledge-radar 2.2s ease-out infinite 0s;     }
              .pulse-1 { animation: pledge-radar 2.2s ease-out infinite 0.73s;  }
              .pulse-2 { animation: pledge-radar 2.2s ease-out infinite 1.46s;  }
            `}</style>

            {/* Pledge lines — animated bullets + Playfair font */}
            <div className="space-y-5">
              {PLEDGE_LINES.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.14, type: "spring", stiffness: 260, damping: 22 }}
                  className="flex items-start gap-4"
                >
                  {/* Radar-pulse bullet — pure CSS, loops indefinitely */}
                  <div className="relative flex-shrink-0 mt-2 w-2.5 h-2.5">
                    <span className={`pulse-${i} absolute inset-0 rounded-full bg-white/55`} />
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
                  </div>

                  <p
                    className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug text-white"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {line}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="h-0.5 w-20 rounded-full bg-gradient-to-r from-white/50 to-transparent mt-2" />
          </div>
        </motion.div>

        {/* ══ RIGHT — Building and Enduring Great Economy ══ */}
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
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 20%, #064e3b 0%, #052e20 30%, #071a10 60%, #020805 100%)",
              }}
            />
            <div className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 10% 90%, rgba(6,78,59,0.6) 0%, transparent 55%)",
              }}
            />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px)",
              }}
            />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-900/30 blur-2xl" />
            <div className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.15)" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-7">
            {/* Header */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-400/35"
              >
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </motion.div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Strategy
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Building and Enduring Great Economy
                </h2>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-emerald-400/30 via-emerald-400/10 to-transparent" />

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, type: "spring", stiffness: 260, damping: 22 }}
              className="text-base sm:text-lg leading-relaxed text-white/85"
            >
              A great company can be measured by its performance — generating enough cash flow through highly
              profitable operations to invest in the future and create value for its customers through innovation.
            </motion.p>

            <div className="h-0.5 w-20 rounded-full bg-gradient-to-r from-emerald-400/50 to-transparent mt-2" />
          </div>
        </motion.div>

      </div>
      <EcosystemTag />
    </section>
  );
};

export default PledgeStrategySection;
