"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BENEFITS = [
  {
    icon: "◈",
    title: "Steady Pipeline",
    body: "AI matches you with clients who need exactly your expertise. No more cold outreach or feast-or-famine cycles.",
    href: "/signup",
  },
  {
    icon: "⬡",
    title: "Build Your Brand",
    body: "Create a verified expert profile, collect reviews, and build a public track record that attracts premium clients.",
    href: "/signup",
  },
  {
    icon: "⚡",
    title: "AI-Augmented Delivery",
    body: "LAMID ONE's ecosystem amplifies your delivery — automated research, intelligent reporting, and data analysis built in.",
    href: "/premium/proposal-drafter",
  },
  {
    icon: "▣",
    title: "Premium Compensation",
    body: "Set your own rates. Get paid on time, every time. LAMID ONE handles invoicing and collections for you.",
    href: "/signup",
  },
];

const ELIGIBILITY = [
  "5+ years of domain expertise",
  "Verifiable professional credentials",
  "Track record of client impact",
  "Commitment to continuous learning",
  "Professional references (2+)",
  "Availability for 10+ hrs/month",
];

const STEPS = [
  { num: 1, title: "Apply Online",     body: "Submit your profile and credentials through our expert portal.", href: "/signup" },
  { num: 2, title: "AI Screening",     body: "Our AI validates credentials and assesses domain expertise fit.", href: "/signup" },
  { num: 3, title: "Panel Interview",  body: "Meet with our expert review board for a deep-dive assessment.", href: "/signup" },
  { num: 4, title: "Welcome Aboard",   body: "Get onboarded, set up your profile, and start receiving matches.", href: "/talent" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function ForExpertsPage() {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [hoveredStep,    setHoveredStep]    = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="lamidone-section min-h-screen">

      {/* ── Hero ── */}
      <section className="relative px-4 pt-28 pb-10 text-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <motion.path
            d="M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150"
            fill="none" stroke="#2563EB" strokeWidth="0.6" strokeOpacity="0.07" strokeDasharray="12 20"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-3xl mx-auto">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            For Experts
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span className="lamidone-gradient-text">Amplify Your Expertise</span>
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Join the LAMID ONE ecosystem and get matched with high-value engagements.
            Let AI handle the business while you focus on impact.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_22px_rgba(37,99,235,0.5)] hover:shadow-[0_0_34px_rgba(37,99,235,0.75)]">
              Apply to Join →
            </Link>
          </motion.div>
          <p className="text-xs text-gray-600 dark:text-white/55 mt-3">
            Applications reviewed within 5 business days. No fees to apply.
          </p>
        </motion.div>
      </section>

      {/* ── 4 Benefit cards ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            An ecosystem built for serious consultants.
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BENEFITS.map((b, i) => {
              const isHov = hoveredBenefit === i;
              return (
                <motion.div
                  key={b.title}
                  {...fadeUp(i * 0.08)}
                  onHoverStart={() => setHoveredBenefit(i)}
                  onHoverEnd={() => setHoveredBenefit(null)}
                  onClick={() => router.push(b.href)}
                  whileHover={{ y: -5, boxShadow: "0 14px 34px rgba(37,99,235,0.16)" }}
                  whileTap={{ scale: 0.97 }}
                  className="lamidone-card border rounded-2xl p-7 cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(37,99,235,0.4)" : undefined }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#2563EB]/12 border border-[#2563EB]/25"
                    animate={{ scale: isHov ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <span className="text-base lamidone-gradient-text">{b.icon}</span>
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{b.body}</p>
                  <motion.span
                    className="text-[10px] font-semibold mt-3 block lamidone-gradient-text"
                    animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    Learn more →
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Eligibility Requirements ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="lamidone-card border rounded-2xl p-8"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-8">
              Eligibility Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ELIGIBILITY.map((req) => (
                <div key={req} className="flex items-center gap-3">
                  <span className="text-[#2563EB] shrink-0">✓</span>
                  <span className="text-sm text-gray-600 dark:text-white/65">{req}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How to Join — 4 step cards ── */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            How to Join
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => {
              const isHov = hoveredStep === i;
              return (
                <motion.div
                  key={step.title}
                  {...fadeUp(i * 0.08)}
                  onHoverStart={() => setHoveredStep(i)}
                  onHoverEnd={() => setHoveredStep(null)}
                  onClick={() => router.push(step.href)}
                  whileHover={{ y: -6, boxShadow: "0 14px 34px rgba(37,99,235,0.16)" }}
                  whileTap={{ scale: 0.97 }}
                  className="lamidone-card border rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(37,99,235,0.4)" : undefined }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base mb-4 bg-[#2563EB]"
                    animate={{ scale: isHov ? 1.12 : 1, boxShadow: isHov ? "0 0 20px rgba(37,99,235,0.55)" : "none" }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Subtle bottom CTA ── */}
      <section className="px-4 pb-12">
        <motion.div {...fadeUp(0)}
          className="max-w-4xl mx-auto border-t border-gray-100 dark:border-white/6 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Join a network shaping the future of consulting.
            </p>
            <p className="text-xs text-gray-600 dark:text-white/55">
              Applications reviewed within 5 business days. No fees to apply.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)]">
              Apply to Join →
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
