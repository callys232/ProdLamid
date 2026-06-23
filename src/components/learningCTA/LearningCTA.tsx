"use client";

import { motion } from "framer-motion";
import LearningCanvas from "./LearningCanvas";

const LEARNING_URL = "https://learn-by-lamid.vercel.app/";

export interface LearningCTAProps {
  /** Small eyebrow label above the headline */
  eyebrow?: string;
  /** Primary headline — plain text part */
  headline?: string;
  /** Amber-highlighted continuation of the headline */
  highlight?: string;
  /** Supporting body copy */
  body?: string;
  /** CTA button label */
  btnLabel?: string;
  /** Extra class(es) on the outer element, e.g. "mb-8" */
  className?: string;
}

export default function LearningCTA({
  eyebrow = "🎓 Lamid Learning Platform",
  headline = "Build smarter teams.",
  highlight = "Grow stronger Organization.",
  body = "Practical Talent Development courses in Leadership, Sales, Strategy & more — designed to sharpen the people who drive your business forward.",
  btnLabel = "Start Learning Free",
  className = "",
}: LearningCTAProps) {
  return (
    <motion.a
      href={LEARNING_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      whileHover="hover"
      className={`group relative flex flex-col sm:flex-row items-center justify-between
                  gap-5 rounded-2xl px-7 py-6 overflow-hidden cursor-pointer
                  min-h-[110px] ${className}`}
      style={{
        background: [
          "radial-gradient(ellipse at 14% 55%, rgba(234,88,12,0.58) 0%, transparent 52%)",
          "radial-gradient(ellipse at 88% 40%, rgba(109,40,217,0.22) 0%, transparent 52%)",
          "rgb(5, 2, 1)",
        ].join(", "),
        border: "1px solid rgba(249,115,22,0.48)",
        boxShadow: [
          "0 0 56px rgba(234,88,12,0.14)",
          "0 0 56px rgba(109,40,217,0.07)",
          "inset 0 1px 0 rgba(255,255,255,0.05)",
        ].join(", "),
      }}
    >
      {/* ── Animated canvas fills the background ── */}
      <LearningCanvas />

      {/* ── Shine sweep on hover ── */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                   transition-transform duration-700 ease-in-out
                   bg-gradient-to-r from-transparent via-white/8 to-transparent
                   skew-x-12 pointer-events-none z-10"
      />

      {/* ── Left orange glow burst ── */}
      <div
        aria-hidden="true"
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full
                   bg-orange-500/20 blur-3xl pointer-events-none z-0"
      />

      {/* ── Right violet glow burst ── */}
      <div
        aria-hidden="true"
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full
                   bg-violet-600/12 blur-3xl pointer-events-none z-0"
      />

      {/* ── Copy ── */}
      <div className="relative z-20 text-center sm:text-left max-w-md">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-300/90 mb-1.5">
          {eyebrow}
        </p>
        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
          {headline}{" "}<span className="text-amber-400 whitespace-nowrap">{highlight}</span>
        </h3>
        <p className="mt-1.5 text-xs text-orange-200/65 leading-relaxed">
          {body}
        </p>
      </div>

      {/* ── CTA button ── */}
      <div className="relative z-20 flex-shrink-0">
        <motion.span
          variants={{
            hover: { scale: 1.06, boxShadow: "0 0 38px rgba(249,115,22,0.8)" },
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                     text-sm font-extrabold text-white whitespace-nowrap
                     bg-gradient-to-r from-amber-500 via-orange-500 to-orange-700
                     shadow-[0_6px_28px_rgba(249,115,22,0.42)]
                     transition-shadow duration-300"
        >
          {btnLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.span>

        {/* Pill badge below button */}
        <p className="mt-2 text-center text-[9px] text-orange-300/50 tracking-wide">
          Free to start · No credit card needed
        </p>
      </div>
    </motion.a>
  );
}
