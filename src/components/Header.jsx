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
  const [cycle,          setCycle]          = useState(0);
  const [showAccent,     setShowAccent]     = useState(false);

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
      setTimeout(() => { setCycle(c => c + 1); setShowAccent(true); }, 200);
    }, TYPE_DURATION_MS + 3500); // type + display pause
    return () => clearTimeout(t);
  }, [cycle, showAccent]);

  return (
    <>
      {/* ── Hero ── */}
      <header className="relative w-full aivora-section overflow-hidden min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">

        {/* Stickman background */}
        <HeroStickmen />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4 py-10 md:py-8">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-[#C12129]/25 bg-[#C12129]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C12129] animate-pulse" />
              <span className="aivora-gradient-text">Human Insight. AI Precision. One Ecosystem.</span>
            </span>
          </motion.div>

          {/* Headline — static first line + typewriter accent */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="text-gray-900 dark:text-white">The Intelligence Your<br />Organization </span>
            {/* Typewriter accent — fades in after static line, cycles through phrases */}
            <AnimatePresence mode="wait">
              {showAccent && (
                <motion.span
                  key={cycle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#C12129] to-red-900 dark:from-red-500 dark:to-white"
                >
                  <Typewriter
                    key={cycle}
                    words={[
                      "Has Been Waiting For.",
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

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            LAMID ONE is the unified HumanAI consulting ecosystem that helps organizations
            diagnose, transform, and grow with clarity, intelligence, and trust.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Primary */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(193,33,41,0.85)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setHowWeServeOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden cursor-pointer
                bg-[#C12129] hover:bg-[#a01a20] transition-colors duration-200
                shadow-[0_0_22px_rgba(193,33,41,0.5)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">Get Started Free</span>
            </motion.button>

            {/* Secondary */}
            <motion.button
              whileHover={{ scale: 1.04, borderColor: "rgba(193,33,41,0.6)", color: "#C12129" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer
                border border-white/20 dark:border-white/20 border-gray-300
                text-gray-700 dark:text-white/80
                hover:border-[#C12129]/60 hover:text-[#C12129]
                transition-all duration-200"
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
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col items-center gap-1 mt-2"
          >
            <span className="text-[10px] tracking-widest uppercase text-gray-400 dark:text-white/25">Scroll to explore</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-gray-400 dark:text-white/30 text-sm"
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
