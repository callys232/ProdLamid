"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import HowWeServeModal from "./navbar/HowWeServeModal";
import HeroStickmen from "./HeroStickmen";

// Duration for the typewriter to finish one pass of the longest phrase
const TYPE_DURATION_MS = 2200;

export default function Header() {
  const [howWeServeOpen, setHowWeServeOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [showAccent, setShowAccent] = useState(false);

  // Wait for H1 static text to fade in, then show the typewriter accent
  useEffect(() => {
    const t = setTimeout(() => setShowAccent(true), 700);
    return () => clearTimeout(t);
  }, []);

  // After each typewriter pass completes, restart the cycle
  useEffect(() => {
    if (!showAccent) return;
    const t = setTimeout(() => {
      setShowAccent(false);
      setTimeout(() => {
        setCycle((c) => c + 1);
        setShowAccent(true);
      }, 200);
    }, TYPE_DURATION_MS + 3500);
    return () => clearTimeout(t);
  }, [cycle, showAccent]);

  return (
    <>
      {/* ── Hero ── */}
      <header className="relative w-full aivora-section overflow-hidden min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">

        {/* Background stickmen */}
        <HeroStickmen />

        {/* Soft ambient glow behind the headline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[560px] h-[280px] rounded-full bg-[#C12129]/7 blur-[90px]" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-7 py-14 md:py-12">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#C12129]/28 bg-[#C12129]/8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C12129] animate-pulse shrink-0" />
              <span className="aivora-gradient-text">
                Human Insight. AI Precision. One Ecosystem.
              </span>
            </span>
          </motion.div>

          {/* Headline — static lines + typewriter accent */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.18] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="text-gray-900 dark:text-white">
              One System
              <br />
              One Intelligence.
              <br />
              One Experience.{" "}
            </span>

            {/* Typewriter accent */}
            <AnimatePresence mode="wait">
              {showAccent && (
                <motion.span
                  key={cycle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#C12129] to-red-900 dark:from-red-500 dark:to-white"
                >
                  <Typewriter
                    key={cycle}
                    words={[
                      "One Consulting Journey.",
                      "Needs to Grow.",
                      "Can Trust.",
                      "Deserves.",
                    ]}
                    loop={1}
                    typeSpeed={55}
                    deleteSpeed={0}
                    delaySpeed={99999}
                    cursor={false}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>

          {/* Thin accent divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.42, ease: "easeOut" }}
            className="w-20 h-px bg-gradient-to-r from-transparent via-[#C12129]/50 to-transparent origin-center"
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-gray-500 dark:text-white/70 text-sm sm:text-[0.95rem] max-w-[34rem] leading-[1.75]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            The trusted HumanAI consulting and growth platform — built on 30+
            years of leadership, designed for the complexity of now.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Primary */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 38px rgba(193,33,41,0.88)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setHowWeServeOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-white text-sm overflow-hidden cursor-pointer bg-[#C12129] hover:bg-[#a01a20] transition-colors duration-200 shadow-[0_0_24px_rgba(193,33,41,0.52)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">Get Started Free</span>
            </motion.button>

            {/* Secondary */}
            <motion.button
              whileHover={{ scale: 1.04, borderColor: "rgba(193,33,41,0.6)", color: "#C12129" }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold text-sm cursor-pointer border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/75 hover:border-[#C12129]/60 hover:text-[#C12129] transition-all duration-200"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-[#C12129]"
              >
                ⏵
              </motion.span>
              See How It Works
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

      <AnimatePresence>
        <HowWeServeModal
          open={howWeServeOpen}
          onClose={() => setHowWeServeOpen(false)}
        />
      </AnimatePresence>
    </>
  );
}
