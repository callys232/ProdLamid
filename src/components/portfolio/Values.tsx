"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Brain, Lightbulb, Users, TrendingUp, Target } from "lucide-react";

const VALUES = [
  {
    num: "01",
    title: "Integrity",
    desc: "We build systems that honor people and purpose.",
    Icon: ShieldCheck,
    hex: "#2563EB",
    glow: "rgba(194,18,25,0.35)",
  },
  {
    num: "02",
    title: "Intelligence",
    desc: "We use data and AI to drive clarity and impact.",
    Icon: Brain,
    hex: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
  },
  {
    num: "03",
    title: "Innovation & Results Driven",
    desc: "We create solutions that scale across borders and deliver measurable outcomes.",
    Icon: Lightbulb,
    hex: "#a855f7",
    glow: "rgba(168,85,247,0.35)",
  },
  {
    num: "04",
    title: "Inclusion",
    desc: "We design for enterprises, not just corporations.",
    Icon: Users,
    hex: "#10b981",
    glow: "rgba(16,185,129,0.35)",
  },
  {
    num: "05",
    title: "Impact",
    desc: "We measure success by transformation that lasts.",
    Icon: TrendingUp,
    hex: "#f97316",
    glow: "rgba(249,115,22,0.35)",
  },
  {
    num: "06",
    title: "Innovation",
    desc: "We build what doesn't exist yet, then make it work at scale.",
    Icon: Target,
    hex: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, type: "spring" as const, stiffness: 280, damping: 24 },
  }),
};

const ValuesSection: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="values" className="relative bg-black text-white py-24 px-6 overflow-hidden">

      {/* Vector bg */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#2563EB" strokeWidth="0.8" opacity="0.07" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ffffff" strokeWidth="0.6" opacity="0.04" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="0.5" opacity="0.03" />
        <circle cx="5%" cy="10%" r="120" fill="none" stroke="#2563EB" strokeWidth="0.8" opacity="0.08" />
        <circle cx="95%" cy="90%" r="160" fill="none" stroke="#2563EB" strokeWidth="0.7" opacity="0.07" />
        <circle cx="50%" cy="50%" r="260" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.03" />
        <circle cx="20%" cy="80%" r="3" fill="#2563EB" opacity="0.2" />
        <circle cx="80%" cy="15%" r="2.5" fill="#2563EB" opacity="0.18" />
        <circle cx="60%" cy="70%" r="2" fill="#ffffff" opacity="0.1" />
        <path d="M 0 0 Q 180 0 180 180" fill="none" stroke="#2563EB" strokeWidth="0.8" opacity="0.1" />
      </svg>

      {/* Red ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full bg-[#2563EB]/8 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 w-full">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="flex items-center gap-2.5"
            >
              <motion.span animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Who we are...</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-rose-400 to-white shrink-0">
                Core Values
              </h2>
              <span className="h-8 w-px bg-white/15 shrink-0" />
              <p className="text-gray-600 text-sm font-light leading-snug flex-1 min-w-0">
                Six principles that govern every decision, every product, and every partnership — from concept to delivery. One Ecosystem. Every Layer of Impact.
              </p>
              <span className="h-8 w-px bg-white/10 shrink-0" />
              {["6 Principles", "One Standard", "Zero Compromise"].map((t, i) => (
                <motion.span key={t}
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 + i * 0.07 }}
                  whileHover={{ scale: 1.06, borderColor: "rgba(194,18,25,0.5)" }}
                  className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-medium text-gray-600 cursor-default shrink-0"
                >{t}</motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Values grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUES.map((v, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={v.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, boxShadow: `0 20px 52px ${v.glow}` }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="group relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden cursor-default transition-colors duration-200"
                style={{
                  border: `1px solid ${isHov ? v.hex + "60" : v.hex + "25"}`,
                  background: `linear-gradient(135deg, ${v.hex}10 0%, ${v.hex}04 100%)`,
                  transition: "border-color 0.2s",
                }}
              >
                {/* Corner glow */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
                  style={{ backgroundColor: v.hex, opacity: isHov ? 0.18 : 0.08 }} />

                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/6 to-transparent skew-x-12 pointer-events-none" />

                {/* Top row: number + icon */}
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-4xl font-black leading-none select-none transition-opacity duration-300"
                    style={{ color: v.hex, opacity: isHov ? 0.2 : 0.08 }}>
                    {v.num}
                  </span>
                  <motion.div
                    animate={isHov
                      ? { scale: 1.15, rotate: 8, boxShadow: `0 0 18px ${v.glow}` }
                      : { scale: 1, rotate: 0, boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${v.hex}20`, border: `1px solid ${v.hex}40` }}
                  >
                    <v.Icon className="h-5 w-5" style={{ color: v.hex }} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{v.title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{v.desc}</p>
                </div>

                {/* Accent bar — expands on hover */}
                <motion.div
                  animate={{ width: isHov ? "55%" : "24px" }}
                  transition={{ duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
                  className="relative z-10 h-0.5 rounded-full mt-auto"
                  style={{ backgroundColor: v.hex }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;
