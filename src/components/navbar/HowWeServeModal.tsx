"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Lock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import EcosystemTag from "@/components/EcosystemTag";

/* ── Data ────────────────────────────────────────────────────── */
const PREMIUM_ACCOUNT_TYPES = ["Enterprise", "Concierge", "Admin"];

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  free:       { label: "Free",       cls: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25" },
  premium:    { label: "Premium",    cls: "text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25" },
  enterprise: { label: "Enterprise", cls: "text-violet-400 bg-violet-500/10 border border-violet-500/25" },
};

const SECTIONS = [
  {
    label: "Core Services",
    tier: "free",
    desc: "Our four pillars of enterprise transformation are Human-AI powered.",
    services: [
      {
        name: "LAMID Portal",
        desc: "One unified workspace — Marketplace, CRM, Document and Project Manager.",
        href: "/portal",
        logo: "/portalLogo.png",
        premium: false,
      },
      {
        name: "Business Innovation Zone",
        desc: "Strategies and digital systems that accelerate enterprise growth.",
        href: "/biz",
        logo: "/bizLogo.png",
        premium: false,
      },
      {
        name: "Human Capital Development",
        desc: "Talent sourcing, leadership training, and HR solutions for world-class teams.",
        href: "/hcd",
        logo: "/hcdLogo.png",
        premium: false,
      },
      {
        name: "Sustainable Development",
        desc: "Community frameworks and management solutions for long-term responsible impact.",
        href: "/sustainableDev",
        logo: "/sdLogo.png",
        premium: false,
      },
    ],
  },
  {
    label: "Digital Tools",
    tier: "premium",
    desc: "Intelligent tools powering every workflow.",
    services: [
      {
        name: "Proposal Drafter",
        desc: "AI-generated proposals with auto-drafted scopes, timelines and investment breakdowns.",
        href: "/premium/proposal-drafter",
        icon: "⚡",
        premium: true,
      },
      {
        name: "Diagnostic Tool",
        desc: "Assess your business health, identify gaps and get actionable recommendations.",
        href: "/premium/business-diagnostic",
        icon: "⚡",
        premium: true,
      },
      {
        name: "CRM Hub",
        desc: "Track leads, manage relationships and close deals with full pipeline visibility.",
        href: "/portal",
        icon: "⬡",
        premium: false,
      },
      {
        name: "DocuManager",
        desc: "Bank-level encrypted transfers, per-client access controls and a full audit trail — purpose-built for critical data.",
        href: "https://fileshare-six-phi.vercel.app/",
        icon: "⬟",
        premium: true,
        tier: "enterprise",
      },
      {
        name: "AI Preferences",
        desc: "Configure and personalise your AI assistant behaviour across the entire platform.",
        href: "/profile/settings/premium/AIPreferences",
        icon: "◈",
        premium: true,
      },
      {
        name: "Analytics Dashboard",
        desc: "Enterprise-grade performance dashboards with real-time insights and reporting.",
        href: "/services/analytics",
        icon: "▣",
        premium: true,
      },
    ],
  },
  {
    label: "Marketplace",
    tier: "free",
    desc: "Connect with the right people and projects, automate workflows with secure Cloud Workspace",
    services: [
      {
        name: "Projects Marketplace",
        desc: "Browse and post consulting projects across 20+ categories with AI-assisted matching.",
        href: "/jobs",
        icon: "▣",
        premium: false,
      },
      {
        name: "Talent Finder",
        desc: "Access 5,000+ vetted consultants and get precise matching.",
        href: "/talent",
        icon: "◈",
        premium: false,
      },
      {
        name: "Concierge Service",
        desc: "Managed delivery for time-sensitive, complex engagements — dedicated PM, custom dashboards and multi-project oversight.",
        href: "/concierge",
        icon: "✦",
        premium: true,
      },
      {
        name: "Escrow Management",
        desc: "Secure and transparent financial transaction management.",
        href: "/escrow",
        icon: "⬟",
        premium: false,
      },
      {
        name: "DocuManager",
        desc: "Bank-level encrypted transfers, per-client access controls and a full audit trail — purpose-built for critical data.",
        href: "https://fileshare-six-phi.vercel.app/",
        icon: "⬟",
        premium: true,
        tier: "enterprise",
      },
    ],
  },
  {
    label: "Enterprise",
    tier: "enterprise",
    desc: "Built for organisations operating at scale.",
    services: [
      {
        name: "Enterprise Dashboard",
        desc: "Centralised command centre for enterprise-wide performance, teams and operations.",
        href: "/enterprise",
        icon: "⬡",
        premium: true,
        tier: "enterprise",
      },
      {
        name: "Priority Support",
        desc: "Dedicated 24/7 success management and on-demand expert guidance.",
        href: "/services/integrations",
        icon: "✦",
        premium: true,
        tier: "enterprise",
      },
      {
        name: "SLA & Reliability",
        desc: "Predictive analytics, uptime guarantees and AI-enhanced delivery performance.",
        href: "/services/sla",
        icon: "◈",
        premium: true,
        tier: "enterprise",
      },
      {
        name: "Portfolio & Case Studies",
        desc: "Our track record — 40+ partners, 10,000+ workers impacted, 500+ leaders trained.",
        href: "/portfolio",
        icon: "▣",
        premium: false,
      },
    ],
  },
  {
    label: "FREE",
    tier: "free",
    desc: "Every account comes with these built-in ecosystem services.",
    benefits: true,
    services: [],
  },
];

const BENEFIT_GROUPS = [
  {
    label: "Workspace",
    color: "#3b82f6",
    items: [
      "Chat & Messaging",
      "Team Management",
      "Contract Management",
      "Booking System",
      "Event Management",
      "Notifications Hub",
      "Search & Discovery",
      "Wallet & Payments",
    ],
  },
  {
    label: "Trust & Safety",
    color: "#10b981",
    items: [
      "KYC Verification",
      "Review & Ratings",
      "Dispute Resolution",
      "Support Tickets",
    ],
  },
  {
    label: "Growth & Rewards",
    color: "#f59e0b",
    items: [
      "Points & Rewards",
      "Customer Success",
      "Ledger & Finance",
      "Subscription Management",
    ],
  },
];

const ENTERPRISE_ONLY_TYPES = ["Enterprise", "Concierge", "Admin"];

// Pages anyone can visit without an account
const PUBLIC_HREFS = ["/biz", "/hcd", "/talent", "/jobs", "/sustainableDev", "/concierge", "/pricing", "/contact"];

/* ── Auth-aware click handler ────────────────────────────────── */
function useServiceRouter() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  return (
    href: string,
    premium: boolean,
    tier: string | undefined,
    onClose: () => void,
  ) => {
    const isPublic = PUBLIC_HREFS.some((p) => href === p || href.startsWith(p + "/"));
    if (!isAuthenticated && !isPublic) {
      const redirect = href.startsWith("http") ? "/portal" : href;
      router.push(`/auth/signup?redirect=${encodeURIComponent(redirect)}`);
      onClose();
      return;
    }
    if (tier === "enterprise") {
      if (!ENTERPRISE_ONLY_TYPES.includes(user?.accountType ?? "")) {
        router.push("/pricing?plan=enterprise");
        onClose();
        return;
      }
      window.open(href, "_blank", "noopener,noreferrer");
      onClose();
      return;
    }
    if (premium && !PREMIUM_ACCOUNT_TYPES.includes(user?.accountType ?? "")) {
      router.push("/upgrade");
      onClose();
      return;
    }
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
    onClose();
  };
}

/* ── Benefits panel ─────────────────────────────────────────── */
function BenefitsPanel() {
  return (
    <div className="px-4 pb-4 space-y-6">
      {BENEFIT_GROUPS.map((group, gi) => (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: gi * 0.07,
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: group.color }}
            >
              {group.label}
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: group.color, opacity: 0.25 }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.07 + i * 0.03 }}
                whileHover={{ scale: 1.04, borderColor: `${group.color}50` }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border bg-white/[0.03] cursor-default"
                style={{ borderColor: `${group.color}20` }}
              >
                <CheckCircle2
                  className="h-3 w-3 shrink-0"
                  style={{ color: group.color }}
                />
                <span className="text-xs font-medium text-gray-300">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <p className="text-xs text-gray-600 pt-3 border-t border-white/6">
        These services are automatically included with every LAMID account —
        free, premium, and enterprise.
      </p>
    </div>
  );
}

/* ── Service row ─────────────────────────────────────────────── */
function ServiceRow({
  s,
  onGo,
  index,
}: {
  s: any;
  onGo: () => void;
  index: number;
}) {
  return (
    <motion.button
      onClick={onGo}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 300,
        damping: 26,
      }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full text-left flex items-center gap-4 py-4 px-5 rounded-xl hover:bg-white/[0.04] transition-colors duration-150 border border-transparent hover:border-white/8"
    >
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden group-hover:border-[#2563EB]/30 transition-colors duration-200">
        {s.logo ? (
          <Image
            src={s.logo}
            alt={s.name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <span className="text-lg leading-none">{s.icon}</span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-white leading-tight">
            {s.name}
          </p>
          {s.premium && (
            <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2563EB]/12 border border-[#2563EB]/25 text-[9px] font-bold text-[#2563EB] uppercase tracking-wide">
              <Lock className="h-2 w-2" />
              {s.tier === "enterprise" ? "Enterprise+" : "Premium"}
            </span>
          )}
        </div>
        <p className="text-[13px] text-gray-500 leading-relaxed truncate group-hover:text-gray-400 transition-colors duration-150">
          {s.desc}
        </p>
      </div>

      <ChevronRight className="h-3.5 w-3.5 text-white/15 group-hover:text-[#2563EB] transition-colors duration-200 shrink-0" />
    </motion.button>
  );
}

/* ── Modal ───────────────────────────────────────────────────── */
interface HowWeServeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HowWeServeModal({
  open,
  onClose,
}: HowWeServeModalProps) {
  const [active, setActive] = useState(0);
  const navigate = useServiceRouter();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const section = SECTIONS[active];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="hws-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-sm pt-[64px] px-4 pb-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] border border-white/8"
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full bg-[#2563EB]/8 blur-3xl pointer-events-none" />

            {/* ── Header ── */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/6">
              {/* Left — label */}
              <div className="flex items-center gap-2.5">
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
                  How We Serve
                </span>
              </div>

              {/* Centre — ecosystem tagline */}
              <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center justify-center py-1">
                <EcosystemTag className="!mt-0 scale-90 origin-center" />
              </div>

              {/* Right — close */}
              <motion.button
                whileHover={{
                  scale: 1.1,
                  rotate: 90,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* ── Body: left nav + right content ── */}
            <div className="relative z-10 flex min-h-[360px]">
              {/* Left — section tabs */}
              <div className="w-52 shrink-0 border-r border-white/6 p-4 flex flex-col gap-1">
                {SECTIONS.map((sec, i) => (
                  <motion.button
                    key={sec.label}
                    onClick={() => setActive(i)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full text-left px-3 py-2.5 rounded-xl transition-colors duration-150 group"
                    style={{
                      backgroundColor:
                        active === i ? "rgba(194,18,25,0.08)" : "transparent",
                    }}
                  >
                    {/* Active indicator */}
                    {active === i && (
                      <motion.span
                        layoutId="tab-indicator"
                        className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-[#2563EB]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 28,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p
                        className={`text-[13px] font-semibold leading-tight transition-colors duration-150 ${active === i ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                      >
                        {sec.label}
                      </p>
                      {(sec as any).tier && (() => {
                        const badge = TIER_BADGE[(sec as any).tier];
                        return (
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 transition-colors duration-150 ${active === i ? "text-[#2563EB]" : "text-gray-500 group-hover:text-gray-400"}`}
                    >
                      {(sec as any).benefits
                        ? `${BENEFIT_GROUPS.reduce((a, g) => a + g.items.length, 0)} benefits included`
                        : `${sec.services.length} services`}
                    </p>
                  </motion.button>
                ))}

                {/* Bottom note */}
                <div className="mt-auto pt-4 border-t border-white/6">
                  <p className="text-xs font-bold leading-snug px-3 text-transparent bg-clip-text bg-gradient-to-b from-[#2563EB] to-white">
                    Built for Africa.
                    <br />
                    Designed for the World.
                  </p>
                </div>
              </div>

              {/* Right — service list */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Section heading */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`heading-${active}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="px-4 pt-5 pb-3"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {section.label}
                      </h3>
                      {(section as any).benefits && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{section.desc}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Divider */}
                <div className="mx-4 h-px bg-white/5 mb-1" />

                {/* Services */}
                <div
                  className="flex-1 overflow-y-auto px-2 pb-4"
                  style={
                    {
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    } as React.CSSProperties
                  }
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`services-${active}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {(section as any).benefits ? (
                        <BenefitsPanel />
                      ) : (
                        section.services.map((s, i) => (
                          <ServiceRow
                            key={s.name}
                            s={s}
                            index={i}
                            onGo={() =>
                              navigate(
                                s.href,
                                s.premium,
                                (s as any).tier,
                                onClose,
                              )
                            }
                          />
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 border-t border-white/6 bg-white/[0.01]">
              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-[#2563EB]" />
                Premium &amp; Enterprise+ services require an upgraded plan.{" "}
                <Link
                  href="/upgrade"
                  onClick={onClose}
                  className="text-[#2563EB] font-semibold hover:underline underline-offset-2"
                >
                  Upgrade →
                </Link>
              </p>
              <Link
                href="/portfolio"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#2563EB] transition-colors"
              >
                View Portfolio <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
