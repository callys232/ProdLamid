"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── Currency options ── */
const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar"         },
  { code: "GBP", symbol: "£",  label: "British Pound"     },
  { code: "EUR", symbol: "€",  label: "Euro"              },
  { code: "NGN", symbol: "₦",  label: "Nigerian Naira"    },
  { code: "GHS", symbol: "₵",  label: "Ghanaian Cedi"     },
  { code: "KES", symbol: "KSh",label: "Kenyan Shilling"   },
  { code: "ZAR", symbol: "R",  label: "South African Rand"},
  { code: "CAD", symbol: "CA$",label: "Canadian Dollar"   },
  { code: "AED", symbol: "AED",label: "UAE Dirham"        },
];

/* ── Plans ── */
const PLANS = [
  {
    name:    "Starter",
    for:     "For small teams getting started",
    monthly: 49,
    annual:  39,
    cta:     "Get Started",
    href:    "/signup",
    highlight: false,
    features: [
      "Up to 3 expert matches/month",
      "Basic analytics dashboard",
      "Email support",
      "5 learning paths",
    ],
  },
  {
    name:    "Growth",
    for:     "For scaling organizations",
    monthly: 149,
    annual:  119,
    cta:     "Start Free Trial",
    href:    "/signup",
    highlight: true,
    features: [
      "Unlimited expert matches",
      "Full BIZ Portal access",
      "AI-generated reports",
      "Priority support",
      "Unlimited learning paths",
    ],
  },
  {
    name:    "Enterprise",
    for:     "For large organizations",
    monthly: null,
    annual:  null,
    cta:     "Contact Sales",
    href:    "/contact",
    highlight: false,
    features: [
      "Everything in Growth",
      "SSO & custom integrations",
      "Dedicated success manager",
      "SLA & compliance guarantees",
      "White-label options",
    ],
  },
];

/* ── FAQ ── */
const FAQ = [
  {
    q: "How does the AI matching actually work?",
    a: "Our proprietary AI engine analyzes over 40 factors including your industry, challenge type, budget, timeline, and preferred working style. It presents the top 3–5 matches — typically in under 2 minutes.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. All plans can be cancelled anytime with no penalties. Monthly plans end at the current billing cycle. Annual plans are prorated for unused months.",
  },
  {
    q: "What industries do your experts cover?",
    a: "Our network spans 30+ industries — technology, financial services, healthcare, energy, manufacturing, government, and non-profit. If you have a niche need, our AI will find the closest match.",
  },
  {
    q: "Is my data secure on LAMID ONE?",
    a: "Absolutely. LAMID ONE is SOC 2 Type II compliant with end-to-end encryption, enterprise SSO, and role-based access controls. We never share your data with third parties.",
  },
  {
    q: "What is the difference between the Marketplace and BIZ Portal?",
    a: "The Marketplace is where you find and engage experts for specific projects. The BIZ Portal is your ongoing intelligence command center — dashboards, analytics, governance tools, and team collaboration.",
  },
];

export default function PricingPage() {
  const [annual,   setAnnual]   = useState(false);
  const [open,     setOpen]     = useState<number | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [rates,    setRates]    = useState<Record<string, number>>({});
  const [rateLoad, setRateLoad] = useState(false);

  const savings = Math.round((1 - 119 / 149) * 100);

  /* Fetch exchange rates once */
  useEffect(() => {
    setRateLoad(true);
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then(r => r.json())
      .then(d => { if (d.rates) setRates(d.rates); })
      .catch(() => {})
      .finally(() => setRateLoad(false));
  }, []);

  const cur      = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const rate     = rates[currency] ?? 1;
  const convert  = (usd: number) => {
    const val = usd * rate;
    return val >= 1000 ? val.toLocaleString("en", { maximumFractionDigits: 0 }) : val.toFixed(0);
  };

  return (
    <main className="aivora-section min-h-screen pt-28 pb-24 px-4">

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto mb-14">
        <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Pricing</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-8">
          Start free, scale as you grow. No hidden fees, no surprises.
        </p>

        {/* Currency + toggle row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Currency selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              aria-label="Currency"
              className="aivora-card border rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 dark:text-white/80 appearance-none cursor-pointer focus:outline-none focus:border-[#C12129]/50 transition-colors"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.label}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none text-xs">▾</span>
          </div>

          {/* Monthly / Annual toggle */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl aivora-card border">
            <button type="button" onClick={() => setAnnual(false)}
              className={`text-sm font-semibold cursor-pointer transition-colors ${!annual ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/35"}`}>
              Monthly
            </button>
            <button type="button" onClick={() => setAnnual(v => !v)}
              aria-label={annual ? "Switch to monthly billing" : "Switch to annual billing"}
              className="relative w-10 h-5 rounded-full border border-[#C12129]/30 bg-[#C12129]/10 cursor-pointer flex items-center"
            >
              <motion.span className="absolute w-3.5 h-3.5 rounded-full bg-[#C12129] shadow-[0_0_6px_rgba(193,33,41,0.5)]"
                animate={{ left: annual ? "calc(100% - 1.1rem)" : "0.15rem" }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
              />
            </button>
            <button type="button" onClick={() => setAnnual(true)}
              className={`text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${annual ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/35"}`}>
              Annual
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#C12129]/12 border border-[#C12129]/25 aivora-gradient-text">
                Save {savings}%
              </span>
            </button>
          </div>
        </div>

        {rateLoad && <p className="text-[10px] aivora-text-muted mt-2">Loading exchange rates…</p>}
      </motion.div>

      {/* ── Plan cards ── */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 mb-20">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className={`relative flex flex-col rounded-2xl border p-7 aivora-card
              ${plan.highlight
                ? "border-[#C12129]/40 shadow-[0_0_40px_rgba(193,33,41,0.12)]"
                : "border-gray-200 dark:border-white/8"}`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#C12129] to-red-400" />
            )}

            {/* Name */}
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">{plan.name}</h2>
              <p className="text-xs text-gray-500 dark:text-white/40">{plan.for}</p>
            </div>

            {/* Price */}
            <div className="mb-6">
              {plan.monthly != null ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold aivora-gradient-text">
                      {cur.symbol}{convert(annual ? plan.annual! : plan.monthly)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/30">/month</span>
                  </div>
                  {annual && (
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">
                      Billed annually — save {cur.symbol}{convert((plan.monthly - plan.annual!) * 12)}/yr
                    </p>
                  )}
                </>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">Custom</span>
              )}
            </div>

            {/* CTA — before features (item 9) */}
            <Link href={plan.href}
              className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer mb-7
                ${plan.highlight
                  ? "bg-[#C12129] text-white hover:bg-[#a01a20] shadow-[0_0_14px_rgba(193,33,41,0.4)]"
                  : "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 hover:border-[#C12129]/40 hover:text-[#C12129]"}`}>
              {plan.cta}
            </Link>

            {/* Features — packed below CTA */}
            <ul className="flex flex-col gap-2 border-t border-gray-100 dark:border-white/6 pt-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-500 dark:text-white/50">
                  <span className="aivora-gradient-text shrink-0 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-2xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Frequently Asked Questions
        </motion.h2>

        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
              className={`aivora-card border rounded-2xl overflow-hidden transition-all duration-200
                ${open === i ? "border-[#C12129]/30" : "border-gray-200 dark:border-white/8"}`}
            >
              <button type="button" onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer">
                <span className={`text-sm font-semibold transition-colors ${open === i ? "aivora-gradient-text" : "text-gray-800 dark:text-white"}`}>
                  {item.q}
                </span>
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}
                  className="text-gray-400 dark:text-white/30 shrink-0 text-sm">
                  ↓
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                    <p className="px-6 pb-5 text-sm text-gray-500 dark:text-white/50 leading-relaxed border-t border-gray-100 dark:border-white/6 pt-4">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  );
}
