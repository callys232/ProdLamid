"use client";
import React, { useState, useEffect } from "react";
import Section from "./section";
import MetricCard from "./metricCard";
import FundDistributionChart from "./funddistrchat";
import EscrowBarChart from "./escrowChart";
import EscrowTable from "./escrowTable";

type FinanceData = {
  totalProjects: number;
  completedAmount: number;
  pendingAmount: number;
  availableAmount: number;
  heldAmount: number;
  escrowTransactions: any[];
  escrowSummary: {
    labels: string[];
    counts: number[];
    amounts: number[];
  };
};

/* Empty, not invented.
   This used to fall back to plausible-looking figures — 124 projects,
   $275,000 completed — whenever the fetch failed. An administrator had no way
   to tell fabricated money from real money, which is worse than showing
   nothing. Zeros plus a visible error is the honest failure state. */
const emptyFinance: FinanceData = {
  totalProjects: 0,
  completedAmount: 0,
  pendingAmount: 0,
  availableAmount: 0,
  heldAmount: 0,
  escrowTransactions: [],
  escrowSummary: { labels: [], counts: [], amounts: [] },
};

export default function FinanceAgent() {
  const [finance, setFinance] = useState<FinanceData>(emptyFinance);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/finance", { cache: "no-store", credentials: "include" });
        if (res.status === 403) throw new Error("Administrator access required.");
        if (!res.ok) throw new Error("Could not load finance data.");
        const json = await res.json();

        /* The API answers { success, data: { escrows, value, byStatus, wallets } }.
           This component stored that envelope directly and then read
           finance.totalProjects — undefined — so `.toLocaleString()` threw and
           the tab blew up on every SUCCESSFUL response. It only ever rendered
           when the request failed and the mock took over. */
        const d = json?.data ?? {};
        const escrows = d.escrows ?? {};
        const value   = d.value   ?? {};

        setFinance({
          totalProjects:   escrows.total ?? 0,
          completedAmount: value.released ?? 0,
          pendingAmount:   value.funded ?? 0,
          availableAmount: value.refunded ?? 0,
          // Money taken from a client and neither released nor returned.
          heldAmount:      value.held ?? 0,
          escrowTransactions: d.transactions ?? [],
          escrowSummary: {
            labels:  ["Funded", "Released", "Disputed", "Refunded"],
            counts:  [escrows.funded ?? 0, escrows.released ?? 0, escrows.disputed ?? 0, escrows.refunded ?? 0],
            amounts: [value.funded ?? 0, value.released ?? 0, value.disputed ?? 0, value.refunded ?? 0],
          },
        });
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setFinance(emptyFinance);   // never invented figures
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
    const interval = setInterval(fetchFinance, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Financial Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Escrows"
            value={finance.totalProjects.toString()}
          />
          <MetricCard
            label="Released"
            value={`$${finance.completedAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Funded (in escrow)"
            value={`$${finance.pendingAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Refunded"
            value={`$${finance.availableAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Held (funded + disputed)"
            value={`$${finance.heldAmount.toLocaleString()}`}
          />
        </div>
      </Section>

      <Section title="Fund Distribution">
        <FundDistributionChart
          completed={finance.completedAmount}
          pending={finance.pendingAmount}
          available={finance.availableAmount}
          held={finance.heldAmount}
        />
      </Section>

      <Section title="Escrow Transactions">
        <EscrowBarChart summary={finance.escrowSummary} />
        <EscrowTable transactions={finance.escrowTransactions} />
      </Section>

      {loading && (
        <p className="text-gray-400 text-sm">Loading finance data...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          {error} — figures below are not live.
        </p>
      )}
    </div>
  );
}
