"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F03Page() {
  const config = MODULE_REGISTRY["F03"] ?? buildFallbackConfig("F03", "F-Series — Financial Intelligence", "Financial KPI Engine");
  return (
    <DashboardTierGate pillar="F03 — Financial KPI Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
