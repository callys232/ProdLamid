"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { History, ArrowUpRight, Loader2 } from "lucide-react";

interface UsageItem {
  _id:               string;
  moduleId:          string;
  engineName:        string;
  seriesName?:       string;
  organisationName?: string;
  href?:             string;
  runAt:             string;
}

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function ToolUsageHistory({ limit = 8 }: { limit?: number }) {
  const [items, setItems]   = useState<UsageItem[]>([]);
  const [stats, setStats]   = useState({ totalRuns: 0, uniqueTools: 0 });
  const [loading, setLoad]  = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    fetch(`/api/tools/usage?limit=${limit}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { setDenied(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then((d) => {
        if (!d) return;
        setItems(d.data ?? []);
        setStats({ totalRuns: d.totalRuns ?? 0, uniqueTools: d.uniqueTools ?? 0 });
      })
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [limit]);

  // Members only — nothing renders for visitors
  if (denied) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="lamidone-card border rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-[#2563EB]" strokeWidth={2.2} />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">
            Your Tool History
          </p>
        </div>
        {!loading && stats.totalRuns > 0 && (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{stats.totalRuns}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">runs</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{stats.uniqueTools}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">tools</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400 dark:text-white/30">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your history…
        </div>
      ) : items.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-white/45 mb-4">
            You haven&apos;t run any intelligence tools yet.
          </p>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
          >
            Browse the ecosystem <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item._id}>
              <Link
                href={item.href ?? "/ecosystem"}
                className="group flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/6 last:border-0 rounded-lg px-1 -mx-1 hover:bg-[#2563EB]/[0.03] transition-colors"
              >
                <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] shrink-0">
                  {item.moduleId}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 dark:text-white truncate group-hover:text-[#2563EB] transition-colors">
                    {item.engineName}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-white/30 truncate">
                    {item.organisationName ? `${item.organisationName} · ` : ""}
                    {item.seriesName ?? "Intelligence"}
                  </p>
                </div>

                <span className="text-[11px] text-gray-400 dark:text-white/30 shrink-0 tabular-nums">
                  {relativeTime(item.runAt)}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-white/20 opacity-0 group-hover:opacity-100 group-hover:text-[#2563EB] transition-all" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
