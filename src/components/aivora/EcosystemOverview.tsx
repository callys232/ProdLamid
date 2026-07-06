"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Network, TrendingUp, GraduationCap } from "lucide-react";

const PORTALS = [
  {
    id: "core",
    icon: Network,
    label: "LAMID CORE",
    tagline: "Continuous consulting clarity. Powered by HumanAI precision.",
    body: "The digital backbone of modern consulting — smart vetting, matching, workflows, and trust infrastructure for intelligent strategy and execution.",
    cta: "Explore CORE",
    href: "/talent",
  },
  {
    id: "grow",
    icon: TrendingUp,
    label: "LAMID GROW",
    tagline: "Where Digital Intelligence Accelerates Business Growth.",
    body: "The engine for business modernization — diagnostics, advisory, and digital transformation pathways for SMEs, startups, and enterprises.",
    cta: "Explore GROW",
    href: "/biz",
  },
  {
    id: "talent",
    icon: GraduationCap,
    label: "LAMID TALENT",
    tagline: "Stronger teams. Smarter decisions. Future-ready talent.",
    body: "The intelligence layer for workforce capability — AI-powered scoring, capability mapping, and LMS-driven learning acceleration.",
    cta: "Explore TALENT",
    href: "/hcd",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function EcosystemOverview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section className="relative aivora-section py-10 px-4 overflow-hidden">

      {/* Diagonal bg lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M1400 0 L900 300 L400 -100",
          "M1400 200 L800 500 L200 100",
          "M1200 -50 L600 350 L0 50",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#C12129" strokeWidth="0.5"
            strokeOpacity="0.08" strokeDasharray="10 22"
            animate={{ strokeDashoffset: [0, 130], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3.5 }}
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
          className="text-center mb-7"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            The Ecosystem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            Three Pillars.{" "}
            <span className="aivora-gradient-text">One Ecosystem.</span>
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            LAMID CORE, LAMID GROW, and LAMID TALENT — integrated into one seamless system
            for consulting excellence, enterprise growth, and workforce capability.
          </p>
        </motion.div>

        {/* Portal cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PORTALS.map((portal) => {
            const isHov = hovered === portal.id;
            return (
              <motion.div
                key={portal.id}
                variants={cardV}
                onHoverStart={() => setHovered(portal.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(portal.href)}
                whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(193,33,41,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col aivora-card border rounded-2xl p-8 overflow-hidden cursor-pointer transition-all duration-300"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#C12129]"
                  animate={{ scaleY: isHov ? 1 : 0, originY: 0 }}
                  transition={{ duration: 0.22 }}
                />

                {/* Corner glow */}
                <motion.div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none bg-[#C12129]"
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.35 }}
                />

                {/* Bottom sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                  style={{ background: "linear-gradient(to right, #C12129, transparent)" }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.35 }}
                />

                {/* Icon — premium badge, always red */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#C12129]/25 bg-[#C12129]/10"
                  animate={{
                    scale: isHov ? 1.08 : 1,
                    boxShadow: isHov ? "0 0 24px rgba(193,33,41,0.35)" : "0 0 0 rgba(193,33,41,0)",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <portal.icon className="w-7 h-7 text-[#C12129]" strokeWidth={1.75} />
                </motion.div>

                <p className="text-base font-bold mb-2 aivora-gradient-text">
                  {portal.label}
                </p>

                <p className="text-gray-900 dark:text-white text-sm font-semibold leading-snug mb-3">
                  {portal.tagline}
                </p>

                <p className="text-gray-500 dark:text-white/45 text-xs leading-relaxed flex-1 mb-6">
                  {portal.body}
                </p>

                <Link
                  href={portal.href}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold aivora-gradient-text hover:opacity-80 transition-opacity"
                >
                  {portal.cta}
                  <motion.span animate={{ x: isHov ? 4 : 0 }} transition={{ duration: 0.15 }}>
                    →
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
