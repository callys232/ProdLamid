"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, ShieldCheck, Globe } from "lucide-react";

const TILES = [
  { icon: Sparkles,    href: "/ecosystem", title: "Unified by Design",           body: "One system built to work as a whole — across your strategy, growth, talent, and finance. Not four tools bolted together. One connected platform." },
  { icon: Zap,         href: "/talent",   title: "Human Insight + AI Precision", body: "Human expertise and AI precision working together. Clear thinking, backed by intelligent signal — so you decide on evidence, not assumption." },
  { icon: ShieldCheck, href: "/pricing",  title: "Built for Every Scale",        body: "From growing teams to global enterprises, LAMID ONE adapts to where you are and grows with where you're going." },
  { icon: Globe,       href: "/ecosystem", title: "Outcomes Not Reports",        body: "Every recommendation you get connects to action. Tools, advisors, and a system that tracks what happens after the insight lands." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const tileV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function WhyLamidOne() {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section className="relative lamidone-section py-10 px-4 overflow-hidden">

      {/* Grid bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {["M0 100 L1400 100", "M0 300 L1400 300", "M0 500 L1400 500",
          "M300 0 L300 700", "M700 0 L700 700", "M1100 0 L1100 700"].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.4"
            strokeOpacity="0.05" strokeDasharray="6 40"
            animate={{ strokeDashoffset: [0, -100], opacity: [0.03, 0.1, 0.03] }}
            transition={{ duration: 24 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
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
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            Why LAMID ONE
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            <span className="lamidone-gradient-text">Why LAMID ONE Works.</span>
          </h2>
        </motion.div>

        {/* 4 tiles */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {TILES.map((tile, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={tile.title}
                variants={tileV}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => router.push(tile.href)}
                whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(37,99,235,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="relative lamidone-card border rounded-2xl p-7 overflow-hidden cursor-pointer"
                style={{ borderColor: isHov ? "rgba(37,99,235,0.4)" : undefined }}
              >
                {/* Glow — red */}
                <motion.div
                  className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none bg-[#2563EB]"
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Bottom sweep — red */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                  style={{ background: "linear-gradient(to right, #2563EB, transparent)" }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon square — premium badge, always red */}
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#2563EB]/25 bg-[#2563EB]/12"
                  animate={{
                    scale: isHov ? 1.12 : 1,
                    boxShadow: isHov ? "0 0 16px rgba(37,99,235,0.35)" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <tile.icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.75} />
                </motion.div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{tile.title}</h3>
                <p className="text-gray-600 dark:text-white/65 text-xs leading-relaxed">{tile.body}</p>

                <motion.span
                  className="text-[10px] font-semibold mt-3 block lamidone-gradient-text"
                  animate={{ opacity: isHov ? 1 : 0, y: isHov ? 0 : 4 }}
                  transition={{ duration: 0.16 }}
                >
                  Open →
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
