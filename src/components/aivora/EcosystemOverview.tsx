"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Network, TrendingUp, GraduationCap, Landmark } from "lucide-react";

const PORTALS = [
  {
    id: "core",
    icon: Network,
    label: "LAMID CORE",
    tagline: "Strategy, alignment, and execution made clear.",
    body: "LAMID CORE helps leaders align strategy, execution, and performance — all in one place.",
    cta: "Explore CORE",
    href: "/core",
  },
  {
    id: "grow",
    icon: TrendingUp,
    label: "LAMID GROW",
    tagline: "Customer clarity. Digital confidence.",
    body: "LAMID GROW shows how customers find, interact with, and experience your business — and where to improve.",
    cta: "Explore GROW",
    href: "/grow",
  },
  {
    id: "talent",
    icon: GraduationCap,
    label: "LAMID TALENT",
    tagline: "People intelligence for modern teams.",
    body: "LAMID TALENT helps leaders understand team performance, culture health, and workforce needs.",
    cta: "Explore TALENT",
    href: "/talent",
  },
  {
    id: "finance",
    icon: Landmark,
    label: "LAMID FINANCE",
    tagline: "Financial clarity for every leader.",
    body: "LAMID FINANCE gives you real-time visibility, smarter forecasting, and a calm, confident way to understand enterprise value.",
    cta: "Explore FINANCE",
    href: "/finance",
  },
];

const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export default function EcosystemOverview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section id="ecosystem" className="relative aivora-section py-16 px-4 overflow-hidden">

      {/* Diagonal bg lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M1400 0 L900 300 L400 -100",
          "M1400 200 L800 500 L200 100",
          "M1200 -50 L600 350 L0 50",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
            strokeOpacity="0.08" strokeDasharray="10 22"
            animate={{ strokeDashoffset: [0, 130], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3.5 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-start">

          {/* ── LEFT: sticky headline panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:sticky lg:top-24 lg:self-start mb-10 lg:mb-0 py-4"
          >
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-5">
              The Ecosystem
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-[1.12] tracking-tight mb-5">
              One Platform.{" "}
              <span className="aivora-gradient-text">Four Engines.</span>
              <br className="hidden sm:block" />
              Every Layer of Your Business.
            </h2>
            <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
              Your strategy, growth, talent, and finance — unified under one intelligent layer,
              so every part of your organization moves in the same direction at the same time.
            </p>
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-2 text-sm font-semibold aivora-gradient-text hover:opacity-80 transition-opacity"
            >
              Explore the full ecosystem
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* ── RIGHT: 2-column scrollable card grid ── */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
                  whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(37,99,235,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex flex-col aivora-card border rounded-2xl p-8 overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ borderColor: isHov ? "rgba(37,99,235,0.4)" : undefined }}
                >
                  {/* Left accent bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#2563EB]"
                    animate={{ scaleY: isHov ? 1 : 0, originY: 0 }}
                    transition={{ duration: 0.22 }}
                  />

                  {/* Corner glow */}
                  <motion.div
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none bg-[#2563EB]"
                    animate={{ opacity: isHov ? 0.12 : 0 }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* Bottom sweep */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                    style={{ background: "linear-gradient(to right, #2563EB, transparent)" }}
                    animate={{ width: isHov ? "100%" : "0%" }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* Icon badge */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#2563EB]/25 bg-[#2563EB]/10"
                    animate={{
                      scale: isHov ? 1.08 : 1,
                      boxShadow: isHov ? "0 0 24px rgba(37,99,235,0.35)" : "0 0 0 rgba(37,99,235,0)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <portal.icon className="w-7 h-7 text-[#2563EB]" strokeWidth={1.75} />
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
      </div>
    </section>
  );
}
