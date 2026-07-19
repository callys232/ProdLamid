"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PROMISES = [
  {
    word: "Clarity",
    icon: "◎",
    desc: "One unified view across strategy, growth, people, and finance — so leaders stop guessing and start deciding with confidence.",
  },
  {
    word: "Growth",
    icon: "▲",
    desc: "Market timing intelligence, digital pathways, and customer insights that move with your business in real time.",
  },
  {
    word: "Value",
    icon: "◈",
    desc: "Every recommendation connects to outcome — not a report left on a shelf, but a system that tracks what happens next.",
  },
];

const cardV = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42 } },
};
const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function ThreePromises() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative aivora-section py-14 px-4 overflow-hidden">
      {/* Faint animated grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[160, 360, 560].map((y, i) => (
          <motion.line key={i} x1="0" y1={y} x2="100%" y2={y}
            stroke="#2563EB" strokeWidth="0.4" strokeOpacity="0.05" strokeDasharray="8 32"
            animate={{ strokeDashoffset: [0, -80], opacity: [0.03, 0.09, 0.03] }}
            transition={{ duration: 20 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
            The Promise
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Three things every leader deserves.
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {PROMISES.map((p, i) => {
            const isActive = hovered === i;
            return (
              <motion.div
                key={p.word}
                variants={cardV}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -10, scale: 1.04, boxShadow: "0 28px 56px rgba(37,99,235,0.22)" }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  backgroundColor: isActive
                    ? "rgba(37,99,235,0.10)"
                    : "rgba(37,99,235,0.04)",
                  borderColor: isActive
                    ? "rgba(37,99,235,0.50)"
                    : "rgba(37,99,235,0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative border rounded-2xl p-8 text-center overflow-hidden cursor-default"
              >
                {/* Corner glow bloom */}
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-[#2563EB]"
                  animate={{ opacity: isActive ? 0.18 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Bottom accent sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent"
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  style={{ originX: 0.5 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />

                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#2563EB]"
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.22 }}
                />

                {/* Icon */}
                <motion.span
                  className="text-2xl aivora-gradient-text block mb-4 select-none"
                  animate={{ scale: isActive ? 1.35 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  {p.icon}
                </motion.span>

                <h3 className="text-xl font-bold aivora-gradient-text mb-3">{p.word}</h3>
                <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
