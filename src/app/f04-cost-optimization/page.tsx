"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F04Page() {
  const config = MODULE_REGISTRY["F04"] ?? buildFallbackConfig("F04", "F-Series — Financial Intelligence", "Cost Optimization Engine");
  return (
    <DashboardTierGate pillar="F04 — Cost Optimization Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
