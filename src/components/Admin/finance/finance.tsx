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

/* ---------- Fallback Mock ---------- */
const fallbackFinance: FinanceData = {
  totalProjects: 124,
  completedAmount: 275000,
  pendingAmount: 83000,
  availableAmount: 152000,
  heldAmount: 68000,
  escrowTransactions: [],
  escrowSummary: {
    labels: ["Held", "Released", "Pending"],
    counts: [2, 2, 1],
    amounts: [26000, 18300, 4500],
  },
};

export default function FinanceAgent() {
  const [finance, setFinance] = useState<FinanceData>(fallbackFinance);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/finance", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch finance data");
        const json = await res.json();
        setFinance(json);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setFinance(fallbackFinance); // fallback
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
            label="Total Projects"
            value={finance.totalProjects.toString()}
          />
          <MetricCard
            label="Completed Amount"
            value={`$${finance.completedAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Pending Amount"
            value={`$${finance.pendingAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Available Balance"
            value={`$${finance.availableAmount.toLocaleString()}`}
          />
          <MetricCard
            label="Held Balance"
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
        <p className="text-red-400 text-sm">
          Failed to load finance data. Showing fallback.
        </p>
      )}
    </div>
  );
}
