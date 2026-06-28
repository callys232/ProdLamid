"use client";

import { motion } from "framer-motion";

const ITEMS = [
  { text: "Trusted by 14+ enterprise organizations across 6 countries" },
  { text: "120+ Expert Partners" },
  { text: "4.8/5 Client Satisfaction" },
];

export default function ProofStrip() {
  return (
    <section className="relative aivora-section border-y border-white/8 dark:border-white/8 border-gray-200 py-5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-0"
        >
          {ITEMS.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-white/50 font-medium">
                {item.text}
              </span>
              {i < ITEMS.length - 1 && (
                <span className="hidden sm:inline mx-4 text-gray-300 dark:text-white/20 select-none">|</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
