"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CARDS = [
  {
    id: "vision",
    label: "VISION",
    labelCls: "bg-green-600 hover:bg-green-500",
    borderCls: "hover:border-green-500",
    dropdownBorderCls: "border-green-600/25",
    learnMoreCls: "text-green-500 hover:text-green-400",
    preview:
      "To build the world's most trusted digital ecosystem for enterprise performance, talent acceleration, and work that runs cleanly.",
    full: "To build the world's most trusted digital ecosystem for enterprise performance, talent acceleration, and work that runs cleanly. We exist to close the gap between ambition and execution — giving every business, professional, and community the infrastructure to grow with confidence, clarity, and purpose.",
    href: "/portfolio",
  },
  {
    id: "mission",
    label: "MISSION",
    labelCls: "bg-blue-600 hover:bg-blue-500",
    borderCls: "hover:border-blue-500",
    dropdownBorderCls: "border-blue-600/25",
    learnMoreCls: "text-blue-400 hover:text-blue-300",
    preview:
      "Give businesses and experts the systems, tools, and intelligence they need to grow sustainably and transform meaningfully.",
    full: "Give businesses and experts the systems, tools, and intelligence they need to grow sustainably and transform meaningfully. Through AI-enabled technology, marketplace infrastructure, and enterprise-grade consulting, we put expert capability within reach in every market we serve.",
    href: "/portfolio",
  },
  {
    id: "approach",
    label: "OUR APPROACH",
    labelCls: "bg-orange-500 hover:bg-orange-400",
    borderCls: "hover:border-orange-500",
    dropdownBorderCls: "border-orange-500/25",
    learnMoreCls: "text-orange-400 hover:text-orange-300",
    preview:
      "A great company is measured by its profitable operations and strong leadership. Strategic planning is the foundation of all successful endeavors.",
    full: "A great company is measured by its profitable operations and strong leadership. Strategic planning is the foundation of all successful endeavors. We operate with precision — diagnosing first, then deploying the right systems, talent, and tools to ensure every engagement delivers measurable, lasting impact.",
    href: "/portfolio",
  },
];

export default function VMO() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        {/* items-start lets each column size independently */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {CARDS.map((card) => {
            const isOpen = expanded === card.id;

            return (
              <div key={card.id} className="flex flex-col">
                {/* ── Fixed-height card shell ── */}
                <div
                  className={`flex flex-col min-h-[200px] bg-black border border-gray-800 rounded-lg p-8 transition-all duration-300 ${card.borderCls} hover:shadow-lg`}
                >
                  {/* Label */}
                  <div className="text-center mb-5">
                    <div
                      className={`${card.labelCls} text-white font-bold py-2 px-4 rounded-md inline-block transition duration-300`}
                    >
                      {card.label}
                    </div>
                  </div>

                  {/* Preview text — fixed, never changes */}
                  <p className="text-[15px] leading-relaxed text-white/80 flex-1">
                    {card.preview}
                  </p>

                  {/* Arrow + Read more / Show less */}
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : card.id)}
                    className="flex items-center gap-2 mt-5 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors w-fit"
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="text-base leading-none"
                    >
                      ▶
                    </motion.span>
                    {isOpen ? "Show less" : "Read more"}
                  </button>
                </div>

                {/* ── Dropdown panel — outside fixed shell so it doesn't push siblings ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`mt-1 rounded-lg border px-8 py-5 bg-white/[0.03] text-[15px] leading-relaxed text-white/70 ${card.dropdownBorderCls}`}
                      >
                        {card.full}
                        <div className="mt-4">
                          <Link
                            href={card.href}
                            className={`text-xs font-semibold uppercase tracking-wider hover:underline underline-offset-2 transition-colors ${card.learnMoreCls}`}
                          >
                            Learn more →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
