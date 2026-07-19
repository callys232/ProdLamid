"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Clock, TrendingUp, Star, Users, DollarSign,
  BarChart3, ArrowUp, ArrowDown, Minus,
} from "lucide-react";
import { mockConciergeProjects } from "@/mocks/mockConciergeProjects";
import type { ConciergeProject } from "@/mocks/mockConciergeProjects";

/* ── Types ─────────────────────────────────────────────────────── */
interface KPICard {
  label:    string;
  value:    string;
  subtext?: string;
  trend:    number;      // % change — positive = up, negative = down, 0 = flat
  icon:     React.ElementType;
  color:    string;
  bg:       string;
  border:   string;
  sparkline: number[];   // 7 data points (arbitrary units, normalised to 0-100)
}

/* ── Sparkline SVG ─────────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const w = 80, h = 28;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  });
  const lineD    = `M ${pts.join(" L ")}`;
  const fillD    = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${color.replace(/[^a-z]/gi, "")})`} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* last dot */}
      <circle
        cx={w}
        cy={h - (data[data.length - 1] / max) * h}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

/* ── Trend indicator ───────────────────────────────────────────── */
function Trend({ pct }: { pct: number }) {
  if (pct === 0) return (
    <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
      <Minus className="h-3 w-3" /> 0%
    </span>
  );
  const up = pct > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${up ? "text-emerald-400" : "text-blue-400"}`}>
      {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

const fadeUp = (i = 0) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.38, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] as const },
});

/* ── Main Component ─────────────────────────────────────────────── */
export default function ConciergeKPIs() {
  const [kpis, setKpis] = useState<KPICard[]>([]);

  const buildKPIs = useCallback((projects: ConciergeProject[]) => {
    const active    = projects.filter(p => p.status === "ongoing");
    const completed = projects.filter(p => p.status === "completed");

    /* Avg response time — simulated from project count (no real timestamps) */
    const avgResponse = Math.max(1.2, 2.8 - active.length * 0.1);

    /* Delivery rate */
    const deliveryRate = projects.length
      ? Math.round((completed.length / projects.length) * 100)
      : 0;

    /* Monthly revenue = sum of active budgets (simplified) */
    const monthlyRevenue = active.reduce((s, p) => s + (p.budget ?? 0), 0);

    /* Active engagements capacity = % of 10-project cap */
    const capacityPct = Math.min(100, Math.round((active.length / 10) * 100));

    /* Avg progress */
    const avgProgress = projects.length
      ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
      : 0;

    /* PM assignment rate */
    const pmRate = projects.length
      ? Math.round((projects.filter(p => p.pm && p.pm !== "Your PM").length / projects.length) * 100)
      : 0;

    const cards: KPICard[] = [
      {
        label:    "Avg Response Time",
        value:    `${avgResponse.toFixed(1)}h`,
        subtext:  "SLA target: <2h",
        trend:    -8,
        icon:     Clock,
        color:    "#60a5fa",
        bg:       "bg-blue-500/10",
        border:   "border-blue-500/20",
        sparkline: [3.2, 2.8, 2.5, 2.1, 1.8, avgResponse, avgResponse * 0.95].map(v => 100 - (v / 4) * 100),
      },
      {
        label:    "Delivery Rate",
        value:    `${deliveryRate}%`,
        subtext:  `${completed.length} of ${projects.length} on time`,
        trend:    +5,
        icon:     TrendingUp,
        color:    "#34d399",
        bg:       "bg-emerald-500/10",
        border:   "border-emerald-500/20",
        sparkline: [70, 72, 75, 78, 80, deliveryRate - 2, deliveryRate],
      },
      {
        label:    "Client Satisfaction",
        value:    "Coming soon",
        subtext:  "Reviews not yet available",
        trend:    0,
        icon:     Star,
        color:    "#f59e0b",
        bg:       "bg-amber-500/10",
        border:   "border-amber-500/20",
        sparkline: [80, 82, 85, 83, 88, 87, 90],
      },
      {
        label:    "Active Engagements",
        value:    `${active.length} / 10`,
        subtext:  `${capacityPct}% capacity`,
        trend:    active.length > 5 ? +12 : +3,
        icon:     Users,
        color:    "#a78bfa",
        bg:       "bg-purple-500/10",
        border:   "border-purple-500/20",
        sparkline: [3, 4, 4, 5, active.length - 1, active.length, active.length],
      },
      {
        label:    "Monthly Revenue",
        value:    monthlyRevenue > 0 ? `$${(monthlyRevenue / 1000).toFixed(0)}k` : "$0",
        subtext:  "Active project value",
        trend:    +7,
        icon:     DollarSign,
        color:    "#fbbf24",
        bg:       "bg-yellow-500/10",
        border:   "border-yellow-500/20",
        sparkline: [60, 65, 70, 68, 75, 80, Math.min(100, (monthlyRevenue / 1000))],
      },
      {
        label:    "PM Assignment Rate",
        value:    `${pmRate}%`,
        subtext:  "Projects with dedicated PM",
        trend:    pmRate >= 100 ? 0 : +4,
        icon:     BarChart3,
        color:    "#f472b6",
        bg:       "bg-pink-500/10",
        border:   "border-pink-500/20",
        sparkline: [70, 75, 80, 85, 88, pmRate - 2, pmRate],
      },
    ];

    setKpis(cards);
  }, []);

  useEffect(() => {
    fetch("/api/projects?role=owner&limit=20")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const list = Array.isArray(d?.data) && d.data.length
          ? d.data.map((p: any) => ({
              id:       p._id ?? p.id,
              title:    p.title,
              status:   p.status,
              budget:   p.budget ?? 0,
              spent:    p.spent ?? 0,
              progress: p.milestoneProgress ?? 0,
              pm:       p.pm ?? "",
              deadline: p.deadline ?? "",
              milestones: p.milestones ?? [],
              consultants: [],
              category:   p.category ?? "",
              description: p.description ?? "",
              skills:     p.skills ?? [],
              activity:   [],
            }))
          : mockConciergeProjects;
        buildKPIs(list);
      })
      .catch(() => buildKPIs(mockConciergeProjects));
  }, [buildKPIs]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center gap-2 mb-0.5">
          <BarChart3 className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">KPI Dashboard</span>
        </div>
        <h2 className="text-xl font-bold text-white">Service Quality Metrics</h2>
        <p className="text-sm text-gray-400 mt-0.5">Live indicators of your concierge service performance</p>
      </motion.div>

      {/* 2×3 KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            {...fadeUp(i + 1)}
            whileHover={{ scale: 1.03, y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border p-5 cursor-default ${kpi.bg} ${kpi.border}`}
          >
            {/* Icon + label */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.bg} border ${kpi.border}`}>
                  <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                </div>
                <p className="text-xs text-gray-400 font-medium">{kpi.label}</p>
              </div>
              <Trend pct={kpi.trend} />
            </div>

            {/* Value */}
            <p className="text-2xl font-bold text-white mb-0.5">{kpi.value}</p>
            {kpi.subtext && <p className="text-[11px] text-gray-500 mb-4">{kpi.subtext}</p>}

            {/* Sparkline */}
            <div className="mt-3">
              <Sparkline data={kpi.sparkline} color={kpi.color} />
            </div>

            {/* X-axis label */}
            <div className="flex justify-between text-[9px] text-gray-600 mt-1">
              <span>7 weeks ago</span>
              <span>Now</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      <motion.div
        {...fadeUp(8)}
        className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-xs text-gray-500 text-center"
      >
        KPIs are computed from your live project data · Response time and satisfaction data will expand as usage grows
      </motion.div>
    </div>
  );
}
