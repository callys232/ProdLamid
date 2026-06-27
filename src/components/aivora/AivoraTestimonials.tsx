"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { quote: "AIVORA connected us with the right consultant in 48 hours. The project that followed delivered in half the time we expected — and the BIZ Portal has become essential to how we make decisions now.", name: "Chief Operating Officer", org: "Financial Services Firm, UAE",    initial: "C", accentCls: "bg-[#C12129]" },
  { quote: "We've tried fragmented tools and individual consultants. AIVORA is the first platform that actually felt like a partner — not a vendor.",                                                              name: "Chief Executive Officer",   org: "Technology Scale-up, Nigeria",   initial: "C", accentCls: "bg-blue-600"   },
  { quote: "The Talent Portal transformed how we approach capability building. Our teams are developing skills 3× faster, and they're actually engaged.",                                                         name: "Chief People Officer",      org: "Healthcare Organization, UK",    initial: "C", accentCls: "bg-orange-500" },
];

const paths = [
  { d: "M-100 400 Q350 100 700 350 Q1050 600 1450 200", delay: 0,  dur: 22 },
  { d: "M-100 250 Q400 500 750 200 Q1100 -100 1450 350", delay: 5, dur: 26 },
];
const bgDots = [
  { cx: "10%", cy: 60, r: 1.5, delay: 0,   dur: 10, floatPct: 5 },
  { cx: "90%", cy: 40, r: 1,   delay: 2.5, dur: 8,  floatPct: 4 },
  { cx: "45%", cy: 80, r: 1.5, delay: 1,   dur: 12, floatPct: 5 },
  { cx: "70%", cy: 15, r: 1,   delay: 4,   dur: 9,  floatPct: 4 },
];

// Stack positions: 0 = front, 1 = middle, 2 = back
const STACK = [
  { rotate: 0,   scale: 1,    y: 0,  opacity: 1,    zIndex: 30 },
  { rotate: 5,   scale: 0.97, y: 14, opacity: 0.82, zIndex: 20 },
  { rotate: -3,  scale: 0.94, y: 26, opacity: 0.65, zIndex: 10 },
];

type Phase = "idle" | "dropping" | "resetting";

export default function AivoraTestimonials() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [phase, setPhase]               = useState<Phase>("idle");
  const [droppingCard, setDroppingCard] = useState<number | null>(null);
  const n = TESTIMONIALS.length;

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (phase === "idle") handleNext();
    }, 4000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeIndex]);

  const handleNext = useCallback(() => {
    if (phase !== "idle") return;
    const current = activeIndex;
    setDroppingCard(current);
    setPhase("dropping");
    setActiveIndex((prev) => (prev + 1) % n);

    setTimeout(() => {
      // Snap the dropped card back to the back-of-stack position while invisible
      setPhase("resetting");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("idle");
          setDroppingCard(null);
        });
      });
    }, 520);
  }, [activeIndex, phase, n]);

  // Animated properties per card (zIndex is included so framer-motion owns it — no inline style needed)
  const getAnimate = (i: number) => {
    const offset = (i - activeIndex + n) % n;
    if (droppingCard === i && phase === "dropping") {
      return { rotate: 16, scale: 0.86, y: 600, opacity: 0, zIndex: 40 };
    }
    if (droppingCard === i && phase === "resetting") {
      return { rotate: STACK[offset].rotate, scale: STACK[offset].scale, y: STACK[offset].y, opacity: 0, zIndex: STACK[offset].zIndex };
    }
    return { rotate: STACK[offset].rotate, scale: STACK[offset].scale, y: STACK[offset].y, opacity: STACK[offset].opacity, zIndex: STACK[offset].zIndex };
  };

  const getTransition = (i: number) => {
    if (droppingCard === i && phase === "dropping") {
      return { duration: 0.45, ease: [0.55, 0, 1, 0.5] as const };
    }
    if (droppingCard === i && phase === "resetting") {
      return { duration: 0 };
    }
    return { duration: 0.55, ease: [0.32, 0.72, 0, 1] as const };
  };


  return (
    <section className="relative aivora-section py-24 px-4 overflow-hidden" id="testimonials">

      {/* Arc bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {paths.map((v, i) => (
          <motion.path
            key={i} d={v.d} fill="none" stroke="#C12129" strokeWidth="0.6"
            strokeOpacity="0.09" strokeDasharray="14 28"
            animate={{ strokeDashoffset: [0, -150], opacity: [0.05, 0.16, 0.05] }}
            transition={{
              strokeDashoffset: { duration: v.dur, repeat: Infinity, ease: "linear", delay: v.delay },
              opacity: { duration: v.dur * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: v.delay },
            }}
          />
        ))}
        {bgDots.map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} r={dot.r} fill="#C12129"
            animate={{ cy: [`${dot.cy}%`, `${dot.cy - dot.floatPct}%`, `${dot.cy}%`], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            <span className="aivora-gradient-text">What Leaders Say</span>
          </h2>
        </motion.div>

        {/* Card stack */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm mx-auto h-[350px]">
            {TESTIMONIALS.map((t, i) => {
              const offset  = (i - activeIndex + n) % n;
              const isFront = offset === 0;
              const stackPos = STACK[offset];

              return (
                <motion.div
                  key={i}
                  className={`absolute top-0 inset-x-0 h-[300px] border rounded-2xl p-7 flex flex-col overflow-hidden cursor-default transition-shadow duration-300 ${isFront ? "bg-gray-50 dark:bg-[#161616] border-[#C12129]/30 shadow-[0_8px_32px_rgba(193,33,41,0.1)]" : "aivora-card border-gray-200 dark:border-white/[0.06]"}`}
                  initial={{ rotate: stackPos.rotate, scale: stackPos.scale, y: stackPos.y, opacity: stackPos.opacity, zIndex: stackPos.zIndex }}
                  animate={getAnimate(i)}
                  transition={getTransition(i)}
                >
                  {/* Top glow — front card only */}
                  {isFront && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-16 rounded-full blur-2xl bg-[#C12129] opacity-[0.09] pointer-events-none" />
                  )}

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <motion.span
                        key={s}
                        className="aivora-gradient-text text-sm"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + s * 0.07, duration: 0.25, type: "spring" }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  {/* Opening quote */}
                  <span className="text-5xl font-serif text-[#C12129]/20 leading-none -mb-2 select-none">
                    "
                  </span>

                  <p className="text-gray-700 dark:text-white/70 text-sm leading-relaxed flex-1 mb-6 italic">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.accentCls} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-gray-500 dark:text-white/40 text-xs">{t.org}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dot indicators + Next button */}
          <div className="flex items-center gap-5 mt-10">
            <div className="flex gap-1.5 items-center">
              {TESTIMONIALS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-5 h-[6px] bg-[#C12129]"
                      : "w-[6px] h-[6px] bg-gray-300 dark:bg-white/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={phase !== "idle"}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C12129]/10 border border-[#C12129]/30 hover:bg-[#C12129]/20 hover:border-[#C12129]/60 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-gray-300 dark:text-white/20 text-xs mt-8 tracking-wide"
        >
          Testimonials will be replaced with verified client quotes before launch.
        </motion.p>
      </div>
    </section>
  );
}
