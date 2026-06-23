"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowRight, Star, Zap,
  Building2, Users, Briefcase, ShoppingCart,
  Sparkles, Bot, TrendingUp, Shield,
} from "lucide-react";
import {
  FaRobot, FaShieldAlt, FaBolt, FaUsers,
  FaChartLine, FaHeadset, FaCode, FaCheckCircle,
} from "react-icons/fa";
import dynamic from "next/dynamic";

const SubscribeButton        = dynamic(() => import("./SubscribeButton"),         { ssr: false });
const ConciergeRequestButton = dynamic(() => import("./ConciergeRequestButton"),  { ssr: false });

type BillingCycle = "monthly" | "annual";
type ConsultantPlan = "freemium" | "premium";
type ClientPlan     = "freemium" | "premium";

/* ── Points economy ─────────────────────────────────────────── */
const POINTS = {
  client_signup_free:    200,
  client_signup_premium: 800,
  consultant_signup_free:    100,
  consultant_signup_premium: 500,
  post_project:    50,
  place_bid:       20,
  boost_bid:       60,
  ai_match:        30,
  ai_diagnostic:   40,
};

/* ── Plan definitions ───────────────────────────────────────── */
const CLIENT_PLANS: Record<ClientPlan, {
  label: string; price: Record<BillingCycle, number>;
  planKey: Partial<Record<BillingCycle, string>>;
  features: string[]; tools: string[];
}> = {
  freemium: {
    label: "Freemium",
    price: { monthly: 0, annual: 0 },
    planKey: {},
    features: [
      `${POINTS.client_signup_free} bonus points on signup`,
      `Post projects — ${POINTS.post_project} pts each`,
      "Buy more points when exhausted",
      "Browse 5,000+ vetted consultants",
      "AI-assisted matching (auto)",
      "Milestone & escrow payments",
      "In-app workspace & messaging",
      "Standard support",
    ],
    tools: [],
  },
  premium: {
    label: "Premium",
    price: { monthly: 99, annual: 999 },
    planKey: { monthly: "client_premium_monthly", annual: "client_premium_annual" },
    features: [
      `${POINTS.client_signup_premium} bonus points on signup`,
      "Monthly points refill included",
      `Post projects — ${POINTS.post_project} pts each`,
      `Manual AI match trigger — ${POINTS.ai_match} pts`,
      `Business diagnostic — ${POINTS.ai_diagnostic} pts`,
      "Unlimited project postings (no cap)",
      "Priority consultant deployment",
      "Advanced analytics dashboard",
      "24/7 priority support",
    ],
    tools: [
      "Budget Estimator",
      "AI Proposal Drafter",
      "Business Diagnostic AI",
      "AI Consultant Matcher",
      "Communication AI Agent",
      "Analytics AI Agent",
    ],
  },
};

const CONSULTANT_PLANS: Record<ConsultantPlan, {
  label: string; price: Record<BillingCycle, number>;
  planKey: Partial<Record<BillingCycle, string>>;
  features: string[];
}> = {
  freemium: {
    label: "Freemium",
    price: { monthly: 0, annual: 0 },
    planKey: {},
    features: [
      `${POINTS.consultant_signup_free} bonus points on signup`,
      `Bid on projects — ${POINTS.place_bid} pts per bid`,
      "Buy more points when exhausted",
      "Public consultant profile",
      "Apply to up to 10 projects/month",
      "Basic earnings analytics",
      "In-app messaging",
      "Standard support",
    ],
  },
  premium: {
    label: "Premium",
    price: { monthly: 49, annual: 499 },
    planKey: { monthly: "consultant_premium_monthly", annual: "consultant_premium_annual" },
    features: [
      `${POINTS.consultant_signup_premium} bonus points on signup`,
      "Monthly points refill included",
      `Bid on projects — ${POINTS.place_bid} pts per bid`,
      `⚡ Boost Bid — ${POINTS.boost_bid} pts (2× visibility)`,
      "Unlimited project applications",
      "Priority placement in search results",
      "AI-assisted profile optimisation",
      "Predictive project-fit scoring",
      "Advanced earnings dashboard",
      "Early access to new projects",
      "24/7 priority support",
    ],
  },
};

/* ── Helpers ────────────────────────────────────────────────── */
const CYCLE_LABEL: Record<BillingCycle, string> = { monthly: "/mo", annual: "/yr" };

function FeatureList({ features, accent = "text-[#c12129]", tools }: {
  features: string[]; accent?: string; tools?: string[];
}) {
  return (
    <div className="mt-auto space-y-4">
      <ul className="space-y-2">
        {features.map(f => (
          <li key={f} className={`flex items-start gap-2 text-xs text-gray-400 ${f.startsWith("⚡") ? "text-yellow-300" : ""}`}>
            <CheckCircle className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${f.startsWith("⚡") ? "text-yellow-400" : accent}`} />
            {f.replace("⚡ ", "")}
          </li>
        ))}
      </ul>
      {tools && tools.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#c12129]" />AI Tools & Agents unlocked
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tools.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#c12129]/10 border border-[#c12129]/20 text-[#c12129]">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InternalToggle<T extends string>({ options, value, onChange }: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl border border-white/10 overflow-hidden mb-4 text-xs font-semibold">
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`flex-1 py-2 transition ${value === o.key ? "bg-[#c12129] text-white" : "text-gray-400 hover:text-white"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { value: "$420M+", label: "Managed through escrow" },
  { value: "5,000+", label: "Vetted consultants"     },
  { value: "98%",    label: "Client satisfaction"    },
  { value: "48hr",   label: "Avg. deployment"        },
];

const FEATURES = [
  { icon: <FaRobot />,       title: "AI-Powered Matching",    desc: "Proprietary AI matches projects with the top 1% of vetted consultants in under 60 seconds." },
  { icon: <FaShieldAlt />,   title: "Milestone Escrow",       desc: "Every payment is held in escrow and released only when you approve the deliverable." },
  { icon: <FaUsers />,       title: "Dedicated Account Team", desc: "A senior account director and coordinators assigned exclusively to your organisation." },
  { icon: <FaCode />,        title: "White-Label Platform",   desc: "Deploy a fully branded version of our platform for your internal teams." },
  { icon: <FaChartLine />,   title: "Real-Time Analytics",    desc: "Executive dashboards tracking project velocity, spend, and consultant performance." },
  { icon: <FaBolt />,        title: "Priority Deployment",    desc: "48-hour consultant deployment SLA. Emergency staffing within 6 hours." },
  { icon: <FaHeadset />,     title: "24/7 Priority Support",  desc: "Dedicated channel, phone line, and guaranteed 1-hour response time." },
  { icon: <FaCheckCircle />, title: "Compliance & Legal",     desc: "Full MSA, IP assignment, NDAs, and GDPR-compliant data handling." },
];

/* ── Main ───────────────────────────────────────────────────── */
export default function SaasPricingSection() {
  const [cycle, setCycle]               = useState<BillingCycle>("annual");
  const [clientPlan, setClientPlan]     = useState<ClientPlan>("freemium");
  const [consultPlan, setConsultPlan]   = useState<ConsultantPlan>("freemium");

  const cp  = CLIENT_PLANS[clientPlan];
  const csp = CONSULTANT_PLANS[consultPlan];

  return (
    <section className="bg-black py-24 px-4 text-white" id="pricing">

      {/* ── Header ── */}
      <div className="mx-auto max-w-5xl text-center mb-10">
        <span className="inline-block mb-4 rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c12129]">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Flexible Plans for Every Stage of Growth.
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Whether you're a growing SME or a global enterprise, AIVORA scales with you. No contracts. No surprises. Cancel anytime.
        </p>
      </div>

      {/* ── Points economy explainer ── */}
      <div className="mx-auto max-w-4xl mb-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-yellow-400" />
            <p className="text-sm font-bold text-white">How Points Work</p>
            <span className="ml-auto text-xs text-gray-500">All users start with bonus points. Purchase more any time.</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Post a Project",      cost: `${POINTS.post_project} pts`,  who: "Clients",    icon: Briefcase,  color: "text-blue-400" },
              { label: "Place a Bid",         cost: `${POINTS.place_bid} pts`,     who: "Consultants",icon: TrendingUp, color: "text-emerald-400" },
              { label: "⚡ Boost Bid",         cost: `${POINTS.boost_bid} pts`,     who: "Premium only",icon: Zap,       color: "text-yellow-400" },
              { label: "AI Diagnostic",       cost: `${POINTS.ai_diagnostic} pts`, who: "Clients",    icon: Bot,        color: "text-purple-400" },
            ].map(({ label, cost, who, icon: Icon, color }) => (
              <div key={label} className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1.5 ${color}`} />
                <p className="text-xs font-semibold text-white">{label.replace("⚡ ", "")}</p>
                <p className={`text-sm font-bold mt-1 ${color}`}>{cost}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{who}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <ShoppingCart className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            Points packages: 100 pts = ₦500 · 500 pts = ₦2,000 · 1,000 pts = ₦3,500 · 5,000 pts = ₦15,000
          </div>
        </div>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {(["monthly", "annual"] as BillingCycle[]).map(c => (
          <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setCycle(c)}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition ${
              cycle === c ? "bg-[#c12129] text-white" : "border border-white/10 text-gray-400 hover:text-white"
            }`}>
            {c === "monthly" ? "Monthly" : "Annual"}
            {c === "annual" && (
              <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white">SAVE</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── 4 Tier cards ── */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">

        {/* ── 1. CLIENT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.35 }}
          className={`relative flex flex-col rounded-2xl border p-6 transition-all h-full ${
            clientPlan === "premium"
              ? "border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-black shadow-[0_0_40px_rgba(59,130,246,0.12)]"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">Client</span>
            {clientPlan === "premium" && (
              <span className="ml-auto rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-400">AI Unlocked</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Client</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Post projects, hire consultants, manage contracts and pay securely. Premium unlocks AI tools and agents.
          </p>

          <InternalToggle
            options={[{ key: "freemium" as ClientPlan, label: "Freemium" }, { key: "premium" as ClientPlan, label: "Premium" }]}
            value={clientPlan} onChange={setClientPlan}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`client-price-${clientPlan}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="mb-1">
                <span className="text-4xl font-black text-white">
                  {cp.price[cycle] === 0 ? "Free" : `$${cp.price[cycle].toLocaleString()}`}
                </span>
                {cp.price[cycle] > 0 && <span className="ml-1 text-sm text-gray-500">{CYCLE_LABEL[cycle]}</span>}
              </div>
              {cycle === "annual" && clientPlan === "premium" && (
                <p className="text-xs text-green-400 font-semibold">Save $189/yr vs monthly</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="my-4">
            {clientPlan === "freemium" ? (
              <motion.a href="/signup" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="block rounded-xl px-4 py-2.5 text-center text-sm font-bold border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition">
                Get Started Free
              </motion.a>
            ) : cp.planKey[cycle] ? (
              <SubscribeButton plan={cp.planKey[cycle]!} label="Upgrade to Premium"
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white" />
            ) : (
              <motion.a href="/signup" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="block rounded-xl px-4 py-2.5 text-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition">
                Upgrade to Premium
              </motion.a>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`client-feat-${clientPlan}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <FeatureList features={cp.features} accent="text-blue-400" tools={cp.tools} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── 2. CONSULTANT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.35, delay: 0.07 }}
          className={`relative flex flex-col rounded-2xl border p-6 transition-all h-full ${
            consultPlan === "premium"
              ? "border-[#c12129]/50 bg-gradient-to-b from-[#c12129]/10 to-black shadow-[0_0_40px_rgba(193,33,41,0.15)]"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-[#c12129]" />
            <span className="text-xs font-semibold tracking-widest text-[#c12129] uppercase">Consultant</span>
            {consultPlan === "premium" && (
              <span className="ml-auto rounded-full border border-[#c12129]/40 bg-[#c12129]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#c12129]">Most Popular</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Consultant</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Bid on projects, build your reputation, and get paid. Premium unlocks Boost Bid and priority placement.
          </p>

          <InternalToggle
            options={[{ key: "freemium" as ConsultantPlan, label: "Freemium" }, { key: "premium" as ConsultantPlan, label: "Premium" }]}
            value={consultPlan} onChange={setConsultPlan}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`cons-price-${consultPlan}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="mb-1">
                <span className="text-4xl font-black text-white">
                  {csp.price[cycle] === 0 ? "Free" : `$${csp.price[cycle].toLocaleString()}`}
                </span>
                {csp.price[cycle] > 0 && <span className="ml-1 text-sm text-gray-500">{CYCLE_LABEL[cycle]}</span>}
              </div>
              {cycle === "annual" && consultPlan === "premium" && (
                <p className="text-xs text-green-400 font-semibold">Save $89/yr vs monthly</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="my-4">
            {consultPlan === "freemium" ? (
              <motion.a href="/signup" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="block rounded-xl px-4 py-2.5 text-center text-sm font-bold bg-[#c12129] text-white hover:bg-red-700 transition">
                Join Free
              </motion.a>
            ) : csp.planKey[cycle] ? (
              <SubscribeButton plan={csp.planKey[cycle]!} label="Upgrade to Premium"
                className="w-full justify-center bg-[#c12129] text-white hover:bg-red-700" />
            ) : (
              <motion.a href="/signup" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="block rounded-xl px-4 py-2.5 text-center text-sm font-bold bg-[#c12129] text-white hover:bg-red-700 transition">
                Upgrade to Premium
              </motion.a>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`cons-feat-${consultPlan}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <FeatureList features={csp.features} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── 3. ENTERPRISE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.35, delay: 0.14 }}
          className="relative flex flex-col rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 transition-all h-full"
        >
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-purple-400" />
            <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Enterprise</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Multi-seat workspace with team-wide shared points pool, dedicated account management, and full escrow controls.
          </p>
          <div className="mb-1">
            <span className="text-4xl font-black text-white">{cycle === "monthly" ? "$18,500" : "$200,000"}</span>
            <span className="ml-1 text-sm text-gray-500">{CYCLE_LABEL[cycle]}</span>
          </div>
          <p className="text-xs text-green-400 font-semibold mb-5">
            {cycle === "annual" ? "Save $22,000 vs monthly" : "Switch to annual — save $22,000"}
          </p>
          <motion.a href="/contact-sales" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="mb-6 block rounded-xl px-4 py-2.5 text-center text-sm font-bold border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition">
            Book a Discovery Call
          </motion.a>
          <FeatureList accent="text-purple-400" features={[
            "2,000 shared team points on signup",
            "Monthly team points refill",
            "Post unlimited projects",
            "All Premium Client AI tools",
            "Up to 50 team members",
            "Up to 12 simultaneous projects",
            "Dedicated account director",
            "Custom contracts & legal templates",
            "Executive reporting dashboard",
            "99.9% uptime SLA",
          ]} />
        </motion.div>

        {/* ── 4. CONCIERGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.35, delay: 0.21 }}
          className="relative flex flex-col rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 transition-all h-full"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-xs font-semibold tracking-widest text-yellow-400 uppercase">Concierge</span>
            <span className="ml-auto rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-yellow-400">Approval Required</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Concierge</h3>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Dedicated delivery management for organisations running complex, high-value engagements. Reviewed and activated by our team.
          </p>
          <div className="mb-1">
            <span className="text-4xl font-black text-white">Custom</span>
          </div>
          <p className="text-xs text-gray-500 mb-5">No payment until approved · Bespoke contract</p>
          <div className="mb-6">
            <ConciergeRequestButton label="Request Access"
              className="w-full justify-center border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10" />
          </div>
          <FeatureList accent="text-yellow-400" features={[
            "5,000 points on approval",
            "Points never expire",
            "Everything in Enterprise",
            "Dedicated project manager assigned",
            "AI + human-curated matching",
            "Custom impact & KPI dashboards",
            "24/7 support — 2hr SLA",
            "Multi-project executive oversight",
            "White-label portal option",
            "Quarterly strategy reviews",
          ]} />
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <div className="mx-auto max-w-5xl mt-20 mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center hover:border-[#c12129]/20 transition">
            <p className="text-2xl font-bold text-[#c12129]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Feature highlights ── */}
      <div className="mx-auto max-w-5xl">
        <h3 className="text-center text-2xl font-bold mb-3">Built for teams that move fast</h3>
        <p className="text-center text-sm text-gray-500 mb-10">Available on Enterprise & Concierge</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -3, borderColor: "rgba(193,33,41,0.4)" }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-[#c12129]/5">
              <div className="mb-3 text-[#c12129] text-xl">{f.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1.5">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mx-auto max-w-2xl text-center mt-20">
        <p className="text-gray-400 text-sm mb-6">
          Trusted by government agencies, Fortune 500 divisions, NGOs, and high-growth startups across 24 countries.
        </p>
        <motion.a href="/contact-sales" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#c12129] hover:bg-red-700 px-10 py-4 text-base font-bold text-white transition-all">
          Talk to Sales <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
