"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F03Page() {
  const config = MODULE_REGISTRY["F03"] ?? buildFallbackConfig("F03", "F-Series — Financial Intelligence", "Financial KPI Linkage Diagnostic");
  return (
    <DashboardTierGate pillar="F03 — Financial KPI Linkage Diagnostic" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
