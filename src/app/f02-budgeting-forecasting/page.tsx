"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import BudgetEngine from "@/components/lamidOne/BudgetEngine";

export default function F02Page() {
  return (
    <DashboardTierGate pillar="Budgeting & Forecasting Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <BudgetEngine />
    </DashboardTierGate>
  );
}
