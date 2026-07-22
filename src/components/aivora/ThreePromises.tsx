"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const BENEFITS = [
  "Make better decisions",
  "Strengthen your teams",
  "Improve digital performance",
  "Understand your numbers",
  "Grow with confidence",
];

const ENGINES = [
  {
    id: "Lamid Core",
    tagline: "Your consulting operating system",
    desc: "Clear plans, better decisions, and smoother execution — strategy made operational.",
    textCls: "text-[#2563EB]",
    bgCls:   "bg-[#2563EB]",
    href: "/core",
  },
  {
    id: "Lamid Grow",
    tagline: "Your customer & digital performance engine",
    desc: "Modern insights on customer engagement and digital growth, updated in real time.",
    textCls: "text-[#3B82F6]",
    bgCls:   "bg-[#3B82F6]",
    href: "/grow",
  },
  {
    id: "Lamid Talent",
    tagline: "Your people intelligence engine",
    desc: "Better teams, stronger culture, higher performance — powered by data and human expertise.",
    textCls: "text-[#2563EB]",
    bgCls:   "bg-[#2563EB]",
    href: "/talent",
  },
  {
    id: "Lamid Finance",
    tagline: "Your financial intelligence engine",
    desc: "Real-time visibility, cost clarity, and forecasting — know exactly where your business stands.",
    textCls: "text-[#F59E0B]",
    bgCls:   "bg-[#F59E0B]",
    href: "/finance",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Timeline stagger — each row loads sequentially
const timelineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.30, delayChildren: 0.28 } },
};

// Row is a pass-through; children carry their own springs
const rowV = {
  hidden: { opacity: 1 },
  show:   { opacity: 1 },
};

// Number badge pops in with spring
const badgeV = {
  hidden: { scale: 0, opacity: 0 },
  show:   { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 380, damping: 22 } },
};

// Text slides in 0.14 s after the badge lands
const textV = {
  hidden: { opacity: 0, x: 10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const, delay: 0.14 } },
};

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42 } },
};

export default function ThreePromises() {
  return (
    <section className="aivora-section py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── WHY LAMID ONE — glass panel ── */}
        <div className="relative mb-12 rounded-2xl overflow-hidden
          border border-gray-200/60 dark:border-white/[0.07]
          bg-white/75 dark:bg-slate-900/55
          backdrop-blur-md
          shadow-lg shadow-black/[0.05] dark:shadow-black/30">

          {/* Inner blue gradient bloom */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.05] via-transparent to-transparent pointer-events-none"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center p-8 lg:p-10">

          {/* Left — Statement */}
          <div>
            <motion.p {...fadeUp(0)}
              className="text-[10px] tracking-[0.42em] uppercase font-bold aivora-gradient-text mb-4"
            >
              Why LAMID ONE
            </motion.p>

            <motion.h2 {...fadeUp(0.06)}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3"
            >
              Organizations today need more than tools.
            </motion.h2>

            <motion.p {...fadeUp(0.10)}
              className="text-gray-500 dark:text-white/55 text-sm leading-relaxed mb-4"
            >
              They need clarity, intelligence, and a system that brings everything together.
              LAMID ONE blends human expertise with AI precision to deliver outcomes — not just reports.
            </motion.p>

            <motion.p {...fadeUp(0.14)}
              className="text-[11px] font-semibold aivora-gradient-text tracking-wide"
            >
              One ecosystem. Four engines. Endless possibilities.
            </motion.p>
          </div>

          {/* Right — Vertical timeline */}
          <div>
            <div className="relative">

              {/* Faint track — always visible */}
              <div
                aria-hidden="true"
                className="absolute left-4 top-3 bottom-3 w-px bg-[#2563EB]/08"
              />
              {/* Glowing segment that sweeps top→bottom continuously */}
              <motion.div
                aria-hidden="true"
                className="absolute left-[14px] w-[3px] h-16 rounded-full bg-gradient-to-b from-transparent via-[#2563EB]/55 to-transparent pointer-events-none"
                animate={{ top: [12, "calc(100% - 76px)"] }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut" as const,
                  repeat: Infinity,
                  repeatType: "loop" as const,
                  repeatDelay: 0.5,
                }}
              />

              {/* Staggered rows */}
              <motion.div
                variants={timelineContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative space-y-1"
              >
                {BENEFITS.map((b, i) => (
                  <motion.div
                    key={b}
                    variants={rowV}
                    whileHover={{
                      x: 5,
                      backgroundColor: "rgba(37,99,235,0.05)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="flex items-center gap-4 py-2 rounded-xl pr-4 cursor-default group"
                  >
                    {/* Number badge — springs in, circle continuously redraws */}
                    <motion.div
                      variants={badgeV}
                      className="shrink-0 w-8 h-8 relative z-10 flex items-center justify-center
                                 group-hover:shadow-[0_0_14px_rgba(37,99,235,0.22)]
                                 rounded-full transition-shadow duration-200"
                    >
                      {/* SVG circle that draws itself on a slow loop */}
                      <svg
                        width="32" height="32" viewBox="0 0 32 32"
                        fill="none"
                        className="absolute inset-0"
                        aria-hidden="true"
                      >
                        {/* Always-visible faint fill */}
                        <circle
                          cx="16" cy="16" r="13"
                          fill="rgba(37,99,235,0.06)"
                          className="group-hover:fill-[rgba(37,99,235,0.12)] transition-all duration-200"
                        />
                        {/* Continuously redrawing stroke */}
                        <motion.circle
                          cx="16" cy="16" r="13"
                          stroke="#2563EB"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          animate={{
                            pathLength: [0, 1, 1, 0],
                            opacity:    [0.35, 1, 1, 0.35],
                          }}
                          transition={{
                            duration:       4.2,
                            times:          [0, 0.40, 0.72, 1],
                            ease:           "easeInOut" as const,
                            repeat:         Infinity,
                            repeatType:     "loop" as const,
                            delay:          i * 0.7,
                          }}
                        />
                      </svg>
                      {/* Number */}
                      <span className="relative z-10 text-[10px] font-bold font-mono tabular-nums text-[#2563EB]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </motion.div>

                    {/* Text — slides in after badge */}
                    <motion.p
                      variants={textV}
                      className="text-sm font-medium text-gray-700 dark:text-white/75
                                 group-hover:text-gray-900 dark:group-hover:text-white
                                 transition-colors duration-150"
                    >
                      {b}
                    </motion.p>
                  </motion.div>
                ))}

                {/* Closing note */}
                <motion.p
                  variants={textV}
                  className="text-[11px] text-gray-400 dark:text-white/28 italic pl-12 pt-2"
                >
                  All in one seamless ecosystem.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>{/* inner grid */}
        </div>{/* glass wrapper */}

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-10" />

        {/* ── THE FOUR ENGINES ── */}
        <div>
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="text-[10px] tracking-[0.42em] uppercase font-bold aivora-gradient-text mb-3">
              The Four Engines
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Meet the operating system behind modern enterprise growth.
            </h2>
            <p className="text-gray-500 dark:text-white/45 text-sm">
              Four specialised engines. One connected platform.
            </p>
          </motion.div>

          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {ENGINES.map((e) => (
              <motion.div
                key={e.id}
                variants={cardItem}
                whileHover={{
                  y: -7,
                  backgroundColor: "rgba(37,99,235,0.025)",
                  boxShadow: "0 24px 52px rgba(37,99,235,0.16)",
                }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                className="group aivora-card border rounded-2xl p-6 flex flex-col gap-3
                           hover:border-[#2563EB]/30 transition-colors duration-200"
              >
                {/* Top accent bar — grows wider on hover */}
                <div
                  className={`h-[3px] rounded-full transition-all duration-300 group-hover:w-12 w-7 ${e.bgCls}`}
                />

                {/* Engine ID */}
                <span className={`font-mono font-bold text-sm tracking-widest ${e.textCls}`}>
                  {e.id}
                </span>

                {/* Tagline */}
                <p className="text-xs font-semibold text-gray-800 dark:text-white/80 leading-snug
                              group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-150">
                  {e.tagline}
                </p>

                {/* Description */}
                <p className="text-[11.5px] text-gray-400 dark:text-white/38 leading-relaxed flex-1">
                  {e.desc}
                </p>

                {/* CTA — slides up and fades in on hover */}
                <Link
                  href={e.href}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1
                              opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-200 ${e.textCls}`}
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
