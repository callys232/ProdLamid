"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import EcosystemTree from "./EcosystemTree";

const ROTATING_WORDS = ["HumanAI", "CORE", "GROW", "TALENT", "FINANCE"];

const SPARKS = [
  { x: -30, y: -16, delay: 0.05 },
  { x: 32, y: -12, delay: 0.1 },
  { x: -22, y: 22, delay: 0.08 },
  { x: 26, y: 18, delay: 0.14 },
  { x: 4, y: -28, delay: 0.12 },
  { x: -12, y: 30, delay: 0.06 },
];

const GLOWS = [
  {
    x: -52,
    y: -40,
    w: 82,
    h: 16,
    rx: "80% 20% 80% 20% / 50% 50% 50% 50%",
    fall: 70,
    delay: 0.0,
    dur: 3.2,
    alpha: 0.7,
  },
  {
    x: 12,
    y: -52,
    w: 38,
    h: 30,
    rx: "30% 70% 40% 60% / 60% 40% 70% 30%",
    fall: 80,
    delay: 0.15,
    dur: 3.6,
    alpha: 0.65,
  },
  {
    x: 62,
    y: -34,
    w: 56,
    h: 24,
    rx: "50% 80% 20% 80% / 30% 60% 40% 70%",
    fall: 72,
    delay: 0.09,
    dur: 3.0,
    alpha: 0.68,
  },
  {
    x: -94,
    y: -2,
    w: 22,
    h: 64,
    rx: "40% 60% 60% 40% / 80% 20% 80% 20%",
    fall: 65,
    delay: 0.12,
    dur: 3.4,
    alpha: 0.55,
  },
  {
    x: 92,
    y: 12,
    w: 30,
    h: 54,
    rx: "60% 40% 20% 80% / 20% 80% 60% 40%",
    fall: 68,
    delay: 0.07,
    dur: 3.2,
    alpha: 0.58,
  },
  {
    x: -44,
    y: 38,
    w: 66,
    h: 20,
    rx: "20% 80% 20% 80% / 60% 40% 60% 40%",
    fall: 60,
    delay: 0.17,
    dur: 2.8,
    alpha: 0.55,
  },
  {
    x: 30,
    y: 50,
    w: 50,
    h: 28,
    rx: "70% 30% 50% 50% / 30% 70% 50% 50%",
    fall: 75,
    delay: 0.11,
    dur: 3.8,
    alpha: 0.6,
  },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="inline-block relative"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROTATING_WORDS[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block"
        >
          {/* Distributed glow blooms */}
          {GLOWS.map((g, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `calc(50% + ${g.x}px)`,
                top: `calc(50% + ${g.y}px)`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <motion.span
                style={{
                  display: "block",
                  width: g.w,
                  height: g.h,
                  borderRadius: g.rx,
                  background: `radial-gradient(ellipse at 40% 40%, rgba(147,197,253,${g.alpha}) 0%, rgba(37,99,235,${g.alpha * 0.7}) 45%, rgba(37,99,235,0) 100%)`,
                  filter: "blur(20px)",
                  boxShadow: `0 0 18px 4px rgba(37,99,235,${g.alpha * 0.35})`,
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [0, g.fall * 0.04, g.fall * 0.45, g.fall],
                }}
                transition={{
                  duration: g.dur,
                  delay: g.delay,
                  times: [0, 0.12, 0.55, 1],
                  ease: "easeIn",
                }}
              />
            </span>
          ))}

          {/* Spark particles */}
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: s.x,
                y: s.y,
                scale: [0, 1.1, 0],
              }}
              transition={{ duration: 0.8, delay: s.delay, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB] pointer-events-none"
            />
          ))}

          <span className="aivora-gradient-text">{ROTATING_WORDS[index]}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Header() {
  return (
    <header
      className="relative w-full overflow-hidden min-h-[80vh] flex flex-col items-center justify-center px-4 text-center"
      style={{
        backgroundColor: "var(--scroll-bg-to)",
        backgroundImage: [
          "linear-gradient(135deg, var(--scroll-bg-from) 0%, transparent 62%)",
          "radial-gradient(ellipse 52% 46% at 88% 8%, var(--scroll-bg-from) 0%, transparent 58%)",
          "radial-gradient(ellipse 45% 35% at 50% 105%, var(--scroll-bg-from) 0%, transparent 52%)",
        ].join(", "),
      }}
    >
      {/* Looping ecosystem tree background */}
      <EcosystemTree className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />

      {/* Accent glow ring */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[560px] h-[260px] rounded-full bg-[#2563EB]/10 blur-[80px]" />
      </div>

      {/* Foreground content */}
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
              LAMID ONE - Human-AI consulting operating system
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.18] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            wordSpacing: "0.06em",
          }}
        >
          <span className="text-gray-900 dark:text-white">The </span>
          <RotatingWord />
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
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pricing"
              aria-label="Get started with LAMID ONE for $50 per month"
              className="group relative inline-flex items-center justify-center gap-0 px-8 py-4 rounded-full font-semibold text-white text-sm overflow-hidden cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_24px_rgba(37,99,235,0.52)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10 whitespace-nowrap">
                Get started with LAMID ONE
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/15 text-white font-bold text-[11px] tracking-wide">
                  $50/month
                </span>
              </span>
            </Link>
          </motion.div>

          <motion.button
            type="button"
            aria-label="Explore the LAMID ONE system"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById("ecosystem")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-sm border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all duration-200 cursor-pointer"
          >
            Explore the LAMID ONE System
          </motion.button>
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
