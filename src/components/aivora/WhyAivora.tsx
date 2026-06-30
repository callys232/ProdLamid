"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const TILES = [
  { icon: "⚡", href: "/talent",  title: "Human + AI Hybrid",  body: "The best of human intuition combined with AI precision. Neither alone is enough." },
  { icon: "◈", href: "/talent",  title: "10x Faster Matching", body: "AI-powered expert matching delivers results in minutes, not weeks or months." },
  { icon: "⬡", href: "/pricing", title: "Enterprise-Grade",    body: "SOC 2 compliant, end-to-end encryption, and enterprise SSO integration." },
  { icon: "⬟", href: "/postjobs",title: "Accessible to All",   body: "Democratizing world-class consulting for organizations of every size." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const tileV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function WhyAivora() {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  return (
    <section className="relative aivora-section py-10 px-4 overflow-hidden">

      {/* Grid bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {["M0 100 L1400 100", "M0 300 L1400 300", "M0 500 L1400 500",
          "M300 0 L300 700", "M700 0 L700 700", "M1100 0 L1100 700"].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#C12129" strokeWidth="0.4"
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
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            Why LAMID ONE
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            <span className="aivora-gradient-text">Built Different</span>
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
                whileHover={{ y: -6, boxShadow: "0 16px 36px rgba(193,33,41,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="relative aivora-card border rounded-2xl p-7 overflow-hidden cursor-pointer"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}
              >
                {/* Glow — red */}
                <motion.div
                  className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none bg-[#C12129]"
                  animate={{ opacity: isHov ? 0.12 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Bottom sweep — red */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                  style={{ background: "linear-gradient(to right, #C12129, transparent)" }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon square — always red */}
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border border-[#C12129]/25 bg-[#C12129]/12"
                  animate={{
                    scale: isHov ? 1.12 : 1,
                    boxShadow: isHov ? "0 0 16px rgba(193,33,41,0.35)" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <span className="text-lg aivora-gradient-text">{tile.icon}</span>
                </motion.div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{tile.title}</h3>
                <p className="text-gray-600 dark:text-white/65 text-xs leading-relaxed">{tile.body}</p>

                <motion.span
                  className="text-[10px] font-semibold mt-3 block aivora-gradient-text"
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
