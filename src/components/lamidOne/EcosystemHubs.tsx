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
    body:    "Four suites, each explained below — so every decision you make is grounded in what's real, not what's assumed.",
  },
  engines: {
    eyebrow: "Outcomes, Not Reports.",
    lead:    "Every Number",
    accent:  "Computed",
    tail:    "From Yours.",
    body:    "These tools take the figures you enter and do the arithmetic in front of you. Nothing is estimated, nothing is generated — you see the working, and you can export it.",
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
  /** Plain-words category — what this thing IS, before any brand language.
      HubSpot's device: "Marketing automation software" under every Hub name. */
  kind:    string;
  /** One sentence stating what it does for the reader. Always second person. */
  what:    string;
  /** Omitted on the free-tools card, which opens a modal instead of navigating. */
  href?:   string;
  color:   string;
  points:  string[];
  cta:     string;
  /** Suites carry an icon; tools carry their module code instead. */
  Icon?:   LucideIcon;
  code?:   string;
  pillar?: string;
  /** Opens the free-tools browser rather than following a link. */
  opensModal?: boolean;
};

const CARDS: Card[] = [
  /* ── The four suites ── */
  {
    id: "core", title: "LAMID CORE", kind: "Strategy & execution suite",
    href: "/core", color: "#2563EB", Icon: Network,
    cta: "Learn more",
    what: "Keep your strategy, your decisions, and your execution moving in one direction.",
    points: [
      "See where your strategy is stalling and what needs to move first.",
      "Align your leadership around one view of execution and performance.",
    ],
  },
  {
    id: "grow", title: "LAMID GROW", kind: "Customer & digital growth suite",
    href: "/grow", color: "#047857", Icon: TrendingUp,
    cta: "Learn more",
    what: "Watch how customers find you, engage you, and stay with you.",
    points: [
      "Track how your customers engage across every channel, as it happens.",
      "Spot where your growth is compounding — and where it's leaking.",
    ],
  },
  {
    id: "talent", title: "LAMID TALENT", kind: "People intelligence suite",
    href: "/talent", color: "#6D28D9", Icon: GraduationCap,
    cta: "Learn more",
    what: "Know your workforce as well as you know your numbers.",
    points: [
      "Match people to your roles on 40+ signals, not just CVs.",
      "Know which of your teams are strong, stretched, or at risk.",
    ],
  },
  {
    id: "finance", title: "LAMID FINANCE", kind: "Financial clarity suite",
    href: "/finance", color: "#B45309", Icon: Landmark,
    cta: "Learn more",
    what: "See exactly where your money is working — and where it isn't.",
    points: [
      "Know your true cost base, your burn, and what your business is worth.",
      "Forecast with numbers that move as fast as your business does.",
    ],
  },

  /* ── The five tools. Every claim below is backed by the compute layer:
        lib/budget/compute.ts, lib/intelligence/financial.ts, inputSpec.ts,
        roster.ts and scenario.ts. ── */
  {
    id: "f02", code: "F02", pillar: "LAMID FINANCE", kind: "Budget planning tool",
    title: "Budgeting & Forecasting", href: "/f02-budgeting-forecasting",
    color: "#B45309", cta: "Try it free",
    what: "Replaces guesswork in your numbers — budgets, forecasts, cash flow projections and margin models that make your financial future predictable.",
    points: [
      "Build a costed budget for any of your projects in minutes.",
      "Watch your overhead, contingency and tax recalculate as you edit.",
      "Track every line against what you actually spent.",
    ],
  },
  {
    id: "f04", code: "F04", pillar: "LAMID FINANCE", kind: "Margin & cost analysis tool",
    title: "Cost Optimization", href: "/f04-cost-optimization",
    color: "#B45309", cta: "Try it free",
    what: "Spots waste, cost leakage, and productivity gaps across your business — so you improve margin without cutting capability.",
    points: [
      "See your margin move period by period, on your own figures.",
      "Find the cost line growing faster than your revenue.",
      "Know when your operating cost passes what revenue can carry.",
    ],
  },
  {
    id: "r14", code: "R14", pillar: "LAMID GROW", kind: "Delivery rhythm tracker",
    title: "Real-Time Cadence Pulse", href: "/r14-real-time-cadence-pulse",
    color: "#047857", cta: "Try it free",
    what: "Monitors the pulse of your business — the recurring rhythms that show you its health, energy, and momentum.",
    points: [
      "See your trend and swing across six periods at a glance.",
      "Know whether your pace is rising, falling, or holding.",
      "Get told when a metric is too volatile to call a trend.",
    ],
  },
  {
    id: "a25", code: "A25", pillar: "LAMID TALENT", kind: "Workforce capability mapper",
    title: "Career Pathing", href: "/a25-career-pathing",
    color: "#6D28D9", cta: "Try it free",
    what: "Generates personalised career pathways for your people — aligned to their capability, performance, and aspiration.",
    points: [
      "Map capability across all your roles and headcount.",
      "See which of your critical roles have nobody ready behind them.",
      "Weight capability by team size, not by role count.",
    ],
  },
  {
    id: "q46", code: "Q46", pillar: "LAMID CORE", kind: "Decision modelling tool",
    title: "Predictive Foresight", href: "/q46-predictive-foresight",
    color: "#2563EB", cta: "Try it free",
    what: "Shows you the consequences, scenarios, and futures of a decision before they arrive — so you commit with foresight.",
    points: [
      "Compare your options by expected value, net of what each costs.",
      "See your highest-value option and your safest one separately.",
      "Know the probability at which the ranking flips.",
    ],
  },

  /* Tenth card — opens the free-tools browser rather than navigating. */
  {
    id: "free", title: "Free Tools", kind: "Your starting point",
    color: "#2563EB", opensModal: true, Icon: Wrench,
    cta: "Browse free tools",
    what: "Every tool above — free with your account.",
    points: [
      "Run every tool free once you have an account.",
      "Start with your budget, then work across the suites.",
      "No trial window and no card required.",
    ],
  },
];

/**
 * Lighter accent for the hovered card in dark theme.
 *
 * The card turns near-black under the pointer, and the saturated 700-weight
 * accents lose their footing on it — violet drops to 2.51:1, under the 3:1
 * floor for meaningful non-text. These 400-weight equivalents clear 6.5:1.
 * Passed as a CSS variable because an inline style cannot carry a :hover.
 */
const SOFT_ACCENT: Record<string, string> = {
  "#2563EB": "#60A5FA",
  "#047857": "#34D399",
  "#6D28D9": "#A78BFA",
  "#B45309": "#FBBF24",
};

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
    <section id="ecosystem" className="relative overflow-hidden bg-black dark:bg-white py-20 px-4">
      {/* Arrow field.
          Drawn in currentColor so it inverts with the section rather than
          needing a second colour: white strokes on the black ground, dark on
          the white one. Sits behind the z-10 content and takes no pointer
          events, so the scrollable card pane is unaffected. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.07] dark:text-black/[0.06]"
      >
        <defs>
          <pattern
            id="ecosystem-arrows"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
            /* Slight tilt stops the rows reading as a rigid grid. */
            patternTransform="rotate(-12)"
          >
            <path
              d="M14 32h28m0 0-9-9m9 9-9 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>

          {/* Fades the field out toward the centre so it never competes with
              the headline or the cards. */}
          <radialGradient id="ecosystem-arrows-fade" cx="50%" cy="50%" r="75%">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="55%"  stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="ecosystem-arrows-mask">
            <rect width="100%" height="100%" fill="url(#ecosystem-arrows-fade)" />
          </mask>
        </defs>

        {/* Oversized and offset so the one-tile drift never brings an edge
            into view. The mask stays put on the real bounds, so only the
            arrows move — the fade does not slide with them. */}
        <g mask="url(#ecosystem-arrows-mask)">
          <rect
            className="ecosystem-arrow-flow"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            fill="url(#ecosystem-arrows)"
          />
        </g>
      </svg>

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
              /* The hovered card has to read as the selected one. Each theme
                 moves away from its own section colour to get there: this
                 section is black in light theme and white in dark, and the
                 cards previously sat almost exactly on top of both.
                   dark theme  — white section, so the card goes dark (#0F172A)
                                 and its text inverts to stay readable.
                   light theme — black section, so darkening would hide it;
                                 it lifts instead.
                 focus-visible mirrors hover so keyboard users see the same
                 selection. */
              const shell =
                "group h-full w-full text-left flex flex-col rounded-2xl border p-6 transition-all duration-200 " +
                "border-white/10 bg-white/[0.03] shadow-none " +
                "dark:border-gray-200 dark:bg-white dark:shadow-[0_1px_3px_rgba(16,24,40,0.05)] " +
                "hover:bg-white/[0.09] hover:border-[#2563EB]/50 " +
                "dark:hover:bg-[#0F172A] dark:hover:border-[#0F172A] " +
                "hover:shadow-[0_12px_36px_rgba(37,99,235,0.18)] hover:-translate-y-1 " +
                "focus-visible:outline-none focus-visible:bg-white/[0.09] focus-visible:border-[#2563EB]/50 " +
                "dark:focus-visible:bg-[#0F172A] dark:focus-visible:border-[#0F172A] focus-visible:-translate-y-1";

              /* The card's accent, and the lighter one it swaps to once the
                 card goes dark. Exposed as variables so the swap can happen in
                 CSS on hover, which an inline colour cannot do. */
              const accentVars = {
                "--accent":      card.color,
                "--accent-soft": SOFT_ACCENT[card.color] ?? card.color,
              } as React.CSSProperties;

              const body = (
                <>
                  {/* Icon for a pillar, module code for an engine */}
                  <div className="flex items-center gap-2.5 mb-4">
                    {card.Icon ? (
                      <card.Icon
                        className="w-5 h-5 shrink-0 text-[var(--accent)] dark:group-hover:text-[var(--accent-soft)] dark:group-focus-visible:text-[var(--accent-soft)] transition-colors duration-200"
                        strokeWidth={2}
                      />
                    ) : (
                      /* Tools have no icon; a coloured dot keeps the header
                         rhythm without exposing the internal module code. */
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)] dark:group-hover:bg-[var(--accent-soft)] dark:group-focus-visible:bg-[var(--accent-soft)] transition-colors duration-200"
                        aria-hidden="true"
                      />
                    )}
                    {/* Every text layer needs a dark-theme hover variant: the
                        card turns near-black under the pointer, so the dark
                        text it normally carries would vanish into it. */}
                    <h3 className="text-base font-bold text-white dark:text-gray-900 dark:group-hover:text-white dark:group-focus-visible:text-white tracking-tight leading-tight transition-colors duration-200">
                      {card.title}
                    </h3>
                  </div>

                  {/* Category line — what this IS, in plain words. Tools also
                      name the suite they belong to. */}
                  <p className="-mt-2.5 mb-3.5 text-[9px] font-bold uppercase tracking-wider text-white/55 dark:text-gray-600 dark:group-hover:text-white/70 dark:group-focus-visible:text-white/70 transition-colors duration-200">
                    {card.pillar ? `${card.pillar} · ${card.kind}` : card.kind}
                  </p>

                  <div className="h-px bg-white/8 dark:bg-gray-100 dark:group-hover:bg-white/15 mb-4 transition-colors duration-200" />

                  {/* What it does for you — the tool's own purpose, spoken to
                      the reader, before any feature bullets. */}
                  <p className="mb-4 text-sm leading-snug text-white/85 dark:text-gray-800 dark:group-hover:text-white/90 dark:group-focus-visible:text-white/90 font-medium transition-colors duration-200">
                    {card.what}
                  </p>

                  <ul className="flex flex-col gap-3 flex-1">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)] dark:group-hover:text-[var(--accent-soft)] dark:group-focus-visible:text-[var(--accent-soft)] transition-colors duration-200"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-white/70 dark:text-gray-600 dark:group-hover:text-white/75 dark:group-focus-visible:text-white/75 leading-snug transition-colors duration-200">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="h-px bg-white/8 dark:bg-gray-100 dark:group-hover:bg-white/15 mt-5 mb-4 transition-colors duration-200" />

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white dark:text-gray-900 dark:group-hover:text-white dark:group-focus-visible:text-white transition-colors duration-200">
                    {card.cta}
                    <ArrowRight
                      className="w-4 h-4 transition-all duration-200 group-hover:translate-x-1 text-[var(--accent)] dark:group-hover:text-[var(--accent-soft)] dark:group-focus-visible:text-[var(--accent-soft)]"
                      strokeWidth={2}
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
                      style={accentVars}
                    >
                      {body}
                    </button>
                  ) : (
                    <Link href={card.href!} className={shell} style={accentVars}>
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
