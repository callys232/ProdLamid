"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Search, BarChart2, BookOpen, Users, Heart } from "lucide-react";
import { useScrollBackground } from "@/hooks/useScrollBackground";

const FEATURES = [
  {
    Icon: Search,
    title: "40+ Signal Matching Engine",
    body: "Goes far beyond CVs. LAMID TALENT evaluates capability, culture fit, leadership potential, and role trajectory — across 40+ organizational signals — to surface the right person for the right role.",
    href: "/jobs",
    cta: "Find Expert Talent →",
  },
  {
    Icon: GraduationCap,
    title: "AI-Assisted Capability Diagnostics",
    body: "Understand what your people can actually do — not just what their job titles say. Our capability diagnostic maps real skills to real business needs.",
    href: "/talent/capability-diagnostics",
    cta: "Run Capability Diagnostic →",
  },
  {
    Icon: BookOpen,
    title: "LMS-Driven Learning Acceleration",
    body: "A learning management system built for workforce impact, not just compliance. Courses, pathways, and skill-building tied directly to what your organization needs next.",
    href: "/talent/lms",
    cta: "Launch Learning Platform →",
  },
  {
    Icon: BarChart2,
    title: "Workforce Intelligence",
    body: "Real-time visibility into team performance, capability gaps, engagement trends, and succession risk — so people decisions are grounded in data, not instinct.",
    href: "/talent/workforce-analytics",
    cta: "View Workforce Analytics →",
  },
  {
    Icon: Heart,
    title: "Mentorship Program",
    body: "Structured mentorship connections that pair emerging talent with experienced professionals — building institutional knowledge and leadership pipelines that compound over time.",
    href: "/talent/mentorship",
    cta: "Explore Mentorship →",
  },
];

const WHY = [
  "Better teams built on real capability, not resume keywords",
  "A learning culture that grows with your organization",
  "People decisions that connect to business outcomes",
  "Succession and retention intelligence before it's too late",
];

const cardV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.42 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export default function TalentPage() {
  useScrollBackground();
  return (
    <main className="min-h-screen lamidone-section">

      {/* Hero */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[480px] h-[220px] rounded-full bg-[#2563EB]/6 blur-[80px]" />
        </div>

        {/* Grid bg */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {["M0 150 L1400 150", "M0 350 L1400 350", "M350 0 L350 600", "M900 0 L900 600"].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.4"
              strokeOpacity="0.05" strokeDasharray="6 40"
              animate={{ strokeDashoffset: [0, -100], opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 24 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="lamidone-gradient-text">People Intelligence Engine</span>
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4"
              >
                LAMID TALENT
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white mb-6"
              >
                People intelligence for{" "}
                <span className="lamidone-gradient-text">modern teams.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-gray-500 dark:text-white/60 text-base leading-relaxed mb-8"
              >
                LAMID TALENT helps leaders understand culture, performance, and workforce needs with clarity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/talent-dashboard"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm overflow-hidden bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
                  <span className="relative z-10">See TALENT in Action</span>
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
                >
                  Book a Demo
                </Link>
              </motion.div>
            </div>

            {/* Why it matters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lamidone-card border rounded-2xl p-8"
            >
              <p className="lamidone-gradient-text text-[10px] tracking-[0.35em] uppercase font-bold mb-5">
                Why It Matters
              </p>
              <ul className="space-y-4">
                {WHY.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB]/12 border border-[#2563EB]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#2563EB] text-[10px] font-bold">✓</span>
                    </span>
                    <span className="text-gray-700 dark:text-white/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section data-scroll-section data-bg-from-dark="#1456A0" data-bg-to-dark="#040A1E" data-bg-from-light="#B8CCFF" data-bg-to-light="#F5F3FF" className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">What You Get</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              People intelligence that <span className="lamidone-gradient-text">compounds over time.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feat) => (
              <Link key={feat.title} href={feat.href}>
                <motion.div
                  variants={cardV}
                  whileHover={{ y: -4, boxShadow: "0 16px 36px rgba(37,99,235,0.16)" }}
                  className="lamidone-card border rounded-2xl p-7 h-full flex flex-col cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#2563EB]/25 bg-[#2563EB]/10">
                    <feat.Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed flex-1">{feat.body}</p>
                  <span className="mt-4 text-[10px] font-semibold lamidone-gradient-text">
                    {feat.cta}
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section data-scroll-section data-bg-from-dark="#0A8090" data-bg-to-dark="#030C14" data-bg-from-light="#FDDCB0" data-bg-to-light="#FEF9F0" className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lamidone-card border rounded-2xl p-10 text-center"
          >
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Who It&apos;s For</p>
            <p className="text-gray-700 dark:text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              LAMID TALENT is built for Chief People Officers, HR leaders, and talent teams who need people decisions to be as data-driven and strategically connected as every other business decision.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              <Link href="/premium/business-diagnostic"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                Take the Diagnostic
              </Link>
              <a
                href="/talent/lms"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/18 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Launch Learning Platform
              </a>
              <Link href="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                Find Expert Consultants
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Ecosystem */}
      <section data-scroll-section data-bg-from-dark="#076070" data-bg-to-dark="#04101A" data-bg-from-light="#A8D8FF" data-bg-to-light="#F0F9FF" className="py-10 px-4 text-center">
        <Link href="/ecosystem" className="inline-flex items-center gap-2 text-sm font-medium lamidone-gradient-text hover:opacity-80 transition-opacity">
          ← Back to the Ecosystem
        </Link>
      </section>

    </main>
  );
}
