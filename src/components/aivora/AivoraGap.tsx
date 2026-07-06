"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STATS = [
  {
    value: "$1.3T",
    label: "Lost annually to poor decision-making in enterprises worldwide",
    authHref: "/premium/business-diagnostic",
    accent: "#C12129",
  },
  {
    value: "87%",
    label: "Of organizations struggle to find the right expertise when they need it",
    authHref: "/talent",
    accent: "#3b82f6",
  },
  {
    value: "73%",
    label: "Of AI initiatives fail without proper human expertise guiding them",
    authHref: "/hcd",
    accent: "#f97316",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const cardVariant = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function AivoraGap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section className="relative aivora-section py-10 px-4 overflow-hidden">

      {/* Subtle vertical column lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[200, 500, 800, 1100].map((x, i) => (
          <motion.line key={i} x1={x} y1="-20" x2={x} y2="120%"
            stroke="#C12129" strokeWidth="0.5" strokeOpacity="0.07" strokeDasharray="4 28"
            animate={{ strokeDashoffset: [0, -80], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear", delay: i * 2 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-7"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            The Problem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            <span className="aivora-gradient-text">Complexity Is Accelerating</span>
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Organizations today face accelerating complexity: digital disruption, workforce shifts,
            competitive pressure, and fragmented consulting solutions that cannot keep pace with
            real-time change.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {STATS.map((stat, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariant}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(stat.authHref)}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(193,33,41,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="relative aivora-card border rounded-2xl p-8 overflow-hidden cursor-pointer transition-colors duration-300"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.45)" : undefined }}
              >
                {/* Top accent bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${stat.accent}, transparent)` }}
                  animate={{ scaleX: isHov ? 1 : 0, originX: 0 }}
                  transition={{ duration: 0.28 }}
                />

                {/* Glow */}
                <motion.div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                  style={{ background: stat.accent }}
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.p
                  className="text-4xl sm:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-br from-[#C12129] via-red-400 to-red-300 dark:to-white"
                  animate={{ scale: isHov ? 1.06 : 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-600 dark:text-white/65 text-sm leading-relaxed">
                  {stat.label}
                </p>

                <motion.span
                  className="text-[10px] font-semibold mt-3 block aivora-gradient-text"
                  animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                  transition={{ duration: 0.16 }}
                >
                  Explore solution →
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
