"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PORTALS = [
  {
    id: "marketplace",
    icon: "◈",
    iconCls: "text-[#C12129]",
    accentColor: "#C12129",
    label: "AIVORA Marketplace",
    headline: "Find the Right Expert. Start Today.",
    body: "AI-matched access to vetted consultants across every sector and challenge type. Faster delivery, measurable outcomes, global reach.",
    cta: "Explore the Marketplace",
    href: "/talent",
    ctaCls: "bg-[#C12129] hover:bg-[#a01a20] text-white",
  },
  {
    id: "biz",
    icon: "⬡",
    iconCls: "text-blue-400",
    accentColor: "#3b82f6",
    label: "AIVORA BIZ Portal",
    headline: "Clarity at the Speed of Decision.",
    body: "Real-time AI-powered business intelligence that gives your leadership team the insights, diagnostics, and scenario modelling to act with confidence.",
    cta: "Explore the BIZ Portal",
    href: "/biz",
    ctaCls: "border border-blue-500/50 text-blue-400 hover:bg-blue-500/10",
  },
  {
    id: "talent",
    icon: "⬟",
    iconCls: "text-orange-400",
    accentColor: "#f97316",
    label: "AIVORA Talent Portal",
    headline: "Build the Organization That Builds the Future.",
    body: "AI-personalized learning pathways, expert coaching, and globally recognized certifications — designed for professionals who move fast.",
    cta: "Explore the Talent Portal",
    href: "/hcd",
    ctaCls: "border border-orange-500/50 text-orange-400 hover:bg-orange-500/10",
  },
];

/* Diagonal sweeping lines — different angles than PortalServicesSlide */
const paths = [
  { d: "M1400 0 L900 300 L400 -100", delay: 0,   dur: 22 },
  { d: "M1400 200 L800 500 L200 100", delay: 3.5, dur: 26 },
  { d: "M1200 -50 L600 350 L0 50",   delay: 7,   dur: 20 },
];
const dots = [
  { cx: "5%",  cy: 30, r: 1.5, delay: 0,   dur: 8,  floatPct: 4 },
  { cx: "95%", cy: 70, r: 1,   delay: 2,   dur: 10, floatPct: 4 },
  { cx: "50%", cy: 10, r: 1.5, delay: 4,   dur: 7,  floatPct: 3 },
  { cx: "20%", cy: 90, r: 1,   delay: 1,   dur: 9,  floatPct: 4 },
];

export default function EcosystemOverview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section className="relative aivora-section py-16 px-4 overflow-hidden">

      {/* Diagonal lines bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.1" strokeDasharray="10 22"
            animate={{ strokeDashoffset: [0, 130], opacity: [0.06, 0.18, 0.06] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {dots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.12, 0.35, 0.12] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            The AIVORA Ecosystem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug">
            One Platform.{" "}
            <span className="text-[#C12129]">Three Powerful Portals.</span>
          </h2>
          <p className="mt-3 text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Everything your organization needs to grow — in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PORTALS.map((portal, i) => {
            const isHov = hovered === portal.id;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                animate={{ y: isHov ? -6 : 0 }}
                onHoverStart={() => setHovered(portal.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(portal.href)}
                className="group relative flex flex-col aivora-card border rounded-2xl p-7 overflow-hidden transition-colors duration-300 cursor-pointer"
                style={{ borderColor: isHov ? `${portal.accentColor}55` : undefined }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{ background: portal.accentColor }}
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: isHov ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                />

                {/* Glow blob */}
                <motion.div
                  className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
                  style={{ background: portal.accentColor }}
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.35 }}
                />

                {/* Bottom sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                  style={{ background: `linear-gradient(to right, ${portal.accentColor}, transparent)` }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />

                <p className={`text-[10px] tracking-[0.3em] uppercase font-bold mb-4 ${portal.iconCls}`}>
                  {portal.label}
                </p>

                <motion.span
                  className={`text-4xl mb-4 block ${portal.iconCls}`}
                  animate={{ scale: isHov ? 1.18 : 1, rotate: isHov ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {portal.icon}
                </motion.span>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-3">
                  {portal.headline}
                </h3>

                <p className="text-gray-600 dark:text-white/55 text-sm leading-relaxed flex-1 mb-6">
                  {portal.body}
                </p>

                <Link
                  href={portal.href}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all w-fit ${portal.ctaCls}`}
                >
                  {portal.cta}
                  <motion.span animate={{ x: isHov ? 3 : 0 }} transition={{ duration: 0.15 }}>
                    →
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
