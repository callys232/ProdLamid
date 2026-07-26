"use client";

import { motion } from "framer-motion";
import { Clock, Layers, Zap } from "lucide-react";

const ITEMS = [
  {
    Icon: Clock,
    bold: "30+",
    text: "years of consulting leadership",
  },
  {
    Icon: Layers,
    bold: "4",
    text: "unified engines",
  },
  {
    Icon: Zap,
    bold: "40+",
    text: "signals per talent match",
  },
];

export default function ProofStrip() {
  return (
    <section className="relative lamidone-section border-y border-white/8 dark:border-white/8 border-gray-200 py-4 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-y-3 gap-x-0"
        >
          {ITEMS.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="flex items-center gap-2">
                <item.Icon className="w-4 h-4 shrink-0 text-[#2563EB]" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-white/50 font-medium">
                  <strong className="font-bold lamidone-gradient-text">{item.bold}</strong>
                  {" "}{item.text}
                </span>
              </span>
              {i < ITEMS.length - 1 && (
                <span className="hidden sm:inline mx-5 text-gray-200 dark:text-white/15 select-none">|</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
