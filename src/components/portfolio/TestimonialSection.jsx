"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "LAMID helped us transform our workforce, our culture, and our community impact — all through one ecosystem.",
    name: "Adaeze Okonkwo",
    role: "CEO, International Growth Company",
    initial: "A",
    tag: "Workforce Transformation",
    hex: "#2563EB",
  },
  {
    quote: "We went from fragmented tools and broken pipelines to one intelligent platform. LAMID didn't just fix our operations — it changed how our people think about work.",
    name: "Emeka Nwosu",
    role: "COO, BridgeTech Enterprises",
    initial: "E",
    tag: "Digital Transformation",
    hex: "#3b82f6",
  },
  {
    quote: "The marketplace matched us with exactly the right talent in days, not months. For a scaling business, that kind of precision is everything.",
    name: "Fatima Al-Hassan",
    role: "Head of People, Nexgen Capital",
    initial: "F",
    tag: "Talent Matching",
    hex: "#10b981",
  },
];

const ACCENT_WORDS = ["transform", "transformed", "community", "one", "impact", "intelligent", "platform", "ecosystem", "people", "precision", "talent", "operations", "work"];

function colorizeQuote(quote, hex) {
  return quote.split(" ").map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    return (
      <motion.span key={i}
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
        }}
        style={ACCENT_WORDS.includes(clean)
          ? { backgroundImage: `linear-gradient(to right, ${hex}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 600 }
          : {}}
        className={ACCENT_WORDS.includes(clean) ? "" : "text-gray-200"}
      >{word}</motion.span>
    );
  });
}

export default function TestimonialSection() {
  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);
  const [pressed, setPressed] = useState(null);
  const total = TESTIMONIALS.length;

  const go = useCallback((next) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }, [index]);

  const prev = () => go((index - 1 + total) % total);
  const next = () => go((index + 1) % total);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go((index + 1) % total), 5000);
    return () => clearInterval(id);
  }, [index, paused, total, go]);

  const t = TESTIMONIALS[index];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 320, damping: 30 } },
    exit:  (d) => ({ x: d > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.18 } }),
  };

  return (
    <section
      className="relative bg-[#080808] text-white py-16 px-4 sm:px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Vector bg */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#2563EB" strokeWidth="0.8" opacity="0.06" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#fff" strokeWidth="0.5" opacity="0.03" />
        <circle cx="0%"   cy="50%" r="220" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.08" />
        <circle cx="100%" cy="50%" r="220" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.08" />
        <circle cx="0%"   cy="50%" r="110" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.1"  />
        <circle cx="100%" cy="50%" r="110" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.1"  />
        <circle cx="15%"  cy="15%" r="3"   fill="#2563EB" opacity="0.22" />
        <circle cx="85%"  cy="85%" r="3"   fill="#2563EB" opacity="0.22" />
        <circle cx="78%"  cy="18%" r="2"   fill="#fff"    opacity="0.08" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-40 rounded-full bg-[#2563EB]/7 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-5">
          <motion.span animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Partner Testimonials</span>
          <span className="ml-auto text-[10px] text-gray-600 tabular-nums">{index + 1} / {total}</span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ boxShadow: `0 24px 60px ${t.hex}18`, borderColor: `${t.hex}40` }}
          transition={{ delay: 0.06, type: "spring", stiffness: 260, damping: 24 }}
          className="relative rounded-2xl p-6 sm:p-8 overflow-hidden group"
          style={{ border: `1px solid ${t.hex}22`, background: `linear-gradient(135deg, ${t.hex}08 0%, ${t.hex}03 100%)`, transition: "border-color 0.3s, box-shadow 0.3s" }}
        >
          {/* Corner glows */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"
            style={{ backgroundColor: `${t.hex}18` }} />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-80 opacity-40"
            style={{ backgroundColor: `${t.hex}12` }} />
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

          <div className="relative z-10">
            {/* Large quote mark */}
            <motion.span
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-7xl font-black leading-none select-none block mb-1 text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${t.hex}, ${t.hex}30)`, lineHeight: 0.75 }}
            >"</motion.span>

            {/* Animated quote */}
            <div className="min-h-[88px] sm:min-h-[76px] mb-6">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={index} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                  <motion.p initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
                    className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed tracking-wide flex flex-wrap gap-x-2 gap-y-0.5"
                  >
                    {colorizeQuote(t.quote, t.hex)}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated divider */}
            <motion.div
              animate={{ width: paused ? "64px" : "32px" }}
              transition={{ duration: 0.4 }}
              className="h-px bg-gradient-to-r from-[#2563EB] to-transparent mb-5"
            />

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">

              {/* Avatar + attribution */}
              <AnimatePresence mode="wait">
                <motion.div key={`attr-${index}`}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-3 group/attr cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${t.hex}, ${t.hex}80)`, border: `1px solid ${t.hex}60`, boxShadow: `0 0 12px ${t.hex}30` }}
                  >
                    {t.initial}
                  </motion.div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight group-hover/attr:text-rose-300 transition-colors duration-200">{t.name}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Tag badge */}
              <AnimatePresence mode="wait">
                <motion.div key={`tag-${index}`}
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                  whileHover={{ scale: 1.05, borderColor: `${t.hex}50` }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-white/[0.03] cursor-default transition-colors duration-200"
                  style={{ borderColor: `${t.hex}25` }}
                >
                  <motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
                    className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.hex }} />
                  <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">{t.tag}</span>
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="ml-auto flex items-center gap-2">
                {/* Dot indicators */}
                <div className="flex items-center gap-1.5 mr-1">
                  {TESTIMONIALS.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => go(i)}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.85 }}
                      animate={{ width: i === index ? 18 : 6, backgroundColor: i === index ? t.hex : "rgba(255,255,255,0.2)" }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="h-1.5 rounded-full cursor-pointer"
                      style={{ minWidth: "6px" }}
                    />
                  ))}
                </div>

                {/* Prev */}
                <motion.button
                  onMouseDown={() => setPressed("prev")}
                  onMouseUp={() => setPressed(null)}
                  onMouseLeave={() => setPressed(null)}
                  whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.88 }}
                  animate={{ x: pressed === "prev" ? -2 : 0 }}
                  onClick={prev}
                  className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </motion.button>

                {/* Next */}
                <motion.button
                  onMouseDown={() => setPressed("next")}
                  onMouseUp={() => setPressed(null)}
                  onMouseLeave={() => setPressed(null)}
                  whileHover={{ scale: 1.12, backgroundColor: `${t.hex}20`, borderColor: `${t.hex}50` }}
                  whileTap={{ scale: 0.88 }}
                  animate={{ x: pressed === "next" ? 2 : 0 }}
                  onClick={next}
                  className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mt-4 h-px w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: paused ? undefined : "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full rounded-full"
            style={{ backgroundColor: t.hex }}
          />
        </div>

      </div>
    </section>
  );
}
