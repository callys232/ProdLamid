"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PORTALS = [
  {
    id: "marketplace",
    icon: "◈",
    label: "AIVORA Marketplace",
    headline: "Find the Right Expert. Start Today.",
    body: "AI-powered expert matching. Find the right consultant, advisor, or specialist in minutes — not months.",
    cta: "Explore Marketplace",
    href: "/talent",
  },
  {
    id: "biz",
    icon: "⬡",
    label: "AIVORA BIZ Portal",
    headline: "Clarity at the Speed of Decision.",
    body: "Your AI-augmented command center. Real-time analytics, strategic dashboards, and governance tools.",
    cta: "Explore BIZ",
    href: "/biz",
  },
  {
    id: "talent",
    icon: "⬟",
    label: "AIVORA Talent Portal",
    headline: "Build the Organization That Builds the Future.",
    body: "Personalized AI learning and career development for every professional.",
    cta: "Explore Talent",
    href: "/hcd",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function EcosystemOverview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section className="relative aivora-section py-24 px-4 overflow-hidden">

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
          className="text-center mb-16"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            The Ecosystem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            Three Portals.{" "}
            <span className="aivora-gradient-text">One Ecosystem.</span>
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re seeking expertise, running a business, or building your career —
            AIVORA has a portal for you.
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

                {/* Icon — always red */}
                <motion.span
                  className="text-4xl mb-5 block text-[#C12129]"
                  animate={{ scale: isHov ? 1.2 : 1, rotate: isHov ? 6 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {portal.icon}
                </motion.span>

                <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3 text-[#C12129]">
                  {portal.label}
                </p>

                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-3">
                  {portal.headline}
                </h3>

                <p className="text-gray-600 dark:text-white/55 text-sm leading-relaxed flex-1 mb-6">
                  {portal.body}
                </p>

                <Link
                  href={portal.href}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C12129] hover:text-red-400 transition-colors"
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
