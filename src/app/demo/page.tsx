"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, User, Building2, Crown, Zap, Check, ArrowRight, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

const ACCOUNTS = [
  {
    type:        "Freelancer",
    icon:        Briefcase,
    email:       "demo.freelancer@lamidone.com",
    password:    "Demo@Freelancer1",
    tagline:     "Expert consultant view.",
    description: "See the platform from a consultant's perspective — manage your profile, browse projects, and track engagements.",
    features:    ["Consultant profile", "Project matching", "Portfolio management", "Earnings overview"],
    highlight:   false,
    iconBg:      "bg-cyan-500/10 border-cyan-500/30",
    iconColor:   "text-cyan-600 dark:text-cyan-400",
    accent:      "text-cyan-600 dark:text-cyan-400",
    accentBar:   "from-cyan-500",
    checkColor:  "text-cyan-500",
    btnBorder:   "border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60",
  },
  {
    type:        "Client",
    icon:        User,
    email:       "demo.client@lamidone.com",
    password:    "Demo@Client1",
    tagline:     "The full client experience.",
    description: "Explore the client dashboard — post projects, match with experts, run diagnostics, and access all four engines.",
    features:    ["Enterprise Diagnostic", "Expert matching", "All 4 engines", "AI recommendations"],
    highlight:   true,
    iconBg:      "bg-blue-500/10 border-blue-500/30",
    iconColor:   "text-blue-600 dark:text-blue-400",
    accent:      "text-blue-600 dark:text-blue-400",
    accentBar:   "from-blue-500",
    checkColor:  "text-blue-500",
    btnBorder:   "border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60",
  },
  {
    type:        "Enterprise",
    icon:        Building2,
    email:       "demo.enterprise@lamidone.com",
    password:    "Demo@Enterprise1",
    tagline:     "30-user org simulation.",
    description: "Experience the enterprise dashboard with a simulated 30-user organisation — org management, team analytics, and SSO controls.",
    features:    ["Org dashboard (30 users)", "Team analytics", "Role management", "SSO & integrations"],
    highlight:   false,
    iconBg:      "bg-violet-500/10 border-violet-500/30",
    iconColor:   "text-violet-600 dark:text-violet-400",
    accent:      "text-violet-600 dark:text-violet-400",
    accentBar:   "from-violet-500",
    checkColor:  "text-violet-500",
    btnBorder:   "border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/60",
  },
  {
    type:        "Concierge",
    icon:        Crown,
    email:       "demo.concierge@lamidone.com",
    password:    "Demo@Concierge1",
    tagline:     "White-glove advisory view.",
    description: "See how LAMID ONE's concierge tier operates — dedicated advisory tools, client portfolio management, and premium access.",
    features:    ["Advisory console", "Client portfolio", "Premium tools", "Priority workflows"],
    highlight:   false,
    iconBg:      "bg-yellow-500/10 border-yellow-500/30",
    iconColor:   "text-yellow-600 dark:text-yellow-400",
    accent:      "text-yellow-600 dark:text-yellow-400",
    accentBar:   "from-yellow-500",
    checkColor:  "text-yellow-500",
    btnBorder:   "border-yellow-500/40 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60",
  },
  {
    type:        "Engine",
    icon:        Zap,
    email:       "demo.engine@lamidone.com",
    password:    "Demo@Engine1",
    tagline:     "Engine-only access.",
    description: "Explore CORE, GROW, and TALENT engines without a full membership — use AI insights and diagnostics with no tier required.",
    features:    ["LAMID CORE access", "LAMID GROW access", "LAMID TALENT access", "Upgrade to unlock all"],
    highlight:   false,
    iconBg:      "bg-emerald-500/10 border-emerald-500/30",
    iconColor:   "text-emerald-600 dark:text-emerald-400",
    accent:      "text-emerald-600 dark:text-emerald-400",
    accentBar:   "from-emerald-500",
    checkColor:  "text-emerald-500",
    btnBorder:   "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60",
  },
];

const cardV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.48 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } };

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1.5 shrink-0 text-gray-400 hover:text-[#2563EB] transition-colors"
      title="Copy"
    >
      {copied
        ? <CheckCheck className="w-3 h-3 text-green-500" strokeWidth={2} />
        : <Copy className="w-3 h-3" strokeWidth={2} />}
    </button>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen aivora-section">

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[560px] h-[240px] rounded-full bg-[#2563EB]/8 blur-[90px]" />
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {["M0 200 L1400 200", "M0 400 L1400 400", "M350 0 L350 600", "M900 0 L900 600"].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.4"
              strokeOpacity="0.05" strokeDasharray="6 40"
              animate={{ strokeDashoffset: [0, -100], opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 24 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.07em] border border-[#2563EB]/28 bg-[#2563EB]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="aivora-gradient-text">Live demo — no sign-up needed</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white mb-5"
          >
            Explore the ecosystem{" "}
            <span className="aivora-gradient-text">as any role.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-gray-500 dark:text-white/60 text-base leading-relaxed max-w-xl mx-auto"
          >
            Pick an account type, copy the credentials, and sign in on the{" "}
            <Link href="/signin" className="aivora-gradient-text hover:opacity-80">login page</Link>.
            Each demo gives you a real 2-hour session.
          </motion.p>
        </div>
      </section>

      {/* Account cards */}
      <section className="relative px-4 pb-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {ACCOUNTS.map((account) => {
            const Icon = account.icon;
            return (
              <motion.div
                key={account.type}
                variants={cardV}
                className={`relative flex flex-col aivora-card border rounded-2xl p-7 overflow-hidden ${
                  account.highlight
                    ? "border-[#2563EB]/50 shadow-[0_0_40px_rgba(37,99,235,0.16)]"
                    : "border-[#2563EB]/12"
                }`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${account.accentBar} to-transparent`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${account.iconBg}`}>
                  <Icon className={`w-6 h-6 ${account.iconColor}`} strokeWidth={1.75} />
                </div>

                {/* Header */}
                <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{account.type}</p>
                <p className={`text-xs font-medium mb-3 ${account.accent}`}>{account.tagline}</p>
                <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed mb-6">
                  {account.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-7 flex-1">
                  {account.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${account.checkColor}`} strokeWidth={2.5} />
                      <span className="text-xs text-gray-600 dark:text-white/60 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Credentials */}
                <div className="rounded-xl border border-[#2563EB]/12 bg-[#2563EB]/4 p-4 mb-5 space-y-2.5">
                  <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-gray-400 dark:text-white/30 mb-3">
                    Demo credentials
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-gray-500 dark:text-white/40 shrink-0">Email</span>
                    <div className="flex items-center min-w-0">
                      <span className="text-[10px] font-mono text-gray-700 dark:text-white/70 truncate">
                        {account.email}
                      </span>
                      <CopyButton value={account.email} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-gray-500 dark:text-white/40 shrink-0">Password</span>
                    <div className="flex items-center">
                      <span className="text-[10px] font-mono text-gray-700 dark:text-white/70">
                        {account.password}
                      </span>
                      <CopyButton value={account.password} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/signin"
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 border ${account.btnBorder}`}
                >
                  Sign in as {account.type}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-[11px] text-gray-400 dark:text-white/25 mt-10 max-w-lg mx-auto"
        >
          Demo sessions expire after 2 hours. Data shown is illustrative.{" "}
          <Link href="/signup" className="aivora-gradient-text hover:opacity-80">
            Create a real account →
          </Link>
        </motion.p>
      </section>

      {/* Back */}
      <div className="pb-12 text-center">
        <Link href="/ecosystem" className="inline-flex items-center gap-2 text-sm font-medium aivora-gradient-text hover:opacity-80 transition-opacity">
          ← Back to the Ecosystem
        </Link>
      </div>
    </main>
  );
}
