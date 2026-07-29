"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const VALUE_PROPS = [
  {
    icon: "◈",
    iconCls: "text-[#2563EB]",
    title: "AI-Matched Expertise",
    body: "Our intelligent matching engine analyzes your challenge, sector, and goals to surface the consultants most likely to deliver results — not just the ones who are available.",
  },
  {
    icon: "⬡",
    iconCls: "text-blue-400",
    title: "Faster Delivery, Built In",
    body: "Every engagement is supported by LAMID CORE's AI delivery tools, cutting average project timelines by up to 40% without sacrificing quality.",
  },
  {
    icon: "⬟",
    iconCls: "text-emerald-400",
    title: "Outcomes You Can Measure",
    body: "Real-time dashboards track engagement progress, milestones, and ROI from kickoff to completion.",
  },
];

const HOW_MATCHING = [
  { value: "47", label: "Data points analyzed per match" },
  { value: "AI", label: "Match Score per consultant" },
  { value: "Human", label: "Verified quality assurance" },
];

const USE_CASES = [
  { label: "Strategy & Growth" },
  { label: "Finance & Restructuring" },
  { label: "Technology & Digital" },
  { label: "Legal & Compliance" },
  { label: "HR & Talent" },
  { label: "Marketing & Brand" },
];

export default function MarketplaceHero() {
  return (
    <>
      {/* Hero */}
      <section className="lamidone-section pt-20 pb-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lamidone-gradient-text text-[10px] tracking-[0.35em] uppercase font-bold mb-4"
          >
            LAMID CORE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-snug mb-4"
          >
            Find the Right Expert.{" "}
            <span className="lamidone-gradient-text">Start Today.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 dark:text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8"
          >
            LAMID CORE connects your organization with vetted, AI-matched consultants — ready to deliver results from day one.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/talent"
              className="px-6 py-3 rounded-full text-sm font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
            >
              Browse Consultants →
            </Link>
            <Link
              href="/postjobs"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-white/20 text-white/70 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
            >
              Post a Project →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How matching works */}
      <section className="lamidone-section py-6 px-4 border-y border-white/8 dark:border-white/8 border-gray-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-600 dark:text-white/55 text-xs uppercase tracking-widest mb-6">
            How Matching Works
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {HOW_MATCHING.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-2xl font-bold lamidone-gradient-text block">{item.value}</span>
                <span className="text-gray-500 dark:text-white/50 text-xs mt-1 block">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="lamidone-section py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUE_PROPS.map((vp, i) => (
              <motion.div
                key={vp.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white/[0.025] border border-white/8 rounded-2xl p-6"
              >
                <span className={`text-3xl block mb-4 ${vp.iconCls}`}>{vp.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{vp.title}</h3>
                <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{vp.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="lamidone-section py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.35em] uppercase font-bold mb-6 text-center">
            Sectors We Cover
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {USE_CASES.map((uc) => (
              <span
                key={uc.label}
                className="px-4 py-2 rounded-full border border-white/10 text-white/60 text-xs font-medium hover:border-[#2563EB]/60 hover:text-white transition-colors cursor-default"
              >
                {uc.label}
              </span>
            ))}
            <span className="px-4 py-2 rounded-full border border-[#2563EB]/30 lamidone-gradient-text text-xs font-medium">
              + Open Brief — any challenge
            </span>
          </div>
        </div>
      </section>

      {/* For Expert Partners banner */}
      <section className="lamidone-section py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.03] border border-white/8 rounded-2xl px-7 py-5">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Are you a consultant?</p>
              <p className="text-gray-500 dark:text-white/50 text-xs">Join the LAMID ONE network. Build your profile, get matched to quality engagements, and grow your practice.</p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold border border-[#2563EB]/60 text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
            >
              Join the Ecosystem →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
