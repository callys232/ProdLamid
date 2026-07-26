"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Network, TrendingUp, GraduationCap, Landmark, Check, ArrowRight, Wrench } from "lucide-react";
import FreeToolsModal from "./FreeToolsModal";
import type { LucideIcon } from "lucide-react";

/* Two captions: one for the pillars, one for the engines. Wording is taken from
   the approved Website Content v2 deck — "Outcomes Not Reports" is one of its
   four Why LAMID ONE pillars, and "what's real, not what's assumed" is from the
   homepage subheadline. No new marketing language invented here. */
const CAPTIONS = {
  pillars: {
    eyebrow: "Human Insight. AI Precision. One Ecosystem.",
    lead:    "One Platform.",
    accent:  "Every Layer",
    tail:    "of Your Business.",
    body:    "Your strategy, growth, people, and finance — unified into one signal, so every decision you make is grounded in what's real, not what's assumed.",
  },
  engines: {
    eyebrow: "Outcomes, Not Reports.",
    lead:    "Every Number",
    accent:  "Computed",
    tail:    "From Yours.",
    body:    "These engines take the figures you enter and do the arithmetic in front of you. Nothing is estimated, nothing is generated — you see the working, and you can export it.",
  },
} as const;

/**
 * The ecosystem grid: four pillars followed by the five engines that compute
 * their answers in TypeScript rather than asking a model for them.
 *
 * Nine cards scroll past a pitch pinned on the left. Every bullet states what
 * the reader gets, not what the software contains.
 */

type Card = {
  id:      string;
  title:   string;
  /** Omitted on the free-tools card, which opens a modal instead of navigating. */
  href?:   string;
  color:   string;
  points:  string[];
  cta:     string;
  /** Pillars carry an icon; engines carry their module code instead. */
  Icon?:   LucideIcon;
  code?:   string;
  pillar?: string;
  /** Opens the free-tools browser rather than following a link. */
  opensModal?: boolean;
};

const CARDS: Card[] = [
  /* ── The four pillars ── */
  {
    id: "core", title: "LAMID CORE", href: "/core", color: "#2563EB", Icon: Network,
    cta: "Learn more",
    points: [
      "See where strategy is stalling and what needs to move first.",
      "Align leadership around one view of execution and performance.",
    ],
  },
  {
    id: "grow", title: "LAMID GROW", href: "/grow", color: "#047857", Icon: TrendingUp,
    cta: "Learn more",
    points: [
      "Track customer engagement and digital performance in real time.",
      "Spot where growth is compounding — and where it's leaking.",
    ],
  },
  {
    id: "talent", title: "LAMID TALENT", href: "/talent", color: "#6D28D9", Icon: GraduationCap,
    cta: "Learn more",
    points: [
      "Put the right people in the right roles.",
      "Track capability, culture health, and hiring readiness in one place.",
    ],
  },
  {
    id: "finance", title: "LAMID FINANCE", href: "/finance", color: "#B45309", Icon: Landmark,
    cta: "Learn more",
    points: [
      "See cost, cash, and enterprise value in real time.",
      "Forecast with numbers that move as fast as the business does.",
    ],
  },

  /* ── The five engines. Every claim below is backed by the compute layer:
        lib/budget/compute.ts, lib/intelligence/financial.ts, inputSpec.ts,
        roster.ts and scenario.ts. ── */
  {
    id: "f02", code: "F02", pillar: "LAMID FINANCE",
    title: "Budgeting & Forecasting", href: "/f02-budgeting-forecasting",
    color: "#B45309", cta: "Open engine",
    points: [
      "Build a costed budget for any project type in minutes.",
      "Watch overhead, contingency and tax recalculate as you edit.",
      "Track every line against what you actually spent.",
    ],
  },
  {
    id: "f04", code: "F04", pillar: "LAMID FINANCE",
    title: "Cost Optimization", href: "/f04-cost-optimization",
    color: "#B45309", cta: "Open engine",
    points: [
      "See margin move period by period, on your own figures.",
      "Find the cost line growing faster than revenue.",
      "Know when operating cost passes what revenue can carry.",
    ],
  },
  {
    id: "r14", code: "R14", pillar: "LAMID GROW",
    title: "Real-Time Cadence Pulse", href: "/r14-real-time-cadence-pulse",
    color: "#047857", cta: "Open engine",
    points: [
      "Measure delivery against a target you set yourself.",
      "See trend and swing across six periods at a glance.",
      "Get told when a metric is too volatile to call a trend.",
    ],
  },
  {
    id: "a25", code: "A25", pillar: "LAMID TALENT",
    title: "Career Pathing", href: "/a25-career-pathing",
    color: "#6D28D9", cta: "Open engine",
    points: [
      "Map capability across every role and headcount.",
      "See which critical roles have nobody ready behind them.",
      "Weight capability by team size, not by role count.",
    ],
  },
  {
    id: "q46", code: "Q46", pillar: "LAMID CORE",
    title: "Predictive Foresight", href: "/q46-predictive-foresight",
    color: "#2563EB", cta: "Open engine",
    points: [
      "Compare options by expected value, net of what each costs.",
      "See the highest-value option and the safest one separately.",
      "Know the probability at which the ranking flips.",
    ],
  },

  /* Tenth card — opens the free-tools browser rather than navigating. */
  {
    id: "free", title: "Free Tools", color: "#2563EB", opensModal: true, Icon: Wrench,
    cta: "Browse free tools",
    points: [
      "Run every engine free once you have an account.",
      "Start with the budget engine, then work across the suites.",
      "No trial window and no card required.",
    ],
  },
];

/** Index of the first engine card — where the caption switches. */
const FIRST_ENGINE = CARDS.findIndex((c) => Boolean(c.code));

const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function EcosystemHubs() {
  const [onEngines, setOnEngines] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const sentinel  = useRef<HTMLDivElement | null>(null);
  const scroller  = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  /* The cards scroll inside their own pane, so the caption tracks that pane's
     scroll rather than the window's. It flips once the first engine card passes
     the upper-middle of the pane, and flips back on the way up. */
  useEffect(() => {
    const node = sentinel.current;
    const box  = scroller.current;
    if (!node) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const cardTop = node.getBoundingClientRect().top;
      // Below the lg breakpoint the pane is not scrollable, so fall back to the viewport.
      const isPaneScrolling = box && box.scrollHeight > box.clientHeight + 1;
      const bounds = isPaneScrolling
        ? box.getBoundingClientRect()
        : { top: 0, height: window.innerHeight };
      setOnEngines(cardTop < bounds.top + bounds.height * 0.45);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    box?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      box?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const caption = onEngines ? CAPTIONS.engines : CAPTIONS.pillars;

  return (
    <section id="ecosystem" className="relative bg-black dark:bg-white py-20 px-4">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-start">

          {/* ── LEFT — pitch, pinned while the cards scroll past ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-white/12 dark:border-gray-200 bg-white/[0.04] dark:bg-white/70 mb-8">
              <Sparkles className="w-4 h-4 text-[#60A5FA] dark:text-[#2563EB]" strokeWidth={2} />
              <span className="text-white/75 dark:text-gray-700">{caption.eyebrow}</span>
            </span>

            {/* Reserved height so the CTAs never shift as the caption swaps */}
            <div className="lg:min-h-[290px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={caption.eyebrow}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white dark:text-gray-900 leading-[1.12] tracking-tight mb-6">
                    {caption.lead}{" "}
                    <span className="text-[#60A5FA] dark:text-[#1D4ED8]">{caption.accent}</span>
                    <br className="hidden sm:block" />
                    {caption.tail}
                  </h2>

                  <p className="text-white/55 dark:text-gray-500 text-base leading-relaxed max-w-md">
                    {caption.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mb-9" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_20px_rgba(37,99,235,0.35)]"
              >
                Book a Demo
              </Link>
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold border border-[#60A5FA]/40 text-[#60A5FA] bg-[#60A5FA]/[0.08] hover:bg-[#60A5FA]/15 dark:border-[#2563EB]/30 dark:text-[#2563EB] dark:bg-[#2563EB]/[0.06] dark:hover:bg-[#2563EB]/12 transition-colors"
              >
                Explore the Ecosystem
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT — four cards in view, the rest scroll inside the pane ──
              Fixed height on desktop so exactly two rows sit in the window and
              the fifth card peeks in, signalling there is more below. Below the
              lg breakpoint the height is released and all nine simply stack. */}
          <motion.div
            ref={scroller}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-5 lg:h-[620px] lg:overflow-y-auto"
          >
            {CARDS.map((card, i) => {
              /* One shell, two behaviours: nine cards navigate, the free-tools
                 card opens the browser. Rendered as a real <button> so it is
                 keyboard-operable and never a link to nowhere. */
              const shell =
                "group h-full w-full text-left flex flex-col rounded-2xl border border-white/10 dark:border-gray-200 bg-white/[0.03] dark:bg-white p-6 shadow-none dark:shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all duration-200 hover:border-[#2563EB]/40 hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)] hover:-translate-y-1";

              const body = (
                <>
                  {/* Icon for a pillar, module code for an engine */}
                  <div className="flex items-center gap-2.5 mb-4">
                    {card.Icon ? (
                      <card.Icon className="w-5 h-5 shrink-0" strokeWidth={2} style={{ color: card.color }} />
                    ) : (
                      /* Engines have no icon; a coloured dot keeps the header
                         rhythm without exposing the internal module code. */
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: card.color }}
                        aria-hidden="true"
                      />
                    )}
                    <h3 className="text-base font-bold text-white dark:text-gray-900 tracking-tight leading-tight">
                      {card.title}
                    </h3>
                  </div>

                  {card.pillar && (
                    <p className="-mt-2.5 mb-3.5 text-[9px] font-bold uppercase tracking-wider text-white/40 dark:text-gray-500">
                      {card.pillar}
                    </p>
                  )}

                  <div className="h-px bg-white/8 dark:bg-gray-100 mb-4" />

                  <ul className="flex flex-col gap-3 flex-1">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} style={{ color: card.color }} />
                        <span className="text-sm text-white/60 dark:text-gray-600 leading-snug">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="h-px bg-white/8 dark:bg-gray-100 mt-5 mb-4" />

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white dark:text-gray-900">
                    {card.cta}
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={2}
                      style={{ color: card.color }}
                    />
                  </span>
                </>
              );

              return (
                <motion.div
                  key={card.id}
                  variants={cardV}
                  /* The first engine card is the sentinel: once it clears the
                     upper-middle of the pane, the caption swaps to the engines. */
                  ref={i === FIRST_ENGINE ? sentinel : undefined}
                >
                  {card.opensModal ? (
                    <button
                      type="button"
                      onClick={() => setToolsOpen(true)}
                      aria-haspopup="dialog"
                      className={shell}
                    >
                      {body}
                    </button>
                  ) : (
                    <Link href={card.href!} className={shell}>
                      {body}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>

      <FreeToolsModal open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </section>
  );
}
