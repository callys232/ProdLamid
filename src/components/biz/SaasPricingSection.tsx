"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight, Lock } from "lucide-react";
import {
  FaRobot, FaShieldAlt, FaBolt, FaUsers,
  FaChartLine, FaHeadset, FaCode, FaCheckCircle,
} from "react-icons/fa";

// ─── Tier definitions ────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "quarterly" | "annual";

interface Tier {
  key:        string;
  name:       string;
  badge?:     string;
  badgeStyle?: string;
  prices: Record<BillingCycle, number | "custom" | 0>;
  savings: Partial<Record<BillingCycle, string>>;
  description: string;
  cta:        string;
  ctaHref:    string;
  ctaStyle:   string;
  highlight:  boolean;
  features:   string[];
  planKey:    Partial<Record<BillingCycle, string>>; // maps to /api/subscription/create plan keys
}

const TIERS: Tier[] = [
  {
    key:         "free",
    name:        "Starter",
    prices:      { monthly: 0, quarterly: 0, annual: 0 },
    savings:     {},
    planKey:     {},
    description: "Everything you need to get started on the platform.",
    cta:         "Get Started Free",
    ctaHref:     "/signup",
    ctaStyle:    "border border-white/10 text-gray-300 hover:border-white/20 hover:text-white",
    highlight:   false,
    features: [
      "Post up to 3 projects",
      "Browse consultant marketplace",
      "Basic milestone & escrow",
      "In-app messaging",
      "Standard support",
      "Access to 20 categories",
    ],
  },
  {
    key:         "premium",
    name:        "Premium",
    badge:       "Popular",
    badgeStyle:  "border-[#2563EB]/40 bg-[#2563EB]/10 text-[#2563EB]",
    // Monthly $49 · Quarterly $129 (~$43/mo) · Annual $499 (~$41.60/mo)
    prices:      { monthly: 49, quarterly: 129, annual: 499 },
    savings:     { quarterly: "Save $18 vs monthly", annual: "Save $89/yr" },
    planKey:     { monthly: "premium_monthly", quarterly: "premium_quarterly", annual: "premium_annual" },
    description: "Advanced AI tools, priority support, and deeper analytics for power users.",
    cta:         "Upgrade to Premium",
    ctaHref:     "/premium",
    ctaStyle:    "bg-[#2563EB] text-white hover:bg-blue-700 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]",
    highlight:   true,
    features: [
      "Everything in Starter",
      "Unlimited project postings",
      "AI-assisted project & consultant matching",
      "Advanced analytics dashboard",
      "AI preferences & tone settings",
      "Priority 48hr consultant deployment",
      "24/7 priority support",
      "Early access to new features",
    ],
  },
  {
    key:         "enterprise",
    name:        "Enterprise",
    // Monthly $18,500 · Quarterly $52,500 (~$17,500/mo) · Annual $200,000 (~$16,667/mo)
    prices:      { monthly: 18500, quarterly: 52500, annual: 200000 },
    savings:     { quarterly: "Save $3,000 vs monthly", annual: "Save $22,000" },
    planKey:     { monthly: "enterprise_monthly", quarterly: "enterprise_quarterly", annual: "enterprise_annual" },
    description: "Multi-seat workspace for organisations with dedicated account management.",
    cta:         "Book a Discovery Call",
    ctaHref:     "/contact-sales",
    ctaStyle:    "bg-white text-black hover:bg-gray-100",
    highlight:   false,
    features: [
      "Everything in Premium",
      "Up to 50 team members",
      "Up to 12 simultaneous active projects",
      "Dedicated account director",
      "Milestone escrow management",
      "Custom contract & legal templates (MSA, NDA, IP)",
      "Executive reporting dashboard",
      "Dedicated Slack workspace",
      "Paystack payment integration",
      "99.9% uptime SLA",
    ],
  },
  {
    key:         "enterprise_plus",
    name:        "Enterprise+",
    badge:       "Custom",
    badgeStyle:  "border-purple-500/40 bg-purple-500/10 text-purple-400",
    prices:      { monthly: "custom", quarterly: "custom", annual: "custom" },
    savings:     {},
    planKey:     {},
    description: "Unlimited scale, white-label portal, and full-service account team.",
    cta:         "Talk to Sales",
    ctaHref:     "/contact-sales",
    ctaStyle:    "border border-purple-500/40 text-purple-300 hover:bg-purple-500/10",
    highlight:   false,
    features: [
      "Everything in Enterprise",
      "100+ team members (custom scaling)",
      "Unlimited active projects",
      "White-label portal",
      "Emergency 6hr staffing SLA",
      "Custom API integrations",
      "Quarterly strategy reviews",
      "Dedicated project coordinators",
      "GDPR-compliant data handling",
    ],
  },
];

// ─── Platform stats ──────────────────────────────────────────────────────────

const STATS = [
  { value: "$420M+",  label: "Managed through escrow" },
  { value: "5,000+",  label: "Vetted consultants"      },
  { value: "98%",     label: "Client satisfaction"     },
  { value: "48hr",    label: "Avg. consultant deployment" },
];

// ─── Enterprise feature highlights ──────────────────────────────────────────

const FEATURES = [
  { icon: <FaRobot />,     title: "AI-Assisted Matching",     desc: "Proprietary AI matches your project with the top 1% of 5,000+ vetted consultants in under 60 seconds." },
  { icon: <FaShieldAlt />, title: "Milestone Escrow",        desc: "Every payment is held in escrow and released only when you approve the deliverable." },
  { icon: <FaUsers />,     title: "Dedicated Account Team",  desc: "A senior account director and two project coordinators assigned exclusively to your organisation." },
  { icon: <FaCode />,      title: "White-Label Platform",    desc: "Deploy a fully branded version of our platform for your internal teams (Enterprise+)." },
  { icon: <FaChartLine />, title: "Real-Time Analytics",     desc: "Executive dashboards tracking project velocity, spend, milestone completion, and consultant performance." },
  { icon: <FaBolt />,      title: "Priority Deployment",     desc: "48-hour consultant deployment SLA. Emergency staffing available within 6 hours." },
  { icon: <FaHeadset />,   title: "24/7 Priority Support",   desc: "Dedicated Slack channel, phone line, and guaranteed 1-hour response time." },
  { icon: <FaCheckCircle />, title: "Compliance & Legal",    desc: "Full MSA, IP assignment, NDAs, and GDPR-compliant data handling included." },
];

// ─── Component ───────────────────────────────────────────────────────────────

const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly:   "/mo",
  quarterly: "/qtr",
  annual:    "/yr",
};

const CYCLE_DISPLAY: Record<BillingCycle, string> = {
  monthly:   "Monthly",
  quarterly: "Quarterly",
  annual:    "Annual",
};

// Lazy-import to avoid SSR issues with the client component
import dynamic from "next/dynamic";
const SubscribeButton = dynamic(() => import("@/components/subscription/SubscribeButton"), { ssr: false });

export default function SaasPricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  function priceLabel(t: Tier) {
    const val = t.prices[cycle];
    if (val === 0)        return "Free";
    if (val === "custom") return "Custom";
    return `$${(val as number).toLocaleString()}`;
  }

  function perLabel(t: Tier) {
    const val = t.prices[cycle];
    if (val === 0 || val === "custom") return "";
    return CYCLE_LABEL[cycle];
  }

  return (
    <section className="bg-black py-24 px-4 text-white" id="pricing">

      {/* ── Header ── */}
      <div className="mx-auto max-w-5xl text-center mb-14">
        <span className="inline-block mb-4 rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Simple pricing for every stage
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Start free, scale to Premium for AI-assisted tools, or deploy a full enterprise workspace with dedicated account management.
        </p>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {(["monthly", "quarterly", "annual"] as BillingCycle[]).map(c => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCycle(c)}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition ${
              cycle === c ? "bg-[#2563EB] text-white" : "border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {CYCLE_DISPLAY[c]}
            {c === "annual" && (
              <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                BEST
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Tier cards ── */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
              t.highlight
                ? "border-[#2563EB]/50 bg-gradient-to-b from-[#2563EB]/10 to-black shadow-[0_0_40px_rgba(37,99,235,0.15)]"
                : t.key === "enterprise_plus"
                ? "border-purple-500/30 bg-white/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            {/* Badge */}
            {t.badge && (
              <span className={`mb-3 self-start rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${t.badgeStyle}`}>
                {t.badge}
              </span>
            )}

            <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">{t.description}</p>

            {/* Price */}
            <div className="mb-1">
              <span className="text-4xl font-black text-white">{priceLabel(t)}</span>
              <span className="ml-1 text-sm text-gray-500">{perLabel(t)}</span>
            </div>
            {t.savings[cycle] ? (
              <p className="mb-5 text-xs font-semibold text-green-400">{t.savings[cycle]}</p>
            ) : (
              <div className="mb-5" />
            )}

            {/* CTA — Premium uses SubscribeButton; others link */}
            {t.key === "premium" && t.planKey[cycle] ? (
              <div className="mb-6">
                <SubscribeButton plan={t.planKey[cycle]!} label={t.cta} className={`w-full justify-center ${t.ctaStyle}`} />
              </div>
            ) : (
              <motion.a
                href={t.ctaHref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`mb-6 block rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-all ${t.ctaStyle}`}
              >
                {t.cta}
              </motion.a>
            )}

            {/* Features */}
            <ul className="mt-auto space-y-2.5">
              {t.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-xs text-gray-400">
                  <CheckCircle className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                    t.key === "enterprise_plus" ? "text-purple-400" : "text-[#2563EB]"
                  }`} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ── Stats bar ── */}
      <div className="mx-auto max-w-5xl mt-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5 text-center transition hover:border-[#2563EB]/20"
            >
              <p className="text-2xl font-bold text-[#2563EB]">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Feature grid (Enterprise highlights) ── */}
      <div className="mx-auto max-w-5xl">
        <h3 className="text-center text-2xl font-bold mb-3">Built for teams that move fast</h3>
        <p className="text-center text-sm text-gray-500 mb-10">Available on Enterprise & Enterprise+</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -3, borderColor: "rgba(37,99,235,0.4)" }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-[#2563EB]/5"
            >
              <div className="mb-3 text-[#2563EB] text-xl">{f.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1.5">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mx-auto max-w-2xl text-center mt-20">
        <p className="text-gray-400 text-sm mb-6">
          Trusted by PE-backed companies, Fortune 500 divisions, and high-growth startups across 24 countries.
        </p>
        <motion.a
          href="/contact-sales"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-700 px-10 py-4 text-base font-bold text-white transition-all"
        >
          Talk to Enterprise Sales <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
