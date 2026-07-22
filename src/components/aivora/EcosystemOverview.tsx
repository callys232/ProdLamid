"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Network, TrendingUp, GraduationCap, Landmark, Activity, Users, Rocket, CalendarDays, ChevronUp, ChevronDown } from "lucide-react";

const PORTALS = [
  {
    id: "core",
    icon: Network,
    label: "Lamid Core",
    tagline: "Strategy, alignment, and execution made clear.",
    bullets: [
      "Align strategy, execution, and team performance.",
      "Make faster decisions with real-time clarity.",
    ],
    cta: "Explore Lamid Core",
    href: "/core",
  },
  {
    id: "grow",
    icon: TrendingUp,
    label: "Lamid Grow",
    tagline: "Customer clarity. Digital confidence.",
    bullets: [
      "Understand how customers find and experience your business.",
      "Identify digital growth gaps and close them fast.",
    ],
    cta: "Explore Lamid Grow",
    href: "/grow",
  },
  {
    id: "talent",
    icon: GraduationCap,
    label: "Lamid Talent",
    tagline: "People intelligence for modern teams.",
    bullets: [
      "Track team performance, culture health, and workforce needs.",
      "Build the right team — at the right time.",
    ],
    cta: "Explore Lamid Talent",
    href: "/talent",
  },
  {
    id: "finance",
    icon: Landmark,
    label: "Lamid Finance",
    tagline: "Financial clarity for every leader.",
    bullets: [
      "Real-time visibility into cost, cash, and forecasts.",
      "Smarter decisions, backed by enterprise-grade intelligence.",
    ],
    cta: "Explore Lamid Finance",
    href: "/finance",
  },
  {
    id: "diagnostic",
    icon: Activity,
    label: "Diagnostic",
    tagline: "Know exactly where your business stands.",
    bullets: [
      "AI-powered health check across 7 business dimensions.",
      "Instant results — no commitment, no cost.",
    ],
    cta: "Take your Lamid One Diagnostic",
    href: "/premium/business-diagnostic",
  },
  {
    id: "marketplace",
    icon: Users,
    label: "Expert Marketplace",
    tagline: "The right expert, matched by AI.",
    bullets: [
      "Browse vetted consultants across every sector.",
      "47 data points analyzed per match — not just availability.",
    ],
    cta: "Browse Experts",
    href: "/talent",
  },
  {
    id: "free-tools",
    icon: Rocket,
    label: "All Free Tools",
    tagline: "Powerful tools. Zero cost to start.",
    bullets: [
      "Diagnostic, Proposal Drafter, Budget Estimator, and more.",
      "No credit card needed — use any tool instantly.",
    ],
    cta: "Explore Free Tools",
    href: "/biz",
  },
  {
    id: "events",
    icon: CalendarDays,
    label: "Events & Learning",
    tagline: "Grow your people. Grow your business.",
    bullets: [
      "Workshops, training programs, and leadership development.",
      "Live and on-demand sessions for every team size.",
    ],
    cta: "Browse Events",
    href: "/events",
  },
];

// Two pages of 4 cards each shown in the fixed-height container
const GROUPS = [PORTALS.slice(0, 4), PORTALS.slice(4, 8)];

export default function EcosystemOverview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(0);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which page is visible inside the scroll container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            const idx = pageRefs.current.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) setActivePage(idx);
          }
        });
      },
      { root: el, threshold: 0.5 },
    );
    pageRefs.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, []);

  const scrollToPage = (idx: number) => {
    const el = pageRefs.current[idx];
    if (!el || !scrollRef.current) return;
    scrollRef.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  return (
    <section id="ecosystem" className="relative aivora-section py-16 px-4 overflow-hidden">

      {/* Diagonal bg lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[
          "M1400 0 L900 300 L400 -100",
          "M1400 200 L800 500 L200 100",
          "M1200 -50 L600 350 L0 50",
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.5"
            strokeOpacity="0.08" strokeDasharray="10 22"
            animate={{ strokeDashoffset: [0, 130], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3.5 }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-start">

          {/* ── LEFT: sticky headline ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:sticky lg:top-24 lg:self-start mb-10 lg:mb-0 py-4"
          >
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-5">
              The Ecosystem
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-[1.12] tracking-tight mb-5">
              One Platform.{" "}
              <span className="aivora-gradient-text">Four Engines.</span>
              <br className="hidden sm:block" />
              Every Layer of Your Business.
            </h2>
            <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
              Your strategy, growth, talent, and finance — unified under one intelligent layer,
              so every part of your organization moves in the same direction at the same time.
            </p>

            {/* Caption — updates as pages scroll */}
            <div className="mb-6 min-h-[52px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-sm font-bold aivora-gradient-text block mb-0.5">
                    {GROUPS[activePage][0].label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/45 leading-snug">
                    {GROUPS[activePage][0].tagline}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-2 text-sm font-semibold aivora-gradient-text hover:opacity-80 transition-opacity"
            >
              Explore Lamid One
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* ── RIGHT: fixed-height vertical scroll, 4 cards per page ── */}
          <div className="flex flex-col">
            {/* Scroll container — fixed height on desktop, natural height on mobile */}
            <div
              ref={scrollRef}
              className="flex flex-col gap-5
                         lg:h-[480px] lg:gap-0 lg:overflow-y-auto
                         lg:[scroll-snap-type:y_mandatory]
                         [scrollbar-width:none] [-ms-overflow-style:none]
                         [&::-webkit-scrollbar]:hidden"
            >
              {GROUPS.map((group, gi) => (
                <div
                  key={gi}
                  ref={(el) => { pageRefs.current[gi] = el; }}
                  className="grid grid-cols-2 gap-4
                             lg:shrink-0 lg:h-full lg:[scroll-snap-align:start]
                             mb-5 lg:mb-0"
                >
                  {group.map((portal, pi) => {
                    const isHov = hovered === portal.id;
                    return (
                      <motion.div
                        key={portal.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, delay: (gi * 4 + pi) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        onHoverStart={() => setHovered(portal.id)}
                        onHoverEnd={() => setHovered(null)}
                        onClick={() => router.push(portal.href)}
                        whileHover={{ y: -4, boxShadow: "0 18px 44px rgba(37,99,235,0.16)" }}
                        whileTap={{ scale: 0.985 }}
                        animate={{ borderColor: isHov ? "rgba(37,99,235,0.32)" : "transparent" }}
                        className="relative flex flex-col aivora-card border rounded-2xl p-5 overflow-hidden cursor-pointer"
                      >
                        {/* Left accent bar */}
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#2563EB]"
                          animate={{ scaleY: isHov ? 1 : 0 }}
                          style={{ originY: 0 }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Corner glow */}
                        <motion.div
                          className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl pointer-events-none bg-[#2563EB]"
                          animate={{ opacity: isHov ? 0.09 : 0 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Bottom sweep */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                          style={{ background: "linear-gradient(to right, #2563EB, transparent)" }}
                          animate={{ width: isHov ? "100%" : "0%" }}
                          transition={{ duration: 0.32 }}
                        />

                        {/* Icon + label */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <motion.div
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-[#2563EB]/25 bg-[#2563EB]/10"
                            animate={{
                              scale: isHov ? 1.08 : 1,
                              boxShadow: isHov ? "0 0 14px rgba(37,99,235,0.26)" : "0 0 0 rgba(37,99,235,0)",
                            }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          >
                            <portal.icon className="w-4 h-4 text-[#2563EB]" strokeWidth={1.75} />
                          </motion.div>
                          <span className="text-xs font-bold aivora-gradient-text leading-tight">{portal.label}</span>
                        </div>

                        {/* Separator */}
                        <div className="w-full h-px bg-gray-100 dark:bg-white/[0.06] mb-3" />

                        {/* Bullets */}
                        <ul className="flex flex-col gap-2 flex-1 mb-4">
                          {portal.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-1.5">
                              <svg className="shrink-0 mt-[3px] text-[#2563EB]" width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-[11px] text-gray-600 dark:text-white/55 leading-snug">{b}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Link
                          href={portal.href}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold aivora-gradient-text hover:opacity-75 transition-opacity"
                        >
                          Learn more
                          <motion.span animate={{ x: isHov ? 3 : 0 }} transition={{ duration: 0.14 }}>→</motion.span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Nav — desktop only */}
            <div className="hidden lg:flex items-center justify-between mt-3">
              {/* Vertical pill dots */}
              <div className="flex items-center gap-2">
                {GROUPS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Page ${i + 1}`}
                    onClick={() => scrollToPage(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activePage
                        ? "w-5 h-1.5 bg-[#2563EB]"
                        : "w-1.5 h-1.5 bg-gray-300 dark:bg-white/20 hover:bg-[#2563EB]/50"
                    }`}
                  />
                ))}
              </div>

              {/* Up / Down arrows */}
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => scrollToPage(Math.max(activePage - 1, 0))}
                  disabled={activePage === 0}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10
                             flex items-center justify-center
                             text-gray-400 dark:text-white/35
                             hover:border-[#2563EB] hover:text-[#2563EB]
                             disabled:opacity-30 disabled:cursor-not-allowed
                             transition-all duration-200"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => scrollToPage(Math.min(activePage + 1, GROUPS.length - 1))}
                  disabled={activePage === GROUPS.length - 1}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10
                             flex items-center justify-center
                             text-gray-400 dark:text-white/35
                             hover:border-[#2563EB] hover:text-[#2563EB]
                             disabled:opacity-30 disabled:cursor-not-allowed
                             transition-all duration-200"
                >
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
