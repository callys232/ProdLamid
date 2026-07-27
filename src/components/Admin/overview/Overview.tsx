"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw, AlertTriangle, Users, Briefcase, Gavel, Wallet, Scale, Activity,
} from "lucide-react";

/**
 * Admin overview.
 *
 * This is the first screen an administrator sees, and it used to take a
 * `client` prop that the dashboard never passed — so all six panels rendered
 * against `undefined` and the tab made no network calls at all.
 *
 * It now reads the platform-wide admin endpoints, which is what an overview of
 * the platform should have been showing in the first place.
 */

interface Analytics {
  users:    { total: number; sellers: number; clients: number };
  projects: { total: number; open: number; ongoing: number; completed: number };
  bids:     { total: number };
}

interface Finance {
  escrows: { total: number; funded: number; released: number; disputed: number; refunded: number };
  value:   { funded: number; released: number; disputed: number; refunded: number; held: number };
  wallets: number;
}

const CARD = "rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-5";
const money = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function OverviewPage() {
  const [stats, setStats]     = useState<Analytics | null>(null);
  const [finance, setFinance] = useState<Finance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [a, f] = await Promise.all([
        fetch("/api/admin/analytics", { credentials: "include", cache: "no-store" }),
        fetch("/api/admin/finance",   { credentials: "include", cache: "no-store" }),
      ]);
      if (a.status === 403 || f.status === 403) throw new Error("Administrator access required.");
      if (!a.ok || !f.ok) throw new Error("Could not load overview data.");

      setStats((await a.json())?.data ?? null);
      setFinance((await f.json())?.data ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load overview data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const TILES = [
    { label: "Members",   value: stats?.users.total ?? 0,        sub: `${stats?.users.clients ?? 0} clients · ${stats?.users.sellers ?? 0} consultants`, Icon: Users },
    { label: "Projects",  value: stats?.projects.total ?? 0,     sub: `${stats?.projects.open ?? 0} open · ${stats?.projects.ongoing ?? 0} ongoing`,     Icon: Briefcase },
    { label: "Completed", value: stats?.projects.completed ?? 0, sub: "projects delivered",                                                             Icon: Activity },
    { label: "Bids",      value: stats?.bids.total ?? 0,         sub: "submitted all time",                                                             Icon: Gavel },
    { label: "Wallets",   value: finance?.wallets ?? 0,          sub: "accounts holding a balance",                                                     Icon: Wallet },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }} className="flex flex-col gap-6 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Overview</h2>
          <p className="text-xs text-gray-500">Platform-wide activity and money position.</p>
        </div>
        <button
          type="button" onClick={load} aria-label="Refresh"
          className="rounded-lg border border-[#1f1f1f] p-2 text-gray-400 transition hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error} — nothing below is live.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {TILES.map((t) => (
          <div key={t.label} className={CARD}>
            <t.Icon className="mb-3 h-4 w-4 text-[#2563EB]" />
            <p className="text-2xl font-bold tabular-nums text-white">{t.value.toLocaleString()}</p>
            <p className="mt-1 text-[11px] font-semibold text-gray-300">{t.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-500">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Money position — disputed money is called out, not buried in a total */}
      <div className={CARD}>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Escrow position
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            { label: "Held",     amount: finance?.value.held ?? 0,     count: (finance?.escrows.funded ?? 0) + (finance?.escrows.disputed ?? 0), tone: "#E5E7EB" },
            { label: "Released", amount: finance?.value.released ?? 0, count: finance?.escrows.released ?? 0, tone: "#34D399" },
            { label: "Disputed", amount: finance?.value.disputed ?? 0, count: finance?.escrows.disputed ?? 0, tone: "#FBBF24" },
            { label: "Refunded", amount: finance?.value.refunded ?? 0, count: finance?.escrows.refunded ?? 0, tone: "#A78BFA" },
          ].map((b) => (
            <div key={b.label}>
              <p className="text-xl font-bold tabular-nums" style={{ color: b.tone }}>{money(b.amount)}</p>
              <p className="mt-1 text-[11px] text-gray-300">{b.label}</p>
              <p className="text-[10px] text-gray-500">{b.count} escrow{b.count === 1 ? "" : "s"}</p>
            </div>
          ))}
        </div>

        {(finance?.escrows.disputed ?? 0) > 0 && (
          <p className="mt-4 flex items-start gap-2 border-t border-[#141414] pt-3 text-[11px] text-yellow-300/90">
            <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {money(finance!.value.disputed)} is held in dispute and needs an outcome — see the Escrow tab.
          </p>
        )}
      </div>
    </motion.div>
  );
}
