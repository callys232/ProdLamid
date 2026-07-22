"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Network, TrendingUp, GraduationCap, Landmark, Users, Building2, Rocket, Globe } from "lucide-react";

const BY_ROLE = [
  {
    role: "CEO / Executive Leader",
    Icon: Building2,
    need: "You need one source of truth across the entire organization — not four dashboards telling four different stories.",
    engines: ["LAMID CORE", "LAMID FINANCE"],
    hrefs: ["/core", "/finance"],
    cta: "Start with CORE",
    ctaHref: "/core",
  },
  {
    role: "Chief Strategy Officer",
    Icon: Network,
    need: "You need a strategy that stays relevant as the market moves — not a plan you revisit once a year and hope still holds.",
    engines: ["LAMID CORE"],
    hrefs: ["/core"],
    cta: "Explore Lamid Core",
    ctaHref: "/core",
  },
  {
    role: "Chief Marketing / Commercial Officer",
    Icon: TrendingUp,
    need: "You need market timing intelligence and customer insight that tells you where to move, not just where you've been.",
    engines: ["LAMID GROW"],
    hrefs: ["/grow"],
    cta: "Explore Lamid Grow",
    ctaHref: "/grow",
  },
  {
    role: "Chief People Officer",
    Icon: Users,
    need: "You need to put the right people in the right roles — and prove the impact of your people strategy in business terms.",
    engines: ["LAMID TALENT"],
    hrefs: ["/talent"],
    cta: "Explore Lamid Talent",
    ctaHref: "/talent",
  },
  {
    role: "Chief Financial Officer",
    Icon: Landmark,
    need: "You need real-time financial visibility that connects capital decisions to organizational performance — not month-end surprises.",
    engines: ["LAMID FINANCE"],
    hrefs: ["/finance"],
    cta: "Explore Lamid Finance",
    ctaHref: "/finance",
  },
  {
    role: "Growth-Stage Business",
    Icon: Rocket,
    need: "You need to scale without losing control — clear strategy, proven growth levers, and a people system that builds as you grow.",
    engines: ["LAMID CORE", "LAMID GROW", "LAMID TALENT"],
    hrefs: ["/core", "/grow", "/talent"],
    cta: "Take your Lamid One Diagnostic",
    ctaHref: "/premium/business-diagnostic",
  },
  {
    role: "Enterprise Organization",
    Icon: Globe,
    need: "You need a unified operating system that connects your strategy, your markets, your people, and your capital — at scale.",
    engines: ["LAMID CORE", "LAMID GROW", "LAMID TALENT", "LAMID FINANCE"],
    hrefs: ["/core", "/grow", "/talent", "/finance"],
    cta: "Talk to Us",
    ctaHref: "/contact",
  },
];

const cardV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.42 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

export default function SolutionsPage() {
  return (
    <main className="min-h-screen aivora-section">

      {/* Hero */}
      <section className="relative py-28 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[520px] h-[240px] rounded-full bg-[#2563EB]/6 blur-[90px]" />
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {["M0 100 L1400 100", "M0 300 L1400 300", "M300 0 L300 600", "M800 0 L800 600"].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.4"
              strokeOpacity="0.05" strokeDasharray="6 40"
              animate={{ strokeDashoffset: [0, -100], opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 24 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="aivora-gradient-text">Built for Your Role. Built for Your Scale.</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.12] tracking-tight text-gray-900 dark:text-white mb-6"
          >
            The right solution{" "}
            <span className="aivora-gradient-text">for where you are.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-gray-500 dark:text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            LAMID ONE adapts to your role, your scale, and your sector — not the other way around.
          </motion.p>
        </div>
      </section>

      {/* Solutions by role */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
              By Role
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Find your starting point.
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {BY_ROLE.map((sol) => (
              <motion.div
                key={sol.role}
                variants={cardV}
                whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(37,99,235,0.18)" }}
                className="aivora-card border rounded-2xl p-7 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#2563EB]/25 bg-[#2563EB]/10">
                  <sol.Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.75} />
                </div>

                <p className="text-base font-bold text-gray-900 dark:text-white mb-3">{sol.role}</p>
                <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed mb-5 flex-1">
                  {sol.need}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {sol.engines.map((eng, i) => (
                    <Link key={i} href={sol.hrefs[i]}
                      className="text-[9px] font-bold px-2.5 py-1 rounded-full text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 hover:bg-[#2563EB]/20 transition-colors"
                    >
                      {eng}
                    </Link>
                  ))}
                </div>

                <Link href={sol.ctaHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold aivora-gradient-text hover:opacity-80 transition-opacity"
                >
                  {sol.cta} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Not sure where to start?
            </h2>
            <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed mb-8">
              Take the Enterprise Diagnostic. In two minutes, we&apos;ll show you exactly where LAMID ONE can have the most impact for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/premium/business-diagnostic"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-sm bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                Take your Lamid One Diagnostic
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
              >
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
