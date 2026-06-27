"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, RefreshCw, BarChart2 } from "lucide-react";

interface AnalyticsData {
  efficiency:    number;
  progress:      number;
  workload:      number;
  profitability: number;
  bottleneck:    string | null;
  recommendation: string | null;
}

const FALLBACK: AnalyticsData = {
  efficiency:    0,
  progress:      0,
  workload:      0,
  profitability: 0,
  bottleneck:    null,
  recommendation: null,
};

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(value, 100);
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#1f1f1f] space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="bg-[#333] h-2 rounded overflow-hidden">
        <motion.div
          className="h-2 rounded"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsAgent() {
  const [data,    setData]    = useState<AnalyticsData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  async function fetchAnalytics() {
    setLoading(true);
    setError(null);
    try {
      // Try enterprise analytics first, fall back to general analytics
      const res = await fetch("/api/enterprise/analytics");
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      const d    = json?.data?.kpi ?? json?.data ?? null;

      if (d) {
        setData({
          efficiency:     Math.round((d.avgCompletionRate ?? d.completionRate ?? 0)),
          progress:       Math.round((d.avgProgress       ?? 0)),
          workload:       Math.min(Math.round(((d.activeConsultants ?? 0) / Math.max(d.teamSize ?? 1, 1)) * 100), 150),
          profitability:  Math.round(((d.totalSpent ?? 0) / Math.max(d.totalBudget ?? 1, 1)) * 100),
          bottleneck:     d.openDisputes > 0 ? `${d.openDisputes} open dispute${d.openDisputes > 1 ? "s" : ""} detected` : null,
          recommendation: d.openDisputes > 0 ? "Review and resolve open disputes to unblock milestone payments." : null,
        });
      } else {
        throw new Error("No data");
      }
    } catch {
      // Fall back to project-level analytics
      try {
        const res2 = await fetch("/api/analytics/summary");
        if (res2.ok) {
          const j = await res2.json();
          setData(j?.data ?? FALLBACK);
        } else {
          setError("Analytics data unavailable right now.");
        }
      } catch {
        setError("Could not connect to analytics service.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnalytics(); }, []);

  return (
    <div className="bg-[#010101] p-5 rounded-lg border border-[#1f1f1f] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Analytics & Recommendations</h3>
        </div>
        <button onClick={fetchAnalytics} disabled={loading}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors disabled:opacity-40">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Efficiency headline */}
      {!loading && !error && (
        <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg px-4 py-3 border border-[#1f1f1f]">
          <TrendingUp className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Overall Efficiency</p>
            <p className="text-xl font-black text-white">{data.efficiency}%</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Metric bars */}
          <div className="space-y-2">
            <MetricBar label="Milestone Progress"  value={data.progress}      color="#10b981" />
            <MetricBar label="Team Workload"        value={data.workload}      color="#3b82f6" />
            <MetricBar label="Budget Utilisation"   value={data.profitability} color="#f97316" />
          </div>

          {/* Bottleneck alert */}
          {data.bottleneck && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] p-4 rounded-lg border border-red-500/40 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <h4 className="text-xs font-semibold text-red-300">Bottleneck Detected</h4>
              </div>
              <p className="text-xs text-gray-400">{data.bottleneck}</p>
              {data.recommendation && (
                <p className="text-xs text-emerald-400 border-t border-white/8 pt-1.5">{data.recommendation}</p>
              )}
            </motion.div>
          )}

          {!data.bottleneck && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-xs text-emerald-400">No bottlenecks detected — looking good!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
