"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { AnimatePresence, motion } from "framer-motion";
import Serv from "./Serv";
import AISystemSection from "./aiHero/Aihero";
import HowWeServeModal from "./navbar/HowWeServeModal";

// Deterministic positions — avoids SSR/client hydration mismatch
const PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const a = (i * 7 + 3) % 97;
  return {
    id: i,
    cx: ((a * 13 + i * 31) % 100).toFixed(1),
    cy: ((a * 17 + i * 23) % 100).toFixed(1),
    r: ((a % 12) / 10 + 0.6).toFixed(1),
    opacity: ((a % 4) / 10 + 0.18).toFixed(2),
    anim: ["fp-a", "fp-b", "fp-c", "fp-d"][i % 4],
    dur: ((a % 8) + 7).toFixed(1),
    del: ((i % 8) * 0.65).toFixed(1),
  };
});

// "Empowering Growth," = 18 chars × 60 ms/char + 200 ms buffer
const H1_TYPE_MS = 18 * 60 + 200;

export default function Header() {
  const [showH2, setShowH2] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [howWeServeOpen, setHowWeServeOpen] = useState(false);

  // When a new cycle starts, wait for h1 to finish typing then show h2
  useEffect(() => {
    const t = setTimeout(() => setShowH2(true), H1_TYPE_MS);
    return () => clearTimeout(t);
  }, [cycle]);

  // Once h2 is visible, wait 5 s then restart the loop
  useEffect(() => {
    if (!showH2) return;
    const t = setTimeout(() => {
      setShowH2(false);
      setCycle((c) => c + 1);
    }, 5000);
    return () => clearTimeout(t);
  }, [showH2]);

  return (
    <>
      <header className="relative w-full bg-black text-white overflow-hidden px-6 md:px-12 flex flex-col md:flex-row items-center justify-between min-h-[85vh] md:min-h-0">
        {/* ── Particle keyframes injected once, zero bundle weight ── */}
        <style>{`
          @keyframes fp-a{0%,100%{transform:translate(0,0)}50%{transform:translate(2px,-6px)}}
          @keyframes fp-b{0%,100%{transform:translate(0,0)}50%{transform:translate(-3px,-4px)}}
          @keyframes fp-c{0%,100%{transform:translate(0,0)}50%{transform:translate(1px,-7px)}}
          @keyframes fp-d{0%,100%{transform:translate(0,0)}50%{transform:translate(-2px,-5px)}}
          @keyframes dg-glow{0%,100%{filter:drop-shadow(0 0 8px rgba(220,38,38,0.55))}50%{filter:drop-shadow(0 0 22px rgba(251,113,133,0.9))}}
        `}</style>

        {/* Red dotted SVG particle layer */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {PARTICLES.map((p) => (
            <circle
              key={p.id}
              cx={`${p.cx}%`}
              cy={`${p.cy}%`}
              r={p.r}
              fill="#C12129"
              fillOpacity={p.opacity}
              style={{
                animation: `${p.anim} ${p.dur}s ${p.del}s ease-in-out infinite`,
              }}
            />
          ))}
        </svg>

        {/* ── Left content ── */}
        <div className="w-full md:w-2/3 z-10 pt-24 md:pt-0 text-center md:text-left space-y-4 md:space-y-5">
          {/* Typewriter headline — remounts on each cycle via key */}
          <h1 className="whitespace-normal text-lg sm:text-xl md:text-3xl font-extrabold leading-snug max-w-2xl mx-auto md:mx-0 px-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white pb-1">
            <Typewriter
              key={cycle}
              words={["Empowering Growth,"]}
              loop={1}
              typeSpeed={60}
              deleteSpeed={30}
              delaySpeed={500}
              cursor
              cursorStyle=""
            />
          </h1>

          {/* h2 slides in from the left once h1 is done */}
          <div className="min-h-[1.5em]">
            <AnimatePresence>
              {showH2 && (
                <motion.h2
                  initial={{ opacity: 0, x: -32, scale: 0.88, skewX: -4 }}
                  animate={{ opacity: 1, x: 0, scale: 1, skewX: 0 }}
                  exit={{ opacity: 0, x: -16, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 90, damping: 11 }}
                  className="whitespace-normal text-xl sm:text-2xl md:text-4xl font-extrabold leading-snug max-w-2xl mx-auto md:mx-0 px-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-red-500 to-red-900 tracking-wide pb-1"
                  style={{ animation: "dg-glow 2.6s ease-in-out infinite" }}
                >
                  Digitally.
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          {/* Paragraph */}
          <p className="mt-6 md:mt-10 text-slate-300 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-lg mx-auto md:mx-0 px-2 leading-7 md:leading-8">
            LAMID unifies strategy, performance, systems, and seamless work into
            one AIenabled, marketplacedriven, enterprisegrade ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start px-2 mt-6 md:mt-10 pb-10 md:pb-0">
            {/* Primary — filled gradient + glow */}
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
              <span className="relative z-10">Get Started</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* Secondary — gradient border, fills on hover, smooth scrolls to services */}
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
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
              {/* Fill overlay on hover */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-800 via-red-600 to-rose-500 pointer-events-none" />
              <span className="relative z-10">Explore Services</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* ── Right — Serv cards (desktop only) ── */}
        <div className="hidden md:flex md:w-1/3 justify-end items-center z-10">
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
