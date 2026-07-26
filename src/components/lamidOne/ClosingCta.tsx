"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ClosingCta() {
  return (
    <section className="relative lamidone-section py-24 px-4 overflow-hidden">
      {/* Glow orb */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[420px] h-[200px] rounded-full bg-[#2563EB]/6 blur-[80px]" />
      </div>

      {/* Soft diagonal lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {["M-60 300 C300 100 700 400 1100 150 C1300 80 1450 200 1500 180",
          "M-60 380 C200 180 650 460 1050 220 C1280 120 1420 260 1500 240"].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
            strokeOpacity="0.07" strokeDasharray="10 24"
            animate={{ strokeDashoffset: [0, -120], opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 4 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-6">
            LAMID ONE
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            See LAMID ONE in action.
          </h2>

          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base leading-relaxed mb-10">
            Let's build something great.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(37,99,235,0.8)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-sm overflow-hidden bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
                <span className="relative z-10">Book a Demo</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
              >
                Explore the Ecosystem
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
