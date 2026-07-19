"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F06Page() {
  const config = MODULE_REGISTRY["F06"] ?? buildFallbackConfig("F06", "F-Series — Financial Intelligence", "Financial Governance Engine");
  return (
    <DashboardTierGate pillar="F06 — Financial Governance Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
