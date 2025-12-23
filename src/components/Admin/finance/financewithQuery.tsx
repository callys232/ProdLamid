"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Section from "./section";
import MetricCard from "./metricCard";
import FundDistributionChart from "./funddistrchat";
import EscrowBarChart from "./escrowChart";
import EscrowTable from "./escrowTable";

export default function FinanceAgent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-finance"],
    queryFn: async () => {
      const res = await fetch("/api/admin/finance", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch finance data");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const finance = data ?? {
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

      {isLoading && (
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
