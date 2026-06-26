"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Serv from "./Serv";
import AISystemSection from "./aiHero/Aihero";
import HowWeServeModal from "./navbar/HowWeServeModal";
import EcosystemTag from "./EcosystemTag";
import HeroStickmen from "./HeroStickmen";

export default function Header() {
  const [howWeServeOpen, setHowWeServeOpen] = useState(false);

  return (
    <>
      <header className="relative w-full aivora-section overflow-hidden px-6 md:px-12 flex flex-col md:flex-row items-center justify-between min-h-[85vh] md:min-h-0">

        {/* Interactive service stickmen */}
        <HeroStickmen />

        {/* ── Left content ── */}
        <div className="w-full md:w-2/3 z-10 pt-24 md:pt-0 text-center md:text-left space-y-4 md:space-y-5">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold"
          >
            The HumanAI Consulting Ecosystem
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto md:mx-0 px-2 font-display pb-1"
          >
            <span className="text-gray-900 dark:text-white">The Intelligence Your Organization </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C12129] to-red-900 dark:from-red-600 dark:to-white">
              Has Been Waiting For.
            </span>
          </motion.h1>

          {/* Sub-paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-6 md:mt-10 text-gray-600 dark:text-slate-300 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-lg md:max-w-3xl mx-auto md:mx-0 px-2 leading-7 md:leading-8"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            AIVORA blends trusted expertise with advanced AI to deliver smarter, faster, accessible solutions for organizations seeking clarity and growth.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start px-2 mt-6 md:mt-10 pb-10 md:pb-0"
          >
            {/* Primary — Get Started Free */}
            <button
              onClick={() => setHowWeServeOpen(true)}
              className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-black text-sm overflow-hidden
                transition-all duration-300 ease-out cursor-pointer
                bg-gradient-to-br from-zinc-100 via-rose-400 to-[#C12129]
                shadow-[0_0_18px_rgba(193,33,41,0.55)]
                hover:shadow-[0_0_32px_rgba(193,33,41,0.9)]
                hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">Get Started Free</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            {/* Secondary — See How It Works */}
            <button
              onClick={() =>
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
                transition-all duration-300 ease-out cursor-pointer
                text-red-400 hover:text-white
                shadow-[0_0_12px_rgba(193,33,41,0.25)]
                hover:shadow-[0_0_26px_rgba(193,33,41,0.65)]
                hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(#000,#000) padding-box, linear-gradient(135deg,#C12129,#ff6b6b) border-box",
                border: "2px solid transparent",
              }}
            >
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-800 via-red-600 to-rose-500 pointer-events-none" />
              <span className="relative z-10">See How It Works</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </button>
          </motion.div>

          <EcosystemTag className="md:justify-start" />
        </div>

        {/* ── Right — Serv cards ── */}
        <div className="flex w-full md:w-1/3 justify-center md:justify-end items-center z-10 pb-10 md:pb-0">
          <Serv />
        </div>
      </header>

      <AISystemSection />

      <AnimatePresence>
        <HowWeServeModal
          open={howWeServeOpen}
          onClose={() => setHowWeServeOpen(false)}
        />
      </AnimatePresence>
    </>
  );
}
