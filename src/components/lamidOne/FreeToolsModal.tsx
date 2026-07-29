"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Play } from "lucide-react";

/**
 * Free tools browser.
 *
 * Opens over the ecosystem grid: a hero for the flagship free tool with a
 * slide gallery, then a grid of every other free tool. Each tile launches its
 * tool directly.
 *
 * Slides accept a video or an image. Only screenshots exist today, so `video`
 * is left unset — drop a file in /public and set the field to switch a slide
 * over without any code change.
 */

type Slide = {
  /** Path under /public. Takes precedence over `image` when set. */
  video?: string;
  image?: string;
  caption: string;
};

type Tool = {
  code:    string;
  name:    string;
  pillar:  string;
  href:    string;
  color:   string;
  blurb:   string;
  /** Tile artwork. Falls back to a coloured plate with the code when absent. */
  image?:  string;
};

/* The flagship — the tool worth opening the modal for. */
const HERO = {
  code:   "F02",
  name:   "Budgeting & Forecasting",
  pillar: "LAMID FINANCE",
  href:   "/f02-budgeting-forecasting",
  color:  "#B45309",
  blurb:
    "Build a costed, itemised budget for any project type. Overhead, contingency, tax and phasing recalculate as you edit, and every line can be tracked against what you actually spent.",
  points: [
    "12 project types and 11 cost categories out of the box",
    "Variance against actuals, with a projected outturn",
    "Export the whole thing to CSV",
  ],
  slides: [
    { image: "/screenshots/f02-setup.png",     caption: "Set the project up once — overhead, contingency and tax load the totals automatically." },
    { image: "/screenshots/f02-budgeting.png", caption: "Plan versus actual, with overruns ranked worst first and an outturn projected from the current rate." },
    { image: "/screenshots/f02-breakdown.png", caption: "Cost by category and spend by month, phased across the periods you define." },
  ] as Slide[],
};

/* Free for every signed-in member. All routes verified against src/app. */
const TOOLS: Tool[] = [
  { code: "F01", name: "Financial Visibility",     pillar: "LAMID FINANCE", href: "/f01-financial-visibility",        color: "#B45309", blurb: "Revenue, cost, margin and runway in one view.", image: "/screenshots/f01-visibility.png" },
  { code: "F04", name: "Cost Optimization",        pillar: "LAMID FINANCE", href: "/f04-cost-optimization",           color: "#B45309", blurb: "Find the cost line growing faster than revenue.", image: "/screenshots/f04-cost.png" },
  { code: "R14", name: "Real-Time Cadence Pulse",  pillar: "LAMID GROW",    href: "/r14-real-time-cadence-pulse",     color: "#047857", blurb: "Measure delivery against a target you set.", image: "/screenshots/r14-cadence.png" },
  { code: "R03", name: "Cadence Drift Alert",      pillar: "LAMID GROW",    href: "/r03-cadence-drift-alert",         color: "#047857", blurb: "Catch delivery slipping before the quarter does.", image: "/screenshots/r03-drift.png" },
  { code: "A25", name: "Career Pathing",           pillar: "LAMID TALENT",  href: "/a25-career-pathing",              color: "#6D28D9", blurb: "Map capability across every role and headcount.", image: "/screenshots/a25-career.png" },
  { code: "A21", name: "Succession Pipeline",      pillar: "LAMID TALENT",  href: "/a21-succession-pipeline",         color: "#6D28D9", blurb: "See which critical roles have nobody behind them.", image: "/screenshots/a21-succession.png" },
  { code: "Q46", name: "Predictive Foresight",     pillar: "LAMID CORE",    href: "/q46-predictive-foresight",        color: "#2563EB", blurb: "Compare options by expected value, net of cost.", image: "/screenshots/q46-foresight.png" },
  { code: "Q59", name: "Outcome Range Assessment", pillar: "LAMID CORE",    href: "/q59-outcome-range-assessment",    color: "#2563EB", blurb: "See the spread between best and worst case.", image: "/screenshots/q59-outcome.png" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FreeToolsModal({
  open, onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const panel = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  const total = HERO.slides.length;
  const next = useCallback(() => setSlide((s) => (s + 1) % total), [total]);
  const prev = useCallback(() => setSlide((s) => (s - 1 + total) % total), [total]);

  /* Escape closes, arrows move the gallery, and Tab is kept inside the panel
     so the page behind never receives focus while the modal is open. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     { onClose(); return; }
      if (e.key === "ArrowRight") { next();    return; }
      if (e.key === "ArrowLeft")  { prev();    return; }
      if (e.key !== "Tab" || !panel.current) return;

      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    // Hold the page still, compensating for the scrollbar so nothing shifts.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad      = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, onClose, next, prev]);

  // Always reopen on the first slide.
  useEffect(() => { if (open) setSlide(0); }, [open]);

  const active = HERO.slides[slide];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-tools-title"
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#0B1220]"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-white/10 sm:px-8">
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#2563EB]">
                  Free for every member
                </p>
                <h2 id="free-tools-title" className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  Free Tools
                </h2>
              </div>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                aria-label="Close free tools"
                className="shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Hero: gallery left, copy right ── */}
            <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 sm:px-8">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0"
                    >
                      {active.video ? (
                        <video
                          src={active.video}
                          className="h-full w-full object-cover object-top"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={active.image}
                          alt={active.caption}
                          className="h-full w-full object-cover object-top"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {total > 1 && (
                    <>
                      <button
                        type="button" onClick={prev} aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button" onClick={next} aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <p className="mt-3 min-h-[2.5rem] text-xs leading-relaxed text-gray-600 dark:text-white/55">
                  {active.caption}
                </p>

                {total > 1 && (
                  <div className="flex items-center gap-1.5">
                    {HERO.slides.map((s, i) => (
                      <button
                        key={s.caption}
                        type="button"
                        onClick={() => setSlide(i)}
                        aria-label={`Slide ${i + 1} of ${total}`}
                        aria-current={i === slide}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width:      i === slide ? 26 : 8,
                          background: i === slide ? HERO.color : "currentColor",
                          opacity:    i === slide ? 1 : 0.22,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: HERO.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/55">
                    {HERO.pillar}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 dark:text-white">
                  {HERO.name}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-white/55">
                  {HERO.blurb}
                </p>

                <ul className="mb-6 flex flex-col gap-2">
                  {HERO.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[13px] text-gray-600 dark:text-white/55">
                      <Play className="mt-1 h-2.5 w-2.5 shrink-0 fill-current" style={{ color: HERO.color }} />
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={HERO.href}
                  onClick={onClose}
                  className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: HERO.color }}
                >
                  Launch this tool
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* ── Every other free tool ── */}
            <div className="border-t border-gray-200 px-6 py-6 dark:border-white/10 sm:px-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-gray-600 dark:text-white/55">
                More free tools
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {TOOLS.map((t) => (
                  <Link
                    key={t.code}
                    href={t.href}
                    onClick={onClose}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    {/* Screenshot where one exists, coloured plate where it does not */}
                    <span className="relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-black">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt=""
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span
                          className="block h-full w-full"
                          style={{ background: `${t.color}14` }}
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <span className="flex flex-1 flex-col p-3.5">
                      <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/55">
                        {t.pillar}
                      </span>
                      <span className="mb-1.5 text-[13px] font-bold leading-snug text-gray-900 dark:text-white">
                        {t.name}
                      </span>
                      <span className="text-[11px] leading-relaxed text-gray-600 dark:text-white/55">
                        {t.blurb}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
