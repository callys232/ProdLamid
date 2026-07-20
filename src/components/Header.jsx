"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroStickmen from "./HeroStickmen";

export default function Header() {
  return (
    <header
      className="relative w-full overflow-hidden min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      style={{
        backgroundColor: "var(--scroll-bg-to)",
        backgroundImage: [
          "linear-gradient(135deg, var(--scroll-bg-from) 0%, transparent 62%)",
          "radial-gradient(ellipse 52% 46% at 88% 8%, var(--scroll-bg-from) 0%, transparent 58%)",
          "radial-gradient(ellipse 45% 35% at 50% 105%, var(--scroll-bg-from) 0%, transparent 52%)",
        ].join(", "),
      }}
    >
      <HeroStickmen />

      {/* Accent glow ring — sits behind content */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[560px] h-[260px] rounded-full bg-[#2563EB]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-7 py-14 md:py-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
            <span className="aivora-gradient-text">
              Human Insight. AI Precision. One Ecosystem.
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.18] tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="text-gray-900 dark:text-white">The </span>
          <span className="aivora-gradient-text">HumanAI</span>
          <span className="text-gray-900 dark:text-white">
            {" "}
            Operating System
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            for Enterprise Growth.
          </span>
        </motion.h1>

        {/* Accent divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.42, ease: "easeOut" }}
          className="w-20 h-px bg-gradient-to-r from-transparent via-[#2563EB]/60 to-transparent origin-center"
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="text-gray-500 dark:text-white/70 text-sm sm:text-[0.95rem] max-w-[34rem] leading-[1.75]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Clarity for leaders. Confidence for teams. Growth for organizations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <motion.button
            type="button"
            aria-label="Explore the LAMID ONE ecosystem"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 38px rgba(37,99,235,0.88)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById("ecosystem")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-white text-sm overflow-hidden cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.52)]"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
            <span className="relative z-10">Explore the Ecosystem</span>
          </motion.button>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200"
            >
              Book a Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex flex-col items-center gap-2 mt-3"
        >
          <span className="text-[10px] tracking-[0.28em] uppercase text-gray-400 dark:text-white/22">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            className="text-gray-400 dark:text-white/28 text-sm"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </header>
  );
}
