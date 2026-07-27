"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Landmark, TrendingUp, BarChart3, ShieldCheck, DollarSign, AlertCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GateProvider } from "@/contexts/GateContext";

const PLACEHOLDER_SIGNALS = [
  { severity: "High"   as const, title: "Cost leakage detected in Operations division",  action: "Run Cost Optimization Diagnostic" },
  { severity: "Medium" as const, title: "Forecasting accuracy below 70% target",         action: "Activate Budgeting & Forecasting Engine" },
  { severity: "Low"    as const, title: "Licensing ROI trending up — Q3 on track",       action: "No action needed" },
];

const PLACEHOLDER_BUDGET = [
  { label: "Financial Visibility Score", value: 84 },
  { label: "Budgeting Accuracy",         value: 61 },
  { label: "Governance Compliance",      value: 73 },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function FinanceDashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    revenueHealth:     0,
    marginScore:       0,
    cashFlowClarity:   0,
    enterpriseValue:   0,
  });
  const [signals, setSignals] = useState(PLACEHOLDER_SIGNALS);
  const [budget,  setBudget]  = useState(PLACEHOLDER_BUDGET);
  const [loading,  setLoading]  = useState(true);
  const [seeded,   setSeeded]   = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/finance/dashboard", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.success) return;
        setStats({
          revenueHealth:   d.data.revenueHealth,
          marginScore:     d.data.marginScore,
          cashFlowClarity: d.data.cashFlowClarity,
          enterpriseValue: d.data.enterpriseValue,
        });
        if (Array.isArray(d.data.financialSignals) && d.data.financialSignals.length > 0) setSignals(d.data.financialSignals);
        if (Array.isArray(d.data.budgetProgress)   && d.data.budgetProgress.length > 0)   setBudget(d.data.budgetProgress);
        setSeeded(d.seeded);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const fmt = (n: number) => (loading || !seeded) ? "—" : `${n}%`;

  const KPIS = [
    { icon: DollarSign, label: "Revenue Health Index",   value: fmt(stats.revenueHealth),   trend: seeded ? "Live from your data" : "Awaiting financial data" },
    { icon: TrendingUp, label: "Margin Score",           value: fmt(stats.marginScore),     trend: seeded ? "Live from your data" : "Awaiting financial data" },
    { icon: BarChart3,  label: "Cash Flow Clarity",      value: fmt(stats.cashFlowClarity), trend: seeded ? "Live from your data" : "Awaiting financial data" },
    { icon: Landmark,   label: "Enterprise Value Score", value: fmt(stats.enterpriseValue), trend: seeded ? "Live from your data" : "Awaiting financial data" },
  ];

  if (authLoading) return <main className="lamidone-section min-h-screen" />;

  return (
    <GateProvider value={{ mode: isAuthenticated ? "full" : "preview-auth" }}>
    <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID FINANCE</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Finance Dashboard</h1>
          <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
            Revenue health, margin, cash flow, and enterprise value — unified in one view.
          </p>
        </motion.div>

        {/* No-data banner */}
        {!loading && !seeded && (
          <motion.div {...fadeUp(0.04)} className="mb-8 flex items-start gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-5 py-4">
            <AlertCircle className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Financial data not yet connected</p>
              <p className="text-xs text-gray-500 dark:text-white/45 mt-0.5 leading-relaxed">
                Your financial KPIs will populate here once data is entered or synced. Signals and progress bars below show sample data for illustration.
              </p>
            </div>
          </motion.div>
        )}

        {/* KPI row */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {KPIS.map(kpi => (
            <motion.div
              key={kpi.label}
              whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.07), 0 2px 6px rgba(37,99,235,0.06)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="lamidone-card border rounded-2xl p-5 cursor-default"
            >
              <kpi.icon className="w-4 h-4 text-[#2563EB] mb-3" strokeWidth={2.2} />
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{kpi.value}</p>
              <p className="text-xs text-gray-500 dark:text-white/45">{kpi.label}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{kpi.trend}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Financial Signals */}
          <motion.div {...fadeUp(0.1)} className="lamidone-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Financial Signals</p>
            <div className="flex flex-col gap-3">
              {signals.map(item => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 3, backgroundColor: "rgba(37,99,235,0.02)" }}
                  transition={{ duration: 0.14 }}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0 rounded-lg px-1 -mx-1"
                >
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${item.severity === "High" ? "text-[#2563EB]" : item.severity === "Medium" ? "text-amber-500" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Budget Progress */}
          <motion.div {...fadeUp(0.15)} className="lamidone-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Financial Health Progress</p>
            <div className="flex flex-col gap-4">
              {budget.map(b => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-gray-700 dark:text-white/70">{b.label}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{b.value}%</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#2563EB]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* F-Series module navigation */}
        <motion.div {...fadeUp(0.2)} className="mt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">FINANCE Intelligence Modules</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[
              { title: "Financial Visibility",     href: "/f01-financial-visibility" },
              { title: "Budgeting & Forecasting",  href: "/f02-budgeting-forecasting" },
              { title: "Financial KPI Linkage Diagnostic",     href: "/f03-financial-kpi" },
              { title: "Cost Optimization",        href: "/f04-cost-optimization" },
              { title: "Enterprise Value",         href: "/f05-enterprise-value" },
              { title: "Financial Governance",     href: "/f06-financial-governance" },
              { title: "CFO Transformation",       href: "/f07-cfo-transformation" },
            ].map(m => (
              <Link
                key={m.href}
                href={m.href}
                className="group lamidone-card border rounded-xl px-4 py-3 text-xs font-semibold text-gray-700 dark:text-white/70
                           hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:-translate-y-[3px]
                           hover:shadow-[0_6px_20px_rgba(37,99,235,0.10)] active:scale-[0.97]
                           transition-all duration-200 inline-flex items-center justify-between gap-1"
              >
                {m.title}
                <ArrowUpRight className="w-3 h-3 shrink-0 opacity-40 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/finance" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] inline-flex items-center gap-1.5">
              LAMID FINANCE Portal <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/concierge" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
              Request Concierge PM
            </Link>
            <Link href="/intelligence-hub" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition-colors">
              Intelligence Hub
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
    </GateProvider>
  );
}
