"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Target,
  Zap,
  TrendingUp,
  Users,
  Layers,
  MessageSquare,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";

const HIW_STEPS = [
  {
    num: "01",
    label: "Diagnose",
    desc: "Understand your performance, talent, and workflow needs.",
    Icon: Target,
    hex: "#2563EB",
  },
  {
    num: "02",
    label: "Deploy",
    desc: "Activate the tools, programs, and systems that drive change.",
    Icon: Zap,
    hex: "#f97316",
  },
  {
    num: "03",
    label: "Scale",
    desc: "Grow sustainably with AI-assisted insights and marketplace flexibility.",
    Icon: TrendingUp,
    hex: "#10b981",
  },
];

const HIW_POWERS = [
  {
    label: "CRM & Client Management",
    desc: "Track leads, manage relationships, and close deals with clarity.",
    Icon: Users,
    hex: "#3b82f6",
  },
  {
    label: "Project & Task Management",
    desc: "Plan, assign, execute, and track work in real time.",
    Icon: Layers,
    hex: "#a855f7",
  },
  {
    label: "Collaboration Hub",
    desc: "Chat, share files, co-create, and stay aligned.",
    Icon: MessageSquare,
    hex: "#10b981",
  },
  {
    label: "Workflow Automation",
    desc: "Automate repetitive tasks and streamline operations.",
    Icon: Zap,
    hex: "#f97316",
  },
  {
    label: "Time Tracking & Reporting",
    desc: "Measure productivity and optimize performance.",
    Icon: Clock,
    hex: "#eab308",
  },
  {
    label: "Secure Cloud Workspace",
    desc: "Work from anywhere with enterprise-grade security.",
    Icon: Shield,
    hex: "#2563EB",
  },
];

const HIW_ENGINES = [
  "Transform how organizations perform, how people grow, how communities thrive, and how work gets done.",
  "Transform fragmented, analog processes into a connected digital value chain — from strategy and people, to execution, collaboration, and measurable impact.",
  "Accelerate innovation, build resilient future-ready teams, and expand access through technology.",
];

const HIW_RESULTS = [
  "Ramp-up client acquisition and retention",
  "Find, vet, and match the right expertise quickly",
  "Fast-track human capability and execution",
  "Streamline operations, scale systems & performance",
  "Fuel innovation & drive digital growth",
  "No more delivery breakdowns across disconnected tools",
];

const HIW_OUTCOMES = [
  "Faster execution",
  "Better collaboration",
  "Fewer silos",
  "Higher productivity",
  "Remote and hybrid work that runs cleanly",
];

export default function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="hiw-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 28 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#080808] border border-white/8 rounded-3xl overflow-hidden shadow-[0_0_120px_rgba(194,18,25,0.18)]"
      >
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Red top glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-[#2563EB]/12 blur-3xl pointer-events-none" />

        {/* ── Premium Hero Header ── */}
        <div className="relative sticky top-0 z-10 overflow-hidden bg-[#080808]/95 backdrop-blur-md border-b border-white/6">
          {/* Header bg layers */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -top-16 left-1/3 w-72 h-32 rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent" />

          {/* Top bar — badge + close */}
          <div className="flex items-center justify-between px-8 pt-5 pb-2">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30">
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
                Platform Walkthrough
              </span>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block text-[10px] text-gray-600 font-medium tracking-wide"
              >
                click outside to close
              </motion.span>
              <motion.button
                whileHover={{
                  scale: 1.12,
                  rotate: 90,
                  boxShadow: "0 0 16px rgba(194,18,25,0.45)",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-[#2563EB]/40 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Main header content */}
          <div className="px-8 pb-6 pt-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12,
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
                className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-rose-400 to-white"
              >
                How It Works
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 280,
                  damping: 24,
                }}
                className="text-xs text-gray-500 leading-relaxed max-w-xl"
              >
                We bring people, tasks, tools and workflows together —
                intelligently and effortlessly — to create the conditions for
                transformation that lasts.
              </motion.p>
            </div>

            {/* Tagline pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.28,
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              className="flex flex-wrap gap-1.5 sm:justify-end"
            >
              {["AI-assisted", "Marketplace-driven", "Enterprise-scalable"].map(
                (tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.32 + i * 0.07 }}
                    whileHover={{
                      scale: 1.06,
                      borderColor: "rgba(194,18,25,0.5)",
                      color: "#fff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-medium text-gray-400 cursor-default transition-colors"
                  >
                    {tag}
                  </motion.span>
                ),
              )}
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-[#2563EB]/50 via-[#2563EB]/20 to-transparent" />
        </div>

        {/* Scrollable body — scrollbar hidden */}
        <div
          className="overflow-y-auto max-h-[72vh] px-8 py-10 space-y-8"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties
          }
        >
          {/* ── The Process — red tint ── */}
          <motion.div
            whileHover={{ borderColor: "rgba(194,18,25,0.45)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[#2563EB]/15 bg-[#2563EB]/[0.04] p-7 space-y-6"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-rose-400">
                The Process
              </p>
              <h3 className="text-xl font-bold text-white">
                One Ecosystem. Every Layer of Impact.
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {HIW_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 12px 36px ${step.hex}35`,
                    borderColor: step.hex + "70",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-xl bg-white/[0.02] p-6 flex flex-col gap-4 overflow-hidden group"
                  style={{ border: `1px solid ${step.hex}30` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${step.hex}08, transparent)`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-white/5 select-none">
                      {step.num}
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: step.hex + "20",
                        border: `1px solid ${step.hex}40`,
                      }}
                    >
                      <step.Icon
                        className="h-4 w-4"
                        style={{ color: step.hex }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white mb-1.5">
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div
                    className="h-0.5 w-8 rounded-full mt-auto"
                    style={{ backgroundColor: step.hex }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Platform Capabilities — blue tint ── */}
          <motion.div
            whileHover={{ borderColor: "rgba(59,130,246,0.45)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.04] p-7 space-y-6"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Platform Capabilities
              </p>
              <h3 className="text-xl font-bold text-white">
                Power Your Work With
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIW_POWERS.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                  whileHover={{
                    y: -3,
                    boxShadow: `0 8px 28px ${p.hex}30`,
                    borderColor: p.hex + "65",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-5"
                  style={{ border: `1px solid ${p.hex}28` }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: p.hex + "18",
                      border: `1px solid ${p.hex}35`,
                    }}
                  >
                    <p.Icon className="h-3.5 w-3.5" style={{ color: p.hex }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">
                      {p.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── LAMID Engines — emerald tint ── */}
          <motion.div
            whileHover={{ borderColor: "rgba(16,185,129,0.45)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-7 space-y-6"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                LAMID&apos;s POWER ENGINES
              </p>
              <h3 className="text-xl font-bold text-white">
                Built to Drive Real Transformation
              </h3>
            </div>
            <ul className="space-y-4">
              {HIW_ENGINES.map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-[13px] text-gray-300 leading-loose"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {e}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Results + Outcomes — side by side ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Your Results — orange tint */}
            <motion.div
              whileHover={{ borderColor: "rgba(249,115,22,0.45)" }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.04] p-7 space-y-5"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  Your Results
                </p>
                <h3 className="text-lg font-bold text-white">What You Gain</h3>
              </div>
              <ul className="space-y-3">
                {HIW_RESULTS.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-2.5 text-[13px] text-gray-300 leading-relaxed"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    {r}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Outcomes — purple tint */}
            <motion.div
              whileHover={{ borderColor: "rgba(168,85,247,0.45)" }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.04] p-7 space-y-5"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                  Outcomes
                </p>
                <h3 className="text-lg font-bold text-white">The End State</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {HIW_OUTCOMES.map((o, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{
                      scale: 1.06,
                      boxShadow: "0 0 14px rgba(168,85,247,0.4)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="px-4 py-2 rounded-full border border-purple-500/25 bg-purple-500/10 text-[13px] font-medium text-purple-300 cursor-default"
                  >
                    {o}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
