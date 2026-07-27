"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Clock, Gauge, Briefcase, Target, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GateProvider } from "@/contexts/GateContext";

const DEFAULT_OPPORTUNITIES = [
  { impact: "High",   title: "Digital modernization gap in Operations",     action: "Recommend phased automation roadmap" },
  { impact: "Medium", title: "Customer experience scores trailing sector",  action: "Activate CX diagnostic" },
  { impact: "Medium", title: "Market expansion signal — new region",       action: "Run market entry assessment" },
];

const DEFAULT_READINESS = [
  { label: "Digital Readiness",     value: 78 },
  { label: "Operational Readiness", value: 64 },
  { label: "Culture Readiness",     value: 70 },
  { label: "Leadership Readiness",  value: 82 },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function GrowDashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    opportunities: 34,
    turnaround: "48h",
    modernizationReadiness: 71,
    activeEngagements: 11,
  });
  const [opportunities, setOpportunities] = useState(DEFAULT_OPPORTUNITIES);
  const [readiness, setReadiness] = useState(DEFAULT_READINESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch analytics data
    fetch("/api/enterprise/analytics", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.data) {
          setStats((prev) => ({
            ...prev,
            opportunities: d.data.opportunities ?? d.data.totalProjects ?? prev.opportunities,
            modernizationReadiness: d.data.modernizationReadiness ?? d.data.readinessScore ?? prev.modernizationReadiness,
            activeEngagements: d.data.activeEngagements ?? d.data.activeProjects ?? prev.activeEngagements,
          }));
          if (Array.isArray(d.data.signals) && d.data.signals.length > 0) {
            setOpportunities(d.data.signals);
          }
          if (Array.isArray(d.data.readiness) && d.data.readiness.length > 0) {
            setReadiness(d.data.readiness);
          }
        }
      })
      .catch(() => {});

    // Also try projects endpoint for opportunity count
    fetch("/api/projects?limit=5", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.total != null) {
          setStats((prev) => ({ ...prev, opportunities: d.total ?? prev.opportunities }));
        } else if (Array.isArray(d?.data) && d.data.length > 0) {
          setStats((prev) => ({ ...prev, opportunities: d.data.length ?? prev.opportunities }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const KPIS = [
    { icon: Target,    label: "Opportunities Identified",    value: loading ? "—" : String(stats.opportunities),           trend: "+8 this quarter" },
    { icon: Clock,     label: "Avg. Diagnostic Turnaround",  value: loading ? "—" : stats.turnaround,                      trend: "Down from 5 days" },
    { icon: Gauge,     label: "Modernization Readiness",     value: loading ? "—" : `${stats.modernizationReadiness}%`,    trend: "Up 6pts this quarter" },
    { icon: Briefcase, label: "Active Advisory Engagements", value: loading ? "—" : String(stats.activeEngagements),       trend: "Across 4 sectors" },
  ];

  if (authLoading) return <main className="lamidone-section min-h-screen" />;

  return (
    <GateProvider value={{ mode: isAuthenticated ? "full" : "preview-auth" }}>
    <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID GROW</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Growth Dashboard</h1>
          <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
            Opportunities, diagnostics, and modernization readiness — at a glance.
          </p>
        </motion.div>

        {/* KPI row */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {KPIS.map((kpi) => (
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

          {/* Opportunity signals */}
          <motion.div {...fadeUp(0.1)} className="lamidone-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Opportunity Signals</p>
            <div className="flex flex-col gap-3">
              {opportunities.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 3, backgroundColor: "rgba(37,99,235,0.02)" }}
                  transition={{ duration: 0.14 }}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0 rounded-lg px-1 -mx-1"
                >
                  <TrendingUp className={`w-4 h-4 mt-0.5 shrink-0 ${item.impact === "High" ? "text-[#2563EB]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Modernization readiness */}
          <motion.div {...fadeUp(0.15)} className="lamidone-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Modernization Readiness</p>
            <div className="flex flex-col gap-4">
              {readiness.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-gray-700 dark:text-white/70">{r.label}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{r.value}%</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#2563EB]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sub-module navigation */}
        <motion.div {...fadeUp(0.2)} className="mt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">GROW Intelligence Modules</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[
              { title: "Opportunity Signals",    href: "/grow-opportunity-signals" },
              { title: "Growth Pathways",        href: "/grow-pathways" },
              { title: "Modernisation Readiness",href: "/grow-modernisation" },
              { title: "Market Intelligence",    href: "/grow-market-intelligence" },
              { title: "Digital Maturity Model", href: "/grow-digital-maturity" },
              { title: "Growth Planner",         href: "/grow-planner" },
              { title: "Advisory Console",       href: "/grow-advisory-console" },
              { title: "Executive Report",       href: "/grow-executive-report" },
            ].map((m) => (
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
            <Link href="/premium/business-diagnostic" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] inline-flex items-center gap-1.5">
              Run a Diagnostic <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/biz" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
              Back to LAMID GROW
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
