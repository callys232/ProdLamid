"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F02Page() {
  const config = MODULE_REGISTRY["F02"] ?? buildFallbackConfig("F02", "F-Series — Financial Intelligence", "Budgeting & Forecasting Engine");
  return (
    <DashboardTierGate pillar="F02 — Budgeting & Forecasting Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
