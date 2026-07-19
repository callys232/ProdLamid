"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    pillar: "core",
    quote: "We had dashboards before. We didn't have clarity. LAMID ONE showed us — in one view — exactly where our strategy was drifting and what to do about it.",
    name: "Chief Strategy Officer",
    role: "Horizon Capital Group",
  },
  {
    pillar: "grow",
    quote: "The diagnostic took 20 minutes. The alignment it created across our leadership team would have taken us years to achieve before.",
    name: "Chief Executive Officer",
    role: "NovaTech Solutions",
  },
  {
    pillar: "talent",
    quote: "We used to debate which system to trust. Now we have one source of truth across strategy, people, and finance — and our leadership meetings have fundamentally changed.",
    name: "Chief People Officer",
    role: "Meridian Group",
  },
  {
    pillar: "finance",
    quote: "LAMID FINANCE didn't just give us visibility — it showed us where our capital was working and where it wasn't, in real time. That changes how you lead.",
    name: "Chief Financial Officer",
    role: "Atlas Logistics",
  },
];

export default function AivoraTestimonials({ pillar }: { pillar?: "core" | "grow" | "talent" }) {
  const ITEMS = pillar ? TESTIMONIALS.filter(t => t.pillar === pillar) : TESTIMONIALS;
  const [active, setActive] = useState(0);
  const [dir,    setDir]    = useState(1);
  const n = ITEMS.length;

  const next = useCallback(() => {
    setDir(1);
    setActive(p => (p + 1) % n);
  }, [n]);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, n]);

  const go = (i: number) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <section className="relative aivora-section py-32 px-4 overflow-hidden">

      {/* Subtle arc bg */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M-100 400 Q350 100 700 350 Q1050 600 1450 200",
          "M-100 250 Q400 500 750 200 Q1100 -100 1450 350",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
            strokeOpacity="0.07" strokeDasharray="14 28"
            animate={{ strokeDashoffset: [0, -150] }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 5 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-5">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            What Leaders Are Saying
          </h2>
        </motion.div>

        {/* Single wide card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              initial={{ opacity: 0, x: dir * 56 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -56 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="aivora-card border rounded-3xl px-14 py-16 text-center mx-auto max-w-3xl"
              style={{ borderColor: "rgba(37,99,235,0.15)" }}
            >
              {/* Large quote marks */}
              <span className="text-6xl font-serif text-gray-200 dark:text-white/10 leading-none select-none block mb-8">
                &ldquo;&ldquo;
              </span>

              {/* Quote */}
              <p className="text-base sm:text-xl text-gray-700 dark:text-white/80 leading-loose mb-12">
                {ITEMS[active].quote}
              </p>

              {/* Divider */}
              <div className="w-10 h-px bg-[#2563EB]/30 mx-auto mb-8" />

              {/* Attribution */}
              <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                {ITEMS[active].name}
              </p>
              <p className="text-sm aivora-gradient-text mt-2">
                {ITEMS[active].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot navigation */}
        {n > 1 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            {ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === active
                    ? "w-10 h-2 bg-[#2563EB]"
                    : "w-2 h-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
