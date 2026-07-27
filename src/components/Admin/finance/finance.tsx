"use client";
import React, { useState, useEffect } from "react";
import Section from "./section";
import MetricCard from "./metricCard";
import FundDistributionChart from "./funddistrchat";
import EscrowBarChart from "./escrowChart";
import EscrowTable from "./escrowTable";

/**
 * Admin finance.
 *
 * This component used to assign the raw envelope — { success, data } — to state
 * and then read `finance.totalProjects`, which is undefined on it. Calling
 * .toString() on that threw, so the panel only ever rendered when the request
 * FAILED and a hardcoded fallback took over: 124 projects, $275,000 completed.
 * An administrator had no way to tell those invented figures from real ones.
 *
 * It now reads the shape /api/admin/finance actually returns, and shows nothing
 * rather than something fictional when the call fails.
 */

type StatusBucket = { count: number; total: number };

interface FinanceApi {
  escrows: { total: number; funded: number; released: number; disputed: number; refunded: number };
  value:   { funded: number; released: number; disputed: number; refunded: number; held: number };
  byStatus: Record<string, StatusBucket>;
  wallets: number;
}

interface EscrowRow {
  _id: string;
  amount: number;
  status: string;
  projectId?: string | null;
  createdAt?: string;
}

/** Maps an escrow status onto the three buckets the table renders. */
const TABLE_STATUS = (s: string): "Held" | "Released" | "Pending" =>
  s === "released" ? "Released" : s === "funded" || s === "disputed" ? "Held" : "Pending";

const money = (n: number) => `$${(n ?? 0).toLocaleString()}`;

export default function FinanceAgent() {
  const [fin, setFin]         = useState<FinanceApi | null>(null);
  const [rows, setRows]       = useState<EscrowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        /* Figures and rows come from different endpoints — /finance aggregates,
           /escrow lists. Both are admin-guarded server-side. */
        const [fRes, eRes] = await Promise.all([
          fetch("/api/admin/finance", { cache: "no-store", credentials: "include" }),
          fetch("/api/admin/escrow?status=all&limit=50", { cache: "no-store", credentials: "include" }),
        ]);
        if (!fRes.ok) throw new Error("Could not load finance data.");

        const fJson = await fRes.json();
        if (cancelled) return;

        setFin(fJson?.data ?? null);
        if (eRes.ok) {
          const eJson = await eRes.json();
          setRows(Array.isArray(eJson?.escrows) ? eJson.escrows : []);
        }
        setError(null);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load finance data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (loading && !fin) {
    return <p className="p-6 text-sm text-gray-400">Loading finance data…</p>;
  }

  /* No invented numbers. If the call failed there is nothing truthful to show. */
  if (error || !fin) {
    return (
      <div className="m-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">{error ?? "Finance data unavailable."}</p>
        <p className="mt-1 text-xs text-red-400/70">
          No figures are shown rather than placeholder ones.
        </p>
      </div>
    );
  }

  const summary = {
    labels:  ["Funded", "Released", "Disputed", "Refunded"],
    counts:  [fin.escrows.funded, fin.escrows.released, fin.escrows.disputed, fin.escrows.refunded],
    amounts: [fin.value.funded, fin.value.released, fin.value.disputed, fin.value.refunded],
  };

  return (
    <div className="space-y-6">
      <Section title="Financial Overview">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="Escrows"        value={String(fin.escrows.total)} />
          <MetricCard label="Released"       value={money(fin.value.released)} />
          <MetricCard label="Funded"         value={money(fin.value.funded)} />
          {/* Money taken from a client and neither released nor returned —
              the figure the old panel omitted entirely. */}
          <MetricCard label="Held"           value={money(fin.value.held)} />
          <MetricCard label="Held in dispute" value={money(fin.value.disputed)} />
          <MetricCard label="Wallets"        value={String(fin.wallets)} />
        </div>
      </Section>

      <Section title="Fund Distribution">
        <FundDistributionChart
          completed={fin.value.released}
          pending={fin.value.funded}
          available={fin.value.refunded}
          held={fin.value.disputed}
        />
      </Section>

      <Section title="Escrow Transactions">
        <EscrowBarChart summary={summary} />
        <EscrowTable
          transactions={rows.map((r) => ({
            id:      String(r._id).slice(-8),
            project: r.projectId ? String(r.projectId).slice(-8) : "—",
            date:    r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
            amount:  r.amount ?? 0,
            status:  TABLE_STATUS(r.status),
          }))}
        />
      </Section>
    </div>
  );
}
