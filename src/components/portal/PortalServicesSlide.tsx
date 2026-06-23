"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface PortalService {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  stat: string;
  statLabel: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  accent: string;
}

const services: PortalService[] = [
  {
    id: "talent",
    icon: "◈",
    title: "Talent Marketplace",
    tagline: "Find & hire verified consultants",
    stat: "500+",
    statLabel: "Verified experts",
    description:
      "Browse a curated network of verified professionals across strategy, finance, tech, legal, and more. Filter by industry, skill, availability, and rating.",
    features: [
      "Verified profiles & portfolios",
      "Advanced search by skill & location",
      "Direct messaging & proposals",
      "Ratings & track record visibility",
    ],
    cta: "Browse Consultants",
    href: "/talent",
    accent: "#C12129",
  },
  {
    id: "projects",
    icon: "⬡",
    title: "Project Workspace",
    tagline: "Manage work end-to-end",
    stat: "Milestone",
    statLabel: "Based delivery",
    description:
      "Post scopes, receive bids, build teams, set milestones, and track delivery from kickoff to completion. Built for enterprise pace.",
    features: [
      "Milestone-based timelines",
      "Bid management & selection",
      "Team collaboration workspace",
      "Real-time activity logs",
    ],
    cta: "Start a Project",
    href: "/postjobs",
    accent: "#2563eb",
  },
  {
    id: "escrow",
    icon: "⬟",
    title: "Escrow & Payments",
    tagline: "Milestone-locked security",
    stat: "Zero",
    statLabel: "Payment disputes",
    description:
      "Funds held in escrow, released only on milestone completion. Full audit trail, built-in dispute resolution, multi-currency support.",
    features: [
      "Milestone-triggered releases",
      "Built-in dispute resolution",
      "Multi-currency support",
      "Full audit trail",
    ],
    cta: "How Escrow Works",
    href: "/escrow",
    accent: "#16a34a",
  },
  {
    id: "jobs",
    icon: "▣",
    title: "Job Board",
    tagline: "Post roles. Find talent. Fast.",
    stat: "10k+",
    statLabel: "Active workers",
    description:
      "Permanent, contract, or short-term — the LAMID Job Board connects you to qualified professionals ready for any engagement.",
    features: [
      "Contract & permanent postings",
      "Applicant tracking & filtering",
      "AI job description builder",
      "LAMID network visibility",
    ],
    cta: "View Open Roles",
    href: "/jobs",
    accent: "#d97706",
  },
  {
    id: "concierge",
    icon: "✦",
    title: "Concierge",
    tagline: "White-glove enterprise matching",
    stat: "48hr",
    statLabel: "Shortlist delivery",
    description:
      "For complex, high-stakes engagements. Our team handles sourcing, vetting, and matching so you focus on the work, not the hunt.",
    features: [
      "Dedicated matching specialist",
      "Curated shortlists in 48 hours",
      "End-to-end engagement support",
      "Enterprise SLA guarantees",
    ],
    cta: "Request Concierge",
    href: "/concierge",
    accent: "#7c3aed",
  },
  {
    id: "premium",
    icon: "⚡",
    title: "Premium Suite",
    tagline: "AI tools for enterprise edge",
    stat: "AI",
    statLabel: "Powered tools",
    description:
      "Draft proposals in minutes, run diagnostics, access analytics agents, and manage your enterprise profile — all in one suite.",
    features: [
      "AI Proposal Drafter",
      "Business Diagnostic Engine",
      "Analytics & intelligence agents",
      "Priority support & visibility",
    ],
    cta: "Explore Premium",
    href: "/premium",
    accent: "#b45309",
  },
];

/* ── Moving vector paths ── */
const vectorPaths = [
  { d: "M-100 200 L400 -50 L900 300", delay: 0, dur: 18 },
  { d: "M0 500 L600 100 L1200 450", delay: 3, dur: 22 },
  { d: "M200 -20 L500 400 L800 50", delay: 6, dur: 26 },
  { d: "M-50 350 L350 600 L750 200", delay: 1.5, dur: 20 },
  { d: "M100 600 L700 200 L1100 550", delay: 4, dur: 24 },
];

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardAnim: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

const PortalServicesSlide: React.FC = () => {
  const [active, setActive] = useState<PortalService | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAccountTypes, setShowAccountTypes] = useState(false);
  const [hoveredAccountType, setHoveredAccountType] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const dest = (href: string) => (!loading && isAuthenticated ? href : "/signup");

  return (
    <section className="relative bg-black text-white overflow-hidden py-16 px-4">
      {/* ── Animated vector background ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow-vec">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {vectorPaths.map((v, i) => (
          <motion.path
            key={i}
            d={v.d}
            fill="none"
            stroke="#C12129"
            strokeWidth="0.6"
            strokeOpacity="0.18"
            filter="url(#glow-vec)"
            strokeDasharray="8 18"
            animate={{
              strokeDashoffset: [0, -120],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              strokeDashoffset: {
                duration: v.dur,
                repeat: Infinity,
                ease: "linear",
                delay: v.delay,
              },
              opacity: {
                duration: v.dur * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: v.delay,
              },
            }}
          />
        ))}

        {/* Floating geometric dots */}
        {[
          { cx: "15%", cy: "20%", r: 1.5, delay: 0, dur: 7 },
          { cx: "80%", cy: "15%", r: 1, delay: 2, dur: 9 },
          { cx: "60%", cy: "75%", r: 1.5, delay: 1, dur: 8 },
          { cx: "30%", cy: "85%", r: 1, delay: 3, dur: 11 },
          { cx: "90%", cy: "55%", r: 1.5, delay: 0.5, dur: 6 },
          { cx: "10%", cy: "60%", r: 1, delay: 4, dur: 10 },
        ].map((dot, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#C12129"
            animate={{
              cy: [
                `${parseFloat(dot.cy as string)}%`,
                `${parseFloat(dot.cy as string) - 3}%`,
                `${parseFloat(dot.cy as string)}%`,
              ],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: dot.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}
      </svg>

      {/* Top/bottom edge fades */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Header — left-aligned ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            The AIVORA Portal
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-3">
            One Ecosystem.{" "}
            <span className="text-[#C12129]">Every Way to Work.</span>
          </h2>
          <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg">
            Find experts, manage projects, and deliver results — with trusted expertise and advanced AI, all in one place.
          </p>

          {/* Divider */}
          <div className="mt-8 h-px bg-gradient-to-r from-[#C12129]/50 via-white/10 to-transparent" />
        </motion.div>

        {/* ── Centralized CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <Link
            href="/pricing"
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors"
          >
            Flexible Plans →
          </Link>
          <button
            type="button"
            onClick={() => setShowAccountTypes(true)}
            className="px-5 py-2.5 rounded-full text-xs font-semibold border border-white/20 text-white/70 hover:border-[#C12129] hover:text-[#C12129] transition-colors"
          >
            Account Types
          </button>
          <Link
            href="/talent"
            className="px-5 py-2.5 rounded-full text-xs font-semibold border border-white/20 text-white/70 hover:border-[#C12129] hover:text-[#C12129] transition-colors"
          >
            Browse Consultants →
          </Link>
        </motion.div>

        {/* ── Service Cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {services.map((svc) => {
            const isHov = hovered === svc.id;
            return (
              <motion.button
                key={svc.id}
                variants={cardAnim}
                type="button"
                onClick={() => setActive(svc)}
                onHoverStart={() => setHovered(svc.id)}
                onHoverEnd={() => setHovered(null)}
                className="group relative text-left bg-white/[0.025] rounded-xl overflow-hidden cursor-pointer transition-colors duration-200 hover:bg-white/[0.05] border"
                style={{
                  borderColor: isHov
                    ? `${svc.accent}55`
                    : "rgba(255,255,255,0.07)",
                }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                  style={{ background: svc.accent }}
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: isHov ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />

                {/* Glow blob */}
                <motion.div
                  className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                  style={{ background: svc.accent }}
                  animate={{ opacity: isHov ? 0.1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative px-5 py-4 flex items-start gap-3">
                  {/* Icon */}
                  <motion.span
                    className="text-xl mt-0.5 select-none shrink-0"
                    style={{ color: svc.accent }}
                    animate={{ scale: isHov ? 1.25 : 1, rotate: isHov ? 8 : 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    {svc.icon}
                  </motion.span>

                  {/* Text — left-aligned */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {svc.title}
                    </h3>
                    <p className="text-white/45 text-xs mt-0.5 leading-snug text-left">
                      {svc.tagline}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.span
                    className="shrink-0 self-center text-xs"
                    style={{ color: svc.accent }}
                    animate={{ opacity: isHov ? 1 : 0, x: isHov ? 0 : -6 }}
                    transition={{ duration: 0.16 }}
                  >
                    →
                  </motion.span>
                </div>

                {/* Bottom sweep bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
                  style={{
                    background: `linear-gradient(to right, ${svc.accent}, transparent)`,
                  }}
                  animate={{ width: isHov ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.button>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-white/25 text-xs mt-8 tracking-wide"
        >
          Click any service to explore
        </motion.p>
      </div>

      {/* ── Service Detail Modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              key="panel"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              style={{ "--accent": active.accent } as React.CSSProperties}
            >
              {/* Accent strip */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[var(--accent)] to-transparent" />

              <div className="p-7">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition text-lg leading-none"
                >
                  ✕
                </button>

                {/* Icon + title — left aligned */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-3xl mt-0.5 text-[var(--accent)]">
                    {active.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {active.title}
                    </h3>
                    <p className="text-xs mt-0.5 text-[var(--accent)]">
                      {active.tagline}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/8 mb-5" />

                {/* Description — left aligned */}
                <p className="text-white/65 text-sm leading-relaxed mb-5 text-left">
                  {active.description}
                </p>

                {/* Features — div-based to avoid ul/li linter issues with motion */}
                <div className="space-y-2 mb-7">
                  {active.features.map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.07 + i * 0.05 }}
                      className="flex items-center gap-2.5 text-sm text-white/75 text-left"
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: active.accent }}
                      />
                      {f}
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <Link
                    href={dest(active.href)}
                    onClick={() => setActive(null)}
                    className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ background: active.accent }}
                  >
                    {active.cta}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Account Types Modal ── */}
      <AnimatePresence>
        {showAccountTypes && (
          <motion.div
            key="at-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={() => setShowAccountTypes(false)}
          >
            <motion.div
              key="at-panel"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-[#C12129] to-transparent" />

              <div className="p-7">
                <button
                  type="button"
                  onClick={() => setShowAccountTypes(false)}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition text-lg leading-none"
                >
                  ✕
                </button>

                <p className="text-[#C12129] text-[10px] tracking-[0.35em] uppercase font-bold mb-1">
                  Choose Your Path
                </p>
                <h3 className="text-lg font-bold text-white mb-1">Account Types</h3>
                <p className="text-white/50 text-xs mb-6">
                  Each account type unlocks a different set of tools, dashboards, and capabilities.
                </p>

                <div className="h-px bg-white/8 mb-5" />

                <div className="space-y-3 mb-6">
                  {[
                    { type: "Client",     icon: "▣", iconCls: "text-[#C12129]",  barCls: "bg-[#C12129]",  glowCls: "bg-[#C12129]",  sweepCls: "from-[#C12129]",  hoverBorderCls: "border-[#C12129]/50",  badge: "",               badgeCls: "",                                desc: "Post projects, browse vetted consultants, manage delivery, and track milestones with escrow-backed payments." },
                    { type: "Freelancer", icon: "◈", iconCls: "text-blue-400",   barCls: "bg-blue-500",   glowCls: "bg-blue-500",   sweepCls: "from-blue-500",   hoverBorderCls: "border-blue-500/50",   badge: "",               badgeCls: "",                                desc: "Build your consultant profile, get AI-matched to projects, deliver work inside the platform, and build your reputation." },
                    { type: "Enterprise", icon: "⬡", iconCls: "text-violet-400", barCls: "bg-violet-500", glowCls: "bg-violet-500", sweepCls: "from-violet-500", hoverBorderCls: "border-violet-500/50", badge: "New",            badgeCls: "bg-violet-500/20 text-violet-400", desc: "Manage multiple projects, build internal teams, access advanced dashboards, and integrate with your existing systems." },
                    { type: "Concierge",  icon: "✦", iconCls: "text-amber-400",  barCls: "bg-amber-500",  glowCls: "bg-amber-500",  sweepCls: "from-amber-500",  hoverBorderCls: "border-amber-500/50",  badge: "Admin Approval", badgeCls: "bg-amber-500/20 text-amber-400",   desc: "High-touch, white-glove service for government agencies, UN bodies, large NGOs, and corporations. Dedicated project managers included." },
                  ].map((item, i) => {
                    const isAtHov = hoveredAccountType === item.type;
                    return (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0, y: isAtHov ? -3 : 0 }}
                        transition={{ delay: 0.06 + i * 0.07, y: { type: "spring", stiffness: 280, damping: 20 } }}
                        onHoverStart={() => setHoveredAccountType(item.type)}
                        onHoverEnd={() => setHoveredAccountType(null)}
                        className={`relative flex items-start gap-3 bg-white/[0.025] border rounded-xl px-4 py-4 overflow-hidden cursor-pointer transition-colors duration-200 hover:bg-white/[0.05] ${isAtHov ? item.hoverBorderCls : "border-white/8"}`}
                      >
                        {/* Left accent bar */}
                        <motion.div
                          className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl ${item.barCls}`}
                          initial={{ scaleY: 0, originY: 0 }}
                          animate={{ scaleY: isAtHov ? 1 : 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />

                        {/* Glow blob */}
                        <motion.div
                          className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none ${item.glowCls}`}
                          animate={{ opacity: isAtHov ? 0.12 : 0 }}
                          transition={{ duration: 0.28 }}
                        />

                        {/* Bottom sweep */}
                        <motion.div
                          className={`absolute bottom-0 left-0 h-[2px] rounded-b-xl bg-gradient-to-r ${item.sweepCls} to-transparent`}
                          animate={{ width: isAtHov ? "100%" : "0%" }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />

                        {/* Icon */}
                        <motion.span
                          className={`text-xl shrink-0 mt-0.5 ${item.iconCls}`}
                          animate={{ scale: isAtHov ? 1.22 : 1, rotate: isAtHov ? 8 : 0 }}
                          transition={{ type: "spring", stiffness: 280, damping: 18 }}
                        >
                          {item.icon}
                        </motion.span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{item.type}</span>
                            {item.badge && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeCls}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-xs leading-relaxed">{item.desc}</p>

                          {/* Hover hint */}
                          <motion.span
                            className={`text-[10px] font-semibold mt-1.5 block ${item.iconCls}`}
                            animate={{ opacity: isAtHov ? 1 : 0, y: isAtHov ? 0 : 4 }}
                            transition={{ duration: 0.15 }}
                          >
                            {!loading && isAuthenticated ? `Continue as ${item.type} →` : `Sign up as ${item.type} →`}
                          </motion.span>
                        </div>

                        {/* Arrow */}
                        <motion.span
                          className={`shrink-0 self-center text-xs ${item.iconCls}`}
                          animate={{ opacity: isAtHov ? 1 : 0, x: isAtHov ? 0 : -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex gap-2.5">
                  <Link
                    href={dest("/account-type")}
                    onClick={() => setShowAccountTypes(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition"
                  >
                    {!loading && isAuthenticated ? "Manage Account" : "Get Started Free"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowAccountTypes(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortalServicesSlide;
